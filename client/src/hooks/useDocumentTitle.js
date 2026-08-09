import { useEffect } from 'react';

const useDocumentTitle = (title, description) => {
  useEffect(() => {
    // Save original title and description
    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription ? metaDescription.getAttribute('content') : '';

    // Update title
    document.title = title ? `${title} | VocaPrep` : 'VocaPrep - AI-Powered Interview Coach';

    // Update description
    if (description && metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Cleanup function to restore original
    return () => {
      document.title = originalTitle;
      if (metaDescription) {
        metaDescription.setAttribute('content', originalDescription);
      }
    };
  }, [title, description]);
};

export default useDocumentTitle;
