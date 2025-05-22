import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { CityStore } from '../../data-access/city.store';
import { randomCity } from '../../data-access/fake-http.service';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-city-card',
  imports: [CardComponent, ListItemComponent, NgOptimizedImage],
  templateUrl: './city-card.component.html',
  styleUrl: './city-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CityCardComponent {
  store = inject(CityStore);

  addRandomCity() {
    return randomCity();
  }
}
