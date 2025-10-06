import React, { useEffect, useRef, useState } from "react";

interface FitTextProps {
  text: string;
  maxWidth: number; // e.g. 80 for w-20 (20 * 4px)
  minSize?: number;
  maxSize?: number;
  className?: string;
}

export const FitText: React.FC<FitTextProps> = ({
  text,
  maxWidth,
  minSize = 8,
  maxSize = 20,
  className = "",
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(maxSize);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    let size = maxSize;
    el.style.fontSize = `${size}px`;

    // Shrink until it fits
    while (el.scrollWidth > maxWidth && size > minSize) {
      size -= 1;
      el.style.fontSize = `${size}px`;
    }

    // Optional: Grow if it's too small and space allows
    while (el.scrollWidth < maxWidth && size < maxSize) {
      size += 1;
      el.style.fontSize = `${size}px`;
    }

    setFontSize(size);
  }, [text, maxWidth, minSize, maxSize]);

  return (
    <span
      ref={spanRef}
      className={`block text-center truncate ${className}`}
      style={{ fontSize: `${fontSize}px`, maxWidth }}
    >
      {text}
    </span>
  );
};
