(function ()
{
    'use strict';

    angular
        .module('app.peche.importationbdd', [])
        .config(config);
        var vs = {};
        var affichage;
    
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_importer_bdd', {
            url      : '/importation/bdd',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/importationbdd/importationbdd.html',
                    controller : 'ImportationbddController as vm'
                }
            },
            bodyClass: 'importerbdd',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "ImportBDD"
            }
        });
       // Navigation
        msNavigationServiceProvider.saveItem('peche.importationbdd', {
            title: 'Importer BDD Access',
            icon  : 'icon-account-key',
            state: 'app.peche_importer_bdd',
            weight: 15,
            // badge:vs,
            hidden:function()
            {
                    return affichage;
            }
        });
    }
})();
