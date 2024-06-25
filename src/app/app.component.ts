import { Component, OnInit } from '@angular/core';

import { LoggingService } from './logging.service';
import { Store } from '@ngrx/store';
import { init } from './shopping-list/store/shopping-list.actions';
import * as fromApp from './store/app-reducers';
import { autoLogin } from './auth/store/auth.actions';
import { initRecipe } from './recipes/store/receipe-actions';
import { Recipe } from './recipes/recipe.model';
import { Ingredient } from './shared/ingredient.model';

const initialRecipes: Recipe[] = [
  new Recipe(
    'Spaghetti Carbonara',
    'Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
    '../../../assets/images/images.jpeg',
    [
      new Ingredient('Spaghetti', 200),
      new Ingredient('Eggs', 2),
      new Ingredient('Pancetta', 150),
      new Ingredient('Parmesan Cheese', 50),
      new Ingredient('Black Pepper', 1),
    ]
  ),
  new Recipe(
    'Chicken Alfredo Pasta',
    'Creamy pasta dish with grilled chicken, Alfredo sauce, and herbs.',
    '../../../assets/images/images (1).jpeg',
    [
      new Ingredient('Fettuccine Pasta', 250),
      new Ingredient('Chicken Breast', 300),
      new Ingredient('Alfredo Sauce', 200),
      new Ingredient('Garlic', 2),
      new Ingredient('Parsley', 1),
    ]
  ),
  // Add more recipes as needed
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private loggingService: LoggingService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.store.dispatch(autoLogin());

    this.loggingService.printLog('Hello from AppComponent ngOnInit');
    this.store.dispatch(init());
    this.store.dispatch(initRecipe());
  }
}
