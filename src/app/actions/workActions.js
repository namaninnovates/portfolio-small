'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { v2 as cloudinary } from 'cloudinary'

// Configure cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function getCloudinarySignature() {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: 'portfolio', source: 'uw' },
    process.env.CLOUDINARY_API_SECRET
  )
  
  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
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

    await prisma.work.create({ data })
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

    await prisma.work.update({
      where: { id },
      data
    })
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
    await prisma.work.delete({ where: { id } })
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
      await prisma.work.update({
        where: { id: orderedIds[i] },
        data: { order: i }
      })
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
