import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = () => {
  if (!inject(AuthService).isAuthenticated()) {
    inject(Router).navigate(['/']);
    return false;
  }
  return true;
};
