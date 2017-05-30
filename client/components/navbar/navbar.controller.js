(function() {

  'use strict';

  angular
    .module('beiruixueApp')
    .controller('NavbarCtrl', NavbarCtrl);

  /* @ngInject */
  function NavbarCtrl($scope, $location, $stateParams, User,Event,Auth) {

    var self = this;
    // self.newsState="member-event-view({state:'false',index:null})";

    var init = function(){
      initMenu();
      scrollTop();
    };

    var scrollTop = function(){
      $('html,body').animate({scrollTop: '0px'}, 800);
    };

    var system ={}; 
    var p = navigator.platform;   
    system.win = p.indexOf("Win") == 0; 
    system.mac = p.indexOf("Mac") == 0; 
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);   
    if(system.win||system.mac||system.xll){//如果是电脑跳转到百度 
        // window.location.href="http://www.baidu.com/"; 
        self.isPC = true;
    }else{  //如果是手机,跳转到谷歌
        // window.location.href="http://www.google.cn/"; 
        self.isPC = false;
        
    }

    var initMenu = function(){
      User.get(function (data){
        self.user = data;
        if(self.user.role){
          switch(self.user.role){
            case 'admin':
              Event.index({isRead:false},{},function (data){
                if(data.count>0){
                  self.newsPrompt=true;
                }
              },function (){

              });
              break;
            case 'subAdmin':
              Event.index({isRead:false,belong:self.user._id},{},function (data){
                if(data.count>0){
                  self.newsPrompt=true;
                }
              },function (){

              });
              break;
          };
          self.newsState="admin-event-view({state:'false',index:null})";
          self.menus=[{
            'title': '账户管理',
            'link': 'admin-account-view',
            'navCss':"",
            "state":"admin-account-view",
            "navImage":"mobile-accountGary-nav"
          },{
            'title': '角色管理',
            'link': 'admin-role-view',
            'navCss':"",
            "state":"admin-role-view",
            "navImage":"mobile-roleGary-nav"
          },{
            'title': '产品管理',
            'link': 'admin-product-view',
            'navCss':"",
            "state":"admin-product-view",
            "navImage":"mobile-productGary-nav"
          },{
            'title': '事件管理',
            'link': 'admin-event-view({index:"true",state:null})',
            'navCss':"",
            "state":"admin-event-view",
            "navImage":"mobile-eventGary-nav"
          }];
        }else{
          Event.index({isRead:false,_info:self.user._info._id},{},function (data){
            if(data.count>0){
              self.newsPrompt=true;
            }
          },function (){

          });
          self.newsState="agent-event-view({state:'false',_info:navbarCtrl.user._info._id})";
          self.menus=[{
            'title': '账户管理',
            'link': 'agent-account-view',
            'navCss':"",
            "state":"agent-account-view",
            "navImage":"mobile-accountGary-nav"
          },{
            'title': '角色管理',
            'link': 'agent-role-view',
            'navCss':"",
            "state":"agent-role-view",
            "navImage":"mobile-roleGary-nav"
          },{
            'title': '事件管理',
            'link': 'agent-event-view({index:null,state:null,_info:navbarCtrl.user._info._id})',
            'navCss':"",
            "state":"agent-event-view",
            "navImage":"mobile-eventGary-nav"
          }];
        }
        // if(self.user.role){
        //   switch(self.user.role){
        //     case 'admin':
        //       Event.index({isRead:false},{},function (data){
        //         if(data.count>0){
        //           self.newsPrompt=true;
        //         }
        //       },function (){

        //       });
        //       break;
        //     case 'subAdmin':
        //       Event.index({isRead:false,belong:self.user._id},{},function (data){
        //         if(data.count>0){
        //           self.newsPrompt=true;
        //         }
        //       },function (){

        //       });
        //       break;
        //   };
        //   self.newsState="admin-event-view({state:'false',index:null})";
        //   self.menus=[{
        //     'title': '账户管理',
        //     'link': 'admin-account-view',
        //     'navCss':"",
        //     "state":"admin-account-view",
        //     "navImage":"mobile-accountGary-nav"
        //   },{
        //     'title': '角色管理',
        //     'link': 'admin-role-view',
        //     'navCss':"",
        //     "state":"admin-role-view",
        //     "navImage":"mobile-roleGary-nav"
        //   },{
        //     'title': '产品管理',
        //     'link': 'admin-product-view',
        //     'navCss':"",
        //     "state":"admin-product-view",
        //     "navImage":"mobile-productGary-nav"
        //   },{
        //     'title': '事件管理',
        //     'link': 'admin-event-view({index:"true",state:null})',
        //     'navCss':"",
        //     "state":"admin-event-view",
        //     "navImage":"mobile-eventGary-nav"
        //   }];
        // }else if(self.user._info&&self.user._info.level == 5){
        //   Event.index({isRead:false,_info:self.user._info._id},{},function (data){
        //     if(data.count>0){
        //       self.newsPrompt=true;
        //     }
        //   },function (){

        //   });
        //   self.newsState="member-event-view({state:'false',index:null})";
        //   self.menus=[{
        //     'title': '事件管理',
        //     'link': 'member-event-view({index:null,state:null,_info:navbarCtrl.user._info._id})',
        //     'navCss':"",
        //     "state":"member-event-view",
        //     "navImage":"mobile-eventGary-nav"
        //   }];
        // }else{
        //   Event.index({isRead:false,_info:self.user._info._id},{},function (data){
        //     if(data.count>0){
        //       self.newsPrompt=true;
        //     }
        //   },function (){

        //   });
        //   self.newsState="agent-event-view({state:'false',index:null})";
        //   self.menus=[{
        //     'title': '账户管理',
        //     'link': 'agent-account-view',
        //     'navCss':"",
        //     "state":"agent-account-view",
        //     "navImage":"mobile-accountGary-nav"
        //   },{
        //     'title': '事件管理',
        //     'link': 'agent-event-view({index:null,state:null,_info:navbarCtrl.user._info._id})',
        //     'navCss':"",
        //     "state":"agent-event-view",
        //     "navImage":"mobile-eventGary-nav"
        //   }];
        // }
        //页面
        initMenuStatus();
      });

    };

    var initMenuStatus=function(){
      _.each(self.menus,function (menu){
        menu.navCss="";
      });
      var navValue = $stateParams.navValue;
      var c=_.findWhere(self.menus,{state:navValue});

      if(c){
        c.navCss="navbar-lead-select";
        switch(navValue){
          case 'admin-account-view':
            c.navImage="mobile-accountGreen-nav";
            break;
          case 'agent-account-view':
            c.navImage="mobile-accountGreen-nav";
            break;
          case 'member-account-view':
            c.navImage="mobile-accountGreen-nav";
            break;
          case 'admin-role-view':
            c.navImage="mobile-roleGreen-nav";
            break;
          case 'admin-product-view':
            c.navImage="mobile-productGreen-nav";
            break;
          case 'admin-event-view':
            c.navImage="mobile-eventGreen-nav";
            break;
          case 'agent-event-view':
            c.navImage="mobile-eventGreen-nav";
            break;
          case 'member-event-view':
            c.navImage="mobile-eventGreen-nav";
            break;
        };
      }
    };

    self.logout=Auth.logout;

    init();

  }

})();  