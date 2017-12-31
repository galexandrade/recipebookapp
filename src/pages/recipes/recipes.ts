import { Component } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { Recipe } from '../../models/recipe';
import { RecipeService } from '../../services/recipe';

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {
  recipes: Recipe[] = [];
  constructor(private navCtrl:NavController,
              private recipeService: RecipeService){
  }

  ionViewWillEnter(){
    this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe(){
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

  onLoadRecipe(index: number){

  }
}
