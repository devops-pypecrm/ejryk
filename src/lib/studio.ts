import { readText } from "./files";

// Marketing Studio: each tool is a prompt recipe run on Claude.
export interface Tool { id: string; label: string; hint: string; folder: string; instruction: string }

export const TOOLS: Tool[] = [
  { id: "blog", label: "Blog post", hint: "Topic + target keyword", folder: "blog",
    instruction: "Write an SEO and AI-search-friendly blog post (900-1,200 words). Start with a 2-3 sentence direct answer, then a table of contents, sections phrased as questions, a short FAQ and a call to action to /contact. Markdown. No invented statistics." },
  { id: "social", label: "Social posts", hint: "Topic or offer + platform(s)", folder: "social",
    instruction: "Write 5 social posts for the platforms named in the brief (default LinkedIn and Instagram). Each has a hook line, a short body, a call to action and 3-5 hashtags. Vary the angle: tip, result, behind-the-scenes, question, offer." },
  { id: "ads", label: "Ad copy", hint: "Offer, audience, platform (Google/Meta)", folder: "campaigns",
    instruction: "Write ad copy: 5 headlines (max 30 characters each), 3 descriptions (max 90 characters each) and 3 longer primary texts for Meta (max 125 characters before the fold). Give each a distinct angle. Count characters and stay within limits." },
  { id: "seo-meta", label: "SEO titles & meta", hint: "Page topic or paste the current page text", folder: "research",
    instruction: "For the page described, write 3 title tag options (max 60 characters), 3 meta descriptions (max 155 characters), one H1, and 8 related keywords with search intent. Explain in one line which option you recommend." },
  { id: "email", label: "Outreach email", hint: "Who you're writing to + why", folder: "campaigns",
    instruction: "Write a short cold outreach email (under 120 words) with 3 subject line options, plus a follow-up email for 4 days later. Specific, no hype, one clear ask." },
  { id: "proposal", label: "Proposal outline", hint: "Client, goal, scope, budget range", folder: "proposals",
    instruction: "Write a client proposal in Markdown: summary of their problem, proposed solution, scope, phased timeline, deliverables, what we need from them, and next steps. Leave price as 'TODO: confirm'. Do not invent guarantees." },
  { id: "case-study", label: "Case study", hint: "Client, problem, what we did, results", folder: "case-studies",
    instruction: "Write a case study with sections: Challenge, Approach, Result, and a pull quote placeholder. Only use facts from the brief; mark anything missing as 'TODO: confirm'." },
  { id: "ideas", label: "Content ideas", hint: "Focus area or month", folder: "research",
    instruction: "Give 12 content ideas for the next 4 weeks mixing blog, LinkedIn, Instagram and short video. For each: a working title, the channel, the reader's question it answers and the call to action." },
];

export const toolById = (id: unknown) => TOOLS.find((t) => t.id === id);

// Brand context from the workspace (zenitzu-ops/context) so every tool speaks in our voice.
export async function brandContext() {
  let out = "";
  for (const f of ["context/brand-voice.md", "context/services.md", "context/audience.md"]) {
    try { out += `\n\n## ${f}\n${(await readText(f)).content}`; } catch { /* file missing: skip */ }
  }
  return out.slice(0, 7000);
}

export async function systemFor(t: Tool) {
  return `You are the marketing team of Zenitzu Tech Solutions, a web and software agency in Kochi, India. Follow the brand context below.\n${t.instruction}\nOutput only the finished work in Markdown, no preamble.\n\nBRAND CONTEXT${await brandContext()}`;
}
