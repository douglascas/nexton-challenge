import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
    service.clear();
  });

  afterEach(() => {
    service.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve an object', () => {
    const testData = { id: 'test-1', name: 'Software Item' };
    service.setItem('test_key', testData);

    const retrieved = service.getItem<typeof testData>('test_key');
    expect(retrieved).toEqual(testData);
  });

  it('should return default value when key does not exist', () => {
    const result = service.getItem('non_existent_key', { fallback: true });
    expect(result).toEqual({ fallback: true });
  });

  it('should remove an item', () => {
    service.setItem('test_key', 'value');
    expect(service.hasItem('test_key')).toBe(true);

    service.removeItem('test_key');
    expect(service.hasItem('test_key')).toBe(false);
    expect(service.getItem('test_key')).toBeNull();
  });

  it('should clear all items', () => {
    service.setItem('key1', 'val1');
    service.setItem('key2', 'val2');

    service.clear();
    expect(service.hasItem('key1')).toBe(false);
    expect(service.hasItem('key2')).toBe(false);
  });
});
