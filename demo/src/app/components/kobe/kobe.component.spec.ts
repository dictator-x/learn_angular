import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KobeComponent } from './kobe.component';

describe('KobeComponent', () => {
  let component: KobeComponent;
  let fixture: ComponentFixture<KobeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KobeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KobeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
