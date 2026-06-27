'use server'

import { db } from '@/lib/db'
import { works } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { r2Client } from '@/lib/r2'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function getUploadPresignedUrl(filename, contentType) {
  try {
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
  try {
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      tags: formData.get('tags'),
      projectUrl: formData.get('projectUrl') || null,
      liveUrl: formData.get('liveUrl') || null,
      tools: formData.get('tools'),
      imageUrl: formData.get('imageUrl') || '',
      mediaType: formData.get('mediaType') || 'image',
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
  try {
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      tags: formData.get('tags'),
      projectUrl: formData.get('projectUrl') || null,
      liveUrl: formData.get('liveUrl') || null,
      tools: formData.get('tools'),
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
