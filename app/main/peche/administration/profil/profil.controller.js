(function ()
{
    'use strict';

    angular
        .module('app.peche.administration.profil')
        .controller('ProfilController', ProfilController);

    /** @ngInject */
    function ProfilController(apiFactory, $location, $mdDialog, $scope, $cookieStore,apiUrl,$rootScope,$http)//, uploadService)
    {
		var vm = this;
     

		var id_user = $cookieStore.get('id');

  		apiFactory.getOne("utilisateurs/index", id_user).then(function(result)  
	      {
	        vm.user = result.data.response;
	   

	        vm.profil = {} ;
	        vm.profil.nom = vm.user.nom ;
	        vm.profil.prenom = vm.user.prenom ;
	        //vm.profil.cin = vm.user.cin ;
	        vm.profil.email = vm.user.email ;
	      });

  		vm.ajout = function(profil)
  		{
  		
  			var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };

            var datas = $.param(
            {
            	profil:1,
                id:vm.user.id,      
                nom: profil.nom,
                prenom: profil.prenom,
               // cin: profil.cin,
                email: profil.email,
                password: profil.mdp
                
            });

            apiFactory.add("utilisateurs/index",datas, config)
                .success(function (data) 
                {
                    // console.log('update');
                    var confirm = $mdDialog.confirm()
                        .title('Mis à jour du compte avec succès!')
                        .textContent('Votre nouveau mot de passe est : '+profil.mdp)
                        .ariaLabel('Lucky day')
                        .clickOutsideToClose(true)
                        .parent(angular.element(document.body))
                        .ok('ok');
                    $mdDialog.show(confirm).then(function() {
                    
                    
                    }, function() {
                    //alert('rien');
                    });

                });
  		}

     
     
    }
})();
