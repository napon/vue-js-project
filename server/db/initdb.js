db.products.drop();
db.orders.drop();
db.users.drop();
db.runCommand({
  insert: 'products',
  documents: [
    {
      "name" : "KeyboardCombo",
      "price": 28,
      "quantity": 0,
      "category": "Tech",
      "url": "../server/public/images/KeyboardCombo.png"
    },
    {
      "name": "Mice",
      "price": 5,
      "quantity": 9,
      "category": "Tech",
      "url": "../server/public/images/Mice.png"
    },
    {
      "name": "PC1",
      "price": 317,
      "quantity": 1,
      "category": "Tech",
      "url": "../server/public/images/PC1.png"
    },
    {
      "name": "PC2",
      "price": 396,
      "quantity": 1,
      "category": "Tech",
      "url": "../server/public/images/PC2.png"
    },
    {
      "name": "PC3",
      "price": 332,
      "quantity": 5,
      "category": "Tech",
      "url": "../server/public/images/PC3.png"
    },
    {
      "name": "Tent",
      "price": 31,
      "quantity": 2,
      "category": "Gifts",
      "url": "../server/public/images/Tent.png"
    },
    {
      "name": "Box1",
      "price": 7,
      "quantity": 7,
      "category": "Supplies",
      "url": "../server/public/images/Box1.png"
    },
    {
      "name": "Box2",
      "price": 7,
      "quantity": 10,
      "category": "Supplies",
      "url": "../server/public/images/Box2.png"
    },
    {
      "name": "Clothes1",
      "price": 22,
      "quantity": 5,
      "category": "Clothing",
      "url": "../server/public/images/Clothes1.png"
    },
    {
      "name": "Clothes2",
      "price": 30,
      "quantity": 0,
      "category": "Clothing",
      "url": "../server/public/images/Clothes2.png"
    },
    {
      "name": "Jeans",
      "price": 30,
      "quantity": 10,
      "category": "Clothing",
      "url": "../server/public/images/Jeans.png"
    },
    {
      "name": "Keyboard",
      "price": 24,
      "quantity": 3,
      "category": "Tech",
      "url": "../server/public/images/Keyboard.png"
    }
  ]
});
db.runCommand({
  insert: 'orders',
  documents: [
    {
      // example
      "cart" : { "PC1" : 1 },
      "total" : 317, 
      "token" : "21232f297a57a5a743894a0e4a801fc3"
    }
  ]
});
db.runCommand({
  insert: 'users',
  documents: [
    {
      "token" : "21232f297a57a5a743894a0e4a801fc3" // user 'admin'
    },
    {
      "token" : "084e0343a0486ff05530df6c705c8bb4" // user 'guest'
    }
  ]
});
