import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupAddComponent } from './topup-add.component';

describe('TopupAddComponent', () => {
  let component: TopupAddComponent;
  let fixture: ComponentFixture<TopupAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopupAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
