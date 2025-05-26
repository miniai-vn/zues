import React from "react";

const SpecsSection = () => {
  return (
    <section
      className="w-full py-6 sm:py-10 bg-[hsl(var(--background))]"
      id="specifications"
    >
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header with badge and line */}
        <div className="flex items-center gap-4 mb-8 sm:mb-16">
          <div className="flex items-center gap-4">
            <div className="pulse-chip">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] mr-2">
                3
              </span>
              <span className="text-[hsl(var(--foreground))]">Specs</span>
            </div>
          </div>
          <div className="flex-1 h-[1px] bg-[hsl(var(--border))]"></div>
        </div>

        {/* Main content with text mask image - responsive text sizing */}
        <div className="max-w-5xl pl-4 sm:pl-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display leading-tight mb-8 sm:mb-12">
            <span className="block bg-clip-text text-transparent bg-[url('/text-mask-image.jpg')] bg-cover bg-center">
              Bằng cách tự động hóa tác vụ lặp đi lặp lại, nâng cao bảo mật hệ
              thống và học hỏi liên tục từ quy trình nội bộ, Mi9 giúp doanh
              nghiệp tối ưu vận hành để con người tập trung vào những giá trị
              cốt lõi: sáng tạo, ra quyết định và đổi mới.
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
};

export default SpecsSection;
