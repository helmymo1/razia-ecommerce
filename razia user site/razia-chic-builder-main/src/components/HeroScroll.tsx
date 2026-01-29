import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './HeroScroll.module.css';

gsap.registerPlugin(ScrollTrigger);

const HeroScroll: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const image = imageRef.current;
    const hero = heroSectionRef.current;

    if (!wrapper || !image || !hero) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: true,
          markers: false // Set to true for debugging
        }
      })
      .to(image, {
        scale: 2,
        z: 350,
        transformOrigin: "center center",
        ease: "power1.inOut"
      })
      .to(hero, {
        scale: 1.1,
        transformOrigin: "center center",
        ease: "power1.inOut"
      }, "<");
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.content}>
        <section className={`${styles.section} ${styles.hero}`} ref={heroSectionRef}>
          {/* Hero Content can go here */}
        </section>
        {/* Sections removed as requested */}
      </div>
      <div className={styles.imageContainer}>
        <img 
          src="/hero-scroll.jpg" 
          alt="Fashion Hero" 
          ref={imageRef} 
        />
      </div>
    </div>
  );
};

export default HeroScroll;
