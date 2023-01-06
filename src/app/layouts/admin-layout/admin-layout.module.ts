import { VendasComponent } from './../../vendas/vendas.component';
import { RetiradaCaixaComponent } from 'app/modais/retirada-caixa/retirada-caixa.component';
import { BaixarContaComponent } from './../../modais/baixar-conta/baixar-conta.component';
import { AberturaCaixaComponent } from './../../modais/abertura-caixa/abertura-caixa.component';
import { NovaPessoaComponent } from './../../modais/nova-pessoa/nova-pessoa.component';

import { CaixaComponent } from './../../caixa/caixa.component';
import { FinanceiroComponent } from './../../financeiro/financeiro.component';
import { ReceitaComponent } from './../../receita/receita.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LbdModule } from '../../lbd/lbd.module';
import { NguiMapModule} from '@ngui/map';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { HomeComponent } from '../../home/home.component';
import { CadastrosComponent } from '../../cadastro/cadastros.component';
import { TablesComponent } from '../../tables/tables.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from '@angular/material/dialog';
import { MovimentosCaixaComponent } from 'app/modais/movimentos-caixa/movimentos-caixa.component';
import { FechamentoCaixaComponent } from 'app/modais/fechamento-caixa/fechamento-caixa.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    LbdModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=YOUR_KEY_HERE'}),
    NgbPaginationModule, 
    NgbAlertModule,
    MatDialogModule
  ],
  declarations: [
    HomeComponent,
    CadastrosComponent,
    TablesComponent,
    TypographyComponent,
    IconsComponent,
    NotificationsComponent,
    UpgradeComponent,
    ReceitaComponent,
    FinanceiroComponent,
    CaixaComponent,
    MapsComponent,
    NovaPessoaComponent,
    AberturaCaixaComponent,
    BaixarContaComponent,
    MovimentosCaixaComponent,
    FechamentoCaixaComponent,
    RetiradaCaixaComponent,
    VendasComponent
  ]
})

export class AdminLayoutModule {}
