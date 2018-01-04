import { Component } from '@angular/core';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { ShoppingListService } from '../../services/shopping-list';
import { Ingredient } from '../../models/ingredient';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { AuthService } from '../../services/auth';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { error } from '@firebase/database/dist/esm/src/core/util/util';
import { DatabaseOptions } from '../database-options/database-options';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  listItems:Ingredient[];
  constructor(private slService: ShoppingListService,
              private popoverCtrl: PopoverController,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController){}

  ionViewWillEnter(){
    this.loadItems();
  }

  onAddItem(form: NgForm){
    this.slService.addItem(form.value.ingredientName, form.value.ingredientAmount);
    form.reset();
    this.loadItems();
  }

  onCheckItem(index:number){
    this.slService.removeIngredient(index);
    this.loadItems();
  }

  loadItems(){
    this.listItems = this.slService.getItems();
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
            this.slService.loadList(token)
              .subscribe(
                (list: Ingredient[]) => {
                  loading.dismiss();
                  if(list){
                    this.listItems = list;
                  }
                  else{
                    this.listItems = [];
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
            this.slService.storeList(token)
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
