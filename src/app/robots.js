export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.iamnamang.in'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/admin/login/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
