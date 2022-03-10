import Textbox from "./textbox.js";
import Listbox from "./listbox.js";

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
			this.element.querySelector(
				".combobox__search-bar-input-hint"
			)
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

			if(this.listbox.isOpen) {
				this.onClick.bind(this);
			}

		});
		
		this.textbox.element.addEventListener(
			"click",
			this.onClick.bind(this)
		);

		this.textbox.element.addEventListener(
			"input",
			this.onInput.bind(this)
		);

		this.listbox.registerEventListener();
	}

	/**
	 *
	 * @param {InputEvent} event
	 */
	onInput(event) {
		if (event.defaultPrevented) {
			return;
		}

		if (event.currentTarget.value.length === 0) {
			this.listbox.options.forEach((option) => {
				option.classList.remove("hidden-content");
			});
		} else {
			const optionList = this.listbox.element.querySelectorAll(
				".option-list__item"
			);

			const comboboxOptions = Array.from(optionList);

			this.nonMatchedOptions = comboboxOptions.filter(
				(option) =>
					option.innerText
						.toLowerCase()
						.search(
							event.currentTarget.value.toLowerCase()
						) === -1
			);

			this.nonMatchedOptions.forEach((option) => {
				option.classList.add("hidden-content");
			});
		}

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
}
