// Imports for loading & configuring the in-memory web api
//import { XHRBackend } from '@angular/http';

//import { InMemoryBackendService, SEED_DATA } from 'angular2-in-memory-web-api';



//import { bootstrap }    from '@angular/platform-browser-dynamic';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

//import { HTTP_PROVIDERS } from '@angular/http';

import { AppComponent } from './app.component';
//import { appRouterProviders } from './app.routes';
import {enableProdMode} from '@angular/core';

enableProdMode();

import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
/*
bootstrap(AppComponent, [
  appRouterProviders,
  HTTP_PROVIDERS
  //{ provide: XHRBackend, useClass: InMemoryBackendService }, 
  // in-mem server
  //{ provide: SEED_DATA, useClass: InMemoryDataService }     
  // in-mem server data
]);
*/
