'use client';

export default function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];
  
  // If it's already a full Cloudinary URL, inject params after /upload/
  if (src.includes('res.cloudinary.com')) {
    const [base, file] = src.split('/upload/');
    // If split was successful
    if (file) {
      return `${base}/upload/${params.join(',')}/${file}`;
    }
  }
  
  // Fallback for non-cloudinary images
  return src;
}