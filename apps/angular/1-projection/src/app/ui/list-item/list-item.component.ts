import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-list-item',
  template: `
    <ng-content />
    <ng-content select="[delete-button]"></ng-content>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent {}
