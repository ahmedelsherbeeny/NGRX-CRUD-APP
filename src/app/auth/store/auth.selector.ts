import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/store/app-reducers';

export const selectAuth = (state: AppState) => {
  return state.auth;
};

export const selectUser = createSelector(selectAuth, (state) => {
  return state.user;
});
