export class AddNewUser {
    public static readonly type = '[User API] Add User';
    constructor(public payload: {}) {}
}

export class GetCurrentUser {
    public static readonly type = '[User Status] Get Current User';
    constructor(public payload: {}) {}
}

export class UpdateUserLoginStatus {
    public static readonly type = '[User Status] Update User Login Status';
    constructor(public status: string) {}
}
