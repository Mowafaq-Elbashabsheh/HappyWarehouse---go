import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { authGuard } from './auth/auth-guard';
import { WarehouseComponent } from './pages/warehouse/warehouse.component';
import { ItemsComponent } from './pages/items/items.component';
import { UsersComponent } from './pages/users/users.component';
import { adminGuard } from './auth/admin-guard';
import { LogsComponent } from './pages/logs/logs.component';
import { LivechatComponent } from './pages/livechat/livechat.component';
import { ChatgroupsComponent } from './pages/chatgroups/chatgroups.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'login', pathMatch: 'full'
    },
    {
        path: 'login', 
        component: LoginComponent
    },
    {
        path: '', 
        component: LayoutComponent,
        children: [
            {
                path: 'welcome',
                component: WelcomeComponent,
                canActivate: [authGuard]
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [authGuard]
            },
            {
                path: 'warehouse',
                component: WarehouseComponent,
                canActivate: [authGuard]
            },
            {
                path: 'items/:id',
                component: ItemsComponent,
                canActivate: [authGuard]
            },
            {
                path: 'users',
                component: UsersComponent,
                canActivate: [authGuard]
            },
            {
                path: 'logs',
                component: LogsComponent,
                canActivate: [authGuard, adminGuard]
            },
            {
                path: 'livechat',
                component: LivechatComponent,
                canActivate: [authGuard, adminGuard]
            },
            {
                path: 'chatgroups',
                component: ChatgroupsComponent,
                canActivate: [authGuard, adminGuard]
            }
        ]
    }
];
