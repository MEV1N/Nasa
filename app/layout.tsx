import './globals.css';
import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });

export const metadata: Metadata = {
  title: 'Impactor 25',
  description: 'Explore asteroid data, simulate impacts, and visualize consequences',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={`${inter.className} ${orbitron.variable} bg-black text-white min-h-screen`}>
        <nav className="border-b border-gray-800/50 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex justify-between items-center h-20">
              <Link href="/" className="font-bold text-xl font-orbitron text-white hover:text-gray-300 transition-colors">
                IMPACTOR 25
              </Link>
              <div className="flex space-x-12">
                <Link href="/" className="text-white/90 hover:text-white transition-colors text-sm font-medium font-orbitron">
                  Home
                </Link>
                <Link href="/simulation" className="text-white/90 hover:text-white transition-colors text-sm font-medium font-orbitron">
                  Simulation
                </Link>
                <Link href="/database" className="text-white/90 hover:text-white transition-colors text-sm font-medium font-orbitron">
                  Database
                </Link>
                <Link href="/globe" className="text-white/90 hover:text-white transition-colors text-sm font-medium font-orbitron">
                  Globe
                </Link>
                <Link href="/info" className="text-white/90 hover:text-white transition-colors text-sm font-medium font-orbitron">
                  Info
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
