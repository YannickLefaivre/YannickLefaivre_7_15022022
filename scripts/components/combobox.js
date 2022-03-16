import Textbox from "./textbox.js";
import Listbox from "./listbox.js";
import Normalize from "../utils/normalize.js";

export default class Combobox {
	/**
	 *
	 * @param {String} id
	 * @param {Array | HTMLLIElement} options
	 */
	constructor(id, options) {
		this.element = document.getElementById(id);

		this.textbox = new Textbox(
			this.element.querySelector(".search-bar-input"),
			this.element.querySelector(".combobox__search-bar-input-hint")
		);

		this.listbox = new Listbox(
			this,
			this.element.querySelector(".btn--combobox"),
			this.element.querySelector(".option-list"),
			options,
			this.element.querySelector(".combobox"),
			this.textbox
		);

		this.nonMatchedOptions = "";
	}

	initEventManagement() {
		document.addEventListener("click", () => {
			if (this.listbox.isOpen) {
				this.onClick.bind(this);
			}
		});

		this.textbox.element.addEventListener("click", this.onClick.bind(this));

		this.textbox.element.addEventListener("input", this.onInput.bind(this));

		this.listbox.registerEventListener(true);
	}

	/**
	 *
	 * @param {InputEvent} event
	 */
	onInput(event) {
		if (event.defaultPrevented) {
			return;
		}

		var userInput = event.currentTarget.value;

		var initialOptionArray = Array.from(this.listbox.options);

		var searchedOptionArray = initialOptionArray.filter(
			(option) => option.innerText.toLowerCase().includes(userInput.toLowerCase()) === true
		);

		var nonSearchedOptionArray = initialOptionArray.filter(
			(option) => option.innerText.toLowerCase().includes(userInput.toLowerCase()) === false
		);

		searchedOptionArray.forEach((searchedOption) =>
			searchedOption.classList.remove("hidden-content")
		);

		nonSearchedOptionArray.forEach((nonSearchedOption) =>
			nonSearchedOption.classList.add("hidden-content")
		);

		event.preventDefault();
	}

	/**
	 *
	 * @param {MouseEvent} event
	 */
	onClick(event) {
		if (!event.defaultPrevented) {
			event.preventDefault();
		} else {
			return;
		}

		if (event.currentTarget === document) {
			this.listbox.onClick(event);

			this.textbox.resetTextbox();
		} else if (event.currentTarget !== document) {
			if (!this.listbox.isOpen) {
				this.textbox.changeInputHintDisplay();

				this.listbox.onClick(event);
			} else {
				if (event.currentTarget !== this.textbox.element) {
					this.listbox.onClick(event);
				}

				if (event.currentTarget === this.listbox.trigger) {
					this.textbox.resetTextbox();
				}
			}
		}
	}

	updateAllListbox(recipeList) {
		if (this.otherCombobox === undefined) {
			throw ReferenceError(
				"The property which reference other combobox wasn't set during or before the call of the initEventManagement() method."
			);
		}

		const filtersOptionLabel =
			Normalize.parseFiltersOptionLabel(recipeList);

		this.otherCombobox.forEach((combobox) => {
			combobox.listbox.element.innerHTML = "";

			switch (combobox.element.id) {
				case "filterIngredients":
					combobox.listbox.options = combobox.listbox.createOptions(
						filtersOptionLabel.ingredientOptionsLabel
					);

					combobox.listbox.registerEventListener(false);

					return true;

				case "filterAppliances":
					combobox.listbox.options = combobox.listbox.createOptions(
						filtersOptionLabel.applianceOptionsLabel
					);

					combobox.listbox.registerEventListener(false);

					return true;

				case "filterUstensils":
					combobox.listbox.options = combobox.listbox.createOptions(
						filtersOptionLabel.ustensilOptionsLabel
					);

					combobox.listbox.registerEventListener(false);

					return true;

				default:
					return false;
			}
		});
	}
}
