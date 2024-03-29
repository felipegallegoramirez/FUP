import { Component, OnInit } from '@angular/core';

import { Distributor } from 'src/app/models/modelsDistributor/distributor';
import { DistributorService } from 'src/app/services/servicesDistributor/distributor.service';

import { DistributorHistory } from 'src/app/models/modelsDistributor/distributorhistory';
import { DistributorHistoryService } from 'src/app/services/servicesDistributor/distributorhistory.service';

import { Inventory } from 'src/app/models/modelsProducts/inventory';
import { InventoryService } from 'src/app/services/servicesProducts/inventory.service';

import { ProductCategoryService } from 'src/app/services/servicesProducts/productcategory.service';
import { ProductCategory } from 'src/app/models/modelsProducts/productcategory';




@Component({
  selector: 'app-distributor-managment',
  templateUrl: './distributor-managment.component.html',
  styleUrls: ['./distributor-managment.component.css'],
})
export class DistributorManagmentComponent implements OnInit {
  constructor(
    private distributorService:DistributorService,
    private inventoryService:InventoryService,
    private productCategoryService:ProductCategoryService,
    private distributorHistoryService:DistributorHistoryService
  ) {}

  ngOnInit(): void {
    this.search()
    this.getProducts()

  }

  // ! ----------- Paneles -----------

  edit:boolean=false;
  update:number=0;

  editar() {
    this.edit = this.edit == true ? false : true;
  }

  rara(op: number) {
    let a =
      document.querySelector('.inf')?.children[0].children[op * 2].children[0]
        .children[0];
    if (a?.classList.contains('noocult')) {
      a.classList.remove('noocult');
    } else {
      a?.classList.add('noocult');
    }
  }

  add_view() {
    this.clear()
    this.update=1
    let background = document.getElementById('background_panel');
    let panel = document.getElementById('panel');
    background?.classList.remove('oculto');
    panel?.classList.remove('oculto');
  }

