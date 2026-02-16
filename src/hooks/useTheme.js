import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'theme-preference';
const VALID_PREFERENCES = new Set(['light', 'dark', 'system']);

const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getStoredPreference = () => {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return VALID_PREFERENCES.has(stored) ? stored : 'system';
};

const applyThemeToDocument = (preference) => {
  if (typeof document === 'undefined') return;

  const resolved = preference === 'system' ? getSystemTheme() : preference;
  const root = document.documentElement;

  root.setAttribute('data-theme', resolved);
  root.setAttribute('data-theme-preference', preference);

  root.style.colorScheme = resolved;
};

export const useTheme = () => {
  const [themePreference, setThemePreference] = useState(getStoredPreference);

  const resolvedTheme = useMemo(() => {
    return themePreference === 'system' ? getSystemTheme() : themePreference;
  }, [themePreference]);

  useEffect(() => {
    applyThemeToDocument(themePreference);
    window.localStorage.setItem(STORAGE_KEY, themePreference);
  }, [themePreference]);

  useEffect(() => {
    if (themePreference !== 'system') return undefined;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyThemeToDocument('system');

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themePreference]);

  const toggleTheme = useCallback(() => {
    setThemePreference((currentPreference) => {
      const currentResolved = currentPreference === 'system' ? getSystemTheme() : currentPreference;
      return currentResolved === 'dark' ? 'light' : 'dark';
    });
  }, []);

  const setSystemTheme = useCallback(() => {
    setThemePreference('system');
  }, []);

  return {
    themePreference,
    resolvedTheme,
    toggleTheme,
    setSystemTheme,
  };
};
