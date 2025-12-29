'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const TOTAL_FRAMES = 192;
const FRAME_PREFIX = '/hero-splitimages/frame_';
const FRAME_SUFFIX = '_delay-0.04s.png';
const SCROLL_PER_FRAME = 8; // Pixels of scroll needed per frame

// Helper function to get frame file path
const getFramePath = (frameIndex: number): string => {
  const paddedIndex = String(frameIndex).padStart(3, '0');
  return `${FRAME_PREFIX}${paddedIndex}${FRAME_SUFFIX}`;
};

export function Hero() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const [loadedFrames, setLoadedFrames] = useState<Set<number>>(new Set([0]));
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0-100%
  const heroRef = useRef<HTMLElement>(null);
  const accumulatedScrollRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isScrollingRef = useRef(false);
  const lastFrameBeforeUnlockRef = useRef(0);
  const loadedImagesRef = useRef<Set<number>>(new Set([0]));
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());

  useEffect(() => {
    // Enhanced preload function with loading tracking
    const preloadImage = (frameIndex: number): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if already loaded
        if (loadedImagesRef.current.has(frameIndex)) {
          resolve();
          return;
        }

        // Check cache first
        if (imageCacheRef.current.has(frameIndex)) {
          loadedImagesRef.current.add(frameIndex);
          resolve();
          return;
        }

        const img = new window.Image();
        img.onload = () => {
          loadedImagesRef.current.add(frameIndex);
          imageCacheRef.current.set(frameIndex, img);
          setLoadedFrames(prev => new Set(prev).add(frameIndex));
          resolve();
        };
        img.onerror = () => {
          reject(new Error(`Failed to load frame ${frameIndex}`));
        };
        img.src = getFramePath(frameIndex);
      });
    };

    // Preload images in batches for smooth animation
    const preloadImages = async () => {
      // Preload first 50 frames immediately
      const initialFrames = Array.from({ length: Math.min(50, TOTAL_FRAMES) }, (_, i) => i);
      await Promise.all(initialFrames.map(i => preloadImage(i).catch(() => { })));

      // Preload last 50 frames
      const lastFrames = Array.from({ length: Math.min(50, TOTAL_FRAMES) }, (_, i) => TOTAL_FRAMES - 1 - i);
      await Promise.all(lastFrames.map(i => preloadImage(i).catch(() => { })));
    };

    preloadImages();

    const updateFrame = () => {
      const maxAccumulatedScroll = (TOTAL_FRAMES - 1) * SCROLL_PER_FRAME;
      // Clamp accumulated scroll to valid range (don't allow negative)
      accumulatedScrollRef.current = Math.max(0, Math.min(accumulatedScrollRef.current, maxAccumulatedScroll));

      // Calculate frame based on accumulated scroll
      const scrollProgressValue = accumulatedScrollRef.current / maxAccumulatedScroll;
      const newFrame = Math.round(scrollProgressValue * (TOTAL_FRAMES - 1));

      // Clamp frame to valid range
      const clampedFrame = Math.max(0, Math.min(newFrame, TOTAL_FRAMES - 1));

      // Update scroll progress percentage (0-100)
      setScrollProgress(scrollProgressValue * 100);

      // Track if user has scrolled
      if (accumulatedScrollRef.current > 0 && !hasScrolled) {
        setHasScrolled(true);
      }

      // Always update frame - React will handle optimization
      setCurrentFrame(clampedFrame);
    };

    // Use wheel event to capture scroll intent (desktop)
    const handleWheel = (e: WheelEvent) => {
      if (!isLocked) {
        // If unlocked, only re-lock if user is at the very top of the page
        const scrollY = window.scrollY;

        // Only re-lock if scrolling backward AND at the top (within 100px to account for small scroll offsets)
        if (e.deltaY < 0 && scrollY <= 100) {
          // User is scrolling backward at the top, re-lock
          const maxAccumulatedScroll = (TOTAL_FRAMES - 1) * SCROLL_PER_FRAME;
          accumulatedScrollRef.current = maxAccumulatedScroll;
          setIsLocked(true);
          document.body.style.overflow = 'hidden';
          window.scrollTo(0, 0);
          // Continue with backward scroll handling
        } else {
          // Scrolling forward or not at top - allow normal page scroll
          return;
        }
      }

      e.preventDefault();
      e.stopPropagation();

      const maxAccumulatedScroll = (TOTAL_FRAMES - 1) * SCROLL_PER_FRAME;

      // Handle scroll direction: positive deltaY = scroll down (forward), negative = scroll up (backward)
      if (e.deltaY > 0) {
        // Scrolling down - move forward
        accumulatedScrollRef.current += Math.abs(e.deltaY);
        accumulatedScrollRef.current = Math.min(accumulatedScrollRef.current, maxAccumulatedScroll);

        // If we've reached the last frame going forward, unlock
        if (accumulatedScrollRef.current >= maxAccumulatedScroll && isLocked) {
          accumulatedScrollRef.current = maxAccumulatedScroll;
          lastFrameBeforeUnlockRef.current = TOTAL_FRAMES - 1;
          setIsLocked(false);
          document.body.style.overflow = '';
        }
      } else if (e.deltaY < 0) {
        // Scrolling up - move backward
        // Only allow backward scroll if we're not at the first frame
        if (accumulatedScrollRef.current > 0) {
          accumulatedScrollRef.current -= Math.abs(e.deltaY);
          accumulatedScrollRef.current = Math.max(0, accumulatedScrollRef.current);
        }
      }

      updateFrame();
    };

    // Use touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (!isLocked) {
        // If unlocked, allow touch to potentially re-lock on backward scroll
        touchStartYRef.current = e.touches[0].clientY;
        isScrollingRef.current = true;
      } else if (isLocked) {
        touchStartYRef.current = e.touches[0].clientY;
        isScrollingRef.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrollingRef.current) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - touchY; // Positive = scroll down, negative = scroll up
      touchStartYRef.current = touchY;

      const maxAccumulatedScroll = (TOTAL_FRAMES - 1) * SCROLL_PER_FRAME;

      if (!isLocked && deltaY > 0) {
        // Already unlocked and scrolling down - allow normal scroll
        return;
      }

      if (!isLocked && deltaY < 0) {
        // Check if user is at the very top of the page before re-locking
        const scrollY = window.scrollY;

        // Only re-lock if scrolling backward AND at the top (within 100px to account for small scroll offsets)
        if (scrollY <= 100) {
          // Scrolling backward at the top, re-lock
          accumulatedScrollRef.current = maxAccumulatedScroll;
          setIsLocked(true);
          document.body.style.overflow = 'hidden';
          window.scrollTo(0, 0);
        } else {
          // Not at top - allow normal scroll
          return;
        }
      }

      if (!isLocked && deltaY > 0) {
        // Don't handle forward scroll when unlocked
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (deltaY > 0) {
        // Scrolling down - move forward
        accumulatedScrollRef.current += Math.abs(deltaY);
        accumulatedScrollRef.current = Math.min(accumulatedScrollRef.current, maxAccumulatedScroll);

        // If we've reached the last frame going forward, unlock
        if (accumulatedScrollRef.current >= maxAccumulatedScroll && isLocked) {
          accumulatedScrollRef.current = maxAccumulatedScroll;
          lastFrameBeforeUnlockRef.current = TOTAL_FRAMES - 1;
          setIsLocked(false);
          document.body.style.overflow = '';
        }
      } else if (deltaY < 0) {
        // Scrolling up - move backward
        // Only allow backward scroll if we're not at the first frame
        if (accumulatedScrollRef.current > 0) {
          accumulatedScrollRef.current -= Math.abs(deltaY);
          accumulatedScrollRef.current = Math.max(0, accumulatedScrollRef.current);
        }
      }

      updateFrame();
    };

    const handleTouchEnd = () => {
      isScrollingRef.current = false;
    };

    // Prevent body scroll while locked
    if (isLocked) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    }

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: false, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true } as EventListenerOptions);
      window.removeEventListener('touchstart', handleTouchStart, { capture: true } as EventListenerOptions);
      window.removeEventListener('touchmove', handleTouchMove, { capture: true } as EventListenerOptions);
      window.removeEventListener('touchend', handleTouchEnd);
      document.body.style.overflow = '';
    };
  }, [isLocked]);

  // Preload frames around current frame for smoother transitions
  useEffect(() => {
    const preloadAdjacentFrames = async () => {
      const framesToPreload: number[] = [];

      // Detect mobile and increase preload range for mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
      const preloadRange = isMobile ? 30 : 20; // More frames on mobile for smoother scrolling

      // Preload frames ahead and behind
      for (let i = -preloadRange; i <= preloadRange; i++) {
        const frameIndex = currentFrame + i;
        if (frameIndex >= 0 && frameIndex < TOTAL_FRAMES && !loadedImagesRef.current.has(frameIndex)) {
          framesToPreload.push(frameIndex);
        }
      }

      // Preload in priority order: closer frames first
      const sortedFrames = framesToPreload.sort((a, b) =>
        Math.abs(a - currentFrame) - Math.abs(b - currentFrame)
      );

      // Preload closest frames first (prioritize immediate neighbors)
      const immediateFrames = sortedFrames.slice(0, 10);
      for (const frameIndex of immediateFrames) {
        const img = new window.Image();
        img.src = getFramePath(frameIndex);
        img.onload = () => {
          loadedImagesRef.current.add(frameIndex);
          imageCacheRef.current.set(frameIndex, img);
          setLoadedFrames(prev => new Set(prev).add(frameIndex));
        };
      }

      // Preload remaining frames
      for (const frameIndex of sortedFrames.slice(10)) {
        const img = new window.Image();
        img.src = getFramePath(frameIndex);
        img.onload = () => {
          loadedImagesRef.current.add(frameIndex);
          imageCacheRef.current.set(frameIndex, img);
          setLoadedFrames(prev => new Set(prev).add(frameIndex));
        };
      }
    };

    preloadAdjacentFrames();
  }, [currentFrame]);

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full bg-black overflow-hidden"
      style={{ maxWidth: '100vw', maxHeight: '100vh' }}
    >
      {/* Scroll-driven frame animation */}
      <div className="absolute inset-0 w-full h-full z-0 bg-black overflow-hidden" style={{ maxWidth: '100vw', maxHeight: '100vh' }}>
        {/* Show previous frames as fallback - keep multiple frames ready for smoother transitions */}
        {currentFrame > 0 && loadedFrames.has(currentFrame - 1) && (
          <img
            src={getFramePath(currentFrame - 1)}
            alt=""
            className="absolute top-0 left-0"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              minWidth: 0,
              minHeight: 0,
              opacity: loadedFrames.has(currentFrame) ? 0 : 1,
              transition: loadedFrames.has(currentFrame) ? 'opacity 0.2s ease-in-out' : 'none',
              zIndex: 1,
              pointerEvents: 'none'
            }}
            aria-hidden="true"
          />
        )}
        {/* Show frame before previous as additional fallback for mobile */}
        {currentFrame > 1 && loadedFrames.has(currentFrame - 2) && !loadedFrames.has(currentFrame) && (
          <img
            src={getFramePath(currentFrame - 2)}
            alt=""
            className="absolute top-0 left-0"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              minWidth: 0,
              minHeight: 0,
              opacity: 0.7,
              zIndex: 0,
              pointerEvents: 'none'
            }}
            aria-hidden="true"
          />
        )}
        {/* Current frame - only show when loaded to prevent black screens */}
        {loadedFrames.has(currentFrame) && (
          <img
            src={getFramePath(currentFrame)}
            alt="Luxury Jewelry Animation"
            className="absolute top-0 left-0"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              minWidth: 0,
              minHeight: 0,
              opacity: 1,
              zIndex: 2
            }}
            loading="eager"
            key={currentFrame}
          />
        )}
        {/* Preload current frame in background if not loaded */}
        {!loadedFrames.has(currentFrame) && (
          <img
            src={getFramePath(currentFrame)}
            alt=""
            className="absolute top-0 left-0"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              minWidth: 0,
              minHeight: 0,
              opacity: 0,
              zIndex: 3,
              pointerEvents: 'none'
            }}
            loading="eager"
            onLoad={() => {
              loadedImagesRef.current.add(currentFrame);
              setLoadedFrames(prev => new Set(prev).add(currentFrame));
            }}
            onError={(e) => {
              // If image fails to load, try to show cached version
              const cachedImg = imageCacheRef.current.get(currentFrame);
              if (cachedImg && e.currentTarget.src !== cachedImg.src) {
                e.currentTarget.src = cachedImg.src;
              }
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30 z-[1]" />

      {/* Scroll-responsive foreground UX */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center text-white px-4 pt-20">
        {/* Headline - fades/slides out at 20-30% scroll */}
        <h1
          className="font-display text-5xl md:text-7xl lg:text-8xl mb-4 md:mb-6 transition-all duration-700 ease-out"
          style={{
            opacity: scrollProgress > 25 ? 0 : 1 - (scrollProgress / 25),
            transform: scrollProgress > 25
              ? 'translateY(-30px)'
              : `translateY(${-scrollProgress * 1.2}px)`,
            pointerEvents: scrollProgress > 25 ? 'none' : 'auto'
          }}
        >
          Elevate Your Style
        </h1>

        {/* Subheadline - fades/slides out at 20-30% scroll */}
        <p
          className="text-base md:text-lg lg:text-xl mb-8 md:mb-12 opacity-90 font-light max-w-2xl transition-all duration-700 ease-out"
          style={{
            opacity: scrollProgress > 25 ? 0 : 1 - (scrollProgress / 25),
            transform: scrollProgress > 25
              ? 'translateY(-20px)'
              : `translateY(${-scrollProgress * 0.8}px)`,
            pointerEvents: scrollProgress > 25 ? 'none' : 'auto'
          }}
        >
          Indulge in the finest craftsmanship and timeless elegance of our luxury jewelry collection.
        </p>

        {/* Scroll indicator - disappears on first scroll */}
        {!hasScrolled && (
          <div
            className="absolute bottom-8 md:bottom-12 flex flex-col items-center gap-2 transition-opacity duration-500"
            style={{
              opacity: scrollProgress > 0 ? 0 : 1
            }}
          >
            <span className="text-sm md:text-base tracking-widest uppercase opacity-80">Scroll</span>
            <svg
              className="w-6 h-6 md:w-8 md:h-8 animate-bounce opacity-80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}

