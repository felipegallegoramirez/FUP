import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Inventory } from 'src/app/models/modelsProducts/inventory';
import { OnlineSale } from 'src/app/models/online-sale';

import { OnlineSalesService } from 'src/app/services/online-sale.service';
import { ShopService } from 'src/app/services/shop.service';


@Component({
  selector: 'app-simple-shop-cart-checkout',
  templateUrl: './simple-shop-cart-checkout.component.html',
  styleUrls: ['./simple-shop-cart-checkout.component.css']
})
export class SimpleShopCartCheckoutComponent implements OnInit {

  constructor(private activatedRoute:ActivatedRoute,
    private onlineSalesService:OnlineSalesService,
    private shopService:ShopService
    ) {}
   id:string=""

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => { 
      this.id= params['id'];
    })

  }
  act:number=-1;

  subMenu(menu:number){
    const buttons=document.getElementsByClassName("option")
    const subMenu=document.getElementsByClassName("form")
    for(let i=0;i<2;i++){
      buttons[i].classList.remove("select")
      subMenu[i].classList.add("oculto")
    }
    if(this.act!=menu){
      buttons[menu].classList.add("select")
      subMenu[menu].classList.remove("oculto")
      this.act=menu
    }else{
      this.act=-1
    }
  }

  verify(name: string,value: string,min: number,max: number,type: string): boolean {

    if (value) {
      if (type == 'string') {
        let size = value.length;
        if (size < min) {
          alert(`${name} debe contener almenos ${min} caracteres`);
          return false;
        } else if (size > max) {
          alert(`${name} debe NO puede tener ${max} caracteres`);
          return false;
        } else {
          return true;
        }
      } else if (type == 'number') {
        let number = Number(value);

        if (number < min) {
          alert(`${name} debe ser mayor a ${min}`);
          return false;
        } else if (number > max) {
          alert(`${name} debe ser menor a ${max}`);
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      alert(`${name} No puede estar vacio`);
      return false;
    }
  }

  verifyDistributor(name: string,dni: string,phone: string,address: string,email:string): boolean {
    if (!this.verify('Nombre', name, 2, 100, 'string')) {return false;}
    if (!this.verify('Identificacion', dni, 2, 100, 'string')){return false;}
    if (!this.verify('Email', email, 2, 100, 'string')){return false;}
    if (!this.verify('Celular', phone, 2, 100, 'string')){return false;}
    if (!this.verify('Direccion', address, 2, 100, 'string')) {return false;}
    return true;
  }

  whatsapp(){
    let online:OnlineSale=new OnlineSale()
    let name = (<HTMLInputElement>document.getElementById("waName")).value||"";
    let dni = Number((<HTMLInputElement>document.getElementById("waDni")).value)||0;
    let number = (<HTMLInputElement>document.getElementById("waNumber")).value||"";
    let address = (<HTMLInputElement>document.getElementById("waAddres")).value||"";
    let email = (<HTMLInputElement>document.getElementById("waEmail")).value||"";

    online.client={
      id:"",
      dni,
      name,
      number,
      address,
      email
    }
    online.state="New"
    online.shopid=this.id

    // * Fecha
    var fechaActual = new Date();
    var año = fechaActual.getFullYear();
    var mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    var día = fechaActual.getDate().toString().padStart(2, '0');
    var fecha = año + "/" + mes + "/" + día;
    online.date=fecha

    online.option=1
    online.metod="Wa"
    var totalpoints = 0
    var totalprice = 0
    online.product=[]
    
    var items:Inventory[]=JSON.parse(localStorage.getItem("cart")||"")

    items.forEach(element => {
      totalpoints+=(element.count||0)*(element.points||0)
      totalprice+=(element.count||0)*(element.price||0)
      online.product?.push({
        id:element._id,
        count:element.count,
        name:element.productname,
        totalpoints:(element.count||0)*(element.points||0),
        totalprice:(element.count||0)*(element.price||0),
        unitarypoints:element.points,
        unitaryprice:element.price
      })
    });
    online.totalpoints=totalpoints
    online.totalprice=totalprice

    delete online._id

    console.log(online)
    if(this.verifyDistributor(name,dni+'',number,address,email)){
      this.onlineSalesService.postOnlineSale(online,this.id).subscribe(res=>{
        this.shopService.getShopWa(this.id).subscribe(asd=>{
          window.location.replace(`https://wa.me/57${asd.wa}?text=Hola,%20¿cómo%20estás%3F%20Mi%20Codigo%20es%20:%20`+res._id);
        })
      })
    }



  }

}
