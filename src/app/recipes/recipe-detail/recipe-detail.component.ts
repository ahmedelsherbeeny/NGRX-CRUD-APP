import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app-reducers';
import { AddIngredients } from 'src/app/shopping-list/store/shopping-list.actions';
import { selectRecipe } from '../store/recipe-selector';
import { deleteRecipe, stopEdit } from '../store/receipe-actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.store.select(selectRecipe).subscribe((resps) => {
        resps.Recipes.forEach((res) => {
          if (resps.Recipes.indexOf(res) === this.id) {
            this.recipe = resps.Recipes[this.id];
          }
        });
      });
    });
  }

  onAddToShoppingList() {
    this.store.dispatch(
      AddIngredients({ ingredients: this.recipe.ingredients })
    );
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.store.dispatch(deleteRecipe({ index: this.id }));
    this.store.dispatch(stopEdit());

    this.router.navigate(['/recipes']);
  }
}
