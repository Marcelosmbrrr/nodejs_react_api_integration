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

export interface IFormValidation {
    [key: string]: {
        test: (value: string) => Boolean,
        message: string
    }
}