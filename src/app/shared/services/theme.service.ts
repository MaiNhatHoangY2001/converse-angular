import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  activeTheme: string = 'light';
  constructor() {}

  initTheme(): void {
    if (typeof window !== 'undefined' && window.document) {
      const theme = localStorage.getItem('theme') || 'light';
      const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
      if (themeLink) themeLink.href = theme + '.css';
      this.activeTheme = theme;
    }
  }

  getTheme(): string {
    const theme = localStorage.getItem('theme');
    if (theme) return theme;
    return this.activeTheme;
  }

  setTheme(theme: string): void {
    if (typeof window !== 'undefined' && window.document) {
      const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
      if (themeLink) themeLink.href = theme + '.css';
      this.activeTheme = theme;
      localStorage.setItem('theme', theme);
    }
  }
}
