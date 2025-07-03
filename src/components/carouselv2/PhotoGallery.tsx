"use client";

import {useEffect, useState} from "react";
import LightGallery from "lightgallery/react";
import {fetchImages} from "@/lib/appwrite";

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

type Image = {
  id: string;
  fileId: string;
  title: string;
  description: string;
  aspectRatio: string;
  src: {
    thumbnail: string;
    medium: string;
    full: string;
  };
  alt: string;
  createdAt: string;
};

export default function PhotoGallery() {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    fetchImages(20, 0)
      .then((imgs) => setImages(imgs ?? []))
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
              style={{width: "100%", maxWidth: "300px", height: "auto"}}
              loading="lazy"
            />
          </a>
        ))}
      </LightGallery>
    </div>
  );
}