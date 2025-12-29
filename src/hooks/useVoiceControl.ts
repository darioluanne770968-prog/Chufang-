import { useState, useEffect, useCallback, useRef } from 'react';
import { triggerHaptic } from '../utils/platform';

interface VoiceCommand {
  keywords: string[];
  action: () => void;
  description: string;
}

interface UseVoiceControlOptions {
  commands: VoiceCommand[];
  language?: string;
  continuous?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

export function useVoiceControl(options: UseVoiceControlOptions) {
  const { commands, language = 'zh-CN', continuous = true, onResult, onError } = options;

  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const text = result[0].transcript.toLowerCase().trim();

        setTranscript(text);
        onResult?.(text);

        if (result.isFinal) {
          // Match commands
          for (const command of commands) {
            for (const keyword of command.keywords) {
              if (text.includes(keyword.toLowerCase())) {
                triggerHaptic(20);
                setLastCommand(command.description);
                command.action();
                return;
              }
            }
          }
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        onError?.(event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening && continuous) {
          recognitionRef.current?.start();
        } else {
          setIsListening(false);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [commands, language, continuous, onResult, onError, isListening]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        triggerHaptic(10);
      } catch {
        console.error('Failed to start speech recognition');
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      triggerHaptic(10);
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    transcript,
    lastCommand,
    startListening,
    stopListening,
    toggleListening,
  };
}

// Predefined cooking commands in Chinese
export const cookingVoiceCommands = {
  nextStep: ['下一步', '继续', '下一个'],
  prevStep: ['上一步', '返回', '上一个'],
  startTimer: ['开始计时', '计时', '启动计时器'],
  stopTimer: ['停止计时', '暂停', '暂停计时'],
  resetTimer: ['重置', '重新计时'],
  readIngredients: ['食材', '材料', '需要什么'],
  repeat: ['重复', '再说一遍'],
  help: ['帮助', '命令'],
};

export default useVoiceControl;
