import { SearchImage } from '../types';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export const searchImages = async (query: string, count: number = 12): Promise<SearchImage[]> => {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error('Unsplash Access Key is missing');
  }

  // Unsplash API endpoint
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0] || 'Failed to fetch images from Unsplash');
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((item: any) => ({
      title: item.alt_description || item.description || `Photo by ${item.user.name}`,
      link: item.urls.regular, // High quality for the report
      thumbnail: item.urls.small, // Smaller size for the grid
      contextLink: item.links.html
    }));
  } catch (error) {
    console.error('Error searching images:', error);
    throw error;
  }
};

export const imageUrlToBase64 = async (url: string): Promise<string> => {
  try {
    // Use wsrv.nl as a CORS proxy and image optimizer
    // This solves 99% of "Failed to load image" errors due to CORS
    const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=jpg&w=800&q=80`;
    
    // Attempt to fetch via proxy first
    const response = await fetch(proxyUrl);
    
    // If proxy fails or image is not found, try direct fetch (rarely works for CORS but worth a shot) 
    // or fail gracefully.
    if (!response.ok) {
        throw new Error(`Failed to fetch image via proxy: ${response.statusText}`);
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
          if (reader.result) {
              resolve(reader.result as string);
          } else {
              reject(new Error("Failed to convert blob to base64"));
          }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    // If main image fails, you might want to consider returning a placeholder or re-throwing
    throw error;
  }
};
