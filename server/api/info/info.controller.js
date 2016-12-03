'use strict';

var Info = require('./info.model');
var _ = require('lodash');



var handleError = function (res, err) {
  return res.send(500, err);
};


exports.update = function (req, res) {
  var _id = req.body._id,
      role = req.user.role;
  var body = _.pick(req.body,'name','tel');
  if(role){
    if(!_id){return res.json(400,'缺少更新参数:_id!');}
  }else{
    _id=req.user._info._id;
  }
  Info.findById(_id,function (err, info){
    if(err){return handleError(res,err);}
    if(!info){return res.json(404,'找不到info!');}
    info=_.assign(info,body);
    info.save(function (err, info){
      if(err){return handleError(res,err);}
      return res.json(200,{info:info});
    });
  });
};