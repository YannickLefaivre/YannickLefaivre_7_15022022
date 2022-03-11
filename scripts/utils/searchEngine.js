import { getRecipes } from "../pages/index.js";

export default class SearchEngine {
	static init(initialRecipeList = [], updatedRecipeList = []) {
		this.initialRecipeList = initialRecipeList;
		this.updatedRecipeList = updatedRecipeList;
		this.lastUpdatedRecipesList = [];
	}

	static async searchRecipesMatching(userInput) {
		if (userInput.length >= 3) {
			var recipes = await getRecipes();

			searchedRecipes = [];

			searchedRecipes = recipes.filter((recipe) => {
				var ingredientMatchUserInput = false;

				switch (userInput) {
					case recipe.name.indexOf(userInput) !== -1:
						return true;

					case recipe.description.indexOf(userInput) !== -1:
						return true;

					default:
						recipe.ingredients.forEach((ingredient) => {
							if (ingredient.ingredient.indexOf(userInput)) {
								ingredientMatchUserInput = true;
							}
						});

						return ingredientMatchUserInput;
				}
			});

			return searchedRecipes;
		} else {
			return null;
		}
	}

	static searchRecipesByTag(filterType, selectedOption, aTagWasDissmiss) {
		var recipeList = this.updatedRecipeList;

		if (this.updatedRecipeList.length === 0 || aTagWasDissmiss) {
			recipeList = this.initialRecipeList;
		}

		this.updatedRecipeList = recipeList.filter((recipe) => {
			switch (filterType) {
				case "filterIngredients":
					var aIngrendientMatch = false;

					recipe.ingredients.forEach((ingredientInfos) => {
						const ingredientName =
							ingredientInfos.ingredient.toLowerCase();

						if (
							ingredientName.includes(
								selectedOption.toLowerCase()
							)
						) {
							aIngrendientMatch = true;
						}
					});

					return aIngrendientMatch;

				case "filterAppliances":
					if (
						recipe.appliance
							.toLowerCase()
							.includes(selectedOption.toLowerCase()) !== false
					) {
						return true;
					} else {
						return false;
					}

				case "filterUstensils":
					var aUstensilMatch = false;

					recipe.ustensils.forEach((ustensil) => {
						if (
							ustensil
								.toLowerCase()
								.includes(selectedOption.toLowerCase()) !==
							false
						) {
							aUstensilMatch = true;
						}
					});

					return aUstensilMatch;

				default:
					return false;
			}
		});

		return this.updatedRecipeList;
	}
}
