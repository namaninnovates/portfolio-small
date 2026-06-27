import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env files manually
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env.vercel.prod') });

const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL or NEON_DATABASE_URL is missing.");
  process.exit(1);
}

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '');

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
  console.error("Missing R2 environment variables.");
  process.exit(1);
}

const sql = neon(dbUrl);

// Relative import to the schema to ensure it works as a standalone script
import { works } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';

const db = drizzle(sql, { schema: { works } });

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const STATE_FILE = path.join(__dirname, '../migration_state.json');

async function migrate() {
  console.log("Starting migration from Cloudinary to R2...");
  
  let state = {};
  if (fs.existsSync(STATE_FILE)) {
    state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  }

  // Fetch all works
  const allWorks = await db.select().from(works);
  console.log(`Found ${allWorks.length} total works in database.`);

  for (const work of allWorks) {
    if (!work.imageUrl.includes('cloudinary.com')) {
      console.log(`[SKIP] Work "${work.title}" (${work.id}) is not on Cloudinary.`);
      continue;
    }

    if (state[work.id] === 'COMPLETED') {
      console.log(`[SKIP] Work "${work.title}" (${work.id}) already migrated.`);
      continue;
    }

    console.log(`\n[PROCESS] Migrating "${work.title}" (${work.id})...`);

    try {
      // Parse URL and Hash
      const urlParts = work.imageUrl.split('#pos=');
      let originalUrl = urlParts[0];
      const posHash = urlParts[1] ? `#pos=${urlParts[1]}` : '';
      
      const tParts = originalUrl.split('#t=');
      const downloadUrl = tParts[0];
      const tHash = tParts[1] ? `#t=${tParts[1]}` : '';

      console.log(`  Downloading from: ${downloadUrl}`);
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download from Cloudinary: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const extension = contentType.split('/')[1] || (work.mediaType === 'video' ? 'mp4' : 'jpg');
      const newKey = `portfolio/${Date.now()}-${work.id}.${extension}`;

      console.log(`  Uploading to R2 as: ${newKey} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
      
      await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: newKey,
        Body: buffer,
        ContentType: contentType,
      }));

      const newBaseUrl = `${publicUrl}/${newKey}`;
      const newFinalUrl = `${newBaseUrl}${tHash}${posHash}`;

      console.log(`  Updating database with new URL: ${newFinalUrl}`);
      await db.update(works)
        .set({ imageUrl: newFinalUrl })
        .where(eq(works.id, work.id));

      state[work.id] = 'COMPLETED';
      fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

      console.log(`  ✅ Successfully migrated "${work.title}"`);
    } catch (err) {
      console.error(`  ❌ Error migrating "${work.title}":`, err);
      state[work.id] = `ERROR: ${err.message}`;
      fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
    }
  }

  console.log("\nMigration script finished.");
}

migrate().catch(console.error);
