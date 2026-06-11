import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const token = authService.getToken();

  const routesPubliques = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/expeditions/tracking/'
  ];

  const estRoutePublique = routesPubliques.some(r => req.url.includes(r));

  if (token && !estRoutePublique) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }

  return next(req);
};
