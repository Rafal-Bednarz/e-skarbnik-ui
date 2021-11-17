import { Payment } from "./payment";

export interface Student {
    
    nr: number;
    id: number;
    fullname: string;
    paymentSum: number;
    payments: Payment[];
}