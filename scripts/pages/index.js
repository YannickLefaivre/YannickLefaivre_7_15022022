import Combobox from "../components/combobox.js";
import Factory from "../factories/factory.js";
import Normalize from "../utils/normalize.js";
import SearchEngine from "../utils/searchEngine.js";

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

async function init() {
	const initialRecipeList = await getRecipes();

	var searchedRecipes = [];

	const filtersOptionLabel = Normalize.parseFiltersOptionLabel(initialRecipeList);

	const filtersForm = [
		new Combobox(
			"filterIngredients",
			filtersOptionLabel.ingredientOptionsLabel
		),
		new Combobox(
			"filterAppliances",
			filtersOptionLabel.applianceOptionsLabel
		),
		new Combobox(
			"filterUstensils",
			filtersOptionLabel.ustensilOptionsLabel
		),
	];

	var otherCombobox = [];

	for (const filter of filtersForm) {
		otherCombobox.push(filter);
	}

	for (const filter of filtersForm) {
		filter["otherCombobox"] = otherCombobox;

		filter.initEventManagement();
	}

	initialRecipeList.forEach((recipe) => {
		const recipeModel = Factory.buildRecipeCard(recipe);

		recipeModel.render();
	});

	SearchEngine.init(initialRecipeList, searchedRecipes);
}

document.addEventListener("DOMContentLoaded", init);