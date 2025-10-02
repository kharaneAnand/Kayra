export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor(
        message: string,
        statusCode: number = 500,
        isOperational: boolean = true,
        details?: any
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}


// Not found error 
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found', details?: any) {
        super(message, 404, true, details);
    }
}

// Validation error
export class ValidationError extends AppError {
    constructor(message = 'Validation error', details?: any) {
        super(message, 400, true, details);
    }
}

// Authentication error
export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed', details?: any) {
        super(message, 401, true, details);
    }
}

// Authorization error
export class AuthorizationError extends AppError {
    constructor(message = 'Not authorized', details?: any) {
        super(message, 403, true, details);
    }
}

// forbidden error
export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden access', details?: any) {
        super(message, 403, true, details);
    }
}

// Database error
export class DatabaseError extends AppError {
    constructor(message = 'Database error', details?: any) {
        super(message, 500, false, details);
    }
}

// Rate limit error
export class RateLimitError extends AppError {
    constructor(message = 'Too many requests', details?: any) {
        super(message, 429, true, details);
    }
}
