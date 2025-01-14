import React from 'react';
import { Share2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { log } from 'console';

interface ShareButtonProps {
  title: string;
  location: string;
  price: number;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, location, price }) => {
  const handleShare = async () => {
    interface ShareData {
      title: string;
      text: string;
      url: string;
    }

    const shareData: ShareData = {
      title: 'Property Listing',
      text: `Check out this property: ${title} in ${location} for ₦${price.toLocaleString()}`,
      url: window.location.href
    };
    
    //console.log('Share data:', shareData);

    try {
      if (navigator.share) {
        // Use Web Share API if available (mostly mobile devices)
        await navigator.share(shareData);
        toast({
          description: "Successfully shared!",
          duration: 3000,
        });
      } else {
        // Fallback to copying URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          description: "Link copied to clipboard!",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        variant: "destructive",
        description: "Failed to share. Please try again.",
        duration: 3000,
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
    >
      <Share2 className="w-5 h-5" />
      Share
    </button>
  );
};

export default ShareButton;