'use server'

import { db } from '@/lib/db'
import { enquiries } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import nodemailer from 'nodemailer'

export async function createEnquiry(formData) {
  try {
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || null,
      projectType: formData.get('projectType'),
      budget: formData.get('budget'),
      description: formData.get('description'),
    }

    if (!data.name || !data.email || !data.projectType || !data.budget || !data.description) {
      return { error: 'All fields are required.' }
    }

    await db.insert(enquiries).values(data)
    
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })

      // Email to Admin (You)
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Enquiry from ${data.name} - ${data.projectType}`,
        html: `
          <h2>New Project Enquiry</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
          <p><strong>Project Type:</strong> ${data.projectType}</p>
          <p><strong>Budget:</strong> ${data.budget}</p>
          <h3>Description:</h3>
          <p>${data.description}</p>
        `,
      })

      // Confirmation Email to the Client
      await transporter.sendMail({
        from: `"Naman Gupta" <${process.env.EMAIL_USER}>`,
        to: data.email,
        subject: `Thanks for reaching out, ${data.name}!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hi ${data.name},</h2>
            <p>Thank you for reaching out! I've received your enquiry regarding your <strong>${data.projectType}</strong> project.</p>
            <p>Here is a quick summary of what you submitted:</p>
            <ul>
              <li><strong>Project Type:</strong> ${data.projectType}</li>
              <li><strong>Budget:</strong> ${data.budget}</li>
            </ul>
            <p>I will review your requirements and get back to you ASAP.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>Naman Gupta</strong></p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send emails:', emailError)
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to submit enquiry:', error)
    return { error: 'Failed to submit your enquiry. Please try again later.' }
  }
}

export async function deleteEnquiry(id) {
  try {
    await db.delete(enquiries).where(eq(enquiries.id, id))
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete enquiry:', error)
    return { error: 'Failed to delete enquiry' }
  }
}
