import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { UrlService } from './app/services/url.service';
import { environment } from './environments/environment';

UrlService.setApi('http://localhost:8080/');
UrlService.setMainUrl('http://localhost:4200/');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
