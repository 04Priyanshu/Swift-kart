export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor(message: string, statusCode: number, isOperational: boolean = true, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;

        Error.captureStackTrace(this);
    }

}

//not found error
export class NotFoundError extends AppError {
    constructor(message="Resource not found") {
        super(message, 404);
    }
}

//validation error
export class ValidationError extends AppError {
    constructor(message="Validation failed", details?: any) {
        super(message, 400, true, details);
    }
}

//authentication error
export class AuthenticationError extends AppError {
    constructor(message="Unauthorized") {
        super(message, 401);
    }
}

//forbidden error
export class ForbiddenError extends AppError {
    constructor(message="Forbidden") {
        super(message, 403);
    }
}

//database error
export class DatabaseError extends AppError {
    constructor(message="Database error", details?: any) {
        super(message, 500, true, details);
    }
}

//rate-limit error
export class RateLimitError extends AppError {
    constructor(message="Rate limit exceeded", details?: any) {
        super(message, 429, true, details);
    }
}
