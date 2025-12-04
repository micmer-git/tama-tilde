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
  const P = '#FFB6C1'; // Pink (Nose/Ears)
  const G = '#556B2F'; // Dark Olive Green (Sick/Dead)
  const T = 'transparent';

  // Helper to render pixel rows
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

  // 16x16 Grid Art - "Idle" Frame 1
  const idle1 = [
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTDDTTTTTTTTT",
    "TTTTDCCDTTTTTTTT",
    "TTTDBCBDTTTTTTTT",
    "TTTDCBDDTTTTTTTT",
    "TTTTDDCDDTTTTTTT",
    "TTTTTCCCDTTTTTTT",
    "TTTTTCCCCDDDDTTT",
    "TTTTTCCCCCCCCDTT",
    "TTTTTCCCCCCCDTTT",
    "TTTTDDCCCDDDTTTT",
    "TTTTTTDDDTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT"
  ];

  // Idle Frame 2 (Bobbing head)
  const idle2 = [
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTDDTTTTTTTTT",
    "TTTTDCCDTTTTTTTT",
    "TTTDBCBDTTTTTTTT",
    "TTTDCBDDTTTTTTTT",
    "TTTTDDCDDTTTTTTT",
    "TTTTTCCCDTTTTTTT",
    "TTTTTCCCCDDDDTTT",
    "TTTTTCCCCCCCCDTT",
    "TTTTTCCCCCCCDTTT",
    "TTTTDDCCCDDDTTTT",
    "TTTTTTDDDTTTTTTT",
    "TTTTTTTTTTTTTTTT"
  ];

  const eat1 = [
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTDDTTTTTTTTT",
    "TTTTDCCDTTTTTTTT",
    "TTTDBCBDTTTTTTTT",
    "TTTDCBDDTTTTGTTT", 
    "TTTTDDCDDTTGGTTT", 
    "TTTTTCCCDTTGGTTT", 
    "TTTTTCCCCDDDDTTT",
    "TTTTTCCCCCCCCDTT",
    "TTTTTCCCCCCCDTTT",
    "TTTTDDCCCDDDTTTT",
    "TTTTTTDDDTTTTTTT",
    "TTTTTTTTTTTTTTTT"
  ];

  const eat2 = [
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTDDTTTTTTTTT",
    "TTTTDCCDTTTTTTTT",
    "TTTDBCBDTTTTTTTT",
    "TTTDCBDDTTTTTTTT", // Mouth open/chew
    "TTTTDDCDDTTTTTTT",
    "TTTTTCCCDTTGTTTT", // Food eaten
    "TTTTTCCCCDDDDTTT",
    "TTTTTCCCCCCCCDTT",
    "TTTTTCCCCCCCDTTT",
    "TTTTDDCCCDDDTTTT",
    "TTTTTTDDDTTTTTTT",
    "TTTTTTTTTTTTTTTT"
  ];

  const dead = [
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTDDTTT",
    "TTTTTTTTTTDCCDTT",
    "TTTTTTTTTDXXBDTT", // X eyes
    "TTTTTTTTDCBDDTTT",
    "TTDDDDDCDDDTTTTT",
    "TDGCCCCCCGGDTTTT",
    "TDGGCCCCGGGDT TTT",
    "TDDDDDDDDDTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT"
  ];

  const sleep1 = [
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTZZZTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTDDDDTTTTTTT",
    "TTTTDCCCCDTTTTTT",
    "TTTDCCCCCDTTTTTT",
    "TTDCCCCCCDTTTTTT",
    "TTDCCCCCDDTTTTTT",
    "TTTDCCCDDTTTTTTT",
    "TTTTDDDDTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT"
  ];

  const sleep2 = [
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTTZTTTTTTTTT",
    "TTTTTTZTTTTTTTTT",
    "TTTTTTTTTTTTTTTT",
    "TTTTTDDDDTTTTTTT",
    "TTTTDCCCCDTTTTTT",
    "TTTDCCCCCDTTTTTT",
    "TTDCCCCCCDTTTTTT",
    "TTDCCCCCDDTTTTTT",
    "TTTDCCCDDTTTTTTT",
    "TTTTDDDDTTTTTTTT",
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
  } else {
    // Idle, Playing, Pooping (use idle for now, poop renders separately)
    currentMap = frame ? idle1 : idle2;
  }

  return (
    <svg viewBox="0 0 16 16" className="w-full h-full rendering-pixelated" style={{ imageRendering: 'pixelated' }}>
      {renderPixels(currentMap)}
    </svg>
  );
};

export default PixelFerret;
