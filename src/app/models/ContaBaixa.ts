import { FormasPagamento } from './FormasPagamento';
export class ContaBaixa {
    id : number;
    valor: string;
    datapagamento: Date;
    formapagamento: FormasPagamento
    formapagamentoid: number;
    juros: string;
    multa: string;
    descricao: string;
}