  close() {
    let background = document.getElementById('background_panel');
    let panel = document.getElementById('panel');
    background?.classList.add('oculto');
    panel?.classList.add('oculto');
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

  // ! ----------- Provedores -----------

  distributors:Array<Distributor> = []

  search(){

    let order= (<HTMLInputElement>document.getElementById("order")).value
    let search= (<HTMLInputElement>document.getElementById("search")).value
    let or=order.split("/")
    this.distributors=[]

    this.distributorService.getDistributorSearch(search,1,1000,or[0],Number(or[1]),localStorage.getItem("shop")||"").subscribe((res)=>{
      this.distributors = res as Distributor[]
    })
  }

  clear(){
    this.acta=[];
    this.total=0;
    (<HTMLInputElement>document.getElementById("name_distributor")).value="";
    (<HTMLInputElement>document.getElementById("dni_distributor")).value="";
    (<HTMLInputElement>document.getElementById("phone_distributor")).value="";
    (<HTMLInputElement>document.getElementById("address_distributor")).value="";
  }

  create(){
    const name= (<HTMLInputElement>document.getElementById("name_distributor")).value||""
    const dni= (<HTMLInputElement>document.getElementById("dni_distributor")).value||""
    const phone= (<HTMLInputElement>document.getElementById("phone_distributor")).value||""
    const address= (<HTMLInputElement>document.getElementById("address_distributor")).value||""
    let lastdate="none"
    let nextdate="none"
  

    const classcant=document.getElementsByClassName("product_unit")
    const classprice=document.getElementsByClassName("product_price")
    const classproduct=document.getElementsByClassName("product_distributor")
    const classcate=document.getElementsByClassName("cate")


    let distributor:Distributor=new Distributor("",[],this.total,name,dni,Number(phone),address,lastdate,nextdate,localStorage.getItem("shop")||"")

    for(let i=0;i<this.acta.length;i++){
      let id=(<HTMLInputElement> classproduct[i]).value||""
      let code= this.inventorys.find(x=>x._id==id)?.code||""
      let count= Number((<HTMLInputElement> classcant[i]).value)||0
      let price= Number((<HTMLInputElement> classprice[i]).value)||0
      let category= (<HTMLInputElement> classcate[i]).value||""
      let totalprice=Number(price)*Number(count)
      distributor.product?.push({
        id,
        code,
        count,
        category,
        price,
        totalprice
      })
    }
    delete distributor._id

    if(this.verifyDistributor(name,dni,phone,address)){
      this.distributorService.postDistributor(distributor,localStorage.getItem("shop")||"").subscribe(res=>{
        this.distributors.push(distributor)
        this.clear()
        alert('Provedor Creado')
      })
    }
  }

  verifyDistributor(name: string,dni: string,phone: string,address: string): boolean {
    if (!this.verify('Nombre', name, 2, 100, 'string')) {return false;}
    if (!this.verify('Identificacion', dni, 2, 100, 'string')){return false;}
    if (!this.verify('Celular', phone, 2, 100, 'string')){return false;}
    if (!this.verify('Direccion', address, 2, 100, 'string')) {return false;}
    return true;
  }

  delete(id:any){
    this.distributorService.deleteDistributor(id,localStorage.getItem("shop")||"").subscribe(res=>{
      this.search()
      alert('Distribuidor eliminado')
    })
  }

  editDistributor(id:any){
    this.add_view()
    this.refill(id)
    this.update=1

  }

  actual:string=""
  lastdate:string=""
  nextdate:string=""

  refill(id:string){
    let select= this.distributors.find(x=>x._id==id)
    this.actual=id
    this.lastdate=select?.lastdate||""
    this.nextdate=select?.nextdate||""
    if(select){
      this.acta=[];
      this.total=select.total||0;
      (<HTMLInputElement>document.getElementById("name_distributor")).value=select.name||"";
      (<HTMLInputElement>document.getElementById("dni_distributor")).value=select.dni||"";
      (<HTMLInputElement>document.getElementById("phone_distributor")).value=select.phone+""||"";
      (<HTMLInputElement>document.getElementById("address_distributor")).value=select.address||"";
      let co=select.product?.length||0
      for(let i=0;i<co;i++){
        if (select.product && select.product[i]) {
          this.acta.push(select.product[i].category)
        }
      }
      setTimeout(function() {
        if (select) {
          const classcant = document.getElementsByClassName('product_unit');
          const classprice = document.getElementsByClassName('product_price');
          const clasproduct = document.getElementsByClassName('product_distributor');
          const classcate=document.getElementsByClassName("cate")
          for (let i = 0; i < co; i++) {
            if (select.product && select.product[i]) {
              (<HTMLInputElement>clasproduct[i]).value =
                select.product[i].id || '';
              (<HTMLInputElement>classcate[i]).value =
                select.product[i].category || '';
              (<HTMLInputElement>classcant[i]).value =
                select.product[i].count+"" || '';
              (<HTMLInputElement>classprice[i]).value =
                select.product[i].price+"" || '';
            }
          }
        }
    },1)
    
    }

  }

  editdistributor(){
    let select= this.distributors.find(x=>x._id==this.actual)
    const name= (<HTMLInputElement>document.getElementById("name_distributor")).value||""
    const dni= (<HTMLInputElement>document.getElementById("dni_distributor")).value||""
    const phone= (<HTMLInputElement>document.getElementById("phone_distributor")).value||""
    const address= (<HTMLInputElement>document.getElementById("address_distributor")).value||""
    let lastdate=select?.lastdate
    let nextdate=select?.nextdate
  

    const classcant=document.getElementsByClassName("product_unit")
    const classprice=document.getElementsByClassName("product_price")
    const classproduct=document.getElementsByClassName("product_distributor")
    const classcate=document.getElementsByClassName("cate")


    let distributor:Distributor=new Distributor(this.actual,[],this.total,name,dni,Number(phone),address,lastdate,nextdate,localStorage.getItem("shop")||"")

    for(let i=0;i<this.acta.length;i++){
      let id=(<HTMLInputElement> classproduct[i]).value||""
      let code= this.inventorys.find(x=>x._id==id)?.code||""
      let count= Number((<HTMLInputElement> classcant[i]).value)||0
      let price= Number((<HTMLInputElement> classprice[i]).value)||0
      let category= (<HTMLInputElement> classcate[i]).value||""
      let totalprice=Number(price)*Number(count)
      distributor.product?.push({
        id,
        code,
        count,
        category,
        price,
        totalprice
      })
    }

    if(this.verifyDistributor(name,dni,phone,address)){
      this.distributorService.putDistributor(distributor,this.actual,localStorage.getItem("shop")||"").subscribe(res=>{
        this.clear()
        this.close()
        alert('Distribuidor Actualizado')
      })
    }


  }




  //! ----------- Productos -----------

  inventorys:Array<Inventory>=[]
  cart:Array<Inventory>=[]

  category:Array<any>=[]

  getProducts(){
      this.inventoryService.getInventorysOnline(localStorage.getItem("shop")||"").subscribe((res) =>{
        this.inventorys = res as Inventory[]
        this.getcategory()
      })
  }

  getcategory(){
    this.category=[]
    this.productCategoryService.getProductCategorys().subscribe((res) =>{
      let data = res as ProductCategory[]
      
      for (let i=0; i< data.length ;i++){
        this.category.push({
          id:data[i]._id||"",
          name:data[i].name||"",
        })
      }
    })
  }

  products:Array<Array<Inventory>> =[]

  acta:Array<string> =[]

  add(){
    this.sum()
    let cate= this.category[0].id
    this.acta.push(cate)
    //this.products.push(this.inventorys.filter(x=>x.category==cate))

  }

  change(i:number){
    this.sum()
    let cate= (<HTMLSelectElement> document.getElementsByClassName("cate")[i]).value||""
    //this.products[i]=this.inventorys.filter(x=>x.category==cate.value)
    this.acta[i]=cate
    let x = this.acta
    setTimeout(function() {
      let xd= document.getElementsByClassName("cate");
      (<HTMLSelectElement>xd[i]).value = x[i];
      (<HTMLSelectElement>xd[i+1]).value = x[i+1];
    },1)

  }

  remove(i:number){
    this.acta.splice(i, 1);
    this.sum()
  }

  total:number=0


  // ! Extremadamente Ineficiente
  sum(){
    this.total=0;
    for(let i=0;i<this.acta.length;i++){
      let cant= (<HTMLInputElement> document.getElementsByClassName("product_unit")[i]).value||0
      let price= (<HTMLInputElement> document.getElementsByClassName("product_price")[i]).value||0
      this.total+=Number(price)*Number(cant) 
    }
  }


  // !history

  preHistory(id:any){
    this.add_view()
    this.refill(id)
    this.update=2
  }

  history(){
    let select = this.distributors.find((x) => x._id == this.actual) as Distributor; 
    // * Fecha
    var fechaActual = new Date();
    var año = fechaActual.getFullYear();
    var mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    var día = fechaActual.getDate().toString().padStart(2, '0');
    var fecha = año + '/' + mes + '/' + día;

    const classcant=document.getElementsByClassName("product_unit")
    const classprice=document.getElementsByClassName("product_price")
    const classproduct=document.getElementsByClassName("product_distributor")
    const classcate=document.getElementsByClassName("cate")

    let product:Array<any>=[]

    for(let i=0;i<this.acta.length;i++){
      let id=(<HTMLInputElement> classproduct[i]).value||""
      let code= this.inventorys.find(x=>x._id==id)?.code||""
      let count= Number((<HTMLInputElement> classcant[i]).value)||0
      let price= Number((<HTMLInputElement> classprice[i]).value)||0
      let category= (<HTMLInputElement> classcate[i]).value||""
      let totalprice=Number(price)*Number(count)
      product.push({
        id,
        code,
        count,
        category,
        price,
        totalprice
      })
    }

    let distributorhistory= new DistributorHistory("",product,select?.total,select?.name,select?._id,select?.phone,select?.address,fecha,select?.shopid)

    delete distributorhistory._id




    console.log(select)

    this.distributorHistoryService.postDistributorHistory(distributorhistory,select?.shopid||"").subscribe(res=>{
      this.clear()
      this.close()
      if(select){
        select.lastdate=fecha
        let selecpro= select.product?.map(objeto => {
          const r ={
            id:objeto.id,
            code:objeto.code,
            count:objeto.count,
            category:objeto.category,
            price:objeto.price,
            totalprice:objeto.totalprice
          };
          return r;
      });
        let distributor= new Distributor(select._id,selecpro,select.total,select.name,select.dni,select.phone,select.address,select.lastdate,select.nextdate,select.shopid)
        this.distributorService.putDistributor(distributor,this.actual,select?.shopid||"").subscribe(res=>{
          alert('Inventario Actualizado')
        })
      }

    })
  }

}
