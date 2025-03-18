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
    const order = {
      user_name: this.userName,
      pizza: this.selectedPizzaName()
        ? this.selectedPizzaName()
        : 'Custom Pizza',
      ingredients: this.selectedIngredients(),
      status: 'Pending',
    };
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

  isUserEligibleToDelete(orderUserName: string): boolean {
    return this.userName === 'Wojtek' || this.userName === orderUserName;
  }

  /**
   * Deletes an order if the user is eligible.
   */
  deleteOrder(orderId: string) {
    this.supabase.removeOrder(orderId, this.userName);
  }
}
