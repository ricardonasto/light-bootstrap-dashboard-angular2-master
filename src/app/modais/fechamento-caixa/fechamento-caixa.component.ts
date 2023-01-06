import { CaixaMovimentacaoFechamento } from './../../models/CaixaMovimentacaoFechamento';
import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

declare interface TableData {
  headerRow: string[];
  dataRows: CaixaMovimentacaoFechamento[];
}

declare interface data {
  data: Date
}

declare var $:any;

@Component({
  selector: 'app-fechamento-caixa',
  templateUrl: './fechamento-caixa.component.html',
  styleUrls: ['../caixa.component.scss']
})
export class FechamentoCaixaComponent implements OnInit {
  public tableMovimentacaoFechamento: TableData;
  meses = ['','jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  totalFechamento: number;

  constructor(private http : HttpClient,
              @Inject(MAT_DIALOG_DATA) public data: data,
              public dialogRef: MatDialogRef<FechamentoCaixaComponent>) { }

  ngOnInit(): void {
    this.tableMovimentacaoFechamento = {
      headerRow: [ ],
      dataRows: []
    };
    this.popularMovimentacoes();
  }

  popularMovimentacoes(){
    let dataCaixa = this.data.data.toString().substring(8,10) + '/' + this.meses[Number(this.data.data.toString().substring(5,7))] + '/' + this.data.data.toString().substring(0,4);
    this.http.get<CaixaMovimentacaoFechamento[]>('https://localhost:44356/Consulta/getDadosFechamento?data=' + dataCaixa)
            .subscribe(resultado => {
              let i: number = 0;
              let table : CaixaMovimentacaoFechamento[] = new Array(); 
              this.totalFechamento = 0;
              while (i < resultado.length){
                let linha : CaixaMovimentacaoFechamento = { pagamento: resultado[i].pagamento,
                                                            totalrecebido: resultado[i].totalrecebido,
                                                            totalpagamento: resultado[i].totalpagamento,
                                                            totalretirada: resultado[i].totalretirada
                }
                table.push(linha);
                this.totalFechamento = this.totalFechamento + Number(resultado[i].totalrecebido) - Number(resultado[i].totalpagamento) - Number(resultado[i].totalretirada);
                i = i + 1; 
              }

              this.tableMovimentacaoFechamento = {
                headerRow: [ 'Forma', 'Recebimento', 'Pagamento', 'Retirada'],
                dataRows: table
              };
            } );
  }

  fecharCaixa(){
    let dataCaixa = this.data.data.toString().substring(8,10) + '/' + this.meses[Number(this.data.data.toString().substring(5,7))] + '/' + this.data.data.toString().substring(0,4);
    this.http.put('https://localhost:44356/Alteracao/FecharCaixa?data=' + dataCaixa, null)
      .subscribe(resultado => {
          this.mensagem("Caixa fechado com sucesso!", "success");
          this.dialogRef.close();
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

Cancelar(){
  this.dialogRef.close();
}

}
