'use client';

import dynamic from 'next/dynamic';

// Dynamically import InteractiveGlobe with SSR disabled
const InteractiveGlobe = dynamic(() => import('@/components/InteractiveGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-neutral-900 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Loading Interactive Globe...</p>
      </div>
    </div>
  ),
});

export default function GlobePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Interactive Earth Globe
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Click anywhere on Earth to explore locations and get coordinates
          </p>
        </div>
      </div>

      {/* Globe Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-2xl">
          <div style={{ height: '70vh', minHeight: '500px' }}>
            <InteractiveGlobe className="w-full h-full" />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:glow-on-hover transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-2">Interactive Navigation</h3>
            <p className="text-muted-foreground">
              Rotate, zoom, and explore Earth with smooth 3D navigation controls
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center hover:glow-on-hover transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-2">Location Detection</h3>
            <p className="text-muted-foreground">
              Click anywhere to get precise coordinates and location information
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center hover:glow-on-hover transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Data</h3>
            <p className="text-muted-foreground">
              Get instant feedback with location markers and coordinate display
            </p>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="mt-12 bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">How to Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Navigation Controls</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Left click + drag:</strong> Rotate the globe</li>
                <li>• <strong>Scroll wheel:</strong> Zoom in and out</li>
                <li>• <strong>Auto-rotation:</strong> Globe rotates automatically</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Location Selection</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Single click:</strong> Select any location on Earth</li>
                <li>• <strong>Red markers:</strong> Show your selected points</li>
                <li>• <strong>Info panel:</strong> Displays coordinates and timestamp</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}