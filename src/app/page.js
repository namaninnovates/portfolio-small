import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Stats from '@/components/Stats'
import Work from '@/components/Work'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
import { db } from '@/lib/db'
import { works as worksSchema } from '@/db/schema'
import { asc, desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const works = await db
    .select()
    .from(worksSchema)
    .orderBy(asc(worksSchema.order), desc(worksSchema.createdAt))
    .limit(12)

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
