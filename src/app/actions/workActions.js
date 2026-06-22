'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createWork(formData) {
  try {
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      imageUrl: formData.get('imageUrl'),
      tags: formData.get('tags'),
      projectUrl: formData.get('projectUrl') || null,
      liveUrl: formData.get('liveUrl') || null,
      tools: formData.get('tools'),
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
      imageUrl: formData.get('imageUrl'),
      tags: formData.get('tags'),
      projectUrl: formData.get('projectUrl') || null,
      liveUrl: formData.get('liveUrl') || null,
      tools: formData.get('tools'),
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
