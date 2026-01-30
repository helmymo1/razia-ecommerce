
// Use relative URL in production (nginx proxies), localhost in dev
const isDev = import.meta.env.DEV;
const API_BASE = isDev ? 'http://127.0.0.1:5000' : '';

export const addBaseUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return 'https://via.placeholder.com/400x600?text=No+Image'; // Taller placeholder for user site
  if (imagePath.startsWith('http') || imagePath.startsWith('https') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE}${cleanPath}`;
};
