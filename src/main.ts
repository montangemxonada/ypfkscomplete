// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));


import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { SwUpdate } from '@angular/service-worker';
import { isDevMode } from '@angular/core';

bootstrapApplication(AppComponent, appConfig)
  .then(appRef => {
    const updates = appRef.injector.get(SwUpdate);
    
    if (!isDevMode() && updates.isEnabled) {
      setInterval(() => updates.checkForUpdate(), 30 * 60 * 1000);
      
      updates.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          document.location.reload();
        }
      });
    }
  })
  .catch(err => console.error(err));