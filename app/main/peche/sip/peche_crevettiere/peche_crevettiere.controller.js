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
    	vm.date_now = new Date();


    	vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			/*retrieve: 'true',*/
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

		//clé étrangère
			apiFactory.getParamsDynamic("SIP_espece/index?id_type_espece=2").then(function(result)
			{
				vm.all_espece = result.data.response;
				console.log(vm.all_espece);
				
			});

			apiFactory.getAll("SIP_presentation/index").then(function(result)
			{
				vm.all_presentation = result.data.response;
			});

			apiFactory.getAll("SIP_conservation/index").then(function(result)
			{
				vm.all_conservation = result.data.response;
			});
		//fin clé étrangère

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
				vm.all_commerce = [];
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
				console.log(item);
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

			vm.ajout_commerce_crevette = function()
			{
				vm.affichage_masque_commerce = true ;
				nouvelle_commerce = true ;
				vm.commerce_crevette = {} ;
				vm.selected_commerce = {} ;
			}

			vm.modif_commerce_crevette = function()
			{
				nouvelle_commerce = false ;
				vm.affichage_masque_commerce = true ;

				vm.commerce_crevette.annee = vm.selected_commerce.annee ;
				vm.commerce_crevette.mois = vm.selected_commerce.mois ;
				vm.commerce_crevette.produit = vm.selected_commerce.id_produit ;
				vm.commerce_crevette.id_presentation = vm.selected_commerce.id_presentation ;
				vm.commerce_crevette.id_conservation = vm.selected_commerce.id_conservation ;
				vm.commerce_crevette.qte_vl = Number(vm.selected_commerce.qte_vl) ;
				vm.commerce_crevette.pum_vl = Number(vm.selected_commerce.pum_vl) ;
				vm.commerce_crevette.val_vl = Number(vm.selected_commerce.val_vl) ;
				vm.commerce_crevette.qte_exp = Number(vm.selected_commerce.qte_exp) ;
				vm.commerce_crevette.pum_exp = Number(vm.selected_commerce.pum_exp) ;
				vm.commerce_crevette.val_exp = Number(vm.selected_commerce.val_exp) ;
				vm.commerce_crevette.dest_exp = vm.selected_commerce.dest_exp 
			}

			vm.supprimer_commerce_crevette = function()
			{
				vm.affichage_masque_commerce_marine = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Etes-vous sûr de supprimer cet enregistrement ?')
				  .textContent('Commercialisation société: '+vm.selected_societe_crevette.nom)
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_in_bdd_commerce(vm.selected_commerce,1);
				}, function() {
				//alert('rien');
				});
			}

			vm.annuler_commerce = function()
			{
				nouvelle_commerce = false ;
				vm.affichage_masque_commerce = false ;
				vm.selected_commerce = {};
			}

			vm.save_in_bdd_commerce = function(data_masque, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };

	            var id = 0 ;

	            if (!nouvelle_commerce) 
	            {
	            	id = vm.selected_commerce.id ;
	            }



	            var datas = $.param(
	            {
	            	
	                id:id,      
	                supprimer:etat_suppression,
	                id_societe_crevette:vm.selected_societe_crevette.id,
	                annee:data_masque.annee,
	                mois:data_masque.mois,
	                produit:data_masque.produit,
	                id_presentation:data_masque.id_presentation,
	                id_conservation:data_masque.id_conservation,
	                qte_vl:data_masque.qte_vl,
	                pum_vl:data_masque.pum_vl,
	                val_vl:data_masque.val_vl,
	                qte_exp:data_masque.qte_exp,
	                pum_exp:data_masque.pum_exp,
	                val_exp:data_masque.val_exp,
	                dest_exp:data_masque.dest_exp
	                
	                
	            });

	            apiFactory.add("SIP_commercialisation_crevette/index",datas, config).success(function (data)
        		{
        			var cons = vm.all_conservation.filter(function(obj)
					{
						return obj.id == data_masque.id_conservation;
					});

					var pres = vm.all_presentation.filter(function(obj)
					{
						return obj.id == data_masque.id_presentation;
					});

					var prod = vm.all_espece.filter(function(obj)
					{
						return obj.id == data_masque.produit;
					});

					if (!nouvelle_commerce) 
        			{
        				if (etat_suppression == 0) 
        				{
        					vm.selected_commerce.annee = data_masque.annee ;
			                vm.selected_commerce.mois = data_masque.mois ;

			                vm.selected_commerce.id_produit = data_masque.produit ;
			                vm.selected_commerce.nom_produit = prod[0].nom  ;

			                vm.selected_commerce.id_presentation = data_masque.id_presentation ;
			                vm.selected_commerce.libelle_presentation = pres[0].libelle ;

			                vm.selected_commerce.id_conservation = data_masque.id_conservation ;
			                vm.selected_commerce.libelle_conservation = cons[0].libelle ;

							

			                vm.selected_commerce.qte_vl = data_masque.qte_vl ;
			                vm.selected_commerce.pum_vl = data_masque.pum_vl ;
			                vm.selected_commerce.val_vl = data_masque.val_vl ;
			                vm.selected_commerce.qte_exp = data_masque.qte_exp ;
			                vm.selected_commerce.pum_exp = data_masque.pum_exp ;
			                vm.selected_commerce.val_exp = data_masque.val_exp ;
			                vm.selected_commerce.dest_exp = data_masque.dest_exp ;
        				}
        				else 
        				{
        					vm.all_commerce = vm.all_commerce.filter(function(obj)
							{
								return obj.id !== vm.selected_commerce.id ;
							});
						
        				}

        			}
        			else
        			{
        				var item =
			            {
							id:String(data.response) ,

							id_societe_crevette:vm.selected_societe_crevette.id,

							annee:data_masque.annee,
							mois:data_masque.mois,

							id_conservation:data_masque.id_conservation,
							libelle_conservation:cons[0].libelle,

							id_presentation:data_masque.id_presentation,
							libelle_presentation:pres[0].libelle,

							id_produit:data_masque.produit,
							nom_produit:prod[0].nom,

							qte_vl:data_masque.qte_vl,
			                pum_vl:data_masque.pum_vl,
			                val_vl:data_masque.val_vl,
			                qte_exp:data_masque.qte_exp,
			                pum_exp:data_masque.pum_exp,
			                val_exp:data_masque.val_exp,
			                dest_exp:data_masque.dest_exp
			                            
						}          
			            vm.all_commerce.unshift(item);

			            nouvelle_commerce = false ;

        			}

			        vm.affichage_masque_commerce = false ;
        		})
        		.error(function (data) {alert("Une erreur s'est produit");});
			}
    	//FIN COMMERCIALISATION

    	//EXPORTATION

    		var nouvelle_exportation = false ;
    		vm.affichage_masque_exportation = false ; 
    		vm.selected_exportation = {} ;
    		vm.exportation = {} ;

    		vm.entete_liste_commerce = 
	        [
				{titre:"Année"},
				{titre:"Mois"},
				{titre:"Date VISA"},
				{titre:"Numero VISA"},
				{titre:"Date COS"},
				{titre:"Numero COS"},
				{titre:"Date EDRD"},
				{titre:"Présentation"},
				{titre:"Conservation"},
				{titre:"Déstination Export"},
				{titre:"Qté"},
				{titre:"Valeur en Ar"},
				{titre:"Valeur en Euro"},
				{titre:"Valeur en USD"}
	        ] ;

    		vm.get_exportation = function()
			{
				vm.affiche_load = true ;
				apiFactory.getParamsDynamic("SIP_exportation_crevette?id_societe_crevette="+vm.selected_societe_crevette.id).then(function(result)
				{
					vm.affiche_load = false ;
					vm.all_exportation = result.data.response;
				});
			}

			vm.selection_exportation = function(item)
			{
				vm.selected_exportation = item ;
				console.log(item);
			}

			$scope.$watch('vm.selected_exportation', function()
			{
				if (!vm.all_exportation) return;
				vm.all_exportation.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_exportation.$selected = true;

			});
    	//FIN EXPORTATION
    }
})();