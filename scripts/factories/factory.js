export default class Factory {

    /**
     * 
     * @param {Recipe} data
     * @returns {Recipe}
     */
     static buildRecipeCard(data) {
        const { id, name, ingredients, time, description } = data;

        const container = document.querySelector(".recipes-card-grid");

        const element = document.createElement("ARTICLE");

        element.classList.add("recipe-card");

        element.innerHTML = `<div class="recipe-card__image"></div>

        <div class="recipe-card-body">
            <div class="recipe-card-infos">
                <h2 class="recipe-card-infos__heading">
                    ${name}
                </h2>

                <div
                    class="recipe-card-infos__cooking-time"
                >
                    <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="recipe-card-infos__cooking-time__icon"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"
                        />
                        <path
                            d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"
                        />
                    </svg>
                    <p>${time} min</p>
                </div>
            </div>

            <div class="recipe-card-infos">
                <ul class="recipe-card-infos__ingredients">
                </ul>

                <p class="recipe-card-infos__description">
                ${description}
                </p>
            </div>
        </div>`;

        const ingredientsListContainer = element.querySelector(".recipe-card-infos__ingredients");
        
        var ingredientsList = "";
        var mesureament = ""

        for (let index = 0; index < ingredients.length; index++) {

            var ingredientName = `<li class="ingredient"> <span class="highlight">${ingredients[index].ingredient}:</span> `;

            if (ingredients[index].hasOwnProperty("quantity") ) {

                mesureament = `${ingredients[index].quantity} `;

                if (ingredients[index].hasOwnProperty("unit")) {

                    mesureament += `${ingredients[index].unit}</li>`;

                }
                
            }
            
            ingredientsList += ingredientName.concat(mesureament);

        }

        ingredientsListContainer.innerHTML += ingredientsList;

        function display() {
            container.appendChild(element);
        }

        function hide() {
            element.classList.add("hidden-content");
        }

        return { element, container, id, display, hide };
    }

    /**
     * 
     * @param {String} label 
     * @param {Boolean} selectedState
     */
    static buildListboxOption(label, selectedState) {

        var lowerCaseLabel = label.toLowerCase();

        var id = lowerCaseLabel.replace(/[\s\(\)\d\.]+/ig, "-");

        const optionsDOM = `<li id="${id}" class="option-list__item" role="option" aria-selected="${selectedState}">
            ${label}
        </li>`;

        return optionsDOM;
    }
}