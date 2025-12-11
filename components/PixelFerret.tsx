
import React from 'react';
import { GameState } from '../types';

interface PixelFerretProps {
  state: GameState;
  frame: number; // 0 or 1 for animation toggling
}

const PixelFerret: React.FC<PixelFerretProps> = ({ state, frame }) => {
  // A pixel is 1 unit. Viewbox is small to keep it pixelated.
  // Colors
  const C = '#FFFDD0'; // Cream/White (Body)
  const D = '#5C4033'; // Dark Brown (Mask/Feet)
  const B = '#000000'; // Black (Outline/Eyes)
  const P = '#FFB6C1'; // Pink (Nose/Ears/Cheeks)
  const G = '#556B2F'; // Dark Olive Green (Sick/Dead)
  const T = 'transparent';

  // Helper to render pixels
  const renderPixels = (pixels: string[]) => {
    return pixels.map((row, y) => (
      row.split('').map((colorCode, x) => {
        let fill = T;
        if (colorCode === 'C') fill = C;
        if (colorCode === 'D') fill = D;
        if (colorCode === 'B') fill = B;
        if (colorCode === 'P') fill = P;
        if (colorCode === 'G') fill = G;
        if (fill === T) return null;
        return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />;
      })
    ));
  };

  // 16x16 Grid Art - "CACOON FACE" Style (Bigger Head)
  // Head is roughly 10x8 centered
  
  const idle1 = [
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTDDTTTTTTDDTTT", // Ears
    "TTDCCDDTTDDCCDTT", // Ears/Head top
    "TTDCCCCCCCCCCDTT", // Forehead
    "TTDCCCCCCCCCCDTT",
    "TTDCBDCCCCBDCDTT", // Eyes (B)
    "TTDCBDCCCCBDCDTT", // Eyes (B)
    "TTDCCCCPPCCCCDTT", // Cheeks (P)
    "TTDCCCCDDCCCCDTT", // Nose (D) center
    "TTTDCCCCCCCCDTTT", // Chin
    "TTTTDDDDDDDDTTTT", // Neck/Body start
    "TTTTTCCCCCCCTTTT",
    "TTTTTDDCCDDTTTTT", // Feet
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT"
  ];

  const idle2 = [
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT", // Bob down
    "TTTDDTTTTTTDDTTT", 
    "TTDCCDDTTDDCCDTT", 
    "TTDCCCCCCCCCCDTT", 
    "TTDCCCCCCCCCCDTT",
    "TTDCBDCCCCBDCDTT", 
    "TTDCBDCCCCBDCDTT", 
    "TTDCCCCPPCCCCDTT", 
    "TTDCCCCDDCCCCDTT", 
    "TTTDCCCCCCCCDTTT", 
    "TTTTDDDDDDDDTTTT", 
    "TTTTTDDCCDDTTTTT", // Feet position change
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT"
  ];

  const eat1 = [
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTDDTTTTTTDDTTT",
    "TTDCCDDTTDDCCDTT",
    "TTDCCCCCCCCCCDTT",
    "TTDCBDCCCCBDCDTT",
    "TTDCBDCCCCBDCDTT",
    "TTDCCCCPPCCCCDTT",
    "TTDCCCCDDCCCCDTT",
    "TTTDCCCCCCCCDTTT", // Mouth open?
    "TTTTDDDDDDDDTTTT",
    "TTTTTCCCCCCCTTTT",
    "TTTTTDDCCDDTTGGT", // Holding food (G)
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT"
  ];
  
  const eat2 = [
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTDDTTTTTTDDTTT",
    "TTDCCDDTTDDCCDTT",
    "TTDCCCCCCCCCCDTT",
    "TTDCBDCCCCBDCDTT",
    "TTDCBDCCCCBDCDTT",
    "TTDCCCCPPCCCCDTT",
    "TTDCCCCDDCCCCDTT", // Chewing
    "TTTDCCCDDCCCDTTT", 
    "TTTTDDDDDDDDTTTT",
    "TTTTTCCCCCCCTTTT",
    "TTTTTDDCCDDTTTTT", // Food gone/chewing
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT"
  ];

  const dead = [
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTDDTTTTTTDDTTT",
    "TTDCCDDTTDDCCDTT",
    "TTDCCCCCCCCCCDTT",
    "TTDCXXCCCCXXCDTT", // X eyes
    "TTDCXXCCCCXXCDTT",
    "TTDCCCCPPCCCCDTT",
    "TTDCCCCDDCCCCDTT",
    "TTTDCCCCCCCCDTTT",
    "TTTTDDDDDDDDTTTT",
    "TTTTTCCCCCCCTTTT",
    "TTTTTDDCCDDTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT"
  ];

  const sleep1 = [
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTZTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTDDTTTTTTDDTTT",
    "TTDCCDDTTDDCCDTT",
    "TTDCCCCCCCCCCDTT",
    "TTDCCDDCCCDDCDTT", // Eyes closed (D lines)
    "TTDCCCCCCCCCCDTT",
    "TTDCCCCPPCCCCDTT",
    "TTDCCCCDDCCCCDTT",
    "TTTDCCCCCCCCDTTT",
    "TTTTDDDDDDDDTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT"
  ];

  const sleep2 = [
    "TTTTTTTTTTTTTTTT",
    "TTTTZZZTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTDDTTTTTTDDTTT",
    "TTDCCDDTTDDCCDTT",
    "TTDCCCCCCCCCCDTT",
    "TTDCCDDCCCDDCDTT", // Eyes closed
    "TTDCCCCCCCCCCDTT",
    "TTDCCCCPPCCCCDTT",
    "TTDCCCCDDCCCCDTT",
    "TTTDCCCCCCCCDTTT",
    "TTTTDDDDDDDDTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT"
  ];

  const yoga1 = [
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTDDTTTTTTDDTTT",
    "TTDCCDDTTDDCCDTT",
    "TTDCCCCCCCCCCDTT",
    "TTDCCDDCCCDDCDTT", // Eyes closed (Meditation)
    "TTDCCCCCCCCCCDTT",
    "TTDCCCCPPCCCCDTT",
    "TTDCCCCDDCCCCDTT",
    "TTTDCCCCCCCCDTTT",
    "TTTTDCCCCCCDTTTT", // Arms out?
    "TTTTDDDDDDDDTTTT",
    "TTTTTTDDDDTTTTTT", // Lotus legs
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT"
  ];

  let currentMap = idle1;

  if (state === GameState.DEAD) {
    currentMap = dead;
  } else if (state === GameState.EATING) {
    currentMap = frame ? eat1 : eat2;
  } else if (state === GameState.SLEEPING) {
    currentMap = frame ? sleep1 : sleep2;
  } else if (state === GameState.YOGA) {
    currentMap = yoga1; 
  } else {
    currentMap = frame ? idle1 : idle2;
  }

  return (
    <svg viewBox="0 0 16 16" className="w-full h-full rendering-pixelated" style={{ imageRendering: 'pixelated' }}>
      {renderPixels(currentMap)}
    </svg>
  );
};

export default PixelFerret;
