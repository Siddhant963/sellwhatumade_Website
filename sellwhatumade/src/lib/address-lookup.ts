/**
 * Client-side address helpers: PIN code → city/state lookup (India Post's public
 * API) and reverse geocoding for the "use current location" button (OpenStreetMap
 * Nominatim). Both are free, keyless public APIs — fine for this app's traffic
 * volume; swap for a paid provider if usage grows.
 */

interface PincodeResult {
  city: string;
  state: string;
}

interface ReverseGeocodeResult {
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

export async function lookupPincode(pincode: string): Promise<PincodeResult | null> {
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      Status: string;
      PostOffice: Array<{ District: string; State: string }> | null;
    }>;
    const postOffice = data?.[0]?.PostOffice?.[0];
    if (data?.[0]?.Status !== "Success" || !postOffice) return null;
    return { city: postOffice.District, state: postOffice.State };
  } catch {
    return null;
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<ReverseGeocodeResult | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      address?: {
        road?: string;
        suburb?: string;
        neighbourhood?: string;
        city?: string;
        town?: string;
        village?: string;
        county?: string;
        state?: string;
        postcode?: string;
      };
    };
    const a = data.address;
    if (!a) return null;

    const line1 = [a.road, a.suburb ?? a.neighbourhood].filter(Boolean).join(", ");
    const city = a.city ?? a.town ?? a.village ?? a.county ?? "";
    return { line1, city, state: a.state ?? "", pincode: a.postcode ?? "" };
  } catch {
    return null;
  }
}
