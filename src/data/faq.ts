import type { FaqEntry } from './contracts'
export const FAQS: FaqEntry[] = [
  {
    id: 'faq-1',
    question: 'What is GeneFoundry?',
    answer:
      'GeneFoundry brings a catalog of biomedical MCP servers behind one hosted endpoint. A compatible AI client uses MCP to discover and call tools.'
  },
  {
    id: 'faq-2',
    question: 'Do I need to sign in?',
    answer:
      'Yes. The hosted endpoint uses OAuth browser sign-in. Your AI client may also require its own account or access plan.'
  },
  {
    id: 'faq-3',
    question: 'Which client should I use?',
    answer:
      'Start with the client you already use. We provide guide pages for Claude, ChatGPT, Claude Code, Codex CLI, Cursor, Gemini CLI and VS Code. Each page states whether its setup recipe has been verified.'
  },
  {
    id: 'faq-4',
    question: 'Does one connection include every biomedical database?',
    answer:
      'No. The source catalog lists the integrations included in this website’s catalog. Browse it to find the source you need.'
  },
  {
    id: 'faq-5',
    question: 'Where does the data come from?',
    answer:
      'The catalog links each integration to a named upstream source. Check the returned record and source documentation when interpreting data. An AI-generated summary can contain errors.'
  },
  {
    id: 'faq-6',
    question: 'Do I need upstream API keys?',
    answer:
      'Signing in to GeneFoundry is separate from configuring credentials for an upstream service. Check the router and source integration documentation for the requirements of your deployment.'
  },
  {
    id: 'faq-7',
    question: 'Can I use GeneFoundry for clinical decisions?',
    answer: 'GeneFoundry is for research use only and is not clinical decision support.'
  },
  {
    id: 'faq-8',
    question: 'How can I report a problem?',
    answer:
      'Use the router repository to report a connection issue, or the source integration repository for a source-specific issue. Include reproducible steps and remove credentials and personal data.'
  }
]
