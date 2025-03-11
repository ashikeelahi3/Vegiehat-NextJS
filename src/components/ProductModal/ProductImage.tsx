interface ProductImageProps {
  src: string;
  alt: string;
}

export default function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <div className="mb-6 flex justify-center p-1">
      <img 
        src={src}
        alt={alt}
        className="w-1/3 h-auto object-contain rounded-md"
      />
    </div>
  );
} 