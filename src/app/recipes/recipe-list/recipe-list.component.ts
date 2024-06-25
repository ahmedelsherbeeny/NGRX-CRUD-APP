import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app-reducers';
import { Store } from '@ngrx/store';
import { selectRecipe } from '../store/recipe-selector';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];
  recipes$: Observable<{ Recipes: Recipe[] }>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {
    this.recipes$ = this.store.select(selectRecipe);
  }

  ngOnInit() {}

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
