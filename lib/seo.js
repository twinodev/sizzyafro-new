export function organizationSchema({
  name = 'Dance With Sizzy Afro',
  url = 'https://example.com',
  logo
} = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo
  }
}

export function eventSchema({
  name,
  startDate,
  endDate,
  location,
  image,
  description,
  url
} = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    startDate,
    endDate,
    location,
    image,
    description,
    url
  }
}

export function personSchema({ name, role, image, sameAs } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: role,
    image,
    sameAs
  }
}

export function productSchema({ name, description, image, offers } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    offers
  }
}
