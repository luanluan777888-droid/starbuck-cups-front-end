"use client";

import { useEffect, useRef } from "react";

interface RedEnvelopeSettings {
  fallSpeed: number;
  rotationSpeed: number;
  windStrength: number;
  sparkleFrequency: number;
  quantity: number;
}

interface RedEnvelopeEffectProps {
  intensity?: "low" | "medium" | "high";
  redEnvelopeSettings?: RedEnvelopeSettings;
}

interface RedEnvelope {
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  speed: number;
  wind: number;
  size: number;
  flipSpeed: number;
  flipProgress: number;
  image?: HTMLImageElement;
}

export default function RedEnvelopeEffect({
  intensity = "medium",
  redEnvelopeSettings,
}: RedEnvelopeEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const envelopesRef = useRef<RedEnvelope[]>([]);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Default settings
  const settings = {
    fallSpeed: redEnvelopeSettings?.fallSpeed ?? 0.3,
    rotationSpeed: redEnvelopeSettings?.rotationSpeed ?? 1.0,
    windStrength: redEnvelopeSettings?.windStrength ?? 0.3,
    // quantity handled in init
  };

  useEffect(() => {
    // Load image
    const img = new Image();
    // Using a base64 placeholder or external URL for the envelope
    // In a real project, this should be in /public/images/red-envelope.png
    // For now, drawing a simple rectangle or using a placeholder
    img.src = "/red-envelope.png"; // Assumption: User needs to add this asset or we draw shapes
    imageRef.current = img;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const initEnvelopes = () => {
      let count = 15;
      if (intensity === "low") count = 10;
      if (intensity === "high") count = 40;
      
      // Override if quantity is set explicitly via settings
      if (redEnvelopeSettings?.quantity) {
        count = redEnvelopeSettings.quantity;
      }

      const envelopes: RedEnvelope[] = [];
      for (let i = 0; i < count; i++) {
        envelopes.push(createEnvelope(canvas.width, canvas.height));
      }
      envelopesRef.current = envelopes;
    };

    const createEnvelope = (width: number, height: number): RedEnvelope => {
      const scale = 0.5 + Math.random() * 0.5; // 0.5x to 1x size
      return {
        x: Math.random() * width,
        y: Math.random() * height - height, // Start above screen randomly
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05 * settings.rotationSpeed,
        speed: (1 + Math.random() * 2) * settings.fallSpeed,
        wind: (Math.random() - 0.5) * settings.windStrength,
        size: 40 * scale, // base size 40px
        flipSpeed: (0.02 + Math.random() * 0.03) * settings.rotationSpeed,
        flipProgress: Math.random() * Math.PI,
      };
    };

    initEnvelopes();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      envelopesRef.current.forEach((env) => {
        env.y += env.speed;
        env.x += env.wind;
        env.rotation += env.rotationSpeed;
        env.flipProgress += env.flipSpeed;

        // Wrap
        if (env.y > canvas.height + 50) {
          env.y = -50;
          env.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(env.x, env.y);
        ctx.rotate(env.rotation);
        
        // Simple 3D flip effect using scaleY
        const scaleY = Math.abs(Math.sin(env.flipProgress));
        ctx.scale(1, scaleY);

        // Draw Envelope (Red Rectangle with Gold Text "福" if image fails or just shape)
        // If we had the image loaded, we would use:
        // if (imageRef.current && imageRef.current.complete) { ... }
        
        // Drawing manually for guarantee it works without asset
        ctx.fillStyle = "#D6001C"; // Lucky Red
        ctx.fillRect(-env.size / 2, -env.size * 0.8 / 2, env.size, env.size * 0.8);
        
        ctx.fillStyle = "#FFD700"; // Gold
        ctx.font = `${env.size * 0.4}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("福", 0, 0);

        ctx.restore();
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [intensity, settings.fallSpeed, settings.rotationSpeed, settings.quantity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ pointerEvents: "none" }}
    />
  );
}
