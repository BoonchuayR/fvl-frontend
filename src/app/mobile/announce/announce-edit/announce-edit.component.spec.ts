import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnounceEditComponent } from './announce-edit.component';

describe('AnnounceEditComponent', () => {
  let component: AnnounceEditComponent;
  let fixture: ComponentFixture<AnnounceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnounceEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnounceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
