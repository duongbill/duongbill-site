import './globals.css';
import { Be_Vietnam_Pro } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['100', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-primary',
});

export const metadata = {
  title: 'DuongBill — Creative Developer Portfolio',
  description:
    'Portfolio of Nguyen Hai Duong (DuongBill) — Full-stack & Creative Developer. Immersive web experiences with WebGL, Three.js, GSAP and React.',
  keywords: ['portfolio', 'creative developer', 'webgl', 'three.js', 'react', 'duongbill'],
  authors: [{ name: 'Nguyen Hai Duong' }],
  openGraph: {
    title: 'DuongBill — Creative Developer Portfolio',
    description: 'Full-stack & Creative Developer building immersive web experiences.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={beVietnamPro.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

