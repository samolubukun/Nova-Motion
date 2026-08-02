/**
 * UGC template library — condensed from the awesome-ai-ugc-video-prompts
 * collection. Each template is a ready-to-speak UGC script (Hook → Problem →
 * Product → Demo → CTA) plus the platforms it works best on. Templates keep
 * claims honest: they describe a creator-style ad concept, never a fake real
 * customer experience.
 *
 * Pure data — safe to import from client components.
 */

export interface UGCTemplate {
  id: string;
  category: string;
  bestFor: string;
  /** Ready-to-speak script that fills the studio prompt box. */
  script: string;
}

export const UGC_TEMPLATES: UGCTemplate[] = [
  {
    id: "meal-planning-app",
    category: "Meal Planning App",
    bestFor: "TikTok ads, Reels ads, app install campaigns, food apps",
    script:
      "I had chicken, rice and no idea what to cook. Dinner time hits and every night it is the same decision fatigue. With this meal planning app I tap one card and dinner is planned in seconds. Try it before dinner tonight.",
  },
  {
    id: "beauty-serum",
    category: "Beauty Serum",
    bestFor: "Beauty brands, skincare, TikTok Shop, Reels ads",
    script:
      "I wanted something simple, not a ten-step routine. This gentle face serum keeps my skincare routine to two minutes. A few drops on clean skin, once a day. Keep your routine simple.",
  },
  {
    id: "ai-app-founder",
    category: "AI App Founder-Style",
    bestFor: "AI tools, SaaS apps, app install ads, founder-led ads, Shorts",
    script:
      "I got tired of opening five different AI tools just to make one post. Images, videos, prompts, models — all in one place. Drop in an image and watch it become a short video. Create everything from one app.",
  },
  {
    id: "desk-organizer",
    category: "Desk Organizer",
    bestFor: "Home office, desk accessories, TikTok product videos, DTC ads",
    script:
      "This corner was stressing me out. Pens, cables and notes scattered everywhere. One desk organizer and every item has its place. Clean up the desk in one minute.",
  },
  {
    id: "portable-blender",
    category: "Portable Blender",
    bestFor: "Kitchen gadgets, e-commerce ads, marketplace videos, Reels and TikTok",
    script:
      "I wanted a smoothie without dragging out the big blender. Fruit in, liquid in, one button. Thirty seconds later it is ready to pour. Make it simple.",
  },
  {
    id: "budgeting-app",
    category: "Budgeting App",
    bestFor: "Fintech apps, app install ads, Shorts, educational UGC",
    script:
      "I did not realize how many small purchases were adding up. This budgeting app groups my spending into simple categories so I can actually see where the money goes. See where your money goes.",
  },
  {
    id: "fitness-product",
    category: "Fitness Product",
    bestFor: "Fitness brands, home gym products, TikTok ads, product demos",
    script:
      "This was taking over my room. A whole pile of weights for one workout. One adjustable dumbbell replaces the whole stack. Save space without giving up training.",
  },
  {
    id: "restaurant-local",
    category: "Local Restaurant",
    bestFor: "Local restaurants, delivery ads, Reels, TikTok food videos",
    script:
      "This is the kind of burger you do not eat quietly. Hot, fresh, and made to order. One bite and you will understand. Order tonight.",
  },
  {
    id: "travel-agency",
    category: "Travel Agency",
    bestFor: "Travel agencies, tourism campaigns, booking funnels, Shorts and Reels",
    script:
      "If you need a quiet weekend, this is the kind of place I would start with. Sunrise water, old town streets, and no complicated planning. The whole route is laid out for you. Plan the weekend before it fills up.",
  },
  {
    id: "course-creator",
    category: "Course Creator",
    bestFor: "Online courses, digital products, creator education, Shorts",
    script:
      "The tool is not the problem. The workflow is. Random prompting gives random results, so this course teaches a repeatable workflow instead. Bad prompt becomes a structured prompt becomes a polished visual. Learn the workflow, not just the tool.",
  },
  {
    id: "jewelry",
    category: "Jewelry Product Demo",
    bestFor: "Jewelry brands, handmade products, Etsy-style marketing, Reels and TikTok",
    script:
      "This is the piece I would style with almost anything. Handmade, minimal, and it works with every outfit. Simple enough for every day.",
  },
  {
    id: "saas-workflow",
    category: "SaaS Workflow",
    bestFor: "SaaS ads, B2B lead generation, founder-led content, explainers",
    script:
      "If your team has tasks in five places, this is the problem. Chats, spreadsheets, emails — everything scattered. This tool pulls it all into one clean timeline. Start with one clean workflow.",
  },
  {
    id: "pet-product",
    category: "Pet Product",
    bestFor: "Pet products, TikTok Shop, e-commerce ads, local pet services",
    script:
      "This is the part nobody talks about. The fur on the couch, on the clothes, everywhere. One gentle pass with this grooming brush and it is handled. Make grooming easier.",
  },
  {
    id: "local-service",
    category: "Local Service",
    bestFor: "Local service ads, home services, Facebook ads, Reels",
    script:
      "This spot was the first thing I noticed when I walked in. One pass with the right tools and it is back to clean. Book a cleaning.",
  },
  {
    id: "app-store-promo",
    category: "App Store Promo",
    bestFor: "App store campaigns, AI tools, creator apps, Shorts and Reels",
    script:
      "I turned one image into a video in a few steps. Upload a photo, pick a style, and it animates right in front of you. Try it with your next image.",
  },
  {
    id: "home-decor",
    category: "Home Decor",
    bestFor: "Home decor, interior products, lifestyle ads, Reels",
    script:
      "This changed the whole mood of the room. The same corner, but now it feels warm and finished. Make the room feel finished.",
  },
  {
    id: "lead-magnet",
    category: "Digital Product Lead Magnet",
    bestFor: "Lead magnets, newsletters, digital downloads, coaching funnels",
    script:
      "Before you post again, check these three things. Most small business owners post without a plan, and it shows. This free checklist turns a random feed into a strategy. Get the free checklist.",
  },
  {
    id: "fashion-tryon",
    category: "Fashion Try-On",
    bestFor: "Fashion brands, apparel ads, TikTok Shop, Instagram Reels",
    script:
      "This is the jacket I would build the outfit around. Clean, minimal, and it layers with everything. Easy everyday layer.",
  },
];

export function getUGCTemplate(id: string): UGCTemplate | undefined {
  return UGC_TEMPLATES.find((t) => t.id === id);
}
