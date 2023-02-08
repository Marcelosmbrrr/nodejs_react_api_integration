export interface IUserContext {
    id: number,
    name: string,
    email: string,
    role: {
        id: string,
        name: string,
        access: number
    },
    created_at: Date
}

export interface IFormData {
    [key: string]: string
}

export interface IFieldError {
    error: boolean,
    message: string
}

export interface IFormError {
    [key: string]: IFieldError
}

export interface IFormValidation {
    [key: string]: {
        test: (value: string) => boolean,
        message: string
    }
}

export interface IChatMessage {
    verification: boolean,
    username: string,
    time: string,
    message: string
}

export interface IAlert {
    display: boolean,
    type: string,
    message: string
}

