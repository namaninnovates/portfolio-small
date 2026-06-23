import { db } from '@/lib/db'
import { works as worksSchema, enquiries as enquiriesSchema } from '@/db/schema'
import { asc, desc } from 'drizzle-orm'
import AdminClient from './AdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const works = await db
    .select()
    .from(worksSchema)
    .orderBy(asc(worksSchema.order), desc(worksSchema.createdAt))
  
  const enquiries = await db
    .select()
    .from(enquiriesSchema)
    .orderBy(desc(enquiriesSchema.createdAt))

  return <AdminClient initialWorks={works} initialEnquiries={enquiries} />
}
