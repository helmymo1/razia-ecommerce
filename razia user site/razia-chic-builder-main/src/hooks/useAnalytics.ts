import { useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
const API_ENDPOINT = API_URL ? `${API_URL}/api` : '/api';

export const useAnalytics = () => {
  // Get or Create Visitor ID
  const getVisitorId = useCallback(() => {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  }, []);

  const track = useCallback(async (eventType: string, metadata: any = {}) => {
    try {
      const visitorId = getVisitorId();
      // Optional: Get User ID from auth store if available (passed in or retrieved here)
      // For now we assume visitor tracking primarily.
      
      await axios.post(`${API_ENDPOINT}/analytics/track`, {
        eventType,
        visitorId,
        metadata,
        url: window.location.href
      });
    } catch (err) {
      console.error("Analytics Error:", err);
    }
  }, [getVisitorId]);

  // Auto-track Page View
  useEffect(() => {
    track('page_view');
  }, [track]);

  return { track };
};
