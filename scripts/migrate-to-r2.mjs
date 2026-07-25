/**
 * Production DB Migration: Cloudinary → R2 WebM
 *
 * Updates all video works in the production database to use
 * the pre-converted R2 WebM URLs instead of Cloudinary.
 *
 * Usage:
 *   DATABASE_URL="postgresql://prod-db-url" node scripts/migrate-to-r2.mjs
 *
 * The DATABASE_URL env var OVERRIDES what's in .env, so it targets production.
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env for fallback values (R2 creds, etc.) but NOT DATABASE_URL
// DATABASE_URL must be passed in as an env var to target production
const envPath = join(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  if (key === 'DATABASE_URL') continue; // never override — must come from CLI env
  const val = trimmed.slice(eqIdx + 1).trim().replace(/^"(.*)"$/, '$1');
  process.env[key] ??= val;
}

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Pass it inline:');
  console.error('   DATABASE_URL="postgresql://..." node scripts/migrate-to-r2.mjs');
  process.exit(1);
}

const { neon } = await import('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

// R2 WebM URLs from our converted local DB (source of truth)
const R2_WEBM_URLS = [
  { title: 'AFTERMOVIE',                 imageUrl: 'https://pub-29dd5871a0e141ccb0aa09cd412eff3a.r2.dev/portfolio/1782565856981-cmqps83i20000kz04w1pase2h.webm#pos=50,50,178' },
  { title: 'Brand campaign',             imageUrl: 'https://pub-29dd5871a0e141ccb0aa09cd412eff3a.r2.dev/portfolio/1782565897542-cmqptk8g80000l204mj6ckj6t.webm#pos=50,43,180' },
  { title: 'AI Based Teaser',            imageUrl: 'https://pub-29dd5871a0e141ccb0aa09cd412eff3a.r2.dev/portfolio/1782565913117-cmqpsj0wm0000js04ho90mp7v.webm#pos=50,50,183' },
  { title: 'MOTION FLOW EDIT',           imageUrl: 'https://pub-29dd5871a0e141ccb0aa09cd412eff3a.r2.dev/portfolio/1782565949066-cmqpv94pw0000js04y3plamoa.webm#pos=50,44,183' },
  { title: 'Brand Campaign',             imageUrl: 'https://pub-29dd5871a0e141ccb0aa09cd412eff3a.r2.dev/portfolio/1782565969329-cmqpsonot0001js04fuysp2pc.webm#pos=50,33,180' },
  { title: 'Promotional teaser',         imageUrl: 'https://pub-29dd5871a0e141ccb0aa09cd412eff3a.r2.dev/portfolio/1782565776749-cmqpv54h30000l704fkvet0rl.webm#pos=50,50,177' },
  { title: 'GEN-AI BASED INFLUENCER EDIT', imageUrl: 'https://pub-29dd5871a0e141ccb0aa09cd412eff3a.r2.dev/portfolio/1782565788335-cmqpsx5bo0002js04bl3t4ppq.webm#pos=50,57,180' },
  { title: 'Paced brand promotional',    imageUrl: 'https://pub-29dd5871a0e141ccb0aa09cd412eff3a.r2.dev/portfolio/1782565805117-cmqpupjen0003l204ztmbol4a.webm#pos=50,40,183' },
  { title: 'GEN-AI PROMOTIONAL',         imageUrl: 'https://pub-29dd5871a0e141ccb0aa09cd412eff3a.r2.dev/portfolio/1782565825757-cmqpujq130002l204npjus8rf.webm#pos=50,46,183' },
  { title: 'Speedramp edit',             imageUrl: 'https://pub-29dd5871a0e141ccb0aa09cd412eff3a.r2.dev/portfolio/1782565882512-cmqpu83zt0000l204on9e5acr.webm#pos=50,42,183' },
  { title: 'fast paced model edit',      imageUrl: 'https://pub-29dd5871a0e141ccb0aa09cd412eff3a.r2.dev/portfolio/1782565929841-cmqptyzta0000jv048nfmhdwn.webm#pos=50,31,180' },
  { title: 'BMW GEN-AI Teaser ',         imageUrl: 'https://pub-29dd5871a0e141ccb0aa09cd412eff3a.r2.dev/portfolio/1782565941097-cmqpubs3g0001l204sd0bdddw.webm#pos=50,50,179' },
];

async function main() {
  console.log('\n🔄 Production DB Migration: Cloudinary → R2 WebM');
  console.log('═══════════════════════════════════════');
  console.log(`🔗 DB: ${process.env.DATABASE_URL.slice(0, 40)}...`);

  // First, preview what's currently in the production DB
  const current = await sql`SELECT id, title, "imageUrl", "mediaType" FROM "Work" WHERE "mediaType" = 'video'`;
  console.log(`\nFound ${current.length} video(s) in production DB.\n`);

  let updated = 0, skipped = 0, notFound = 0;

  for (const mapping of R2_WEBM_URLS) {
    const match = current.find(r => r.title === mapping.title);

    if (!match) {
      console.log(`⚠️  Not found in prod DB: "${mapping.title}"`);
      notFound++;
      continue;
    }

    if (match.imageUrl === mapping.imageUrl) {
      console.log(`⏭  Already R2: ${mapping.title}`);
      skipped++;
      continue;
    }

    const wasCloudinary = match.imageUrl.includes('cloudinary');
    await sql`UPDATE "Work" SET "imageUrl" = ${mapping.imageUrl}, "updatedAt" = NOW() WHERE id = ${match.id}`;
    console.log(`✅ ${mapping.title}`);
    console.log(`   ${wasCloudinary ? '☁️  Cloudinary' : '📦 Old'} → R2 WebM`);
    updated++;
  }

  console.log('\n═══════════════════════════════════════');
  console.log(`✅ Updated   : ${updated}`);
  console.log(`⏭  Skipped   : ${skipped}`);
  console.log(`⚠️  Not found : ${notFound}`);
  console.log('\n🎉 Done! The production site will serve R2 WebM videos within 60 seconds.');
  console.log('   Force it immediately by triggering a Vercel redeploy.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
