import { Component } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { Recipe } from '../../models/recipe';
import { RecipeService } from '../../services/recipe';
import { RecipePage } from '../recipe/recipe';
import { AuthService } from '../../services/auth';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { DatabaseOptions } from '../database-options/database-options';

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {
  recipes: Recipe[] = [];
  constructor(private navCtrl:NavController,
              private recipeService: RecipeService,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private popoverCtrl: PopoverController){
  }

  ionViewWillEnter(){
    this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe(){
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

  onLoadRecipe(index: number){
    this.navCtrl.push(RecipePage, {
      'recipe': this.recipes[index],
      'index': index
    });
  }

  onShowOptions(event: MouseEvent){
    const loading = this.loadingCtrl.create({
      content: 'Loading list...'
    });

    const options = this.popoverCtrl.create(DatabaseOptions);
    options.present({
      ev: event
    });

    options.onDidDismiss(data => {
      if(!data){
        return;
      }

      if(data.action == 'load'){
        loading.present();
        this.authService.getActiveUser().getToken()
          .then((token: string) => {
            this.recipeService.loadRecipes(token)
              .subscribe(
                (list: Recipe[]) => {
                  loading.dismiss();
                  if(list){
                    this.recipes = list;
                  }
                  else{
                    this.recipes = [];
                  }
                },
                (error) => {
                  loading.dismiss();
                  this.handleError(error.json().error);
                }
              );
          });
      }
      else if(data.action == 'store'){
        loading.present();
        this.authService.getActiveUser().getToken()
          .then((token: string) => {
            this.recipeService.storeRecipes(token)
              .subscribe(
                () => {
                  loading.dismiss();
                  console.log('success');
                },
                (error) => {
                  loading.dismiss();
                  this.handleError(error.json().error);
                }
              );
          });
      }
    })
  }

  private handleError(message: string){
    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: message,
      buttons: ['Ok']
    });

    alert.present();
  }
}
