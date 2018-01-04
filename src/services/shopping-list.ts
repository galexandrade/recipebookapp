import { Ingredient } from "../models/ingredient";
import { Injectable } from "@angular/core";
import { Http, Response }  from "@angular/http";
import { AuthService } from "./auth";
import "rxjs/Rx";

@Injectable()
export class ShoppingListService{
    private ingredients: Ingredient[] = [];

    constructor(private http: Http,
                private authService: AuthService){}

    addItem(name:string, amount:number){
        this.ingredients.push(new Ingredient(name, amount));
        console.log(this.ingredients);
    }

    addItems(items:Ingredient[]){
        this.ingredients.push(...items);
    }

    getItems():Ingredient[]{
        return this.ingredients.slice();
    }

    removeIngredient(index:number){
        this.ingredients.splice(index, 1);
    }

    storeList(token: string){
        const userId = this.authService.getActiveUser().uid;
        return this.http.put('https://ionic-recipe-book-1e1fa.firebaseio.com/' + userId + '/shopping-list.json?auth=' + token, this.ingredients)
            .map((response: Response) => {
                return response.json();
            });
    }

    loadList(token: string){
        const userId = this.authService.getActiveUser().uid;
        return this.http.get('https://ionic-recipe-book-1e1fa.firebaseio.com/' + userId + '/shopping-list.json?auth=' + token)
            .map((response: Response) => {
                return response.json();
            })
            .do(data => {
                this.ingredients = data;
            });
    }
}