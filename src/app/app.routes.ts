import { Routes } from '@angular/router';
import { UserComponent } from './user/user-component/user.component';
import { CardComponent } from './card/card-component/card.component';
import { AuthGuard } from './auth.guard';
import { TagComponent } from './tag/tag-component/tag/tag.component';

export const routes: Routes = [
    {path: 'login', component: UserComponent},
    {path: 'cards/:tagId', component: CardComponent, canActivate: [AuthGuard]},
    {path: 'tags', component: TagComponent, canActivate: [AuthGuard]},
    {path: '', redirectTo: '/login', pathMatch: 'full'}
];
