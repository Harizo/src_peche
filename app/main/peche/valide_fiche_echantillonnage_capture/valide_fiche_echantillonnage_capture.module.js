
(function ()
{
    'use strict';

    angular
        .module('app.peche.valide_fiche_echantillonnage_capture', [])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_valide_fiche_echantillonnage_capture', {
            url      : '/valide_fiche_echantillonnage_capture',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/valide_fiche_echantillonnage_capture/valide_fiche_echantillonnage_capture.html',
                    controller : 'Valide_fiche_echantillonnage_captureController as vm'
                }
            },
            bodyClass: 'valide_fiche_echantillonnage_capture',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche echantillonnage capture valide"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.openartfish.valide_fiche_echantillonnage_capture', {
            title: 'Données validées',
            icon  : 'icon-clipboard-text',
            state: 'app.population_valide_fiche_echantillonnage_capture',
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
                var permissions = ["SSI"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }


})();
