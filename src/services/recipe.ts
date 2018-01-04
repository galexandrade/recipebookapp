import { Recipe } from "../models/recipe";
import { Ingredient } from "../models/ingredient";
import { Injectable } from "@angular/core";
import { Http, Response }  from "@angular/http";
import { AuthService } from "./auth";
import "rxjs/Rx";

@Injectable()
export class RecipeService{
    private recipes: Recipe[] = [];

    constructor(private http: Http,
        private authService: AuthService){}

    addRecipe(
        title:string,
        description:string,
        difficulty: string,
        ingredients: Ingredient[]){
        this.recipes.push(new Recipe(title, description, difficulty, ingredients));
        console.log(this.recipes);
    }

    getRecipes():Recipe[]{
        return this.recipes.slice();
    }

    updateRecipe(
        index: number,
        title:string,
        description:string,
        difficulty: string,
        ingredients: Ingredient[]){
        this.recipes[index] = new Recipe(title, description, difficulty, ingredients);
    }

    removeRecipe(index:number){
        this.recipes.splice(index, 1);
    }

    storeRecipes(token: string){
        const userId = this.authService.getActiveUser().uid;
        return this.http.put('https://ionic-recipe-book-1e1fa.firebaseio.com/' + userId + '/recipes.json?auth=' + token, this.recipes)
            .map((response: Response) => {
                return response.json();
            });
    }

    loadRecipes(token: string){
        const userId = this.authService.getActiveUser().uid;
        return this.http.get('https://ionic-recipe-book-1e1fa.firebaseio.com/' + userId + '/recipes.json?auth=' + token)
            .map((response: Response) => {
                const recipes: Recipe[] = response.json() ? response.json() : [];
                recipes.map(recipe => {
                    if(!recipe.ingredients)
                        recipe.ingredients = [];
                    return recipe;
                })

                return recipes;
            })
            .do(data => {
                if(data)
                    this.recipes = data;
            });
    }
}