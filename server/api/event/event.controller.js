'use strict';

var Event = require('./event.model');
var Info = require('../info/info.model');
var Product = require('../product/product.model');
var Role = require('../role/role.model');
var User = require('../user/user.model');
var config = require('../../tool/config');
var _ = require('lodash');





var handleError= function (res, err) {
  return res.send(500, err);
};


var updateInPerson=function (condition){
	var inPerson=condition.inPerson,
		outPerson=condition.outPerson,
		product=condition.product,
		orderQuantity=condition.orderQuantity;
	var dealArr;
	var isUpdateRole=false;
	var isUpdateIncome=false;
	switch(product.state){
		case '1':
			dealArr=inPerson.otherProducts;
			break;
		case '2':
			isUpdateIncome=true;
			dealArr=inPerson.mainProducts;
			inPerson.orderQuantity+=orderQuantity;
			// 累计升级
			// if(inPerson.level==5&&orderQuantity>=10){
			// 	isUpdateRole=true;
			// }else if(inPerson.level>1 && inPerson.level<5){
			// 	isUpdateRole=true;
			// }
			// 一次性到升级
			if(inPerson.level>1 && inPerson.level<=5&&orderQuantity>=10){
				isUpdateRole=true;
			}
			break;
	}
	console.log(isUpdateIncome);
	var pr=_.find(dealArr,{name:product.name});
	if(pr){
		pr.orderQuantity+=orderQuantity;
		pr.lastQuantity+=orderQuantity;
	}else{
		var obj={
			_product:product._id,
			name:product.name,
			orderQuantity:orderQuantity,
			lastQuantity:orderQuantity
		};
		dealArr.push(obj);
	}
	if(isUpdateRole){
		Role.find({level:{$lt:inPerson.level}},function (err, roles){
			if(err){inPerson.save();return;}
			var maxQuantity=0;
			_.each(roles,function (role){
				// 累计升级
				// if(inPerson.orderQuantity>=role.requireQuantity && maxQuantity<role.requireQuantity){
				// 	maxQuantity=role.requireQuantity;
				// 	inPerson._role=role._id;
				// 	inPerson.level=role.level;
				// }
				// 一次性到升级
				if(orderQuantity>=role.requireQuantity && maxQuantity<role.requireQuantity){
					maxQuantity=role.requireQuantity;
					inPerson._role=role._id;
					inPerson.level=role.level;
				}
			});
			updateIncome(condition);
		});
	}else{
		if(isUpdateIncome){
			updateIncome(condition);
		}else{
			inPerson.save();
		}
	}
};

var updateIncome=function (condition){
	var inPerson=condition.inPerson,
		outPerson=condition.outPerson,
		orderQuantity=condition.orderQuantity;
	Role.findById(inPerson._role,function (err, inRole){
		if(err||!inRole){inPerson.save(); return;}
		if(inRole.level==5){
			inPerson.saleIncome+=config.memberExceptIncome*orderQuantity;
		}else{
			var amount=orderQuantity*(config.tetailPrice-inRole.primeCost);
			inPerson.saleIncome+=amount;
		}
		inPerson.save();
		if(outPerson){
			Role.findById(outPerson._role,function (err, outRole){
				if(err||!outRole){return;}
				if(outRole.level<inRole.level){
					var amount=(inRole.primeCost-outRole.primeCost)*orderQuantity;
				}else{
					var amount=(inPerson.primeCost*orderQuantity)*config.ratePrecent;
				}
				outPerson.income+=amount;
				outPerson.save();
			});
		}else{
			User.findOne({_info:inPerson._id},'',{populate:'_creator'},function (err, user){
				if(err||!user){return;}
				if(!user._creator){return;}
				Role.findById(user._creator._role,function (err, outRole){
					if(err||!outRole){return;}
					if(outRole.level<inRole.level){
						var amount=(inRole.primeCost-outRole.primeCost)*orderQuantity;
					}else{
						var amount=(inPerson.primeCost*orderQuantity)*config.ratePrecent;
					}
					user._creator.income+=amount;
					user._creator.save();
				});
			});
		}
	});
};





