import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTweetComponent } from './view-tweet.component';

describe('ViewTweetComponent', () => {
  let component: ViewTweetComponent;
  let fixture: ComponentFixture<ViewTweetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTweetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTweetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
