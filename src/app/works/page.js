import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Work from '@/components/Work'
import { db } from '@/lib/db'
import { works as worksSchema } from '@/db/schema'
import { asc, desc } from 'drizzle-orm'

export const revalidate = 60

export const metadata = {
  title: 'Works | IAMNAMANG',
  description: 'Explore my portfolio — web development, video editing, and UI/UX design projects.',
  openGraph: {
    title: 'Works | IAMNAMANG',
    description: 'Explore my portfolio — web development, video editing, and UI/UX design projects.',
  },
}

export default async function WorksPage() {
  const works = await db
    .select()
    .from(worksSchema)
    .orderBy(asc(worksSchema.order), desc(worksSchema.createdAt))

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <Work works={works} title="ALL" showViewAll={false} enableVideoPopup={true} variant="dark" />
      </div>
      <Footer />
    </main>
  )
}
