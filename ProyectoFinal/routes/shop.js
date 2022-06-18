var express = require('express');
var router = express.Router();
var shopModel = require('../models/shopModel');
var cloudinary = require('cloudinary').v2;

router.get('/', async function (req, res, next) {
  var shop = await shopModel.getShop()


  shop = shop.map(shop => {
    if (shop.img_id) {
      const imagen = cloudinary.url(shop.img_id, {
        width: 458,
        height: 340,
        crop: 'fill'
      });
      return {
        ...shop,
        imagen
      }
    } else {
      return {
        ...shop,
        imagen: '/images/noimage.jpg'
      }
    }
  });
  res.render('tienda/shop', {
    layout: 'tienda/layout',
    shop
  });
});








module.exports = router;