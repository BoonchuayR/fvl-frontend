import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnounceAddComponent } from './announce-add.component';

describe('AnnounceAddComponent', () => {
  let component: AnnounceAddComponent;
  let fixture: ComponentFixture<AnnounceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnounceAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnounceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
