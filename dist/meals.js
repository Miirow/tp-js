var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TropPauvreErreur, displayUser } from "./user.js";
export function fetchMeals() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://keligmartin.github.io/api/meals.json");
            if (!response.ok)
                throw new Error("Réponse réseau incorrecte");
            const meals = yield response.json();
            return meals;
        }
        catch (error) {
            console.error("Erreur lors du chargement des repas");
            alert("Erreur lors du chargement des repas");
            return [];
        }
    });
}
export function displayMeals(meals, user) {
    const mealList = document.getElementById("mealList");
    mealList.innerHTML = "";
    meals.forEach((meal) => {
        const li = document.createElement("li");
        li.textContent = `${meal.name} - ${meal.price}€`;
        const button = document.createElement("button");
        button.textContent = "Commander";
        button.onclick = () => {
            try {
                user.orderMeal(meal);
                displayUser(user);
            }
            catch (error) {
                if (error instanceof TropPauvreErreur) {
                    alert(`${error.message} — Prix : ${error.prixCommande}€, Solde : ${error.soldeRestant}€`);
                }
            }
        };
        li.appendChild(button);
        mealList.appendChild(li);
    });
}
export function displayMenu(meals, user) {
    const menuList = document.getElementById("menuList");
    const selectedMeals = [];
    menuList.innerHTML = "";
    const mealList = document.getElementById("mealList");
    mealList.innerHTML = "";
    meals.forEach((meal) => {
        const li = document.createElement("li");
        li.className =
            "list-group-item d-flex justify-content-between align-items-center";
        li.textContent = `${meal.name} - ${meal.price}€`;
        const orderBtn = document.createElement("button");
        orderBtn.textContent = "Commander";
        orderBtn.className = "btn btn-sm btn-primary ms-2";
        orderBtn.onclick = () => {
            try {
                user.orderMeal(meal);
                displayUser(user);
                alert(`${meal.name} commandé !`);
            }
            catch (error) {
                if (error instanceof TropPauvreErreur) {
                    alert(`${error.message} — Prix : ${error.prixCommande}€, Solde : ${error.soldeRestant}€`);
                }
            }
        };
        const addBtn = document.createElement("button");
        addBtn.textContent = "Ajouter au menu";
        addBtn.className = "btn btn-sm btn-secondary ms-2";
        addBtn.onclick = () => {
            selectedMeals.push(meal);
            const menuLi = document.createElement("li");
            menuLi.className =
                "list-group-item d-flex justify-content-between align-items-center";
            menuLi.textContent = `${meal.name} - ${meal.price}€`;
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Retirer";
            removeBtn.className = "btn btn-sm btn-danger ms-2";
            removeBtn.onclick = () => {
                const index = selectedMeals.indexOf(meal);
                selectedMeals.splice(index, 1);
                menuLi.remove();
                updateTotal();
            };
            menuLi.appendChild(removeBtn);
            menuList.appendChild(menuLi);
            updateTotal();
        };
        li.appendChild(orderBtn);
        li.appendChild(addBtn);
        mealList.appendChild(li);
    });
    function updateTotal() {
        const total = selectedMeals.reduce((sum, m) => sum + m.price, 0);
        const totalEl = document.getElementById("menuTotalHT");
        const totalTTCEl = document.getElementById("menuTotalTTC");
        totalEl.textContent = total.toFixed(2);
        totalTTCEl.textContent = (total * 2).toFixed(2);
    }
    const btn = document.getElementById("calculateMenuBtn");
    btn.textContent = "Commander le menu";
    btn.onclick = () => {
        if (selectedMeals.length === 0) {
            alert("Sélectionnez au moins un repas !");
            return;
        }
        try {
            user.orderMenu(selectedMeals);
            displayUser(user);
            menuList.innerHTML = "";
            selectedMeals.length = 0;
            updateTotal();
            alert("Menu commandé avec succès !");
        }
        catch (error) {
            if (error instanceof TropPauvreErreur) {
                alert(`${error.message} — Prix : ${error.prixCommande}€, Solde : ${error.soldeRestant}€`);
            }
        }
    };
}
export function filterMeals(meals, user) {
    const filterInput = document.getElementById("filterPrice");
    filterInput.oninput = () => {
        const maxPrice = parseFloat(filterInput.value);
        if (isNaN(maxPrice) || filterInput.value === "") {
            displayMenu(meals, user);
        }
        else {
            const filtered = meals.filter((meal) => meal.price <= maxPrice);
            displayMenu(filtered, user);
        }
    };
}
