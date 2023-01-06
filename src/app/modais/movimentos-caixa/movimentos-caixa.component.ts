import { FormasPagamento } from './../../models/FormasPagamento';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CaixaMovimentacao } from 'app/models/CaixaMovimentacao';

declare interface TableData {
  headerRow: string[];
  dataRows: CaixaMovimentacao[];
}

declare interface data {
  data: Date
}

@Component({
  selector: 'app-movimentos-caixa',
  templateUrl: './movimentos-caixa.component.html',
  styleUrls: ['../caixa.component.scss']
})
export class MovimentosCaixaComponent implements OnInit {
  public tableMovimentacao: TableData;
  meses = ['','jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  constructor(private http : HttpClient,
              @Inject(MAT_DIALOG_DATA) public data: data,
              public dialogRef: MatDialogRef<MovimentosCaixaComponent>) { }

  ngOnInit(): void {
    this.tableMovimentacao = {
      headerRow: [ ],
      dataRows: []
    };
    this.popularMovimentacoes();
  }

  popularMovimentacoes(){
    let dataCaixa = this.data.data.toString().substring(8,10) + '/' + this.meses[Number(this.data.data.toString().substring(5,7))] + '/' + this.data.data.toString().substring(0,4);
    this.http.get<CaixaMovimentacao[]>('https://localhost:44356/Consulta/MovimentacoesCaixa?data=' + dataCaixa)
            .subscribe(resultado => {
              let i: number = 0;
              let table : CaixaMovimentacao[] = new Array(); 
              let total : number;
              let conversor: number;
              let descricao: string;
              total = 0;
              while (i < resultado.length){
                if (resultado[i].tipo == "E"){
                  conversor = 1;
                  descricao = "Entrada";
                }
                else {
                  conversor = -1;
                  descricao = "Saída";
                }

                let linha : CaixaMovimentacao = { id: resultado[i].id,
                                                  descricao: resultado[i].descricao,
                                                  contapagar: resultado[i].contapagar,
                                                  contapagarid: resultado[i].contapagarid,
                                                  contareceber: resultado[i].contareceber,
                                                  contareceberid: resultado[i].contareceberid,
                                                  formapagamentoid: resultado[i].formapagamentoid,
                                                  formapagamento: resultado[i].formapagamento,
                                                  tipo: descricao,
                                                  valor: String(Number(resultado[i].valor) * conversor),
                                                  observacao: null }
                table.push(linha);
                total = total + (Number(resultado[i].valor) * conversor);
                i = i + 1; 
              }

                let fp : FormasPagamento = new FormasPagamento();
                let linha : CaixaMovimentacao = { id: null,
                                                  descricao: null,
                                                  contapagar: null,
                                                  contapagarid: null,
                                                  contareceber: null,
                                                  contareceberid: null,
                                                  formapagamentoid: null,
                                                  formapagamento: fp,
                                                  tipo: null,
                                                  valor: String(total),
                                                  observacao: null }

                table.push(linha);
                this.tableMovimentacao = {
                  headerRow: [ 'Id', 'Descrição', 'Tipo', 'Entrada/Saida', 'Valor'],
                  dataRows: table
                };
            } );
  }

  Cancelar(){
    this.dialogRef.close();
  }

}
