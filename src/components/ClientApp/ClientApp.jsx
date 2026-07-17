'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import { Contact } from '@/components';
import Footer from '@/components/Footer';

// Dynamic imports for heavy client-side components (no SSR)
const SmoothScroll = dynamic(() => import('@/components/SmoothScroll'), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });

export default function ClientApp() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <Contact />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
