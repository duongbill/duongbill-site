import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import GallerySection from '@/components/GallerySection';
import { Contact } from '@/components';

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <GallerySection />
      <Contact />
    </Layout>
  );
}

