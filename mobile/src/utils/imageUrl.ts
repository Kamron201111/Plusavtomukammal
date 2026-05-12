/**
 * Formats image URLs from the backend.
 * Correctly handles if path is already a full URL or relative.
 * Prepends /storage/ as required by the PlusAvto.Uz Laravel backend.
 */
export const getImageUrl = (path?: string) => {
  if (!path) return null;
  
  if (path.startsWith('http')) {
    return path;
  }

  // Ensure path doesn't start with a slash before concatenating
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // The web app uses /storage/ for images
  return `https://panel.plusavto-uz.uz/storage/${cleanPath}`;
};
