import { useEffect, useRef, useState } from "react";
import LottieAnimation from "./LottieAnimation";
import { useTranslations } from "@/hooks/useTranslations";

const Hero = () => {
  const { t } = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [lottieData, setLottieData] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetch("/loop-header.lottie")
      .then((response) => response.json())
      .then((data) => setLottieData(data));
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !imageRef.current) return;
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      imageRef.current.style.transform = `perspective(1000px) rotateY(${
        x * 2.5
      }deg) rotateX(${-y * 2.5}deg) scale3d(1.02, 1.02, 1.02)`;
    };
    const handleMouseLeave = () => {
      if (!imageRef.current) return;
      imageRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const elements = document.querySelectorAll(".parallax");
      elements.forEach((el) => {
        const element = el as HTMLElement;
        const speed = parseFloat(element.dataset.speed || "0.1");
        const yPos = -scrollY * speed;
        element.style.setProperty("--parallax-y", `${yPos}px`);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <section
      className="overflow-hidden relative bg-cover bg-gradient-to-br from-[hsl(var(--primary)/0.12)] via-[hsl(var(--background))] to-[hsl(var(--secondary)/0.18)]"
      id="hero"
      style={{
        backgroundImage: "url('/background-section1.png')",
        backgroundPosition: "center 30%",
        padding: isMobile ? "100px 12px 40px" : "120px 20px 60px",
      }}
    >
      <div className="absolute -top-[10%] -right-[5%] w-1/2 h-[70%] bg-[hsl(var(--primary)/0.15)] blur-3xl rounded-full"></div>
      <div className="container px-4 sm:px-6 lg:px-8" ref={containerRef}>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div
              className="pulse-chip mb-3 sm:mb-6 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] mr-2">
                01
              </span>
              <span>{t('hero.badge')}</span>
            </div>            <h1
              className="section-title text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight animate-fade-in text-[hsl(var(--foreground))]"
              style={{ animationDelay: "0.3s" }}
            >
              {t('hero.title')}
            </h1>            <p
              style={{ animationDelay: "0.5s" }}
              className="section-subtitle mt-3 sm:mt-6 mb-4 sm:mb-8 leading-relaxed text-[hsl(var(--foreground))] font-normal text-base sm:text-lg animate-fade-in"
            >
              {t('hero.description')}
            </p>
          </div>
          <div className="w-full lg:w-1/2 relative mt-6 lg:mt-0 flex justify-center items-center">
            {lottieData ? (
              <div
                className="relative z-10 animate-fade-in"
                style={{ animationDelay: "0.9s" }}
              >
                <LottieAnimation
                  animationPath={lottieData}
                  className="w-full h-auto max-w-lg mx-auto"
                  loop={true}
                  autoplay={true}
                />
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-[hsl(var(--background))] rounded-2xl sm:rounded-3xl -z-10 shadow-xl"></div>
                <div className="relative transition-all duration-500 ease-out overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
                  <img
                    ref={imageRef}
                    src="/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png"
                    alt="Atlas Robot"
                    className="w-full h-auto object-cover transition-transform duration-500 ease-out"
                    style={{ transformStyle: "preserve-3d" }}
                  />
                  <div
                    className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
                    style={{ backgroundImage: 'url("/hero-image.jpg")' }}
                  ></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className="hidden lg:block absolute bottom-0 left-1/4 w-64 h-64 bg-[hsl(var(--primary)/0.08)] rounded-full blur-3xl -z-10 parallax"
        data-speed="0.05"
      ></div>
    </section>
  );
};

export default Hero;
