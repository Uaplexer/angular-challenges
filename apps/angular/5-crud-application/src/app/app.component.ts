import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoStore } from './data-access/todo.store';

@Component({
  imports: [CommonModule, MatProgressSpinnerModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  store = inject(TodoStore);

  ngOnInit(): void {
    this.store.load();
  }
}
