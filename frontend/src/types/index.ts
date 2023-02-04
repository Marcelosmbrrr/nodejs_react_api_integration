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

export interface IfieldError {
    error: boolean,
    message: string
}

export interface IFormError {
    [key: string]: IfieldError
}

export interface IFormValidation {
    [key: string]: {
        test: (value: string) => boolean,
        message: string
    }
}

export interface IChatMessage {
    username: string,
    avatar: {
        color: string,
    },
    time: string,
    message: string
}

