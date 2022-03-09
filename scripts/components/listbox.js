import Keyword from "./keyword.js";
import Normalize from "../utils/normalize.js";

export default class listbox {
	/**
	 * @param {HTMLDivElement | Element} container
	 * @param {HTMLButtonElement | Element} trigger
	 * @param {HTMLUListElement | Element} element
	 * @param {Array<String>} options
	 * @param {HTMLDivElement | Element} ariaExpandedStateManager
	 * @param {Textbox} ariaControler
	 */
	constructor(
		container,
		trigger,
		element,
		options,
		ariaExpandedStateManager,
		ariaControler
	) {
		this.isAlreadyInstantiate = true;

		this.keywordList = document.querySelector(".keywords-list");

		this.ariaControler = ariaControler;

		this.container = container;

		this.trigger = trigger;

		this.ariaExpandedStateManager = ariaExpandedStateManager;

		this.element = element;

		options.forEach(
			(option) => (this.element.innerHTML += option)
		);

		this.options = this.element.querySelectorAll(
			".option-list__item"
		);

		this.activeDescendant = 0;

		this.isOpen = false;
	}

	registerEventListener() {
		this.container.addEventListener("click", (clickEvent) => {
			clickEvent.stopPropagation();
		});

		this.trigger.addEventListener(
			"click",
			this.onClick.bind(this)
		);

		this.options.forEach((option) => {
			option.addEventListener(
				"click",
				this.selectOption.bind(this)
			);
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
			!this.isOpen && (clickEvent.currentTarget !== document ||
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

		this.container.classList.add(
			"combobox-wrapper--dropdown-open"
		);

		this.container.parentElement.classList.add(
			"filter--dropdown-open"
		);

		this.ariaControler.element.focus();

		this.ariaExpandedStateManager.setAttribute(
			"aria-expanded",
			"true"
		);

		this.ariaControler.element.setAttribute(
			"aria-activedescendant",
			`${this.options[this.activeDescendant].id}`
		);

		this.options[this.activeDescendant].classList.add(
			"active-option"
		);

		this.isOpen = true;
	}

	close() {
		this.element.classList.add("hidden-content");

		this.keywordList.classList.remove("keyword-dropdown-open");

		this.getTriggerIconClassList().remove(
			"btn--combobox__icon--dropdown-open"
		);

		this.container.classList.remove(
			"combobox-wrapper--dropdown-open"
		);

		this.container.parentElement.classList.remove(
			"filter--dropdown-open"
		);

		this.ariaExpandedStateManager.setAttribute(
			"aria-expanded",
			"false"
		);

		this.isOpen = false;
	}

	selectOption(event) {
		event.stopPropagation();

		var selectedOption = HTMLLIElement;

		var optionsList = Array.prototype.slice.call(this.options);

		if (event.currentTarget === this.element) {
			selectedOption =
				event.currentTarget.querySelector(".active-option");
		} else {
			selectedOption = event.currentTarget;
		}

		optionsList.forEach((option) => {
			option.setAttribute("aria-selected", "false");

			option.classList.remove("active-option");
		});

		this.activeDescendant = optionsList.indexOf(selectedOption);

		this.ariaControler.element.setAttribute(
			"aria-activedescendant",
			selectedOption.id
		);

		selectedOption.setAttribute("aria-selected", `true`);

		selectedOption.classList.add("active-option");

		/* this.sortMediaCards(this.currentPhotographer, this.currentPhotographer.media, selectedOption.id); */

		this.preventMultipleCallToCloseFunction(event);

		this.close();

		this.ariaControler.resetTextbox();

		const inputHint =
			this.ariaControler.inputHint.innerText.toLowerCase();

		const filterType = Normalize.string(inputHint);

		const keywordName = Normalize.string(
			selectedOption.innerText
		);

		const keyword = new Keyword(
			`${keywordName}`,
			`${filterType}`
		);

		keyword.render();

		keyword.listenDismissRequest();
	}

	/**
	 *
	 * @param {KeyboardEvent | MouseEvent} event
	 */
	preventMultipleCallToCloseFunction(event) {
		if (
			[
				this.element,
				this.options,
				this.trigger,
				this.container,
			].includes(event.target)
		) {
			event.stopPropagation();
		}
	}

	getTriggerIconClassList() {
		return this.trigger.querySelector(".btn--combobox__icon")
			.classList;
	}
}
