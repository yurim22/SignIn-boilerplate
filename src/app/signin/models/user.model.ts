export class User {
    id: string;
    name: string;
    permission: string;
    institution: string;
    seq: number;
    creation_timestamp: string;
    update_timestamp: Date;
    invalid_password_count: number;
    last_password_timestamp: number;
    password: string;
}