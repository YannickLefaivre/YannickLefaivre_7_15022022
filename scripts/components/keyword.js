import Factory from "../factories/factory.js";
import SearchEngine from "../utils/searchEngine.js";

export default class Keyword {
	/**
	 * @param {String} keywordName
	 */
	constructor(keywordName, filterType, associatedCombobox) {
		this.container = document.querySelector(".keywords-list");
		this.associatedCombobox = associatedCombobox;
		this.dom = this.buildDOM(keywordName, filterType);
	}

	buildDOM(keywordName, filterType) {
		const dom = document.createElement("LI");

		var keywordType = "";

		switch (filterType) {
			case "ingredients":
				keywordType = filterType.slice(0, filterType.length - 1);

				break;
			case "appareils":
				keywordType = "appliance";

				break;
			case "ustensiles":
				keywordType = "ustensils";

				break;
			default:
				var passedValue = "";

				if (filterType === "") {
					passedValue = "Empty string";
				} else {
					passedValue = filterType;
				}

				throw SyntaxError(
					`The keywordType variable doesn't contain a valid value. The value which was provided to the method was ${passedValue}.`
				);
		}

		dom.classList.add("keywords-list__item");

		dom.classList.add(`keywords-list__item--bg-${keywordType}`);

		dom.innerHTML = `<button
            class="btn btn--close"
            aria-label="Supprimer le mot-clé ${keywordName}"
        >
            <span class="btn--close__label"
                >${keywordName}</span
            >

            <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="lpp-icon btn--close__icon"
                viewBox="0 0 16 16"
            >
                <path
                    d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                />
                <path
                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                />
            </svg>
        </button>`;

		return dom;
	}

	render() {
		this.container.parentElement.classList.add(
			"keywords-row--keywords-active"
		);
		this.container.appendChild(this.dom);
	}

	dismiss() {
		this.container.removeChild(this.dom);

		document.querySelector(".recipes-card-grid").innerHTML = "";

		const keywordLabelList =
			document.querySelectorAll(".btn--close__label");

		var recipeList = [];

		if (keywordLabelList.length !== 0) {
			recipeList = [];

			keywordLabelList.forEach((keywordLabel) => {
				recipeList = SearchEngine.searchRecipesByTag(
					keywordLabel.innerText,
					true
				);
			});

			this.associatedCombobox.listbox.update(recipeList);
		} else {
			recipeList = SearchEngine.initialRecipeList;
			SearchEngine.updatedRecipeList.length = 0;

			this.associatedCombobox.listbox.update(recipeList);
		}

		recipeList.forEach((recipe) => {
			const recipeCard = Factory.buildRecipeCard(recipe);

			recipeCard.render();
		});
	}

	listenDismissRequest() {
		this.dom.addEventListener("click", this.dismiss.bind(this));
	}
}
