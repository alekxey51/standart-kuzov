import React from 'react';
import { Helmet } from 'react-helmet-async';
import companyData from '../data/config.json';

export const SeoMarkup = ({ seoData }) => {
  const { COMPANY_INFO, CONTACT_INFO, SOCIAL_LINKS } = companyData;

  // Формируем title и description с геопривязкой
  const title = seoData.title.includes('Минск') ? seoData.title : `${seoData.title} в Минске | ${COMPANY_INFO.companyName}`;
  const description = seoData.description.includes('Минск') ? seoData.description : `${seoData.description} в Минске. ${COMPANY_INFO.companyName} - профессиональный кузовной ремонт и покраска автомобилей.`;

  // Основная Schema.org разметка
  const mainSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": `${COMPANY_INFO.companyName}`,
    "image": `${COMPANY_INFO.siteUrl}/images/kuzovnoy-remont.jpg`,
    "logo": `${COMPANY_INFO.siteUrl}/images/logo.svg.png`,
    "description": `${COMPANY_INFO.description} от ${COMPANY_INFO.companyName}`,
    "url": COMPANY_INFO.siteUrl,
    "areaServed": {
      "@type": "City",
      "name": "Минск",
      "sameAs": "https://www.wikidata.org/wiki/Q2280"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Услуги по ремонту и покраске автомобилей в Минске",
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": CONTACT_INFO.address.split(', ')[1],
      "addressLocality": "Минск",
      "addressCountry": "Belarus",
      "addressRegion":"BY"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": CONTACT_INFO.coordinates.lat,
      "longitude": CONTACT_INFO.coordinates.lng
    },
    "telephone": CONTACT_INFO.phones.map(phone => phone.number),
    "email": CONTACT_INFO.email,
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": CONTACT_INFO.workHours.weekdays.substring(6,10),
        "closes": CONTACT_INFO.workHours.weekdays.substring(11)
      },
    ]
  };

  // BreadcrumbList разметка
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": seoData.breadcrumbName,
      "item": `${COMPANY_INFO.siteUrl}/${seoData.canonicalUrl}`
    }]
  };

  return (
    <>
      {/* SEO-метатеги с геопривязкой */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`${seoData.keywords}, Минск, кузовной ремонт Минск, покраска авто Минск`} />
        <link rel="canonical" href={seoData.canonicalUrl} />
        
        {/* OpenGraph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={seoData.canonicalUrl} />
        <meta property="og:url" content={`${COMPANY_INFO.siteUrl}/${seoData.canonicalUrl}`} />
        <meta property="og:image" content={seoData.image || `${COMPANY_INFO.siteUrl}/images/kuzovnoy-remont.jpg`} />
        <meta property="og:site_name" content={`${COMPANY_INFO.companyName} - кузовной ремонт в Минске`} />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:region" content="BY-MI" />
        <meta property="og:country-name" content="Belarus" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={seoData.image || `${COMPANY_INFO.siteUrl}/images/twitter-card-minsk.jpg`} />
        
        {/* Дополнительные метатеги */}
        <meta name="robots" content={seoData.robots || "index, follow"} />
        <meta name="author" content={COMPANY_INFO.companyName} />
        <meta name="copyright" content={COMPANY_INFO.companyName} />
        <meta name="geo.region" content="BY-MI" />
        <meta name="geo.placename" content="Минск" />
        <meta name="geo.position" content={`${CONTACT_INFO.coordinates.lat};${CONTACT_INFO.coordinates.lng}`} />
        <meta name="ICBM" content={`${CONTACT_INFO.coordinates.lat}, ${CONTACT_INFO.coordinates.lng}`} />
      </Helmet>

      {/* Schema.org разметка с красивым форматированием */}
      <script type="application/ld+json">
        {JSON.stringify(mainSchema, null, 2)}
      </script>

      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema, null, 2)}
      </script>
    </>
  );
};