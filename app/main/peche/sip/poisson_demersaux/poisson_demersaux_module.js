(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.poisson_demersaux', [])
       // .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_poisson_demersaux', {
            url      : '/sip/poisson-demersaux',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/poisson_demersaux/poisson_demersaux.html',
                    controller : 'Poisson_demersauxController as vm'
                }
            },
            bodyClass: 'poisson_demersaux',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Poisson demersaux"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.poisson_demersaux', {
            title: "Poisson demersaux",
            icon  : 'icon-numeric-5-box-multiple-outline',
            state: 'app.peche_poisson_demersaux',
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
