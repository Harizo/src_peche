(function ()
{
    'use strict';

    angular
        .module('app.peche.reporting', [
            'app.peche.reporting.nombre_echantillon',
            'app.peche.reporting.analyse_parametrable',
            'app.peche.reporting.requetes'
        ])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider, $mdDateLocaleProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('peche.openartfish.reporting', {
            title : 'Reporting/Analyses',
           // group : true,
            icon  : 'icon-calendar-text',
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
                var permissions = ["RPT","ALS","NBR"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }
})();
