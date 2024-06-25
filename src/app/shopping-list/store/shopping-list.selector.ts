import { createSelector } from '@ngrx/store';
import * as fromApp from '../../store/app-reducers';
import { Ingredient } from 'src/app/shared/ingredient.model';

export const selectShoppingListState = (state: fromApp.AppState) =>
  state.shoppingList;

export const selectIngredients = createSelector(
  selectShoppingListState,
  (shoppingListState) => shoppingListState.Ingredients
);
