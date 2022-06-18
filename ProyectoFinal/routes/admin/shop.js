var express = require('express');
var router = express.Router();
var shopModel = require('../../models/shopModel');
var util = require('util');
var cloudinary = require('cloudinary').v2;

var uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

// Home page

router.get('/', async function (req, res, next) {

  var shop = await shopModel.getShop();


  shop = shop.map(shop => {
    if (shop.img_id) {
      const imagen = cloudinary.image(shop.img_id, {
        width: 100,
        height: 60,
        crop: 'fill'
      });
      return {
        ...shop,
        imagen
      }
    } else {
      return {
        ...shop,
        imagen: ''
      }
    }
  });


  res.render('admin/shop', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    shop
  });

});

// Eliminar un Producto
router.get('/eliminar/:id', async (req, res, next) => {
  var id = req.params.id;

  let shop = await shopModel.getShopById(id);
  if (shop.img_id) {
    await (destroy(shop.img_id));
  }

  await shopModel.deleteShopById(id);
  res.redirect('/admin/shop')
});

// Agregar novedades

router.get('/agregar', (req, res, next) => {
  res.render('admin/agregarShop', {
    layout: 'admin/layout'
  })
});
// imagen
router.post('/agregar', async (req, res, next) => {
  // console.log(req.body)
  try {

    var img_id = '';
    if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.imagen;
      img_id = (await uploader(imagen.tempFilePath)).
        public_id;
    }


    if (req.body.producto != "" && req.body.nombreProducto != "") {
      await shopModel.insertShop({
        ...req.body,
        img_id
      });
      res.redirect('/admin/shop')
    } else {
      res.render('admin/agregarShop', {
        layout: 'admin/layout',
        error: true,
        message: 'Todos los campos son requeridos'
      })
    }
  } catch (error) {
    // console.log(error)
    res.render('admin/agregarShop', {
      layout: 'admin/layout',
      error: true,
      message: 'No se cargo la novedad'
    })
  }
})
// modificacion y llamado de Selecion

router.get('/modificar/:id', async (req, res, next) => {
  var id = req.params.id;
  var shop = await shopModel.getShopById(id);
  res.render('admin/modificarShop', {
    layout: 'admin/layout',
    shop
  });
});

router.post('/modificar', async (req, res, next) => {
  try {

    let img_id = req.body.img_original;
    let borrar_img_vieja = false;

    if (req.body.img_delete === "1") {
      img_id = null;
      borrar_img_vieja = true;
    } else {
      if (req.files && Object.keys(req.files).length > 0) {
        imagen = req.files.imagen;
        img_id = (await uploader(imagen.tempFilePath)).public_id;
        borrar_img_vieja = true;
      }
    }
    if (borrar_img_vieja && req.body.img_original) {
      await (destroy(req.body.img_original));
    }

    var obj = {
      producto: req.body.producto,
      nombreProducto: req.body.nombreProducto,
      img_id
    }

    await shopModel.modificarShopByid(obj, req.body.id);
    res.redirect('/admin/shop');
  } catch (error) {
    // console.log(error)
    res.render('admin/modificarShop', {
      layout: 'admin/layout',
      error: true,
      message: 'No se modifico el producto'
    })
  }
});


module.exports = router;