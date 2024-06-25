import { Ingredient } from './../../shared/ingredient.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import {
  AddIngredient,
  DeleteIngredient,
  StopEdit,
  UpdateIngredient,
} from '../store/shopping-list.actions';
import * as fromApp from '../../store/app-reducers';
import { selectShoppingListState } from '../store/shopping-list.selector';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.subscription = this.store
      .select(selectShoppingListState)
      .subscribe((storeData) => {
        if (storeData.editedItemIndex > -1) {
          this.editMode = true;
          this.editedItem = storeData.editedIngredient;
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount,
          });
        } else {
          this.editMode = false;
        }
      });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.store.dispatch(
        UpdateIngredient({
          ingredient: newIngredient,
        })
      );
    } else {
      this.store.dispatch(AddIngredient({ ingredient: newIngredient }));
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(StopEdit());
  }

  onDelete() {
    this.store.dispatch(DeleteIngredient());

    this.onClear();
    this.store.dispatch(StopEdit());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(StopEdit());
  }
}
