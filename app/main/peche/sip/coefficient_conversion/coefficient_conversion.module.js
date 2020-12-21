(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.coefficient_conversion', [])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_reporting_coefficient_conversion', {
            url      : '/sip/coefficient_conversion',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/coefficient_conversion/coefficient_conversion.html',
                    controller : 'coefficient_conversionController as vm'
                }
            },
            bodyClass: 'coefficient_conversion',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "coefficient_conversion"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.ddbsip.coefficient_conversion', {
            title: "Coefficient de conversion",
            icon  : 'icon-data',
            state: 'app.peche_reporting_coefficient_conversion',
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
                var permissions = ["ADMIN","SIP_DDB"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();
