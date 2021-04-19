export class User {
    id: string;
    name: string;
    permission: string;
    institution: string;
    seq: number;
    creation_timeStamp: String;
    update_timeStamp: Date;
    invalid_password_count: number;
    last_password_timestamp: number;
    password: string;
}