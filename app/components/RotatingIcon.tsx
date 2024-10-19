'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface RotatingIconProps {
  src: string;
  alt: string;
  className?: string;
  size? : number;
}

export default function RotatingIcon({ src, alt, className = '', size = 70 }: RotatingIconProps) {
  const [isRotated, setIsRotated] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRotated(prev => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`absolute ${className}`} 
      style={{ 
        transform: isRotated ? 'rotate(30deg)' : 'rotate(0deg)'
      }}
    >
      <Image src={src} alt={alt} width={size} height={size} />
    </div>
  );
}