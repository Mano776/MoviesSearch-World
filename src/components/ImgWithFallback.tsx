import React, { useState } from "react";

interface ImgWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
}

export const ImgWithFallback: React.FC<ImgWithFallbackProps> = ({ 
  src, 
  fallbackSrc = "/no-poster.png", 
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src !== "N/A" ? src : fallbackSrc);

  return (
    <img
      {...props}
      src={imgSrc}
      onError={() => setImgSrc(fallbackSrc)}
      referrerPolicy="no-referrer"
      className="w-full h-full object-cover"
    />
  );
};
