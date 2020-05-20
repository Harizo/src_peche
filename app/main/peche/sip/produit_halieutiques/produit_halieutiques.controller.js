(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.produit_halieutiques')
        .controller('produit_halieutiquesController', produit_halieutiquesController);

    /** @ngInject */
    function produit_halieutiquesController(apiFactory, $scope, $mdDialog)
    {
        var vm = this;

        

		vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth: false,
			responsive: true
		};


		

		//Collecteur mareyeur

			vm.selected_collecteur_mareyeur = {};

			var nouvel_col_mar = false ;

			vm.affichage_masque_collecteur_mareyeur = false ;

			vm.entete_liste_collecteur_mareyeur = 
	        [
				{titre:"Code"},
				{titre:"Nom"},
				{titre:"Type genre"},
				{titre:"Adresse"},
				{titre:"Référence autorisation"},
				{titre:"Collecteur/Mareyeur"}/*,
				{titre:"Col. eau douce?"},
				{titre:"Mareyeur?"}*/
	        ] ;

			apiFactory.getAll("SIP_collecteur_mareyeur/index").then(function(result)
			{
				vm.all_collecteur_mareyeur = result.data.response;
			});


			vm.affichage_col_mar = function(int)
			{
				if (int == '0') 
					return "Non";
				else
					return "Oui";
			}

			vm.affichage_col_mar_bool = function(bool)
			{
				if (!bool) 
					return "Non";
				else
					return "Oui";
			}

			vm.selection_collecteur_mareyeur = function(cm)
			{
				vm.selected_collecteur_mareyeur = cm ;
			}

			$scope.$watch('vm.selected_collecteur_mareyeur', function()
			{
				if (!vm.all_collecteur_mareyeur) return;
				vm.all_collecteur_mareyeur.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_collecteur_mareyeur.$selected = true;

			});


			vm.ajout_col_mar = function()
			{
				vm.col_mar = {};
				vm.selected_collecteur_mareyeur = {};
				vm.affichage_masque_collecteur_mareyeur = true ;
				nouvel_col_mar = true ;
			}

			vm.convert_int_to_boll = function(int)
			{
				if (int == '0') 
					return false;
				else
					return true;
			}

			vm.convert_bool_to_int = function(int)
			{
				if (int) 
					return "1";
				else
					return "0";
			}


			vm.modif_col_mar = function()
			{
				nouvel_col_mar = false ;
				vm.affichage_masque_collecteur_mareyeur = true ;

				vm.col_mar.code = vm.selected_collecteur_mareyeur.code ;
				vm.col_mar.nom = vm.selected_collecteur_mareyeur.nom ;
				vm.col_mar.type_genre = vm.selected_collecteur_mareyeur.type_genre ;
				vm.col_mar.adresse = vm.selected_collecteur_mareyeur.adresse ;
				vm.col_mar.ref_autorisation = vm.selected_collecteur_mareyeur.ref_autorisation ;
				vm.col_mar.is_coll_eau_douce = vm.convert_int_to_boll(vm.selected_collecteur_mareyeur.is_coll_eau_douce) ;
				vm.col_mar.is_coll_marine = vm.convert_int_to_boll(vm.selected_collecteur_mareyeur.is_coll_marine) ;
				vm.col_mar.is_mareyeur = vm.convert_int_to_boll(vm.selected_collecteur_mareyeur.is_mareyeur) ;
			}

			vm.annuler_col_mar = function()
			{
				nouvel_col_mar = false ;
				vm.affichage_masque_collecteur_mareyeur = false ;
				vm.selected_collecteur_mareyeur = {};
			}


			vm.supprimer_col_mar = function() 
			{
				vm.affichage_masque_collecteur_mareyeur = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Etes-vous sûr de supprimer cet enregistrement ?')
				  .textContent('')
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_in_bdd(vm.selected_collecteur_mareyeur,1);
				}, function() {
				//alert('rien');
				});
			}


			vm.save_in_bdd = function(data_masque, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };

	            var id = 0 ;

	            if (!nouvel_col_mar) 
	            {
	            	id = vm.selected_collecteur_mareyeur.id ;
	            }



	            var datas = $.param(
	            {
	            	
	                id:id,      
	                supprimer:etat_suppression,
	                code:data_masque.code,
	                type_genre:data_masque.type_genre,
	                nom:data_masque.nom,
	                adresse:data_masque.adresse,
	                ref_autorisation:data_masque.ref_autorisation,
	                is_coll_eau_douce:vm.convert_bool_to_int(data_masque.is_coll_eau_douce),
	                is_coll_marine:vm.convert_bool_to_int(data_masque.is_coll_marine),
	                is_mareyeur:vm.convert_bool_to_int(data_masque.is_mareyeur)
	                
	                
	            });


	            apiFactory.add("SIP_collecteur_mareyeur/index",datas, config).success(function (data)
        		{
        			if (!nouvel_col_mar) 
        			{
        				if (etat_suppression == 0) //mise à jour
        				{
        					vm.selected_collecteur_mareyeur.code = 

        					vm.selected_collecteur_mareyeur.code = data_masque.code,
			                vm.selected_collecteur_mareyeur.type_genre = data_masque.type_genre,
			                vm.selected_collecteur_mareyeur.nom = data_masque.nom,
			                vm.selected_collecteur_mareyeur.adresse = data_masque.adresse,
			                vm.selected_collecteur_mareyeur.ref_autorisation = data_masque.ref_autorisation,
			                vm.selected_collecteur_mareyeur.is_coll_eau_douce = vm.convert_bool_to_int(data_masque.is_coll_eau_douce),
			                vm.selected_collecteur_mareyeur.is_coll_marine = vm.convert_bool_to_int(data_masque.is_coll_marine),
			                vm.selected_collecteur_mareyeur.is_mareyeur = vm.convert_bool_to_int(data_masque.is_mareyeur)

        				}
        				else//Suppression
        				{
        					vm.all_collecteur_mareyeur = vm.all_collecteur_mareyeur.filter(function(obj)
							{
								return obj.id !== vm.selected_collecteur_mareyeur.id;
							});

        				}

        			}
        			else
        			{
        				var item =
			            {
							id:String(data.response) ,
							code:data_masque.code,
							type_genre:data_masque.type_genre,
							nom:data_masque.nom,
							adresse:data_masque.adresse,
							ref_autorisation:data_masque.ref_autorisation,
							is_coll_eau_douce:vm.convert_bool_to_int(data_masque.is_coll_eau_douce),
							is_coll_marine:vm.convert_bool_to_int(data_masque.is_coll_marine),
							is_mareyeur:vm.convert_bool_to_int(data_masque.is_mareyeur)                   
						}          
			            vm.all_collecteur_mareyeur.push(item);
        			}

        		vm.affichage_masque_collecteur_mareyeur = false ; //Fermeture de la masque de saisie
        		nouvel_col_mar = false;


        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
		//FIN Collecteur mareyeur
      
    }
})();
