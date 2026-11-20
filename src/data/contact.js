import { profile } from './portfolio.js';

export function gmailComposeUrl(subject = '') {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to: profile.email });
  if (subject) params.set('su', subject);
  return `https://mail.google.com/mail/?${params}`;
}
