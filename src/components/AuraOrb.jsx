import React, { useEffect, useRef } from 'react';

export default function AuraOrb({ 
  isListening = false, 
  isSpeaking = false, 
  personality = 'prime', 
  primaryColor = '#00F0FF',
  size = 220,
  onClick
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Base radius modulation
      const pulseSpeed = isSpeaking ? 0.08 : isListening ? 0.05 : 0.02;
      step += pulseSpeed;

      const activityMultiplier = isSpeaking ? 1.4 : isListening ? 1.25 : 1.0;
      const baseRadius = (size * 0.28) * (1 + Math.sin(step) * 0.06 * activityMultiplier);

      // 1. Outer Glow Aura Wave Rings
      for (let i = 3; i >= 1; i--) {
        const ringRadius = baseRadius + (i * 22) + Math.sin(step + i) * 8;
        const gradient = ctx.createRadialGradient(
          centerX, centerY, baseRadius * 0.4,
          centerX, centerY, ringRadius
        );

        gradient.addColorStop(0, `${primaryColor}22`);
        gradient.addColorStop(0.5, `${primaryColor}11`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Liquid Wavy Aura Core Layers
      const layers = [
        { color: primaryColor, alpha: 0.7, offset: 0, points: 8 },
        { color: '#FFFFFF', alpha: 0.5, offset: Math.PI / 4, points: 6 },
        { color: primaryColor, alpha: 0.85, offset: Math.PI / 2, points: 10 }
      ];

      layers.forEach((layer, idx) => {
        ctx.save();
        ctx.beginPath();

        const numPoints = layer.points;
        for (let i = 0; i <= numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          const wave = Math.sin(step * 2 + angle * 3 + layer.offset) * (isSpeaking ? 12 : 5);
          const r = baseRadius + wave;
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();

        const coreGradient = ctx.createRadialGradient(
          centerX - 10, centerY - 10, 5,
          centerX, centerY, baseRadius
        );
        coreGradient.addColorStop(0, '#FFFFFF');
        coreGradient.addColorStop(0.3, layer.color);
        coreGradient.addColorStop(1, `${layer.color}44`);

        ctx.fillStyle = coreGradient;
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = isSpeaking ? 35 : isListening ? 25 : 18;
        ctx.fill();
        ctx.restore();
      });

      // 3. Floating Ethereal Energy Particles
      const numParticles = isSpeaking ? 16 : 8;
      for (let p = 0; p < numParticles; p++) {
        const particleAngle = step * 0.6 + (p * ((Math.PI * 2) / numParticles));
        const particleDist = baseRadius * 1.3 + Math.cos(step + p) * 15;
        const px = centerX + Math.cos(particleAngle) * particleDist;
        const py = centerY + Math.sin(particleAngle) * particleDist;

        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(1, 2 + Math.sin(step * 2 + p) * 1.5), 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isListening, isSpeaking, personality, primaryColor, size]);

  return (
    <div 
      onClick={onClick}
      className="relative flex items-center justify-center cursor-pointer transition-transform duration-300 active:scale-95 select-none"
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        width={size * 1.5}
        height={size * 1.5}
        className="w-full h-full"
      />

      {/* Center Holographic Icon / Pulse State */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
          isSpeaking 
            ? 'scale-150 bg-white shadow-lg' 
            : isListening 
            ? 'scale-125 bg-red-400 animate-ping' 
            : 'bg-white/80 opacity-70'
        }`} />
      </div>
    </div>
  );
}
