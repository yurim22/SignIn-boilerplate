export interface User {
    id: string;
    name: string;
    permission: string;
    institution: string;
    seq: number;
    // tslint:disable-next-line: variable-name
    creation_timestamp: string;
    // tslint:disable-next-line: variable-name
    update_timestamp: Date;
    // tslint:disable-next-line: variable-name
    invalid_password_count: number;
    // tslint:disable-next-line: variable-name
    last_password_timestamp: number;
    password: string;
}
