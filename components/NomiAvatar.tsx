import React, { useEffect, useState } from 'react';
import { NomiState } from '../types';

interface NomiAvatarProps {
  state: NomiState;
}

const NomiAvatar: React.FC<NomiAvatarProps> = ({ state }) => {
  const [blink, setBlink] = useState(false);

  // Blinking logic
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      // Only blink if IDLE or SPEAKING (not while thinking intensely)
      if (state === NomiState.IDLE || state === NomiState.SPEAKING) {
        setBlink(true);
        setTimeout(() => setBlink(false), 200);
      }
    }, 4000);

    return () => clearInterval(blinkInterval);
  }, [state]);

  // Styles based on state
  const getEyeStyles = () => {
    const base = "w-16 h-24 bg-white rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.6)]";
    
    switch (state) {
      case NomiState.LISTENING:
        return `${base} h-28 scale-110 shadow-[0_0_30px_rgba(100,200,255,0.8)] bg-blue-50`;
      case NomiState.THINKING:
        return `${base} h-20 animate-pulse`; // Eyes squint slightly while processing
      case NomiState.SPEAKING:
        return `${base} h-24 animate-[bounce_0.5s_infinite]`; // Simple bounce to simulate talking
      case NomiState.HAPPY:
        return `${base} h-12 w-20 rotate-12`; // This logic would need individual eye rotation, handled below
      case NomiState.CONFUSED:
        return `${base} h-24`; 
      default: // IDLE
        return blink ? `${base} !h-1 scale-y-10` : base;
    }
  };

  // Rotation for expressions
  const getLeftEyeTransform = () => {
     if (state === NomiState.HAPPY) return "rotate-[15deg]";
     if (state === NomiState.CONFUSED) return "translate-y-[-10px]";
     if (state === NomiState.THINKING) return "translate-x-[-10px]";
     return "";
  };

  const getRightEyeTransform = () => {
    if (state === NomiState.HAPPY) return "rotate-[-15deg]";
    if (state === NomiState.CONFUSED) return "translate-y-[10px]";
    if (state === NomiState.THINKING) return "translate-x-[10px]";
    return "";
  };

  return (
    <div className="relative w-80 h-80 rounded-full bg-black border-4 border-gray-800 shadow-[0_0_60px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden animate-float">
      {/* Reflection effect */}
      <div className="absolute top-10 right-16 w-20 h-10 bg-white opacity-10 rounded-full rotate-[-45deg] blur-md"></div>
      
      {/* Eyes Container */}
      <div className={`flex gap-10 items-center justify-center transition-transform duration-500 ${state === NomiState.LISTENING ? 'scale-110' : ''}`}>
        
        {/* Left Eye */}
        <div 
          className={`${getEyeStyles()} ${getLeftEyeTransform()}`} 
        />
        
        {/* Right Eye */}
        <div 
          className={`${getEyeStyles()} ${getRightEyeTransform()}`} 
        />
      </div>

      {/* Mouth (Optional - Nomi usually just uses eyes, but a subtle glow helps) */}
      {state === NomiState.SPEAKING && (
        <div className="absolute bottom-20 w-10 h-2 bg-white rounded-full opacity-50 blur-sm animate-pulse"></div>
      )}
    </div>
  );
};

export default NomiAvatar;