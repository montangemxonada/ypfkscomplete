import { APP_INITIALIZER } from '@angular/core';

export function themeColorInitializer(): () => Promise<void> {
    return () => {
      const themeColor = '#742284';  // Puedes cambiar esto al color que desees
  
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', themeColor);
      }
  
      return Promise.resolve();
    };
  }
  