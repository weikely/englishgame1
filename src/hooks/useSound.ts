import { useCallback, useRef } from 'react';

interface SpeechQueueItem {
  text: string;
  lang: string;
  rate: number;
  onEnd?: () => void;
}

export const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const speechQueueRef = useRef<SpeechQueueItem[]>([]);
  const isSpeakingRef = useRef(false);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playNote = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [getAudioContext]);

  const playSuccess = useCallback(() => {
    playNote(523.25, 0.1);
    setTimeout(() => playNote(659.25, 0.1), 100);
    setTimeout(() => playNote(783.99, 0.2), 200);
  }, [playNote]);

  const playError = useCallback(() => {
    playNote(200, 0.2, 'sawtooth');
    setTimeout(() => playNote(150, 0.3, 'sawtooth'), 150);
  }, [playNote]);

  const playCollect = useCallback(() => {
    playNote(880, 0.1, 'sine');
    setTimeout(() => playNote(1100, 0.15, 'sine'), 80);
  }, [playNote]);

  const playCelebration = useCallback(() => {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((note, index) => {
      setTimeout(() => playNote(note, 0.2, 'triangle'), index * 150);
    });
  }, [playNote]);

  const playLevelComplete = useCallback(() => {
    const notes = [392, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((note, index) => {
      setTimeout(() => playNote(note, 0.25, 'triangle'), index * 200);
    });
  }, [playNote]);

  const processSpeechQueue = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    
    if (speechQueueRef.current.length === 0) {
      isSpeakingRef.current = false;
      return;
    }

    isSpeakingRef.current = true;
    const item = speechQueueRef.current.shift()!;
    
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = item.lang;
    utterance.rate = item.rate;
    utterance.pitch = 1.0;
    
    utterance.onend = () => {
      if (item.onEnd) {
        item.onEnd();
      }
      processSpeechQueue();
    };
    
    utterance.onerror = () => {
      processSpeechQueue();
    };
    
    window.speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) return;
    
    speechQueueRef.current.push({
      text,
      lang: 'en-US',
      rate: 0.75,
      onEnd,
    });
    
    if (!isSpeakingRef.current) {
      processSpeechQueue();
    }
  }, [processSpeechQueue]);

  const speakWord = useCallback((word: string) => {
    speak(word);
  }, [speak]);

  const speakSentence = useCallback((sentence: string, onEnd?: () => void) => {
    speak(sentence, onEnd);
  }, [speak]);

  const speakChinese = useCallback((text: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) return;
    
    speechQueueRef.current.push({
      text,
      lang: 'zh-CN',
      rate: 0.9,
      onEnd,
    });
    
    if (!isSpeakingRef.current) {
      processSpeechQueue();
    }
  }, [processSpeechQueue]);

  const cancelSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      speechQueueRef.current = [];
      isSpeakingRef.current = false;
    }
  }, []);

  return {
    playSuccess,
    playError,
    playCollect,
    playCelebration,
    playLevelComplete,
    speak,
    speakWord,
    speakSentence,
    speakChinese,
    cancelSpeech,
  };
};