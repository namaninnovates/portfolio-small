export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://namangupta.vercel.app' // Update this to your actual production domain

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/admin/login/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
