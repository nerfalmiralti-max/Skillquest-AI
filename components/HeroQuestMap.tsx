"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  r: number;
  color: string;
  phase: number;
};

const nodes: Node[] = [
  { x: 0.16, y: 0.68, r: 10, color: "#19a06f", phase: 0 },
  { x: 0.28, y: 0.46, r: 13, color: "#2671d9", phase: 0.8 },
  { x: 0.44, y: 0.58, r: 11, color: "#d89a18", phase: 1.6 },
  { x: 0.58, y: 0.34, r: 15, color: "#e35d33", phase: 2.4 },
  { x: 0.75, y: 0.48, r: 12, color: "#19a06f", phase: 3.2 },
  { x: 0.86, y: 0.26, r: 18, color: "#111827", phase: 4.0 }
];

export function HeroQuestMap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const canvasElement = canvas;
    const ctx = context;
    let frame = 0;
    let animationId = 0;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const rect = canvasElement.getBoundingClientRect();
      canvasElement.width = Math.floor(rect.width * dpr);
      canvasElement.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      const width = canvasElement.clientWidth;
      const height = canvasElement.clientHeight;
      frame += 0.012;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#f7f3ea";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(17, 24, 39, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 46) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 46) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const points = nodes.map((node) => ({
        ...node,
        px: node.x * width,
        py: node.y * height + Math.sin(frame * 2 + node.phase) * 8
      }));

      ctx.lineCap = "round";
      points.forEach((point, index) => {
        const next = points[index + 1];
        if (!next) {
          return;
        }
        ctx.beginPath();
        ctx.moveTo(point.px, point.py);
        const midX = (point.px + next.px) / 2;
        const midY = (point.py + next.py) / 2 - 44;
        ctx.quadraticCurveTo(midX, midY, next.px, next.py);
        ctx.strokeStyle = `rgba(38, 113, 217, ${0.22 + Math.sin(frame * 3 + index) * 0.08})`;
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      points.forEach((point, index) => {
        const pulse = 1 + Math.sin(frame * 3 + point.phase) * 0.08;
        ctx.beginPath();
        ctx.arc(point.px, point.py, point.r * 2.5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `${point.color}1c`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(point.px, point.py, point.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = point.color;
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
        ctx.stroke();

        ctx.fillStyle = index === points.length - 1 ? "#ffffff" : "#111827";
        ctx.font = "700 12px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(index === points.length - 1 ? "B" : `${index + 1}`, point.px, point.py);
      });

      ctx.fillStyle = "rgba(17, 24, 39, 0.72)";
      ctx.font = "700 13px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Daily Quest Route", 28, 34);

      ctx.fillStyle = "rgba(17, 24, 39, 0.52)";
      ctx.font = "600 12px system-ui, sans-serif";
      ctx.fillText("XP nodes, streak camp, boss gate", 28, 56);

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-mask absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
