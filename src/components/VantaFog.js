'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';

export default function VantaFog() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      const effect = FOG({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        highlightColor: 0xff6f61,   // Coral Red
        midtoneColor: 0xff9a76,     // Light Coral
        lowlightColor: 0xff4c29,    // Darker Coral
        baseColor: 0x3b1f0b,       // Dark brown
        blurFactor: 0.9,
        speed: 5.0,
        zoom: 0.7,
      });
      setVantaEffect(effect);
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
        setVantaEffect(null);
      }
    };
  }, []); 

  return <div ref={vantaRef} className="absolute inset-0 -z-10" />;
}
