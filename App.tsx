import React, { useState, useEffect, useCallback, useRef } from 'react';
import NomiAvatar from './components/NomiAvatar';
import Controls from './components/Controls';
import { NomiState } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { SpeechService } from './services/speechService';

const App: React.FC = () => {
  const [state, setState] = useState<NomiState>(NomiState.IDLE);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  
  const speechService = useRef<SpeechService | null>(null);

  useEffect(() => {
    // Initialize Speech Service
    speechService.current = new SpeechService(
      (text) => {
        setTranscript(text);
        handleConversation(text);
      },
      () => {
        // On speech end (silence detected), if we haven't transitioned to thinking, go back to idle
        // Note: handleConversation handles the transition to thinking
      },
      (error) => {
        console.error("Speech Error:", error);
        setState(NomiState.CONFUSED);
        setTimeout(() => setState(NomiState.IDLE), 2000);
      }
    );
  }, []);

  const handleConversation = useCallback(async (userText: string) => {
    setState(NomiState.THINKING);
    
    // Call Gemini
    const aiResponse = await sendMessageToGemini(userText);
    setResponse(aiResponse);
    
    // Speak Response
    setState(NomiState.SPEAKING);
    speechService.current?.speak(aiResponse, () => {
      setState(NomiState.IDLE);
    });
  }, []);

  const startListening = () => {
    if (!process.env.API_KEY) {
        alert("Please provide a valid API_KEY in the environment.");
        return;
    }
    setState(NomiState.LISTENING);
    setTranscript('');
    setResponse('');
    speechService.current?.start();
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black pointer-events-none"></div>
      
      {/* Header */}
      <div className="absolute top-6 w-full flex justify-between px-8 text-gray-500 text-sm font-mono tracking-widest z-10">
        <span>NOMI SYSTEM</span>
        <span>CONNECTED</span>
      </div>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center">
        <NomiAvatar state={state} />
        <Controls 
          state={state} 
          onListen={startListening}
          lastTranscript={transcript}
          lastResponse={response}
        />
      </div>
      
      {/* Footer Ambient Glow */}
      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default App;