'use strict';

var Info = require('./info.model');



var handleError = function (res, err) {
  return res.send(500, err);
};


exports.update = function (req, res) {
  var id = req.params.id,
      role = req.user.role;
  var info = _.pick(req.body,'name','tel');
  if(role){
    if(!id){return res.json(400,'缺少更新参数:id!');}
  }else{
    id=req.user._info;
  }
  Info.findById(id,function (err, info){
    if(err){return handleError(res,err);}
    if(!info){return res.json(404,'找不到info!');}
    info=_.assign(info,info);
    info.save(function (err, info){
      if(err){return handleError(res,err);}
      return res.json(200,{info:info});
    });
  });
};