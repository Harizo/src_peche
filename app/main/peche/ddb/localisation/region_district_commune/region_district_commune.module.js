(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.localisation.ddb.decoup_admin', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_ddb_region_district_commune', {
            url      : '/donnees-de-base/region_district_commune',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/localisation/region_district_commune/region_district_commune.html',
                    controller : 'Region_district_communeController as vm'
                }
            },
            bodyClass: 'region_district_commune',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "region_district_commune"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.localisation.region_district_commune', {
            title: "Découpage administratif",
            icon  : 'icon-map-marker-circle',
            state: 'app.peche_ddb_region_district_commune'/*,
            hidden: function()
            {
                    return vs;
            }*/
        });
    }

    function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user > 0) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions =   [
                                        "SPR_ADM",
                                        "DEC_ADM"
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
