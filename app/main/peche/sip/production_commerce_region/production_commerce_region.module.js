(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.production_commerce_region', [])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_reporting_production_commerce_region', {
            url      : '/sip/production_commerce_region',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/production_commerce_region/production_commerce_region.html',
                    controller : 'production_commerce_regionController as vm'
                }
            },
            bodyClass: 'production_commerce_region',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "production_commerce_region"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.production_commerce_region', {
            title: "Product°/Commercialisat° par région",
            icon  : 'icon-numeric-9-box-multiple-outline',
            state: 'app.peche_reporting_production_commerce_region',
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
                var permissions = ["ADMIN","SIP_PROD_COM"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();
