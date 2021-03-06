var recipes;
async function loadData() {

    var recipe, newDiv;
    recipes = (await fetch("file.json").then(response => response.json())).Recipes;

    for (recipe of recipes) {
        newDiv = '<div class="col-md-4 rounded text-center">';
        newDiv += '<div class="card mb-4 box-shadow">';
        newDiv += '<div class="card-body">';
        newDiv += '<h1 onclick="displayRecipe(this)">' + recipe.food + '</h1>';
        newDiv += '<div class="d-flex justify-content-between align-items-center">';
        newDiv += '<div class="btn-group">';
        newDiv += '<button id ="' + recipe.food +
            '" type = "button" class="btn btn-sm btn-outline-secondary" onclick="deleteDataFromFile(this.id)">Delete</button>';
        newDiv +=
            '<button type="button" id ="' + recipe.food +
            '" class="btn btn-sm btn-outline-secondary" onclick="openEditModal(this.id)" data-toggle="modal" data-target="#addRecipeModal">Edit</button>';
        newDiv += '</div ></div></div></div></div>';
        document.getElementById("cards-div").insertAdjacentHTML('beforeend', newDiv);
        $('#addRecipeModal').on('hidden.bs.modal', clearModal);
    }

}

function saveRecipe() {
    var inputs = document.getElementsByClassName("modal-input");
    if (!validateForm(inputs)) {
        alert("the input value isn't valid(empty content)")
    }
    else {
        var recipe = {
            food: inputs[0].value,
            ingredients:[],
            preparation:[]
        }
        for(let i=1;i<inputs.length;i++)
        {
            if(inputs[i].classList.contains("ingredient-input"))
            {
                recipe.ingredients.push(inputs[i].value);
            }
            else
                if(inputs[i].classList.contains("preparation-input")){
                    recipe.preparation.push(inputs[i].value);
                }

        }
        if (recipes.find(value => {
            return value.food == recipe.food
        }) != null) {
            if (inputs[0].readOnly) {
                editDataToFile(recipe);
                $('#addRecipeModal').modal('hide');
            }
            else {
                document.getElementById("error-alert").classList.remove("hide-alertBox");
                document.getElementById("error-alert").innerHTML = "This recipe is already exists!";
            }
        } else {
            saveDataToFile(JSON.stringify(recipe));
            $('#addRecipeModal').modal('hide');
        }
    }
}

function clearModal() {

    var inputs = document.getElementsByClassName("modal-input");
    for (input of inputs) {
        input.classList.remove("error-input");
        input.value = "";
    }
    inputs[0].readOnly = false;
    document.getElementById("saveRecipe-title").innerHTML = "Add Recipe";
}

function validateForm(elements) {
    var valid = true;
    for (element of elements) {
        if (element.value.length < 3) {
            element.classList.add("error-input");
            valid = false;
        }
    }
    return valid;
}

function openEditModal(food) {
    var inputs = document.getElementsByClassName("modal-input");
    var recipe = recipes.find(value => {
        return value.food == food
    });
    var i = 0;
    for (x in recipe) {
        inputs[i].value = recipe[x];
        i++;
    }
    inputs[0].readOnly = true;
    document.getElementById("saveRecipe-title").innerHTML = "Edit Recipe";
}

function deleteDataFromFile(food) {
    let request = new XMLHttpRequest();
    request.open('Delete', "http://localhost:3000/Recipes/" + food);
    request.setRequestHeader("Content-Type", "application/json");
    request.send();
}

function editDataToFile(recipe) {
    let request = new XMLHttpRequest();
    request.open('PATCH', "http://localhost:3000/Recipes/" + recipe.food);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(recipe));
}

function saveDataToFile(recipe) {
    let request = new XMLHttpRequest();
    request.open('POST', "http://localhost:3000/Recipes");
    request.setRequestHeader("Content-Type", "application/json");
    request.send(recipe);
}

function displayRecipe(element) {
    $('#displayRecipeModal').modal('show');
    var content = document.getElementById(element.innerHTML);
    var recipe = recipes.find(value => {
        return value.food == element.innerHTML
    });
    let ingredientsContent = document.getElementById("ingredients-content")
    ingredientsContent.innerHTML = "";
    for (ingredient of recipe.ingredients) {
        ingredientsContent.innerHTML += ingredient + "<br>";
    }
    let preparationContent = document.getElementById("preparation-content")
    preparationContent.innerHTML = "";
    for (let i = 0; i < recipe.preparation.length; i++) {
        preparationContent.innerHTML += i+1 + ") " + recipe.preparation[i] + "<br>";
    }
    //recipeContent.innerHTML += "<strong>" + x + "</strong><br>" + recipe[x].replace(/\n/g, '<br>') + "<br><br>";
    document.getElementById("displayRecipe-title").innerHTML = "<strong>" + recipe.food + "</strong>";
}
function addInputTextBox(container) {
    let template = container.firstElementChild.cloneNode();
    template.value="";
    container.appendChild(template);
    container.appendChild(document.createElement("br"));
}