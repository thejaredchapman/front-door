/** Main navigation, shared by the masthead and the mobile drawer. */
export const NAV = [
  { href: '#/', match: (p) => p === '/', label: 'Home', mobileOnly: true },
  { href: '#/start', match: (p) => p.startsWith('/start'), label: 'Start here' },
  { href: '#/plan', match: (p) => p.startsWith('/plan') || p.startsWith('/results'), label: 'Find my plan' },
  { href: '#/learn', match: (p) => p.startsWith('/learn'), label: 'Learn' },
  { href: '#/calculator', match: (p) => p.startsWith('/calculator'), label: 'Calculator' },
  { href: '#/give', match: (p) => p.startsWith('/give'), label: 'Give' },
  { href: '#/news', match: (p) => p.startsWith('/news'), label: 'News' },
];
