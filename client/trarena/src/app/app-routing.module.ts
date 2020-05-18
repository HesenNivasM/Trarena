import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { SellComponent } from './components/sell/sell.component';
import { SellAllComponent } from './components/sell-all/sell-all.component';
import { BuyAllComponent } from './components/buy-all/buy-all.component';
import { CartComponent } from './components/cart/cart.component';
import { AuctionComponent } from './components/auction/auction.component';
import { BidComponent } from './components/bid/bid.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'sell', component: SellComponent },
    { path: 'sell/all', component: SellAllComponent },
    { path: 'buy/all', component: BuyAllComponent },
    { path: 'cart', component: CartComponent },
    { path: 'auction', component: AuctionComponent },
    { path: 'bid', component: BidComponent },
    { path: '', component: HomeComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
