(function ()
{
    'use strict';

    angular
        .module('fuse')
        .factory('apiFactory', apiFactory)
        .factory('cookieService', cookieService)
        .factory('storageService', storageService)
        .factory('loginService', loginService);


    /** @ngInject */
    function apiFactory($http, apiUrl){
        return{
          getAll: function(controller) {
            return $http.get(apiUrl+controller);
          },
          getOne: function(controller, id) {
            return $http.get(apiUrl+controller+"?id="+id);
          },
          getFils: function(controller, cle_etrangere) {
            return $http.get(apiUrl+controller+"?cle_etrangere="+cle_etrangere);
          },
          getEchantillonnageByDate: function(controller, date_debut, date_fin) {
            return $http.get(apiUrl+controller+"?date_debut="+date_debut+"&date_fin="+date_fin);
          },
          getEchantillonnageByValidation: function(controller, validation) {
            return $http.get(apiUrl+controller+"?validation="+validation);
          },
          add: function(controller, data, config) {
            return $http.post(apiUrl+controller, data, config);
          },
          getUserByEnabled: function(controller, enabled) {
            return $http.get(apiUrl+controller+"?enabled="+enabled);
          },
          getAPIgeneraliser: function(controller,champ1,valeur1,champ2,valeur2) {
            return $http.get(apiUrl+controller+"?"+champ1+"="+valeur1+"&"+champ2+"="+valeur2);
          },
          getAPIgeneraliserCI: function(controller,valeur1,valeur2,valeur3) {
            return $http.get(apiUrl+controller+"/"+valeur1+"/"+valeur2+"/"+valeur3);
          },
          getAPIgeneraliserREST: function(controller,champ1,valeur1,champ2,valeur2,champ3,valeur3,champ4,valeur4) {
            return $http.get(apiUrl+controller+"?"+champ1+"="+valeur1+"&"+champ2+"="+valeur2+"&"+champ3+"="+valeur3+"&"+champ4+"="+valeur4);
          },
          getimg: function(controller, data, config) {
            return $http.post(apiUrl+controller, data, config);
          }


        };
    }

    /** @ngInject */
    function cookieService($cookieStore) {
      return {
        set: function (key, value) {
          return $cookieStore.put(key, value);
        },
        get: function (value) {
          return $cookieStore.get(value);
        },
        del: function (value) {
          return $cookieStore.remove(value);
        }
      };
    };

    /** @ngInject */
    function storageService($http) {
      return {
        set: function (key, value) {
          return localStorage.setItem(key, value);
        },
        get: function (value) {
          return localStorage.getItem(value);
        },
        del: function (value) {
          return localStorage.removeItem(value);
        }
      };
    };

    /** @ngInject */
    function loginService($http, apiUrl, $location, cookieService, storageService, $mdDialog, $state,$window)
    {
      return{
        sing_in: function(utilisateur, ev){
          //clear
          cookieService.del('id');
          cookieService.del('nom');
          cookieService.del('prenom');
          cookieService.del('email');
          cookieService.del('token');
          cookieService.del('site');
          cookieService.del('roles');
          cookieService.del('exist');
          storageService.del('exist');
          storageService.del('enabled');
          //
          var email = utilisateur.email;
          var pwd = utilisateur.password;

          $http.get(apiUrl+'utilisateurs?email='+email+'&pwd='+pwd)
            .success(function(data){
              if(data.status == true)
                  {
                    cookieService.set('id',data.response.id);
                    cookieService.set('nom',data.response.nom);
                    cookieService.set('prenom',data.response.prenom);
                    cookieService.set('email',data.response.email);
                    cookieService.set('token',data.response.token);
                    cookieService.set('site',data.response.site_id);
                    cookieService.set('roles',data.response.roles);
                    storageService.set('exist',9);
                    storageService.set('enabled',data.response.enabled);
                    if(data.response.enabled==0)
                    {
                      $location.path("/auth/lock");
                    }
                    else
                    {
                      location.reload();

                 // $location.path("/accueil");//si n'est pas packeT
                  
                      $window.location.href = '/peche';
                    }
                  }else{

                    $mdDialog.show({
                      controller         : function ($scope, $mdDialog)
                      {
                        $scope.closeDialog = function ()
                        {
                          $mdDialog.hide();
                        }
                      },
                      template           : '<md-dialog>' +
                      '  <md-dialog-content><h1 class="md-warn-fg" translate="LOGIN.error.titre">titre</h1><div><pre translate="LOGIN.error.msg">corps</pre></div></md-dialog-content>' +
                      '  <md-dialog-actions>' +
                      '    <md-button ng-click="closeDialog()" class="md-primary" translate="LOGIN.error.quitter">' +
                      '      Quitter' +
                      '    </md-button>' +
                      '  </md-dialog-actions>' +
                      '</md-dialog>',
                      parent             : angular.element('body'),
                      targetEvent        : ev,
                      clickOutsideToClose: true
                    });
                    cookieService.del('id');
                    cookieService.del('nom');
                    cookieService.del('prenom');
                    cookieService.del('email');
                    cookieService.del('token');
                    cookieService.del('site');
                    cookieService.del('roles');
                    cookieService.del('exist');
                    storageService.del('exist');
                    storageService.del('enabled');
                    $location.path("/auth/login");
                  }
            });
        },
        logout: function(){
          cookieService.del('id');
          cookieService.del('nom');
          cookieService.del('prenom');
          cookieService.del('email');
          cookieService.del('token');
          cookieService.del('site');
          cookieService.del('roles');
          cookieService.del('exist');
          storageService.del('exist');
          storageService.del('enabled');
          $location.path("/auth/login");
        },
        isEnabled: function(){
          var token = cookieService.get('token');
          var enabled = storageService.get('enabled');
          if(token && enabled == 1){return true;}else{return false;}
        },
        isPermitted: function(AllPermitted,Permitted){
          var tab = [];
          $.each(AllPermitted,function(All) {
            $.each(Permitted,function(One) {
              if(AllPermitted[All] == Permitted[One])
              {
                tab.push(1);
              }
            });
          });
          if(tab.length > 0 ){
            return true;
          }else{
            return false;
          }
        },
        gestionMenu:function(listesAutorise, autorisationPersonnel)
        {
            var tab = [];
            angular.forEach(listesAutorise, function(value, key)
            {
                angular.forEach(autorisationPersonnel, function(val, k)
                {
                
                    if (value == val) 
                    {
                       tab.push(1);


                    };


                });
            });
            if(tab.length > 0 )
            {
              return false;
            }else{
              return true;
            }
        }
      };
    }

})();
