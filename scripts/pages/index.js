import Factory from "../factories/factory.js";

import Combobox from "../components/Combobox.js";

async function getRecipes() {
	const response = await fetch("./api/recipes.json");
	var recipes = {};

	if (response.ok) {
		recipes = await response.json();
	} else {
		console.error(
			`The server doesn't succeed to fullfill the request. Server responded: ${response.statusText}`
		);
	}

	return recipes;
}

/**
 * Transform the first letter of the *string* to upper case
 * @param {String} string
 */
function firstLetterToUpperCase(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function getFiltersOptionsLabel(data) {
	var ingredientOptionsLabel = [];
	var applianceOptionsLabel = [];
	var ustensilOptionsLabel = [];

	const removesWordBetweenParentheses = (string) =>
		string.replace(/\s\([^\)]*\)/gi, "");

	data.forEach((data) => {
		data.ingredients.forEach((ingredients) => {
			var ingredientOptions = firstLetterToUpperCase(
				ingredients.ingredient.toLowerCase()
			);

			ingredientOptionsLabel.push(
				removesWordBetweenParentheses(ingredientOptions)
			);
		});

		var applianceOptions = removesWordBetweenParentheses(
			data.appliance.toLowerCase()
		);

		applianceOptionsLabel.push(
			firstLetterToUpperCase(applianceOptions)
		);

		data.ustensils.forEach((ustensil) => {
			var ustensilOption =
				firstLetterToUpperCase(ustensil.toLowerCase());

			ustensilOptionsLabel.push(
				removesWordBetweenParentheses(ustensilOption)
			);
		});
	});

	/* Removes duplicate from the array of labels of each filter */
	var filtersOptionLabel = {
		ingredientOptionLabel: [...new Set(ingredientOptionsLabel)],
		applianceOptionsLabel: [...new Set(applianceOptionsLabel)],
		ustensilOptionsLabel: [...new Set(ustensilOptionsLabel)],
	};

	return filtersOptionLabel;
}

async function init() {
	const recipes = await getRecipes();

	const filtersOptionLabel = getFiltersOptionsLabel(recipes);

	const filtersForm = [
		new Combobox(
			"filterIngredients",
			filtersOptionLabel.ingredientOptionLabel
		),
		new Combobox(
			"filterappliances",
			filtersOptionLabel.applianceOptionsLabel
		),
		new Combobox(
			"filterUstensils",
			filtersOptionLabel.ustensilOptionsLabel
		),
	];

	filtersForm.forEach((filter) => {
		filter.initEventManagement();
	});

	recipes.forEach((recipe) => {
		const recipeCard = Factory.buildRecipeCard(recipe);

		recipeCard.display();
	});
}

document.addEventListener("DOMContentLoaded", init);
