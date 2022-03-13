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

function displaySearchResult(searchResult, userInput) {
	const recipesCardGrid = document.querySelector(".recipes-card-grid");

	if (userInput.length >= 3) {
		recipesCardGrid.innerHTML = "";

		if (searchResult === null) {
			recipesCardGrid.classList.add("recipes-card-grid--no-result");

			recipesCardGrid.innerHTML = `<p>Aucune recette ne correspond à votre critère… vous pouvez
			chercher « tarte aux pommes », « poisson », etc.</p>`;
		} else {
			searchResult.forEach((result) => {
				Factory.buildRecipeCard(result).render();
			});
		}
	} else {
		SearchEngine.initialRecipeList.forEach((recipe) =>
			Factory.buildRecipeCard(recipe).render()
		);
	}
}

async function init() {
	const initialRecipes = await getRecipes();

	var searchedRecipes = [];

	const filtersOptionLabel =
		Normalize.parseFiltersOptionLabel(initialRecipes);

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

	initialRecipes.forEach((recipe) => {
		const recipeModel = Factory.buildRecipeCard(recipe);

		recipeModel.render();
	});

	SearchEngine.init(initialRecipes, searchedRecipes);

	document
		.getElementById("searchByWordInput")
		.addEventListener("input", (event) => {
			if (event.defaultPrevented) {
				return;
			}

			var userInput = event.currentTarget.value;

			var searchResult = SearchEngine.searchRecipesMatching(
				initialRecipes,
				userInput
			);

			const recipesCardGrid =
				document.querySelector(".recipes-card-grid");

			if (userInput.length >= 3) {
				recipesCardGrid.innerHTML = "";

				if (searchResult === null) {
					recipesCardGrid.classList.add(
						"recipes-card-grid--no-result"
					);

					recipesCardGrid.innerHTML = `<p>Aucune recette ne correspond à votre critère… vous pouvez
			chercher « tarte aux pommes », « poisson », etc.</p>`;

					filtersForm[0].updateAllListbox(initialRecipes);
				} else {
					searchResult.forEach((result) => {
						Factory.buildRecipeCard(result).render();
					});

					filtersForm[0].updateAllListbox(searchResult);
				}
			} else {
				initialRecipes.forEach((recipe) =>
					Factory.buildRecipeCard(recipe).render()
				);

				filtersForm[0].updateAllListbox(initialRecipes);
			}

			event.preventDefault();
		});
}

document.addEventListener("DOMContentLoaded", init);
