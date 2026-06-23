import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Work from '@/components/Work'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function WorksPage() {
  const works = await prisma.work.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
  })

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
