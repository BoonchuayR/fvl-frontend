import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupEditComponent } from './topup-edit.component';

describe('TopupEditComponent', () => {
  let component: TopupEditComponent;
  let fixture: ComponentFixture<TopupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopupEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
