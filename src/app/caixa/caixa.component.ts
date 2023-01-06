import { RetiradaCaixaComponent } from './../modais/retirada-caixa/retirada-caixa.component';
import { FechamentoCaixaComponent } from './../modais/fechamento-caixa/fechamento-caixa.component';
import { MovimentosCaixaComponent } from './../modais/movimentos-caixa/movimentos-caixa.component';
import { Retorno } from './../models/Retorno';
import { AberturaCaixaComponent } from './../modais/abertura-caixa/abertura-caixa.component';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Caixa } from 'app/models/Caixa';
import { MatDialog } from '@angular/material/dialog';

declare interface TableData { 
  headerRow: string[];
  dataRows: LinhasGrid[];
}

declare interface LinhasGrid {
  id: number;
  data: Date;
  valor: string;
  status: string;
}

declare var $:any;

@Component({
  selector: 'app-caixa',
  templateUrl: './caixa.component.html',
  styleUrls: ['./caixa.component.scss']
})
export class CaixaComponent implements OnInit {
   classCaixa = {};
   public tableCaixa: TableData;
   detalhesCaixa = false;
   detalhes: Caixa;

  constructor(private http : HttpClient,
              public dialog: MatDialog) {
     this.tableCaixa = {
       headerRow: [ ],
       dataRows: []
     };
     this.detalhes = new Caixa();
   }

  ngOnInit() {
    this.popularCaixas();
  }

  popularCaixas(){
    this.http.get<Caixa[]>('https://localhost:44356/Consulta/Caixa')
            .subscribe(resultado => {
              let i: number = 0;
              let table : LinhasGrid[] = new Array(); 
                while (i < resultado.length){
                  let linha : LinhasGrid = { id: resultado[i].id,
                                             data: resultado[i].data,
                                             valor: resultado[i].valorinicial,
                                             status: resultado[i].status
                                           }
                  table.push(linha);
                  i = i + 1; 
                }

                this.tableCaixa = {
                  headerRow: [ 'Data', 'Valor Inicial', 'Status'],
                  dataRows: table
                };
            } );
  }

  editar(dados){
    this.detalhesCaixa = true;
    this.classCaixa = {'col-md-12' : false, 'col-md-8' : true};
    this.detalhes.data = dados.data;
    this.detalhes.valorinicial = dados.valor;
    if (dados.status == 'A'){
      this.detalhes.status = 'Aberto';
    }
    else {
      this.detalhes.status = 'Fechado';
    }
  }

  cancelarDetalhes(){
    this.limparDetalhes();
  }

  limparDetalhes(){
    this.detalhesCaixa = false;
    this.classCaixa = {'col-md-12' : true, 'col-md-8' : false};
  }

  

  reabrirCaixa(){
    this.http.put<Retorno>('https://localhost:44356/Alteracao/ReabrirCaixa?data=' + this.detalhes.data, null)
       .subscribe(resultado => {
           if (resultado.ok){
            this.mensagem("Caixa reaberto com sucesso!", "success");
            this.limparDetalhes();
            this.popularCaixas();
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

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    let d = this.dialog.open(AberturaCaixaComponent, {
      width: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
    d.beforeClosed().subscribe(result => {
      this.popularCaixas();
    });
  }

  excluirCaixa(){
    this.http.delete<Retorno>('https://localhost:44356/Exclusao/Caixa?data=' + this.detalhes.data)
       .subscribe(resultado => {
          if (resultado.ok){
            this.mensagem("Caixa excluido com sucesso!", "success");
            this.limparDetalhes();
            this.popularCaixas();
          }
          else {
            this.mensagem(resultado.msgerro, "danger");
          }
       });
  }

  openDialogMov(enterAnimationDuration: string, exitAnimationDuration: string): void {
    let d = this.dialog.open(MovimentosCaixaComponent, {
      width: '900px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { data: this.detalhes.data }
    });
  }

  openDialogFechar(enterAnimationDuration: string, exitAnimationDuration: string): void {
    let d = this.dialog.open(FechamentoCaixaComponent, {
      width: '900px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { data: this.detalhes.data }
    });
    d.beforeClosed().subscribe(result => {
      this.limparDetalhes();
      this.popularCaixas();
    });
  }

  openDialogRetirada(enterAnimationDuration: string, exitAnimationDuration: string): void {
    let d = this.dialog.open(RetiradaCaixaComponent, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: this.detalhes.data
    });
    d.beforeClosed().subscribe(result => {
      this.popularCaixas();
    });
  }

}
