// src/app/gallery/[category]/page.tsx
import { Metadata } from 'next';
import GalleryClient from './GalleryClient';

type Props = {
  params: { category: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryName = params.category.replace(/-/g, " ");
  const capitalized = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return {
    title: `${capitalized} Gallery | INSEES`,
    description: `View photos from the ${capitalized} event at NIT Silchar.`,
    openGraph: {
      images: ['/image.png'],
    },
  };
}

export default function GalleryCategoryPage({ params }: Props) {
  return <GalleryClient category={params.category} />;
}