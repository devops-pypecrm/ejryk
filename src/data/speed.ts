// "Our work, on the clock": how fast we typically take each service from idea to live.
export interface SpeedItem {
  cat: string; slug: string; service: string;
  hook: string; headline: string; text: string;
  value: string; unit: string; days: number;
}
export const SPEED: SpeedItem[] = [
  { cat: 'technology-engineering', slug: 'web-development', service: 'Website development', hook: 'Got an idea?', headline: 'We can make it live in one week.', text: 'A fast, clean, search-ready website, designed, built, tested and deployed. No endless back and forth.', value: '1', unit: 'week', days: 7 },
  { cat: 'creative-experience-design', slug: 'ui-ux-design', service: 'UI / UX design', hook: 'Need to see it first?', headline: 'A clickable prototype in five days.', text: 'Tap through your product before a single line of code is written, and change it while it is still cheap.', value: '5', unit: 'days', days: 5 },
  { cat: 'creative-experience-design', slug: 'logo-design', service: 'Brand & logo design', hook: 'Starting from zero?', headline: 'A brand people remember, in two weeks.', text: 'Logo, colours, type and a one-page guide, ready for your website, your cards and your socials.', value: '2', unit: 'weeks', days: 14 },
  { cat: 'technology-engineering', slug: 'ecommerce-development', service: 'E-commerce development', hook: 'Ready to sell online?', headline: 'Your store, taking orders in three weeks.', text: 'Catalogue, payments, shipping and tracking set up and tested, so day one can be sale one.', value: '3', unit: 'weeks', days: 21 },
  { cat: 'technology-engineering', slug: 'mobile-app-development', service: 'Mobile app development', hook: 'Want it in their pocket?', headline: 'A working MVP app in six weeks.', text: 'iOS and Android from one build, launched to real users so you learn before you spend big.', value: '6', unit: 'weeks', days: 42 },
  { cat: 'technology-engineering', slug: 'custom-software-solutions', service: 'Custom software', hook: 'Business stuck on spreadsheets?', headline: 'A custom platform in ten weeks.', text: 'Dashboards, workflows and integrations built around how you actually work, shipped in weekly releases.', value: '10', unit: 'weeks', days: 70 },
  { cat: 'digital-growth-marketing', slug: 'seo', service: 'SEO & growth', hook: 'Want to be found?', headline: 'Climbing the rankings within 60 days.', text: 'Technical fixes, content and links that move you up the page and keep compounding every month.', value: '60', unit: 'days', days: 60 },
  { cat: 'technology-engineering', slug: 'cloud-services', service: 'Cloud & DevOps', hook: 'Releases keep you up at night?', headline: 'Automated, safe deploys in 48 hours.', text: 'A pipeline that tests and ships for you, with monitoring that tells you before your users do.', value: '48', unit: 'hours', days: 2 },
];
