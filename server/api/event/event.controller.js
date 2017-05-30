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
	var isFrist=false;//是否是第一次进货
	switch(product.state){
		case '1':
			dealArr=inPerson.otherProducts;
			updateIncomeByNormal(condition);
			break;
		case '2':
			isUpdateIncome=true;
			dealArr=inPerson.mainProducts;
			if(!inPerson.orderQuantity){
				isFrist=true;//为第一次进货
			}
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
			//先让进货人升级到对应的等级
			inPerson.save(function(err){
				updatePushIcome(condition,isFrist);
				updateIncome(condition,isFrist);
			});
			
		});
	}else{
		if(isUpdateIncome){
			updatePushIcome(condition,isFrist);
			updateIncome(condition,isFrist);
		}else{
			inPerson.save();
		}
	}
};

//单品返点10%
var updateIncomeByNormal = function (condition){
	var outPerson=condition.outPerson,
		orderQuantity=condition.orderQuantity,
		product=condition.product;
	if(outPerson){
		Role.findById(outPerson._role,function (err, outRole){
			if(err||!outRole){return;}
			var amount=product.price*orderQuantity*config.ratePrecentNormal;
			outPerson.income+=amount;
			outPerson.save();
		});
	}
	
}

//更新推荐人的返利,只进行推荐人相关计算
//推荐人是会员，且收货人是第一次收货，则获得2000返利
//推荐人有返利收益（如果推荐人跟发货人是同一个人，则不再计算推荐人收益）
var updatePushIcome = function(condition,isFrist){
	var inPerson=condition.inPerson,
		outPerson=condition.outPerson,
		orderQuantity=condition.orderQuantity;
	//找到收获人的角色
	Role.findById(inPerson._role,function (err, inRole){
		if(err||!inRole){return;}
		//找到推荐人,先找到进货人账户信息，找到推荐人账户和info
		User.findOne({_info:inPerson._id},'',{populate:'_creator'},function (err, user){
			if(err||!user){return;}
			//没有推荐人直接返回
			if(!user._creator){return;}
			//如果发货人存在，且推荐人跟发货人是同一个人，则不再计算推荐人收益
			if(outPerson && user._creator._info == outPerson._id){
				return;
			}

			Info.findById(user._creator._info,'',{populate:'_role'},function (err,pushPerson){
				if(err||!pushPerson){return;}
				var pushRole = pushPerson._role;
				if(!pushRole){return;}
				//开始计算
				//如果推荐人是会员，且进货人是第一次进货，推荐人拿到2000返点
				//推荐人是否是会员
				if(pushRole.level == 5){
					//进货人是第一次进货
					if(isFrist){
						pushPerson.income += config.rateNum;
						pushPerson.save();
					}
				}else{
					//推荐人不是会员，按返利点点返点
					pushPerson.income+=inRole.primeCost*orderQuantity*config.ratePrecent;
					pushPerson.save();
				}
			});
		});
		
	});
};

//最新新版计算方式，outPerson不存在为admin发货，只计算发货人与收货人的收益
//outPerson,inPerson都是info模型
//outPerson不存在只可能为admin为发货人
//且会员的第一套产品只用不产生销售收益
var updateIncome=function (condition,isFrist){
	var inPerson=condition.inPerson,
		outPerson=condition.outPerson,
		orderQuantity=condition.orderQuantity;
	//找到收货人，找到发货人，找到收货人的推荐人（创建人）
	//发货人是销售收入

	//更新发货人的销售收益
	Role.findById(inPerson._role,function (err, inRole){
		if(err||!inRole){return;}
		//如果进货人是会员，那么产生预期销售收益
		if(inRole.level==5){
			if(isFrist){
				inPerson.saleIncome+=config.memberExceptIncome*(orderQuantity-1);
			}else{
				inPerson.saleIncome+=config.memberExceptIncome*orderQuantity;
			}
			
		}
		inPerson.save();
		if(outPerson){
			//找到发货人的角色对应的发货价
			Role.findById(outPerson._role,function (err, outRole){
				if(err||!outRole){return;}
				//计算发货人的收益,如果进货人等级在此次大于等于发货人，那么发货人得到的是返利，否则是销售收益
				if(outRole.level>=inRole.level){
					//发货人返利收益
					outPerson.income+=inRole.primeCost*orderQuantity*config.ratePrecent;
				}else{
					//发货人销售收益
					outPerson.saleIncome+=orderQuantity*(inRole.primeCost-outRole.primeCost)
				}
				outPerson.save();
			});
		}
	});

	
};

