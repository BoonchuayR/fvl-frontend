import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterEditComponent } from './meter-edit.component';

describe('MeterEditComponent', () => {
  let component: MeterEditComponent;
  let fixture: ComponentFixture<MeterEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
