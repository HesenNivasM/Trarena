import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';
import { AppMaterialModule } from './app-material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SellComponent } from './components/sell/sell.component';
import { SellAllComponent } from './components/sell-all/sell-all.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommodityCardComponent } from './components/commodity-card/commodity-card.component';
import { BuyAllComponent } from './components/buy-all/buy-all.component';
import { CartComponent } from './components/cart/cart.component';
import { AuctionComponent } from './components/auction/auction.component';
import { BidComponent } from './components/bid/bid.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    SellComponent,
    SellAllComponent,
    CommodityCardComponent,
    BuyAllComponent,
    CartComponent,
    AuctionComponent,
    BidComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FileUploadModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
