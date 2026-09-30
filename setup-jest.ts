import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

Object.defineProperty(window, 'alert', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window, 'confirm', {
  writable: true,
  value: jest.fn().mockReturnValue(true),
});

