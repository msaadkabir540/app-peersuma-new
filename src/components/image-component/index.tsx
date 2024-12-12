import React, { CSSProperties } from "react";
import Image, { StaticImageData } from "next/image";

const ImageComponent = ({
  className,
  src,
  alt,
  priority,
  style,
  onClick,
  containerWidth,
  containerHeight,
  stylesProps,
}: {
  className?: string;
  src: string | StaticImageData;
  alt: string;
  containerWidth?: string;
  containerHeight?: string;
  priority?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
  stylesProps?: CSSProperties;
}) => {
  return (
    <>
      <div
        className={className}
        style={{
          position: "relative",
          height: containerHeight,
          width: containerWidth,
          ...stylesProps,
        }}
      >
        <Image onClick={onClick} src={src} alt={alt} fill priority={priority} style={style} />
      </div>
    </>
  );
};

export default ImageComponent;
