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

      vm.affiche_load = false ;

      //enregistrer
      vm.enregistrer = enregistrer;

      function enregistrer(data)
      {
        vm.affiche_load = true ;
        loginService.sing_in(data);
      }

    }
})();
