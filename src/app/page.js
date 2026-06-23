import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Stats from '@/components/Stats'
import Work from '@/components/Work'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const works = await prisma.work.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    take: 12
  })

  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Stats />
      <Work works={works} title="SELECTED" showViewAll={true} />
      <Testimonials />
      <Footer />
    </>
  )
}
