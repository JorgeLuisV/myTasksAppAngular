import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

import { TokenService } from '@services/token.service';

export const authGuard: CanActivateFn = (route, state): boolean => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  const isValidToken = tokenService.isValidToken();
  if (!isValidToken) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
