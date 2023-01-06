import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

declare var $:any;

@Component({
  selector: 'app-nova-pessoa',
  templateUrl: './nova-pessoa.component.html',
  styleUrls: ['../caixa.component.scss']
})
export class NovaPessoaComponent implements OnInit {
  pessoaDesc: string;

  constructor(private http : HttpClient,
              public dialogRef: MatDialogRef<NovaPessoaComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  salvarPessoa(){
    this.http.put('https://localhost:44356/Cadastro/Pessoa?pessoa=' + this.pessoaDesc, null)
       .subscribe(resultado => {
          this.mensagem("Pessoa inserida com sucesso!", "success");
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

  onCancel(): void {
    this.dialogRef.close();
  }

}
