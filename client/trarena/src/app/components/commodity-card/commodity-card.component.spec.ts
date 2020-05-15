import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityCardComponent } from './commodity-card.component';

describe('CommodityCardComponent', () => {
  let component: CommodityCardComponent;
  let fixture: ComponentFixture<CommodityCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommodityCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommodityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
