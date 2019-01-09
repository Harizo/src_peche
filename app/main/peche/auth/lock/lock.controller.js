(function ()
{
    'use strict';

    angular
        .module('app.peche.auth.lock')
        .controller('LockController', LockController);

    /** @ngInject */
    function LockController(cookieService, storageService, apiFactory, $location, $mdDialog)
    {
        var vm = this;

        // Data
        vm.form = {
            username: cookieService.get('nom')+' '+cookieService.get('prenom')
        };
        vm.sendmail = sendmail;

        // Methods
        function sendmail(mdp, ev) {
          apiFactory.getAll("utilisateurs/index?mdp="+mdp)
            .success(function(result) {
              if(result.status == false)
              {
                vm.mdp_exist = 0;
              }else {
                vm.mdp_exist = 1;

                $mdDialog.show({
                  template           : '<md-dialog>' +
                  '  <md-dialog-content><h1 class="md-warn-fg" translate="LOCK.loading.titre">titre</h1><div><pre translate="LOCK.loading.msg">corps</pre></div></md-dialog-content>' +
                  '  </md-dialog-actions>' +
                  '</md-dialog>',
                  parent             : angular.element('body'),
                  targetEvent        : ev,
                  clickOutsideToClose: false
                });

                apiFactory.getAll("mail/index?actif=0&courriel="+cookieService.get('email')+"&token="+cookieService.get('token')).then(function(value) {
                  if(value.status == 200){
                    $location.path('/auth/login');
                    $mdDialog.hide();
                  }
                  //
                });
              }
            });
        }

    }
})();
