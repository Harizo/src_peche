(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.coefficient_conversion')
        .controller('coefficient_conversionController', coefficient_conversionController);

    /** @ngInject */
    function coefficient_conversionController(apiFactory, $scope, $mdDialog)
    {
    	var vm = this ;

    	vm.affichage_masque = false ;
    	var nouvelle_coefficient_conversion = false ;
    	vm.selected_coefficient_conversion = {} ;
    	vm.affiche_load = true ;

    	vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			retrieve:'true',
			order:[] 
		};

		vm.entete_liste_coefficient_conversion = 
        [
			{titre:"Espèce"},
			{titre:"Présentation"},
			{titre:"Conservation"},
			{titre:"Coefficient"}
        ] ;

    	//CLE ETRANGERE
    		apiFactory.getAll("SIP_presentation/index").then(function(result)
			{
				vm.all_presentation = result.data.response;
				vm.affichage_presentation = function(id)
				{
					var tab = vm.all_presentation ;

					if (id != '0' && id) 
					{
						var elem = tab.filter(function(obj)
						{
							return obj.id == id ;
						}) ;

						return elem[0].libelle ;
					}
					else
						return "-";
				}
				vm.affiche_load = false ;

			});

			apiFactory.getAll("SIP_conservation/index").then(function(result)
			{
				vm.all_conservation = result.data.response;
				vm.affichage_conservation = function(id)
				{
					var tab = vm.all_conservation ;

					if (id != '0' && id) 
					{
						var elem = tab.filter(function(obj)
						{
							return obj.id == id ;
						}) ;

						return elem[0].libelle ;
					}
					else
						return "-";
				}
				vm.affiche_load = false ;
			});

			apiFactory.getAll("SIP_espece/index").then(function(result)
			{
				vm.all_espece = result.data.response;
				vm.affiche_load = false ;
			
				vm.affichage_espece = function(id)
				{
					var tab = vm.all_espece ;

					if (id) 
					{
						var elem = tab.filter(function(obj)
						{
							return obj.id == id ;
						}) ;

						return elem[0].nom ;
					}
					else
						return "-";
				}
				
			});


			
    	//FIN CLE ETRANGERE


    	apiFactory.getAll("SIP_coefficient_conversion/index").then(function(result)
		{
			vm.all_coefficient_conversion = result.data.response;
			vm.affiche_load = false ;

			
		});


		

		
		

		vm.replace_point = function(nbr)
		{
			var str = ""+nbr ;
			var res = str.replace(".",",") ;
			return res ;
		}


		vm.selection_coefficient_conversion = function(item)
		{
			vm.selected_coefficient_conversion = item ;

		}

		$scope.$watch('vm.selected_coefficient_conversion', function()
		{
			if (!vm.all_coefficient_conversion) return;
			vm.all_coefficient_conversion.forEach(function(item)
			{
				item.$selected = false;
			});
			vm.selected_coefficient_conversion.$selected = true;

		});

		vm.ajout_coefficient_conversion = function()
		{
			vm.affichage_masque = true ;
			nouvelle_coefficient_conversion = true ;
			vm.coefficient_conservation = {} ;
			vm.selected_coefficient_conversion = {} ;
		}

		vm.modif_coefficient_conversion = function()
		{
			nouvelle_coefficient_conversion = false ;
			vm.affichage_masque = true ;
			vm.coefficient_conservation.id_espece = vm.selected_coefficient_conversion.id_espece ;
			vm.coefficient_conservation.id_presentation = vm.selected_coefficient_conversion.id_presentation ;
			vm.coefficient_conservation.id_conservation = vm.selected_coefficient_conversion.id_conservation ;
			vm.coefficient_conservation.coefficient = Number(vm.selected_coefficient_conversion.coefficient) ;
		}

		vm.annuler = function()
		{
			vm.affichage_masque = false ;
			nouvelle_coefficient_conversion = false ;
		}

		vm.supprimer_coefficient_conversion = function()
			{
				vm.affichage_masque_commerce = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Etes-vous sûr de supprimer cet enregistrement ?')
				  .textContent('')
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_in_bdd(vm.selected_coefficient_conversion,1);
				}, function() {
				//alert('rien');
				});
			}

		function teste_existance(data_masque)
		{
			if (!data_masque.id_presentation) 
			{
				data_masque.id_presentation = '0';
			}
			if (!data_masque.id_conservation) 
			{
				data_masque.id_conservation = '0';
			}
			var reps = vm.all_coefficient_conversion.filter(function(obj)
			{
				return 	(
							(obj.id_espece == data_masque.id_espece)
							&&(obj.id_presentation == data_masque.id_presentation) 
							&&(obj.id_conservation == data_masque.id_conservation)
						) ;
			});

			return reps;
		}

		vm.teste_existance = function(data_masque, etat_suppression)
		{
			var etat_existance = teste_existance(data_masque);
			if (etat_existance.length > 0)  
			{
				var confirm = $mdDialog.confirm()
				  .title('Attention!')
				  .textContent('Cet enregistrement exite déjà dans la base de données.')
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok');
				$mdDialog.show(confirm).then(function() {

				
				}, function() {
				//alert('rien');
				});
			}
			else
			{
				vm.save_in_bdd(data_masque, etat_suppression);
			}
		}

		vm.save_in_bdd = function(data_masque, etat_suppression)
		{
			vm.affiche_load = true ;
			var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };

	            var id = 0 ;

	            if (!nouvelle_coefficient_conversion) 
	            {
	            	id = vm.selected_coefficient_conversion.id ;
	            }

	           

	            var datas = $.param(
	            {
	            	
	                id:id,      
	                supprimer:etat_suppression,
	                id_espece:data_masque.id_espece,
	                id_presentation:data_masque.id_presentation,
	                id_conservation:data_masque.id_conservation,
	                coefficient:data_masque.coefficient
	                
	                
	            });

	            apiFactory.add("SIP_coefficient_conversion/index",datas, config).success(function (data)
        		{
        			if (!nouvelle_coefficient_conversion) 
        			{
        				if (etat_suppression == 0) 
        				{
        					

        					vm.selected_coefficient_conversion.id_espece = data_masque.id_espece ;
        					vm.selected_coefficient_conversion.id_presentation = data_masque.id_presentation ;
        					vm.selected_coefficient_conversion.id_conservation = data_masque.id_conservation ;
        					vm.selected_coefficient_conversion.coefficient = data_masque.coefficient ;
        				}
        				else
        				{
        					vm.all_coefficient_conversion = vm.all_coefficient_conversion.filter(function(obj)
							{
								return obj.id !== vm.selected_coefficient_conversion.id ;
							});
        				}

        			}
        			else
        			{
        				var item = {
        					id:String(data.response) ,
        					id_espece:data_masque.id_espece,
			                id_presentation:data_masque.id_presentation,
			                id_conservation:data_masque.id_conservation,
			                coefficient:data_masque.coefficient,
			                $selected:true
        				}

        				vm.all_coefficient_conversion.unshift(item) ;
        			}
        			nouvelle_coefficient_conversion = false ;
        			vm.affichage_masque = false ;
        			vm.affiche_load = false ;
        		})
        		.error(function (data) {alert("Une erreur s'est produit");});
		}
    }
})();