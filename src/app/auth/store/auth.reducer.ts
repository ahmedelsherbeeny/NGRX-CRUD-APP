import { createReducer, on } from '@ngrx/store';
import { User } from '../user.model';
import {
  autoLogout,
  clearError,
  logIn,
  logInFail,
  logInStart,
  logOut,
  signUp,
} from './auth.actions';

export interface State {
  user: User;
  isLoading: boolean;
  authError: string;
}

const initialState: State = {
  user: null,
  isLoading: false,
  authError: null,
};

export const authReducer = createReducer(
  initialState,
  on(signUp, (state: State, action) => ({
    ...state,
    user: null,
    authError: null,
    isLoading: true,
  })),
  on(logInStart, (state: State, action) => ({
    ...state,
    user: null,
    authError: null,
    isLoading: true,
  })),
  on(logInFail, (state: State, action) => ({
    ...state,
    user: null,
    authError: action.error,
    isLoading: false,
  })),
  on(logIn, (state: State, action) => {
    const user = new User(
      action.email,
      action.userId,
      action.token,
      action.expirationDate
    );
    return {
      ...state,
      user: user,
      authError: null,
      isLoading: false,
    };
  }),
  on(logOut, (state: State, action) => ({
    ...state,
    user: null,
    authError: null,
    isLoading: false,
  })),

  on(autoLogout, (state) => ({
    ...state,
    user: null,
    authError: null,
    isLoading: false,
  })),
  on(clearError, (state: State, action) => ({
    ...state,
    authError: null,
  }))
);
