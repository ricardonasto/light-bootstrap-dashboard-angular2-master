import { Retorno } from './../models/Retorno';
import { BaixarContaComponent } from './../modais/baixar-conta/baixar-conta.component';
import { NovaPessoaComponent } from './../modais/nova-pessoa/nova-pessoa.component';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pessoa } from 'app/models/Pessoa';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Contas } from 'app/models/Contas';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

declare interface TableData {
  tipo : string;
  headerRow: string[];
  dataRows: LinhasGrid[];
}
declare interface LinhasGrid {
  id: number;
  descricao: string;
  pessoa: string;
  datavencimento: string;
  datavencimentod: Date;
  datapagamento: string;
  datapagamentod: Date;
  valor: string;
  status: string;
}

declare var $:any;

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.scss'],
  providers: [NgbModalConfig, NgbModal],
})
export class FinanceiroComponent implements OnInit {
 
  public tableFinanceiro: TableData;
  classCR = {};
  classCP = {};
  classEditar = {};
  editando = false;
  Incluir = false;
  novoOuEdicao : String;
  pessoas = [];
  @Input() contas : Contas;


  constructor(private http : HttpClient, 
              public dialog: MatDialog) {
    this.contas = new Contas();
    this.contas.pessoa = new Pessoa();
    this.Incluir = false;
    this.classEditar = {'col-md-12' : true, 'col-md-8' : false};
   }

  ngOnInit() {
    this.tableFinanceiro = {
      tipo: '',
      headerRow: [ ],
      dataRows: [ ]
    };
  }

  popularGrid(tipo){
      if (tipo == 'cr'){
        this.classCR = {'btn-info' : true};
        this.classCP = {'btn-info' : false};
        this.editando = false;
        this.classEditar = {'col-md-12' : true, 'col-md-8' : false};
        this.http.get<Contas[]>('https://localhost:44356/Consulta/ContasReceber')
            .subscribe(resultado => {
              let i: number = 0;
              let table : LinhasGrid[] = new Array(); 

              while (i < resultado.length){
                 let statusConta = "";

                 let linha : LinhasGrid = { id: resultado[i].id,
                                            descricao: resultado[i].descricao,
                                            pessoa: resultado[i].pessoa.nome,
                                            datavencimento: this.formatacaoData(resultado[i].datavencimento.toString()),
                                            datapagamento: this.formatacaoData(resultado[i].datapagamento.toString()),
                                            datavencimentod: resultado[i].datavencimento,
                                            datapagamentod: resultado[i].datapagamento,
                                            valor: resultado[i].valor,
                                            status: resultado[i].statusgrid
                                          };
                  table.push(linha);
                 i = i + 1; 
               }

                this.tableFinanceiro = {
                  tipo: 'CR',
                  headerRow: [ 'ID', 'Descrição', 'Pessoa', 'Vencimento', 'Pagamento', 'Valor', 'Status'],
                  dataRows: table
                };
            } );
      }
      else if (tipo == 'cp'){
        this.classCR = {'btn-info' : false};
        this.classCP = {'btn-info' : true};
        this.editando = false;
        this.classEditar = {'col-md-12' : true, 'col-md-8' : false};
        this.http.get<Contas[]>('https://localhost:44356/Consulta/ContasPagar')
            .subscribe(resultado => {
              let i: number = 0;
              let table : LinhasGrid[] = new Array(); 

              while (i < resultado.length){
                let linha : LinhasGrid = { id: resultado[i].id,
                                          descricao: resultado[i].descricao,
                                          pessoa: resultado[i].pessoa.nome,
                                          datavencimento: this.formatacaoData(resultado[i].datavencimento.toString()),
                                          datapagamento: this.formatacaoData(resultado[i].datapagamento.toString()),
                                          datavencimentod: resultado[i].datavencimento,
                                          datapagamentod: resultado[i].datapagamento,
                                          valor: resultado[i].valor,
                                          status: resultado[i].statusgrid
                                        };
                        table.push(linha);
                 i = i + 1; 
               }

                this.tableFinanceiro = {
                  tipo: 'CP',
                  headerRow: [ 'ID', 'Descrição', 'Pessoa', 'Vencimento', 'Pagamento', 'Valor', 'Status'],
                  dataRows: table
                };
            } );
      }
  }

