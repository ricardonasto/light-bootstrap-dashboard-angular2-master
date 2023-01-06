import { ContaBaixa } from './../../models/ContaBaixa';
import { FormasPagamento } from './../../models/FormasPagamento';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contas } from 'app/models/Contas';
import { Retorno } from 'app/models/Retorno';

declare interface data {
  conta: Contas,
  tipo: String
}

declare var $:any;

@Component({
  selector: 'app-baixar-conta',
  templateUrl: './baixar-conta.component.html',
  styleUrls: ['../caixa.component.scss']
})
export class BaixarContaComponent implements OnInit {
  conta: Contas;
  Pagtos = [];
  dtaVecto: String;
  dataVecto: Date;
  contaBaixa: ContaBaixa;

  constructor(public dialogRef: MatDialogRef<BaixarContaComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: data,
              private http : HttpClient) { }

  ngOnInit(): void {
    this.conta = this.data.conta;
    this.buscarFormasPagtos();
  }

  onCancel(){
    this.dialogRef.close();
  }

  buscarFormasPagtos(){
    this.http.get<FormasPagamento[]>('https://localhost:44356/Consulta/FormasPagto')
            .subscribe(resultado => {
              let i: number = 0;
              this.Pagtos = [];

               while (i < resultado.length){
                 this.Pagtos.push({ id: resultado[i].id, descricao: resultado[i].descricao });
                 i = i + 1; 
               }
            } );
  }

  baixarConta(){
    this.contaBaixa = new ContaBaixa();
    this.contaBaixa.datapagamento = this.conta.datapagamento;
    this.contaBaixa.descricao = this.conta.descricao;
    this.contaBaixa.formapagamento = this.conta.formapagamento;
    this.contaBaixa.formapagamentoid = this.conta.formapagamentoid;
    this.contaBaixa.id = this.conta.id;
    this.contaBaixa.juros = this.conta.juros;
    this.contaBaixa.multa = this.conta.multa;
    this.contaBaixa.valor = this.conta.valor;
    console.log(this.data.tipo);
    if (this.data.tipo == 'CR'){
       this.http.put<Retorno>('https://localhost:44356/Alteracao/BaixarContaReceber', this.contaBaixa)
         .subscribe(resultado => {
           if (resultado.ok){
             this.mensagem("Conta baixada com sucesso!", "success");
             this.dialogRef.close();
           }
           else{
            this.mensagem(resultado.msgerro, "danger");
            this.dialogRef.close();
           }
         } );
    }
    else {
      this.http.put<Retorno>('https://localhost:44356/Alteracao/BaixarContaPagar', this.contaBaixa)
      .subscribe(resultado => {
        if (resultado.ok){
          this.mensagem("Conta baixada com sucesso!", "success");
          this.dialogRef.close();
          }
          else{
          this.mensagem(resultado.msgerro, "danger");
          this.dialogRef.close();
          }
      } );
    }
  }

  mensagem(mensagem, tipo){
    var icon = "";
    if (tipo == "success"){
        icon = "pe-7s-check";
    }
    else if (tipo == "info"){
        icon = "pe-7s-info";
    }
    else {
        icon = "pe-7s-close";
    }
      $.notify({
          icon: icon,
          message: mensagem
      },{
          type: tipo,
          timer: 1000,
          placement: {
              from: 'top',
              align: 'right'
          }
      });
  }
}
