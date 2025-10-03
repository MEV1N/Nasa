'use client';

import { useState } from 'react';
import PillNav from '../../components/PillNav';

export default function PillNavDemo() {
  const [currentPage, setCurrentPage] = useState('/');

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Simulation', href: '/simulation' },
    { label: 'Database', href: '/database' },
    { label: 'Info', href: '/info' }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* PillNav Demo */}
      <PillNav
        logo="/nasa-logo.svg"
        logoAlt="NASA Logo"
        items={navItems}
        activeHref={currentPage}
        className="custom-nav"
        ease="power2.easeOut"
        baseColor="#000000"
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#000000"
      />

      <div className="pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 font-orbitron">
            PillNav Demo
          </h1>
          
          <div className="bg-gray-900 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Features:</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• Animated pill-style navigation with GSAP</li>
              <li>• Responsive design with mobile hamburger menu</li>
              <li>• Smooth hover animations and transitions</li>
              <li>• Customizable colors and styling</li>
              <li>• Logo rotation animation on hover</li>
              <li>• Active page indicator</li>
              <li>• Mobile-first design</li>
            </ul>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Current Configuration:</h2>
            <pre className="text-sm text-gray-300 overflow-x-auto">
{`<PillNav
  logo="/nasa-logo.svg"
  logoAlt="NASA Logo"
  items={[
    { label: 'Home', href: '/' },
    { label: 'Simulation', href: '/simulation' },
    { label: 'Database', href: '/database' },
    { label: 'Info', href: '/info' }
  ]}
  activeHref="/"
  className="custom-nav"
  ease="power2.easeOut"
  baseColor="#000000"
  pillColor="#ffffff"
  hoveredPillTextColor="#ffffff"
  pillTextColor="#000000"
/>`}
            </pre>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Color Variations:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800 rounded">
                <h3 className="font-semibold mb-2">Dark Theme</h3>
                <p className="text-sm text-gray-400">baseColor: "#000000"</p>
                <p className="text-sm text-gray-400">pillColor: "#ffffff"</p>
              </div>
              <div className="p-4 bg-gray-800 rounded">
                <h3 className="font-semibold mb-2">Light Theme</h3>
                <p className="text-sm text-gray-400">baseColor: "#ffffff"</p>
                <p className="text-sm text-gray-400">pillColor: "#000000"</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Try hovering over the navigation items and logo above! 
              On mobile, tap the hamburger menu to see the mobile navigation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}