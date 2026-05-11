import type { Metadata } from 'next';
import { RootProvider } from './RootProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'PORTA - Enterprise Portal',
  description: 'Enterprise internal workflow and data management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
