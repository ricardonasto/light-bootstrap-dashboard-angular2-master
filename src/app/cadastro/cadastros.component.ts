import { FormasPagamento } from './../models/FormasPagamento';
import { ProdutoFinal } from './../models/ProdutoFinal';
import { MateriaPrima } from './../models/MateriaPrima';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface TableData {
  tipo : string;
  headerRow: string[];
  dataRows: string[][];
}
declare var $:any;

@Component({
  selector: 'app-cadastros',
  templateUrl: './cadastros.component.html',
  styleUrls: ['./cadastros.component.css']
})

export class CadastrosComponent implements OnInit {
  public tableCadastro: TableData;
  classMP = {};
  classPF = {};
  classFP = {};
  classEditar = {};
  editandoMP = false;
  editandoPF = false;
  editandoFP = false;
  Incluir = false;
  novoOuEdicao : String;
  @Input() matPrima : MateriaPrima;
  @Input() prodFinal : ProdutoFinal;
  @Input() formPagto : FormasPagamento;
  router: Router;

  constructor(private http : HttpClient, router: Router) {
    this.classMP = {'btn-info' : false};
    this.classPF = {'btn-info' : false};
    this.classFP = {'btn-info' : false};
    this.classEditar = {'col-md-12' : true, 'col-md-8' : false};
    this.editandoMP = false;
    this.editandoPF = false;
    this.editandoFP = false;
    this.matPrima = new MateriaPrima();
    this.prodFinal = new ProdutoFinal();
    this.formPagto = new FormasPagamento();
    this.novoOuEdicao = '';
    this.Incluir = false;
    this.router = router;
   }

  ngOnInit() {
    this.tableCadastro = {
      tipo: '',
      headerRow: [ ],
      dataRows: [ ]
    };
  }

  popularGrid(tipo){
      this.classEditar = {'col-md-12' : true, 'col-md-8' : false};
      this.editandoMP = false;
      this.editandoPF = false;
      this.editandoFP = false;
      if (tipo == 'mp'){
        this.classMP = {'btn-info' : true};
        this.classPF = {'btn-info' : false};
        this.classFP = {'btn-info' : false};
        this.http.get<MateriaPrima[]>('https://localhost:44356/Consulta/MateiraPrima')
            .subscribe(resultado => {
              let i: number = 0;
              let table : string[][] = new Array(); 

               while (i < resultado.length){
                 let array : string[] = new Array();
                 array.push(resultado[i].id.toString());
                 array.push(resultado[i].descricao);
                 array.push(resultado[i].unidade);
                 array.push(resultado[i].valor);
                 table.push(array);
                 i = i + 1; 
               }

                this.tableCadastro = {
                  tipo: 'MP',
                  headerRow: [ 'ID', 'Descrição', 'Unidade', 'Custo'],
                  dataRows: table
                };
            } );
      }
      else if (tipo == 'pf'){
        this.classMP = {'btn-info' : false};
        this.classPF = {'btn-info' : true};
        this.classFP = {'btn-info' : false};
        this.http.get<ProdutoFinal[]>('https://localhost:44356/Consulta/ProdutoFinal')
            .subscribe(resultado => {
              let i: number = 0;
              let table : string[][] = new Array(); 

               while (i < resultado.length){
                 let array : string[] = new Array();
                 array.push(resultado[i].id.toString());
                 array.push(resultado[i].descricao);
                 array.push(resultado[i].valorcusto);
                 array.push(resultado[i].valorvenda);
                 table.push(array);
                 i = i + 1; 
               }

                this.tableCadastro = {
                  tipo: 'PF',
                  headerRow: [ 'ID', 'Descrição', 'Custo', 'Venda'],
                  dataRows: table
                };
            } );
      }
      else if (tipo == 'fp'){
        this.classMP = {'btn-info' : false};
        this.classPF = {'btn-info' : false};
        this.classFP = {'btn-info' : true};
        this.http.get<FormasPagamento[]>('https://localhost:44356/Consulta/FormasPagto')
          .subscribe(resultado => {
            let i: number = 0;
            let table : string[][] = new Array(); 

            while (i < resultado.length){
              let array : string[] = new Array();
              array.push(resultado[i].id.toString());
              array.push(resultado[i].descricao);
              table.push(array);
              i = i + 1; 
            }

              this.tableCadastro = {
                tipo: 'FP',
                headerRow: [ 'ID', 'Descrição'],
                dataRows: table
              };
          } );
      }
  }

