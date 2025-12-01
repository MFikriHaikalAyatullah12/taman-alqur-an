'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TpqSettings {
  site_name: string;
  site_description: string;
  whatsapp: string;
  whatsapp_message: string;
  phone: string;
  email: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  hero_title?: string;
  about_title?: string;
  hero_subtitle?: string;
  about_description?: string;
}

interface TpqContextType {
  settings: TpqSettings;
  updateSettings: (newSettings: Partial<TpqSettings>) => void;
  refreshSettings: () => void;
}

const defaultSettings: TpqSettings = {
  site_name: 'TPQ Al-Hikmah',
  site_description: '',
  whatsapp: '',
  whatsapp_message: 'Assalamu\'alaikum, saya ingin bertanya tentang TPQ',
  phone: '',
  email: '',
  address: '',
  facebook_url: '',
  instagram_url: '',
  youtube_url: '',
  hero_title: 'Selamat Datang di TPQ Al-Hikmah',
  about_title: 'Tentang TPQ Al-Hikmah',
  hero_subtitle: 'Tempat terbaik untuk belajar Al-Quran',
  about_description: ''
};

const TpqContext = createContext<TpqContextType | undefined>(undefined);

export function TpqProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<TpqSettings>(defaultSettings);

  const refreshSettings = async () => {
    try {
      const response = await fetch('/api/public/settings', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSettings({ ...defaultSettings, ...data });
        console.log('Settings refreshed:', data);
      }
    } catch (error) {
      console.error('Error loading TPQ settings:', error);
      // Continue with default settings if fetch fails
    }
  };

  const updateSettings = (newSettings: Partial<TpqSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Jika site_name berubah, update juga title dan references lainnya
      if (newSettings.site_name && newSettings.site_name !== prev.site_name) {
        // Update document title jika di browser
        if (typeof document !== 'undefined') {
          const currentTitle = document.title;
          if (currentTitle.includes(prev.site_name)) {
            document.title = currentTitle.replace(prev.site_name, newSettings.site_name);
          }
        }
        
        // Update hero_title dan about_title secara otomatis
        if (!newSettings.hero_title) {
          updated.hero_title = `Selamat Datang di ${newSettings.site_name}`;
        }
        if (!newSettings.about_title) {
          updated.about_title = `Tentang ${newSettings.site_name}`;
        }
      }
      
      return updated;
    });
    
    // Refresh setelah delay untuk memastikan database sudah terupdate
    setTimeout(() => {
      refreshSettings();
    }, 2000);
  };

  useEffect(() => {
    // Load settings after component is mounted to avoid blocking initial render
    const timer = setTimeout(() => {
      refreshSettings();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <TpqContext.Provider value={{ settings, updateSettings, refreshSettings }}>
      {children}
    </TpqContext.Provider>
  );
}

export function useTpq() {
  const context = useContext(TpqContext);
  if (context === undefined) {
    throw new Error('useTpq must be used within a TpqProvider');
  }
  return context;
}