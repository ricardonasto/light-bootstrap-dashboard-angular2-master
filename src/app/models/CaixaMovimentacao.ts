import { ContaBaixa } from './ContaBaixa';
import { FormasPagamento } from './FormasPagamento';
export class CaixaMovimentacao {
    id: number;
    descricao: string;
    formapagamentoid: number;
    formapagamento: FormasPagamento;
    tipo: string;
    valor: string;
    contapagarid: number;
    contapagar: ContaBaixa;
    contareceberid: number;
    contareceber: ContaBaixa;
    observacao: string;
}