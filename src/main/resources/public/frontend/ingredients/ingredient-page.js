/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const ingredientListContainer = document.getElementById("ingredient-list");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
document.getElementById("add-ingredient-submit-button").addEventListener("click", addIngredient);
document.getElementById("delete-ingredient-submit-button").addEventListener("click", deleteIngredient);



/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */
onload = function() {
    getIngredients();
}


/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    const ingredientName = addIngredientNameInput.value.trim();
    if (!ingredientName) {
        alert("Please enter an ingredient name.");
        return;
    }
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            },
            body: JSON.stringify({ name: ingredientName })
        });
        if (!response.ok) {
            throw new Error(`Error adding ingredient: ${response.status}`);
        }
        addIngredientNameInput.value = "";
        await getIngredients();
    } catch (error) {
        alert("Error: " + error.message);
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            }
        });
        if (!response.ok) {
            throw new Error(`Error fetching ingredients: ${response.status}`);
        }
        const data = await response.json();
        ingredients = data;
        refreshIngredientList();
    } catch (error) {
        alert("Error: " + error.message);
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    const ingredientName = deleteIngredientNameInput.value.trim();
    if (!ingredientName) {
        alert("Please enter an ingredient name to delete.");
        return;
    }
    const match = ingredients.find(ingredient => ingredient.name === ingredientName);
    if (!match) {
        alert("Ingredient not found.");
        return;
    }
    const ingredientId = match.id;
    try {
        const response = await fetch(`${BASE_URL}/ingredients/${ingredientId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            }
        });
        if (!response.ok) {
            throw new Error(`Error deleting ingredient: ${response.status}`);
        }
        // On success: call getIngredients() and refreshIngredientList(), clear input
        await getIngredients();
        deleteIngredientNameInput.value = "";
    } catch (error) {
        alert("Error: " + error.message);
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainer.innerHTML = "";
    ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.textContent = ingredient.name;
        li.appendChild(p);
        ingredientListContainer.appendChild(li);
    });
}
