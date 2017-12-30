import { Component } from '@angular/core';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { ShoppingListService } from '../../services/shopping-list';
import { Ingredient } from '../../models/ingredient';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  listItems:Ingredient[];
  constructor(private slService: ShoppingListService){}

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

}
