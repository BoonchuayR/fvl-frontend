import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterViewComponent } from './meter-view.component';

describe('MeterViewComponent', () => {
  let component: MeterViewComponent;
  let fixture: ComponentFixture<MeterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
