(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.production_commerce_region')
        .controller('production_commerce_regionController', production_commerce_regionController);

    /** @ngInject */
    function production_commerce_regionController(apiFactory, $scope, $mdDialog)
    {
        var vm = this;

        vm.affiche_load = true ;

		vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			order:[] 
		};

		//CLE ETRANGERE
			
			apiFactory.getAll("region/index").then(function(result)
			{
				vm.affiche_load = false ;
				vm.all_region = result.data.response;
		
			});

			/*apiFactory.getAll("district/index").then(function(result)
			{
				vm.all_district = result.data.response;
				
			});*/

			apiFactory.getAll("SIP_espece/index").then(function(result)
			{
				vm.all_espece = result.data.response;
				
			});


			//id_type_espece = 1 (halieutique)
			/*apiFactory.getAPIgeneraliserREST("SIP_espece/index","id_type_espece",1).then(function(result)
			{
				vm.all_espece = result.data.response;
				
			});*/

		//FIN CLE ETRANGERE

		vm.date_now = new Date();

		vm.affiche_load = true ;

		var nouvel_production_commercialisation_region = false ;

		vm.selected_production_commercialisation_region = true ;

		vm.selected_production_commercialisation_region = {};
		

		vm.entete_liste_production_commercialisation_region = 
	        [
				{titre:"Code activ"},
				{titre:"Code dom"},
				{titre:"Code act_dom"},
				{titre:"Annee"},
				{titre:"Mois"},
				{titre:"Espèce"},
				{titre:"Quantité"},
				{titre:"Quantité en nombre"},
				{titre:"Code comm"},
				{titre:"Quantité comm"},
				{titre:"Région"}
	        ] ;

		
	    vm.all_production_commercialisation_region = [];
		vm.get_prod_com_by_region = function()
		{
			vm.affiche_load = true ;
			apiFactory.getParamsDynamic("SIP_production_commercialisation_region/index?id_region="+vm.production_commercialisation_region.id_region).then(function(result)
			{
				vm.affiche_load = false ;
				vm.all_production_commercialisation_region = result.data.response;
				
			});
		}


		vm.selection_production_commercialisation_region = function(cm)
		{
			vm.selected_production_commercialisation_region = cm ;

		}

		$scope.$watch('vm.selected_production_commercialisation_region', function()
		{
			if (!vm.all_production_commercialisation_region) return;
			vm.all_production_commercialisation_region.forEach(function(item)
			{
				item.$selected = false;
			});
			vm.selected_production_commercialisation_region.$selected = true;

		});

		function convert_to_date_sql(date)
		{   
			if(date)
			{
				var d     = new Date(date);
				var jour  = d.getDate();
				var mois  = d.getMonth()+1;
				var annee = d.getFullYear();
				if(mois <10)
				{
					mois = '0' + mois;
				}
				if(jour <10)
				{
					jour = '0' + jour;
				}
				var date_final= annee+"-"+mois+"-"+jour;
				return date_final
			}      
		}

		vm.convert_to_date_html = function(date)
		{   
			if(date)
			{
				var d     = new Date(date);
				var jour  = d.getDate();
				var mois  = d.getMonth()+1;
				var annee = d.getFullYear();
				if(mois <10)
				{
					mois = '0' + mois;
				}
				if(jour <10)
				{
					jour = '0' + jour;
				}
				var date_final= jour+"-"+mois+"-"+annee;
				return date_final
			}      
		}

		vm.formatMillier = function (nombre) 
		{   
			var nbr=parseFloat(nombre).toFixed(0);
			if (typeof nbr != 'undefined' && parseInt(nbr) >= 0) 
			{
				nbr += '';
				var sep = ' ';
				var reg = /(\d+)(\d{3})/;
				while (reg.test(nbr)) 
				{
					nbr = nbr.replace(reg, '$1' + sep + '$2');
				}
				return nbr;
			} 
			else 
			{
			return "";
			}
		}


		vm.replace_point = function(nbr)
		{
			var str = ""+nbr ;
			var res = str.replace(".",",") ;
			return res ;
		}


		vm.affichage_mois = function(mois)
		{
			switch (Number(mois)) 
			{
				case 1:
					return "Janvier";
				case 2:
					return "Février";
				case 3:
					return "Mars";
				case 4:
					return "Avril";
				case 5:
					return "Mai";
				case 6:
					return "Juin";
				case 7:
					return "Juillet";
				case 8:
					return "Août";
				case 9:
					return "Septembre";
				case 10:
					return "Octobre";
				case 11:
					return "Novembre";
				case 12:
					return "Décembre";
					
				default:
					
					break;
			}
		}


		vm.ajout_production_commercialisation_region = function()
		{
			vm.col_mar = {};
			vm.production_commercialisation_region = {};
			vm.affichage_masque_production_commercialisation_region = true ;
			nouvel_production_commercialisation_region = true ;
		}

		vm.modif_production_commercialisation_region = function()
		{
			nouvel_production_commercialisation_region = false ;
			vm.affichage_masque_production_commercialisation_region = true ;

			vm.production_commercialisation_region.code_activ = vm.selected_production_commercialisation_region.code_activ ;
			vm.production_commercialisation_region.code_dom = vm.selected_production_commercialisation_region.code_dom ;
			vm.production_commercialisation_region.code_act_dom = vm.selected_production_commercialisation_region.code_act_dom ;
			vm.production_commercialisation_region.annee = vm.selected_production_commercialisation_region.annee ;
			vm.production_commercialisation_region.mois = vm.selected_production_commercialisation_region.mois ;

			vm.production_commercialisation_region.id_espece = vm.selected_production_commercialisation_region.id_espece ;

			vm.production_commercialisation_region.id_region = vm.selected_production_commercialisation_region.id_region ;

			vm.production_commercialisation_region.quantite_en_nbre = Number(vm.selected_production_commercialisation_region.quantite_en_nbre) ;
			vm.production_commercialisation_region.quantite = Number(vm.selected_production_commercialisation_region.quantite) ;
			vm.production_commercialisation_region.code_comm = (vm.selected_production_commercialisation_region.code_comm) ;
			vm.production_commercialisation_region.quantite_comm = Number(vm.selected_production_commercialisation_region.quantite_comm) ;
		}


		vm.supprimer_production_commercialisation_region = function()
		{
			vm.affichage_masque_production_commercialisation_region = false ;
			
			var confirm = $mdDialog.confirm()
			  .title('Etes-vous sûr de supprimer cet enregistrement ?')
			  .textContent('')
			  .ariaLabel('Lucky day')
			  .clickOutsideToClose(true)
			  .parent(angular.element(document.body))
			  .ok('ok')
			  .cancel('annuler');
			$mdDialog.show(confirm)
			.then(
				function() 
				{
					vm.save_in_bdd_production_commercialisation_region(vm.selected_production_commercialisation_region,1);
				}, 
				function() 
				{

				}
			);
		}


		vm.annuler_production_commercialisation_region = function()
		{
			nouvel_production_commercialisation_region = false ;
			vm.affichage_masque_production_commercialisation_region = false ;
			vm.selected_production_commercialisation_region = {};
		}


		vm.save_in_bdd_production_commercialisation_region = function(data_masque, etat_suppression)
		{
			var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };

            var id = 0 ;

            if (!nouvel_production_commercialisation_region) 
            {
            	id = vm.selected_production_commercialisation_region.id ;
            }

            var datas = $.param(
            {
            	
                id:id,            
                supprimer:etat_suppression,
                code_activ:data_masque.code_activ,
                code_dom:data_masque.code_dom,
                code_act_dom:data_masque.code_act_dom,
                annee:data_masque.annee,
                mois:data_masque.mois,
                id_espece:data_masque.id_espece,
                quantite:data_masque.quantite,
                quantite_en_nbre:data_masque.quantite_en_nbre,
                code_comm:data_masque.code_comm,
                quantite_comm:data_masque.quantite_comm,
                id_region:data_masque.id_region
               
                
            });

            apiFactory.add("SIP_production_commercialisation_region/index",datas, config).success(function (data)
    		{
    			var reg = vm.all_region.filter(function(obj)
				{
					return obj.id == data_masque.id_region;
				});

				
				var esp = vm.all_espece.filter(function(obj)
				{
					return obj.id == data_masque.id_espece;
				});


    			if (!nouvel_production_commercialisation_region) 
    			{
    				if (etat_suppression == 0) 
    				{


    					vm.selected_production_commercialisation_region.code_activ = data_masque.code_activ ;
    					vm.selected_production_commercialisation_region.code_dom = data_masque.code_dom ;
    					vm.selected_production_commercialisation_region.code_act_dom = data_masque.code_act_dom ;
    					vm.selected_production_commercialisation_region.annee = data_masque.annee ;
    					vm.selected_production_commercialisation_region.mois = data_masque.mois ;

    					vm.selected_production_commercialisation_region.id_espece = data_masque.id_espece ;
    					vm.selected_production_commercialisation_region.nom = esp[0].nom ;
    					vm.selected_production_commercialisation_region.nom_scientifique = esp[0].nom_scientifique ;
    					vm.selected_production_commercialisation_region.nom_francaise = esp[0].nom_francaise ;
    					vm.selected_production_commercialisation_region.nom_local = esp[0].nom_local ;

    					vm.selected_production_commercialisation_region.id_region = data_masque.id_region ;
    					vm.selected_production_commercialisation_region.nom_region = reg[0].nom ;

    					vm.selected_production_commercialisation_region.quantite = data_masque.quantite ;
						vm.selected_production_commercialisation_region.quantite_en_nbre = data_masque.quantite_en_nbre ;
						vm.selected_production_commercialisation_region.code_comm = data_masque.code_comm ;
						vm.selected_production_commercialisation_region.quantite_comm = data_masque.quantite_comm ;
    				}
    				else
    				{
    					vm.all_production_commercialisation_region = vm.all_production_commercialisation_region.filter(function(obj)
						{
							return obj.id !== vm.selected_production_commercialisation_region.id;
						});
    				}
    			}
    			else
    			{
    				var item =
		            {
						id:String(data.response) ,


						code_activ:data_masque.code_activ,
						code_dom:data_masque.code_dom,
						code_act_dom:data_masque.code_act_dom,
						annee:data_masque.annee,
						mois:data_masque.mois,

						id_espece : data_masque.id_espece ,
    					nom : esp[0].nom ,
    					nom_scientifique : esp[0].nom_scientifique ,
    					nom_francaise : esp[0].nom_francaise ,
    					nom_local : esp[0].nom_local ,

						id_region:data_masque.id_region,
						nom_region:reg[0].nom,

						quantite_en_nbre:data_masque.quantite_en_nbre,
						quantite:data_masque.quantite,
						code_comm:data_masque.code_comm,
						quantite_comm:data_masque.quantite_comm

		                            
					}          
		            vm.all_production_commercialisation_region.unshift(item);
    			}

    			vm.affichage_masque_production_commercialisation_region = false ;
    			nouvel_production_commercialisation_region = false ;
    		})
    		.error(function (data) {alert("Une erreur s'est produit");});
		}
		

      
    }
})();
