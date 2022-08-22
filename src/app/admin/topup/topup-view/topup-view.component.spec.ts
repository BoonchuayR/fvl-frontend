import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupViewComponent } from './topup-view.component';

describe('TopupViewComponent', () => {
  let component: TopupViewComponent;
  let fixture: ComponentFixture<TopupViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopupViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
