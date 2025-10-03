'use client';

import Plasma from './Plasma';

export default function PlasmaBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Plasma 
        color="#ffffff"
        speed={0.6}
        direction="forward"
        scale={1.1}
        opacity={0.8}
        mouseInteractive={true}
      />
    </div>
  );
}