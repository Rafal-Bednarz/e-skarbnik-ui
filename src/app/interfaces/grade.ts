import { PayOff } from "./payOff";
import { Student } from "./student";

export interface Grade {
    
    id: number;
    nr: number;
    name: string;
    budget: number;
    paymentsSum: number;
    payOffsSum: number;
    students: Student[];
    payOffs: PayOff[];
}