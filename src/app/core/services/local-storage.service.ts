import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  /**
   * Retrieves and parses an item from localStorage
   */
  getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return defaultValue;
      }
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.warn(`[LocalStorageService] Error reading key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Serializes and sets an item in localStorage
   */
  setItem<T>(key: string, value: T): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
    } catch (error) {
      console.warn(`[LocalStorageService] Error setting key "${key}":`, error);
    }
  }

  /**
   * Removes an item from localStorage
   */
  removeItem(key: string): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[LocalStorageService] Error removing key "${key}":`, error);
    }
  }

  /**
   * Clears all items in localStorage
   */
  clear(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.clear();
    } catch (error) {
      console.warn('[LocalStorageService] Error clearing localStorage:', error);
    }
  }

  /**
   * Checks if an item exists in localStorage
   */
  hasItem(key: string): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      return window.localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }
}
