import { Recipe } from './../recipe.model';
import { createReducer, on } from '@ngrx/store';
import * as RecipeActions from './receipe-actions';
import { set } from './receipe-actions';

export interface State {
  Recipes: Recipe[];
  editingRecipe: Recipe | null;
  error: any;
}

const initialState: State = {
  Recipes: [],
  editingRecipe: null,

  error: null,
};

export const receipeReducer = createReducer(
  initialState,

  on(RecipeActions.AddRecipe, (state, action) => ({
    ...state,
    Recipes: [...state.Recipes, action.recipe],
    error: null,
  })),

  on(RecipeActions.updateRecipe, (state, action) => ({
    ...state,
    Recipes: state.Recipes.map((item) =>
      state.Recipes.indexOf(item) === action.index ? action.recipe : item
    ),
  })),

  on(RecipeActions.deleteRecipe, (state, action) => ({
    ...state,
    Recipes: state.Recipes.filter((item, idx) => idx !== action.index),
  })),
  on(set, (state, action) => ({
    ...state,
    Recipes: [...state.Recipes, ...action.Recipes],
  })),
  on(RecipeActions.startEdit, (state, action) => ({
    ...state,
    editingRecipe: action.recipe,
  })),

  on(RecipeActions.stopEdit, (state) => ({
    ...state,
    editingRecipe: null,
  }))
);
