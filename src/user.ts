import { Meal } from "./meals.js";

export type Order = {
  id: number;
  meals: Meal[];
  total: number;
};

export type OrderSummary = Omit<Order, "meals">;
export type OrderMap = Record<number, Order>;

export class TropPauvreErreur extends Error {
  prixCommande: number;
  soldeRestant: number;

  constructor(message: string, prixCommande: number, soldeRestant: number) {
    super(message);
    this.name = "TropPauvreErreur";
    this.prixCommande = prixCommande;
    this.soldeRestant = soldeRestant;
  }
}

export class User {
  id: number;
  name: string;
  wallet: number;
  orders: Order[];

  constructor(id: number, name: string, wallet: number) {
    this.id = id;
    this.name = name;
    this.wallet = wallet;
    this.orders = this.loadOrders();
  }

  orderMeal(meal: Meal): void {
    if (meal.price > this.wallet) {
      throw new TropPauvreErreur("Fonds insuffisants", meal.price, this.wallet);
    }

    this.wallet -= meal.price;

    const order: Order = {
      id: this.orders.length + 1,
      meals: [meal],
      total: meal.price,
    };

    this.orders.push(order);
    this.saveOrders();
    console.log(
      `Commande passée : ${meal.name}, solde restant : ${this.wallet}€`,
    );
  }

  private saveOrders(): void {
    localStorage.setItem("orders", JSON.stringify(this.orders));
  }

  private loadOrders(): Order[] {
    const saved = localStorage.getItem("orders");
    if (saved) {
      return JSON.parse(saved) as Order[];
    }
    return [];
  }

  orderMenu(meals: Meal[]): void {
    const total = meals.reduce((sum, meal) => sum + meal.price, 0);

    if (total > this.wallet) {
      throw new TropPauvreErreur("Fonds insuffisants", total, this.wallet);
    }

    this.wallet -= total;

    const order: Order = {
      id: this.orders.length + 1,
      meals: meals,
      total: total,
    };

    this.orders.push(order);
    this.saveOrders();
    console.log(`Menu commandé, solde restant : ${this.wallet}€`);
  }

  getTotalSpent(): number {
    return this.orders.reduce((sum, order) => sum + order.total, 0);
  }
}

export function displayUser(user: User): void {
  const walletEl = document.getElementById("wallet") as HTMLElement;
  walletEl.textContent = `Solde : ${user.wallet}€`;

  const totalSpentEl = document.getElementById("totalSpent") as HTMLElement;
  totalSpentEl.textContent = `Total dépensé : ${user.getTotalSpent()}€`;

  const orderList = document.getElementById("orderList") as HTMLUListElement;
  orderList.innerHTML = "";

  user.orders.forEach((order) => {
    const li = document.createElement("li");
    li.textContent = `Commande #${order.id} — ${order.total}€`;
    orderList.appendChild(li);
  });
}
