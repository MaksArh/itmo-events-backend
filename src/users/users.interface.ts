export interface UserData {
    isu: number

    gender: string

    name: string

    family_name: string

    given_name: string

    middle_name: string

    picture: string

    email: string

    email_verified: boolean

    citizenship: string

    residentialAddress: string

    is_student: boolean

    corp_email: string

    roles: any
}

export interface UserRO {
    readonly user: UserData
}
