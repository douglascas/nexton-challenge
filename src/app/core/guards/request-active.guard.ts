import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RequestStateService } from '../services/request-state.service';
import { map } from 'rxjs';

export const requestActiveGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const requestState = inject(RequestStateService);
  const requestId = route.paramMap.get('requestId');

  if (!requestId) {
    return router.createUrlTree(['/']);
  }

  const current = requestState.currentRequest;
  if (current && current.id === requestId) {
    return true;
  }

  return requestState.loadRequest(requestId).pipe(
    map((req) => {
      if (req) {
        return true;
      }
      return router.createUrlTree(['/']);
    })
  );
};
