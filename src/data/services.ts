export interface Service {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  deliverables: string[];
  stack: string[];
  outcome: { value: string; label: string };
  faq: { q: string; a: string }[];
}

export interface Category {
  slug: string;
  title: string;
  short: string;
  tagline: string;
  description: string;
  color: string; // accent
  services: Service[];
}

export const CATEGORIES: Category[] = [
  {
    slug: 'strategy-consulting',
    title: 'Strategy & Consulting',
    short: 'Strategy',
    tagline: 'Know where you are going before you build.',
    description:
      'Brand positioning and engineering strategy that turn ambition into a plan your whole team can execute.',
    color: '#8f4bdc',
    services: [
      {
        slug: 'brand-consulting',
        title: 'Brand Consulting',
        tagline: 'A brand people can explain in one sentence.',
        summary:
          'We dig into your market, audience and story to define a positioning, voice and visual direction that makes you impossible to confuse with anyone else.',
        deliverables: ['Market & competitor audit', 'Positioning and messaging framework', 'Brand voice & tone guide', 'Naming and tagline options', 'Brand architecture', 'Launch narrative and roadmap'],
        stack: ['Workshops', 'Figma', 'Miro', 'Notion', 'User interviews'],
        outcome: { value: '3x', label: 'clearer message recall in brand tests' },
        faq: [
          { q: 'How long does brand consulting take?', a: 'Most engagements run 3 to 6 weeks, from audit to a signed-off brand platform.' },
          { q: 'Do you also design the identity?', a: 'Yes. Strategy flows straight into our logo and graphic design team so nothing is lost in handover.' },
        ],
      },
      {
        slug: 'devops-consulting',
        title: 'DevOps Consulting',
        tagline: 'Ship daily without the 2am pager.',
        summary:
          'We audit your pipelines, infrastructure and release process, then design a CI/CD and observability setup that makes shipping fast, safe and boring.',
        deliverables: ['Delivery pipeline audit', 'CI/CD design & implementation', 'Infrastructure as code', 'Monitoring, logging & alerting', 'Cost optimisation plan', 'Team playbooks & training'],
        stack: ['GitHub Actions', 'Docker', 'Kubernetes', 'Terraform', 'AWS / GCP / Azure', 'Grafana'],
        outcome: { value: '-60%', label: 'infrastructure cost, on average' },
        faq: [
          { q: 'Can you work with our existing cloud?', a: 'Yes. We meet you on AWS, GCP, Azure or on-prem and improve what is already there.' },
          { q: 'Do you train our team?', a: 'Every engagement ends with runbooks and a hands-on handover so your team owns the system.' },
        ],
      },
    ],
  },
  {
    slug: 'creative-experience-design',
    title: 'Creative & Experience Design',
    short: 'Design',
    tagline: 'Interfaces and identities that feel alive.',
    description:
      'From the logo on a favicon to the checkout on a phone, we design every touchpoint to look sharp and convert.',
    color: '#f2c935',
    services: [
      {
        slug: 'logo-design',
        title: 'Logo Design',
        tagline: 'A mark that works at 16px and on a billboard.',
        summary: 'Memorable, flexible logo systems built from your brand strategy, delivered with the files and rules to use them everywhere.',
        deliverables: ['Logo concepts and refinement', 'Responsive logo variants', 'Colour & typography system', 'Icon and favicon set', 'Brand guidelines PDF', 'All source files'],
        stack: ['Illustrator', 'Figma', 'After Effects'],
        outcome: { value: '5 days', label: 'to first concepts' },
        faq: [{ q: 'How many concepts do we get?', a: 'Three distinct directions, then unlimited refinement rounds on the one you pick.' }, { q: 'Do we own the logo?', a: 'Fully. Full rights and source files on final payment.' }],
      },
      {
        slug: 'industrial-product-design',
        title: 'Industrial Product Design',
        tagline: 'Physical products with digital-grade polish.',
        summary: 'From sketch to manufacturable CAD, we design hardware and physical products that are beautiful, ergonomic and ready to produce.',
        deliverables: ['Research and sketching', '3D modelling & renders', 'Prototypes', 'Material & finish selection', 'Manufacturing-ready files', 'Packaging design'],
        stack: ['Fusion 360', 'SolidWorks', 'KeyShot', 'Blender'],
        outcome: { value: '1st', label: 'prototype in 3 weeks' },
        faq: [{ q: 'Can you manage manufacturing?', a: 'We prepare production files and introduce vetted manufacturing partners.' }, { q: 'Do you design IoT devices?', a: 'Yes, and our engineers handle the companion app and cloud.' }],
      },
      {
        slug: 'graphic-design',
        title: 'Graphic Design',
        tagline: 'Visuals that stop the scroll.',
        summary: 'Campaign creatives, decks, social packs, print and motion graphics. Consistent, on-brand and made to be shared.',
        deliverables: ['Social media creative kits', 'Pitch & sales decks', 'Print collateral', 'Motion graphics', 'Illustrations & icons', 'Design templates your team can reuse'],
        stack: ['Figma', 'Photoshop', 'Illustrator', 'After Effects', 'Lottie'],
        outcome: { value: '48h', label: 'typical turnaround' },
        faq: [{ q: 'Do you offer monthly design retainers?', a: 'Yes. A fixed monthly capacity of design hours with a shared board.' }, { q: 'Can you edit our existing files?', a: 'Of course. Send what you have and we will extend it.' }],
      },
      {
        slug: 'ui-ux-design',
        title: 'UI/UX Design',
        tagline: 'Products people understand in five seconds.',
        summary: 'Research-led product design: flows, wireframes, prototypes and a design system your developers will actually enjoy using.',
        deliverables: ['User research & personas', 'Journey maps and flows', 'Wireframes & clickable prototypes', 'Visual UI design', 'Design system & component library', 'Usability testing'],
        stack: ['Figma', 'FigJam', 'Maze', 'Storybook', 'Hotjar'],
        outcome: { value: '+38%', label: 'average task completion' },
        faq: [{ q: 'Do you test with real users?', a: 'Yes. Every project includes at least one round of moderated or unmoderated testing.' }, { q: 'Will developers get specs?', a: 'Pixel-accurate specs, tokens and a Storybook-ready component library.' }],
      },
      {
        slug: 'website-design',
        title: 'Website Design',
        tagline: 'Sites with a pulse, not brochures.',
        summary: 'Bold, interactive, SEO-ready website design that explains your business fast and pushes visitors toward the one action that matters.',
        deliverables: ['Sitemap and content structure', 'Desktop, tablet & mobile design', 'Interactions and micro-animations', 'CMS-ready page templates', 'Accessibility review', 'Handover to development'],
        stack: ['Figma', 'Framer Motion', 'Webflow', 'Next.js'],
        outcome: { value: '2.4x', label: 'conversion lift on redesigns' },
        faq: [{ q: 'Do you build it too?', a: 'Yes. Design and development sit in one team so what you approve is what ships.' }, { q: 'How long does a website take?', a: 'A marketing site is usually 4 to 8 weeks end to end.' }],
      },
      {
        slug: 'mobile-experience',
        title: 'Mobile Experience',
        tagline: 'Thumb-friendly, native-feeling, delightful.',
        summary: 'iOS and Android app design that respects platform conventions while still having a personality of its own.',
        deliverables: ['Platform-native UI kits', 'Gesture and motion design', 'Onboarding flows', 'App store assets', 'Prototype on device', 'Dev handoff'],
        stack: ['Figma', 'Principle', 'Lottie', 'Flutter', 'React Native'],
        outcome: { value: '4.8★', label: 'average store rating' },
        faq: [{ q: 'Native or cross-platform?', a: 'We design for both and advise on the right build approach for your roadmap.' }, { q: 'Do you handle store listings?', a: 'Yes: screenshots, copy and previews.' }],
      },
      {
        slug: 'commerce-experience',
        title: 'Commerce Experience',
        tagline: 'Shopping journeys that remove every excuse.',
        summary: 'Product pages, carts and checkouts designed around buyer psychology and tested against your real funnel data.',
        deliverables: ['Funnel & drop-off analysis', 'Product & collection page design', 'Cart and checkout optimisation', 'Upsell and bundle patterns', 'Loyalty and account flows', 'A/B test plan'],
        stack: ['Figma', 'Shopify', 'Hotjar', 'GA4', 'Optimizely'],
        outcome: { value: '+27%', label: 'checkout completion' },
        faq: [{ q: 'Which platforms do you support?', a: 'Shopify, WooCommerce, headless setups and fully custom stores.' }, { q: 'Can you improve an existing store?', a: 'Yes. A CRO audit is often the highest-ROI place to start.' }],
      },
    ],
  },
  {
    slug: 'technology-engineering',
    title: 'Technology & Engineering',
    short: 'Engineering',
    tagline: 'Production-grade software, shipped in weeks.',
    description:
      'Web, mobile, commerce and custom platforms engineered to be fast, secure and easy to evolve.',
    color: '#b48cf0',
    services: [
      {
        slug: 'web-development',
        title: 'Web Development',
        tagline: 'Fast sites and web apps that scale quietly.',
        summary: 'Modern, performant web applications built with the stack your team can hire for, tuned for Core Web Vitals and SEO from day one.',
        deliverables: ['Next.js / React front-ends', 'APIs and back-ends', 'CMS integration', 'Authentication & roles', 'Performance & SEO tuning', 'CI/CD and hosting setup'],
        stack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind'],
        outcome: { value: '95+', label: 'Lighthouse scores, standard' },
        faq: [{ q: 'Which stack do you use?', a: 'We default to TypeScript, React/Next.js and Node, and choose differently when your needs call for it.' }, { q: 'Do you offer maintenance?', a: 'Yes, monthly support plans with SLAs.' }],
      },
      {
        slug: 'mobile-app-development',
        title: 'Mobile App Development',
        tagline: 'One idea, in every pocket.',
        summary: 'iOS and Android apps built with Flutter, React Native or native code, from MVP to app-store scale.',
        deliverables: ['iOS & Android apps', 'Backend and API', 'Push notifications & deep links', 'Payments and subscriptions', 'Store submission', 'Analytics & crash reporting'],
        stack: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Firebase'],
        outcome: { value: '12 wks', label: 'idea to store, typical MVP' },
        faq: [{ q: 'Flutter or React Native?', a: 'We pick based on your team, performance needs and roadmap, and explain why.' }, { q: 'Do you publish the app for us?', a: 'Yes, we handle both stores end to end.' }],
      },
      {
        slug: 'ecommerce-development',
        title: 'E-commerce Development',
        tagline: 'Stores that sell while you sleep.',
        summary: 'Shopify, headless and custom commerce builds with fast storefronts, clean catalogue ops and the integrations your business runs on.',
        deliverables: ['Storefront build', 'Payments, tax & shipping', 'Inventory & ERP integrations', 'Migration from old platform', 'Subscription & B2B flows', 'Speed and SEO optimisation'],
        stack: ['Shopify', 'WooCommerce', 'Medusa', 'Stripe', 'Razorpay', 'Next.js'],
        outcome: { value: '3.1x', label: 'revenue growth, flagship client' },
        faq: [{ q: 'Can you migrate our store?', a: 'Products, customers, orders and SEO redirects, with zero downtime planning.' }, { q: 'Do you build custom features?', a: 'Yes: bundles, configurators, marketplaces and more.' }],
      },
      {
        slug: 'custom-software-solutions',
        title: 'Custom Software Solutions',
        tagline: 'When off-the-shelf stops fitting.',
        summary: 'ERPs, CRMs, portals, dashboards and automation built around the way your business really works, not the other way around.',
        deliverables: ['Discovery & architecture', 'Custom web / desktop software', 'Third-party integrations', 'Workflow automation', 'Data migration', 'Training & documentation'],
        stack: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker'],
        outcome: { value: '-70%', label: 'manual work in automated flows' },
        faq: [{ q: 'Who owns the software?', a: 'You do, source code included.' }, { q: 'Can you build in phases?', a: 'Yes. We ship a usable first release early and grow it.' }],
      },
      {
        slug: 'cloud-services',
        title: 'Cloud Services',
        tagline: 'Infrastructure that scales and stays cheap.',
        summary: 'Cloud architecture, migration and managed operations on AWS, GCP and Azure with security and cost control built in.',
        deliverables: ['Architecture design', 'Cloud migration', 'Serverless & containers', 'Security hardening', 'Backups and disaster recovery', '24/7 monitoring'],
        stack: ['AWS', 'GCP', 'Azure', 'Kubernetes', 'Terraform', 'Cloudflare'],
        outcome: { value: '99.99%', label: 'uptime targets' },
        faq: [{ q: 'Will migration cause downtime?', a: 'We plan phased cutovers designed for near-zero downtime.' }, { q: 'Can you manage it after launch?', a: 'Yes, with managed ops and on-call plans.' }],
      },
      {
        slug: 'quality-assurance-testing',
        title: 'Quality Assurance & Testing',
        tagline: 'Find the bugs before your users do.',
        summary: 'Manual, automated and performance testing wired into your release pipeline so every deploy is a calm one.',
        deliverables: ['Test strategy & plans', 'Automated E2E and API suites', 'Performance & load testing', 'Security and accessibility checks', 'Device lab coverage', 'Release sign-off reports'],
        stack: ['Playwright', 'Cypress', 'Jest', 'k6', 'BrowserStack', 'Postman'],
        outcome: { value: '-85%', label: 'production bugs after QA setup' },
        faq: [{ q: 'Can you plug into our sprints?', a: 'Yes, QA engineers embed in your team and ceremonies.' }, { q: 'Do you test mobile devices?', a: 'Real devices and cloud farms for iOS and Android.' }],
      },
    ],
  },
  {
    slug: 'digital-growth-marketing',
    title: 'Digital Growth & Marketing',
    short: 'Growth',
    tagline: 'Get found, get clicked, get customers.',
    description:
      'Search, social, paid and content engines measured end to end, so every rupee and every post is accountable.',
    color: '#e6d9fb',
    services: [
      {
        slug: 'seo',
        title: 'SEO',
        tagline: 'Rank where your buyers are already looking.',
        summary: 'Technical, on-page and authority SEO programmes that compound month over month and are reported in revenue, not just rankings.',
        deliverables: ['Technical SEO audit & fixes', 'Keyword and intent strategy', 'On-page optimisation', 'Content roadmap', 'Link building', 'Monthly performance reporting'],
        stack: ['Search Console', 'Semrush', 'Ahrefs', 'Screaming Frog', 'GA4'],
        outcome: { value: '#1', label: 'for target keywords within 6 months' },
        faq: [{ q: 'How long until SEO works?', a: 'Expect early movement in 6 to 8 weeks and strong compounding from month 4.' }, { q: 'Do you guarantee rankings?', a: 'No one honest can; we guarantee a transparent plan and measurable progress.' }],
      },
      {
        slug: 'geo',
        title: 'GEO (Generative Engine Optimisation)',
        tagline: 'Be the answer AI quotes.',
        summary: 'Optimise your brand and content to be cited by ChatGPT, Gemini, Perplexity and AI Overviews as search shifts to answers.',
        deliverables: ['AI visibility audit', 'Entity and schema optimisation', 'Answer-ready content structure', 'Citation and mention building', 'LLM-friendly site architecture', 'AI traffic tracking'],
        stack: ['Schema.org', 'Perplexity', 'ChatGPT', 'Gemini', 'Profound', 'Search Console'],
        outcome: { value: 'New', label: 'channel most competitors ignore' },
        faq: [{ q: 'How is GEO different from SEO?', a: 'SEO earns links in a results page; GEO earns citations inside the AI answer. They reinforce each other.' }, { q: 'Can you measure it?', a: 'Yes, we track brand mentions and referral traffic from AI engines.' }],
      },
      {
        slug: 'social-media-management',
        title: 'Social Media Management',
        tagline: 'A feed people choose to follow.',
        summary: 'Strategy, content, community and reporting across Instagram, LinkedIn, X, YouTube and more, with a voice that sounds human.',
        deliverables: ['Channel strategy', 'Monthly content calendar', 'Posts, reels and carousels', 'Community management', 'Influencer outreach', 'Analytics reports'],
        stack: ['Meta Business', 'LinkedIn', 'Buffer', 'Canva', 'CapCut'],
        outcome: { value: '1.2M', label: 'monthly reach for a fitness brand' },
        faq: [{ q: 'Do you create the content?', a: 'Yes: copy, design and video, approved in your shared board.' }, { q: 'Which platforms?', a: 'We focus on the two or three where your audience actually lives.' }],
      },
      {
        slug: 'performance-marketing',
        title: 'Performance Marketing',
        tagline: 'Paid media that pays back.',
        summary: 'Google, Meta, LinkedIn and programmatic campaigns tuned against CAC and ROAS, with creative testing running every week.',
        deliverables: ['Account & funnel audit', 'Campaign build and creative', 'Landing page optimisation', 'Conversion tracking setup', 'Weekly optimisation', 'Transparent dashboards'],
        stack: ['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'GTM', 'Looker Studio'],
        outcome: { value: '4.2x', label: 'average blended ROAS' },
        faq: [{ q: 'What ad budget do we need?', a: 'We scope to your margin and goals; most start between a few thousand dollars a month.' }, { q: 'Who owns the ad accounts?', a: 'You always do.' }],
      },
      {
        slug: 'content-marketing',
        title: 'Content Marketing',
        tagline: 'Content with a point of view and a purpose.',
        summary: 'Articles, case studies, newsletters, video and thought leadership designed to attract, educate and convert your ideal buyers.',
        deliverables: ['Editorial strategy', 'Long-form articles & guides', 'Case studies', 'Email newsletters', 'Video scripts', 'Distribution plan'],
        stack: ['Notion', 'Webflow', 'Mailchimp', 'Descript', 'Surfer'],
        outcome: { value: '5x', label: 'organic traffic in 9 months' },
        faq: [{ q: 'Who writes the content?', a: 'Subject-aware writers edited by strategists, reviewed by you.' }, { q: 'Do you write technical content?', a: 'Yes. Our engineers review technical pieces.' }],
      },
      {
        slug: 'analytics',
        title: 'Analytics',
        tagline: 'Numbers you trust, dashboards you use.',
        summary: 'Tracking plans, GA4 and server-side setups, attribution and live dashboards so decisions are made on data, not guesses.',
        deliverables: ['Measurement plan', 'GA4 & GTM implementation', 'Server-side tracking', 'Attribution modelling', 'Custom dashboards', 'Experimentation roadmap'],
        stack: ['GA4', 'GTM', 'BigQuery', 'Looker Studio', 'Mixpanel', 'Segment'],
        outcome: { value: '1 view', label: 'of every channel and funnel' },
        faq: [{ q: 'Can you fix broken tracking?', a: 'It is usually our first task: we audit and repair what you have.' }, { q: 'Do you handle privacy compliance?', a: 'Consent mode and cookie compliance are set up as standard.' }],
      },
    ],
  },
];

export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const getService = (cat: string, slug: string) => getCategory(cat)?.services.find((s) => s.slug === slug);
export const ALL_SERVICES = CATEGORIES.flatMap((c) => c.services.map((s) => ({ ...s, category: c })));
