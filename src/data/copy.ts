import type { SiteCopy } from './contracts'
export const COPY: SiteCopy = {
  hero: {
    title: 'Biomedical databases in your AI chat.',
    lead: 'Look up genes, compare variant records and explore phenotype associations. Use GeneFoundry from Claude, ChatGPT or another MCP client.',
    definition:
      'GeneFoundry connects biomedical databases through the Model Context Protocol (MCP).',
    primaryAction: 'Connect your client',
    secondaryAction: 'See a real example',
    requirements: 'Browser sign-in required · Research use only'
  },
  sources: {
    heading: 'Find a data source',
    lead: 'Search by database name, data type or research area.',
    searchLabel: 'Search sources',
    searchPlaceholder: 'Try gnomAD, phenotype or literature',
    categoryLabel: 'Research area',
    allCategories: 'All research areas',
    clearSearch: 'Clear search',
    clearFilters: 'Clear filters',
    previewAction: 'View all sources',
    noResults: 'No sources match your search.',
    noResultsHelp: 'Try another source name or clear the filters.'
  },
  evidence: {
    heading: 'See what you can ask',
    intro: 'Give your client a research question and ask it to bring back the source evidence.',
    caption: 'Recorded results from a GeneFoundry query.',
    illustrationLabel: 'Worked example'
  },
  connect: {
    heading: 'Connect your client',
    intro: 'Choose your AI client for setup instructions.',
    clientLabel: 'AI client',
    endpointLabel: 'Hosted MCP endpoint',
    oauthNote: 'Add the endpoint below, then sign in in your browser when prompted.',
    backendNote:
      'Hosted sign-in and upstream API keys are different requirements. If you run the router or a source integration yourself, check its repository for backend credentials and configuration.',
    verificationHeading: 'Check the connection',
    verificationBody:
      'Try an example prompt and expand the tool activity to see the GeneFoundry call and returned records.',
    troubleshootingHeading: 'Need help connecting?',
    troubleshootingBody:
      'Check the URL and finish sign-in. Your client’s guide covers account access and troubleshooting.'
  },
  maintenance: {
    heading: 'Maintained in the open',
    body: 'Explore the router code and the repositories behind the listed source integrations. Report an integration issue with the source name, client and steps needed to reproduce it.',
    limitationsHeading: 'Research use only',
    limitationsBody:
      'GeneFoundry is not clinical decision support. Review the upstream evidence and its limitations before using a result in research. Source coverage, response formats and availability can differ.'
  },
  footer: {
    description: 'Biomedical MCP sources through one endpoint.',
    researchNotice: 'Research use only. Not clinical decision support.'
  },
  states: {
    copyPending: 'Copying…',
    copyEndpointSuccess: 'Endpoint copied',
    copySetupSuccess: 'Setup copied',
    copyFailure: 'Couldn’t copy. Select and copy the text manually.',
    copyRetry: 'Try copying again',
    noRecipeStatus: 'Instructions checked against client docs',
    noRecipeBody: 'Connection setup has not been tested in {client}.'
  }
}
