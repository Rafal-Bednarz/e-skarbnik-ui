import { Grade } from "./grade";

export interface User {
    username: string;
    email: string;
    grades: Grade[];
}
