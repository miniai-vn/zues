"use client";
import DetailsSection from "@/components/DetailsSection";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HumanoidSection from "@/components/HumanoidSection";
import ImageShowcaseSection from "@/components/ImageShowcaseSection";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import SpecsSection from "@/components/SpecsSection";
import Testimonials from "@/components/Testimonials";
import { I18nProvider } from "@/providers/I18nProvider";
import { useEffect } from "react";

const Index = () => {
  // Initialize intersection observer to detect when elements enter viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    // This helps ensure smooth scrolling for the anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (this: HTMLAnchorElement, e) {
        e.preventDefault();

        const targetId = this.getAttribute("href")?.substring(1);
        if (!targetId) return;

        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        // Increased offset to account for mobile nav
        const offset = window.innerWidth < 768 ? 100 : 80;

        window.scrollTo({
          top: targetElement.offsetTop - offset,
          behavior: "smooth",
        });
      });
    });
  }, []);
  return (
    <I18nProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="space-y-4 sm:space-y-8">
          <Hero />
          <HumanoidSection />
          <SpecsSection />
          <DetailsSection />
          <ImageShowcaseSection />
          <Features />
          <Testimonials />
          <Newsletter />
          {/* <MadeByHumans /> */}
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
};

export default Index;
