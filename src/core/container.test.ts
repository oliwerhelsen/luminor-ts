import { describe, it, expect, beforeEach } from 'vitest';
import { Container } from './container.js';

describe('Container', () => {
  beforeEach(() => {
    Container.reset();
  });

  it('should register and resolve a service', () => {
    Container.register('TestService', () => 'test-value');
    const value = Container.get<string>('TestService');
    expect(value).toBe('test-value');
  });

  it('should register singleton service', () => {
    let callCount = 0;
    Container.register(
      'SingletonService',
      () => {
        callCount++;
        return { id: callCount };
      },
      { singleton: true }
    );

    const instance1 = Container.get('SingletonService');
    const instance2 = Container.get('SingletonService');

    expect(instance1).toBe(instance2);
    expect(callCount).toBe(1);
  });

  it('should register instance', () => {
    const instance = { value: 'test' };
    Container.registerInstance('InstanceService', instance);
    const resolved = Container.get('InstanceService');
    expect(resolved).toBe(instance);
  });
});
