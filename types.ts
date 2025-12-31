export enum NomiState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  THINKING = 'THINKING',
  SPEAKING = 'SPEAKING',
  HAPPY = 'HAPPY',
  CONFUSED = 'CONFUSED'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface VoiceConfig {
  lang: string;
  pitch: number;
  rate: number;
}