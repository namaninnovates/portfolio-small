import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Stats from '@/components/Stats'
import Work from '@/components/Work'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const works = await prisma.work.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Stats />
      <Work works={works} />
      <Footer />
    </>
  )
}
