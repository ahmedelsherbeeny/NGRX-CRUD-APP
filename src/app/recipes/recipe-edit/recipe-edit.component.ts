import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  FormBuilder,
} from '@angular/forms';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app-reducers';
import { Recipe } from '../recipe.model';
import { AddRecipe, startEdit, stopEdit } from '../store/receipe-actions';
import { selectRecipe } from '../store/recipe-selector';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  recipe: Recipe;
  imagePreview: string;

  get ingredientsControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      if (params['id'] != null) {
        this.editMode = true;

        this.store.select(selectRecipe).subscribe((resps) => {
          resps.Recipes.forEach((res) => {
            if (resps.Recipes.indexOf(res) === this.id) {
              this.recipe = resps.Recipes[this.id];
            }
          });
        });
      }
    });
    this.initForm();
  }

  onSubmit() {
    if (this.recipeForm.valid) {
      const newRecipe: Recipe = {
        name: this.recipeForm.value.name,
        description: this.recipeForm.value.description,
        imagePath: this.recipeForm.value.imagePath,
        ingredients: this.recipeForm.value.ingredients,
      };
      if (this.editMode) {
        const updatedRecipe: Recipe = this.recipeForm.value;
        this.store.dispatch(
          startEdit({ recipe: updatedRecipe, index: this.id })
        );
        this.store.dispatch(stopEdit());
      } else {
        this.store.dispatch(AddRecipe({ recipe: newRecipe }));
      }
    }

    this.onCancel();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.recipeForm.patchValue({ imagePath: this.imagePreview });
    };
    reader.readAsDataURL(file);
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      recipeName = this.recipe.name;
      recipeImagePath = this.recipe.imagePath;
      recipeDescription = this.recipe.description;
      this.imagePreview = recipeImagePath; // Initialize image preview with existing image path

      if (this.recipe['ingredients']) {
        for (let ingredient of this.recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }
}
