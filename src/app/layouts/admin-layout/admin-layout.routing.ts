import { VendasComponent } from './../../vendas/vendas.component';
import { CaixaComponent } from './../../caixa/caixa.component';
import { FinanceiroComponent } from './../../financeiro/financeiro.component';
import { ReceitaComponent } from './../../receita/receita.component';
import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import { CadastrosComponent } from '../../cadastro/cadastros.component';
import { TablesComponent } from '../../tables/tables.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: HomeComponent },
    { path: 'cadastros',      component: CadastrosComponent },
    { path: 'table',          component: TablesComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'receita/:id',    component: ReceitaComponent},
    { path: 'financeiro',     component: FinanceiroComponent},
    { path: 'caixa',          component: CaixaComponent},
    { path: 'vendas',         component: VendasComponent}
];
