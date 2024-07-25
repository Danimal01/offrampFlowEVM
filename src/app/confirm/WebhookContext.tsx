'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const PROXY_URL = 'http://localhost:4000/proxy';

interface WebhookContextType {
  webhookData: string[];
  fetchWebhookData: () => Promise<void>;
}

const WebhookContext = createContext<WebhookContextType | undefined>(undefined);

export const WebhookProvider = ({ children }: { children: ReactNode }) => {
  const [webhookData, setWebhookData] = useState<string[]>([]);

  const fetchWebhookData = async () => {
    try {
      const response = await fetch(PROXY_URL, {
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setWebhookData((prevData) => {
        const newData = JSON.stringify(data, null, 2);
        if (prevData[prevData.length - 1] !== newData) {
          return [...prevData, newData];
        }
        return prevData;
      });
    } catch (error) {
      console.error('Error fetching webhook data:', error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchWebhookData();
    };
    fetchInitialData();
  }, []);

  return (
    <WebhookContext.Provider value={{ webhookData, fetchWebhookData }}>
      {children}
    </WebhookContext.Provider>
  );
};

export const useWebhook = () => {
  const context = useContext(WebhookContext);
  if (context === undefined) {
    throw new Error('useWebhook must be used within a WebhookProvider');
  }
  return context;
};
