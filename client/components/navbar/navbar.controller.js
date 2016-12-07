(function() {

  'use strict';

  angular
    .module('beiruixueApp')
    .controller('NavbarCtrl', NavbarCtrl);

  /* @ngInject */
  function NavbarCtrl($scope, $location, $stateParams, User) {

    var self = this;

    var init = function(){
      initMenu();
    };

    var initMenu = function(){
      User.get(function (data){
        self.user = data;
        if(self.user.role){
          self.menus=[{
            'title': '账户管理',
            'link': '/login',
            'navCss':"",
            "state":""
          },{
            'title': '角色管理',
            'link': '/login',
            'navCss':"",
            "state":""
          },{
            'title': '产品管理',
            'link': '/login',
            'navCss':"",
            "state":""
          },{
            'title': '事件管理',
            'link': '/login',
            'navCss':"",
            "state":""
          }];
        }else if(self.user._info&&self.user._info.level == 5){
          self.menus=[{
            'title': '事件管理',
            'link': '/login',
            'navCss':"",
            "state":""
          }];
        }else{
          self.menus=[{
            'title': '账户管理',
            'link': '/login',
            'navCss':"",
            "state":""
          },{
            'title': '事件管理',
            'link': '/login',
            'navCss':"",
            "state":""
          }];
        }
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
      }
    };

    init();

  }

})();  