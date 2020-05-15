import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellAllComponent } from './sell-all.component';

describe('SellAllComponent', () => {
  let component: SellAllComponent;
  let fixture: ComponentFixture<SellAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
