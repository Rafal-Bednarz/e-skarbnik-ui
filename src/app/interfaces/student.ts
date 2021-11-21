import { Payment } from "./payment";

export interface Student {
    
    nr: number;
    id: number;
    fullname: string;
    paymentsSum: number;
    payments: Payment[];
}