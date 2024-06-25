import { createAction, props } from '@ngrx/store';
import { Recipe } from '../recipe.model';

export const ADD_RECIPE = 'ADD_RECIPE';
export const UPDATE_RECIPE = 'UPDATE_RECIPE';
export const DELETE_RECIPE = 'DELETE_RECIPE';

export const INIT = 'INIT';
export const SET = 'SET';
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';

export const initRecipe = createAction(INIT);

export const set = createAction(SET, props<{ Recipes: Recipe[] }>());

export const AddRecipe = createAction(ADD_RECIPE, props<{ recipe: Recipe }>());

export const updateRecipe = createAction(
  UPDATE_RECIPE,
  props<{ recipe: Recipe; index: number }>()
);

export const deleteRecipe = createAction(
  DELETE_RECIPE,
  props<{ index: number }>()
);
export const startEdit = createAction(
  START_EDIT,
  props<{ recipe: Recipe; index: number }>()
);

export const stopEdit = createAction(STOP_EDIT);
