import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../utils/audioUtils';
import { LIVE_API_MODEL } from '../constants';
import { Message } from '../types';

interface UseGeminiLiveProps {
  apiKey: string;
  systemInstruction: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const useGeminiLive = ({ apiKey, systemInstruction, onConnect, onDisconnect }: UseGeminiLiveProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [realtimeInput, setRealtimeInput] = useState('');
  const [realtimeOutput, setRealtimeOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Audio Context Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Logic Refs
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');

  const connect = useCallback(async () => {
    try {
      setError(null);
      const ai = new GoogleGenAI({ apiKey });
      
      // Initialize Audio Contexts
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      outputNodeRef.current = outputAudioContextRef.current.createGain();
      outputNodeRef.current.connect(outputAudioContextRef.current.destination);

      // Get User Media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: LIVE_API_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: systemInstruction,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          inputAudioTranscription: { model: 'gemini-2.5-flash' }, // Transcribe user input
          outputAudioTranscription: { model: 'gemini-2.5-flash' }, // Transcribe model output
        },
        callbacks: {
          onopen: () => {
            console.log("Live Session Connected");
            setIsConnected(true);
            onConnect?.();

            // Setup Audio Processing (Input)
            if (!inputAudioContextRef.current) return;
            
            inputSourceRef.current = inputAudioContextRef.current.createMediaStreamSource(stream);
            processorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            processorRef.current.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Simple volume calculation for visualizer
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) {
                sum += inputData[i] * inputData[i];
              }
              setVolume(Math.sqrt(sum / inputData.length));

              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            inputSourceRef.current.connect(processorRef.current);
            processorRef.current.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Handle Transcriptions
            if (msg.serverContent?.outputTranscription) {
              const text = msg.serverContent.outputTranscription.text;
              currentOutputTranscriptionRef.current += text;
              setRealtimeOutput(currentOutputTranscriptionRef.current);
            } else if (msg.serverContent?.inputTranscription) {
              const text = msg.serverContent.inputTranscription.text;
              currentInputTranscriptionRef.current += text;
              setRealtimeInput(currentInputTranscriptionRef.current);
            }

            if (msg.serverContent?.turnComplete) {
              // Commit message history on turn complete
              const userText = currentInputTranscriptionRef.current.trim();
              const modelText = currentOutputTranscriptionRef.current.trim();
              
              if (userText) {
                setMessages(prev => [...prev, { role: 'user', text: userText, timestamp: Date.now() }]);
              }
              if (modelText) {
                setMessages(prev => [...prev, { role: 'model', text: modelText, timestamp: Date.now() }]);
              }

              currentInputTranscriptionRef.current = '';
              currentOutputTranscriptionRef.current = '';
              setRealtimeInput('');
              setRealtimeOutput('');
              setIsSpeaking(false);
            }

            // Handle Audio Output
            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current && outputNodeRef.current) {
              setIsSpeaking(true);
              const ctx = outputAudioContextRef.current;
              const audioBytes = base64ToUint8Array(base64Audio);
              const audioBuffer = await decodeAudioData(audioBytes, ctx);
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNodeRef.current);
              
              // Schedule playback
              const currentTime = ctx.currentTime;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              
              activeSourcesRef.current.add(source);
              source.onended = () => {
                activeSourcesRef.current.delete(source);
                if (activeSourcesRef.current.size === 0) {
                  // Approximate speaking end check (fallback if turnComplete is delayed)
                  setTimeout(() => setIsSpeaking(false), 200);
                }
              };
            }

            // Handle Interruptions
            if (msg.serverContent?.interrupted) {
              console.log("Interrupted");
              activeSourcesRef.current.forEach(source => {
                try { source.stop(); } catch (e) {}
              });
              activeSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
              currentOutputTranscriptionRef.current = ''; // Clear pending text
              setRealtimeOutput('');
            }
          },
          onclose: () => {
            setIsConnected(false);
            onDisconnect?.();
          },
          onerror: (e) => {
            console.error("Live API Error", e);
            setError("Connection error. Please try again.");
            setIsConnected(false);
          }
        }
      });
      sessionPromiseRef.current = sessionPromise;

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to initialize audio.");
    }
  }, [apiKey, systemInstruction, onConnect, onDisconnect]);

  const disconnect = useCallback(() => {
    if (sessionPromiseRef.current) {
        // There isn't a strict 'disconnect' on the promise wrapper, but we close resources
        sessionPromiseRef.current.then(session => {
            // Try to close if method exists, otherwise just cleanup client side
            if(session.close) session.close();
        }).catch(() => {});
    }

    // Cleanup Audio
    inputSourceRef.current?.disconnect();
    processorRef.current?.disconnect();
    inputAudioContextRef.current?.close();
    
    activeSourcesRef.current.forEach(s => s.stop());
    activeSourcesRef.current.clear();
    outputAudioContextRef.current?.close();

    setIsConnected(false);
    setIsSpeaking(false);
    setVolume(0);
    setRealtimeInput('');
    setRealtimeOutput('');
    onDisconnect?.();
  }, [onDisconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
        disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    connect,
    disconnect,
    isConnected,
    isSpeaking,
    volume,
    messages,
    realtimeInput,
    realtimeOutput,
    error
  };
};