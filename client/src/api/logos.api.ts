import { api } from './client';

export interface LogoCandidate {
  url: string;
  source: 'clearbit' | 'google_favicon';
}

export interface LogoSearchResult {
  candidates: LogoCandidate[];
  domain: string;
}

interface LogoSearchResponse {
  success: boolean;
  data: LogoSearchResult;
}

export const logosApi = {
  search(company: string) {
    const qs = new URLSearchParams({ company });
    return api.get<LogoSearchResponse>(`/logos/search?${qs}`);
  },
};
