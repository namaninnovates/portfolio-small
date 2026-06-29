'use server'

import { db } from '@/lib/db'
import { enquiries } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { verifyAdmin } from '@/lib/auth'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Public action — no auth required, but validated & sanitized.
 */
export async function createEnquiry(formData) {
  try {
    const name = formData.get('name')?.trim()
    const email = formData.get('email')?.trim()
    const phone = formData.get('phone')?.trim() || null
    const projectType = formData.get('projectType')?.trim()
    const budget = formData.get('budget')?.trim()
    const description = formData.get('description')?.trim()

    // Required field checks
    if (!name || !email || !projectType || !budget || !description) {
      return { error: 'All required fields must be filled.' }
    }

    // Email format validation
    if (!EMAIL_REGEX.test(email)) {
      return { error: 'Please enter a valid email address.' }
    }

    // Length limits to prevent abuse
    if (name.length > 200) {
      return { error: 'Name is too long (max 200 characters).' }
    }
    if (description.length > 5000) {
      return { error: 'Description is too long (max 5000 characters).' }
    }
    if (email.length > 320) {
      return { error: 'Email address is too long.' }
    }

    // Honeypot check — if the hidden field has a value, it's a bot
    const honeypot = formData.get('website')
    if (honeypot) {
      // Silently succeed so bots think they submitted
      return { success: true }
    }

    const data = { name, email, phone, projectType, budget, description }

    await db.insert(enquiries).values(data)
    
    try {
      await fetch('https://formsubmit.co/ajax/naman.innovates@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          _subject: `New Portfolio Enquiry: ${data.projectType}`,
          message: `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}
Project Type: ${data.projectType}
Budget: ${data.budget}

Description:
${data.description}
          `
        })
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to submit enquiry:', error)
    return { error: 'Failed to submit your enquiry. Please try again later.' }
  }
}

/**
 * Admin-only action — requires valid session.
 */
export async function deleteEnquiry(id) {
  await verifyAdmin()

  try {
    await db.delete(enquiries).where(eq(enquiries.id, id))
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete enquiry:', error)
    return { error: 'Failed to delete enquiry' }
  }
}
