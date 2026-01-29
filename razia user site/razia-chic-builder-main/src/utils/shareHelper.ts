import { toast } from '@/hooks/use-toast';

export const shareProduct = async (product: { name: string; url?: string; description?: string }) => {
  const shareData = {
    title: product.name,
    text: product.description || `Check out ${product.name}!`,
    url: product.url || window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast({ title: 'Link copied to clipboard!' });
    }
  } catch (err) {
    console.error('Error sharing:', err);
    // Ignore AbortError (user cancelled share)
    if ((err as Error).name !== 'AbortError') {
       toast({ title: 'Failed to share', variant: 'destructive' });
    }
  }
};
