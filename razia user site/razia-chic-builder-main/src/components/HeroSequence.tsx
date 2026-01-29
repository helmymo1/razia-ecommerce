import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Configuration
const FRAME_COUNT = 148; // Adjust based on actual number of frames provided
const PATH_PREFIX = '/sequence/frame_'; // e.g. /sequence/frame_001.jpg
const FILE_EXT = '.jpg';
const PAD_LENGTH = 3; // 001, 002, etc.

const HeroSequence: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Frames object for GSAP to animate
  const frames = useRef({ currentFrame: 0 });

  // 1. PRELOADER
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let loadedCount = 0;

      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        // Zero padding function: 1 -> "001", 10 -> "010"
        const paddedIndex = i.toString().padStart(PAD_LENGTH, '0');
        img.src = `${PATH_PREFIX}${paddedIndex}${FILE_EXT}`;
        
        await new Promise<void>((resolve) => {
          img.onload = () => {
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to load frame ${i}`);
            // Resolve anyway to continue loading others
            resolve(); 
          };
        });
        loadedImages.push(img);
      }

            setImages(loadedImages);
      setIsLoading(false);
    };

    loadImages();
  }, []);

  // 2. PAINTER & ANIMATOR
  useGSAP(() => {
    if (isLoading || images.length === 0 || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Render Function
    const render = () => {
      const frameIndex = Math.floor(frames.current.currentFrame);
      const image = images[frameIndex];

      // CRITICAL: Check if image is valid and loaded before drawing
      // InvalidStateError occurs if we try to draw a broken or loading image
      if (!image || !image.complete || image.naturalWidth === 0) {
          // Optional: Draw a placeholder or keep previous frame
          return; 
      }

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Object-fit: cover implementation
      const hRatio = canvas.width / image.width;
      const vRatio = canvas.height / image.height;
      const ratio = Math.max(hRatio, vRatio);
      
      const centerShift_x = (canvas.width - image.width * ratio) / 2;
      const centerShift_y = (canvas.height - image.height * ratio) / 2;

      try {
        context.drawImage(
            image,
            0, 0, image.width, image.height,
            centerShift_x, centerShift_y, image.width * ratio, image.height * ratio
        );
      } catch (error) {
          console.error("Canvas draw error:", error);
      }
    };

    // Initial Render
    // handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Trigger once

    // GSAP ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0, // Instant scrubbing for canvas (images arguably play smoother instantly than video seeking)
        pin: true,
        // using CSS sticky can sometimes be cleaner, but pin: true is requested in prompt
        // and standard for long scroll sequences.
      }
    });

    tl.to(frames.current, {
      currentFrame: images.length - 1,
      snap: "currentFrame", // Snap to whole numbers
      ease: "none",
      onUpdate: render
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill();
    };
  }, { scope: containerRef, dependencies: [isLoading, images] });

  return (
    <div ref={containerRef} style={{ height: '300vh', position: 'relative' }}>
        {/* Sticky Canvas Container */}
        {/* Using standard sticky here to help layout stability even if GSAP pins */}
        <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden', backgroundColor: '#000' }}>
            
            {/* Loading Indicator */}
            {isLoading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
                    <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4"></div>
                    <p className="text-xl font-light tracking-widest">LOADING SEQUENCE {loadProgress}%</p>
                </div>
            )}

            {/* Error Message if No Images */}
            {!isLoading && images.length === 0 && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-900 text-white p-8 text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold mb-2">Image Sequence Not Found</h2>
                    <p className="max-w-md text-gray-400 mb-6">
                        The <code>public/sequence/</code> folder is empty.
                    </p>
                    <div className="bg-black/50 p-4 rounded text-left font-mono text-sm text-green-400">
                        1. Open project folder<br/>
                        2. Go to public/sequence<br/>
                        3. Add images: frame_000.jpg, frame_001.jpg...
                    </div>
                </div>
            )}

            <canvas 
                ref={canvasRef}
                className="w-full h-full object-cover"
            />

            {/* Overlay Text (Existing Scrollytelling Text) */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10 pointer-events-none mix-blend-difference">
                <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight">Razia Chic</h1>
                <p className="text-xl md:text-3xl font-light">The Collection</p>
            </div>
        </div>
    </div>
  );
};

export default HeroSequence;
