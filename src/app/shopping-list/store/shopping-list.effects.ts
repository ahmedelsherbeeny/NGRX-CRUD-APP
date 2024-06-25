import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';
import {
  AddIngredient,
  AddIngredients,
  DeleteIngredient,
  UpdateIngredient,
  init,
  set,
} from './shopping-list.actions';
import { of, switchMap, tap, withLatestFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { selectShoppingListState } from './shopping-list.selector';

@Injectable()
export class ShoppingListEffects {
  loadList = createEffect(() =>
    this.actions$.pipe(
      ofType(init),
      switchMap(() => {
        const storedValue = JSON.parse(localStorage.getItem('shoppingList'));

        const ingredients = storedValue ? storedValue : [];
        return of(set({ ingredients }));
      })
    )
  );
  saveList = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AddIngredient,
          UpdateIngredient,
          DeleteIngredient,
          AddIngredients
        ),
        withLatestFrom(this.store.select(selectShoppingListState)),
        tap(([action, list]) => {
          localStorage.setItem(
            'shoppingList',
            JSON.stringify(list.Ingredients)
          );
        })
      ),

    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<{ shoppingList: { Ingredients: Ingredient[] } }>
  ) {}
}
