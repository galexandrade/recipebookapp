import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../models/recipe';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { ShoppingListService } from '../../services/shopping-list';
import { RecipeService } from '../../services/recipe';

@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html',
})
export class RecipePage implements OnInit {
  recipe: Recipe;
  index: number;

  constructor(private navParams: NavParams,
              private navCtrl: NavController,
              private slService: ShoppingListService,
              private recipeService: RecipeService){
  }

  ngOnInit(){
    this.recipe = this.navParams.get('recipe');
    console.log('AKIII', this.recipe);
    this.index = this.navParams.get('index');
  }

  onEditRecipe(){
    this.navCtrl.push(EditRecipePage, {
      mode: 'Edit',
      recipe: this.recipe,
      index: this.index
    });
  }

  onAddIngredients(){
    this.slService.addItems(this.recipe.ingredients);
  }

  onDeleteRecipe(){
    this.recipeService.removeRecipe(this.index);
    this.navCtrl.popToRoot();
  }

}
