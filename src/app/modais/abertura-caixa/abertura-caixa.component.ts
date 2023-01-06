import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Retorno } from 'app/models/Retorno';

declare var $:any;

@Component({
  selector: 'app-abertura-caixa',
  templateUrl: './abertura-caixa.component.html',
  styleUrls: ['../caixa.component.scss']
})
export class AberturaCaixaComponent implements OnInit {
  dataCaixa: Date;
  valor: String;
  dataAbertura: String;
  meses = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  constructor(public dialogRef: MatDialogRef<AberturaCaixaComponent>, private http : HttpClient) { }

  ngOnInit(): void {
    this.dataCaixa = new Date();
    this.saldoInicial();
  }

  saldoInicial(){
    this.dataAbertura = this.dataCaixa.getDate() + '/' + this.meses[this.dataCaixa.getMonth()] + '/' + this.dataCaixa.getFullYear();
    this.http.get<String>('https://localhost:44356/Consulta/SaldoInicialCaixa?data=' + this.dataAbertura)
     .subscribe(resultado => {
         this.valor = resultado;
    });
  }

  abrirCaixa(){
    this.dataAbertura = this.dataCaixa.getDate() + '/' + this.meses[this.dataCaixa.getMonth()] + '/' + this.dataCaixa.getFullYear();
    this.http.put<Retorno>('https://localhost:44356/Cadastro/Caixa?data=' + this.dataAbertura + '&valorInicial=' + this.valor, null)
     .subscribe(resultado => {
         if (resultado.ok){
           this.mensagem("Caixa aberto com sucesso!", "success");
           this.dialogRef.close();
         }
         else{
          this.mensagem(resultado.msgerro, "danger");
          this.dialogRef.close();
         }
    });
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

  onCancel(): void {
    this.dialogRef.close();
  }

}
