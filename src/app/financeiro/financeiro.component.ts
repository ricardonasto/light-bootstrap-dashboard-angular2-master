import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Pessoa } from 'app/models/Pessoa';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Contas } from 'app/models/Contas';

declare interface TableData {
  tipo : string;
  headerRow: string[];
  dataRows: string[][];
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
  editandoNovaPessoa = false;
  Incluir = false;
  novoOuEdicao : String;
  pessoas = [];
  pessoaDesc: string;
  @Input() contas : Contas;

  constructor(private http : HttpClient, config: NgbModalConfig, private modalService: NgbModal) {
    this.contas = new Contas();
    this.contas.pessoa = new Pessoa();
    this.Incluir = false;
    config.backdrop = 'static';
		config.keyboard = false;
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
        this.editandoNovaPessoa = false;
        this.classEditar = {'col-md-12' : true, 'col-md-8' : false};
        this.http.get<Contas[]>('https://localhost:44356/Consulta/ContasReceber')
            .subscribe(resultado => {
              let i: number = 0;
              let table : string[][] = new Array(); 

               while (i < resultado.length){
                 let array : string[] = new Array();
                 array.push(resultado[i].id.toString());
                 array.push(resultado[i].pessoa.nome);
                 array.push(resultado[i].valor);
                 table.push(array);
                 i = i + 1; 
               }

                this.tableFinanceiro = {
                  tipo: 'CR',
                  headerRow: [ 'ID', 'Fornecedor', 'Custo'],
                  dataRows: table
                };
            } );
      }
      else if (tipo == 'cp'){
        this.classCR = {'btn-info' : false};
        this.classCP = {'btn-info' : true};
        this.editando = false;
        this.editandoNovaPessoa = false;
        this.classEditar = {'col-md-12' : true, 'col-md-8' : false};
        this.http.get<Contas[]>('https://localhost:44356/Consulta/ContasPagar')
            .subscribe(resultado => {
              let i: number = 0;
              let table : string[][] = new Array(); 

               while (i < resultado.length){
                 let array : string[] = new Array();
                 array.push(resultado[i].id.toString());
                 array.push(resultado[i].pessoa.nome);
                 array.push(resultado[i].valor);
                 table.push(array);
                 i = i + 1; 
               }

                this.tableFinanceiro = {
                  tipo: 'CP',
                  headerRow: [ 'ID', 'Fornecedor', 'Custo'],
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
      console.log(this.contas);
      this.http.put('https://localhost:44356/Cadastro/ContasPagar', this.contas)
      .subscribe(resultado => {
          this.mensagem("Contas a pagar inserida com sucesso!", "success");
          this.limparEdicaoInclusao();
          this.popularGrid("cp");
      });
    }
  }

  editar(dados){
    this.novoOuEdicao = 'Editar';
    this.Incluir = false;
    this.classEditar = {'col-md-12' : false, 'col-md-8' : true};
      this.editando = true;
      this.editandoNovaPessoa = false;
      if (dados != null) {
        this.contas.id = dados[0];
        this.contas.pessoa.nome = dados[1];
        this.contas.valor = dados[2];
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

  novaPessoa(){
    this.editandoNovaPessoa = true;
    this.editando = false;
  }

  salvarPessoa(){
    this.http.put('https://localhost:44356/Cadastro/Pessoa?pessoa=' + this.pessoaDesc, null)
       .subscribe(resultado => {
          this.mensagem("Pessoa inserida com sucesso!", "success");
          this.cancelarPessoa();
          this.buscarPessoas();
       });
  }

  cancelarPessoa(){
    this.editandoNovaPessoa = false;
    this.editando = true;
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

}
