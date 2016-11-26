/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Role = require('../api/role/role.model');
var Product = require('../api/product/product.model');

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    account: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});
Role.find({}).remove(function() {
  Role.create([{
  name:"特级代理",
  requireQuantity:300,
  primeCost:2600,
  level:1,
  createDate:new Date()
},{
  name:"一级代理",
  requireQuantity:50,
  primeCost:3000,
  level:2,
  createDate:new Date()
},{
  name:"二级代理",
  requireQuantity:20,
  primeCost:3400,
  level:3,
  createDate:new Date()
},{
  name:"三级代理",
  requireQuantity:10,
  primeCost:3800,
  level:4,
  createDate:new Date()
},{
  name:"加盟会员",
  requireQuantity:1,
  primeCost:8800,
  level:5,
  createDate:new Date()
}], function() {
      console.log('finished populating role');
    }
  );
});
// Product.find({}).remove(function() {
//   Product.create({
//     name:,
//     description:,
//     quantity:Number,
//     price:Number,
//     state:Number,//1.正常产品 2.按角色区分价格产品
//     prices:[{
//       _role:String,
//       price:Number
//     }],
//     image:String,
//     isActive:Boolean,
//     createDate:Date
//   }, function() {
//       console.log('finished populating poroduct');
//     }
//   );
// });