import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailCompareComponent } from './detail-compare/detail-compare.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'detail', component: DetailCompareComponent },
  { path: '**', redirectTo: '' }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
