
/**
 * Geolocation Utility
 * Fetches the user's country code based on their IP address.
 */

export interface GeoLocation {
  country: string; // ISO 2-letter country code (e.g., 'EG', 'SA')
  currency?: string;
}

export const fetchUserLocation = async (): Promise<GeoLocation | null> => {
  // Array of providers for maximum reliability
  const providers = [
    {
      name: 'Cloudflare',
      url: 'https://www.cloudflare.com/cdn-cgi/trace',
      parser: (text: string) => {
        const lines = text.split('\n');
        const locLine = lines.find(l => l.startsWith('loc='));
        if (locLine) {
          const country = locLine.split('=')[1].trim().toUpperCase();
          return { country };
        }
        return null;
      }
    },
    {
      name: 'IP-SB',
      url: 'https://api.ip.sb/geoip',
      parser: (data: any) => ({
        country: data.country_code?.toUpperCase(),
        currency: data.currency
      })
    },
    {
      name: 'FreeIPAPI',
      url: 'https://freeipapi.com/api/json',
      parser: (data: any) => ({
        country: data.countryCode?.toUpperCase(),
        currency: data.currencyCode
      })
    },
    {
      name: 'IPAPI.co',
      url: 'https://ipapi.co/json/',
      parser: (data: any) => ({
        country: data.country_code?.toUpperCase(),
        currency: data.currency
      })
    },
    {
      name: 'IPWhoIs',
      url: 'https://ipwho.is/',
      parser: (data: any) => ({
        country: data.country_code?.toUpperCase(),
        currency: data.currency_code
      })
    }
  ];

  for (const provider of providers) {
    try {
      const response = await fetch(provider.url, { 
        method: 'GET',
        // Set a reasonable timeout
        signal: AbortSignal.timeout(4000) 
      });
      
      if (response.ok) {
        let result;
        if (provider.name === 'Cloudflare') {
          const text = await response.text();
          result = provider.parser(text);
        } else {
          const data = await response.json();
          result = provider.parser(data);
        }

        if (result && result.country) {
          console.log(`Location detected via ${provider.name}:`, result.country);
          return result;
        }
      }
    } catch (e) {
      // Silently try next provider
      continue;
    }
  }

  // Final fallback log if all fail
  console.warn("Geolocation detection unavailable. Defaulting to international pricing.");
  return null;
};
