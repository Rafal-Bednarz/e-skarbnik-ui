import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { ApiService } from './app/services/api.service';
import { environment } from './environments/environment';

ApiService.setApiUrl('https://eskarbnik-app.herokuapp.com/');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
