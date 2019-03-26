(function ()
{
    'use strict';

    angular
        .module('app.peche', [
            'app.peche.accueil',
            'app.peche.auth.login',
            'app.peche.auth.register',
            'app.peche.auth.forgot-password',
            'app.peche.auth.reset-password',
            'app.peche.auth.lock',
            'app.peche.administration',
            'app.peche.validation_fiche_echantillonnage_capture',
            'app.peche.importationbdd',
            'app.peche.valide_fiche_echantillonnage_capture',
            'app.peche.ddb'

        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider, $mdDateLocaleProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('peche', {
            title : 'Menu Principale',
            group : true,
            weight: 1
        });

         $mdDateLocaleProvider.formatDate = function(date) {
            return date ? moment(date).format('DD/MM/YYYY') : new Date(NaN);
        };
  
        $mdDateLocaleProvider.parseDate = function(dateString) {
            var m = moment(dateString, 'DD/MM/YYYY', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };
    }
})();
