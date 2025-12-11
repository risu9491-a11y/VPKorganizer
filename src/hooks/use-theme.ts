"use client";

import { useState, useEffect, useCallback } from 'react';

export type Theme = "light" | "dark" | "dark-highlighted";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("vpk_theme") as Theme | null;
    const initialTheme = storedTheme || 'light';
    setThemeState(initialTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "dark-highlighted");
    root.classList.add(theme);
    localStorage.setItem("vpk_theme", theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return { theme, setTheme };
}
