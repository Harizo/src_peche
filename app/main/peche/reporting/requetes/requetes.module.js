(function ()
{
    'use strict';

    angular
        .module('app.peche.reporting.requetes', [])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_reporting_requetes', {
            url      : '/reporting/requetes',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/reporting/requetes/requetes.html',
                    controller : 'requetesController as vm'
                }
            },
            bodyClass: 'requetes',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "requetes"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.openartfish.reporting.requetes', {
            title: "Requêtes",
            icon  : 'icon-check-circle',
            state: 'app.peche_reporting_requetes',
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
                var permissions = ["RPT"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();
