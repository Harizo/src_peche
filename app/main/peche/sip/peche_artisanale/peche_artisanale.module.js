(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.peche_artisanale', [])
       // .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_reporting_peche_artisanale', {
            url      : '/sip/peche_artisanale',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/peche_artisanale/peche_artisanale.html',
                    controller : 'Peche_artisanaleController as vm'
                }
            },
            bodyClass: 'peche_artisanale',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "peche_artisanale"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.peche_artisanale', {
            title: "Pêche Artisanale",
            icon  : 'icon-numeric-6-box-multiple-outline',
            state: 'app.peche_reporting_peche_artisanale',
			weight: 1/*,
            hidden: function()
            {
                    return vs;
            }*/
        });
    }

  /*  function testPermission(loginService,$cookieStore,apiFactory)
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
     
    }*/

})();
