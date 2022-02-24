export default class Textbox {
	/**
	 *
	 * @param {HTMLInputElement | Element} element
	 */
	constructor(element, inputHint = null) {
		this.element = element;
		this.inputHint = inputHint;
	}

	clearData() {
		this.element.value = "";
	}

	resetTextbox() {
		this.inputHint.classList.add("hidden-content");

		this.element.removeAttribute("placeholder");

		this.element.classList.remove("search-bar-input--combobox-placeholder-visible");

		this.element.value = "";
	}

	changeInputHintDisplay() {
		this.inputHint.classList.add(
			"hidden-content"
		);

		const inputHintText = this.inputHint.innerText;

		const inputHintTextCaseInsensitive = inputHintText.toLowerCase().slice(0, inputHintText.length - 1);

		this.element.setAttribute("placeholder", `Rechercher un ${inputHintTextCaseInsensitive}`);

		this.element.classList.add(
			"search-bar-input--combobox-placeholder-visible"
		);
	}
}
