(function ()
{
    var tab = [
            
            'app.peche.ddb.localisation', 
            'app.peche.ddb.type_engin',
            'app.peche.ddb.data_collect',
            'app.peche.ddb.espece',
            'app.peche.ddb.type_canoe',
            'app.peche.ddb.enqueteur',
            'app.peche.ddb.site_embarquement',
            'app.peche.ddb.unite_peche',
            'app.peche.ddb.enquete_cadre',
            'app.peche.ddb.nbr_jrs_mois_unite_peche',
            'app.peche.ddb.nbr_echantillon_enqueteur',
            //'app.peche.ddb.echantillon'


            ] ;
    'use strict';

    angular
        .module('app.peche.ddb', tab.sort())
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('peche.openartfish.ddb', {
            title : 'Données de Bases',
            icon  : 'icon-data',
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
        if (id_user > 0) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions = ["DDB"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
