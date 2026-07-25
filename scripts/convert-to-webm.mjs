/**
 * Video to WebM Conversion Script
 * 
 * Fetches all video works from the database, downloads them, converts to
 * WebM (VP9/Opus) using ffmpeg for small file sizes and smooth streaming,
 * uploads the WebM back to Cloudflare R2, and updates the DB record.
 *
 * Usage: node scripts/convert-to-webm.mjs
 *        node scripts/convert-to-webm.mjs --dry-run  (preview only, no changes)
 *        node scripts/convert-to-webm.mjs --id <workId> (convert a single work)
 */

import { spawn } from 'child_process';
import { createWriteStream, existsSync, mkdirSync, unlinkSync, readFileSync } from 'fs';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

// Load .env manually since this is a plain Node.js script
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const envPath = join(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim().replace(/^"(.*)"$/, '$1');
  // Don't override DATABASE_URL if it was passed from outside (prod DB)
  if (key === 'DATABASE_URL' && process.env.DATABASE_URL) continue;
  process.env[key] ??= val;
}

// --- Dynamic imports (after env is loaded) ---
const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
const { neon } = await import('@neondatabase/serverless');

// --- Config ---
const DRY_RUN = process.argv.includes('--dry-run');
const REMAINING = process.argv.includes('--remaining'); // convert non-webm only
const SINGLE_ID = (() => {
  const idx = process.argv.indexOf('--id');
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

const TMP_DIR = join(__dirname, '..', '.tmp-webm');
if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });

// R2 client
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME;
const PUBLIC_BASE = process.env.R2_PUBLIC_URL.replace(/\/$/, '');

// DB
const sql = neon(process.env.DATABASE_URL);

// ---------- helpers ----------

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function downloadFromR2(key, dest) {
  const { GetObjectCommand } = await import('@aws-sdk/client-s3');
  const { Readable } = await import('stream');
  const { createWriteStream } = await import('fs');
  const res = await r2.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const body = res.Body;
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    body.pipe(file);
    file.on('finish', () => file.close(resolve));
    file.on('error', reject);
  });
}

function convertToWebm(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    // VP9 + Opus. CRF 35 = ~0.5-1 MB/min of 720p — perfect for web previews.
    const args = [
      '-y',
      '-i', inputPath,
      '-c:v', 'libvpx-vp9',
      '-crf', '35',           // Quality: 0 (best) – 63 (worst). 35 = great quality, small size
      '-b:v', '0',            // CRF mode (disable VBR target)
      '-deadline', 'good',    // good = balance speed/quality
      '-cpu-used', '2',       // 0–5; lower = slower but better
      '-row-mt', '1',         // Parallel encoding rows (faster on multicore)
      '-vf', 'scale=\'min(1280,iw)\':-2',  // Cap at 1280px wide, keep aspect ratio
      '-c:a', 'libopus',
      '-b:a', '64k',          // Opus audio at 64kbps (very good quality)
      '-ac', '2',
      outputPath,
    ];
    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', (d) => { stderr += d; process.stdout.write('.'); });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg failed (code ${code}):\n${stderr.slice(-2000)}`));
    });
  });
}

async function uploadToR2(filePath, key, size) {
  const body = readFileSync(filePath);
  await r2.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: 'video/webm',
  }));
  console.log(`  ✅ Uploaded ${key} (${formatBytes(size)})`);
  return `${PUBLIC_BASE}/${key}`;
}

async function cleanUp(...files) {
  for (const f of files) {
    try { if (existsSync(f)) unlinkSync(f); } catch {}
  }
}

// ---------- main ----------

