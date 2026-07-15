import { useEffect, useRef } from "react";
import "./Background.css";

export default function Background() {
  const canvasRef = useRef(null);
  const glowRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initial position for cursor-glow
    mouseRef.current.x = window.innerWidth / 2;
    mouseRef.current.y = window.innerHeight / 2;
    mouseRef.current.targetX = window.innerWidth / 2;
    mouseRef.current.targetY = window.innerHeight / 2;

    // Create particles
    const particles = [];
    const particleCount = 45; // balanced for performance and beauty
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.8 + 0.6,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        // purple, blue, cyan colors
        color: Math.random() > 0.6 
          ? "rgba(168, 85, 247, " 
          : Math.random() > 0.3 
            ? "rgba(59, 130, 246, " 
            : "rgba(6, 182, 212, ",
        alpha: Math.random() * 0.25 + 0.08,
        depth: Math.random() * 0.7 + 0.3, // for parallax layering
      });
    }

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      
      // Update interactive glow position directly on the ref for GPU acceleration
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${e.clientX - 250}px, ${e.clientY - 250}px, 0)`;
        glowRef.current.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = "0";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      const mouse = mouseRef.current;
      // Lerp mouse coordinate transitions
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Normal drift
        p.x += p.speedX;
        p.y += p.speedY;

        // Mouse attraction/push
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 250) {
          const force = (250 - dist) / 250 * 0.08 * p.depth;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Apply mouse position offset (parallax)
        const parallaxX = (mouse.x - canvas.width / 2) * 0.015 * p.depth;
        const parallaxY = (mouse.y - canvas.height / 2) * 0.015 * p.depth;

        let drawX = p.x + parallaxX;
        let drawY = p.y + parallaxY;

        // Wrap around boundaries
        if (drawX < 0) p.x = canvas.width;
        if (drawX > canvas.width) p.x = 0;
        if (drawY < 0) p.y = canvas.height;
        if (drawY > canvas.height) p.y = 0;

        // Render particles with a soft outer glow
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = `${p.color}${p.alpha * 1.5})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="bg-container">
      {/* Subtle futuristic grid pattern with radial fading mask */}
      <div className="bg-grid"></div>

      {/* Floating glowing background gradient blobs */}
      <div className="bg-blob blob-purple"></div>
      <div className="bg-blob blob-blue"></div>
      <div className="bg-blob blob-cyan"></div>

      {/* Futuristic floating light beams */}
      <div className="bg-beam beam-left"></div>
      <div className="bg-beam beam-right"></div>

      {/* GPU optimized interactive cursor glow */}
      <div ref={glowRef} className="bg-cursor-glow"></div>

      {/* Floating Canvas particles */}
      <canvas ref={canvasRef} className="bg-canvas" />

      {/* Ambient vignette shading layer to keep high contrast for texts */}
      <div className="bg-vignette"></div>
    </div>
  );
}
