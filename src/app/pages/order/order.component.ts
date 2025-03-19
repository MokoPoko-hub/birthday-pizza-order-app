import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { PIZZAS } from './pizzas';

@Component({
  selector: 'app-order',
  imports: [],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent {
  @ViewChild('orderButton') orderButton!: ElementRef;

  readonly supabase = inject(SupabaseService);
  readonly orders = this.supabase.orders;

  readonly ingredientsList = [
    'Ser mozzarella 🧀',
    'Ser parmezan 🧀',
    'Ser pleśniowy 🧀',
    'Szynka 🍖',
    'Parmeńska 🍖',
    'Salami 🌶️',
    'Boczek 🥓',
    'Pieczarki 🍄‍🟫',
    'Papryka 🫑',
    'Cebula 🧅',
    'Oliwki czarne 🫒',
    'Kukurydza 🌽',
    'Jalapeño, Dżalapinio 🌶️ 🔥🔥🔥',
    'Rukola 🌿',
    'Ogórek kiszony 🥒',
    'Gruszka 🍐',
    'Pomidorki 🍅',
    'Tabasko 🔥🔥🔥',
  ];
  readonly pizzas = PIZZAS;

  readonly selectedIngredients = signal<string[]>([]);
  readonly selectedPizzaName = signal<string | null>(null);
  userName = sessionStorage.getItem('guestName') || 'Guest';

  selectPizza(pizza: any) {
    this.selectedIngredients.set([]);
    this.selectedIngredients.set([...pizza.ingredients]);
    this.selectedPizzaName.set(pizza.name);
    this.scrollToOrderButton();
  }

  addIngredient(ingredient: string) {
    if (
      this.selectedIngredients().length < 6 &&
      !this.selectedIngredients().includes(ingredient)
    ) {
      this.selectedIngredients.set([...this.selectedIngredients(), ingredient]);
      this.selectedPizzaName.set(null);
    }
  }

  removeIngredient(ingredient: string) {
    this.selectedIngredients.set(
      this.selectedIngredients().filter((i) => i !== ingredient)
    );
    this.selectedPizzaName.set(null);
  }

  placeOrder() {
    let localOrders = JSON.parse(localStorage.getItem('pizzas') || '[]');

    localOrders = localOrders.filter(
      (order: any) => order.pizza && order.pizza.trim() !== ''
    );

    localStorage.setItem('pizzas', JSON.stringify(localOrders));

    if (localOrders.length >= 4) {
      alert('Możesz dodać tylko 4 pizze na raz, usuń już dodane');
      return;
    }

    const order = {
      id: crypto.randomUUID(),
      user_name: this.userName,
      pizza: this.selectedPizzaName()
        ? this.selectedPizzaName()
        : 'Custom Pizza',
      ingredients: this.selectedIngredients(),
      status: 'Pending',
    };
    localOrders.push(order);
    localStorage.setItem('pizzas', JSON.stringify(localOrders));

    this.supabase.addOrder(order);
  }

  scrollToOrderButton() {
    if (this.orderButton) {
      this.orderButton.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }

  isUserEligibleToDelete(orderId: string): boolean {
    // Get user's name from sessionStorage
    const currentUser = sessionStorage.getItem('guestName') || 'Guest';

    // Allow "Wojtek" (admin) to delete any order
    if (currentUser === 'Wojtek') return true;

    // Allow the user to delete their own order
    const localOrders = JSON.parse(localStorage.getItem('pizzas') || '[]');
    return localOrders.some((order: any) => order.id === orderId);
  }

  /**
   * Deletes an order if the user is eligible.
   */
  deleteOrder(orderId: string) {
    // Get the existing orders
    let localOrders = JSON.parse(localStorage.getItem('pizzas') || '[]');

    // Remove the order from localStorage
    localOrders = localOrders.filter((order: any) => order.id !== orderId);
    localStorage.setItem('pizzas', JSON.stringify(localOrders));

    // Remove the order from Supabase
    this.supabase.removeOrder(orderId, this.userName);
  }
}
