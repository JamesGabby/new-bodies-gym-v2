// src/app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://newbodiesgym.co.uk';
  
  const staticPages = [
    '',
    '/about',
    '/facilities',
    '/timetable',
    '/membership',
    '/contact',
    '/login',
    '/signup',
  ];

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return staticRoutes;
}