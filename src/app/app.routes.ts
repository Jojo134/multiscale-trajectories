import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClusterComponent } from './cluster/cluster.component';
import { CompareComponent } from './compare/compare.component';
const appRoutes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'cluster', component: ClusterComponent },
  { path: 'compare', component: CompareComponent },
  { path: '**', redirectTo: '' }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
