import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app-reducers';

import { StartEdit } from './store/shopping-list.actions';
import { selectShoppingListState } from './store/shopping-list.selector';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[];

  shoppingList$: Observable<{ Ingredients: Ingredient[] }>;

  constructor(private store: Store<fromApp.AppState>) {
    this.shoppingList$ = this.store.select(selectShoppingListState);
  }

  ngOnInit() {}

  onEditItem(index: number) {
    this.store.dispatch(StartEdit({ editedItemIndex: index }));
  }
}
