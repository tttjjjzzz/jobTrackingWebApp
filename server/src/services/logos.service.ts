export interface LogoCandidate {
  url: string;
  source: 'clearbit' | 'google_favicon';
}

export interface LogoSearchResult {
  candidates: LogoCandidate[];
  domain: string;
}

/**
 * Strips common corporate suffixes from a company name and converts
 * it to a URL-friendly slug representing the likely domain root.
 *
 * Examples:
 *   "Google Inc."        -> "google"
 *   "Meta Platforms"     -> "meta"
 *   "Shopify Inc"        -> "shopify"
 *   "The Home Depot"     -> "home-depot"
 *   "Amazon Web Services"-> "amazon-web-services"
 */
function companyNameToSlug(company: string): string {
  return company
    .toLowerCase()
    // Remove common legal suffixes (longer variants first)
    .replace(
      /\b(incorporated|corporation|limited|holdings|platforms|technologies|solutions|services|group|labs|studio|studios)\b/g,
      '',
    )
    .replace(/\b(inc\.?|llc\.?|ltd\.?|corp\.?|co\.?|plc\.?|lp\.?)\b/g, '')
    // Remove leading "the "
    .replace(/^the\s+/i, '')
    // Remove non-alphanumeric chars except spaces
    .replace(/[^a-z0-9\s]/g, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim()
    // Spaces → hyphens
    .replace(/\s/g, '-')
    // Collapse repeated hyphens
    .replace(/-+/g, '-')
    // Strip trailing hyphen
    .replace(/-$/, '');
}

export class LogosService {
  /**
   * Returns candidate logo URLs for a given company name.
   * Does NOT make outbound HTTP requests — the client loads
   * the images directly, and <img onError> handles 404s gracefully.
   */
  searchLogos(company: string): LogoSearchResult {
    const slug = companyNameToSlug(company);
    const domain = `${slug}.com`;

    const candidates: LogoCandidate[] = [
      {
        url: `https://logo.clearbit.com/${domain}`,
        source: 'clearbit',
      },
      {
        url: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        source: 'google_favicon',
      },
    ];

    return { candidates, domain };
  }
}

export const logosService = new LogosService();
