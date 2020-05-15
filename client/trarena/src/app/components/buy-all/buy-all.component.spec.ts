import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyAllComponent } from './buy-all.component';

describe('BuyAllComponent', () => {
  let component: BuyAllComponent;
  let fixture: ComponentFixture<BuyAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
