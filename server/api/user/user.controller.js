'use strict';

var User = require('./user.model');
var Role = require('../role/role.model');
var Info = require('../info/info.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(500, err.toString());
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  // var page = req.query.page || 1,
  //     itemsPerPage = req.query.itemsPerPage || 100,
  //     role=req.user.role;
  // var count;
  // if(role=='admin'){
  //   User.find({role:{$nin:['admin']}}).count(function (err, c) {
  //     if(err) return res.send(500, err);
  //     count=c;
  //     console.log(count);
  //   });

  //   User.find({role:{$nin:['admin']}}, '-salt -hashedPassword',{
  //     skip: (page - 1) * itemsPerPage,
  //     limit: itemsPerPage,
  //     populate:'_info _creator'
  //   })
  //   .exec(function (err, users) {
  //     if(err) return res.send(500, err);
  //     res.json(200, {
  //       users:users,
  //       count:count
  //     });
  //   });
  // }
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if (err){return validationError(err);}
    res.json(200, users);
  });
};

// 创建子管理账号
exports.createSubAdmin = function (req,res){
  var account = req.body.account,
      password = req.body.password,
      name = req.body.name;
  if(!account){
    return res.json(400,"缺少创建参数：account");
  }
  if(!password){
    return res.json(400,"缺少创建参数：password");
  }
  if(!name){
    return res.json(400,"缺少创建参数：name");
  }

  var subAdminObj = {
    account:account,
    password:password,
    name:name,
    role:"subAdmin",
    isDelete:false,
    createDate:new Date()
  };

  User.create(subAdminObj,function (err,user){
    if(err){
      return validationError(res,err);
    }
    res.json(200,{user:user});
    // var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    // res.json({ token: token });
  });
};


/**
 * User 的创建都为最低的会员
 */
exports.create = function (req, res) {
  var account = req.body.account,
      password = req.body.password,
      name = req.body.name,
      tel = req.body.tel;

  if(!account){
    return res.json(400,"缺少创建参数：account");
  }
  if(!password){
    return res.json(400,"缺少创建参数：password");
  }
  if(!name){
    return res.json(400,"缺少创建参数：name");
  }
  if(!tel){
    return res.json(400,"缺少创建参数：tel");
  }

  var infoObj = {
    name:name,
    tel:tel,
    saleIncome:0,
    income:0,
    orderQuantity:0,
    mainProducts:[],
    otherProducts:[],
    isDelete:false,
    createDate:new Date()
  };

  Role.findOne({level:5},function (err,role){
    if(err){
      return validationError(res,err);
    }
    if(!role){
      return res.json(404,"找不到对象：role");
    }
    infoObj._role=role.id;
    infoObj.level=role.level;
    Info.create(infoObj,function (err,info){
      if(err){
        return validationError(res,err);
      }
      var userObj = {
        account:account,
        provider:'local',
        password:password,
        _creator:req.user._info,
        _info:info._id,
        isDelete:false,
        createDate:new Date()
      }
      if(req.user.role == "subAdmin"){
        userObj.belong = req.user._id;
        delete userObj._creator;
      }else{
        userObj.belong = req.user.belong;
      }

      User.create(userObj,function (err,user){
        if(err){
          return validationError(res,err);
        }
        res.json(200,{user:user});
      });

    });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res) {
  var userId = req.params.id;

  User.findById(userId,'',{populate:'_info _create'},function (err, user) {
    if (err){return validationError(err);}
    if (!user) return res.json(404,'找不到user!');
    return res.json(200,{user:user});
  });
};

exports.update = function (req, res) {
  var userId = req.params.id,
      role = req.user.role;
  var info = _.pick(req.body,'name','tel');
  if(role){
    if(!userId){return res.json(400,'缺少更新参数:userId!');}
  }else{
    userId=req.user._id;
  }
  User.findById(userId,function (err, user){
    if(err){return validationError(res,err);}
    if(!user){return res.json(404,'找不到user!');}
    user._info=_assign(user._info,info);
    user.save(function (err, user){
      if(err){return validationError(res,err);}
      return res.json(200,{user:user});
    });
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err){return validationError(err);}
    user.isDelete=true;
    user.save(function (err, user){
      if (err){return validationError(err);}
      return res.json(200,'删除成功!');
    });
  });
};

exports.destroyAll = function(req, res) {
  var userIds=req.body.userIds;
  _.each(userIds,function (id){
    User.findById(id, function(err, user) {
      if (err){return validationError(err);}
      user.isDelete=true;
      user.save();
    });
  });
  return res.json(200,'删除成功!');
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {

    // admin,subAdmin修改
    if(req.user.role){
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.json(200,{user:user});
      });
    }else{
      // 通过旧密码修改
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        user.save(function(err) {
          if (err) return validationError(res, err);
          res.json(200,{user:user});
        });
      } else {
        res.json(403,"没有操作权限");
      }
    }

  });
};

/**
 * Get my info
 */
exports.me = function(req, res) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res) {
  res.redirect('/');
};
