import { User } from './user.model';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from '@angular/common/http';
import { take, exhaustMap, map } from 'rxjs/operators';

import * as fromApp from '../store/app-reducers';
import { Store } from '@ngrx/store';
import { selectUser } from './store/auth.selector';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select(selectUser).pipe(
      take(1),
      // map((authState) => {
      //   console.log(authState);

      //   return authState.user;
      // }),
      exhaustMap((user) => {
        if (!user) {
          console.log(user);
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
