// Sample case studies. Replace with real client work as it ships.
export interface Project {
  slug: string;
  title: string;
  cat: string; // short category shown on the card
  client: string;
  date: string;
  services: string[];
  website?: string;
  overview: string;
  approach: { title: string; text: string }[];
}

export const WORK: Project[] = [
  {
    slug: 'orbitly', title: 'Orbitly', cat: 'SaaS platform', client: 'Orbitly', date: 'March 2026',
    services: ['UI/UX design', 'Web app', 'Cloud'],
    overview: 'Orbitly had a capable analytics product that new users could not get through. We rebuilt onboarding, simplified the dashboard and moved the stack to a cloud setup that scales with usage. Activation rose by 240% within the first quarter after launch.',
    approach: [
      { title: 'Stack', text: 'Next.js and TypeScript front end, Node services, PostgreSQL, deployed on AWS with infrastructure as code.' },
      { title: 'Design', text: 'A quiet, data-first interface with one primary action per screen and a component library the team still extends today.' },
      { title: 'Result', text: '+240% activation, 38% shorter time to first insight and a release cadence that moved from monthly to weekly.' },
    ],
  },
  {
    slug: 'mintpay', title: 'Mintpay', cat: 'Fintech app', client: 'Mintpay', date: 'January 2026',
    services: ['Mobile app', 'Brand', 'QA testing'],
    overview: 'A payments start-up needed a mobile app that felt as trustworthy as a bank and as fast as a chat app. We designed the product and brand together, built it cross-platform and ran a structured QA programme before the store launch.',
    approach: [
      { title: 'Stack', text: 'Flutter for iOS and Android, a Node API layer, automated device-farm test runs on every build.' },
      { title: 'Design', text: 'Large, calm numerals, clear states for money in motion and an onboarding that gets a user to their first payment in under two minutes.' },
      { title: 'Result', text: 'A 4.8 store rating at launch and a crash-free rate above 99.7% in the first 60 days.' },
    ],
  },
  {
    slug: 'craftly', title: 'Craftly', cat: 'D2C commerce', client: 'Craftly', date: 'November 2025',
    services: ['E-commerce', 'SEO', 'Performance ads'],
    overview: 'Craftly sold handmade goods through a slow, template store. We rebuilt the storefront for speed, restructured the catalogue for search and paired it with a paid and organic growth plan, tripling revenue in two quarters.',
    approach: [
      { title: 'Stack', text: 'Headless commerce with a React storefront, edge caching and server-side analytics for clean attribution.' },
      { title: 'Design', text: 'Product-led pages, a one-page checkout and photography direction that made every item feel like a gift.' },
      { title: 'Result', text: '3.1x revenue, a 1.9s faster median load and 60% more organic product-page entries.' },
    ],
  },
  {
    slug: 'kinetic', title: 'Kinetic', cat: 'Fitness brand', client: 'Kinetic', date: 'September 2025',
    services: ['Logo design', 'Social media', 'Content'],
    overview: 'A new fitness label wanted an identity with energy and a content engine to match. We designed the logo system, a modular social template kit and a 90-day content calendar that the in-house team now runs on its own.',
    approach: [
      { title: 'Identity', text: 'A motion-ready mark, a high-contrast palette and a type system that holds up from a favicon to a billboard.' },
      { title: 'Content', text: 'Short-form video formats, a weekly rhythm and templates that let non-designers publish on brand.' },
      { title: 'Result', text: '1.2M organic reach in the first quarter and a follower base that doubled without paid support.' },
    ],
  },
  {
    slug: 'fluxa', title: 'Fluxa', cat: 'DevOps overhaul', client: 'Fluxa', date: 'July 2025',
    services: ['DevOps consulting', 'Cloud services'],
    overview: 'Releases at Fluxa took a weekend and a prayer. We audited the pipeline, containerised the services and introduced observability and cost controls. Deploys now happen daily and infrastructure spend fell by 60%.',
    approach: [
      { title: 'Stack', text: 'GitHub Actions, Docker and Kubernetes, Terraform for infrastructure and Grafana for metrics and alerts.' },
      { title: 'Process', text: 'Trunk-based workflow, automated rollbacks and runbooks written with the team that carries the pager.' },
      { title: 'Result', text: '-60% infrastructure cost, deploys from monthly to daily and incident recovery time cut by two thirds.' },
    ],
  },
  {
    slug: 'northwind', title: 'Northwind', cat: 'B2B website', client: 'Northwind', date: 'May 2025',
    services: ['Website design', 'GEO and SEO', 'Analytics'],
    overview: 'Northwind is a logistics software company whose site buried its best proof. We restructured the information architecture, rewrote the story around outcomes and tuned the content for both search engines and AI answer engines.',
    approach: [
      { title: 'Stack', text: 'A statically generated Next.js site, structured data throughout and a lean analytics set-up focused on pipeline.' },
      { title: 'Content', text: 'One page per use case, written around the questions buyers actually ask, with schema and citations for generative search.' },
      { title: 'Result', text: 'Ranking in the top spot for 14 target keywords and 2.3x more qualified demo requests.' },
    ],
  },
  {
    slug: 'zenvia', title: 'Zenvia', cat: 'Analytics suite', client: 'Zenvia', date: 'February 2025',
    services: ['Analytics', 'Dashboard design', 'Custom software'],
    overview: 'Zenvia’s teams lived in spreadsheets. We built a single analytics suite that joins their marketing, sales and product data, with dashboards each team could read without help.',
    approach: [
      { title: 'Stack', text: 'A warehouse-first pipeline, a typed API and a React dashboard with saved views and scheduled reports.' },
      { title: 'Design', text: 'A dark, dense and readable interface where colour carries meaning and every chart answers a single question.' },
      { title: 'Result', text: 'Weekly reporting went from two days to ten minutes and decisions moved from monthly to weekly.' },
    ],
  },
  {
    slug: 'brightloop', title: 'Brightloop', cat: 'Product website', client: 'Brightloop', date: 'December 2024',
    services: ['Web development', 'Website design'],
    overview: 'A fast, accessible marketing site and web app shell for a start-up preparing to launch. We shipped the first version in five weeks and kept iterating with them after go-live.',
    approach: [
      { title: 'Stack', text: 'Next.js, a headless CMS and a design system that carried from the website into the product.' },
      { title: 'Design', text: 'Bold type, honest screenshots and short copy that explains the product in one scroll.' },
      { title: 'Result', text: 'A 98 Lighthouse performance score and a launch-week waiting list that beat the target by 40%.' },
    ],
  },
  {
    slug: 'hexa', title: 'Hexa', cat: 'Custom software', client: 'Hexa', date: 'October 2024',
    services: ['Custom software', 'Cloud services', 'QA testing'],
    overview: 'Hexa ran its operations on a patchwork of tools. We designed and built a custom internal platform that replaced six of them, with role-based access, audit trails and a test suite the team trusts.',
    approach: [
      { title: 'Stack', text: 'A modular Node and React application, PostgreSQL, queue-based jobs and end-to-end tests on every pull request.' },
      { title: 'Process', text: 'Weekly demos with the people who use the tool, so the product followed the work and not the other way round.' },
      { title: 'Result', text: 'Six tools retired, manual hand-offs cut by 70% and onboarding for new staff down from two weeks to two days.' },
    ],
  },
];

export const getProject = (slug: string) => WORK.find((p) => p.slug === slug);