async function main() {
  console.log('\n🎬 WebM Conversion Script');
  console.log('═══════════════════════════════════════');
  console.log(`🔗 DB: ${process.env.DATABASE_URL.slice(0, 45)}...`);
  if (DRY_RUN) console.log('⚠️  DRY RUN — no files will be changed\n');

  // Fetch videos from DB
  let rows;
  if (SINGLE_ID) {
    rows = await sql`SELECT id, title, "imageUrl", "mediaType" FROM "Work" WHERE id = ${SINGLE_ID}`;
  } else if (REMAINING) {
    // Only grab videos NOT yet converted to webm
    rows = await sql`SELECT id, title, "imageUrl", "mediaType" FROM "Work" WHERE "mediaType" = 'video' AND "imageUrl" NOT LIKE '%.webm%' ORDER BY "order" ASC`;
  } else {
    rows = await sql`SELECT id, title, "imageUrl", "mediaType" FROM "Work" WHERE "mediaType" = 'video' ORDER BY "order" ASC`;
  }

  const videos = rows.filter(r => r.mediaType === 'video');
  console.log(`Found ${videos.length} video(s) to process.\n`);

  let converted = 0, skipped = 0, failed = 0;

  for (const work of videos) {
    // Strip only position/trim fragment params from URL
    const fullUrl = work.imageUrl;
    const urlWithoutPos = fullUrl.split('#pos=')[0];
    const urlWithoutTrim = urlWithoutPos.split('#t=')[0];
    // The full object key may include ;codecs=avc1 — keep it for the download URL
    const rawUrl = urlWithoutTrim;
    const suffix = fullUrl.includes('#') ? '#' + fullUrl.split('#').slice(1).join('#') : '';

    // Skip if already WebM (check the part before any ;codecs)
    const urlBase = rawUrl.split(';')[0].toLowerCase().split('?')[0];
    if (urlBase.endsWith('.webm')) {
      console.log(`⏭  [${work.title}] already WebM — skipping`);
      skipped++;
      continue;
    }

    console.log(`\n🔄 [${work.title}]`);
    console.log(`   Source: ${rawUrl}`);

    if (DRY_RUN) { skipped++; continue; }

    const ext = extname(rawUrl.split(';')[0].split('?')[0]) || '.mp4';
    const tmpInput = join(TMP_DIR, `${work.id}-input${ext}`);
    const tmpOutput = join(TMP_DIR, `${work.id}-output.webm`);

    try {
      // 1. Download from R2 via S3 API (handles special chars in key like ;codecs=avc1)
      const r2Key = rawUrl.replace(PUBLIC_BASE + '/', '');
      process.stdout.write('  ⬇️  Downloading from R2');
      await downloadFromR2(r2Key, tmpInput);
      const inputSize = readFileSync(tmpInput).length;
      console.log(` — ${formatBytes(inputSize)}`);

      // 2. Convert
      process.stdout.write('  🔧 Converting (ffmpeg)');
      await convertToWebm(tmpInput, tmpOutput);
      const outputSize = readFileSync(tmpOutput).length;
      const savings = ((1 - outputSize / inputSize) * 100).toFixed(1);
      console.log(`\n  📦 ${formatBytes(inputSize)} → ${formatBytes(outputSize)} (${savings}% smaller)`);

      // Build the new R2 key: strip the ;codecs=... part, swap extension to .webm
      // rawUrl = full URL with ;codecs, e.g. https://.../portfolio/xxx.mp4;codecs=avc1
      const urlBaseClean = rawUrl.replace(PUBLIC_BASE + '/', '').split(';')[0];
      const keyDir = urlBaseClean.includes('/') ? urlBaseClean.split('/').slice(0, -1).join('/') + '/' : '';
      const baseName = basename(urlBaseClean.split('?')[0], extname(urlBaseClean.split('?')[0]));
      const newKey = `${keyDir}${baseName}.webm`;

      // 4. Upload
      const newPublicUrl = await uploadToR2(tmpOutput, newKey, outputSize);

      // 5. Update DB (preserve suffix like #t=... and #pos=...)
      const newImageUrl = newPublicUrl + suffix;
      await sql`UPDATE "Work" SET "imageUrl" = ${newImageUrl}, "updatedAt" = NOW() WHERE id = ${work.id}`;
      console.log(`  📝 DB updated → ${newImageUrl}`);

      converted++;
    } catch (err) {
      console.error(`\n  ❌ Error processing [${work.title}]: ${err.message}`);
      failed++;
    } finally {
      await cleanUp(tmpInput, tmpOutput);
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log(`✅ Converted : ${converted}`);
  console.log(`⏭  Skipped   : ${skipped}`);
  console.log(`❌ Failed    : ${failed}`);
  console.log('\n🎉 Done! Redeploy or hard-refresh your site to see the changes.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
