(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.peche_crevettiere')
        .controller('peche_crevettiereController', peche_crevettiereController);

    /** @ngInject */
    function peche_crevettiereController(apiFactory, $scope, $mdDialog)
    {
    	var vm = this ;

    	vm.affiche_load = true ;


    	vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			order:[] 
		};


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

    	//SOCIETE

    		var nouvelle_societe_crevette = false ;
    		vm.affichage_masque_societe_crevette = false ;
    		vm.selected_societe_crevette = {} ;
    		vm.societe_crevette = {} ;
    		vm.entete_liste_societe_crevette = 
	        [
				{titre:"Code"},
				{titre:"Nom"},
				{titre:"Debut validité"},
				{titre:"Fin validité"},
				{titre:"Base Géo"},
				{titre:"Base côte"},
				{titre:"Année de création"},
				{titre:"Type"}
	        ] ;
    		apiFactory.getAll("SIP_societe_crevette/index").then(function(result)
			{
				vm.affiche_load = false ;
				vm.all_societe_crevette = result.data.response;
			});

			vm.selection_societe_crevette = function(item)
			{
				vm.selected_societe_crevette = item ;
			}

			$scope.$watch('vm.selected_societe_crevette', function()
			{
				if (!vm.all_societe_crevette) return;
				vm.all_societe_crevette.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_societe_crevette.$selected = true;

			});


			vm.ajout_societe_crevette = function()
			{
				nouvelle_societe_crevette = true ;
				vm.societe_crevette = {} ;
				vm.selected_societe_crevette = {} ;
				vm.affichage_masque_societe_crevette = true ;
			}

			vm.modif_societe_crevette = function()
			{
				nouvelle_societe_crevette = false ;

				vm.societe_crevette.code = vm.selected_societe_crevette.code ;
                vm.societe_crevette.nom = vm.selected_societe_crevette.nom ;
                vm.societe_crevette.deb_validite = new Date(vm.selected_societe_crevette.deb_validite) ;
                vm.societe_crevette.fin_validite = new Date(vm.selected_societe_crevette.fin_validite) ;
                vm.societe_crevette.base_geo = vm.selected_societe_crevette.base_geo ;
                vm.societe_crevette.base_cote = vm.selected_societe_crevette.base_cote ;
                vm.societe_crevette.an_creation = vm.selected_societe_crevette.an_creation ;
                vm.societe_crevette.type = vm.selected_societe_crevette.type ;

                vm.affichage_masque_societe_crevette = true ;

			}

			vm.supprimer_societe_crevette = function()
			{
				vm.affichage_masque_societe_crevette = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Etes-vous sûr de supprimer cet enregistrement ?')
				  .textContent('')
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_in_bdd(vm.selected_societe_crevette,1);
				}, function() {
				//alert('rien');
				});
			}

			vm.annuler_societe_crevette = function()
			{
				vm.affichage_masque_societe_crevette = false ;
			}


			vm.save_in_bdd = function(donnees, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };

	            var id = 0 ;

	            if (!nouvelle_societe_crevette) 
	            {
	            	id = vm.selected_societe_crevette.id ;
	            }

	            var datas = $.param(
	            {
	            	
	                id:id,      
	                supprimer:etat_suppression,
	                code:donnees.code,
	                nom:donnees.nom,
	                deb_validite:convert_to_date_sql(donnees.deb_validite),
	                fin_validite:convert_to_date_sql(donnees.fin_validite),
	                base_geo:donnees.base_geo,
	                base_cote:donnees.base_cote,
	                an_creation:donnees.an_creation,
	                type:donnees.type
	                
	                
	            });

	            apiFactory.add("SIP_societe_crevette/index",datas, config).success(function (data)
        		{
        			if (!nouvelle_societe_crevette) 
        			{
        				if (etat_suppression == 0) 
        				{
        					vm.selected_societe_crevette.code = vm.societe_crevette.code ;
                			vm.selected_societe_crevette.nom = vm.societe_crevette.nom ;	
			                vm.selected_societe_crevette.deb_validite = convert_to_date_sql(vm.societe_crevette.deb_validite) ;
			                vm.selected_societe_crevette.fin_validite = convert_to_date_sql(vm.societe_crevette.fin_validite) ;
			                vm.selected_societe_crevette.base_geo = vm.societe_crevette.base_geo ;
			                vm.selected_societe_crevette.base_cote = vm.societe_crevette.base_cote ;
			                vm.selected_societe_crevette.an_creation = vm.societe_crevette.an_creation ;
			                vm.selected_societe_crevette.type = vm.societe_crevette.type ;
        				}
        				else
        				{
        					vm.all_societe_crevette = vm.all_societe_crevette.filter(function(obj)
							{
								return obj.id !== vm.selected_societe_crevette.id;
							});
        				}
        			}
        			else
        			{
        				var item =
			            {
							id:String(data.response) ,
							code:donnees.code,
							nom:donnees.nom,
							deb_validite:convert_to_date_sql(donnees.deb_validite),
			                fin_validite:convert_to_date_sql(donnees.fin_validite),
			                base_geo:donnees.base_geo,
			                base_cote:donnees.base_cote,
			                an_creation:donnees.an_creation,
			                type:donnees.type                 
						}          
			            vm.all_societe_crevette.unshift(item);
        			}

        			vm.affichage_masque_societe_crevette = false ; //Fermeture de la masque de saisie
	        		nouvelle_societe_crevette = false;
        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
    	//FIN SOCIETE

    	//COMMERCIALISATION
    		var nouvelle_commerce = false ;
    		vm.affichage_masque_commerce = false ;
    		vm.selected_commerce = {} ;
    		vm.commerce = {} ;
    		vm.entete_liste_commerce = 
	        [
				{titre:"Année"},
				{titre:"Mois"},
				{titre:"Produit"},
				{titre:"Présentation"},
				{titre:"Conservation"},
				{titre:"Qté VL"},
				{titre:"PUM VL"},
				{titre:"Val VL"},
				{titre:"Qté Exp"},
				{titre:"PUM Exp"},
				{titre:"Val Exp"},
				{titre:"Déstination Export"}
	        ] ;
    		


			vm.get_commerce = function()
			{
				vm.affiche_load = true ;
				apiFactory.getParamsDynamic("SIP_commercialisation_crevette?id_societe_crevette="+vm.selected_societe_crevette.id).then(function(result)
				{
					vm.affiche_load = false ;
					vm.all_commerce = result.data.response;
				});
			}

			vm.selection_commerce = function(item)
			{
				vm.selected_commerce = item ;
			}

			$scope.$watch('vm.selected_commerce', function()
			{
				if (!vm.all_commerce) return;
				vm.all_commerce.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_commerce.$selected = true;

			});
    	//FIN COMMERCIALISATION
    }
})();