export default class Normalize {
	/**
	 * Return a new version of the string passed in argument without letters with accents
	 * @param {String} string
	 */
	static string(string) {
		return string.normalize("NFD").replace(/[\u0300-\u036f]/gi, "");
	}

	/**
	 * Transform the first letter of the *string* to upper case
	 * @param {String} string
	 */
	static firstLetterToUpperCase(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	static parseFiltersOptionLabel(data) {
		var ingredientOptionsLabel = [];
		var applianceOptionsLabel = [];
		var ustensilOptionsLabel = [];

		const removesWordBetweenParentheses = (string) =>
			string.replace(/\s\([^\)]*\)/gi, "");

		data.forEach((data) => {
			data.ingredients.forEach((ingredients) => {
				var ingredientOptions = Normalize.firstLetterToUpperCase(
					ingredients.ingredient.toLowerCase()
				);

				if (ingredientOptionsLabel.indexOf(ingredientOptions) === -1) {
					ingredientOptionsLabel.push(
						removesWordBetweenParentheses(ingredientOptions)
					);
				}
			});

			var applianceOptions = removesWordBetweenParentheses(
				data.appliance.toLowerCase()
			);

			if (applianceOptionsLabel.indexOf(applianceOptions) === -1) {
				applianceOptionsLabel.push(
					Normalize.firstLetterToUpperCase(applianceOptions)
				);
			}

			data.ustensils.forEach((ustensil) => {
				var ustensilOption = Normalize.firstLetterToUpperCase(
					ustensil.toLowerCase()
				);

				if (ustensilOptionsLabel.indexOf(ustensilOption) === -1) {
					ustensilOptionsLabel.push(
						removesWordBetweenParentheses(ustensilOption)
					);
				}
			});
		});

		/* Removes duplicate from the array of labels of each filter */
		var filtersOptionLabel = {
			ingredientOptionsLabel: [...new Set(ingredientOptionsLabel)],
			applianceOptionsLabel: [...new Set(applianceOptionsLabel)],
			ustensilOptionsLabel: [...new Set(ustensilOptionsLabel)],
		};

		return filtersOptionLabel;
	}
}
