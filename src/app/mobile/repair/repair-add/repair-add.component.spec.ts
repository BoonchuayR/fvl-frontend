import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairAddComponent } from './repair-add.component';

describe('RepairAddComponent', () => {
  let component: RepairAddComponent;
  let fixture: ComponentFixture<RepairAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
