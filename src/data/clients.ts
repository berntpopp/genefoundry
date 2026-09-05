import type { ClientGuide } from './contracts'

export const CLIENT_GUIDES: ClientGuide[] = [
  {
    id: 'claude-ai',
    label: 'Claude in your browser',
    summary:
      'Add GeneFoundry as a custom connector in Claude, then enable it in your conversation.',
    hint: 'Web and Claude Desktop',
    documentation: [
      {
        label: 'Claude connector instructions',
        url: 'https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp'
      }
    ],
    prerequisites: [
      'Sign in at claude.ai. The individual-account steps below follow Claude’s Pro/Max instructions.',
      'For Team or Enterprise, an owner must first add the connector under Organization settings → Connectors.'
    ],
    steps: [
      'Open Customize → Connectors in Claude.',
      'Choose + → Add custom connector. Name it GeneFoundry and enter https://genefoundry.org/mcp as the remote MCP URL.',
      'Choose Add, then Connect if prompted. Complete the GeneFoundry sign-in in your browser.',
      'In a new conversation, open + → Connectors and enable GeneFoundry. Paste an example prompt.'
    ],
    verification: [
      'Start a new conversation with GeneFoundry enabled and try one of the example prompts below.',
      'Expand the tool activity in the conversation to see the GeneFoundry calls and returned records.'
    ],
    troubleshooting: [
      'If Add custom connector is unavailable, check your account’s connector access or ask your workspace owner.',
      'An added connector must also be enabled in the conversation. Look under + → Connectors.'
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Claude connector instructions',
          url: 'https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp'
        }
      ],
      limitation:
        'Instructions checked against current official documentation; this add-and-sign-in flow has not been executed in the browser.'
    },
    recipeState: 'documentation-only',
    code: null,
    recipeTest: null
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT in your browser',
    summary:
      'Connect GeneFoundry through ChatGPT’s custom MCP interface and select it when you ask a question.',
    hint: 'Web · developer mode required',
    documentation: [
      {
        label: 'ChatGPT MCP setup',
        url: 'https://developers.openai.com/plugins/deploy/connect-chatgpt'
      },
      {
        label: 'Apps interface and workspace access',
        url: 'https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt-beta'
      }
    ],
    prerequisites: [
      'Use a ChatGPT account with developer mode and custom MCP access. Workspace policy can restrict these controls.'
    ],
    steps: [
      'Open ChatGPT Settings → Security and login and enable Developer mode.',
      'Open ChatGPT Plugins, select +, and give the connection the name GeneFoundry.',
      'Under Connection, choose the public-endpoint option and enter https://genefoundry.org/mcp. Create the connection and complete OAuth sign-in when asked.',
      'Review the discovered tools. Start a new chat and add GeneFoundry from the tools menu, then paste an example prompt.'
    ],
    verification: [
      'Start a new conversation with GeneFoundry enabled and try one of the example prompts below.',
      'Expand the tool activity in the conversation to see the GeneFoundry calls and returned records.'
    ],
    troubleshooting: [
      'If your account has Apps instead of Plugins, use Settings → Apps → Advanced settings for developer mode, then Apps → Create. Enter the endpoint, choose OAuth, Scan Tools, and Create. Workspace admins can use Workspace settings → Apps.',
      'If developer mode or creation controls are missing, check the linked access guide or ask your workspace admin.',
      'If a follow-up needs new data, select or mention GeneFoundry again.'
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'ChatGPT MCP setup',
          url: 'https://developers.openai.com/plugins/deploy/connect-chatgpt'
        },
        {
          label: 'Apps interface and workspace access',
          url: 'https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt-beta'
        }
      ],
      limitation:
        'Instructions checked against current official documentation; this add-and-sign-in flow has not been executed in the browser.'
    },
    recipeState: 'documentation-only',
    code: null,
    recipeTest: null
  },
  {
    id: 'claude-code',
    label: 'Claude Code',
    summary: 'Add the HTTP server from your terminal, then authenticate inside Claude Code.',
    hint: 'Terminal',
    documentation: [
      {
        label: 'Official setup reference',
        url: 'https://code.claude.com/docs/en/mcp'
      }
    ],
    prerequisites: ['Install Claude Code and sign in to your Claude account.'],
    steps: [
      'Run the add command below in the project where you want to use GeneFoundry.',
      'Start Claude Code, run /mcp, select GeneFoundry and complete authentication in your browser.',
      'Ask a question using GeneFoundry, or paste one of the tested examples.'
    ],
    verification: [
      'Ask the client to use GeneFoundry to look up HNF1B in gnomAD. Expand its tool activity to check the call and returned record.'
    ],
    troubleshooting: [
      'If the server is missing in another project, review the scope in which you added it.',
      'If project configuration is awaiting approval, review and approve it in Claude Code before retrying discovery.'
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Claude Code official MCP documentation',
          url: 'https://code.claude.com/docs/en/mcp'
        }
      ],
      limitation:
        'Setup syntax checked against client documentation; adding a fresh connection has not been tested here.'
    },
    recipeState: 'documented',
    code: 'claude mcp add --transport http genefoundry https://genefoundry.org/mcp',
    recipeTest: null
  },
  {
    id: 'codex',
    label: 'Codex CLI',
    summary: 'Register the remote server in Codex CLI and complete its OAuth login.',
    hint: 'Terminal',
    documentation: [
      {
        label: 'Official setup reference',
        url: 'https://developers.openai.com/codex/mcp/'
      }
    ],
    prerequisites: ['Install Codex CLI and complete its account setup.'],
    steps: [
      'Run the two commands below to add GeneFoundry and start OAuth login.',
      'Complete the browser sign-in, then return to Codex and try an example prompt.'
    ],
    verification: [
      'Ask the client to use GeneFoundry to look up HNF1B in gnomAD. Expand its tool activity to check the call and returned record.'
    ],
    troubleshooting: [
      'A saved server configuration is separate from successful authorization. Check both before retrying discovery.',
      'Do not carry OAuth flags from another client or an older recipe into your configuration without checking your installed CLI help.'
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Codex CLI official MCP documentation',
          url: 'https://developers.openai.com/codex/mcp/'
        }
      ],
      limitation:
        'Setup syntax checked against client documentation; adding a fresh connection has not been tested here.'
    },
    recipeState: 'documented',
    code: 'codex mcp add genefoundry --url https://genefoundry.org/mcp\ncodex mcp login genefoundry',
    recipeTest: null
  },
  {
    id: 'cursor',
    label: 'Cursor',
    summary: 'Add the GeneFoundry URL to Cursor’s MCP configuration.',
    hint: 'Editor · .cursor/mcp.json',
    documentation: [
      {
        label: 'Official setup reference',
        url: 'https://cursor.com/docs/mcp'
      }
    ],
    prerequisites: ['Open a project in Cursor with access to its agent features.'],
    steps: [
      'Merge the genefoundry entry below into .cursor/mcp.json for this project, or ~/.cursor/mcp.json for your user. Preserve any existing servers.',
      'Open Cursor’s MCP settings, enable GeneFoundry, and complete its OAuth sign-in.',
      'Use Agent chat and ask it to query GeneFoundry.'
    ],
    verification: [
      'Ask the client to use GeneFoundry to look up HNF1B in gnomAD. Expand its tool activity to check the call and returned record.'
    ],
    troubleshooting: [
      'If the server appears in only one project, check the configuration location.',
      'Review the MCP server’s enabled state and authentication prompt in Cursor; configuration alone does not confirm discovery.'
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Cursor official MCP documentation',
          url: 'https://cursor.com/docs/mcp'
        }
      ],
      limitation:
        'Setup syntax checked against client documentation; adding a fresh connection has not been tested here.'
    },
    recipeState: 'documented',
    code: '{\n  "mcpServers": {\n    "genefoundry": {\n      "url": "https://genefoundry.org/mcp"\n    }\n  }\n}',
    recipeTest: null
  },
  {
    id: 'gemini',
    label: 'Gemini CLI',
    summary: 'Configure GeneFoundry as a Streamable HTTP server in Gemini CLI.',
    hint: 'Terminal · settings.json',
    documentation: [
      {
        label: 'Official setup reference',
        url: 'https://geminicli.com/docs/tools/mcp-server/'
      }
    ],
    prerequisites: ['Install Gemini CLI and complete its account setup.'],
    steps: [
      'Merge the entry below into your Gemini settings.json under mcpServers, preserving existing entries.',
      'Start Gemini CLI, use /mcp to inspect the server, and follow the client’s authentication flow.',
      'Ask it to use GeneFoundry for an example question.'
    ],
    verification: [
      'Ask the client to use GeneFoundry to look up HNF1B in gnomAD. Expand its tool activity to check the call and returned record.'
    ],
    troubleshooting: [
      'Check the HTTP transport setting and the settings file that your current workspace loads.',
      'If browser authorization has not completed, follow the official MCP authentication instructions before retrying discovery.'
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Gemini CLI official MCP documentation',
          url: 'https://geminicli.com/docs/tools/mcp-server/'
        }
      ],
      limitation:
        'Setup syntax checked against client documentation; adding a fresh connection has not been tested here.'
    },
    recipeState: 'documented',
    code: '{\n  "mcpServers": {\n    "genefoundry": {\n      "httpUrl": "https://genefoundry.org/mcp"\n    }\n  }\n}',
    recipeTest: null
  },
  {
    id: 'vscode',
    label: 'VS Code',
    summary: 'Add a remote HTTP MCP server to VS Code and use it in agent chat.',
    hint: 'Editor · .vscode/mcp.json',
    documentation: [
      {
        label: 'Official setup reference',
        url: 'https://code.visualstudio.com/docs/agent-customization/mcp-servers'
      }
    ],
    prerequisites: ['Open a trusted VS Code workspace with access to agent chat.'],
    steps: [
      'Merge the server entry below into .vscode/mcp.json for your workspace.',
      'Start GeneFoundry from the MCP configuration editor and review its trust and OAuth prompts.',
      'Open agent chat, enable the GeneFoundry tools, and try an example prompt.'
    ],
    verification: [
      'Ask the client to use GeneFoundry to look up HNF1B in gnomAD. Expand its tool activity to check the call and returned record.'
    ],
    troubleshooting: [
      'If tools are not offered, check server startup, trust and tool selection in the client.',
      'If configuration is ignored, confirm it uses VS Code’s schema rather than another editor’s mcpServers configuration.'
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'VS Code official MCP documentation',
          url: 'https://code.visualstudio.com/docs/agent-customization/mcp-servers'
        }
      ],
      limitation:
        'Setup syntax checked against client documentation; adding a fresh connection has not been tested here.'
    },
    recipeState: 'documented',
    code: '{\n  "servers": {\n    "genefoundry": {\n      "type": "http",\n      "url": "https://genefoundry.org/mcp"\n    }\n  }\n}',
    recipeTest: null
  }
]
