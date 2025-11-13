import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Handle application errors - logout on crash
window.addEventListener('error', (event) => {
  console.error('Application error:', event.error);
  localStorage.removeItem('currentUser');
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  localStorage.removeItem('currentUser');
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    console.error(err);
    // Clear user session on bootstrap error
    localStorage.removeItem('currentUser');
  });
