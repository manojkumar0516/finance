import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    dashboard: 'Dashboard',
    customers: 'Customers',
    loans: 'Loans',
    collections: 'Collections',
    reports: 'Reports',
    calendar: 'Calendar',
    settings: 'Settings',
    logout: 'Logout',
    // Settings Page
    settings_title: 'Settings',
    settings_desc: 'Manage your account settings and preferences.',
    profile: 'Profile',
    preferences: 'Preferences',
    security: 'Security',
    language: 'Language',
    select_language: 'Select Language',
    dark_mode: 'Dark Mode',
    save_changes: 'Save Changes'
  },
  ta: {
    dashboard: 'டேஷ்போர்டு',
    customers: 'வாடிக்கையாளர்கள்',
    loans: 'கடன்கள்',
    collections: 'வசூல்',
    reports: 'அறிக்கைகள்',
    calendar: 'நாள்காட்டி',
    settings: 'அமைப்புகள்',
    logout: 'வெளியேறு',
    // Settings Page
    settings_title: 'அமைப்புகள்',
    settings_desc: 'உங்கள் கணக்கு அமைப்புகள் மற்றும் விருப்பங்களை நிர்வகிக்கவும்.',
    profile: 'சுயவிவரம்',
    preferences: 'விருப்பங்கள்',
    security: 'பாதுகாப்பு',
    language: 'மொழி',
    select_language: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    dark_mode: 'இருண்ட பயன்முறை',
    save_changes: 'மாற்றங்களை சேமி'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
