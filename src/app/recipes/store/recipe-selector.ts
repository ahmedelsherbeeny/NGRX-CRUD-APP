import { Recipe } from './../recipe.model';
import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/store/app-reducers';

export const selectRecipe = (state: AppState) => {
  return state.recipe;
};

export const selectRecipes = createSelector(selectRecipe, (state) => {
  return state.Recipes;
});

export const selectEditingRecipe = createSelector(
  selectRecipe,
  (state) => state.editingRecipe
);
