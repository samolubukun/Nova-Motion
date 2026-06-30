/**
 * Ported Pexels API client to search and retrieve matching stock portrait videos.
 */

const jokerTerms: string[] = ["nature", "globe", "space", "ocean"];
const durationBufferSeconds = 3;

export interface StockVideoAsset {
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

export async function findStockVideo(
  searchTerms: string[],
  minDurationSeconds: number,
  excludeIds: string[] = []
): Promise<StockVideoAsset> {
  const pexelsKey = process.env.PEXELS_API_KEY;
  if (!pexelsKey) {
    throw new Error("PEXELS_API_KEY environment variable is not set");
  }

  // Shuffle terms to randomize and get fresh videos
  const shuffledJoker = [...jokerTerms].sort(() => Math.random() - 0.5);
  const shuffledSearch = [...searchTerms].sort(() => Math.random() - 0.5);
  const allTerms = [...shuffledSearch, ...shuffledJoker];

  for (const term of allTerms) {
    try {
      console.log(`[Pexels] Searching for term: "${term}" (minDuration: ${minDurationSeconds}s)`);
      const headers = new Headers();
      headers.append("Authorization", pexelsKey);

      // Search medium portrait (vertical) videos on Pexels
      const res = await fetchWithRetry(
        `https://api.pexels.com/videos/search?orientation=portrait&size=medium&per_page=40&query=${encodeURIComponent(
          term
        )}`,
        {
          method: "GET",
          headers,
        }
      );

      if (!res.ok) {
        throw new Error(`Pexels API error: ${res.status} ${res.statusText}`);
      }

      const responseData = await res.json();
      const videos = responseData.videos;

      if (!videos || videos.length === 0) {
        console.log(`[Pexels] No videos found for term: "${term}"`);
        continue;
      }

      // Filter videos matching requirements
      const filtered = videos
        .map((video: any) => {
          if (excludeIds.includes(String(video.id))) return null;
          if (!video.video_files || !video.video_files.length) return null;

          const fps = video.video_files[0].fps || 30;
          const duration = fps < 25 ? video.duration * (fps / 25) : video.duration;

          if (duration >= minDurationSeconds + durationBufferSeconds) {
            // Find portrait files. We look for width around 720 or 1080
            for (const file of video.video_files) {
              if (
                file.quality === "hd" ||
                file.width >= 720
              ) {
                return {
                  id: String(video.id),
                  url: file.link,
                  width: file.width,
                  height: file.height,
                };
              }
            }
          }
          return null;
        })
        .filter(Boolean);

      if (filtered.length > 0) {
        const selected = filtered[Math.floor(Math.random() * filtered.length)];
        console.log(`[Pexels] Selected video ID: ${selected.id} for term: "${term}"`);
        return selected;
      }
    } catch (err) {
      console.error(`[Pexels] Error fetching term "${term}":`, err);
    }
  }

  throw new Error("Unable to find any suitable stock videos on Pexels");
}
