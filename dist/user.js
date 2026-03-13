export class TropPauvreErreur extends Error {
    constructor(message, prixCommande, soldeRestant) {
        super(message);
        this.name = "TropPauvreErreur";
        this.prixCommande = prixCommande;
        this.soldeRestant = soldeRestant;
    }
}
export class User {
    constructor(id, name, wallet) {
        this.id = id;
        this.name = name;
        this.wallet = wallet;
        this.orders = this.loadOrders();
    }
    orderMeal(meal) {
        if (meal.price > this.wallet) {
            throw new TropPauvreErreur("Fonds insuffisants", meal.price, this.wallet);
        }
        this.wallet -= meal.price;
        const order = {
            id: this.orders.length + 1,
            meals: [meal],
            total: meal.price,
        };
        this.orders.push(order);
        this.saveOrders();
        console.log(`Commande passée : ${meal.name}, solde restant : ${this.wallet}€`);
    }
    saveOrders() {
        localStorage.setItem("orders", JSON.stringify(this.orders));
    }
    loadOrders() {
        const saved = localStorage.getItem("orders");
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    }
    orderMenu(meals) {
        const total = meals.reduce((sum, meal) => sum + meal.price, 0);
        if (total > this.wallet) {
            throw new TropPauvreErreur("Fonds insuffisants", total, this.wallet);
        }
        this.wallet -= total;
        const order = {
            id: this.orders.length + 1,
            meals: meals,
            total: total,
        };
        this.orders.push(order);
        this.saveOrders();
        console.log(`Menu commandé, solde restant : ${this.wallet}€`);
    }
    getTotalSpent() {
        return this.orders.reduce((sum, order) => sum + order.total, 0);
    }
}
export function displayUser(user) {
    const walletEl = document.getElementById("wallet");
    walletEl.textContent = `Solde : ${user.wallet}€`;
    const totalSpentEl = document.getElementById("totalSpent");
    totalSpentEl.textContent = `Total dépensé : ${user.getTotalSpent()}€`;
    const orderList = document.getElementById("orderList");
    orderList.innerHTML = "";
    user.orders.forEach((order) => {
        const li = document.createElement("li");
        li.textContent = `Commande #${order.id} — ${order.total}€`;
        orderList.appendChild(li);
    });
}
