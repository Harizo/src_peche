(function ()
{
    'use strict';

    angular
        .module('app.peche.reporting.analyse_parametrable', [])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_reporting_analyse_parametrable', {
            url      : '/reporting/analyse_parametrable',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/reporting/analyse_parametrable/analyse_parametrable.html',
                    controller : 'Analyse_parametrableController as vm'
                }
            },
            bodyClass: 'analyse_parametrable',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "analyse_parametrable"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.reporting.analyse_parametrable', {
            title: "Analyse parametrable",
            icon  : 'icon-check-circle',
            state: 'app.peche_reporting_analyse_parametrable',
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
                var permissions = ["ALS"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();
