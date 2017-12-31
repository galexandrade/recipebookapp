import { Component } from '@angular/core';
import { Recipe } from '../../models/recipe';

@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html',
})
export class RecipePage {
  recipe: Recipe;

}
