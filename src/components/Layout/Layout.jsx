'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { WebGLProvider } from '@/context/WebGLContext';
import { LanguageProvider } from '@/context/LanguageContext';
import styles from './Layout.module.css';

const SmoothScroll = dynamic(() => import('@/components/SmoothScroll'), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });
const BackgroundCanvas = dynamic(() => import('@/components/webgl/BackgroundCanvas'), { ssr: false });
import Preloader from '@/components/Preloader';
const StarsCanvas = dynamic(() => import('@/components/canvas/Stars'), { ssr: false });
import { useDragToScroll } from '@/hooks/useDragToScroll';

export default function Layout({ children }) {
  useDragToScroll();
  return (
    <LanguageProvider>
      <WebGLProvider>
        <SmoothScroll>
          <Preloader />
          <BackgroundCanvas />
          <StarsCanvas />
          <div className="app-shell">
            <CustomCursor />
            <Navbar />
            <PageTransition>
              <main>{children}</main>
            </PageTransition>
            <Footer />
          </div>
        </SmoothScroll>
      </WebGLProvider>
    </LanguageProvider>
  );
}
