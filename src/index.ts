// Core
export { Container } from './core/container.js';
export { AppFactory, type AppOptions } from './core/app.js';
export { ExceptionFilter, type ErrorResponse } from './core/exception-filter.js';

// Infrastructure - Database
export { DatabaseFactory, type Database, type DatabaseConfig } from './infrastructure/database/factory.js';

// Infrastructure - Auth (Better Auth)
export { createBetterAuth, type BetterAuthConfig, type Auth } from './infrastructure/auth/better-auth.config.js';
export { betterAuthMiddleware, requireAuth, type SessionContext } from './infrastructure/auth/better-auth.middleware.js';
export type { AuthContext } from './infrastructure/auth/better-auth.types.js';

// Infrastructure - Logging
export { Logger, LogLevel, type LogEntry } from './infrastructure/logging/logger.js';
export { loggingMiddleware } from './infrastructure/logging/logging.middleware.js';

// Domain
export { BaseEntity } from './domain/base-entity.js';
export type { Repository } from './domain/repository.interface.js';

// Domain - Exceptions
export { DomainException } from './domain/exceptions/domain.exception.js';
export { ValidationException } from './domain/exceptions/validation.exception.js';
export { EntityNotFoundException } from './domain/exceptions/entity-not-found.exception.js';
export { BusinessRuleViolationException } from './domain/exceptions/business-rule-violation.exception.js';

// Application
export type { UseCase } from './application/use-case.interface.js';

// Application - Exceptions
export { ApplicationException } from './application/exceptions/application.exception.js';
export { UseCaseException } from './application/exceptions/use-case.exception.js';
export { UnauthorizedException } from './application/exceptions/unauthorized.exception.js';
export { ForbiddenException } from './application/exceptions/forbidden.exception.js';

// Infrastructure - Exceptions
export { InfrastructureException } from './infrastructure/exceptions/infrastructure.exception.js';
export { DatabaseException } from './infrastructure/exceptions/database.exception.js';
export { ExternalServiceException } from './infrastructure/exceptions/external-service.exception.js';

// Testing
export { createTestApp, mockRequest, makeRequest, type TestContext } from './testing/helpers.js';

