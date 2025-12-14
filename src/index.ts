// Core
export { Container } from './core/container.js';
export { AppFactory, type AppOptions } from './core/app.js';

// Infrastructure - Database
export { DatabaseFactory, type Database, type DatabaseConfig } from './infrastructure/database/factory.js';

// Infrastructure - Auth
export { AuthService, type JwtPayload, type AuthConfig } from './infrastructure/auth/auth.service.js';
export { authMiddleware, type AuthContext } from './infrastructure/auth/auth.middleware.js';

// Infrastructure - Logging
export { Logger, LogLevel, type LogEntry } from './infrastructure/logging/logger.js';
export { loggingMiddleware } from './infrastructure/logging/logging.middleware.js';

// Domain
export { BaseEntity } from './domain/base-entity.js';
export type { Repository } from './domain/repository.interface.js';

// Application
export type { UseCase } from './application/use-case.interface.js';

// Testing
export { createTestApp, mockRequest, makeRequest, type TestContext } from './testing/helpers.js';

