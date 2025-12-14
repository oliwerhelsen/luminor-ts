import 'reflect-metadata';
import { container, DependencyContainer } from 'tsyringe';

// Internal storage for factory functions
const factoryStorage = new Map<string | symbol, () => unknown>();
const singletonStorage = new Map<string | symbol, unknown>();

export class Container {
  private static instance: DependencyContainer = container;

  static get<T>(token: string | symbol | (new (...args: unknown[]) => T)): T {
    // Check if it's a factory function registration
    if (typeof token === 'string' || typeof token === 'symbol') {
      // Check singleton storage first
      if (singletonStorage.has(token)) {
        return singletonStorage.get(token) as T;
      }
      
      // Check factory storage
      const factory = factoryStorage.get(token);
      if (factory) {
        const instance = factory() as T;
        // Store in singleton if needed (will be handled by register)
        return instance;
      }
    }
    
    // Try tsyringe resolve for class tokens
    try {
      return this.instance.resolve<T>(token);
    } catch {
      throw new Error(`Token "${String(token)}" not found in container`);
    }
  }

  static register<T>(
    token: string | symbol | (new (...args: unknown[]) => T),
    factory: (dependencyContainer: DependencyContainer) => T,
    options?: { singleton?: boolean }
  ): void {
    // For string/symbol tokens with factory functions, use our storage
    if (typeof token === 'string' || typeof token === 'symbol') {
      if (options?.singleton) {
        // Store factory and create instance on first access
        factoryStorage.set(token, () => {
          if (!singletonStorage.has(token)) {
            singletonStorage.set(token, factory(this.instance));
          }
          return singletonStorage.get(token) as T;
        });
      } else {
        // Store factory for transient instances
        factoryStorage.set(token, () => factory(this.instance));
      }
    } else {
      // For class tokens, register with tsyringe
      if (options?.singleton) {
        this.instance.registerSingleton(token, token);
      } else {
        this.instance.register(token, token);
      }
    }
  }

  static registerInstance<T>(
    token: string | symbol | (new (...args: unknown[]) => T),
    instance: T
  ): void {
    if (typeof token === 'string' || typeof token === 'symbol') {
      singletonStorage.set(token, instance);
    } else {
      this.instance.registerInstance(token, instance);
    }
  }

  static reset(): void {
    this.instance.clearInstances();
    factoryStorage.clear();
    singletonStorage.clear();
  }

  static getContainer(): DependencyContainer {
    return this.instance;
  }
}

