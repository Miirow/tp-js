import { fetchMeals, displayMenu, filterMeals } from "./meals.js";
import { User, displayUser } from "./user.js";

async function init() {
  const user = new User(1, "Bob", 100);
  const meals = await fetchMeals();
  displayMenu(meals, user);
  filterMeals(meals, user);
  displayUser(user);
}

init();
