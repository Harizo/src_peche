(function ()
{
    'use strict';

    angular
        .module('app.peche.reporting.nombre_echantillon', [])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_reporting_nombre_echantillon', {
            url      : '/reporting/nombre_echantillon',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/reporting/nombre_echantillon/nombre_echantillon.html',
                    controller : 'Nombre_echantillonController as vm'
                }
            },
            bodyClass: 'nombre_echantillon',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "nombre_echantillon"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.openartfish.reporting.nombre_echantillon', {
            title: "Nombres d'echantillon",
            icon  : 'icon-check-circle',
            state: 'app.peche_reporting_nombre_echantillon',
			weight: 1,
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
                var permissions = ["NBR"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();
