import { prisma } from '@/lib/prisma'
import AdminClient from './AdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const works = await prisma.work.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return <AdminClient initialWorks={works} initialEnquiries={enquiries} />
}