  salvarItem(){
    if (this.tableFinanceiro.tipo == 'CR'){
      this.http.put('https://localhost:44356/Cadastro/ContasReceber', this.contas)
      .subscribe(resultado => {
          this.mensagem("Contas a receber inserida com sucesso!", "success");
          this.limparEdicaoInclusao();
          this.popularGrid("cr");
      });
    }
    else {
      this.http.put('https://localhost:44356/Cadastro/ContasPagar', this.contas)
      .subscribe(resultado => {
          this.mensagem("Contas a pagar inserida com sucesso!", "success");
          this.limparEdicaoInclusao();
          this.popularGrid("cp");
      });
    }
  }

  editar(dados: LinhasGrid){
    console.log(dados);
    this.novoOuEdicao = 'Editar';
    this.Incluir = false;
    this.classEditar = {'col-md-12' : false, 'col-md-8' : true};
      this.editando = true;
      if (dados != null) {
        this.contas.id = dados.id;
        this.contas.descricao = dados.descricao;
        this.contas.pessoa.nome = dados.pessoa;
        this.contas.datavencimento = dados.datavencimentod;
        this.contas.datapagamento = dados.datapagamentod;
        this.contas.valor = dados.valor;
        this.contas.status = dados.status;
        console.log(this.contas)
      }
  }

  novoItem(){
    this.contas = new Contas();
    this.contas.pessoa = new Pessoa();
    this.editar(null);
    this.novoOuEdicao = 'Novo';
    this.Incluir = true;
    this.buscarPessoas();
  }

  buscarPessoas(){
    this.http.get<Pessoa[]>('https://localhost:44356/Consulta/Pessoas')
            .subscribe(resultado => {
              let i: number = 0;
              let table : string[][] = new Array(); 
              this.pessoas = [];

               while (i < resultado.length){
                 this.pessoas.push({ id: resultado[i].id, nome: resultado[i].nome });
                 i = i + 1; 
               }
            } );
  }

  cancelarEdicao(){
    this.limparEdicaoInclusao();
  }

  limparEdicaoInclusao(){
    this.editando = false;
    this.classEditar = {'col-md-12' : true, 'col-md-8' : false};
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

  excluir(){
    if (this.tableFinanceiro.tipo == 'CR'){
        this.http.delete('https://localhost:44356/Exclusao/ContasReceber?id='+ this.contas.id)
          .subscribe(resultado => {
              this.mensagem("Exclusão realizada com sucesso!", "success");
              this.limparEdicaoInclusao();
              this.popularGrid("cr");
          }); 
    }
    else {
      this.http.delete('https://localhost:44356/Exclusao/ContasPagar?id='+ this.contas.id)
          .subscribe(resultado => {
              this.mensagem("Exclusão realizada com sucesso!", "success");
              this.limparEdicaoInclusao();
              this.popularGrid("cp");
          });
    }
  }

  novaPessoa(enterAnimationDuration: string, exitAnimationDuration: string): void {
    let d = this.dialog.open(NovaPessoaComponent, {
      width: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
    d.beforeClosed().subscribe(result => {
      this.buscarPessoas();
    });
    
  }

  formatacaoData(value: string) {
    var datePipe = new DatePipe("en-US");
     value = datePipe.transform(value, 'dd/MM/yyyy');
     return value;
 }

  baixarConta(enterAnimationDuration: string, exitAnimationDuration: string){
    let d = this.dialog.open(BaixarContaComponent, {
      width: '450px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { conta: this.contas, tipo: this.tableFinanceiro.tipo }
    });
    d.beforeClosed().subscribe(result => {
      if (this.tableFinanceiro.tipo == 'CR'){
        this.popularGrid('cr');
      }
      else {
        this.popularGrid('cp');
      }
    });
 }

 estornarConta(){
  if (this.tableFinanceiro.tipo == 'CR'){
    this.http.put<Retorno>('https://localhost:44356/Alteracao/EstornaBaixarContaReceber', this.contas)
      .subscribe(resultado => {
        if (resultado.ok){
          this.mensagem("Estorno realizado com sucesso!", "success");
          this.limparEdicaoInclusao();
          this.popularGrid("cr");
         }
         else {
          this.mensagem(resultado.msgerro, "danger");
         }
      }); 
}
else {
  this.http.put<Retorno>('https://localhost:44356/Alteracao/EstornaBaixarContaPagar', this.contas)
      .subscribe(resultado => {
        if (resultado.ok){
          this.mensagem("Estorno realizado com sucesso!", "success");
          this.limparEdicaoInclusao();
          this.popularGrid("cp");
         }
         else {
          this.mensagem(resultado.msgerro, "danger");
         }
      });
}
 }

}
