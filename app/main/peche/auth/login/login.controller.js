(function ()
{
    'use strict';

    angular
        .module('app.peche.auth.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($rootScope, apiFactory, loginService)
    {
      var vm = this;

     

      //enregistrer
      vm.enregistrer = enregistrer;

      function enregistrer(data)
      {
        loginService.sing_in(data);
      }

    }
})();
