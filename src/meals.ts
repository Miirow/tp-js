import { TropPauvreErreur, User, displayUser } from "./user.js";

export type Meal = {
  id: number;
  name: string;
  calories: number;
  price: number;
};

export type MealDraft = Partial<Meal>;

export async function fetchMeals(): Promise<Meal[]> {
  try {
    const response = await fetch(
      "https://keligmartin.github.io/api/meals.json",
    );
    if (!response.ok) throw new Error("Réponse réseau incorrecte");
    const meals: Meal[] = await response.json();
    return meals;
  } catch (error) {
    console.error("Erreur lors du chargement des repas");
    alert("Erreur lors du chargement des repas");
    return [];
  }
}

export function displayMeals(meals: Meal[], user: User): void {
  const mealList = document.getElementById("mealList") as HTMLUListElement;
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
      } catch (error) {
        if (error instanceof TropPauvreErreur) {
          alert(
            `${error.message} — Prix : ${error.prixCommande}€, Solde : ${error.soldeRestant}€`,
          );
        }
      }
    };

    li.appendChild(button);
    mealList.appendChild(li);
  });
}

export function displayMenu(meals: Meal[], user: User): void {
  const menuList = document.getElementById("menuList") as HTMLUListElement;
  const selectedMeals: Meal[] = [];

  menuList.innerHTML = "";

  const mealList = document.getElementById("mealList") as HTMLUListElement;
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
      } catch (error) {
        if (error instanceof TropPauvreErreur) {
          alert(
            `${error.message} — Prix : ${error.prixCommande}€, Solde : ${error.soldeRestant}€`,
          );
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

  function updateTotal(): void {
    const total = selectedMeals.reduce((sum, m) => sum + m.price, 0);
    const totalEl = document.getElementById("menuTotalHT") as HTMLElement;
    const totalTTCEl = document.getElementById("menuTotalTTC") as HTMLElement;
    totalEl.textContent = total.toFixed(2);
    totalTTCEl.textContent = (total * 2).toFixed(2);
  }

  const btn = document.getElementById("calculateMenuBtn") as HTMLButtonElement;
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
    } catch (error) {
      if (error instanceof TropPauvreErreur) {
        alert(
          `${error.message} — Prix : ${error.prixCommande}€, Solde : ${error.soldeRestant}€`,
        );
      }
    }
  };
}
export function filterMeals(meals: Meal[], user: User): void {
  const filterInput = document.getElementById(
    "filterPrice",
  ) as HTMLInputElement;

  filterInput.oninput = () => {
    const maxPrice = parseFloat(filterInput.value);

    if (isNaN(maxPrice) || filterInput.value === "") {
      displayMenu(meals, user);
    } else {
      const filtered = meals.filter((meal) => meal.price <= maxPrice);
      displayMenu(filtered, user);
    }
  };
}
