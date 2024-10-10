export type LoginResponseType = {
    token: string,
    user_id: string,
    email: string,
    welcome_screen_seen: boolean,
    is_superuser: boolean,
    organisation: string
}

export enum LoginResponseEnum {
    SUCCESS,
    INVALID,
    FAILED
}

export type ResetPasswordOtpResponseType = {
    message: string,
    user_id: string
}
