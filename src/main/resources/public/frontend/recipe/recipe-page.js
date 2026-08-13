/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
   const addRecipeNameInput = document.getElementById("add-recipe-name-input");
   const addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");
   const updateRecipeNameInput = document.getElementById("update-recipe-name-input");
   const updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");
   const deleteRecipeNameInput = document.getElementById("delete-recipe-name-input");
   const recipeListContainer = document.getElementById("recipe-list");
   const adminLink = document.getElementById("admin-link");
   const logoutButton = document.getElementById("logout-button");
   const searchInput = document.getElementById("search-input");
   const searchButton = document.getElementById("search-button");
   const addRecipeSubmitButton = document.getElementById("add-recipe-submit-input");
   const updateRecipeSubmitButton = document.getElementById("update-recipe-submit-input");
   const deleteRecipeSubmitButton = document.getElementById("delete-recipe-submit-input");

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem("auth-token")) {
        logoutButton.style.display = "block";
    }

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sessionStorage.getItem("is-admin") === "true") {
        adminLink.style.display = "block";
    }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeSubmitButton.addEventListener("click", addRecipe);
    updateRecipeSubmitButton.addEventListener("click", updateRecipe);
    deleteRecipeSubmitButton.addEventListener("click", deleteRecipe);
    searchButton.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();


    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        const searchTerm = searchInput.value.trim();
        if (!searchTerm) {
            alert("Please enter a search term.");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/recipes?name=${encodeURIComponent(searchTerm)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error searching recipes: ${response.status}`);
            }
            const data = await response.json();
            recipes = data;
            refreshRecipeList();
        } catch (error) {
            console.error("Error during recipe search:", error);
            alert("An error occurred while searching for recipes. Please try again later.");
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        const addName = addRecipeNameInput.value.trim();
        const addInstructions = addRecipeInstructionsInput.value.trim();
        if (!addName || !addInstructions) {
            alert("Please fill in both recipe name and instructions.");
            return;
        }
        const newRecipe = { name: addName, instructions: addInstructions };
        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
                },
                body: JSON.stringify(newRecipe)
            });
            if (!response.ok) {
                throw new Error(`Error adding recipe: ${response.status}`);
            }
            addRecipeNameInput.value = "";
            addRecipeInstructionsInput.value = "";
            await getRecipes();
        } catch (error) {
            console.error("Error during recipe addition:", error);
            alert("An error occurred while adding the recipe. Please try again later.");
            return;
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const updateName = updateRecipeNameInput.value.trim();
        const updateInstructions = updateRecipeInstructionsInput.value.trim();
        if (!updateName || !updateInstructions) {
            alert("Please fill in both recipe name and updated instructions.");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
                }
            });
            if(!response.ok) {
                throw new Error(`Error fetching recipes for update: ${response.status}`);
            }
            const data = await response.json();
            const match = data.find(recipe => recipe.name === updateName);
            if (!match) {
                alert("Recipe not found for update.");
                return;
            }
            const updatedRecipe = { name: updateName, instructions: updateInstructions };
            const updateResponse = await fetch(`${BASE_URL}/recipes/${match.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
                },
                body: JSON.stringify(updatedRecipe)
            });
            if (!updateResponse.ok) {
                throw new Error(`Error updating recipe: ${updateResponse.status}`);
            }
            updateRecipeNameInput.value = "";
            updateRecipeInstructionsInput.value = "";
            await getRecipes();
        } catch (error) {
            console.error("Error fetching recipes for update:", error);
            alert("An error occurred while fetching recipes for update. Please try again later.");
            return;
        }

    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        const deleteName = deleteRecipeNameInput.value.trim();
        if (!deleteName) {
            alert("Please enter the recipe name to delete.");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching recipes for deletion: ${response.status}`);
            }
            const data = await response.json();
            const match = data.find(recipe => recipe.name === deleteName);
            if (!match) {
                alert("Recipe not found for deletion.");
                return;
            }
            const deleteResponse = await fetch(`${BASE_URL}/recipes/${match.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
                }
            });
            if (!deleteResponse.ok) {
                throw new Error(`Error deleting recipe: ${deleteResponse.status}`);
            }
            await getRecipes();
        } catch (error) {
            console.error("Error fetching recipes for deletion:", error);
            alert("An error occurred while fetching recipes for deletion. Please try again later.");
            return;
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching recipes: ${response.status}`);
            }
            const data = await response.json();
            recipes = data;
            refreshRecipeList();
        } catch (error) {
            console.error("Error fetching recipes:", error);
            alert("An error occurred while fetching recipes. Please try again later.");
            return;
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeListContainer.innerHTML = "";
        recipes.forEach(recipe => {
            const li = document.createElement("li");
            li.textContent = `${recipe.name}: ${recipe.instructions}`;
            recipeListContainer.appendChild(li);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
        try {
            const response = await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
                }
            });
            if (response.ok) {
                sessionStorage.clear();
                window.location.href = "../login/login-page.html";
            } else {
                alert("Logout failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during logout:", error);
            alert("An error occurred while logging out. Please try again later.");
        }
    }

});
