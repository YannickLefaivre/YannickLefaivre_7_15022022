import Keyword from "./keyword.js";
import Normalize from "../utils/normalize.js";
import SearchEngine from "../utils/searchEngine.js";
import Factory from "../factories/factory.js";

export default class Listbox {
	/**
	 * @param {HTMLDivElement | Element} container
	 * @param {HTMLButtonElement | Element} trigger
	 * @param {HTMLUListElement | Element} element
	 * @param {Array<String>} options
	 * @param {HTMLDivElement | Element} ariaExpandedStateManager
	 * @param {Textbox} ariaControler
	 */
	constructor(
		ownedCombobox,
		trigger,
		element,
		options,
		ariaExpandedStateManager,
		ariaControler
	) {
		this.isAlreadyInstantiate = true;

		this.keywordList = document.querySelector(".keywords-list");

		this.ariaControler = ariaControler;

		this.ownedCombobox = ownedCombobox;

		this.container = ownedCombobox.element;

		this.trigger = trigger;

		this.ariaExpandedStateManager = ariaExpandedStateManager;

		this.element = element;

		this.options = this.createOptionsDOM(options);

		this.options.forEach((option) => (this.element.innerHTML += option));

		this.options = this.element.querySelectorAll(".option-list__item");

		this.selectedOption = "";

		this.isOpen = false;
	}

	/**
	 *
	 * @param {[]} optionsLabel
	 */
	createOptionsDOM(optionsLabel) {
		var allOptionDOM = [];

		optionsLabel.forEach((optionLabel) => {
			var lowerCaseLabel = optionLabel.toLowerCase();

			var id = lowerCaseLabel.replace(/[\s\(\)\d\.]+/gi, "-");

			const optionDOM = `<li id="${id}" class="option-list__item">${optionLabel}</li>`;

			allOptionDOM.push(optionDOM);
		});

		return allOptionDOM;
	}

	registerEventListener() {
		this.container.addEventListener("click", (clickEvent) => {
			clickEvent.stopPropagation();
		});

		this.trigger.addEventListener("click", this.onClick.bind(this));

		this.options.forEach((option) => {
			option.addEventListener("click", this.selectOption.bind(this));
		});

		document.addEventListener("click", this.onClick.bind(this));
	}

	/**
	 * Manage opening and closing of the listbox when user clicks
	 * on *the show dropdown* button.
	 * @param {MouseEvent} clickEvent MouseEvent object passed by the "click" event
	 */
	onClick(clickEvent) {
		if (
			!this.isOpen &&
			(clickEvent.currentTarget !== document ||
				clickEvent.currentTarget === this.trigger)
		) {
			if (!clickEvent.defaultPrevented) {
				clickEvent.preventDefault();
			}

			clickEvent.stopPropagation();

			this.open();

			this.ariaControler.changeInputHintDisplay();
		} else if (
			clickEvent.currentTarget === this.trigger ||
			clickEvent.currentTarget === document
		) {
			this.preventMultipleCallToCloseFunction(clickEvent);

			this.close();

			this.ariaControler.resetTextbox();
		}
	}

	open() {
		this.element.classList.remove("hidden-content");

		this.keywordList.classList.add("keywords-dropdown-open");

		this.getTriggerIconClassList().add(
			"btn--combobox__icon--dropdown-open"
		);

		this.container.classList.add("combobox-wrapper--dropdown-open");

		this.container.parentElement.classList.add("filter--dropdown-open");

		this.ariaControler.element.focus();

		this.ariaExpandedStateManager.setAttribute("aria-expanded", "true");

		this.isOpen = true;
	}

	close() {
		this.element.classList.add("hidden-content");

		this.keywordList.classList.remove("keyword-dropdown-open");

		this.getTriggerIconClassList().remove(
			"btn--combobox__icon--dropdown-open"
		);

		this.container.classList.remove("combobox-wrapper--dropdown-open");

		this.container.parentElement.classList.remove("filter--dropdown-open");

		this.ariaExpandedStateManager.setAttribute("aria-expanded", "false");

		this.isOpen = false;
	}

	async selectOption(event) {
		event.stopPropagation();

		this.selectedOption = event.currentTarget.innerText;

		this.preventMultipleCallToCloseFunction(event);

		this.close();

		this.ariaControler.resetTextbox();

		const inputHint = this.ariaControler.inputHint.innerText.toLowerCase();

		const filterType = Normalize.string(inputHint);

		const keyword = new Keyword(
			`${this.selectedOption.toLowerCase()}`,
			`${filterType}`,
			this.ownedCombobox
		);

		keyword.render();

		keyword.listenDismissRequest();

		const updatedRecipesList = SearchEngine.searchRecipesByTag(
			this.selectedOption,
			false
		);
		debugger;

		this.update(updatedRecipesList);

		document.querySelector(".recipes-card-grid").innerHTML = "";

		updatedRecipesList.forEach((recipe) => {
			const recipeCard = Factory.buildRecipeCard(recipe);

			recipeCard.render();
		});
	}

	update(recipeList) {
		const filtersOptionLabel =
			Normalize.parseFiltersOptionLabel(recipeList);

		this.element.innerHTML = "";

		switch (this.container.id) {
			case "filterIngredients":
				this.createOptionsDOM(
					filtersOptionLabel.ingredientOptionsLabel
				);

				break;

			case "filterAppliances":
				this.createOptionsDOM(filtersOptionLabel.applianceOptionsLabel);

				return true;

			case "filterUstensils":
				this.createOptionsDOM(filtersOptionLabel.ustensilOptionsLabel);

				return true;

			default:
				return false;
		}
	}

	/**
	 *
	 * @param {KeyboardEvent | MouseEvent} event
	 */
	preventMultipleCallToCloseFunction(event) {
		if (
			[this.element, this.options, this.trigger, this.container].includes(
				event.target
			)
		) {
			event.stopPropagation();
		}
	}

	getTriggerIconClassList() {
		return this.trigger.querySelector(".btn--combobox__icon").classList;
	}
}
