import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app-reducers';
import { AddIngredients } from 'src/app/shopping-list/store/shopping-list.actions';
import { selectRecipe } from '../store/recipe-selector';
import { deleteRecipe, stopEdit } from '../store/receipe-actions';
import { Subscription } from 'rxjs';
import { PlaceholderDirective } from 'src/app/shared/placeholder/placeholder.directive';
import { AlertComponent } from 'src/app/shared/alert/alert.component';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  private closeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>,
    private componentFactoryResolver: ComponentFactoryResolver
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
    if (this.recipe.ingredients.length === 0) {
      this.showMessage('There Are No Ingredients In The Recipe');
    } else {
      this.store.dispatch(
        AddIngredients({ ingredients: this.recipe.ingredients })
      );
      this.router.navigate(['/shopping-list']);

    }
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.store.dispatch(deleteRecipe({ index: this.id }));
    this.store.dispatch(stopEdit());

    this.router.navigate(['/recipes']);
  }

  private showMessage(message: string) {
    // const alertCmp = new AlertComponent();
    const alertCmpFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
