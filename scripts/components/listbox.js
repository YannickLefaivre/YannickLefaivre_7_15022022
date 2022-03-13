import Keyword from "./keyword.js";
import Normalize from "../utils/normalize.js";
import SearchEngine from "../utils/searchEngine.js";
import Factory from "../factories/factory.js";
import Combobox from "./combobox.js";

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
		combobox,
		trigger,
		element,
		options,
		ariaExpandedStateManager,
		ariaControler
	) {
		this.isAlreadyInstantiate = true;

		this.keywordList = document.querySelector(".keywords-list");

		this.ariaControler = ariaControler;

		this.combobox = combobox;

		this.container = combobox.element;

		this.trigger = trigger;

		this.ariaExpandedStateManager = ariaExpandedStateManager;

		this.element = element;

		this.options = this.createOptions(options);

		this.selectedOption = "";

		this.isOpen = false;
	}

	/**
	 *
	 * @param {String[]} optionsLabel
	 */
	createOptions(optionsLabel) {
		optionsLabel.forEach((optionLabel) => {
			var label = optionLabel.replace(/[\.]*/gi, "");

			var id = label.toLowerCase().replace(/[\s\(\)\d]+/gi, "-");

			const optionDOM = `<li id="${id}" class="option-list__item">${label}</li>`;

			this.element.innerHTML += optionDOM;
		});

		return this.element.querySelectorAll(".option-list__item");
	}

	registerEventListener(updateOnlyOptionsClickEvent = false) {
		if (updateOnlyOptionsClickEvent) {
			this.container.addEventListener("click", (clickEvent) => {
				clickEvent.stopPropagation();
			});

			this.trigger.addEventListener("click", this.onClick.bind(this));

			this.options.forEach((option) => {
				option.addEventListener("click", this.selectOption.bind(this));
			});

			document.addEventListener("click", this.onClick.bind(this));
		} else {
			this.options.forEach((option) => {
				option.addEventListener("click", this.selectOption.bind(this));
			});
		}
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
				
		this.options.forEach(option => option.classList.remove("hidden-content"));

		this.options.forEach((option) =>
			option.classList.remove("hidden-content")
		);

		this.options.forEach((option) =>
			option.classList.remove("hidden-content")
		);

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
			this.combobox
		);

		keyword.render();

		keyword.listenDismissRequest();

		const updatedRecipeList = SearchEngine.searchRecipesWithMultipleTag(
			this.combobox,
			false
		);

		document.querySelector(".recipes-card-grid").innerHTML = "";

		updatedRecipeList.forEach((recipe) => {
			const recipeCard = Factory.buildRecipeCard(recipe);

			recipeCard.render();
		});
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
