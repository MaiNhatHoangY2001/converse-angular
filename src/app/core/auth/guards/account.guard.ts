import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const accountGuard: CanActivateFn = () => {
  if (inject(AuthService).isAuthenticated()) {
    inject(Router).navigate(['/dashboard']);
    return false;
  }
  return true;
};
