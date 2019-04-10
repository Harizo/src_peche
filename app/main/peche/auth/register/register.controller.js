(function ()
{
    'use strict';

    angular
        .module('app.peche.auth.register')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController(apiFactory, $location, $mdDialog)
    {
      var vm = this;

      vm.allSite = [];

      apiFactory.getAll("region/index").then(function(result)
      {
          vm.allregion= result.data.response;
      });

      apiFactory.getAll("district/index").then(function(result)
      {
          vm.alldistrict = result.data.response;
          vm.districts = vm.alldistrict ;
      });

      //enregistrer
      vm.enregistrer = enregistrer;

      vm.filtre_district = function()
      {
          var ds = vm.alldistrict ;
          if (vm.registerForm.id_region) 
          {
            vm.districts = ds.filter(function(obj)
            {
                return obj.region.id == vm.registerForm.id_region;
            });
          }
                 
      }

      function enregistrer(utilisateur, ev)
      {
        //add
        var config = {
          headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
          }
        };
        //
        var datas = $.param(
        {
          nom: utilisateur.firstname,
          prenom: utilisateur.lastname,
          email: utilisateur.email,
          password: utilisateur.password,
          id_region: utilisateur.id_region,
          id_district: utilisateur.id_district
        });

        //ajout user
        apiFactory.add("utilisateurs/index", datas, config)
          .success(function () {

            $mdDialog.show({
              controller         : function ($scope, $mdDialog)
              {
                $scope.closeDialog = function ()
                {
                  $mdDialog.hide();
                  $location.path('/auth/login');
                }
              },
              template           : '<md-dialog>' +
              '  <md-dialog-content><h1 class="md-accent" translate="REGISTER.ok.titre">titre</h1><div><pre translate="REGISTER.ok.msg">corps</pre></div></md-dialog-content>' +
              '  <md-dialog-actions>' +
              '    <md-button ng-click="closeDialog()" class="md-primary" translate="REGISTER.ok.quitter">' +
              '      Quitter' +
              '    </md-button>' +
              '  </md-dialog-actions>' +
              '</md-dialog>',
              parent             : angular.element('body'),
              targetEvent        : ev,
              clickOutsideToClose: true
            });

          })
          .error(function () {
            $mdDialog.show({
              controller         : function ($scope, $mdDialog)
              {
                $scope.closeDialog = function ()
                {
                  $mdDialog.hide();
                }
              },
              template           : '<md-dialog>' +
              '  <md-dialog-content><h1 class="md-warn-fg" translate="REGISTER.error.titre">titre</h1><div><pre translate="REGISTER.error.msg">corps</pre></div></md-dialog-content>' +
              '  <md-dialog-actions>' +
              '    <md-button ng-click="closeDialog()" class="md-primary" translate="REGISTER.error.quitter">' +
              '      Quitter' +
              '    </md-button>' +
              '  </md-dialog-actions>' +
              '</md-dialog>',
              parent             : angular.element('body'),
              targetEvent        : ev,
              clickOutsideToClose: true
            });
          });
        //
      }
    }
})();
