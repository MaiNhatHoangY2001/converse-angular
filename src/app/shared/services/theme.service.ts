import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  activeTheme: string = 'light';
  constructor() {}

  getTheme(): string {
    return this.activeTheme;
  }

  setTheme(theme: string): void {
    if (typeof window !== 'undefined' && window.document) {
      const themeLink = document.getElementById('app-theme') as HTMLLinkElement;

      if (themeLink) themeLink.href = theme + '.css';
      this.activeTheme = theme;
    }
  }
}
