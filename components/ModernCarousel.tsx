"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { S3Image } from "@/lib/s3";

interface ModernCarouselProps {
  images: S3Image[];
  isOpen: boolean;
  onClose: () => void;
  startIndex?: number;
}

export default function ModernCarousel({ images, isOpen, onClose, startIndex = 0 }: ModernCarouselProps) {
  const [current, setCurrent] = useState(startIndex);
  const [dragging, setDragging] = useState(false);
  const [direction, setDirection] = useState(0); // -1: left, 1: right
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) setCurrent(startIndex);
  }, [isOpen, startIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, current]);

  // Drag/swipe logic
  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    setDragging(false);
    if (info.offset.x < -100 && current < images.length - 1) {
      setDirection(1);
      setCurrent(current + 1);
    } else if (info.offset.x > 100 && current > 0) {
      setDirection(-1);
      setCurrent(current - 1);
    } else {
      setDirection(0);
    }
  };

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c > 0 ? c - 1 : c));
  }, []);
  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c < images.length - 1 ? c + 1 : c));
  }, [images.length]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900/80 via-pink-900/80 to-blue-900/80">
      <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg text-gray-700"
          title="Đóng"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Main image area */}
        <div className="relative w-full h-[480px] flex items-center justify-center rounded-3xl bg-white/80 shadow-2xl overflow-hidden">
          {/* Prev button */}
          <button
            onClick={prev}
            disabled={current === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-110 transition disabled:opacity-40"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          {/* Next button */}
          <button
            onClick={next}
            disabled={current === images.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-110 transition disabled:opacity-40"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Image with drag/swipe */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={images[current].key}
              src={images[current].url}
              alt={images[current].key}
              className="w-auto h-[400px] max-w-full max-h-full object-contain rounded-2xl shadow-xl select-none cursor-grab"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragStart={() => setDragging(true)}
              onDragEnd={handleDragEnd}
              initial={{ x: direction === 0 ? 0 : direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              whileTap={{ scale: 1.05 }}
            />
          </AnimatePresence>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 mt-6 px-2 py-2 bg-white/70 rounded-2xl shadow-lg">
          {images.map((img, idx) => (
            <button
              key={img.key}
              onClick={() => setCurrent(idx)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 shadow-md ${
                idx === current
                  ? "border-gradient-to-r from-purple-500 to-pink-500 scale-110 ring-2 ring-pink-400"
                  : "border-transparent hover:border-purple-300 hover:scale-105"
              }`}
              style={{ outline: "none" }}
            >
              <img
                src={img.url}
                alt={img.key}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="mt-3 text-center text-sm text-gray-700 font-semibold">
          {current + 1} / {images.length}
        </div>
      </div>
    </div>
  );
} 