import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { WarehouseInterceptor } from './services/warehouse.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([])
    ),
    { provide: HTTP_INTERCEPTORS, useClass: WarehouseInterceptor, multi: true }, provideAnimationsAsync()
  ]
  
};

