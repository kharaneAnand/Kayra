

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor(message: string, statusCode = 500, isOperational = true, details?: any) {
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

// Validation error use for ( joi/zod/react-hook-form validation errors)
export class ValidationError extends AppError {
    constructor(message = 'Validation failed', details?: any) {
        super(message, 400, true, details);
    }
}


//Authentication error
export class AuthError extends AppError {
    constructor(message = 'Authentication failed', details?: any) {
        super(message, 401, true, details);
    }
}

// Unauthorized error
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access', details?: any) {
        super(message, 401, true, details);
    }
}

// Forbidden error (for Insufficient permissions)
export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', details?: any) {
        super(message, 403, true, details);
    }
}

// Database error ( for MongoDB/PostgreSQL related errors)
export class DatabaseError extends AppError {
    constructor(message = 'Database error', details?: any) {
        super(message, 500, true, details);
    }
}

//Rate limit error
export class RateLimitError extends AppError {
    constructor(message = 'Too many requests, please try again later.', details?: any) {
        super(message, 429, true, details);
    }
}

