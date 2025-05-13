import React, { useEffect, useRef } from "react";
import "../styles/SpaceBackground.css";

const SpaceBackground = () => {
  const canvasRef = useRef(null);
  const starsRef = useRef([]); // Используем useRef для хранения звезд

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Функция для расчета плотности звезд
    const calculateStarDensity = () => {
      const baseDensity = 0.001; // Базовая плотность (звезд на пиксель)
      return baseDensity * canvas.width * canvas.height;
    };

    // Установка размера canvas на весь экран
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateStars(); // Пересоздание звезд при изменении размера
      drawStars();
    };

    // Генерация звезд с учетом нового размера
    const generateStars = () => {
      const starCount = Math.floor(calculateStarDensity());
      starsRef.current = [];

      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          opacity: Math.random() * 0.9 + 0.1,
          speed: (Math.random() * 0.02 + 0.005) * 0.3,
        });
      }
    };

    // Отрисовка звезд
    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Фон космоса - градиент
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#050a24");
      gradient.addColorStop(1, "#04020f");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Рисуем звезды
      starsRef.current.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });
    };

    // Анимация мерцания звезд
    const animateStars = () => {
      starsRef.current.forEach((star) => {
        star.opacity += star.speed;

        if (star.opacity >= 1 || star.opacity <= 0.1) {
          star.speed = -star.speed;
        }
      });

      drawStars();
      requestAnimationFrame(animateStars);
    };

    // Инициализация и запуск анимации
    resizeCanvas();
    animateStars();

    // Обработка изменения размера окна
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="space-background" />;
};

export default SpaceBackground;