import { getRecipes } from "../pages/index.js";

export default class SearchEngine {
	static init(initialRecipeList = [], updatedRecipeList = []) {
		this.initialRecipeList = initialRecipeList;
		this.updatedRecipeList = updatedRecipeList;
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

	static searchRecipesByTag(
		selectedOptions,
		aTagWasDismiss = false
	) {
		var recipeList = null;

		if (this.updatedRecipeList.length === 0 || aTagWasDismiss) {
			recipeList = this.initialRecipeList;
		} else {
			recipeList = this.updatedRecipeList;
		}

		this.updatedRecipeList = recipeList.filter((recipe) => {
			var numberOfTagMatchingThisRecipe = 0;

			selectedOptions.forEach((selection) => {
				switch (selection.id) {
					case "filterIngredients":
						var aIngrendientMatch = false;

						recipe.ingredients.forEach((ingredientInfos) => {
							const ingredientName =
								ingredientInfos.ingredient.toLowerCase();

							if (
								ingredientName.includes(selection.innerText.toLowerCase())
							) {
								aIngrendientMatch = true;
							}
						});

						if (aIngrendientMatch) {
							numberOfTagMatchingThisRecipe++;
							return;
						}

						break;

					case "filterAppliances":
						if (
							recipe.appliance
								.toLowerCase()
								.includes(selection.innerText.toLowerCase()) !== false
						) {
							numberOfTagMatchingThisRecipe++;
							return;
						}

						break;

					case "filterUstensils":
						var aUstensilMatch = false;

						recipe.ustensils.forEach((ustensil) => {
							if (
								ustensil
									.toLowerCase()
									.includes(selection.innerText.toLowerCase()) !== false
							) {
								aUstensilMatch = true;
							}
						});

						if (aUstensilMatch) {
							numberOfTagMatchingThisRecipe++;
							return;
						}

						break;

					default:
						return;
				}
			});

			if(numberOfTagMatchingThisRecipe === selectedOptions.length) {
				return true;
			} else {
				return false;
			}
		});

		return this.updatedRecipeList;
	}

	static searchRecipesWithMultipleTag(comboboxAssociatedToTheTag, aTagWasDismiss = false) {
		const keywordLabelList = document.querySelectorAll(
			".keywords-list__item"
		);

		if (keywordLabelList === undefined) {
			throw TypeError();
		}

		var recipeList = [];

		recipeList = SearchEngine.searchRecipesByTag(keywordLabelList, aTagWasDismiss);

		comboboxAssociatedToTheTag.updateAllListbox(recipeList);

		return recipeList;
	}
}
