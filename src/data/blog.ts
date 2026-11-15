export interface Post {
  slug: string;
  title: string;
  category: string;
  minutes: number;
  date: string;
  excerpt: string;
  body: string[];
}

export const POSTS: Post[] = [
  {
    slug: 'what-to-ask-before-you-hire-a-software-partner', title: 'What to Ask Before You Hire a Software Partner', category: 'Consulting', minutes: 5, date: 'October 2026',
    excerpt: 'Seven questions that separate a partner who ships from one who only presents.',
    body: [
      'Choosing a software partner is one of the most expensive decisions a growing company makes, and it is usually made on the strength of a pitch deck. A better filter is the conversation you have before the contract.',
      'Ask who will actually do the work. The people in the sales meeting are rarely the people writing the code, and you should meet the second group before you sign. Ask how they handle changes in scope, because every project has them, and the honest answer is a process rather than a promise.',
      'Ask what they would leave out. A partner who can tell you what not to build has understood your business. One who agrees to everything has understood only the invoice.',
      'Finally, ask about the handover. You should own the code, the designs and the documentation from the first milestone, in your accounts, with no lock-in.',
    ],
  },
  {
    slug: 'fast-sites-are-a-business-decision', title: 'Fast Sites Are a Business Decision, Not a Technical One', category: 'Engineering', minutes: 4, date: 'September 2026',
    excerpt: 'Performance is a revenue lever. Here is how to treat it like one.',
    body: [
      'Every extra second of load time costs conversions, and the cost compounds on mobile networks. Speed is not a nice-to-have that engineers can fit in later; it is a product requirement.',
      'The wins are rarely exotic. Ship less JavaScript, size images properly, cache aggressively at the edge and measure real users rather than lab scores.',
      'Set a performance budget at the start of a project and treat a breach like a failing test. Teams that do this stay fast for years; teams that do not spend a quarter on a rescue project.',
    ],
  },
  {
    slug: 'design-systems-for-small-teams', title: 'Design Systems for Small Teams', category: 'Design', minutes: 4, date: 'August 2026',
    excerpt: 'You do not need forty components. You need ten, used consistently.',
    body: [
      'A design system sounds like something for companies with a dedicated team and a large budget. In practice, a small system pays back fastest for small teams, because every decision made once is a decision nobody makes again.',
      'Start with the parts you repeat the most: colour, type, spacing, buttons, forms and cards. Write down the rules in plain language next to the components so that a new designer or developer can use them on day one.',
      'Resist the urge to build for cases you do not have yet. Add a component the second time you need it, not the first.',
    ],
  },
  {
    slug: 'ci-cd-without-the-pager', title: 'CI/CD Without the 2 a.m. Pager', category: 'DevOps', minutes: 6, date: 'July 2026',
    excerpt: 'How to make shipping boring, and why boring is the goal.',
    body: [
      'The best release process is one nobody talks about. Merge, wait, done. Getting there is mostly a matter of removing the manual steps that depend on one person remembering them.',
      'Automate the build, the tests and the deploy first. Then add automatic rollbacks, health checks and alerts that tell you something is wrong before your customers do.',
      'Write the runbook with the people who carry the pager. A document nobody on call has read is not a runbook.',
    ],
  },
  {
    slug: 'mobile-first-is-not-mobile-only', title: 'Mobile First Is Not Mobile Only', category: 'Product', minutes: 3, date: 'June 2026',
    excerpt: 'Designing for the small screen first still means designing for every screen.',
    body: [
      'Starting with the smallest screen forces clarity: one task per view, the most important thing first, controls within thumb reach. Those constraints improve the large-screen version too.',
      'But mobile first is a starting point. Tablets, laptops and wide monitors each deserve a layout that uses the extra space well rather than stretching a phone design across it.',
      'Test on real devices and on slow connections. The gap between a simulator and a mid-range phone on a busy network is where most of the surprises live.',
    ],
  },
  {
    slug: 'seo-and-geo-what-changes', title: 'SEO and GEO: What Actually Changes', category: 'Growth', minutes: 5, date: 'May 2026',
    excerpt: 'Search is now partly answered by AI. Here is how to stay visible in both worlds.',
    body: [
      'Traditional search still sends the majority of traffic, but a growing share of questions is answered directly by AI assistants. Being cited there is a different game from ranking on a results page, and it rewards a different kind of content.',
      'The common thread is clarity. Pages that answer a question completely, in plain language, with structured data and trustworthy sources, perform in both. Thin pages written for keywords do not.',
      'Treat generative engine optimisation as an extension of good SEO rather than a replacement: clear structure, original expertise and technical hygiene come first.',
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
