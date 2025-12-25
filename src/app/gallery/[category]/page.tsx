// src/app/gallery/[category]/page.tsx
import { Metadata } from 'next';
import GalleryClient from './GalleryClient';

type Props = {
  params: Promise<{ category: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params; // 👈 Await params here
  const categoryName = category.replace(/-/g, " ");
  const capitalized = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return {
    title: `${capitalized} Gallery | INSEES`,
    description: `View photos from the ${capitalized} event at NIT Silchar.`,
    openGraph: {
      images: ['/image.png'],
    },
  };
}

export default async function GalleryCategoryPage({ params }: Props) {
  const { category } = await params; // 👈 Await params here
  return <GalleryClient category={category} />;
}