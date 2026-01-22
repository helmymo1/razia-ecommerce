
export const addBaseUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return 'https://via.placeholder.com/400x400?text=No+Image';
  if (imagePath.startsWith('http') || imagePath.startsWith('https') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  // Ensure we consistently handle the leading slash
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `http://localhost:5000${cleanPath}`;
};
