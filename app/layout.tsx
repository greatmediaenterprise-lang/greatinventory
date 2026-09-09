import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Great Pay',
  description: 'Professional card operations management system',
  icons: {
    icon: '/greatpay.png',
    shortcut: '/greatpay.png',
    apple: '/greatpay.png'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
