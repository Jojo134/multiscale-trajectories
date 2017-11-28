import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClusterComponent } from './cluster/cluster.component';
import { CompareComponent } from './compare/compare.component';
import { DataResolver } from './shared/services/data.resolver';
const appRoutes: Routes = [
  { path: '', component: HomeComponent, resolve: { DataResolver } },

  { path: 'cluster', component: ClusterComponent, resolve: { DataResolver } },
  { path: 'compare', component: CompareComponent, resolve: { DataResolver } },
  { path: '**', redirectTo: '' }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
