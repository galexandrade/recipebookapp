import { Component } from '@angular/core';
import { NavParams, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../../services/recipe';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { Recipe } from '../../models/recipe';

@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit {

  mode = 'New';
  selectOptions = ['Easy', 'Medium', 'Hard'];
  recipeForm:FormGroup;
  recipe: Recipe;
  index: number;

  constructor(private navParams:NavParams,
              private actionSheetController:ActionSheetController,
              private alertController: AlertController,
              private toastController: ToastController,
              private recipeService: RecipeService,
              private navController: NavController){
  }

  ngOnInit(){
    this.mode = this.navParams.get('mode');
    if(this.mode == 'Edit'){
      this.recipe = this.navParams.get('recipe');
      this.index = this.navParams.get('index');
    }

    this.initializeForm();
  }

  private initializeForm(){
    let title = null;
    let description = null;
    let difficulty = null;
    let ingredients = [];

    if(this.mode == 'Edit'){
      title = this.recipe.title;
      description = this.recipe.description
      difficulty = this.recipe.difficulty;
      ingredients = this.recipe.ingredients.map(ingredient => {
        return new FormControl(ingredient.name, Validators.required);
      });
    }

    this.recipeForm = new FormGroup({
      'title': new FormControl(title, Validators.required),
      'description': new FormControl(description, Validators.required),
      'difficulty': new FormControl(difficulty, Validators.required),
      'ingredients': new FormArray(ingredients)
    });
  }

  onSubmit(){
    console.log(this.recipeForm);
    const value = this.recipeForm.value;
    let ingredients = [];

    if(value.ingredients.length > 0){
      ingredients = value.ingredients.map(name => {
        return {name: name, amount: 1};
      });
    }

    if(this.mode == 'Edit'){
      this.recipeService.updateRecipe(this.index, value.title, value.description, value.difficulty, ingredients);
    }
    else{
      this.recipeService.addRecipe(value.title, value.description, value.difficulty, ingredients);
    }
    this.recipeForm.reset();
    this.navController.popToRoot();
  }

  onMenageIngredients(){
    const actionSheet = this.actionSheetController.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Add ingredient',
          handler: () => {
            this.createNewIngredientAlert().present();
          }
        },
        {
          text: 'Remove all ingredients',
          role: 'destructive',
          handler: () => {
            const fArray:FormArray = <FormArray>this.recipeForm.get('ingredients');
            const len = fArray.length;

            if(len > 0){
              for(let i = len - 1; i>=0; i--){
                fArray.removeAt(i);
              }
              const toast = this.toastController.create({
                message: 'Ingredients removed!',
                duration: 1500,
                position: 'bottom'
              });
              toast.present();
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();

  }

  private createNewIngredientAlert(){
    return this.alertController.create({
      title: 'Add ingredient',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: data => {
            if(data.name.trim() == '' || data.name == null){
              const toast = this.toastController.create({
                message: 'Please enter a valid value!',
                duration: 1500,
                position: 'bottom'
              });
              toast.present();

              return;
            }

            (<FormArray>this.recipeForm.get('ingredients')).push(new FormControl(data.name, Validators.required));
            const toast = this.toastController.create({
              message: 'Item added!',
              duration: 1500,
              position: 'bottom'
            });
            toast.present();
          }
        }
      ]
    });
  }

}
