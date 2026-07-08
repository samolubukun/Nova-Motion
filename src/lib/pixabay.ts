/**
 * Pixabay API client to search and retrieve matching stock photos.
 */

const jokerTerms: string[] = ["nature", "workspace", "abstract", "technology"];

export interface StockImageAsset {
  id: string;
  url: string;
  width: number;
  height: number;
}

/**
 * Robust fetch wrapper with exponential backoff retries.
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  delay = 2000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 408 || response.status === 429 || response.status >= 500) {
        console.warn(`[Network] Retryable status ${response.status} on ${url}. Retrying in ${delay}ms...`);
      } else {
        return response;
      }
    } catch (err) {
      console.warn(`[Network] Connection failed to ${url} (Attempt ${i + 1}/${retries}). Error: ${err}. Retrying in ${delay}ms...`);
      if (i === retries - 1) throw err;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay *= 2;
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

export async function findStockImage(
  searchTerms: string[],
  excludeUrls: string[] = [],
  aspectRatio = "9:16"
): Promise<StockImageAsset> {
  const pixabayKey = process.env.PIXABAY_API_KEY;
  if (!pixabayKey) {
    throw new Error("PIXABAY_API_KEY environment variable is not set");
  }

  // Map aspect ratio to Pixabay search params
  // Pixabay supports orientation: "all", "horizontal", "vertical"
  let orientation = "vertical";
  if (aspectRatio === "16:9") {
    orientation = "horizontal";
  } else if (aspectRatio === "1:1") {
    orientation = "all"; // Use all for square
  }

  // Shuffle terms to randomize and get fresh images
  const shuffledJoker = [...jokerTerms].sort(() => Math.random() - 0.5);
  const shuffledSearch = [...searchTerms].sort(() => Math.random() - 0.5);
  const allTerms = [...shuffledSearch, ...shuffledJoker];

  for (const term of allTerms) {
    try {
      console.log(`[Pixabay] Searching for term: "${term}" (orientation: ${orientation})`);
      
      const url = `https://pixabay.com/api/?key=${pixabayKey}&q=${encodeURIComponent(
        term
      )}&image_type=photo&orientation=${orientation}&per_page=40&safesearch=true`;

      const res = await fetchWithRetry(url, { method: "GET" });

      if (!res.ok) {
        throw new Error(`Pixabay API error: ${res.status} ${res.statusText}`);
      }

      const responseData = await res.json();
      const hits = responseData.hits;

      if (!hits || hits.length === 0) {
        console.log(`[Pixabay] No images found for term: "${term}"`);
        continue;
      }

      // Filter images matching requirements (e.g. not excluded)
      const filtered = hits
        .map((hit: any) => {
          const imageUrl = hit.largeImageURL || hit.webformatURL;
          if (!imageUrl) return null;
          if (excludeUrls.includes(imageUrl)) return null;

          return {
            id: String(hit.id),
            url: imageUrl,
            width: hit.imageWidth || 1920,
            height: hit.imageHeight || 1080,
          };
        })
        .filter(Boolean);

      if (filtered.length > 0) {
        // Randomly select one of the hits
        const selected = filtered[Math.floor(Math.random() * filtered.length)];
        console.log(`[Pixabay] Selected image ID: ${selected.id} for term: "${term}"`);
        return selected;
      }
    } catch (err) {
      console.error(`[Pixabay] Error fetching term "${term}":`, err);
    }
  }

  throw new Error("Unable to find any suitable stock images on Pixabay");
}
