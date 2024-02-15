import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './components/about/about.component';
import { IdeasComponent } from './components/ideas/ideas.component';
import { TimerComponent } from './components/timer/timer.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'ideas', component: IdeasComponent },
  { path: 'timer', component: TimerComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
