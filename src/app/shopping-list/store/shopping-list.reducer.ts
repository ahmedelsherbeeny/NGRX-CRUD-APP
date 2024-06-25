import { Ingredient } from './../../shared/ingredient.model';
import { createReducer, on } from '@ngrx/store';
import {
  AddIngredient,
  AddIngredients,
  DeleteIngredient,
  StartEdit,
  StopEdit,
  UpdateIngredient,
  set,
} from './shopping-list.actions';

export interface State {
  Ingredients: Ingredient[];
  editedItemIndex: number;
  editedIngredient: Ingredient;
}

const initialState: State = {
  Ingredients: [],
  editedIngredient: null,
  editedItemIndex: -1,
};

export const shoppingListReducer = createReducer(
  initialState,
  on(AddIngredient, (state: State, action) => ({
    ...state,
    Ingredients: [...state.Ingredients, action.ingredient],
  })),
  on(UpdateIngredient, (state, action) => {
    const ingredient = state.editedIngredient;

    const updatedIngredient = {
      ...ingredient,
      ...action.ingredient,
    };
    const updatedIngredients = [...state.Ingredients];
    updatedIngredients[state.editedItemIndex] = updatedIngredient;

    return {
      ...state,
      Ingredients: updatedIngredients,
      editedItemIndex: -1,
      editedIngredient: null,
    };
  }),
  on(AddIngredients, (state, action) => ({
    ...state,
    Ingredients: [...state.Ingredients, ...action.ingredients],
  })),
  on(DeleteIngredient, (state, action) => ({
    ...state,
    Ingredients: state.Ingredients.filter((ing, index) => {
      return index !== state.editedItemIndex;
    }),
  })),
  on(set, (state, action) => ({
    ...state,
    Ingredients: [...state.Ingredients, ...action.ingredients],
    editedItemIndex: -1,
    editedIngredient: null,
  })),
  on(StartEdit, (state, action) => ({
    ...state,
    editedItemIndex: action.editedItemIndex,
    editedIngredient: { ...state.Ingredients[action.editedItemIndex] },
  })),
  on(StopEdit, (state, action) => ({
    ...state,
    editedItemIndex: -1,
    editedIngredient: null,
  }))
);
