import { Receita } from './../models/Receita';
import { ProdutoFinal } from './../models/ProdutoFinal';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MateriaPrima } from 'app/models/MateriaPrima';

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}
declare var $:any;

@Component({
  selector: 'app-receita',
  templateUrl: './receita.component.html',
  styleUrls: ['./receita.component.scss']
})
export class ReceitaComponent implements OnInit {
  public tableReceita: TableData;
  classEditar = {};
  id: number;
  private sub: any;
  produto: string;
  produtoFinal: ProdutoFinal;
  receita: Receita[];
  novoItem = false;
  receitaNovo: Receita;
  produtos = [ ];
  Incluir = false;

  constructor(private route: ActivatedRoute, private http : HttpClient) { 
    this.classEditar = {'col-md-12' : true, 'col-md-8' : false};
    this.novoItem = false;
    this.receitaNovo = new Receita();
    this.Incluir = false;
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; 
   });

    this.tableReceita = {
      headerRow: [ ],
      dataRows: [ ]
    };

    this.buscarProdutoFinal();
  }

  buscarProdutoFinal(){
    this.http.get<ProdutoFinal>('https://localhost:44356/Consulta/ProdutoFinalId?id=' + this.id)
            .subscribe(resultado => {
              this.produto = resultado.id + ' - ' + resultado.descricao;
              this.produtoFinal = resultado;
              this.buscarReceita();
            } );
  }

  buscarReceita(){
    this.http.get<Receita[]>('https://localhost:44356/Consulta/Receita?idProduto=' + this.produtoFinal.id)
            .subscribe(resultado => {
              this.classEditar = {'col-md-12' : true, 'col-md-8' : false};
              this.novoItem = false;
              this.Incluir = false;
              this.receita = resultado;
               let table : string[][] = new Array();
               let i: number = 0; 

                while (i < resultado.length){
                  let array : string[] = new Array();
                  array.push(resultado[i].id.toString());
                  array.push(resultado[i].materiaprima.descricao);
                  array.push(resultado[i].percentualutilizado.toString());
                  table.push(array);
                  i = i + 1; 
                }

                 this.tableReceita = {
                   headerRow: [ 'ID', 'Materia Prima', 'Percentual'],
                   dataRows: table
                 };
            } );
  }

  novaReceita(){
    this.receitaNovo = new Receita();
    this.classEditar = {'col-md-12' : false, 'col-md-8' : true};
    this.novoItem = true
    this.Incluir = true;
    this.buscarMateriaPrima();
  }

  salvarItem(){
    console.log(this.receitaNovo.materiaprimaid);
    let caminho = 'https://localhost:44356/Cadastro/Receita';
    caminho = caminho + '?idProdutoFinal=' + this.id;
    caminho = caminho + '&idMateriaPrima=' + this.receitaNovo.materiaprimaid;
    caminho = caminho + '&percentual=' + this.receitaNovo.percentualutilizado;
    this.http.put(caminho, '')
    .subscribe(resultado => {
       this.mensagem("Item da receita inserida com sucesso!", "success");
       this.limparEdicaoInclusao();
       this.buscarReceita();
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

  buscarMateriaPrima(){
    this.http.get<MateriaPrima[]>('https://localhost:44356/Consulta/MateiraPrima')
            .subscribe(resultado => {
              let i: number = 0;
              let table : string[][] = new Array(); 
              this.produtos = [];

               while (i < resultado.length){
                 this.produtos.push({ id: resultado[i].id, descricao: resultado[i].descricao });
                 i = i + 1; 
               }
            } );
  }

  cancelarEdicao(){
    this.limparEdicaoInclusao();
  }

  limparEdicaoInclusao(){
    this.novoItem = false;
    this.Incluir = false;
    this.classEditar = {'col-md-12' : true, 'col-md-8' : false};
  }

  detalhes(dados){
    this.novoItem = true;
    this.Incluir = false;
    this.classEditar = {'col-md-12' : false, 'col-md-8' : true};
    this.buscarMateriaPrima();
    if (dados != null) {
      this.receitaNovo.id = dados[0];
      this.receitaNovo.materaiprimadesc = dados[1];
      this.receitaNovo.percentualutilizado = dados[2];
      }
  }

  excluirItemReceita(){
    console.log(this.receitaNovo);
    this.http.delete('https://localhost:44356/Exclusao/Receita?id='+ this.receitaNovo.id)
      .subscribe(resultado => {
          this.mensagem("Exclusão realizada com sucesso!", "success");
          this.limparEdicaoInclusao();
          this.buscarReceita();
      });
  }

}
