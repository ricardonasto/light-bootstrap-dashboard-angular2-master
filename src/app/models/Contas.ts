import { FormasPagamento } from './FormasPagamento';
import { Pessoa } from './Pessoa';
export class Contas {
    id : number;
    pessoaid: number;
    pessoa: Pessoa;
    valor: string;
    datavencimento: Date;
    datapagamento: Date;
    formapagamento: FormasPagamento
    formapagamentoid: number;
    juros: string;
    multa: string;
    descricao: string;
    status: string;
    statusgrid: string;
}
