import Head from 'next/head'

export default function SEO({
  title,
  description,
  url,
  image,
  type = 'website',
  structuredData
}) {
  const siteName = 'Dance With Sizzy Afro'

  return (
    <Head>
      <title>{title ? `${title} — ${siteName}` : siteName}</title>
      <meta name="description" content={description || 'Youth-focused dance community: training, events, and mentorship.'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title || siteName} />
      <meta property="og:description" content={description || ''} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title || siteName} />
      <meta name="twitter:description" content={description || ''} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Structured data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  )
}
