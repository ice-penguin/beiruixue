'use strict';

var User = require('./user.model');
var Role = require('../role/role.model');
var Info = require('../info/info.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var validationError = function(res, err) {
  return res.json(500, err.toString());
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  var page = req.query.page || 1,
      itemsPerPage = req.query.itemsPerPage || 100,
      role=req.user.role,
      retrieval=req.query.retrieval,
      isDelete=req.query.isDelete;
  var count=0;
  var condition={isDelete:false};

  switch(role){
    case 'admin':
      if(isDelete=='true'){
        condition.isDelete=true;
      }
      condition=_.merge(condition,{role:{$ne:'admin'}});
      break;
    case 'subAdmin':
      condition=_.merge(condition,{belong:req.user._id});
      break;
    default:
      condition=_.merge(condition,{_creator:req.user._id});
  };

  var doQuery=function (){
    console.log(condition);
    User.find(condition).count(function (err, c) {
      if (err){return validationError(err);}
      count=c;
      console.log(count);
    });
    User.find(condition, '-salt -hashedPassword',{
      skip: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
      populate:'_info _creator'
    })
    .exec(function (err, users) {
      if (err){return validationError(err);}
      res.json(200, {
        users:users,
        count:count,
        page:page
      });
    });
  };

  if(retrieval){
    var infoIds=[];
    var condition2={name:{'$regex':'.*'+retrieval+'.*','$options':'i'}};
    Info.find(condition2,'_id',{},function (err, infos){
      if(err){return validationError(err);}
      _.each(infos,function (info){
        infoIds.push(info._id);
      });
      condition=_.merge(condition,{$or:[{_info:{$in:infoIds}},{account:{'$regex':'.*'+retrieval+'.*','$options':'i'}}]});
      doQuery();
    });
  }else{
    doQuery();
  }  
};

// 创建子管理账号
exports.createSubAdmin = function (req,res){
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

  var subAdminObj = {
    account:account,
    password:password,
    name:name,
    tel:tel,
    role:"subAdmin",
    isDelete:false,
    createDate:new Date()
  };

  console.log(subAdminObj);
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
        _creator:req.user._id,
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
    if (err){return validationError(res,err);}
    if (!user) return res.json(404,'找不到user!');
    return res.json(200,{user:user});
  });
};


/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err){return validationError(res,err);}
    user.isDelete=true;
    user.save(function (err, user){
      if (err){return validationError(res,err);}
      return res.json(200,'删除成功!');
    });
  });
};

exports.recovery = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err){return validationError(res,err);}
    user.isDelete=false;
    user.save(function (err, user){
      if (err){return validationError(res,err);}
      return res.json(200,'恢复成功!');
    });
  });
};

exports.destroyAll = function(req, res) {
  var userIds=req.body.userIds;
  console.log(userIds);
  _.each(userIds,function (id){
    User.findById(id, function(err, user) {
      if (err){return validationError(res,err);}
      user.isDelete=true;
      user.save();
    });
  });
  return res.json(200,'删除成功!');
};

exports.recoveryAll = function(req, res) {
  var userIds=req.body.userIds;
  _.each(userIds,function (id){
    User.findById(id, function(err, user) {
      if (err){return validationError(res,err);}
      user.isDelete=false;
      user.save();
    });
  });
  return res.json(200,'恢复成功!');
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res) {
  var userId = req.params.id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);
  console.log(userId,req.user._id);
  User.findById(userId, function (err, user) {
    if(err){return validationError(res,err);}
    if(!user){return res.json(404,'找不到user!');}

    if(userId == req.user._id.toString()){
      // 通过旧密码修改
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        user.save(function(err) {
          if (err) return validationError(res, err);
          res.json(200,{user:user});
        });
      } else {
        res.json(403,"原密码错误");
      }
    }else{
       // admin,subAdmin修改
      if(req.user.role){
        user.password = newPass;
        user.save(function(err) {
          if (err) return validationError(res, err);
          res.json(200,{user:user});
        });
      }else{
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
  }, '-salt -hashedPassword',{populate:'_info'}, function(err, user) { // don't ever give out the password or salt
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
