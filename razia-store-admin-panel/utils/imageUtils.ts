
// Helper to construct full image URL
export const addBaseUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return 'https://via.placeholder.com/400x400?text=No+Image';
  if (imagePath.startsWith('http') || imagePath.startsWith('https') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  // Clean backslashes if any (windows paths)
  const cleanPath = imagePath.replace(/\\/g, '/');

  // Dynamic Base URL
  // @ts-ignore
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api$/, '');

  // Ensure we consistently handle the leading slash
  const finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

  return `${baseUrl}${finalPath}`; // e.g. http://localhost:5000/uploads/cat.jpg
};
