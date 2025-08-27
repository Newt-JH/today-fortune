import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Noto_Sans_KR } from 'next/font/google';

const noto = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400','500','700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '오늘의 운세',
  description: '모바일 기반 Next.js 앱',
  themeColor: '#7B61FF',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={noto.className}>{children}</body>
    </html>
  );
}
