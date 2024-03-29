const Joi = require('joi');

//! SubStructurs

const idclient = Joi.string();
const dniclient = Joi.number().integer().min(0).max(9999999999);
const nameclient = Joi.string().min(0).max(20);

const clientSchema = Joi.object({
  id: idclient.required(),
  dni: dniclient.required(),
  name: nameclient.required(),
});

const idemployee = Joi.any();
const dniemployee = Joi.any();
const nameemployee = Joi.any();

const employeeSchema = Joi.object({
  id: idemployee,
  dni: dniemployee,
  name: nameemployee,
});

const idservice = Joi.string();
const nameservice = Joi.string();
const dateservice = Joi.string();
const timeservice = Joi.string();
const priceservice = Joi.number().min(0).max(100000000000000);
const pointsservice = Joi.number().min(0).max(10000000);

const serviceSchema = Joi.object({
  id:idservice.required(),
  name: nameservice.required(),
  points: pointsservice.required(),
  price: priceservice.required(),
  time: timeservice.required(),
  data: dateservice.required(),
});


const idproduct = Joi.string();
const nameproduct = Joi.string();
const countproduct = Joi.number().min(0).max(10000000);
const priceproduct = Joi.number().min(0).max(100000000000000);
const pointsproduct = Joi.number().min(0).max(10000000);
const totalpriceproduct = Joi.number().min(0).max(100000000000000);
const totalpointsproduct = Joi.number().min(0).max(10000000);



const productSchema = Joi.object({
  id:idproduct.required(),
  name: nameproduct.required(),
  count: countproduct.required(),
  unitarypoints: pointsproduct.required(),
  totalpoints: totalpointsproduct.required(),
  unitaryprice: priceproduct.required(),
  totalprice: totalpriceproduct.required(),
});


const id = Joi.string();
const price = Joi.number().min(0).max(100000000000000);
const points = Joi.number().min(0).max(10000000);
const option = Joi.number().min(0).max(10);
const time = Joi.string();
const date = Joi.string();
const shopid = Joi.string();


const createSaleSchema = Joi.object({
  time: time.required(),
  client: clientSchema.required(),
  //employee: employeeSchema.required(),
  date: date.required(),
  product: Joi.array().items(productSchema),
  service: Joi.array().items(serviceSchema),
  totalprice: price.required(),
  totalpoints: points.required(),
  shopid: shopid.required(),
  option: option,

});

const updatesaleSchema = Joi.object({
  time: time,
  client: clientSchema,
  //employee: employeeSchema,
  date: date,
  product: Joi.array().items(productSchema),
  service: Joi.array().items(serviceSchema),
  totalprice: price,
  totalpoints: points,
  shopid: shopid,
});

const getsaleSchema = Joi.object({
  id: id.required(),
});

module.exports = { createSaleSchema, updatesaleSchema, getsaleSchema,  }
