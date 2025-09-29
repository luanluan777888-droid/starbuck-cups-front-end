// Google Analytics 4 Helper Library
// Provides utility functions for tracking events and user interactions

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

// GA4 Measurement ID - Read from environment variable
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Check if GA4 is loaded and available
export const isGAAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Page view tracking - automatically called by GA4, but useful for SPA navigation
export const trackPageView = (url: string, title?: string) => {
  if (!isGAAvailable()) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: title || document.title,
    page_location: url,
  });
};

// Product view event
export const trackProductView = (product: {
  id: string;
  name: string;
  category?: string;
  price?: number;
}) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'view_item', {
    currency: 'VND',
    value: product.price || 0,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category || 'Unknown',
        price: product.price || 0,
        quantity: 1,
      },
    ],
  });
};

// Add to cart event (for consultation cart)
export const trackAddToCart = (product: {
  id: string;
  name: string;
  category?: string;
  price?: number;
}) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'add_to_cart', {
    currency: 'VND',
    value: product.price || 0,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category || 'Unknown',
        price: product.price || 0,
        quantity: 1,
      },
    ],
  });
};

// Remove from cart event
export const trackRemoveFromCart = (product: {
  id: string;
  name: string;
  category?: string;
  price?: number;
}) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'remove_from_cart', {
    currency: 'VND',
    value: product.price || 0,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category || 'Unknown',
        price: product.price || 0,
        quantity: 1,
      },
    ],
  });
};

// Search event
export const trackSearch = (searchTerm: string, resultCount?: number) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'search', {
    search_term: searchTerm,
    search_results_count: resultCount,
  });
};

// Consultation form submission (treated as purchase conversion)
export const trackConsultationSubmission = (consultation: {
  id?: string;
  totalItems: number;
  customerName: string;
  items: Array<{
    id: string;
    name: string;
    category?: string;
  }>;
}) => {
  if (!isGAAvailable()) return;

  // Track as purchase event for conversion tracking
  window.gtag('event', 'purchase', {
    transaction_id: consultation.id || `consultation_${Date.now()}`,
    currency: 'VND',
    value: consultation.totalItems * 50000, // Estimated value per consultation item
    items: consultation.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category || 'Consultation',
      price: 50000, // Estimated consultation value
      quantity: 1,
    })),
  });

  // Also track as lead conversion
  window.gtag('event', 'generate_lead', {
    currency: 'VND',
    value: consultation.totalItems * 50000,
    customer_name: consultation.customerName,
    items_count: consultation.totalItems,
  });
};

// Custom event tracking
export const trackCustomEvent = (
  eventName: string,
  parameters: Record<string, unknown> = {}
) => {
  if (!isGAAvailable()) return;

  window.gtag('event', eventName, parameters);
};

// Track user engagement events
export const trackEngagement = (action: string, element?: string) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'engagement', {
    action,
    element,
    timestamp: new Date().toISOString(),
  });
};

// Track category filter usage
export const trackCategoryFilter = (category: string) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'category_filter', {
    category,
    action: 'filter_applied',
  });
};

// Track color filter usage
export const trackColorFilter = (color: string) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'color_filter', {
    color,
    action: 'filter_applied',
  });
};

// Track capacity filter usage
export const trackCapacityFilter = (capacity: string) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'capacity_filter', {
    capacity,
    action: 'filter_applied',
  });
};

// Track sorting actions
export const trackSortAction = (sortBy: string) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'sort_products', {
    sort_by: sortBy,
    action: 'sort_applied',
  });
};

// Track pagination usage
export const trackPagination = (page: number, totalPages: number) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'pagination', {
    page_number: page,
    total_pages: totalPages,
    action: 'page_changed',
  });
};

// Track mobile menu usage
export const trackMobileMenu = (action: 'open' | 'close') => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'mobile_menu', {
    action,
  });
};

// Track cart actions
export const trackCartAction = (action: 'open' | 'close' | 'view') => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'cart_action', {
    action,
  });
};

// Track 404 errors
export const track404Error = (path: string) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'page_not_found', {
    page_path: path,
    action: '404_error',
  });
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText?: string) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'click', {
    event_category: 'external_link',
    event_label: url,
    link_text: linkText,
  });
};