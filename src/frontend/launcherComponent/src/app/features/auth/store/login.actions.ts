export class SetErrorMessage {
    static readonly type = '[Login] Set Error Message';

    constructor(public errorMessage: string) {
    }
}

export class ClearLogin {
    static readonly type = '[Login] Clear Login';
}

export class Unauthorized {
    static readonly type = '[Login] Unauthorized';
}

export class Allowed {
    static readonly type = '[Login] Allowed';
}

export class Login {
    static readonly type = '[Login] Sign In';
}

export class Logout {
    static readonly type = '[Login] Sign Out';
}