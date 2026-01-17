
import React from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  isSpeaking: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, isSpeaking }) => {
  return (
    <div className="flex items-center justify-center space-x-3 h-20 w-full" dir="ltr">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all duration-500 ${
            isActive
              ? isSpeaking
                ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                : 'bg-[#004b8d] shadow-[0_0_10px_rgba(0,75,141,0.3)]'
              : 'h-1.5 bg-gray-200'
          }`}
          style={{
            animation: isActive ? (isSpeaking ? 'bounce 0.8s infinite' : 'bounce 1.5s infinite') : 'none',
            animationDelay: `${i * 0.15}s`,
            height: isActive ? (isSpeaking ? `${Math.random() * 50 + 20}px` : '15px') : '6px' 
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.5); }
        }
      `}</style>
    </div>
  );
};
