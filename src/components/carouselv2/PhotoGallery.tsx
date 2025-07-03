"use client";

import { useEffect, useState } from "react";
import LightGallery from "lightgallery/react";
import { fetchImages } from "@/lib/appwrite";

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';


export default function FOHCarousel() {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    fetchImages(20, 0)
      .then(setImages)
      .catch(console.error);
  }, []);

  return (
    <div className="w-full h-full">
      <LightGallery
        speed={500}
        plugins={[]}
        mode="lg-fade"
        loop={true}
        download={false}
        zoomFromOrigin={false}
      >
        {images.map((img) => (
          <a
            key={img.id}
            href={img.src.full}
            data-lg-size={img.aspectRatio.replace("/", "-")}
            data-sub-html={img.title}
          >
            <img
              src={img.src.thumbnail}
              alt={img.alt}
              style={{ width: "100%", maxWidth: "300px", height: "auto" }}
              loading="lazy"
            />
          </a>
        ))}
      </LightGallery>
    </div>
  );
}