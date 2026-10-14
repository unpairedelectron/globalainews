import { Footer, Header, SeoHead } from '@/components/site';
import { GlucoSmartPrivacyContent } from '@/components/glucosmart-privacy-content';

export function GlucoSmartPrivacyPage() {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground">
        Skip to main content
      </a>
      <Header />
      <div id="main-content" tabIndex={-1} className="scroll-mt-20">
        <SeoHead
          title="GlucoSmart Privacy Policy — Global AI News"
          description="Privacy Policy for GlucoSmart, covering locally stored wellness data, app features, sharing, permissions, export, and deletion."
          path="/glucosmart-privacy"
        />
        <GlucoSmartPrivacyContent />
      </div>
      <Footer />
    </>
  );
}
