import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../../services/audioService';

interface AudioVisualizerProps {
  isPlaying: boolean;
  type?: 'bars' | 'wave';
  width?: number;
  height?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  type = 'bars',
  width = 300,
  height = 60
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = 64;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animFrameId.current = requestAnimationFrame(render);

      if (isPlaying) {
        audioEngine.getFrequencyData(dataArray);
      } else {
        // Flat line or gentle idle wave
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.max(0, dataArray[i] - 4);
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (type === 'bars') {
        const barWidth = (canvas.width / bufferLength) * 1.6;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;

          // Crimson gradient
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#ef233c');
          gradient.addColorStop(0.6, '#ff477e');
          gradient.addColorStop(1, '#ffa8ba');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, canvas.height - barHeight, barWidth - 2, barHeight, [3, 3, 0, 0]);
          ctx.fill();

          x += barWidth + 1;
        }
      } else {
        // Waveform mode
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#ef233c';
        ctx.beginPath();

        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isPlaying, type]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        display: 'block',
        borderRadius: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.25)'
      }}
    />
  );
};
