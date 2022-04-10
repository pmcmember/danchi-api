export type Result<T, E> = Success<T, E> | Failure<T, E>

export class Success<T, E> {
    public data: T;
    public type = 'success' as const

    constructor(data: T) {
        this.data = data;
    }

    public isSuccess(): this is Success<T, E> {
        return true;
    }
    public isFailure(): this is Failure<T, E> {
        return false;
    }
}

export class Failure<T, E> {
    public data: E;
    public type = 'failure' as const;

    constructor(data: E) {
        this.data = data;
    }

    public isSuccess(): this is Success<T, E> {
        return false;
    }
    public isFailure(): this is Failure<T, E> {
        return true;
    }
}