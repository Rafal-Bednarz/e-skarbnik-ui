import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { ApiService } from './app/services/api.service';
import { environment } from './environments/environment';

ApiService.setUrl('http://localhost:8080/');
ApiService.setMainUrl('http://localhost:4200/');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