//更新销售收益,老版计算方式
// var updateIncome=function (condition){
// 	Role.findOne({level:5},function (err,r){
// 		if(r){
// 			config.tetailPrice = r.primeCost;
// 		}
// 		var inPerson=condition.inPerson,
// 			outPerson=condition.outPerson,
// 			orderQuantity=condition.orderQuantity;
// 		Role.findById(inPerson._role,function (err, inRole){
// 			if(err||!inRole){inPerson.save(); return;}
// 			if(inRole.level==5){
// 				inPerson.saleIncome+=config.memberExceptIncome*orderQuantity;
// 			}else{
// 				var amount=orderQuantity*(config.tetailPrice-inRole.primeCost);
// 				inPerson.saleIncome+=amount;
// 			}
// 			inPerson.save();
// 			if(outPerson){
// 				Role.findById(outPerson._role,function (err, outRole){
// 					if(err||!outRole){return;}
// 					if(outRole.level<inRole.level){
// 						var amount=(inRole.primeCost-outRole.primeCost)*orderQuantity;
// 					}else{
// 						var amount=(inPerson.primeCost*orderQuantity)*config.ratePrecent;
// 					}
// 					outPerson.income+=amount;
// 					outPerson.save();
// 				});
// 			}else{
// 				User.findOne({_info:inPerson._id},'',{populate:'_creator'},function (err, user){
// 					if(err||!user){return;}
// 					if(!user._creator){return;}
// 					Role.findById(user._creator._role,function (err, outRole){
// 						if(err||!outRole){return;}
// 						if(outRole.level<inRole.level){
// 							var amount=(inRole.primeCost-outRole.primeCost)*orderQuantity;
// 						}else{
// 							var amount=(inPerson.primeCost*orderQuantity)*config.ratePrecent;
// 						}
// 						user._creator.income+=amount;
// 						user._creator.save();
// 					});
// 				});
// 			}
// 		});
// 	})
	
// };





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
    	readId = (req.user._id).toString(),
    	isRead=req.query.isRead;
    var condition={};
    var count;
    // console.log(_info,'aaaa');
    if(isRead){
    	condition=_.merge(condition,{hasRead:{$nin:[readId]}});
    }
    if(_info){
    	condition=_.merge(condition,{_info:_info});
    }
    if(belong){
    	condition=_.merge(condition,{belong:belong});
    }
    console.log(condition,'aaaa');
    Event.find(condition).count(function (err, c){
    	if(err){return handleError(res,err);}
    	count=c;
    });
    Event.find(condition,{},{
    	skip: (page - 1) * itemsPerPage,
		limit: itemsPerPage,
		populate:'_info _product belong',
		sort:{createDate:-1}
    })
    .exec(function (err, events){
    	if(err){return handleError(res,err);}
    	for(var i=0;i<events.length;i++){
    		events[i]=events[i].toObject();
    		if(events[i].hasRead.indexOf(readId)<0){
    			events[i].isRead=false;
    		}else{
    			events[i].isRead=true;
    		}
    	}
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
	var id=(req.user._id).toString();
	Event.find({_id:{$in:ids}},function (err,events){
		if(err){return handleError(res, err);}
		_.each(events,function (eve){
			if(eve.hasRead.indexOf(id)<0){
				eve.hasRead.push(id);
			}
			eve.save();
		});
		res.json(200,"操作成功");
	});
};