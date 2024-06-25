import { createAction, props } from '@ngrx/store';

export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const LOGIN_START = 'LOGIN_START';
export const LOGIN_FAIL = ' Login Fail';
export const SIGN_UP = 'SIGN_UP';
export const AUTO_LOGIN = 'AUTO_LOGIN';
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const AUTO_LOGOUT = '[Auth] Auto Logout';
export const START_AUTO_LOGOUT_TIMER = '[Auth] Start Auto Logout Timer';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

export const signUp = createAction(
  SIGN_UP,
  props<{ payLoad: { email: string; password: string } }>()
);

export const logInStart = createAction(
  LOGIN_START,
  props<{ payLoad: { email: string; password: string } }>()
);

export const logInFail = createAction(LOGIN_FAIL, props<{ error: string }>());

export const logIn = createAction(
  LOG_IN,
  props<{
    email: string;
    userId: string;
    token: string;
    expirationDate: Date;
  }>()
);
export const autoLogin = createAction(AUTO_LOGIN);

export const logOut = createAction(LOG_OUT);

export const autoLogout = createAction(AUTO_LOGOUT);
export const startAutoLogoutTimer = createAction(
  START_AUTO_LOGOUT_TIMER,
  props<{ expirationDuration: number }>()
);

export const clearError = createAction(CLEAR_ERROR);
