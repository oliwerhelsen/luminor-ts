import 'reflect-metadata';
import { container, DependencyContainer } from 'tsyringe';

export class Container {
  private static instance: DependencyContainer = container;

  static get<T>(token: string | symbol | (new (...args: any[]) => T)): T {
    return this.instance.resolve<T>(token);
  }

  static register<T>(
    token: string | symbol | (new (...args: any[]) => T),
    factory: (dependencyContainer: DependencyContainer) => T,
    options?: { singleton?: boolean }
  ): void {
    if (options?.singleton) {
      this.instance.registerSingleton(token, factory as any);
    } else {
      this.instance.register(token, factory as any);
    }
  }

  static registerInstance<T>(
    token: string | symbol | (new (...args: any[]) => T),
    instance: T
  ): void {
    this.instance.registerInstance(token, instance);
  }

  static reset(): void {
    this.instance.clearInstances();
  }

  static getContainer(): DependencyContainer {
    return this.instance;
  }
}

