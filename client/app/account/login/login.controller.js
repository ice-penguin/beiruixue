(function () {

  'use strict';

  angular
    .module('beiruixueApp')
    .controller('LoginCtrl', LoginCtrl);

  /* @ngInject */
  function LoginCtrl($scope, Auth, $location, $state) {
    var self = this;

    self.login = login;

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

    function login() {
       Auth.login({
          account: self.account,
          password: self.pwd
        })
        .then( function() {
          // Logged in, redirect to home
          // $location.path('/view');
          $state.go('main');
        })
        .catch( function(err) {
          self.showError = true;
        });
    };
    
  }
  
})();
