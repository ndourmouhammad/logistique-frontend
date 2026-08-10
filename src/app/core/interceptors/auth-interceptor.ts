import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const token = authService.getToken();

  const routesPubliques = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/expeditions/tracking/'
  ];

  const estRoutePublique = routesPubliques.some(r => req.url.includes(r));


  const handleAuthError = (err: any) => {
    if (err instanceof HttpErrorResponse && err.status === 401) {
      authService.logout();
    }
    return throwError(() => err);
  };

  if (token && !estRoutePublique) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned).pipe(catchError(handleAuthError));
  }

  return next(req).pipe(catchError(handleAuthError));
};
