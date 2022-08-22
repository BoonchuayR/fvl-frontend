import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairListComponent } from './repair-list.component';

describe('RepairListComponent', () => {
  let component: RepairListComponent;
  let fixture: ComponentFixture<RepairListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
