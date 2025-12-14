import type { Context } from 'hono';
import { DomainException } from '../domain/exceptions/domain.exception.js';
import { ValidationException } from '../domain/exceptions/validation.exception.js';
import { EntityNotFoundException } from '../domain/exceptions/entity-not-found.exception.js';
import { ApplicationException } from '../application/exceptions/application.exception.js';
import { UnauthorizedException } from '../application/exceptions/unauthorized.exception.js';
import { ForbiddenException } from '../application/exceptions/forbidden.exception.js';
import { InfrastructureException } from '../infrastructure/exceptions/infrastructure.exception.js';

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
    stack?: string;
  };
}

export class ExceptionFilter {
  static handle(error: Error, c: Context): Response {
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Map exception to HTTP status and error code
    const { status, code } = this.getStatusAndCode(error);

    const details = this.getDetails(error);
    const errorResponse: ErrorResponse = {
      error: {
        code,
        message: error.message,
        ...(details ? { details } : {}),
        ...(isDevelopment && error.stack ? { stack: error.stack } : {}),
      },
    };

    return c.json(errorResponse, status as any);
  }

  private static getStatusAndCode(error: Error): { status: number; code: string } {
    // Domain exceptions - 400 Bad Request
    if (error instanceof ValidationException) {
      return { status: 400, code: 'VALIDATION_ERROR' };
    }
    if (error instanceof EntityNotFoundException) {
      return { status: 404, code: 'ENTITY_NOT_FOUND' };
    }
    if (error instanceof DomainException) {
      return { status: 400, code: 'DOMAIN_ERROR' };
    }

    // Application exceptions
    if (error instanceof UnauthorizedException) {
      return { status: 401, code: 'UNAUTHORIZED' };
    }
    if (error instanceof ForbiddenException) {
      return { status: 403, code: 'FORBIDDEN' };
    }
    if (error instanceof ApplicationException) {
      return { status: 400, code: 'APPLICATION_ERROR' };
    }

    // Infrastructure exceptions - 503 Service Unavailable
    if (error instanceof InfrastructureException) {
      return { status: 503, code: 'INFRASTRUCTURE_ERROR' };
    }

    // Default - 500 Internal Server Error
    return { status: 500, code: 'INTERNAL_SERVER_ERROR' };
  }

  private static getDetails(error: Error): unknown {
    if (error instanceof ValidationException) {
      const details: any = {};
      if (error.field) {
        details.field = error.field;
      }
      if (error.details) {
        details.validation = error.details;
      }
      return Object.keys(details).length > 0 ? details : undefined;
    }
    if (error instanceof EntityNotFoundException) {
      return {
        entityName: error.entityName,
        entityId: error.entityId,
      };
    }
    return undefined;
  }
}
