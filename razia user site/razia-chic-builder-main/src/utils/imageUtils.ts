
export const addBaseUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return 'https://via.placeholder.com/400x600?text=No+Image'; // Taller placeholder for user site
  if (imagePath.startsWith('http') || imagePath.startsWith('https') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `http://localhost:5000${cleanPath}`;
};
