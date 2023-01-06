import { Retirada } from './../../models/Retirada';
import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Retorno } from 'app/models/Retorno';
import { CaixaMovimentacao } from 'app/models/CaixaMovimentacao';

declare interface TableData {
  dataRows: Retirada[];
}

declare var $:any;

@Component({
  selector: 'app-retirada-caixa',
  templateUrl: './retirada-caixa.component.html',
  styleUrls: ['../caixa.component.scss']
})
export class RetiradaCaixaComponent implements OnInit {
  public tableMovimentacaoRetirada: TableData;
  valor: string;
  motivo: string;
  classSeta = {};
  classSetaBol: boolean;
  meses = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  constructor(private http : HttpClient,
              @Inject(MAT_DIALOG_DATA) public data: Date,
              public dialogRef: MatDialogRef<RetiradaCaixaComponent>) { }

  ngOnInit(): void {
    this.tableMovimentacaoRetirada = {
      dataRows: []
    };
    this.classSetaBol = true;
    this.classSeta = {'setaBaixo': this.classSetaBol, 'setaCima': !this.classSetaBol };
    this.popularMovimentacoes();
  }

  popularMovimentacoes(){
    let dataCaixa = this.data.toString().substring(8,10) + '/' + this.meses[Number(this.data.toString().substring(5,7))-1] + '/' + this.data.toString().substring(0,4);
    this.http.get<CaixaMovimentacao[]>('https://localhost:44356/Consulta/getRetiradaData?data=' + dataCaixa)
            .subscribe(resultado => {
              let i: number = 0;
              let table : Retirada[] = new Array(); 
                while (i < resultado.length){
                  let linha : Retirada = { data: this.data,
                                           valor: resultado[i].valor,
                                           observacao: resultado[i].observacao,
                                           id: resultado[i].id
                  }
                  table.push(linha);
                  i = i + 1; 
                }

                this.tableMovimentacaoRetirada = {
                  dataRows: table
                };
            } );
  }

  fecharModal(){
    this.dialogRef.close();
  }

  novaRetiradaDesc(){
    this.classSetaBol = !this.classSetaBol;
    this.classSeta = {'setaBaixo': this.classSetaBol, 'setaCima': !this.classSetaBol };
  }

  RealizarRetirada(){
    let retirada : Retirada = new Retirada();
    retirada.data = new Date(Number(this.data.toString().substring(0,4)), Number(this.data.toString().substring(5,7))-1, Number(this.data.toString().substring(8,10)));
    console.log(this.data.toString().substring(5,7));
    console.log(retirada.data);
    retirada.observacao = this.motivo;
    retirada.valor = this.valor;
    this.http.put<Retorno>('https://localhost:44356/Cadastro/RetiradaCaixa', retirada)
      .subscribe(resultado => {
        if (resultado.ok){
          this.mensagem("Retirada realizada com sucesso!", "success");
          this.popularMovimentacoes();
         }
         else {
          this.mensagem(resultado.msgerro, "danger");
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

deletarRetirada(dados){
  console.log(dados);
   this.http.delete<Retorno>('https://localhost:44356/Exclusao/RetiradaCaixa?idRetirada=' + dados.id)
       .subscribe(resultado => {
         if (resultado.ok){
           this.mensagem("Retirada excluida com sucesso!", "success");
           this.popularMovimentacoes();
          }
          else {
           this.mensagem(resultado.msgerro, "danger");
          }
          
       });
}

}
