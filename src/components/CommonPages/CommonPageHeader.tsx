"use client";

import React from "react";

// Define props type
interface CommonPageHeaderProps {
  title: string;
  subtitle?: string;
  bg?: string;
}

const CommonPageHeader: React.FC<CommonPageHeaderProps> = ({
  title,
  subtitle,
  bg,
}) => {
  return (
    <section
      className="relative min-h-[50vh] w-full overflow-hidden flex items-center justify-center py-16 md:py-24"
      style={{
        background:
          bg ||
          "linear-gradient(to bottom, #FBB5E7 20%, #FBB5E7 30%, #C4F9FF 90%)",
      }}
    >
      <div className="flex flex-col justify-center text-center pt-20">
        <h1 className="text-5xl md:text-6xl font-bold font-heading text-purple-800 animate-fade-in-up">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl font-subheading text-[#9C2F50] animate-fade-in-up mt-4">
            {subtitle}
          </p>
        )}
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default CommonPageHeader;
