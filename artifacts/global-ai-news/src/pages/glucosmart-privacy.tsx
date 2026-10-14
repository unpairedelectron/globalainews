import { Footer, Header, SeoHead } from '@/components/site';

const container = 'editorial-page mx-auto max-w-[1440px] px-5 md:px-10';

const sections = [
  {
    id: 'wellness',
    title: '1. General wellness and non-medical disclaimer',
    paragraphs: [
      'GlucoSmart is a general wellness, hydration, and nutrition-planning application designed for self-tracking and habit formation. It is not a medical device and does not provide medical advice, clinical diagnoses, lab interpretations, or treatment recommendations.',
      'Blood glucose trend summaries, calorie targets, and meal suggestions are for informational and educational purposes only. Always consult a qualified healthcare professional before changing your diet, medication, or diabetes management plan.',
    ],
  },
  {
    id: 'information',
    title: '2. Information you provide',
    paragraphs: [
      'By default, GlucoSmart uses a local-first privacy architecture. Information you enter is stored locally on your device using on-device storage and is not automatically uploaded to external cloud servers. This includes:',
    ],
    items: [
      ['Biometric and profile preferences', 'Name, age, biological sex, height, weight, activity level, and personal wellness goals used to calculate estimated calorie, macro, and hydration targets.'],
      ['Dietary and cultural preferences', 'Saved dietary preferences (for example, vegetarian or eggetarian), regional cuisines (North Indian, South Indian, Maharashtrian, Bengali, or any), and meal styles (everyday, Jain-style, Navratri-style vrat, or Ekadashi-style fast).'],
      ['Self-logged wellness data', 'Manually entered fasting blood glucose readings, personal target ranges, daily water intake counts, and completed meal or walk habit check-ins.'],
      ['Grocery and meal plans', 'Custom weekly meal schedules and checked shopping-list items.'],
    ],
  },
  {
    id: 'use',
    title: '3. How we use your information',
    paragraphs: ['Data entered into GlucoSmart is processed locally on your device solely to provide core app functionality, including to:'],
    items: [
      ['Personalize estimates', 'Calculate portion multipliers, hydration goals, and non-repeating daily meal schedules.'],
      ['Plan groceries', 'Generate one-week-ahead grocery lists that adapt when you swap meals.'],
      ['Show historical summaries', 'Display non-diagnostic, descriptive summaries of your self-logged fasting blood glucose entries, such as 7-, 14-, and 30-day rolling averages.'],
      ['Send local reminders', 'Trigger device reminders for scheduled meals, hydration check-ins, and post-meal walks.'],
    ],
  },
  {
    id: 'sharing',
    title: '4. Data sharing and user-initiated exports',
    paragraphs: [
      'We do not sell, rent, trade, or share your personal data, biometric data, or self-logged blood glucose readings with advertising networks, data brokers, or third parties.',
      'If you choose to share a recipe card, grocery list, or data export using your phone’s native share sheet (for example, with WhatsApp, email, or Notes), you initiate that action. The information you share is then governed by the privacy policy of the app you choose.',
    ],
  },
  {
    id: 'permissions',
    title: '5. Device permissions',
    paragraphs: ['GlucoSmart may request limited device permissions to support the app:'],
    items: [
      ['Notifications and alarms', 'Used exclusively for local reminders about scheduled meals, hydration, and movement.'],
      ['Local storage', 'Used to save profile preferences, glucose logs, and grocery lists on your device.'],
    ],
  },
  {
    id: 'retention',
    title: '6. Data retention, export, and deletion',
    paragraphs: ['Your data remains under your control while stored on your device:'],
    items: [
      ['Export your data', 'Export saved profile preferences, meal history, and logged glucose entries from the app settings in a portable format.'],
      ['Delete your data', 'Permanently delete individual logs, reset meal memory, or clear all app data using the in-app Reset / Delete Data controls. You can also clear the app’s storage or uninstall GlucoSmart from your device.'],
    ],
  },
  {
    id: 'children',
    title: '7. Children’s privacy',
    paragraphs: [
      'GlucoSmart is intended for general audiences aged 18 and older. We do not knowingly collect personal information from children under the age of 13.',
    ],
  },
  {
    id: 'changes',
    title: '8. Changes to this Privacy Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time to reflect new app features or regulatory requirements. Updates will be posted on this page with a revised “Last Updated” date.',
    ],
  },
  {
    id: 'contact',
    title: '9. Contact us',
    paragraphs: [
      'For questions, concerns, or requests about this Privacy Policy or how GlucoSmart handles your data, contact the owner directly:',
    ],
  },
] as const;

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
      <main
        data-testid="glucosmart-privacy-policy"
        className={`${container} min-h-[60vh] max-w-[1180px] py-14 md:py-20`}
      >
        <p className="eyebrow text-primary">GlucoSmart · Privacy policy</p>
        <h1 className="mt-6 max-w-4xl font-serif text-6xl leading-[.88] md:text-8xl">
          Privacy Policy
        </h1>
        <div className="mt-7 flex flex-wrap gap-x-8 gap-y-2 border-y border-foreground/15 py-4 text-sm text-muted-foreground">
          <p>Effective date: <time dateTime="2026-10-14">October 14, 2026</time></p>
          <p>Last updated: <time dateTime="2026-10-14">October 14, 2026</time></p>
          <p>Owner / developer: Shiv Shakti Mishra</p>
        </div>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground">
          GlucoSmart is operated by Shiv Shakti Mishra. This policy explains how GlucoSmart handles,
          stores, and protects information when you use the mobile application and web services.
        </p>

        <nav aria-label="Privacy policy sections" className="mt-8 border-l-2 border-primary pl-5">
          <p className="eyebrow text-primary">On this page</p>
          <ol className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a className="underline decoration-primary/40 underline-offset-2 hover:text-primary" href={`#${section.id}`}>
                  {section.title.replace(/^\d+\.\s*/, '')}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 max-w-3xl">
          {sections.map((section) => (
            <section
              id={section.id}
              key={section.id}
              className="scroll-mt-24 border-t border-foreground/15 py-6"
            >
              <h2 className="font-serif text-3xl">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-base leading-7 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              {'items' in section && (
                <ul className="mt-4 grid gap-4">
                  {section.items.map(([label, detail]) => (
                    <li key={label} className="border-l-2 border-accent pl-4 text-base leading-7 text-muted-foreground">
                      <strong className="text-foreground">{label}: </strong>{detail}
                    </li>
                  ))}
                </ul>
              )}
              {section.id === 'contact' && (
                <address className="mt-4 not-italic text-base leading-7 text-muted-foreground">
                  <p><strong className="text-foreground">Owner / developer:</strong> Shiv Shakti Mishra</p>
                  <p><strong className="text-foreground">Email:</strong>{' '}
                    <a className="text-primary underline underline-offset-2" href="mailto:samfischer14aug@gmail.com">
                      samfischer14aug@gmail.com
                    </a>
                  </p>
                  <p><strong className="text-foreground">Location:</strong> Pune, Maharashtra, India</p>
                </address>
              )}
            </section>
          ))}
        </div>
      </main>
      </div>
      <Footer />
    </>
  );
}
