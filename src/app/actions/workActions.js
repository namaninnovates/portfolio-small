'use server'

import { db } from '@/lib/db'
import { works } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { r2Client } from '@/lib/r2'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { verifyAdmin } from '@/lib/auth'

const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]

export async function getUploadPresignedUrl(filename, contentType) {
  await verifyAdmin()

  try {
    // Validate file type
    if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
      return { success: false, error: `Unsupported file type: ${contentType}` }
    }

    const key = `portfolio/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });
    
    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    // Remove trailing slash from public URL if present to ensure proper formatting
    const baseUrl = process.env.R2_PUBLIC_URL.replace(/\/$/, '');
    const publicUrl = `${baseUrl}/${key}`;

    return { success: true, signedUrl, publicUrl };
  } catch (error) {
    console.error('Failed to generate presigned URL:', error);
    return { success: false, error: 'Failed to generate upload URL' };
  }
}

export async function createWork(formData) {
  await verifyAdmin()

  try {
    const data = {
      title: formData.get('title')?.trim(),
      description: formData.get('description')?.trim(),
      tags: formData.get('tags')?.trim(),
      projectUrl: formData.get('projectUrl')?.trim() || null,
      liveUrl: formData.get('liveUrl')?.trim() || null,
      tools: formData.get('tools')?.trim(),
      imageUrl: formData.get('imageUrl') || '',
      mediaType: formData.get('mediaType') || 'image',
    }

    if (!data.title || !data.description || !data.tags || !data.tools) {
      return { error: 'Title, description, tags, and tools are required' }
    }

    await db.insert(works).values(data)
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to create work:', error)
    return { error: 'Failed to create work' }
  }
}

export async function updateWork(id, formData) {
  await verifyAdmin()

  try {
    const data = {
      title: formData.get('title')?.trim(),
      description: formData.get('description')?.trim(),
      tags: formData.get('tags')?.trim(),
      projectUrl: formData.get('projectUrl')?.trim() || null,
      liveUrl: formData.get('liveUrl')?.trim() || null,
      tools: formData.get('tools')?.trim(),
    }

    const imageUrl = formData.get('imageUrl')
    if (imageUrl) {
      data.imageUrl = imageUrl
      data.mediaType = formData.get('mediaType') || 'image'
    } else {
      data.imageUrl = formData.get('existingImageUrl') || ''
      data.mediaType = formData.get('existingMediaType') || 'image'
    }

    await db.update(works).set(data).where(eq(works.id, id))
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to update work:', error)
    return { error: 'Failed to update work' }
  }
}

export async function deleteWork(id) {
  await verifyAdmin()

  try {
    await db.delete(works).where(eq(works.id, id))
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete work:', error)
    return { error: 'Failed to delete work' }
  }
}

export async function updateWorksOrder(orderedIds) {
  await verifyAdmin()

  try {
    for (let i = 0; i < orderedIds.length; i++) {
      await db.update(works).set({ order: i }).where(eq(works.id, orderedIds[i]))
    }
    revalidatePath('/')
    revalidatePath('/works')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to update order:', error)
    return { error: 'Failed to update order' }
  }
}
