(function ()
{
    'use strict';

    angular
        .module('app.peche.administration.profil', [])  
        .config(config);
        var vs = {};
           
    
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_admin_profil', {
            url      : '/administration/profil',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/administration/profil/profil.html',
                    controller : 'ProfilController as vm'
                }
            },
            bodyClass: 'profil',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "profil"
            }
        });

        // Translation
     //   $translatePartialLoaderProvider.addPart('app/main/peche/ddb/activite');

        /*Navigation
        msNavigationServiceProvider.saveItem('peche.administration.utilisateurs.profil', {
            title: 'Profil',
            icon  : 'icon-account-key',
            state: 'app.population_admin_profil'
        });*/
   
    }



})();
