export default class SearchEngine {
	static init(initialRecipeList = [], updatedRecipeList = []) {
		this.initialRecipeList = initialRecipeList;
		this.updatedRecipeList = updatedRecipeList;
	}

	static searchRecipesByTag(selectedOptions, aTagWasDismiss) {
		const userInput = document.getElementById("searchByWordInput").value;

		var mainSearchBarIsEmpty = false;

		if (userInput === 0) {
			mainSearchBarIsEmpty = true;
		}

		var recipeList = null;

		if (
			this.updatedRecipeList.length === 0 ||
			(aTagWasDismiss && mainSearchBarIsEmpty)
		) {
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

	static searchRecipesWithMultipleTag(
		comboboxAssociatedToTheTag,
		aTagWasDismiss
	) {
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
