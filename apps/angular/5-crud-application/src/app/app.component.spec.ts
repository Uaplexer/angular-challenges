import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';
import { TodoStore } from './data-access/todo.store';

class MockTodoStore {
  private loading = new BehaviorSubject<boolean>(false);
  private todosSubject = new BehaviorSubject<any[]>([
    { id: 1, title: 'Test Todo 1' },
    { id: 2, title: 'Test Todo 2' },
  ]);

  load = jasmine.createSpy('load');
  isLoading() {
    return this.loading.asObservable();
  }
  todos() {
    return this.todosSubject.asObservable();
  }
  update = jasmine.createSpy('update');
  delete = jasmine.createSpy('delete');
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: MockTodoStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, MatProgressSpinnerModule],
      declarations: [AppComponent],
      providers: [{ provide: TodoStore, useClass: MockTodoStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(TodoStore) as unknown as MockTodoStore;

    fixture.detectChanges();
  });

  it('should call store.load on init', () => {
    expect(store.load).toHaveBeenCalled();
  });

  it('should render todos', () => {
    const todoElements = fixture.debugElement.queryAll(By.css('.container'));
    expect(todoElements.length).toBe(2);
    expect(todoElements[0].nativeElement.textContent).toContain('Test Todo 1');
  });

  it('should show loading spinner when loading', () => {
    store['loading'].next(true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('mat-progress-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should call store.update when clicking Update', () => {
    const updateBtn = fixture.debugElement.queryAll(By.css('.btn__update'))[0];
    updateBtn.triggerEventHandler('click');
    expect(store.update).toHaveBeenCalledWith({ id: 1, title: 'Test Todo 1' });
  });

  it('should call store.delete when clicking Delete', () => {
    const deleteBtn = fixture.debugElement.queryAll(By.css('.btn__delete'))[0];
    deleteBtn.triggerEventHandler('click');
    expect(store.delete).toHaveBeenCalledWith(1);
  });
});
