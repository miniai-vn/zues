import React from "react";
import { useTranslations } from "@/hooks/useTranslations";

const Footer = () => {
  const { t } = useTranslations("landingpage");

  return (
    <footer className="w-full bg-white py-0">
      <div className="section-container">
        <p className="text-center text-gray-600 text-sm">
          {t("footer.inspiration")}{" "}
          <a
            href="https://x.com/BrettFromDJ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pulse-500 hover:underline"
          >
            {t("footer.designJoy")}
          </a>{" "}
          {t("footer.builtWith")}{" "}
          <a
            href="https://x.com/rezaul_arif"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pulse-500 hover:underline"
          >
            {t("footer.author")}
          </a>
        </p>
      </div>
    </footer>
  );
};
export default Footer;
