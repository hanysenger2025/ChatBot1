
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { SCHOOL_DATA_CONTEXT, SYSTEM_INSTRUCTION } from '../constants';
import { b64ToUint8Array, arrayBufferToBase64, decodeAudioData, float32ToInt16 } from '../utils/audio-utils';
import { AudioVisualizer } from './AudioVisualizer';

interface LiveChatProps {
  apiKey: string;
}

export const LiveChat: React.FC<LiveChatProps> = ({ apiKey }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanup = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (inputContextRef.current) {
      inputContextRef.current.close();
      inputContextRef.current = null;
    }
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsConnected(false);
    setIsSpeaking(false);
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  const startSession = async () => {
    setError(null);
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate: 24000 });
      audioContextRef.current = audioCtx;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      inputContextRef.current = inputCtx;
      nextStartTimeRef.current = audioCtx.currentTime;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION + "\n\n" + SCHOOL_DATA_CONTEXT,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData16 = float32ToInt16(inputData);
              const base64Data = arrayBufferToBase64(pcmData16.buffer);
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: { mimeType: 'audio/pcm;rate=16000', data: base64Data }
                });
              });
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              setIsSpeaking(true);
              const ctx = audioContextRef.current;
              const pcmData = b64ToUint8Array(base64Audio);
              const audioBuffer = await decodeAudioData(pcmData, ctx, 24000);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              const now = ctx.currentTime;
              if (nextStartTimeRef.current < now) nextStartTimeRef.current = now;
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              };
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e){} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onclose: () => {
            setIsConnected(false);
            setIsSpeaking(false);
          },
          onerror: (err) => {
            setError("حدث خطأ في الاتصال بالصوت.");
            cleanup();
          }
        }
      });
      sessionRef.current = sessionPromise;
    } catch (err) {
      setError("يرجى السماح بالوصول إلى الميكروفون للبدء.");
      cleanup();
    }
  };

  const handleToggle = () => isConnected ? cleanup() : startSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-[550px] bg-white rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-blue-50 p-10 text-center relative overflow-hidden group">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-blue-100/50 transition-colors duration-700"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50/50 rounded-full -ml-16 -mb-16 blur-2xl"></div>

      <div className="relative z-10 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#004b8d] text-xs font-extrabold mb-6 border border-blue-100">
          بث صوتي مشفر وآمن
        </div>
        <h2 className="text-3xl font-black text-[#1e293b] mb-3 tracking-tight">المساعد الصوتي المباشر</h2>
        <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
          اختبر سرعة الاستجابة الصوتية الفورية. تحدث كأنك تخاطب بشراً.
        </p>
      </div>

      <div className="relative mb-12 group">
        <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ${isConnected ? 'bg-blue-400 opacity-30 scale-150' : 'bg-gray-100 opacity-0 scale-50'}`}></div>
        
        <button
          onClick={handleToggle}
          className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform ${
            isConnected 
              ? 'bg-red-500 hover:bg-red-600 ring-8 ring-red-50 scale-110 rotate-180' 
              : 'bg-[#004b8d] hover:bg-[#003d74] ring-8 ring-blue-50 hover:scale-105'
          }`}
        >
          {isConnected ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-10 h-10">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
      </div>

      <div className="w-full max-w-xs relative z-10">
        <AudioVisualizer isActive={isConnected} isSpeaking={isSpeaking} />
      </div>

      {error && (
        <div className="mt-8 text-red-600 bg-red-50 px-6 py-3 rounded-2xl border border-red-100 text-sm font-bold animate-shake">
          {error}
        </div>
      )}
      
      <div className={`mt-8 text-sm font-bold tracking-widest uppercase transition-all duration-500 ${isConnected ? 'text-[#004b8d] animate-pulse' : 'text-gray-400'}`}>
        {isConnected ? 'جارٍ الاستماع... تحدث الآن' : 'اضغط للبدء بالمحادثة'}
      </div>
    </div>
  );
};
