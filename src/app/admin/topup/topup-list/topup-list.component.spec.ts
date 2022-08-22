import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupListComponent } from './topup-list.component';

describe('TopupListComponent', () => {
  let component: TopupListComponent;
  let fixture: ComponentFixture<TopupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
