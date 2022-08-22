import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterAddComponent } from './meter-add.component';

describe('MeterAddComponent', () => {
  let component: MeterAddComponent;
  let fixture: ComponentFixture<MeterAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
