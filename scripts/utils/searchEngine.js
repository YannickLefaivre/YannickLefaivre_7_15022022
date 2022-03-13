export default class SearchEngine {
	static init(initialRecipeList = [], updatedRecipeList = []) {
		this.initialRecipeList = initialRecipeList;
		this.updatedRecipeList = updatedRecipeList;
	}

	static searchRecipesMatching(initialRecipes, userInput) {
		if (userInput.length >= 3) {
			var searchedRecipes = [];

			for (const recipe of initialRecipes) {
				var aIngredientMatchUserInput = false;

				if (recipe.name.includes(userInput) !== false) {
					searchedRecipes.push(recipe);

					continue;
				} else if (
					recipe.description.includes(userInput) !== false
				) {
					searchedRecipes.push(recipe);

					continue;
				} else {
					for (const ingredients of recipe.ingredients) {
						if (
							ingredients.ingredient.includes(userInput) !== false
						) {
							aIngredientMatchUserInput = true;
							break;
						}
					}

					if (aIngredientMatchUserInput) {
						searchedRecipes.push(initialRecipes[i]);
						continue;
					}
				}
			}

			return searchedRecipes;
		} else {
			return null;
		}
	}
	
	static searchRecipesByTag(selectedOptions, aTagWasDismiss = false) {
		const userInput = document.getElementById("searchByWordInput").value;

		mainSearchBarIsEmpty = false;

		var recipeList = null;

		if (userInput.length === 0) {
			mainSearchBarIsEmpty = true;
		}

		if (!mainSearchBarIsEmpty) {
			this.updatedRecipeList = SearchEngine.searchRecipesMatching(
				this.initialRecipeList,
				userInput
			);
		}

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
								ingredientName.includes(
									selection.innerText.toLowerCase()
								)
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
								.includes(selection.innerText.toLowerCase()) !==
							false
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
									.includes(
										selection.innerText.toLowerCase()
									) !== false
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

			if (numberOfTagMatchingThisRecipe === selectedOptions.length) {
				return true;
			} else {
				return false;
			}
		});

		return this.updatedRecipeList;
	}

	static searchRecipesWithMultipleTag(
		comboboxAssociatedToTheTag,
		aTagWasDismiss = false
	) {
		const keywordLabelList = document.querySelectorAll(
			".keywords-list__item"
		);

		if (keywordLabelList === undefined) {
			throw TypeError();
		}

		var recipeList = [];

		recipeList = SearchEngine.searchRecipesByTag(
			keywordLabelList,
			aTagWasDismiss
		);

		comboboxAssociatedToTheTag.updateAllListbox(recipeList);

		return recipeList;
	}
}
