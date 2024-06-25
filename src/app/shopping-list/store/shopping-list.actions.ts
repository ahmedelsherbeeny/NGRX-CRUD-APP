import { Ingredient } from './../../shared/ingredient.model';
import { createAction, props } from '@ngrx/store';

export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const UPDATE_INGREDIENTS = 'UPDATE_INGREDIENTS';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const INIT = '[Counter] INIT';
export const SET = '[Counter] SET';
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';

export const AddIngredient = createAction(
  ADD_INGREDIENT,
  props<{ ingredient: Ingredient }>()
);

export const UpdateIngredient = createAction(
  UPDATE_INGREDIENTS,
  props<{ ingredient: Ingredient }>()
);
export const AddIngredients = createAction(
  ADD_INGREDIENTS,
  props<{ ingredients: Ingredient[] }>()
);

export const DeleteIngredient = createAction(DELETE_INGREDIENT);
export const init = createAction(INIT);

export const set = createAction(SET, props<{ ingredients: Ingredient[] }>());
export const StartEdit = createAction(
  START_EDIT,
  props<{ editedItemIndex: number }>()
);
export const StopEdit = createAction(STOP_EDIT);
