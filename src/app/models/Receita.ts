import { MateriaPrima } from './MateriaPrima';
export class Receita {
    id : number;
    produtofinalid : number;
    materiaprimaid : number;
    materiaprima: MateriaPrima;
    materaiprimadesc: string;
    percentualutilizado : String;
}
