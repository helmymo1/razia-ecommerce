import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * HeroVideo - Cinematic Scroll Experience (No Seeking = Maximum Smoothness)
 * 
 * The secret used by Apple, Porsche, and luxury brands:
 * Instead of scrubbing video.currentTime (which is inherently janky),
 * let the video PLAY smoothly and use scroll to control:
 * - Scale (zoom effect)
 * - Opacity (fade transitions)
 * - Position (parallax)
 * - Filters (blur, brightness)
 * 
 * This provides butter-smooth 60fps animations because we're only
 * transforming CSS properties, not seeking video frames.
 */
const HeroVideo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Smooth values for GSAP
  const scaleValue = useRef({ value: 1 });
  const opacityValue = useRef({ value: 1 });
  const blurValue = useRef({ value: 0 });
  const yValue = useRef({ value: 0 });

  const easeOutQuart = useCallback((t: number) => {
    return 1 - Math.pow(1 - t, 4);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    const videoContainer = videoContainerRef.current;
    const text = textRef.current;
    const overlay = overlayRef.current;

    if (!video || !container || !videoContainer) return;

    // Start video playing (looped for continuous content)
    video.play().catch(() => {
      // Autoplay might be blocked, that's okay
    });

    // Main scroll animation - Cinematic zoom effect
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5, // Smooth 1.5s lag
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Smooth scale: 1 → 1.5 (zoom in as you scroll)
          const targetScale = 1 + (progress * 0.5);
          scaleValue.current.value += (targetScale - scaleValue.current.value) * 0.1;
          
          // Smooth Y parallax: 0 → -100px
          const targetY = progress * -100;
          yValue.current.value += (targetY - yValue.current.value) * 0.1;
          
          // Apply transforms
          gsap.set(videoContainer, {
            scale: scaleValue.current.value,
            y: yValue.current.value,
          });
        },
      },
    });

    // Overlay darkness animation
    if (overlay) {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
        onUpdate: (self) => {
          const progress = self.progress;
          // Darken overlay as scroll progresses: 0 → 0.6
          const targetOpacity = progress * 0.6;
          opacityValue.current.value += (targetOpacity - opacityValue.current.value) * 0.08;
          gsap.set(overlay, { opacity: opacityValue.current.value });
        },
      });
    }

    // Text animations
    if (text) {
      gsap.set(text, { opacity: 0, y: 60, scale: 0.95 });
      
      // Fade in text
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '20% center',
        scrub: 2,
        onUpdate: (self) => {
          const easedProgress = easeOutQuart(self.progress);
          gsap.set(text, {
            opacity: easedProgress,
            y: 60 - (easedProgress * 60),
            scale: 0.95 + (easedProgress * 0.05),
          });
        },
      });

      // Fade out text
      ScrollTrigger.create({
        trigger: container,
        start: '70% center',
        end: 'bottom bottom',
        scrub: 2,
        onUpdate: (self) => {
          const easedProgress = easeOutQuart(self.progress);
          gsap.set(text, {
            opacity: 1 - easedProgress,
            y: -(easedProgress * 80),
            scale: 1 - (easedProgress * 0.1),
          });
        },
      });
    }

    // Video blur effect at the end (optional cinematic effect)
    ScrollTrigger.create({
      trigger: container,
      start: '80% center',
      end: 'bottom bottom',
      scrub: 2,
      onUpdate: (self) => {
        const targetBlur = self.progress * 8;
        blurValue.current.value += (targetBlur - blurValue.current.value) * 0.1;
        gsap.set(videoContainer, {
          filter: `blur(${blurValue.current.value}px)`,
        });
      },
    });

    return () => {
      mainTl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [easeOutQuart]);

  return (
    <div 
      ref={containerRef} 
      className="relative"
      style={{ height: '400vh' }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        
        {/* Video container - receives scale/parallax transforms */}
        <div
          ref={videoContainerRef}
          className="absolute inset-0 w-full h-full"
          style={{
            willChange: 'transform, filter',
            transformOrigin: 'center center',
          }}
        >
          {/* Auto-playing video - NO seeking, just plays smoothly */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              transform: 'translateZ(0)',
            }}
            src="/hero-video.mp4"
            muted
            playsInline
            loop
            autoPlay
            preload="auto"
          />
        </div>

        {/* Dynamic overlay - darkens as you scroll */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: 0 }}
        />

        {/* Gradient overlays for depth */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.4) 100%)',
          }}
        />

        {/* Vignette effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.3) 100%)',
          }}
        />

        {/* Hero text overlay */}
        <div
          ref={textRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 pointer-events-none px-4"
          style={{ willChange: 'opacity, transform' }}
        >
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-6 tracking-tight"
            style={{ 
              textShadow: '0 8px 60px rgba(0,0,0,0.8)',
              letterSpacing: '-0.03em',
            }}
          >
            Razia Chic
          </h1>
          <p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light tracking-wider opacity-90"
            style={{ textShadow: '0 4px 40px rgba(0,0,0,0.7)' }}
          >
            Fashion in Motion
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/50 z-20">
          <span className="text-xs tracking-[0.4em] mb-4 uppercase font-light">Scroll</span>
          <div className="relative w-6 h-10 border-2 border-white/30 rounded-full">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVideo;
