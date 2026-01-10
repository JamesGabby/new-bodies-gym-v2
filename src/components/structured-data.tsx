// src/components/structured-data.tsx
export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HealthClub',
    name: 'New Bodies Gym',
    description: 'New Bodies Gym in Buxton - where everyone is welcome. Full gym facilities, group classes, personal training, and more.',
    url: 'https://newbodiesgym.co.uk',
    telephone: '+441298720006',
    email: 'newbodiesgym@hotmail.co.uk',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Unit 6, Tongue Lane Ind. Estate',
      addressLocality: 'Buxton',
      postalCode: 'SK17 7LF',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 53.2617,
      longitude: -1.9114,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '06:00',
        closes: '21:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '06:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '09:00',
        closes: '15:00',
      },
    ],
    priceRange: '££',
    image: 'https://newbodiesgym.co.uk/images/og-image.jpg',
    sameAs: [
      'https://facebook.com/newbodiesgym',
      'https://instagram.com/newbodiesgym',
    ],
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Free Parking', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Showers', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Lockers', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Personal Training', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Group Classes', value: true },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function EventSchema({ 
  name, 
  description, 
  startDate, 
  endDate, 
  location 
}: { 
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name,
    description,
    startDate,
    endDate,
    location: {
      '@type': 'Place',
      name: 'New Bodies Gym',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Unit 6, Tongue Lane Ind. Estate',
        addressLocality: 'Buxton',
        postalCode: 'SK17 7LF',
        addressCountry: 'GB',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'New Bodies Gym',
      url: 'https://newbodiesgym.co.uk',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}