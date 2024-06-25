import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as authActions from './auth.actions';

import {
  logInFail,
  LOGIN_START,
  logIn,
  LOG_IN,
  SIGN_UP,
  AUTO_LOGIN,
  startAutoLogoutTimer,
} from './auth.actions';
import { Router } from '@angular/router';
import { User } from '../user.model';
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

export const handleAuth = (
  email: string,
  expiresIn: string,
  token: string,
  userId: string
) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const expirationDuration =
    new Date(expirationDate).getTime() - new Date().getTime();

  const user = new User(email, userId, token, expirationDate);

  localStorage.setItem('userData', JSON.stringify(user));
  return [
    logIn({
      email: email,
      userId: userId,
      token: token,
      expirationDate: expirationDate,
    }),
    startAutoLogoutTimer({ expirationDuration }),
  ];
};

export const handleAuthError = (errorRes) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    //   return throwError(errorMessage);
    return of(logInFail({ error: errorMessage }));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct.';
      break;
  }
  return of(logInFail({ error: errorMessage }));
};

@Injectable()
export class AuthEffects {
  signUpStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SIGN_UP),
      switchMap((authData: ReturnType<typeof authActions.signUp>) => {
        return this.http
          .post<AuthResponseData>(
            'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' +
              environment.firebaseAPIKey,
            {
              email: authData.payLoad.email,
              password: authData.payLoad.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            concatMap((authResponse) => {
              return handleAuth(
                authResponse.email,
                authResponse.expiresIn,
                authResponse.idToken,
                authResponse.localId
              );
            }),
            catchError((errorRes) => {
              return handleAuthError(errorRes);
            })
          );
      })
    )
  );

  logInStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOGIN_START),
      switchMap((authData: ReturnType<typeof authActions.logInStart>) => {
        return this.http
          .post<AuthResponseData>(
            'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' +
              environment.firebaseAPIKey,
            {
              email: authData.payLoad.email,
              password: authData.payLoad.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            concatMap((authResponse) => {
              return handleAuth(
                authResponse.email,
                authResponse.expiresIn,
                authResponse.idToken,
                authResponse.localId
              );
            }),
            catchError((errorRes) => {
              return handleAuthError(errorRes);
            })
          );
      })
    )
  );

  logInSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LOG_IN),
        tap(() => {
          this.router.navigate(['/']); // Navigate to desired path
        })
      ),
    { dispatch: false } // This effect does not dispatch any action
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          return { type: 'dummy' };
        }

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          return logIn({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
          });
        }

        return { type: 'dummy' };
      })
    )
  );

  autoLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.autoLogout),
      tap(() => {
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
      }),
      map(() => authActions.logOut())
    )
  );

  logOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logOut),
        tap(() => {
          this.router.navigate(['/auth']);
          localStorage.removeItem('userData');
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
