/**
 * Created by Hoppies on 04-Mar-17.
 */

module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function(product) {
    var storedItem = this.items[product._id];
    if(!storedItem)
      storedItem = this.items[product._id] = {product: product, qty: 0, price: 0};
    storedItem.qty++;
    storedItem.price += product.price;

    this.totalQty++;
    this.totalPrice += product.price;
  }

  this.getItems = function () {
    var arr = [];
    for (var productId in this.items)
      arr.push(this.items[productId]);
    return arr;
  };

  
}