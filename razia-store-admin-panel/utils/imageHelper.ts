export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return 'https://via.placeholder.com/150';
  if (path.startsWith('http')) return path;
  
  // Clean backslashes if any (windows paths)
  const cleanPath = path.replace(/\\/g, '/');
  
  // Ensure we don't double slash if path starts with /
  // @ts-ignore
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api$/, '');
  
  return `${baseUrl}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
};
