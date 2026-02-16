import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'theme-preference';
const VALID_PREFERENCES = new Set(['light', 'dark']);

const getStoredPreference = () => {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return VALID_PREFERENCES.has(stored) ? stored : 'dark';
};

const applyThemeToDocument = (preference) => {
  if (typeof document === 'undefined') return;

  const resolved = VALID_PREFERENCES.has(preference) ? preference : 'dark';
  const root = document.documentElement;

  root.setAttribute('data-theme', resolved);
  root.setAttribute('data-theme-preference', preference);

  root.style.colorScheme = resolved;
};

export const useTheme = () => {
  const [themePreference, setThemePreference] = useState(getStoredPreference);

  const resolvedTheme = useMemo(() => themePreference, [themePreference]);

  useEffect(() => {
    applyThemeToDocument(themePreference);
    window.localStorage.setItem(STORAGE_KEY, themePreference);
  }, [themePreference]);

  const toggleTheme = useCallback(() => {
    setThemePreference((currentPreference) => (currentPreference === 'dark' ? 'light' : 'dark'));
  }, []);

  return {
    themePreference,
    resolvedTheme,
    toggleTheme,
  };
};
