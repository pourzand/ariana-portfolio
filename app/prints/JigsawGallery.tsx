// JigsawGallery.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import Link from "next/link";

interface ImageInfo {
  src: string;
  width: number;
  height: number;
  variants: string[];
  aspectRatio: number;
  name: string;
  year: string;
  medium: string;
}

const getImageDimensions = (filename: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.src = `/prints/${filename}`;
  });
};

const groupImages = (filenames: string[]): Record<string, string[]> => {
  const groups: Record<string, string[]> = {};
  filenames.forEach(filename => {
    const [baseName] = filename.split('-');
    if (!groups[baseName]) {
      groups[baseName] = [];
    }
    groups[baseName].push(filename);
  });
  return groups;
};

const parseFilename = (filename: string): { name: string; year: string; medium: string } => {
  const parts = filename.split('_');
  const name = parts[0].replace(/-/g, ' ');
  const year = parts[1];
  let medium = parts[2];
  
  // Remove file extension
  medium = medium.split('.')[0];
  
  // Remove variant indicator if present
  const variantIndex = medium.lastIndexOf('-');
  if (variantIndex !== -1) {
    medium = medium.substring(0, variantIndex);
  }
  
  return { name, year, medium };
};

export default function JigsawGallery({ filenames }: { filenames: string[] }) {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [displayedVariants, setDisplayedVariants] = useState<Record<string, string>>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      const groupedImages = groupImages(filenames);
      const imagePromises = Object.entries(groupedImages).map(async ([baseName, variants]) => {
        const dimensions = await getImageDimensions(variants[0]);
        const { name, year, medium } = parseFilename(variants[0]);
        return {
          src: `/prints/${variants[0]}`,
          variants,
          ...dimensions,
          aspectRatio: dimensions.width / dimensions.height,
          name,
          year,
          medium,
        };
      });

      const loadedImages = await Promise.all(imagePromises);
      setImages(loadedImages);
      
      // Initialize displayed variants
      const initialVariants: Record<string, string> = {};
      loadedImages.forEach(image => {
        const [baseName] = image.src.split('/').pop()!.split('-');
        initialVariants[baseName] = image.src;
      });
      setDisplayedVariants(initialVariants);
    };

    loadImages();
  }, [filenames]);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  const handleVariantInteraction = useCallback((baseName: string, newVariant: string) => {
    setDisplayedVariants(prev => ({ ...prev, [baseName]: `/prints/${newVariant}` }));
  }, []);

  const getColorFromVariant = (variant: string | undefined): string => {
    if (!variant) return '1';
    const parts = variant.split('/').pop()?.split('-');
    return parts && parts.length > 1 ? parts[1].split('.')[0] : '1';
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {images.map((image, index) => {
        const [baseName] = image.src.split('/').pop()!.split('-');
        const currentVariant = displayedVariants[baseName];
        return (
          <div key={index} className="retro-card">
            <table cellSpacing="0" cellPadding="5" border={1} bgcolor="#FFFFFF" width="100%">
              <tbody>
                <tr>
                  <td align="center">
                    <Link href={`/print/${baseName}?color=${getColorFromVariant(currentVariant)}`}>
                      <div style={{ position: 'relative', paddingBottom: `${(1 / image.aspectRatio) * 100}%` }}>
                        <Image
                          src={currentVariant || image.src}
                          alt={`Print ${baseName}`}
                          layout="fill"
                          objectFit="contain"
                          className="retro-image"
                        />
                      </div>
                    </Link>
                  </td>
                </tr>
                {image.variants.length > 1 && (
                  <tr>
                    <td align="center">
                      <table cellSpacing="2" cellPadding="0" border={0}>
                        <tbody>
                          <tr>
                            {image.variants.map((variant, vIndex) => (
                              <td key={vIndex}>
                                <div
                                  className={`retro-variant ${
                                    currentVariant === `/prints/${variant}` ? 'selected' : ''
                                  } ${isMobile ? 'mobile' : 'desktop'}`}
                                  onMouseEnter={() => !isMobile && handleVariantInteraction(baseName, variant)}
                                  onClick={() => isMobile && handleVariantInteraction(baseName, variant)}
                                >
                                  <Image
                                    src={`/prints/${variant}`}
                                    alt={`Variant ${vIndex + 1}`}
                                    width={30}
                                    height={30}
                                    className="cursor-pointer"
                                  />
                                </div>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
                <tr>
                  <td align="center">
                    <div style={{ color: "red" }}>{image.name}, {image.year}, {image.medium}</div>
                    {/* <div>{image.year}</div>
                    <div>{image.year}</div> */}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}
    </Masonry>
  );
}