import { useState, useEffect, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #0a0a0a;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-family: 'Barlow', sans-serif;
  }

  .scene {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Animated grid floor */
  .grid-floor {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background:
      linear-gradient(90deg, rgba(255,160,0,0.08) 1px, transparent 1px),
      linear-gradient(0deg, rgba(255,160,0,0.08) 1px, transparent 1px);
    background-size: 60px 60px;
    transform: perspective(600px) rotateX(50deg);
    transform-origin: bottom center;
    mask-image: linear-gradient(to top, black 0%, transparent 80%);
  }

  /* Scanlines overlay */
  .scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.15) 2px,
      rgba(0,0,0,0.15) 4px
    );
    pointer-events: none;
    z-index: 10;
  }

  /* Floating particles */
  .particles {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: #ffa000;
    border-radius: 50%;
    animation: float linear infinite;
    opacity: 0;
  }

  @keyframes float {
    0% { transform: translateY(100vh) translateX(0); opacity: 0; }
    10% { opacity: 0.7; }
    90% { opacity: 0.5; }
    100% { transform: translateY(-20px) translateX(30px); opacity: 0; }
  }

  /* Main card */
  .card {
    position: relative;
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    animation: cardReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(40px);
  }

  @keyframes cardReveal {
    to { opacity: 1; transform: translateY(0); }
  }

  /* Hexagon accent behind photo */
  .hex-ring {
    position: relative;
    width: 180px;
    height: 180px;
    margin-bottom: -10px;
  }

  .hex-ring::before {
    content: '';
    position: absolute;
    inset: -8px;
    background: conic-gradient(from 0deg, #ffa000, #ff6d00, #ffd740, #ffa000);
    clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
    animation: spin 8s linear infinite;
    border-radius: 2px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .photo-wrap {
    position: absolute;
    inset: 6px;
    clip-path: circle(50%);
    overflow: hidden;
    background: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .photo-initials {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 64px;
    color: #ffa000;
    letter-spacing: 4px;
    text-shadow: 0 0 30px rgba(255,160,0,0.6);
    animation: pulse 3s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { text-shadow: 0 0 20px rgba(255,160,0,0.4); }
    50% { text-shadow: 0 0 50px rgba(255,160,0,0.9), 0 0 80px rgba(255,109,0,0.4); }
  }

  /* Info block */
  .info {
    text-align: center;
    padding: 32px 48px 36px;
    position: relative;
    background: rgba(10,10,10,0.9);
    border: 1px solid rgba(255,160,0,0.2);
    border-top: none;
    min-width: 320px;
  }

  .info::before {
    content: '';
    position: absolute;
    top: 0; left: 20px; right: 20px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #ffa000, transparent);
  }

  /* Corner accents */
  .info::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #ff6d00, #ffa000, #ffd740);
    animation: shimmer 3s ease infinite;
    background-size: 200% 100%;
  }

  @keyframes shimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 52px;
    color: #ffffff;
    letter-spacing: 6px;
    line-height: 1;
    margin-bottom: 4px;
    animation: nameReveal 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
    opacity: 0;
    transform: translateX(-20px);
  }

  @keyframes nameReveal {
    to { opacity: 1; transform: translateX(0); }
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 10px 0;
    animation: fadeIn 1s 0.6s both;
    opacity: 0;
  }

  @keyframes fadeIn {
    to { opacity: 1; }
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,160,0,0.4));
  }

  .divider-line.right {
    background: linear-gradient(90deg, rgba(255,160,0,0.4), transparent);
  }

  .divider-dot {
    width: 4px;
    height: 4px;
    background: #ffa000;
    transform: rotate(45deg);
    box-shadow: 0 0 8px #ffa000;
  }

  .title {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: #ffa000;
    animation: fadeIn 1s 0.8s both;
    opacity: 0;
  }

  .subtitle {
    font-size: 11px;
    font-weight: 300;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin-top: 6px;
    animation: fadeIn 1s 1s both;
    opacity: 0;
  }

  /* Corner brackets */
  .bracket {
    position: absolute;
    width: 16px;
    height: 16px;
    border-color: rgba(255,160,0,0.5);
    border-style: solid;
  }

  .bracket.tl { top: 8px; left: 8px; border-width: 1px 0 0 1px; }
  .bracket.tr { top: 8px; right: 8px; border-width: 1px 1px 0 0; }
  .bracket.bl { bottom: 8px; left: 8px; border-width: 0 0 1px 1px; }
  .bracket.br { bottom: 8px; right: 8px; border-width: 0 1px 1px 0; }

  /* Glitch effect on hover */
  .card:hover .name {
    animation: glitch 0.3s steps(2) infinite;
  }

  @keyframes glitch {
    0% { clip-path: polygon(0 0, 100% 0, 100% 40%, 0 40%); transform: translate(-2px, 0); }
    25% { clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%); transform: translate(2px, 0); }
    50% { clip-path: polygon(0 30%, 100% 30%, 100% 70%, 0 70%); transform: translate(-1px, 0); }
    75% { clip-path: none; transform: translate(0); }
    100% { clip-path: none; transform: translate(0); }
  }

  /* Status badge */
  .status {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
    margin-top: 14px;
    animation: fadeIn 1s 1.2s both;
    opacity: 0;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    background: #4caf50;
    border-radius: 50%;
    box-shadow: 0 0 8px #4caf50;
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .status-text {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
  }
`;

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 8}s`,
  duration: `${6 + Math.random() * 8}s`,
  size: `${1 + Math.random() * 3}px`,
}));

export default function Profile() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="scene">
        <div className="grid-floor" />
        <div className="scanlines" />

        <div className="particles">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                left: p.left,
                bottom: 0,
                width: p.size,
                height: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>

        <div className="card">
          <div className="hex-ring">
            <div className="photo-wrap">
              <span className="photo-initials">FM</span>
            </div>
          </div>

          <div className="info">
            <div className="bracket tl" />
            <div className="bracket tr" />
            <div className="bracket bl" />
            <div className="bracket br" />

            <h1 className="name">Fernando Mendoza</h1>

            <div className="divider">
              <div className="divider-line" />
              <div className="divider-dot" />
              <div className="divider-line right" />
            </div>

            <p className="title">Lube / Tire Technician</p>
            <p className="subtitle">Alignment Tech · Since 2021</p>

            <div className="status">
              <div className="status-dot" />
              <span className="status-text">On Shift</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
