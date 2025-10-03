import './globals.css';
import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });

export const metadata: Metadata = {
  title: 'NASA Space Apps: Asteroid Impact Simulator',
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
        <nav className="border-b border-gray-800 bg-black sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="font-bold text-xl font-orbitron text-white hover:text-blue400 hover:text-blue-300 transition-colors">
                NASA ASTEROID SIMULATOR
              </Link>
              <div className="flex space-x-8">
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Home
                </Link>
                <Link href="/simulation" className="hover:text-blue-400 transition-colors">
                  Simulation
                </Link>
                <Link href="/database" className="hover:text-blue-400 transition-colors">
                  Database
                </Link>
                <Link href="/info" className="hover:text-blue-400 transition-colors">
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
