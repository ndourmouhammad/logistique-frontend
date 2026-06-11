import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router      = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/connexion']);
    return false;
  }

  const rolesAutorises: string[] = route.data?.['roles'] ?? [];
  if (rolesAutorises.length > 0) {
    const roleUtilisateur = authService.getRole() ?? '';
    if (!rolesAutorises.includes(roleUtilisateur)) {
      authService.redirectByRole();
      return false;
    }
  }

  return true;
};
