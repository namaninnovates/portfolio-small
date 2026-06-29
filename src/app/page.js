import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import nextDynamic from 'next/dynamic'

const Marquee = nextDynamic(() => import('@/components/Marquee'))
const Stats = nextDynamic(() => import('@/components/Stats'))
const Work = nextDynamic(() => import('@/components/Work'))
const Testimonials = nextDynamic(() => import('@/components/Testimonials'))
const Footer = nextDynamic(() => import('@/components/Footer'))
import { db } from '@/lib/db'
import { works as worksSchema } from '@/db/schema'
import { asc, desc } from 'drizzle-orm'

export const revalidate = 60

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