exports.shipment=function (req, res){
	var _inPerson=req.body._inPerson,
		_product=req.body._product,
		orderQuantity=req.body.orderQuantity,
		outPerson=req.user._info;
	if(!_inPerson){
		return res,json(400,'缺少创建参数：_inPerson');
	}
	if(!_product){
		return res,json(400,'缺少创建参数：_product');
	}
	if(!orderQuantity&&orderQuantity!=0){
		return res,json(400,'缺少创建参数：orderQuantity');
	}
	if(isNaN(orderQuantity)){
		return res,json(400,'创建参数类型不正确：必须为数字!');
	}
	orderQuantity=parseInt(orderQuantity);
	User.findOne({_info:_inPerson},'',{populate:'_info'},function (err, inPerson){
		if(err){return handleError(res,err);}
		if(!inPerson){return res.json(400,'进货者不存在!')}
		Product.findById(_product,function (err, product){
			if(err){return handleError(res,err);}
			if(!product){return res.json(400,'产品不存在!')}
			if(outPerson && inPerson.level<=outPerson.level){
				return res.json(400,'进货人代理等级需小于出货人代理等级!');
			}
			var now=new Date();
			var inObj={
				_info:_inPerson,
				content:'进货'+orderQuantity+'套'+product.name,
				_product:_product,
				hasRead:[],
				belong:inPerson.belong,
				createDate:now
			};
			
			if(outPerson){
				var outObj={
					_info:outPerson._id,
					content:'出货'+orderQuantity+'套'+product.name,
					_product:_product,
					hasRead:[],
					belong:req.user.belong,
					createDate:now
				};
				if(product.state=='2'){
					var pr = _.findWhere(outPerson.mainProducts,{_product:_product});
					if(!pr || pr.lastQuantity<orderQuantity){
						return res.json(400,'没有足够的货物!');
					}else{
						pr.lastQuantity-=orderQuantity;
						outPerson.save();
					}
					Event.create(outObj);
				}else{
					var pr = _.findWhere(outPerson.otherProducts,{_product:_product});
					if(!pr || pr.lastQuantity<orderQuantity){
						return res.json(400,'没有足够的货物!');
					}else{
						pr.lastQuantity-=orderQuantity;
						outPerson.save();
					}
					Event.create(outObj);
				}
			}else{
				product.quantity-=orderQuantity;
				product.save();
			}
			Event.create(inObj);

			var condition={
				inPerson:inPerson._info,
				outPerson:outPerson,
				product:product,
				orderQuantity:orderQuantity
			};
			updateInPerson(condition);
			res.json(200,'进货处理中!');
		});	
	});
};


exports.index=function (req, res){
	var page = req.query.page || 1,
    	itemsPerPage = req.query.itemsPerPage || 100,
    	_info = req.query._info,
    	belong = req.query.belong,
    	readId = req.user._id,
    	isRead=req.query.isRead;
    var condition={};
    var count;
    console.log(readId);
    if(isRead){
    	condition=_.merge(condition,{hasRead:{$nin:[readId]}});
    }
    console.log(condition);
    if(_info){
    	condition=_.merge(condition,{_info:_info});
    }
    if(belong){
    	condition=_.merge(condition,{belong:belong});
    }
    // console.log(condition,'aaaaaaaaaaaaaa');
    Event.find(condition).count(function (err, c){
    	if(err){return handleError(res,err);}
    	count=c;
    });
    Event.find(condition,{},{
    	skip: (page - 1) * itemsPerPage,
		limit: itemsPerPage,
		populate:'_info _product belong'
    })
    .exec(function (err, events){
    	if(err){return handleError(res,err);}
    	// console.log(events);
    	return res.json(200,{
    		events:events,
    		count:count
    	});
    });
};


exports.read=function (req, res){
	var id = req.params.id;
    Event.findById(id,function (err, eve){
    	if(err){return handleError(res,err);}
    	if(!eve){return res.json(404, '事件不存在!');}
    	eve.isRead=true;
    	eve.save(function (err, eve){
    		if(err){return handleError(res,err);}
    		return res.json(200,{eve:eve});
    	});
    });
};


// exports.readAll=function (req, res){
// 	var id = req.params.id,
// 		role = req.user.role;
// 	var condition={isRead:false};
// 	if(role&&role=='subAdmin'){
// 		condition=_.merge(condition,{belong:id});
// 	}else{
// 		condition=_.merge(condition,{_info:id});
// 	}
// 	Event.find(condition,function (err, events){
// 		if(err){return handleError(res,err);}
// 		_.each(events,function (event){
// 			event.isRead=true;
// 			event.save();
// 		});
// 		return res.json(200,{events:events});
// 	});
    
// };

exports.readAll = function (req,res){
	var ids = req.body.eventsIds || [];
	var id=req.user._id;
	Event.find({_id:{$in:ids}},function (err,events){
		if(err){return handleError(res, err);}
		_.each(events,function (eve){
			if(eve.hasRead.indexOf(id)<-1){
				eve.hasRead.push(id);
			}
			eve.save();
		});
		res.json(200,"操作成功");
	});
};