
(function ()
{
    'use strict';

    angular
        .module('app.peche.validation_fiche_echantillonnage_capture', [])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_validation_fiche_echantillonnage_capture', {
            url      : '/validation_fiche_echantillonnage_capture',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/validation_fiche_echantillonnage_capture/validation_fiche_echantillonnage_capture.html',
                    controller : 'Validation_fiche_echantillonnage_captureController as vm'
                }
            },
            bodyClass: 'validation_fiche_echantillonnage_capture',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Validation fiche echantillonnage capture"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.openartfish.validation_fiche_echantillonnage_capture', {

            title: 'Validation des données',
            icon  : 'icon-clipboard-text',

            state: 'app.population_validation_fiche_echantillonnage_capture',
            weight: 2,
            hidden: function()
            {
                    return vs;
            }
        });
    }

    function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
                var permission = user.roles;
                var permissions = ["VLD"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();
