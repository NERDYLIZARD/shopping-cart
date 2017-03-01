var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('localhost:27017/shopping');

var products = [
  new Product({
    imagePath: 'http://static.giantbomb.com/uploads/scale_small/12/128291/1837361-gothic__cdcovers_cc__front.jpg',
    title: 'Gothic Video Game',
    description: 'Awesome Game!!!!',
    price: 10
  }),
  new Product({
    imagePath: 'https://bnetproduct-a.akamaihd.net//dg/7364/751D461631E9293C9460EC52BE3A3736C9B89E61.jpg',
    title: 'World of Warcraft Video Game',
    description: 'Also awesome? But of course it was better in vanilla ...',
    price: 20
  }),
  new Product({
    imagePath: 'https://media.playstation.com/is/image/SCEA/call-of-duty-infinite-warfare-two-column-01-ps4-us-28jun16?$image_block_desktop$',
    title: 'Call of Duty Video Game',
    description: 'Meh ... nah, it\'s okay I guess',
    price: 40
  }),
  new Product({
    imagePath: 'http://forreadingaddicts.co.uk/wp-content/uploads/2016/09/minecraft.png',
    title: 'Minecraft Video Game',
    description: 'Now that is super awesome!',
    price: 15
  }),
  new Product({
    imagePath: 'https://d1r7xvmnymv7kg.cloudfront.net/sites_products/darksouls3/assets/img/DARKSOUL_facebook_mini.jpg',
    title: 'Dark Souls 3 Video Game',
    description: 'I died!',
    price: 50
  })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    done++;
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}