  editar(dados){
    this.novoOuEdicao = 'Editar';
    this.Incluir = false;
    this.classEditar = {'col-md-12' : false, 'col-md-8' : true};
    if (this.tableCadastro.tipo == 'MP'){
      this.editandoMP = true;
      this.editandoPF = false;
      this.editandoFP = false;
      if (dados != null) {
        this.matPrima.id = dados[0];
        this.matPrima.descricao = dados[1];
        this.matPrima.unidade = dados[2];
        this.matPrima.valor = dados[3];
      }
    }
    else if (this.tableCadastro.tipo == 'PF'){
      this.editandoMP = false;
      this.editandoPF = true;
      this.editandoFP = false;
      if (dados != null) {
        this.prodFinal.id = dados[0];
        this.prodFinal.descricao = dados[1];
        this.prodFinal.valorcusto = dados[2];
        this.prodFinal.valorvenda = dados[3];
      }
    }
    else {
      this.editandoMP = false;
      this.editandoPF = false;
      this.editandoFP = true;
      if (dados != null) {
        this.formPagto.id = dados[0];
        this.formPagto.descricao = dados[1];
      }
    }
    
  }

  cancelarEdicao(){
    this.limparEdicaoInclusao();
  }

  novoItem(){
    this.matPrima = new MateriaPrima();
    this.prodFinal = new ProdutoFinal();
    this.formPagto = new FormasPagamento();
    this.editar(null);
    this.novoOuEdicao = 'Novo';
    this.Incluir = true;
  }

  salvarItemMP(){
    if (this.novoOuEdicao == 'Novo'){
       this.http.put('https://localhost:44356/Cadastro/MateriaPrima', this.matPrima)
       .subscribe(resultado => {
          this.mensagem("Matéria Prima inserida com sucesso!", "success");
          this.limparEdicaoInclusao();
          this.popularGrid("mp");
       });
    }
    else {
      this.http.put('https://localhost:44356/Alteracao/MateriaPrima', this.matPrima)
       .subscribe(resultado => {
          this.mensagem("Matéria Prima atualizada com sucesso!", "success");
          this.limparEdicaoInclusao();
          this.popularGrid("mp");
       });
    }
  }

  salvarItemPF(){
    if (this.novoOuEdicao == 'Novo'){
      this.http.put('https://localhost:44356/Cadastro/ProdutoFinal', this.prodFinal)
      .subscribe(resultado => {
         this.mensagem("Produto Final inserido com sucesso!", "success");
         this.limparEdicaoInclusao();
         this.popularGrid("pf");
      });
    }
    else {
      this.http.put('https://localhost:44356/Alteracao/ProdutoFinal', this.prodFinal)
      .subscribe(resultado => {
          this.mensagem("Produto Final atualizada com sucesso!", "success");
          this.limparEdicaoInclusao();
          this.popularGrid("pf");
      });
    }
  }

  salvarItemFP(){
    if (this.novoOuEdicao == 'Novo'){
      this.http.put('https://localhost:44356/Cadastro/FormasPagto', this.formPagto)
      .subscribe(resultado => {
         this.mensagem("Forma de Pagamento inserida com sucesso!", "success");
         this.limparEdicaoInclusao();
         this.popularGrid("fp");
      });
    }
    else {
      this.http.put('https://localhost:44356/Alteracao/FormasPagto', this.formPagto)
      .subscribe(resultado => {
          this.mensagem("Forma de Pagamento atualizada com sucesso!", "success");
          this.limparEdicaoInclusao();
          this.popularGrid("fp");
      });
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

  limparEdicaoInclusao(){
    this.editandoMP = false;
    this.editandoPF = false;
    this.editandoFP = false;
    this.classEditar = {'col-md-12' : true, 'col-md-8' : false};
  }

  excluirMP(){ 
    this.http.delete('https://localhost:44356/Exclusao/MateriaPrima?id='+ this.matPrima.id)
      .subscribe(resultado => {
          this.mensagem("Exclusão realizada com sucesso!", "success");
          this.limparEdicaoInclusao();
          this.popularGrid("mp");
      }); 
  }

  excluirPF(){
    this.http.delete('https://localhost:44356/Exclusao/ProdutoFinal?id=' + this.prodFinal.id)
      .subscribe(resultado => {
          this.mensagem("Exclusão realizada com sucesso!", "success");
          this.limparEdicaoInclusao();
          this.popularGrid("pf");
      });
  }

  excluirFP(){
    this.http.delete('https://localhost:44356/Exclusao/FormasPagto?id=' + this.formPagto.id)
      .subscribe(resultado => {
          this.mensagem("Exclusão realizada com sucesso!", "success");
          this.limparEdicaoInclusao();
          this.popularGrid("fp");
      });
  }

  novaReceita(){
    this.router.navigateByUrl('/receita/' + this.prodFinal.id);
  }
}

