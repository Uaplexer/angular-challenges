import { CommonModule } from '@angular/common';
import {
  Component,
  contentChild,
  input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'app-card',
  template: `
    <section
      [ngClass]="customClass()"
      class="flex w-fit flex-col items-end gap-3">
      <ng-content select="img" />
      @for (item of list(); track item) {
        <ng-container
          [ngTemplateOutlet]="listTemplate()"
          [ngTemplateOutletContext]="{ $implicit: item }"></ng-container>
      }
      <ng-content select="[add-button]" />
    </section>
  `,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
})
export class CardComponent {
  readonly list = input<any[] | null>(null);
  readonly customClass = input('');

  listTemplate =
    contentChild.required<TemplateRef<ListItemComponent>>('listTemplate');
}
