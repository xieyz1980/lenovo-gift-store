import type { Metadata, Viewport } from 'next';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: {
    default: '联想未来中心礼品店',
    template: '%s | 联想未来中心',
  },
  description: '联想未来中心礼品店，用未来值兑换精美礼品',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#E60012',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
