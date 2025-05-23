import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoSignalStore } from './data-access/todo.signal-store';

@Component({
  imports: [CommonModule, MatProgressSpinnerModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  store = inject(TodoSignalStore);

  ngOnInit(): void {
    this.store.load();
  }
}
