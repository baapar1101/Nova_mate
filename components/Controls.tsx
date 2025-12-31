import React from 'react';
import { NomiState } from '../types';

interface ControlsProps {
  state: NomiState;
  onListen: () => void;
  lastTranscript: string;
  lastResponse: string;
}

const Controls: React.FC<ControlsProps> = ({ state, onListen, lastTranscript, lastResponse }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-lg mt-8 space-y-6 px-4">
      
      {/* Transcript / Response Display */}
      <div className="w-full bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-800 min-h-[120px] flex flex-col justify-center text-center shadow-lg">
        {state === NomiState.IDLE && !lastTranscript && !lastResponse && (
          <p className="text-gray-400 font-medium">Tap the microphone to wake Nomi.</p>
        )}
        
        {state === NomiState.LISTENING && (
          <p className="text-blue-400 font-semibold animate-pulse">Listening...</p>
        )}
        
        {lastTranscript && state !== NomiState.LISTENING && (
          <p className="text-gray-500 text-sm mb-2">You: "{lastTranscript}"</p>
        )}
        
        {lastResponse && (
           <p className="text-white text-lg font-medium leading-relaxed">"{lastResponse}"</p>
        )}
      </div>

      {/* Main Interaction Button */}
      <button
        onClick={onListen}
        disabled={state === NomiState.LISTENING || state === NomiState.THINKING || state === NomiState.SPEAKING}
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl transition-all duration-300
          ${state === NomiState.LISTENING 
            ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)] scale-110' 
            : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95'}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {state === NomiState.THINKING ? (
           <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 1.5a3 3 0 013 3v4.5a3 3 0 01-6 0v-4.5a3 3 0 013-3z" />
          </svg>
        )}
        
        {/* Ring animation when idle */}
        {state === NomiState.IDLE && (
          <div className="absolute inset-0 rounded-full border border-blue-400 opacity-0 animate-pulse-ring"></div>
        )}
      </button>

      <div className="text-xs text-gray-600 uppercase tracking-widest font-semibold">Nomi Mate v2 Web</div>
    </div>
  );
};

export default Controls;