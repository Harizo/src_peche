(function ()
{
    'use strict';

    angular
        .module('app.peche.auth.reset-password')
        .controller('ResetPasswordController', ResetPasswordController);

    /** @ngInject */
    function ResetPasswordController(apiFactory, $stateParams, $location)
    {
      var vm = this;

      vm.reinit = reinit;

      function reinit(utilisateur)
      {
        apiFactory.getAll('utilisateurs/index?courriel='+utilisateur.email+'&reinitpwd='+utilisateur.passwordConfirm+'&reinitpwdtoken='+$stateParams.token)
          .success(function() {
            $location.path('/auth/login');
          });
      };
    }
})();
