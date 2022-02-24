import Textbox from "./textbox.js";
import Listbox from "./listbox.js";
import Factory from "../factories/factory.js";

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

		var listboxOptions = [];

		options.forEach((option) => {
			listboxOptions.push(
				Factory.buildListboxOption(option, false)
			);
		});

		this.listbox = new Listbox(
			this.element,
			this.element.querySelector(".btn"),
			this.element.querySelector(".option-list"),
			listboxOptions,
			this.element.querySelector(".combobox"),
			this.textbox
		);

		this.nonMatchedOptions = "";
	}

	initEventManagement() {
		document.addEventListener("click", this.onClick.bind(this));

		this.element.addEventListener("focus", () => {
			this.textbox.element.focus();
		});

		this.textbox.element.addEventListener(
			"keydown",
			this.onKeydown.bind(this)
		);

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
	 * @param {KeyboardEvent} event
	 */
	onKeydown(event) {
		if (event.defaultPrevented) {
			return;
		}

		switch (event.key) {
			case "ArrowUp":
				event.preventDefault();

				if (this.listbox.isOpen) {
					this.listbox.moveFocusTo("previous");
				}

				break;

			case "ArrowDown":
				event.preventDefault();

				if (!this.listbox.isOpen) {
					this.textbox.changeInputHintDisplay();

					this.listbox.open();
				} else {
					this.listbox.moveFocusTo("next");
				}

				break;

			case "Escape":
				event.preventDefault();

				if (this.listbox.isOpen) {
					this.listbox.close();

					this.textbox.clearData();

					this.textbox.resetTextbox();
				}

				break;
			default:
				return;
		}
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

		if (event.currentTarget === document && this.listbox.isOpen) {
			this.listbox.close();

			this.textbox.resetTextbox();
		} else if (event.currentTarget !== document) {
			if (!this.listbox.isOpen) {
				this.textbox.changeInputHintDisplay();

				this.listbox.open();
			} else {
				if (event.currentTarget !== this.textbox.element) {
					this.listbox.close(event);
				}

				if (event.currentTarget === this.listbox.trigger) {
					this.textbox.resetTextbox();
				}
			}
		}
	}
}
