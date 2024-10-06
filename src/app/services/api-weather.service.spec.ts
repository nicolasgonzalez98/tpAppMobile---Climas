import { TestBed } from '@angular/core/testing';

import { APIWeatherService } from './api-weather.service';

describe('APIWeatherService', () => {
  let service: APIWeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(APIWeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
