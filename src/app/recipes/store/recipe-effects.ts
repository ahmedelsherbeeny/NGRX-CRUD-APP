import { Recipe } from './../recipe.model';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, tap, withLatestFrom, switchMap } from 'rxjs';
import {
  AddRecipe,
  deleteRecipe,
  initRecipe,
  set,
  startEdit,
  updateRecipe,
} from './receipe-actions';
import { Store } from '@ngrx/store';
import { selectRecipes } from './recipe-selector';

@Injectable()
export class RecipeEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{ recipe: { Recipes: Recipe[] } }>
  ) {}

  loadList = createEffect(() =>
    this.actions$.pipe(
      ofType(initRecipe),
      switchMap(() => {
        const storedValue = JSON.parse(localStorage.getItem('recipes'));

        const Recipes = storedValue ? storedValue : [];
        return of(set({ Recipes }));
      })
    )
  );
  saveList = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AddRecipe, deleteRecipe),
        withLatestFrom(this.store.select(selectRecipes)),
        tap(([action, list]) => {
          localStorage.setItem('recipes', JSON.stringify(list));
        })
      ),

    { dispatch: false }
  );

  startEdit = createEffect(() =>
    this.actions$.pipe(
      ofType(startEdit),
      switchMap((action) => {
        return of(updateRecipe({ recipe: action.recipe, index: action.index }));
      })
    )
  );
}
