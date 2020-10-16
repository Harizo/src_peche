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

        vm.affiche_load = true ;

		vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			order:[] 
		};
		

		//CLE ETRANGERE
			apiFactory.getAll("SIP_presentation/index").then(function(result)
			{
				vm.all_presentation = result.data.response;
			});

			apiFactory.getAll("SIP_conservation/index").then(function(result)
			{
				vm.all_conservation = result.data.response;
			});

			apiFactory.getAll("region/index").then(function(result)
			{
				vm.all_region = result.data.response;
				
		
			});

			apiFactory.getAll("district/index").then(function(result)
			{
				vm.all_district = result.data.response;
				vm.affiche_load = false ;
				
			});
			vm.get_district_by_region = function()
			{
				vm.filtre.id_district = null ;
			
				vm.allcommune = [];
				

				vm.alldistrict = vm.all_district.filter(function(obj)
				{
					return obj.region.id == vm.filtre.id_region;
				});
			}

			vm.filtre_col_mar = {} ;
			vm.get_district_by_region_filtre_col_mar = function()
			{
				vm.filtre_col_mar.id_district = null ;
				
				vm.alldistrict_col_mar = vm.all_district.filter(function(obj)
				{
					return obj.region.id == vm.filtre_col_mar.id_region;
				});
			}


			apiFactory.getAll("sip_type_espece/index").then(function(result)
			{
				vm.all_type_espece = result.data.response;
				
				
			});

			vm.affichage_type_espece = function(id)
			{
				
				var te = vm.all_type_espece.filter(function(obj)
				{
					return obj.id == id;
				}) ;

				return te[0].libelle ;
			}

			

			//id_type_espece = 1 et 5 (halieutique marine et eau douce)

			apiFactory.getAPIgeneraliserREST("SIP_espece/index",
											"eau_douce_marine",true,
											"id_type_espece1",5,
											"id_type_espece2",1).then(function(result)
			{
				vm.all_espece = result.data.response;
				
			});
		//FIN CLE ETRANGERE

		vm.date_now = new Date();

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
			

			if (nbr) 
			{
				var str = ""+nbr ;
				var res = str.replace(".",",") ;
				return res ;
			}
			else
			{
				return "";
			}
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

			/*apiFactory.getAll("SIP_collecteur_mareyeur/index").then(function(result)
			{
				vm.all_collecteur_mareyeur = result.data.response;
			});*/

			vm.reinit_reg_dist = function()
			{
				vm.filtre.id_region = null ;
				vm.filtre.id_district = null ;
			}

			vm.get_col_mar_by_district = function()
			{
				vm.affiche_load = true ;
				vm.selected_collecteur_mareyeur = {};
				apiFactory.getParamsDynamic("SIP_collecteur_mareyeur/index?id_district="+vm.filtre_col_mar.id_district).then(function(result)
				{
					vm.affiche_load = false ;
					vm.all_collecteur_mareyeur = result.data.response;
				});
			}


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

				//désélection fils
					vm.selected_permis = {};
					vm.selected_collecte = {} ;
				//fin désélection fils
				

				
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
        					

        					vm.selected_collecteur_mareyeur.code = data_masque.code ;
			                vm.selected_collecteur_mareyeur.type_genre = data_masque.type_genre ;
			                vm.selected_collecteur_mareyeur.nom = data_masque.nom ;
			                vm.selected_collecteur_mareyeur.adresse = data_masque.adresse ;
			                vm.selected_collecteur_mareyeur.ref_autorisation = data_masque.ref_autorisation ;
			                vm.selected_collecteur_mareyeur.is_coll_eau_douce = vm.convert_bool_to_int(data_masque.is_coll_eau_douce) ;
			                vm.selected_collecteur_mareyeur.is_coll_marine = vm.convert_bool_to_int(data_masque.is_coll_marine) ;
			                vm.selected_collecteur_mareyeur.is_mareyeur = vm.convert_bool_to_int(data_masque.is_mareyeur) ;

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
			            vm.all_collecteur_mareyeur.unshift(item);
        			}

	        		vm.affichage_masque_collecteur_mareyeur = false ; //Fermeture de la masque de saisie
	        		nouvel_col_mar = false;


        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
		//FIN Collecteur mareyeur


		//PERMIS
			

			vm.selected_permis = {};


			var nouvel_permis = false ;

			vm.affichage_masque_permis = false ;

			vm.entete_liste_permis = 
	        [
				{titre:"Numero"},
				{titre:"Date quittance"},
				{titre:"Région"},
				{titre:"District"}
	        ] ;

	        vm.get_permis = function()
	        {
	        	//GET COLLECTE PAR COLLECTEUR MAREYEUR
				apiFactory.getAPIgeneraliserREST("SIP_permis/index","id_collecteurs",vm.selected_collecteur_mareyeur.id).then(function(result)
				{
					vm.all_permis = result.data.response;
				});
				//FIN GET COLLECTE PAR COLLECTEUR MAREYEUR
	        }

	        vm.get_district = function()
	        {
	        	vm.permis.id_district = null;
				vm.all_district_by_region = vm.all_district.filter(function(obj)
				{
					return obj.region.id == vm.permis.id_region;
				});

	        }


	        vm.selection_permis = function(permis)
	        {
	        	vm.selected_permis = permis ;

	        	vm.get_especes_permis();
	        	

	        }
	        $scope.$watch('vm.selected_permis', function()
			{
				if (!vm.all_permis) return;
				vm.all_permis.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_permis.$selected = true;

			});

			vm.ajout_permis = function()
			{
				vm.permis = {};
				vm.selected_permis = {};
				vm.affichage_masque_permis = true ;
				nouvel_permis = true ;
			}


			vm.modif_permis = function()
			{
				nouvel_permis = false ;
				vm.affichage_masque_permis = true ;
				vm.permis.date_quittance = new Date(vm.selected_permis.date_quittance) ;
				vm.permis.numero_permis = vm.selected_permis.numero_permis ;
				//vm.permis.id_espece = vm.selected_permis.id_espece ;
				vm.permis.id_region = vm.selected_permis.id_region ;

				vm.get_district();
				vm.permis.id_district = vm.selected_permis.id_district ;
			}


			vm.supprimer_permis = function() 
			{
				vm.affichage_masque_collecteur_mareyeur = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Etes-vous sûr de supprimer cet permis ?')
				  .textContent('Numero permis: '+vm.selected_permis.numero_permis)
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_in_bdd_permis(vm.selected_collecteur_mareyeur,1);
				}, function() {
				//alert('rien');
				});
			}

			vm.annuler_permis = function()
			{
				vm.permis = {} ;
				nouvel_permis = false ;
				vm.affichage_masque_permis = false ;

			}


			vm.save_in_bdd_permis = function(permis, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };

	            var id = 0 ;

	            if (!nouvel_permis) 
	            {
	            	id = vm.selected_permis.id ;
	            }


	            var datas = $.param(
	            {
	            	
	                id:id,      
	                supprimer:etat_suppression,
	                id_collecteur_mareyeur:vm.selected_collecteur_mareyeur.id,
	               // id_espece:permis.id_espece,
	                id_district:permis.id_district,
	                numero_permis:permis.numero_permis,
	                date_quittance:convert_to_date_sql(permis.date_quittance)
	                
	            });


	            apiFactory.add("SIP_permis/index",datas, config).success(function (data)
        		{
        			/*var esp = vm.all_espece.filter(function(obj)
					{
						return obj.id == permis.id_espece;
					});*/

					var reg = vm.all_region.filter(function(obj)
					{
						return obj.id == permis.id_region;
					});

					var dist = vm.all_district.filter(function(obj)
					{
						return obj.id == permis.id_district;
					});
        			if (!nouvel_permis) 
        			{
        				if (etat_suppression == 0) //mise à jour
        				{
        					vm.selected_permis.date_quittance =  convert_to_date_sql(permis.date_quittance)   ;
        					vm.selected_permis.numero_permis =  permis.numero_permis ;

        					//vm.selected_permis.id_espece =  permis.id_espece ;
        					//vm.selected_permis.nom_espece =  esp[0].nom ;

        					vm.selected_permis.id_region =  permis.id_region ;
        					vm.selected_permis.nom_region =  reg[0].nom ;

        					vm.selected_permis.id_district =  permis.id_district ;
        					vm.selected_permis.nom_district =  dist[0].nom ;

        					
			              

        				}
        				else//Suppression
        				{
        					vm.all_permis = vm.all_permis.filter(function(obj)
							{
								return obj.id !== vm.selected_permis.id;
							});

        				}

        			}
        			else
        			{
        				var item =
			            {
							id:String(data.response) ,

							/*id_espece:permis.id_espece,
							nom_espece:esp[0].nom,*/

			                id_district:permis.id_district,
			                nom_district:dist[0].nom,

			                id_region:reg[0].id,
			                nom_region:reg[0].nom,

			                numero_permis:permis.numero_permis,
			                date_quittance:convert_to_date_sql(permis.date_quittance)             
						}          
			            vm.all_permis.unshift(item);
        			}

        			vm.affichage_masque_permis = false ; //Fermeture de la masque de saisie
        			nouvel_permis = false;


        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}


		//FIN PERMIS

		//ESPECE AUTORISE
			vm.selected_especes_permis = {};
			vm.especes_permis = {};


			vm.get_especes_permis = function()
			{

				apiFactory.getAPIgeneraliserREST("SIP_especes_permis/index","id_permis",vm.selected_permis.id).then(function(result)
				{
					vm.all_especes_permis = result.data.response;

					
				});

			}


			var nouvel_especes_permis = false ;

			vm.affichage_masque_especes_permis = false ;

			vm.entete_liste_especes_permis = 
	        [
				{titre:"Code 3 Alpha"},
				{titre:"Nom"},
				{titre:"Nom scientifique"},
				{titre:"Nom francaise"},
				{titre:"Nom local/vernaculaire"},
				{titre:"Type espèce"}
	        ] ;

	        vm.selection_especes_permis = function(especes_permis)
			{
				vm.selected_especes_permis = especes_permis ; 
				
			}

			$scope.$watch('vm.selected_especes_permis', function()
			{
				if (!vm.all_especes_permis) return;
				vm.all_especes_permis.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_especes_permis.$selected = true;

			});

			vm.ajout_especes_permis = function()
			{
				nouvel_especes_permis = true ;
				vm.affichage_masque_especes_permis = true ;

				vm.especes_permis = {} ;
				vm.selected_especes_permis = {} ;
			}


			vm.modif_especes_permis = function()
			{
				nouvel_especes_permis = false ;
				vm.affichage_masque_especes_permis = true ;

				vm.especes_permis.id_espece = vm.selected_especes_permis.id_espece ;

				


			}


			vm.supprimer_especes_permis = function()
			{
				vm.affichage_masque_especes_permis = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Etes-vous sûr de supprimer cet enregistrement ?')
				  .textContent('Espèce sur le permis: '+vm.selected_permis.numero_permis)
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_in_bdd_especes_permis(vm.selected_especes_permis,1);
				}, function() {
				//alert('rien');
				});
			}

			vm.annuler_especes_permis = function()
			{
				nouvel_especes_permis = false ;
				vm.affichage_masque_especes_permis = false ;
			}


			vm.save_in_bdd_especes_permis = function(especes_permis, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };

	            var id = 0 ;

	            if (!nouvel_especes_permis) 
	            {
	            	id = vm.selected_especes_permis.id ;
	            }


	            var datas = $.param(
	            {
	            	
	                id:id,      
	                supprimer:etat_suppression,
	                id_permis:vm.selected_permis.id,

	                id_espece:especes_permis.id_espece
	                
	                
	            });

	            apiFactory.add("SIP_especes_permis/index",datas, config).success(function (data)
        		{
        			var esp = vm.all_espece.filter(function(obj)
					{
						return obj.id == especes_permis.id_espece;
					});

					
					if (!nouvel_especes_permis) 
					{
						if (etat_suppression == 0) 
						{

							
							vm.selected_especes_permis.id_espece = especes_permis.id_espece ;
							vm.selected_especes_permis.nom = esp[0].nom ;
							vm.selected_especes_permis.nom_scientifique = esp[0].nom_scientifique ;
							vm.selected_especes_permis.nom_francaise = esp[0].nom_francaise ;
							vm.selected_especes_permis.nom_local = esp[0].nom_local ;
							vm.selected_especes_permis.type_espece = esp[0].type_espece ;

						}
						else
						{
							vm.all_especes_permis = vm.all_especes_permis.filter(function(obj)
							{
								return obj.id !== vm.selected_especes_permis.id;
							});
						}

					}
					else
					{
						var item =
			            {
							id:String(data.response) ,

							id_permis:vm.selected_permis.id,

						
							id_espece:especes_permis.id_espece,
							nom:esp[0].nom,
							nom_scientifique:esp[0].nom_scientifique,
							nom_francaise:esp[0].nom_francaise,
							nom_local:esp[0].nom_local,
							type_espece:esp[0].type_espece

							

			                            
						}          
			            vm.all_especes_permis.unshift(item);
			            nouvel_especes_permis = false ;
					}


					vm.affichage_masque_especes_permis = false ;




        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}

    	// FIN ESPECE AUTORISE


		//COLLECTE
			vm.selected_collecte = {};
			vm.collecte = {};


			vm.get_collecte = function()
			{

				apiFactory.getAPIgeneraliserREST("SIP_saisie_collecte_halieutique/index","id_permis",vm.selected_permis.id).then(function(result)
				{
					vm.all_saisie_collecte_halieutique = result.data.response;

					
				});

			}


			var nouvel_collecte = false ;

			vm.affichage_masque_collecte = false ;

			vm.entete_liste_collecte = 
	        [
				{titre:"Année"},
				{titre:"Mois"},
				{titre:"Espèce"},
				{titre:"Prés."},
				{titre:"Conserv"},
				{titre:"Coef.conv"},
				{titre:"Qté"},
				{titre:"Prix"},
				{titre:"Valeurs"}
	        ] ;


	        vm.selection_collecte = function(collecte)
	        {
	        	vm.selected_collecte = collecte ;

	        }


	        $scope.$watch('vm.selected_collecte', function()
			{
				if (!vm.all_saisie_collecte_halieutique) return;
				vm.all_saisie_collecte_halieutique.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_collecte.$selected = true;

			});

			$scope.$watch('vm.collecte.prix', function()
			{
				if (!vm.collecte.prix) return;

				vm.collecte.valeur = vm.collecte.prix * vm.collecte.quantite;
				

			});

			$scope.$watch('vm.collecte.quantite', function()
			{
				if (!vm.collecte.quantite) return;

				vm.collecte.valeur = vm.collecte.prix * vm.collecte.quantite;
				

			});

			$scope.$watch('vm.collecte.id_espece', function()
			{
				if (!vm.collecte.id_espece) return;

				if (vm.collecte.id_espece && vm.collecte.id_presentation && vm.collecte.id_conservation) 
				{
					apiFactory.getAPIgeneraliserREST("SIP_coefficient_conversion/index",
													"etat_get_by_pres_cons",1,
													"id_espece",vm.collecte.id_espece,
													"id_presentation",vm.collecte.id_presentation,
													"id_conservation",vm.collecte.id_conservation
													).then(function(result)
					{
						var reps = result.data.response;

						

						if(reps.length == 0)
						{
							info_coeff_cons();
							vm.collecte.coefficiant_conservation = null;
						}
						else
							vm.collecte.coefficiant_conservation = Number(reps.coefficient) ;

						
					});
				}
				

			});

			$scope.$watch('vm.collecte.id_presentation', function()
			{
				if (!vm.collecte.id_presentation) return;

				if (vm.collecte.id_espece && vm.collecte.id_presentation && vm.collecte.id_conservation) 
				{
					apiFactory.getAPIgeneraliserREST("SIP_coefficient_conversion/index",
													"etat_get_by_pres_cons",1,
													"id_espece",vm.collecte.id_espece,
													"id_presentation",vm.collecte.id_presentation,
													"id_conservation",vm.collecte.id_conservation
													).then(function(result)
					{
						var reps = result.data.response;

						

						if(reps.length == 0)
						{
							info_coeff_cons();
							vm.collecte.coefficiant_conservation = null;
						}
						else
							vm.collecte.coefficiant_conservation = Number(reps.coefficient) ;

						
					});
				}
				

			});

			$scope.$watch('vm.collecte.id_conservation', function()
			{
				if (!vm.collecte.id_conservation) return;

				if (vm.collecte.id_espece && vm.collecte.id_presentation && vm.collecte.id_conservation) 
				{
					apiFactory.getAPIgeneraliserREST("SIP_coefficient_conversion/index",
													"etat_get_by_pres_cons",1,
													"id_espece",vm.collecte.id_espece,
													"id_presentation",vm.collecte.id_presentation,
													"id_conservation",vm.collecte.id_conservation
													).then(function(result)
					{
						var reps = result.data.response;

						

						if(reps.length == 0)
						{
							info_coeff_cons();
							vm.collecte.coefficiant_conservation = null;
						}
						else
							vm.collecte.coefficiant_conservation = Number(reps.coefficient) ;
						

						
					});
				}
				

			});

			function info_coeff_cons()
			{
				var confirm = $mdDialog.confirm()
				  .title('Information!')
				  .textContent("Cette combinaison d'éspèce,de présentation et de conservation n'existe pas dans la données de base 'Coefficient de conversion'")
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok');
				$mdDialog.show(confirm).then(function() {

				
				}, function() {
				//alert('rien');
				});
			}

			vm.ajout_col = function()
			{
				vm.collecte = {};
				vm.selected_collecte = {};
				vm.affichage_masque_collecte = true ;
				nouvel_collecte = true ;
			}

			vm.modif_col = function()
			{
				nouvel_collecte = false ;
				vm.affichage_masque_collecte = true ;

				vm.collecte.annee = vm.selected_collecte.annee ;
				vm.collecte.mois = vm.selected_collecte.mois ;
				vm.collecte.id_espece = vm.selected_collecte.id_espece ;
				vm.collecte.id_presentation = vm.selected_collecte.id_presentation ;
				vm.collecte.id_conservation = vm.selected_collecte.id_conservation ;
				vm.collecte.coefficiant_conservation = Number(vm.selected_collecte.coefficiant_conservation) ;
				vm.collecte.quantite = Number(vm.selected_collecte.quantite) ;
				vm.collecte.prix = Number(vm.selected_collecte.prix) ;
				vm.collecte.valeur = Number(vm.selected_collecte.valeur) ;
			}


			vm.supprimer_col = function()
			{
				vm.affichage_masque_collecte = false ;
				
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
						vm.save_in_bdd_collecte(vm.selected_collecte,1);
					}, 
					function() 
					{

					}
				);
			}

			vm.annuler_collecte = function()
			{
				nouvel_collecte = false ;
				vm.affichage_masque_collecte = false ;
			}

			vm.save_in_bdd_collecte = function(data_masque, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };

	            var id = 0 ;

	            if (!nouvel_collecte) 
	            {
	            	id = vm.selected_collecte.id ;
	            }

	            var datas = $.param(
	            {
	            	
	                id:id,      
	                id_permis:vm.selected_permis.id,      
	                supprimer:etat_suppression,
	                annee:data_masque.annee,
	                mois:data_masque.mois,
	                id_espece:data_masque.id_espece,
	                id_presentation:data_masque.id_presentation,
	                id_conservation:data_masque.id_conservation,
	                coefficiant_conservation:data_masque.coefficiant_conservation,
	                quantite:data_masque.quantite,
	                prix:data_masque.prix,
	                valeur:data_masque.valeur,
	               
	                
	            });

	            apiFactory.add("SIP_saisie_collecte_halieutique/index",datas, config).success(function (data)
        		{
        			var cons = vm.all_conservation.filter(function(obj)
					{
						return obj.id == data_masque.id_conservation;
					});

					var pres = vm.all_presentation.filter(function(obj)
					{
						return obj.id == data_masque.id_presentation;
					});

					var esp = vm.all_especes_permis.filter(function(obj)
					{
						return obj.id_espece == data_masque.id_espece;
					});

        			if (!nouvel_collecte) 
        			{
        				if (etat_suppression == 0) 
        				{
        					vm.selected_collecte.annee = data_masque.annee ;
        					vm.selected_collecte.mois = data_masque.mois ;

        					vm.selected_collecte.id_espece = data_masque.id_espece ;
        					vm.selected_collecte.nom = esp[0].nom ;
        					vm.selected_collecte.nom_scientifique = esp[0].nom_scientifique ;
        					vm.selected_collecte.nom_francaise = esp[0].nom_francaise ;
        					vm.selected_collecte.nom_local = esp[0].nom_local ;

        					vm.selected_collecte.id_presentation = data_masque.id_presentation ;
        					vm.selected_collecte.libelle_presentation = pres[0].libelle ;

        					vm.selected_collecte.id_conservation = data_masque.id_conservation ;
        					vm.selected_collecte.libelle_conservation = cons[0].libelle ;

        					vm.selected_collecte.coefficiant_conservation = data_masque.coefficiant_conservation ;
							vm.selected_collecte.quantite = data_masque.quantite ;
							vm.selected_collecte.prix = data_masque.prix ;
							vm.selected_collecte.valeur = data_masque.valeur ;
        				}
        				else
        				{
        					vm.all_saisie_collecte_halieutique = vm.all_saisie_collecte_halieutique.filter(function(obj)
							{
								return obj.id !== vm.selected_collecte.id;
							});
        				}
        			}
        			else
        			{
        				var item =
			            {
							id:String(data.response) ,

							id_permis:vm.selected_permis.id,

							annee:data_masque.annee,
							mois:data_masque.mois,

							id_espece : data_masque.id_espece ,
        					nom : esp[0].nom ,
        					nom_scientifique : esp[0].nom_scientifique ,
        					nom_francaise : esp[0].nom_francaise ,
        					nom_local : esp[0].nom_local ,

							id_conservation:data_masque.id_conservation,
							libelle_conservation:cons[0].libelle,

							id_presentation:data_masque.id_presentation,
							libelle_presentation:pres[0].libelle,

							coefficiant_conservation:data_masque.coefficiant_conservation,
							quantite:data_masque.quantite,
							prix:data_masque.prix,
							valeur:data_masque.valeur

			                            
						}          
			            vm.all_saisie_collecte_halieutique.unshift(item);
        			}

        			vm.affichage_masque_collecte = false ;
        			nouvel_collecte = false ;
        		})
        		.error(function (data) {alert("Une erreur s'est produit");});
			}

			
		//FIN COLLECTE

		//COMMERCE MARINE
			vm.selected_commerce_marine = {};
			vm.commerce_marine = {};


			var nouvel_commerce_marine = false ;

			vm.affichage_masque_commerce_marine = false ;

			vm.entete_liste_commerce_marine = 
	        [
				{titre:"N° Visa"},
				{titre:"N° Cos"},
				{titre:"Année"},
				{titre:"Mois"},
				{titre:"Espèce"},
				{titre:"Présentation"},
				{titre:"Conservation"},
				{titre:"Coef cons"},
				{titre:"VL Qté"},
				{titre:"VL Prix"},
				{titre:"VL poids vif"},
				{titre:"Exp Qté"},
				{titre:"Exp Prix"},
				{titre:"Exp poids vif"},
				{titre:"Exp déstination"},

				

				{titre:"Date Expedition"},
				{titre:"Nombre colis"},
				{titre:"Nom Dést."},
				{titre:"Adresse Dést."},
				{titre:"Lieu Exped"},
				{titre:"Moyen de transport"},
				
				{titre:"Export Qté"},
				{titre:"Export Prix"},
				{titre:"Export poids vif"},
				{titre:"Export déstination"}
	        ] ;


	        vm.get_commerce_marine = function()
			{

				apiFactory.getAPIgeneraliserREST("SIP_commercialisation_marine/index","id_permis",vm.selected_permis.id).then(function(result)
				{
					vm.all_commerce_marine = result.data.response;
					
				});

			

				apiFactory.getAPIgeneraliserREST("SIP_commercialisation_marine/index",
												 "compte_nbr_fiche",1, 
												 "id_permis",vm.selected_permis.id).then(function(result)
				{
					vm.all_arrivee_fiche_marine = result.data.response;

					
				});

			

			}


			vm.selection_commerce_marine = function(commerce_marine)
			{
				vm.selected_commerce_marine = commerce_marine ;
			}

			$scope.$watch('vm.selected_commerce_marine', function()
			{
				if (!vm.all_commerce_marine) return;
				vm.all_commerce_marine.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_commerce_marine.$selected = true;

			});

			$scope.$watch('vm.commerce_marine.id_espece', function()
			{
				if (!vm.commerce_marine.id_espece) return;

				if (vm.commerce_marine.id_espece && vm.commerce_marine.id_presentation && vm.commerce_marine.id_conservation) 
				{
					apiFactory.getAPIgeneraliserREST("SIP_coefficient_conversion/index",
													"etat_get_by_pres_cons",1,
													"id_espece",vm.commerce_marine.id_espece,
													"id_presentation",vm.commerce_marine.id_presentation,
													"id_conservation",vm.commerce_marine.id_conservation
													).then(function(result)
					{
						var reps = result.data.response;

						

						if(reps.length == 0)
						{
							info_coeff_cons();
							vm.commerce_marine.coefficiant_conservation = null;
						}
						else
							vm.commerce_marine.coefficiant_conservation = Number(reps.coefficient) ;

						
					});
				}
				

			});

			$scope.$watch('vm.commerce_marine.id_presentation', function()
			{
				if (!vm.commerce_marine.id_presentation) return;

				if (vm.commerce_marine.id_espece && vm.commerce_marine.id_presentation && vm.commerce_marine.id_conservation) 
				{
					apiFactory.getAPIgeneraliserREST("SIP_coefficient_conversion/index",
													"etat_get_by_pres_cons",1,
													"id_espece",vm.commerce_marine.id_espece,
													"id_presentation",vm.commerce_marine.id_presentation,
													"id_conservation",vm.commerce_marine.id_conservation
													).then(function(result)
					{
						var reps = result.data.response;

						

						if(reps.length == 0)
						{
							info_coeff_cons();
							vm.commerce_marine.coefficiant_conservation = null;
						}
						else
							vm.commerce_marine.coefficiant_conservation = Number(reps.coefficient) ;

						
					});
				}
				

			});

			$scope.$watch('vm.commerce_marine.id_conservation', function()
			{
				if (!vm.commerce_marine.id_conservation) return;

				if (vm.commerce_marine.id_espece && vm.commerce_marine.id_presentation && vm.commerce_marine.id_conservation) 
				{
					apiFactory.getAPIgeneraliserREST("SIP_coefficient_conversion/index",
													"etat_get_by_pres_cons",1,
													"id_espece",vm.commerce_marine.id_espece,
													"id_presentation",vm.commerce_marine.id_presentation,
													"id_conservation",vm.commerce_marine.id_conservation
													).then(function(result)
					{
						var reps = result.data.response;

						

						if(reps.length == 0)
						{
							info_coeff_cons();
							vm.commerce_marine.coefficiant_conservation = null;
						}
						else
							vm.commerce_marine.coefficiant_conservation = Number(reps.coefficient) ;
						

						
					});
				}
				

			});

			vm.ajout_commerce_marine = function()
			{
				nouvel_commerce_marine = true ;
				vm.affichage_masque_commerce_marine = true ;

				vm.commerce_marine = {} ;
				vm.selected_commerce_marine = {} ;
			}


			vm.modif_commerce_marine = function()
			{
				nouvel_commerce_marine = false ;
				vm.affichage_masque_commerce_marine = true ;

				vm.commerce_marine.numero_visa = vm.selected_commerce_marine.numero_visa ;

				vm.commerce_marine.numero_cos = vm.selected_commerce_marine.numero_cos ;

				vm.commerce_marine.annee = vm.selected_commerce_marine.annee ;
				vm.commerce_marine.mois = vm.selected_commerce_marine.mois ;

				vm.commerce_marine.id_espece = vm.selected_commerce_marine.id_espece ;
				vm.commerce_marine.id_conservation = vm.selected_commerce_marine.id_conservation ;
				

				vm.commerce_marine.id_presentation = vm.selected_commerce_marine.id_presentation ;
				

				vm.commerce_marine.coefficiant_conservation = Number(vm.selected_commerce_marine.coefficiant_conservation) ;

				vm.commerce_marine.vl_qte = Number(vm.selected_commerce_marine.vl_qte) ;
                vm.commerce_marine.vl_prix_par_kg = Number(vm.selected_commerce_marine.vl_prix_par_kg) ;
                vm.commerce_marine.vl_poids_vif = Number(vm.selected_commerce_marine.vl_poids_vif) ;

                vm.commerce_marine.exp_qte = Number(vm.selected_commerce_marine.exp_qte) ;
                vm.commerce_marine.exp_prix_par_kg = Number(vm.selected_commerce_marine.exp_prix_par_kg) ;
                vm.commerce_marine.exp_poids_vif = Number(vm.selected_commerce_marine.exp_poids_vif) ;
                vm.commerce_marine.exp_destination = vm.selected_commerce_marine.exp_destination ;

                vm.commerce_marine.export_qte = Number(vm.selected_commerce_marine.export_qte) ;
                vm.commerce_marine.export_prix_par_kg = Number(vm.selected_commerce_marine.export_prix_par_kg) ;
                vm.commerce_marine.export_poids_vif = Number(vm.selected_commerce_marine.export_poids_vif) ;
                vm.commerce_marine.export_destination = vm.selected_commerce_marine.export_destination ;

                vm.commerce_marine.date_expedition = new Date(vm.selected_commerce_marine.date_expedition) ;
                vm.commerce_marine.nbr_colis = Number(vm.selected_commerce_marine.nbr_colis) ;

                vm.commerce_marine.nom_dest = vm.selected_commerce_marine.nom_dest ;
                vm.commerce_marine.adresse_dest = vm.selected_commerce_marine.adresse_dest ;
                vm.commerce_marine.lieu_exped = vm.selected_commerce_marine.lieu_exped ;
                vm.commerce_marine.moyen_transport = vm.selected_commerce_marine.moyen_transport ;


			}


			vm.supprimer_commerce_marine = function()
			{
				vm.affichage_masque_commerce_marine = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Etes-vous sûr de supprimer cet enregistrement ?')
				  .textContent('Commercialisation marine sur le permis: '+vm.selected_permis.numero_permis)
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_in_bdd_commerce_marine(vm.selected_commerce_marine,1);
				}, function() {
				//alert('rien');
				});
			}

			vm.annuler_commerce_marine = function()
			{
				nouvel_commerce_marine = false ;
				vm.affichage_masque_commerce_marine = false ;
			}


			vm.save_in_bdd_commerce_marine = function(commerce_marine, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };

	            var id = 0 ;

	            if (!nouvel_commerce_marine) 
	            {
	            	id = vm.selected_commerce_marine.id ;
	            }


	            var datas = $.param(
	            {
	            	
	                id:id,      
	                supprimer:etat_suppression,
	                id_permis:vm.selected_permis.id,

	                numero_visa:commerce_marine.numero_visa,
	                numero_cos:commerce_marine.numero_cos,
	                annee:commerce_marine.annee,
	                mois:commerce_marine.mois,

	                id_espece:commerce_marine.id_espece,
	                id_presentation:commerce_marine.id_presentation,
	                id_conservation:commerce_marine.id_conservation,
	                coefficiant_conservation:commerce_marine.coefficiant_conservation,

	                vl_qte:commerce_marine.vl_qte,
	                vl_prix_par_kg:commerce_marine.vl_prix_par_kg,
	                vl_poids_vif:commerce_marine.vl_poids_vif,

	                exp_qte:commerce_marine.exp_qte,
	                exp_prix_par_kg:commerce_marine.exp_prix_par_kg,
	                exp_poids_vif:commerce_marine.exp_poids_vif,
	                exp_destination:commerce_marine.exp_destination,

	                export_qte:commerce_marine.export_qte,
					export_prix_par_kg:commerce_marine.export_prix_par_kg,
					export_poids_vif:commerce_marine.export_poids_vif,
					export_destination:commerce_marine.export_destination,

	                date_expedition:convert_to_date_sql(commerce_marine.date_expedition),
	                nbr_colis:commerce_marine.nbr_colis,

	                nom_dest:commerce_marine.nom_dest,
	                adresse_dest:commerce_marine.adresse_dest,
	                lieu_exped:commerce_marine.lieu_exped,
	                moyen_transport:commerce_marine.moyen_transport
	                
	                
	            });

	            apiFactory.add("SIP_commercialisation_marine/index",datas, config).success(function (data)
        		{
        			var cons = vm.all_conservation.filter(function(obj)
					{
						return obj.id == commerce_marine.id_conservation;
					});

					var pres = vm.all_presentation.filter(function(obj)
					{
						return obj.id == commerce_marine.id_presentation;
					});

					var esp = vm.all_especes_permis.filter(function(obj)
					{
						return obj.id_espece == commerce_marine.id_espece;
					});

					if (!nouvel_commerce_marine) 
					{
						if (etat_suppression == 0) 
						{

							vm.selected_commerce_marine.numero_visa = commerce_marine.numero_visa ;

							vm.selected_commerce_marine.numero_cos = commerce_marine.numero_cos ;

							vm.selected_commerce_marine.annee = commerce_marine.annee ;
							vm.selected_commerce_marine.mois = commerce_marine.mois ;

							vm.selected_commerce_marine.id_espece = commerce_marine.id_espece ;
        					vm.selected_commerce_marine.nom = esp[0].nom ;
        					vm.selected_commerce_marine.nom_scientifique = esp[0].nom_scientifique ;
        					vm.selected_commerce_marine.nom_francaise = esp[0].nom_francaise ;
        					vm.selected_commerce_marine.nom_local = esp[0].nom_local ;

							vm.selected_commerce_marine.id_conservation = commerce_marine.id_conservation ;
							vm.selected_commerce_marine.libelle_conservation = cons[0].libelle ;

							vm.selected_commerce_marine.id_presentation = commerce_marine.id_presentation ;
							vm.selected_commerce_marine.libelle_presentation = pres[0].libelle ;

							vm.selected_commerce_marine.coefficiant_conservation = commerce_marine.coefficiant_conservation ;

							vm.selected_commerce_marine.vl_qte = commerce_marine.vl_qte ;
			                vm.selected_commerce_marine.vl_prix_par_kg = commerce_marine.vl_prix_par_kg ;
			                vm.selected_commerce_marine.vl_poids_vif = commerce_marine.vl_poids_vif ;

			                vm.selected_commerce_marine.exp_qte = commerce_marine.exp_qte ;
			                vm.selected_commerce_marine.exp_prix_par_kg = commerce_marine.exp_prix_par_kg ;
			                vm.selected_commerce_marine.exp_poids_vif = commerce_marine.exp_poids_vif ;
			                vm.selected_commerce_marine.exp_destination = commerce_marine.exp_destination ;

			                vm.selected_commerce_marine.export_qte = commerce_marine.export_qte ;
							vm.selected_commerce_marine.export_prix_par_kg = commerce_marine.export_prix_par_kg ;
							vm.selected_commerce_marine.export_poids_vif = commerce_marine.export_poids_vif ;
							vm.selected_commerce_marine.export_destination = commerce_marine.export_destination ;

			                vm.selected_commerce_marine.date_expedition = convert_to_date_sql(commerce_marine.date_expedition) ;
			                vm.selected_commerce_marine.nbr_colis = commerce_marine.nbr_colis ;

			                vm.selected_commerce_marine.nom_dest = commerce_marine.nom_dest ;
			                vm.selected_commerce_marine.adresse_dest = commerce_marine.adresse_dest ;
			                vm.selected_commerce_marine.lieu_exped = commerce_marine.lieu_exped ;
			                vm.selected_commerce_marine.moyen_transport = commerce_marine.moyen_transport ;

						}
						else
						{
							vm.all_commerce_marine = vm.all_commerce_marine.filter(function(obj)
							{
								apiFactory.getAPIgeneraliserREST("SIP_commercialisation_marine/index",
												 "compte_nbr_fiche",1, 
												 "id_permis",vm.selected_permis.id).then(function(result)
								{
									vm.all_arrivee_fiche_marine = result.data.response;

									
								});
								return obj.id !== vm.selected_commerce_marine.id;
							});
						}

					}
					else
					{
						var item =
			            {
							id:String(data.response) ,

							id_permis:vm.selected_permis.id,

							numero_visa:commerce_marine.numero_visa,
	                		numero_cos:commerce_marine.numero_cos,

							annee:commerce_marine.annee,
							mois:commerce_marine.mois,

							id_espece : commerce_marine.id_espece ,
        					nom : esp[0].nom ,
        					nom_scientifique : esp[0].nom_scientifique ,
        					nom_francaise : esp[0].nom_francaise ,
        					nom_local : esp[0].nom_local ,

							id_conservation:commerce_marine.id_conservation,
							libelle_conservation:cons[0].libelle,

							id_presentation:commerce_marine.id_presentation,
							libelle_presentation:pres[0].libelle,

							coefficiant_conservation:commerce_marine.coefficiant_conservation,

							vl_qte:commerce_marine.vl_qte,
			                vl_prix_par_kg:commerce_marine.vl_prix_par_kg,
			                vl_poids_vif:commerce_marine.vl_poids_vif,

			                exp_qte:commerce_marine.exp_qte,
			                exp_prix_par_kg:commerce_marine.exp_prix_par_kg,
			                exp_poids_vif:commerce_marine.exp_poids_vif,
			                exp_destination:commerce_marine.exp_destination,

			                export_qte:commerce_marine.export_qte,
							export_prix_par_kg:commerce_marine.export_prix_par_kg,
							export_poids_vif:commerce_marine.export_poids_vif,
							export_destination:commerce_marine.export_destination,

			                date_expedition:convert_to_date_sql(commerce_marine.date_expedition),
			                nbr_colis:commerce_marine.nbr_colis,

			                nom_dest:commerce_marine.nom_dest,
			                adresse_dest:commerce_marine.adresse_dest,
			                lieu_exped:commerce_marine.lieu_exped,
			                moyen_transport:commerce_marine.moyen_transport

			                            
						}          
			            vm.all_commerce_marine.unshift(item);
			            nouvel_commerce_marine = false ;
			            apiFactory.getAPIgeneraliserREST("SIP_commercialisation_marine/index",
												 "compte_nbr_fiche",1, 
												 "id_permis",vm.selected_permis.id).then(function(result)
						{
							vm.all_arrivee_fiche_marine = result.data.response;

							
						});
					}


					vm.affichage_masque_commerce_marine = false ;




        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
		//FIN COMMERCE MARINE

		//COMMERCE EAU DOUCE
			vm.selected_commerce_eau_douce = {};
			vm.commerce_eau_douce = {};

			vm.all_commerce_eau_douce = [];


			var nouvel_commerce_eau_douce = false ;

			vm.affichage_masque_commerce_eau_douce = false ;

			vm.entete_liste_commerce_eau_douce = 
	        [
				{titre:"N° Visa"},
				{titre:"N° Cos"},
				{titre:"Année"},
				{titre:"Mois"},
				{titre:"Espèce"},
				{titre:"Présentation"},
				{titre:"Conservation"},
				{titre:"Coef cons"},
				{titre:"VL Qté"},
				{titre:"VL Prix"},
				{titre:"VL poids vif"},

				{titre:"Exp Qté"},
				{titre:"Exp Prix"},
				{titre:"Exp poids vif"},
				{titre:"Exp déstination"},

				{titre:"Date Expedition"},
				{titre:"Nombre colis"},
				{titre:"Nom Dést."},
				{titre:"Adresse Dést."},
				{titre:"Lieu Exped"},
				{titre:"Moyen de transport"},
				
				{titre:"Export Qté"},
				{titre:"Export Prix"},
				{titre:"Export poids vif"},
				{titre:"Export déstination"}
	        ] ;

	        vm.get_commerce_eau_douce = function()
			{

				apiFactory.getAPIgeneraliserREST("SIP_commercialisation_eau_douce/index","id_permis",vm.selected_permis.id).then(function(result)
				{
					vm.all_commerce_eau_douce = result.data.response;

					
				});

				apiFactory.getAPIgeneraliserREST("SIP_commercialisation_eau_douce/index",
												 "compte_nbr_fiche",1, 
												 "id_permis",vm.selected_permis.id).then(function(result)
				{
					vm.all_arrivee_fiche_eau_douce = result.data.response;

					
				});

			}


			vm.selection_commerce_eau_douce = function(commerce_eau_douce)
			{
				vm.selected_commerce_eau_douce = commerce_eau_douce ;
			}

			$scope.$watch('vm.selected_commerce_eau_douce', function()
			{
				if (!vm.all_commerce_eau_douce) return;
				vm.all_commerce_eau_douce.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_commerce_eau_douce.$selected = true;

			});

			$scope.$watch('vm.commerce_eau_douce.id_espece', function()
			{
				if (!vm.commerce_eau_douce.id_espece) return;

				if (vm.commerce_eau_douce.id_espece && vm.commerce_eau_douce.id_presentation && vm.commerce_eau_douce.id_conservation) 
				{
					apiFactory.getAPIgeneraliserREST("SIP_coefficient_conversion/index",
													"etat_get_by_pres_cons",1,
													"id_espece",vm.commerce_eau_douce.id_espece,
													"id_presentation",vm.commerce_eau_douce.id_presentation,
													"id_conservation",vm.commerce_eau_douce.id_conservation
													).then(function(result)
					{
						var reps = result.data.response;

						

						if(reps.length == 0)
						{
							info_coeff_cons();
							vm.commerce_eau_douce.coefficiant_conservation = null;
						}
						else
							vm.commerce_eau_douce.coefficiant_conservation = Number(reps.coefficient) ;

						
					});
				}
				

			});

			$scope.$watch('vm.commerce_eau_douce.id_presentation', function()
			{
				if (!vm.commerce_eau_douce.id_presentation) return;

				if (vm.commerce_eau_douce.id_espece && vm.commerce_eau_douce.id_presentation && vm.commerce_eau_douce.id_conservation) 
				{
					apiFactory.getAPIgeneraliserREST("SIP_coefficient_conversion/index",
													"etat_get_by_pres_cons",1,
													"id_espece",vm.commerce_eau_douce.id_espece,
													"id_presentation",vm.commerce_eau_douce.id_presentation,
													"id_conservation",vm.commerce_eau_douce.id_conservation
													).then(function(result)
					{
						var reps = result.data.response;

						

						if(reps.length == 0)
						{
							info_coeff_cons();
							vm.commerce_eau_douce.coefficiant_conservation = null;
						}
						else
							vm.commerce_eau_douce.coefficiant_conservation = Number(reps.coefficient) ;

						
					});
				}
				

			});

			$scope.$watch('vm.commerce_eau_douce.id_conservation', function()
			{
				if (!vm.commerce_eau_douce.id_conservation) return;

				if (vm.commerce_eau_douce.id_espece && vm.commerce_eau_douce.id_presentation && vm.commerce_eau_douce.id_conservation) 
				{
					apiFactory.getAPIgeneraliserREST("SIP_coefficient_conversion/index",
													"etat_get_by_pres_cons",1,
													"id_espece",vm.commerce_eau_douce.id_espece,
													"id_presentation",vm.commerce_eau_douce.id_presentation,
													"id_conservation",vm.commerce_eau_douce.id_conservation
													).then(function(result)
					{
						var reps = result.data.response;

						

						if(reps.length == 0)
						{
							info_coeff_cons();
							vm.commerce_eau_douce.coefficiant_conservation = null;
						}
						else
							vm.commerce_eau_douce.coefficiant_conservation = Number(reps.coefficient) ;
						

						
					});
				}
				

			});

			vm.ajout_commerce_eau_douce = function()
			{
				nouvel_commerce_eau_douce = true ;
				vm.affichage_masque_commerce_eau_douce = true ;

				vm.commerce_eau_douce = {} ;
				vm.selected_commerce_eau_douce = {} ;
			}


			vm.modif_commerce_eau_douce = function()
			{
				nouvel_commerce_eau_douce = false ;
				vm.affichage_masque_commerce_eau_douce = true ;

				vm.commerce_eau_douce.numero_visa = vm.selected_commerce_eau_douce.numero_visa ;

				vm.commerce_eau_douce.numero_cos = vm.selected_commerce_eau_douce.numero_cos ;

				vm.commerce_eau_douce.annee = vm.selected_commerce_eau_douce.annee ;
				vm.commerce_eau_douce.mois = vm.selected_commerce_eau_douce.mois ;

				vm.commerce_eau_douce.id_espece = vm.selected_commerce_eau_douce.id_espece ;
				vm.commerce_eau_douce.id_conservation = vm.selected_commerce_eau_douce.id_conservation ;
				

				vm.commerce_eau_douce.id_presentation = vm.selected_commerce_eau_douce.id_presentation ;
				

				vm.commerce_eau_douce.coefficiant_conservation = Number(vm.selected_commerce_eau_douce.coefficiant_conservation) ;

				vm.commerce_eau_douce.vl_qte = Number(vm.selected_commerce_eau_douce.vl_qte) ;
                vm.commerce_eau_douce.vl_prix_par_kg = Number(vm.selected_commerce_eau_douce.vl_prix_par_kg) ;
                vm.commerce_eau_douce.vl_poids_vif = Number(vm.selected_commerce_eau_douce.vl_poids_vif) ;

                vm.commerce_eau_douce.exp_qte = Number(vm.selected_commerce_eau_douce.exp_qte) ;
                vm.commerce_eau_douce.exp_prix_par_kg = Number(vm.selected_commerce_eau_douce.exp_prix_par_kg) ;
                vm.commerce_eau_douce.exp_poids_vif = Number(vm.selected_commerce_eau_douce.exp_poids_vif) ;
                vm.commerce_eau_douce.exp_destination = vm.selected_commerce_eau_douce.exp_destination ;

                vm.commerce_eau_douce.export_qte = Number(vm.selected_commerce_eau_douce.export_qte) ;
                vm.commerce_eau_douce.export_prix_par_kg = Number(vm.selected_commerce_eau_douce.export_prix_par_kg) ;
                vm.commerce_eau_douce.export_poids_vif = Number(vm.selected_commerce_eau_douce.export_poids_vif) ;
                vm.commerce_eau_douce.export_destination = vm.selected_commerce_eau_douce.export_destination ;

                vm.commerce_eau_douce.date_expedition = new Date(vm.selected_commerce_eau_douce.date_expedition) ;
                vm.commerce_eau_douce.nbr_colis = Number(vm.selected_commerce_eau_douce.nbr_colis) ;

                vm.commerce_eau_douce.nom_dest = vm.selected_commerce_eau_douce.nom_dest ;
                vm.commerce_eau_douce.adresse_dest = vm.selected_commerce_eau_douce.adresse_dest ;
                vm.commerce_eau_douce.lieu_exped = vm.selected_commerce_eau_douce.lieu_exped ;
                vm.commerce_eau_douce.moyen_transport = vm.selected_commerce_eau_douce.moyen_transport ;


			}


			vm.supprimer_commerce_eau_douce = function()
			{
				vm.affichage_masque_commerce_eau_douce = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Etes-vous sûr de supprimer cet enregistrement ?')
				  .textContent('Commercialisation eau_douce sur le permis: '+vm.selected_permis.numero_permis)
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_in_bdd_commerce_eau_douce(vm.selected_commerce_eau_douce,1);
				}, function() {
				//alert('rien');
				});
			}

			vm.annuler_commerce_eau_douce = function()
			{
				nouvel_commerce_eau_douce = false ;
				vm.affichage_masque_commerce_eau_douce = false ;
			}


			vm.save_in_bdd_commerce_eau_douce = function(commerce_eau_douce, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };

	            var id = 0 ;

	            if (!nouvel_commerce_eau_douce) 
	            {
	            	id = vm.selected_commerce_eau_douce.id ;
	            }


	            var datas = $.param(
	            {
	            	
	                id:id,      
	                supprimer:etat_suppression,
	                id_permis:vm.selected_permis.id,

	                numero_visa:commerce_eau_douce.numero_visa,
	                numero_cos:commerce_eau_douce.numero_cos,
	                annee:commerce_eau_douce.annee,
	                mois:commerce_eau_douce.mois,

	                id_espece:commerce_eau_douce.id_espece,
	                id_presentation:commerce_eau_douce.id_presentation,
	                id_conservation:commerce_eau_douce.id_conservation,
	                coefficiant_conservation:commerce_eau_douce.coefficiant_conservation,

	                vl_qte:commerce_eau_douce.vl_qte,
	                vl_prix_par_kg:commerce_eau_douce.vl_prix_par_kg,
	                vl_poids_vif:commerce_eau_douce.vl_poids_vif,

					exp_qte:commerce_eau_douce.exp_qte,
					exp_prix_par_kg:commerce_eau_douce.exp_prix_par_kg,
					exp_poids_vif:commerce_eau_douce.exp_poids_vif,
					exp_destination:commerce_eau_douce.exp_destination,

					export_qte:commerce_eau_douce.export_qte,
					export_prix_par_kg:commerce_eau_douce.export_prix_par_kg,
					export_poids_vif:commerce_eau_douce.export_poids_vif,
					export_destination:commerce_eau_douce.export_destination,

					date_expedition:convert_to_date_sql(commerce_eau_douce.date_expedition),
					nbr_colis:commerce_eau_douce.nbr_colis,

					nom_dest:commerce_eau_douce.nom_dest,
					adresse_dest:commerce_eau_douce.adresse_dest,
					lieu_exped:commerce_eau_douce.lieu_exped,
					moyen_transport:commerce_eau_douce.moyen_transport

	                
	                
	            });

	            apiFactory.add("SIP_commercialisation_eau_douce/index",datas, config).success(function (data)
        		{
        			var cons = vm.all_conservation.filter(function(obj)
					{
						return obj.id == commerce_eau_douce.id_conservation;
					});

					var pres = vm.all_presentation.filter(function(obj)
					{
						return obj.id == commerce_eau_douce.id_presentation;
					});

					var esp = vm.all_especes_permis.filter(function(obj)
					{
						return obj.id_espece == commerce_eau_douce.id_espece;
					});

					if (!nouvel_commerce_eau_douce) 
					{
						if (etat_suppression == 0) 
						{

							vm.selected_commerce_eau_douce.numero_visa = commerce_eau_douce.numero_visa ;

							vm.selected_commerce_eau_douce.numero_cos = commerce_eau_douce.numero_cos ;

							vm.selected_commerce_eau_douce.annee = commerce_eau_douce.annee ;
							vm.selected_commerce_eau_douce.mois = commerce_eau_douce.mois ;

							vm.selected_commerce_eau_douce.id_espece = commerce_eau_douce.id_espece ;
        					vm.selected_commerce_eau_douce.nom = esp[0].nom ;
        					vm.selected_commerce_eau_douce.nom_scientifique = esp[0].nom_scientifique ;
        					vm.selected_commerce_eau_douce.nom_francaise = esp[0].nom_francaise ;
        					vm.selected_commerce_eau_douce.nom_local = esp[0].nom_local ;

							vm.selected_commerce_eau_douce.id_conservation = commerce_eau_douce.id_conservation ;
							vm.selected_commerce_eau_douce.libelle_conservation = cons[0].libelle ;

							vm.selected_commerce_eau_douce.id_presentation = commerce_eau_douce.id_presentation ;
							vm.selected_commerce_eau_douce.libelle_presentatio = pres[0].libelle ;

							vm.selected_commerce_eau_douce.coefficiant_conservation = commerce_eau_douce.coefficiant_conservation ;

							vm.selected_commerce_eau_douce.vl_qte = commerce_eau_douce.vl_qte ;
			                vm.selected_commerce_eau_douce.vl_prix_par_kg = commerce_eau_douce.vl_prix_par_kg ;
			                vm.selected_commerce_eau_douce.vl_poids_vif = commerce_eau_douce.vl_poids_vif ;

			                vm.selected_commerce_eau_douce.vl_qte = commerce_eau_douce.vl_qte ;
	                        vm.selected_commerce_eau_douce.vl_prix_par_kg = commerce_eau_douce.vl_prix_par_kg ;
	                        vm.selected_commerce_eau_douce.vl_poids_vif = commerce_eau_douce.vl_poids_vif ;

	                        vm.selected_commerce_eau_douce.exp_qte = commerce_eau_douce.exp_qte ;
	                        vm.selected_commerce_eau_douce.exp_prix_par_kg = commerce_eau_douce.exp_prix_par_kg ;
	                        vm.selected_commerce_eau_douce.exp_poids_vif = commerce_eau_douce.exp_poids_vif ;
	                        vm.selected_commerce_eau_douce.exp_destination = commerce_eau_douce.exp_destination ;

	                        vm.selected_commerce_eau_douce.export_qte = commerce_eau_douce.export_qte ;
                            vm.selected_commerce_eau_douce.export_prix_par_kg = commerce_eau_douce.export_prix_par_kg ;
                            vm.selected_commerce_eau_douce.export_poids_vif = commerce_eau_douce.export_poids_vif ;
                            vm.selected_commerce_eau_douce.export_destination = commerce_eau_douce.export_destination ;

	                        vm.selected_commerce_eau_douce.date_expedition = convert_to_date_sql(commerce_eau_douce.date_expedition) ;
	                        vm.selected_commerce_eau_douce.nbr_colis = commerce_eau_douce.nbr_colis ;

	                        vm.selected_commerce_eau_douce.nom_dest = commerce_eau_douce.nom_dest ;
	                        vm.selected_commerce_eau_douce.adresse_dest = commerce_eau_douce.adresse_dest ;
	                        vm.selected_commerce_eau_douce.lieu_exped = commerce_eau_douce.lieu_exped ;
	                        vm.selected_commerce_eau_douce.moyen_transport = commerce_eau_douce.moyen_transport ;

						}
						else
						{
							vm.all_commerce_eau_douce = vm.all_commerce_eau_douce.filter(function(obj)
							{
								apiFactory.getAPIgeneraliserREST("SIP_commercialisation_eau_douce/index",
												 "compte_nbr_fiche",1, 
												 "id_permis",vm.selected_permis.id).then(function(result)
								{
									vm.all_arrivee_fiche_eau_douce = result.data.response;

									
								});
								return obj.id !== vm.selected_commerce_eau_douce.id;
							});
						}

					}
					else
					{
						var item =
			            {
							id:String(data.response) ,

							id_permis:vm.selected_permis.id,

							numero_visa:commerce_eau_douce.numero_visa,
	                		numero_cos:commerce_eau_douce.numero_cos,

							annee:commerce_eau_douce.annee,
							mois:commerce_eau_douce.mois,

							id_espece : commerce_eau_douce.id_espece ,
        					nom : esp[0].nom ,
        					nom_scientifique : esp[0].nom_scientifique ,
        					nom_francaise : esp[0].nom_francaise ,
        					nom_local : esp[0].nom_local ,

							id_conservation:commerce_eau_douce.id_conservation,
							libelle_conservation:cons[0].libelle,

							id_presentation:commerce_eau_douce.id_presentation,
							libelle_presentation:pres[0].libelle,

							coefficiant_conservation:commerce_eau_douce.coefficiant_conservation,

							vl_qte:commerce_eau_douce.vl_qte,
			                vl_prix_par_kg:commerce_eau_douce.vl_prix_par_kg,
			                vl_poids_vif:commerce_eau_douce.vl_poids_vif,

			                exp_qte:commerce_eau_douce.exp_qte,
							exp_prix_par_kg:commerce_eau_douce.exp_prix_par_kg,
							exp_poids_vif:commerce_eau_douce.exp_poids_vif,
							exp_destination:commerce_eau_douce.exp_destination,

							export_qte:commerce_eau_douce.export_qte,
							export_prix_par_kg:commerce_eau_douce.export_prix_par_kg,
							export_poids_vif:commerce_eau_douce.export_poids_vif,
							export_destination:commerce_eau_douce.export_destination,

							date_expedition:convert_to_date_sql(commerce_eau_douce.date_expedition),
							nbr_colis:commerce_eau_douce.nbr_colis,

							nom_dest:commerce_eau_douce.nom_dest,
							adresse_dest:commerce_eau_douce.adresse_dest,
							lieu_exped:commerce_eau_douce.lieu_exped,
							moyen_transport:commerce_eau_douce.moyen_transport

			                            
						}          
			            vm.all_commerce_eau_douce.unshift(item);
			            nouvel_commerce_eau_douce = false ;

			            apiFactory.getAPIgeneraliserREST("SIP_commercialisation_eau_douce/index",
												 "compte_nbr_fiche",1, 
												 "id_permis",vm.selected_permis.id).then(function(result)
						{
							vm.all_arrivee_fiche_eau_douce = result.data.response;

							
						});
					}


					vm.affichage_masque_commerce_eau_douce = false ;




        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}

		//FIN COMMERCE EAU DOUCE
		//ENQUETE DE MARCHE
			//DONNES CADRE
				vm.donnees_cadre = {} ;
				vm.get_commune_district = function()
				{
					vm.donnees_cadre.id_commune = null ;
					apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_district).then(function(result)
					{
						
						vm.allcommune = result.data.response;

						if (!nouvel_donnees_cadre && vm.selected_donnees_cadre.id_commune) 
						{
							vm.donnees_cadre.id_commune = vm.selected_donnees_cadre.id_commune ;
						}
						
					});
				}
				vm.get_donnees_cadre_by_district = function()
				{
					vm.affiche_load = true ;
					apiFactory.getAPIgeneraliserREST("SIP_donnees_cadre_enquete_marche/index","id_district",vm.filtre.id_district).then(function(result)
					{
						vm.all_donnees_cadre = result.data.response;
						vm.affiche_load = false ;
					});
				}

				vm.entete_liste_donnees_cadre = 
		        [
					{titre:"Commune"},
					{titre:"Nom du ville"},
					{titre:"Nom marché"},
					{titre:"Nbr jour ouvrable/mois"},
					{titre:"Affluence Max"},
					{titre:"Nom vendeur spec frais"},
					{titre:"Nom vendeur spec transformé"},
					{titre:"Espèce"},
					{titre:"Nbr etal pdt frais"},
					{titre:"Nbr etal pdt transformé"},
					{titre:"Nbr total etal"}
		        ] ;		

	    		vm.selected_donnees_cadre = {} ;
	    		var nouvel_donnees_cadre = false;
	    		vm.all_donnees_cadre = [] ;
		    	

		        vm.selection_donnees_cadre = function(item) 
		        {
		        	vm.selected_donnees_cadre = item ;        	
		        }

		        $scope.$watch('vm.selected_donnees_cadre', function()
				{
					if (!vm.all_donnees_cadre) return;
					vm.all_donnees_cadre.forEach(function(item)
					{
						item.$selected = false;
					});
					vm.selected_donnees_cadre.$selected = true;

				});

				$scope.$watch('vm.donnees_cadre.nbr_etal_pdt_transforme', function()
				{
					if (!vm.donnees_cadre.nbr_etal_pdt_transforme) vm.donnees_cadre.nbr_etal_pdt_transforme = 0;

					vm.donnees_cadre.nbr_tot_etal = vm.donnees_cadre.nbr_etal_pdt_transforme + vm.donnees_cadre.nbr_etal_pdt_frais;
					

				});

				$scope.$watch('vm.donnees_cadre.nbr_etal_pdt_frais', function()
				{
					if (!vm.donnees_cadre.nbr_etal_pdt_frais) vm.donnees_cadre.nbr_etal_pdt_frais = 0;

					vm.donnees_cadre.nbr_tot_etal = vm.donnees_cadre.nbr_etal_pdt_transforme + vm.donnees_cadre.nbr_etal_pdt_frais;
					

				});

				

				vm.ajout_donnees_cadre = function() 
				{
					vm.affichage_masque_donnees_cadre = true ;
					nouvel_donnees_cadre = true ;
					vm.donnees_cadre = {} ;
				}

				vm.modif_donnees_cadre = function() 
				{
					nouvel_donnees_cadre = false ;

	               
	                vm.donnees_cadre.id_commune = vm.selected_donnees_cadre.id_commune ;
	                vm.donnees_cadre.nom_marche = vm.selected_donnees_cadre.nom_marche ;
	                vm.donnees_cadre.nom_ville = vm.selected_donnees_cadre.nom_ville ;
	                vm.donnees_cadre.nbr_jour_ouvrable_mois = Number(vm.selected_donnees_cadre.nbr_jour_ouvrable_mois) ;
	                vm.donnees_cadre.affluence_max = vm.selected_donnees_cadre.affluence_max ;
	                vm.donnees_cadre.nom_vendeur_spec_frais = vm.selected_donnees_cadre.nom_vendeur_spec_frais ;
	                vm.donnees_cadre.nom_vendeur_spec_transforme = vm.selected_donnees_cadre.nom_vendeur_spec_transforme ;
	                vm.donnees_cadre.id_espece = vm.selected_donnees_cadre.id_espece ;
	                vm.donnees_cadre.nbr_tot_etal = Number(vm.selected_donnees_cadre.nbr_tot_etal) ;
	                vm.donnees_cadre.nbr_etal_pdt_frais = Number(vm.selected_donnees_cadre.nbr_etal_pdt_frais) ;
	                vm.donnees_cadre.nbr_etal_pdt_transforme = Number(vm.selected_donnees_cadre.nbr_etal_pdt_transforme) ;

	                vm.affichage_masque_donnees_cadre = true ;
				}

				vm.supprimer_donnees_cadre = function () 
				{
					var confirm = $mdDialog.confirm()
					  .title('Etes-vous sûr de supprimer cet enregistrement ?')
					  .textContent('')
					  .ariaLabel('Lucky day')
					  .clickOutsideToClose(true)
					  .parent(angular.element(document.body))
					  .ok('ok')
					  .cancel('annuler');
					$mdDialog.show(confirm).then(function() {

					vm.save_in_bdd_donnees_cadre(vm.selected_donnees_cadre,1);
					}, function() {
					//alert('rien');
					});
				}

				vm.annuler_donnees_cadre = function () 
				{
					nouvel_donnees_cadre = false ;
					vm.affichage_masque_donnees_cadre = false ;
					vm.selected_donnees_cadre = {} ;
				}

				vm.save_in_bdd_donnees_cadre = function(data_masque, etat_suppression)
				{
					vm.affiche_load = true ;
					var config = {
		                headers : {
		                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
		                }
		            };

		            var id = 0 ;

		            if (!nouvel_donnees_cadre) 
		            {
		            	id = vm.selected_donnees_cadre.id ;
		            }



		            var datas = $.param(
		            {
		            	
		                id:id,      
		                supprimer:etat_suppression,

		                id_commune : data_masque.id_commune ,
		                nom_marche : data_masque.nom_marche ,
		                nom_ville : data_masque.nom_ville ,
		                nbr_jour_ouvrable_mois : data_masque.nbr_jour_ouvrable_mois ,
		                affluence_max : data_masque.affluence_max ,
		                nom_vendeur_spec_frais : data_masque.nom_vendeur_spec_frais ,
		                nom_vendeur_spec_transforme : data_masque.nom_vendeur_spec_transforme ,
		                id_espece : data_masque.id_espece ,
		                nbr_tot_etal : data_masque.nbr_tot_etal ,
		                nbr_etal_pdt_frais : data_masque.nbr_etal_pdt_frais ,
		                nbr_etal_pdt_transforme : data_masque.nbr_etal_pdt_transforme 
		                
		                
		                
		            });


		            apiFactory.add("SIP_donnees_cadre_enquete_marche/index",datas, config).success(function (data)
	        		{
	        			vm.affiche_load = false ;
	        			var com = vm.allcommune.filter(function(obj)
						{
							return obj.id == data_masque.id_commune;
						});

						var esp = vm.all_espece.filter(function(obj)
						{
							return obj.id == data_masque.id_espece;
						});


						

	        			if (!nouvel_donnees_cadre) 
	        			{
	        				if (etat_suppression == 0) //mise à jour
	        				{
	        				

				                vm.selected_donnees_cadre.id_commune = data_masque.id_commune  ;
				                vm.selected_donnees_cadre.nom_commune = com[0].nom ;

				                vm.selected_donnees_cadre.nom_marche = data_masque.nom_marche  ;
				                vm.selected_donnees_cadre.nom_ville = data_masque.nom_ville  ;
				                vm.selected_donnees_cadre.nbr_jour_ouvrable_mois = data_masque.nbr_jour_ouvrable_mois  ;
				                vm.selected_donnees_cadre.affluence_max = data_masque.affluence_max  ;
				                vm.selected_donnees_cadre.nom_vendeur_spec_frais = data_masque.nom_vendeur_spec_frais  ;
				                vm.selected_donnees_cadre.nom_vendeur_spec_transforme = data_masque.nom_vendeur_spec_transforme  ;

				                vm.selected_donnees_cadre.id_espece = data_masque.id_espece  ;
				                vm.selected_donnees_cadre.nom_scientifique = esp[0].nom_scientifique ;
		    					vm.selected_donnees_cadre.nom_francaise = esp[0].nom_francaise ;
		    					vm.selected_donnees_cadre.nom_local = esp[0].nom_local ;
		    					vm.selected_donnees_cadre.code = esp[0].code ;

				                vm.selected_donnees_cadre.nbr_tot_etal = data_masque.nbr_tot_etal  ;
				                vm.selected_donnees_cadre.nbr_etal_pdt_frais = data_masque.nbr_etal_pdt_frais  ;
				                vm.selected_donnees_cadre.nbr_etal_pdt_transforme = data_masque.nbr_etal_pdt_transforme ;

	        				}
	        				else//Suppression
	        				{
	        					vm.all_donnees_cadre = vm.all_donnees_cadre.filter(function(obj)
								{
									return obj.id !== vm.selected_donnees_cadre.id;
								});

	        				}

	        			}
	        			else
	        			{
	        				var item =
				            {
								id:String(data.response) ,

								id_commune : data_masque.id_commune ,
								nom_commune:com[0].nom,

				                nom_marche : data_masque.nom_marche ,
				                nom_ville : data_masque.nom_ville ,
				                nbr_jour_ouvrable_mois : data_masque.nbr_jour_ouvrable_mois ,
				                affluence_max : data_masque.affluence_max ,
				                nom_vendeur_spec_frais : data_masque.nom_vendeur_spec_frais ,
				                nom_vendeur_spec_transforme : data_masque.nom_vendeur_spec_transforme ,

				                id_espece : data_masque.id_espece ,
				                nom : esp[0].nom ,
		    					nom_scientifique : esp[0].nom_scientifique ,
		    					nom_francaise : esp[0].nom_francaise ,
		    					nom_local : esp[0].nom_local ,
		    					code : esp[0].code ,

				                nbr_tot_etal : data_masque.nbr_tot_etal ,
				                nbr_etal_pdt_frais : data_masque.nbr_etal_pdt_frais ,
				                nbr_etal_pdt_transforme : data_masque.nbr_etal_pdt_transforme               
							}          
				            vm.all_donnees_cadre.unshift(item);
	        			}

		        		vm.affichage_masque_donnees_cadre = false ; //Fermeture de la masque de saisie
		        		nouvel_donnees_cadre = false;


	        		})
	        		.error(function (data) {alert("Une erreur s'est produit");}); 
				}
	        
		    //FIN DONNES CADRE

		    //FICHE ENQUETE MARCHE
				vm.fiche_enquete_marche = {} ;
				
				vm.get_fiche_enquete_marche_by_district = function()
				{
					vm.affiche_load = true ;
					apiFactory.getAPIgeneraliserREST("SIP_fiche_enquete_marche/index","id_district",vm.filtre.id_district).then(function(result)
					{
						vm.all_fiche_enquete_marche = result.data.response;
						vm.affiche_load = false ;
					});
				}

				vm.entete_liste_fiche_enquete_marche = 
		        [
					{titre:"District"},
					{titre:"Nom du ville"},
					{titre:"Nom marché"},
					{titre:"Date relevé"},
					{titre:"Nbr jour ouvrable/mois"},
					{titre:"Nbr etal pdt frais"},
					{titre:"Nbr etal pdt transformé"},
					{titre:"Nbr total etal"},
					{titre:"Année"},
					{titre:"Mois"},
					{titre:"Domaines"},
					{titre:"Espèce"},
					{titre:"Présentation"},
					{titre:"Conservation"},
					{titre:"Détaillant"},
					{titre:"Offre"},
					{titre:"Prix"}
		        ] ;		

	    		vm.selected_fiche_enquete_marche = {} ;
	    		var nouvel_fiche_enquete_marche = false;
	    		vm.all_fiche_enquete_marche = [] ;
		    	

		        vm.selection_fiche_enquete_marche = function(item) 
		        {
		        	vm.selected_fiche_enquete_marche = item ;        	
		        }

		        $scope.$watch('vm.selected_fiche_enquete_marche', function()
				{
					if (!vm.all_fiche_enquete_marche) return;
					vm.all_fiche_enquete_marche.forEach(function(item)
					{
						item.$selected = false;
					});
					vm.selected_fiche_enquete_marche.$selected = true;

				});

				$scope.$watch('vm.fiche_enquete_marche.nbr_etal_pdt_transforme', function()
				{
					if (!vm.fiche_enquete_marche.nbr_etal_pdt_transforme) vm.fiche_enquete_marche.nbr_etal_pdt_transforme = 0;

					vm.fiche_enquete_marche.nbr_tot_etal = vm.fiche_enquete_marche.nbr_etal_pdt_transforme + vm.fiche_enquete_marche.nbr_etal_pdt_frais;
					

				});

				$scope.$watch('vm.fiche_enquete_marche.nbr_etal_pdt_frais', function()
				{
					if (!vm.fiche_enquete_marche.nbr_etal_pdt_frais) vm.fiche_enquete_marche.nbr_etal_pdt_frais = 0;

					vm.fiche_enquete_marche.nbr_tot_etal = vm.fiche_enquete_marche.nbr_etal_pdt_transforme + vm.fiche_enquete_marche.nbr_etal_pdt_frais;
					

				});

				

				vm.ajout_fiche_enquete_marche = function() 
				{
					vm.affichage_masque_fiche_enquete_marche = true ;
					nouvel_fiche_enquete_marche = true ;
					vm.fiche_enquete_marche = {} ;
				}

				vm.modif_fiche_enquete_marche = function() 
				{
					nouvel_fiche_enquete_marche = false ;

	               
	                vm.fiche_enquete_marche.id_district = vm.selected_fiche_enquete_marche.id_district ;
	                vm.fiche_enquete_marche.nom_marche = vm.selected_fiche_enquete_marche.nom_marche ;
	                vm.fiche_enquete_marche.nom_ville = vm.selected_fiche_enquete_marche.nom_ville ;
	                vm.fiche_enquete_marche.date_releve = new Date(vm.selected_fiche_enquete_marche.date_releve) ;
	                vm.fiche_enquete_marche.nbr_jour_ouvrable_mois = Number(vm.selected_fiche_enquete_marche.nbr_jour_ouvrable_mois) ;
	                vm.fiche_enquete_marche.nbr_tot_etal = Number(vm.selected_fiche_enquete_marche.nbr_tot_etal) ;
	                vm.fiche_enquete_marche.nbr_etal_pdt_frais = Number(vm.selected_fiche_enquete_marche.nbr_etal_pdt_frais) ;
	                vm.fiche_enquete_marche.nbr_etal_pdt_transforme = Number(vm.selected_fiche_enquete_marche.nbr_etal_pdt_transforme) ;
	                vm.fiche_enquete_marche.annee = vm.selected_fiche_enquete_marche.annee ;
	                vm.fiche_enquete_marche.mois = vm.selected_fiche_enquete_marche.mois ;
	                vm.fiche_enquete_marche.domaines = vm.selected_fiche_enquete_marche.domaines ;
	                vm.fiche_enquete_marche.id_espece = vm.selected_fiche_enquete_marche.id_espece ;
	                vm.fiche_enquete_marche.id_presentation = vm.selected_fiche_enquete_marche.id_presentation ;
	                vm.fiche_enquete_marche.id_conservation = vm.selected_fiche_enquete_marche.id_conservation ;
	                vm.fiche_enquete_marche.detaillant = vm.selected_fiche_enquete_marche.detaillant ;
	                vm.fiche_enquete_marche.offre_kg = Number(vm.selected_fiche_enquete_marche.offre_kg) ;
	                vm.fiche_enquete_marche.prix_kg = Number(vm.selected_fiche_enquete_marche.prix_kg) ;


	                vm.affichage_masque_fiche_enquete_marche = true ;
				}

				vm.supprimer_fiche_enquete_marche = function () 
				{
					var confirm = $mdDialog.confirm()
					  .title('Etes-vous sûr de supprimer cet enregistrement ?')
					  .textContent('')
					  .ariaLabel('Lucky day')
					  .clickOutsideToClose(true)
					  .parent(angular.element(document.body))
					  .ok('ok')
					  .cancel('annuler');
					$mdDialog.show(confirm).then(function() {

					vm.save_in_bdd_fiche_enquete_marche(vm.selected_fiche_enquete_marche,1);
					}, function() {
					//alert('rien');
					});
				}

				vm.annuler_fiche_enquete_marche = function () 
				{
					nouvel_fiche_enquete_marche = false ;
					vm.affichage_masque_fiche_enquete_marche = false ;
					vm.selected_fiche_enquete_marche = {} ;
				}

				vm.save_in_bdd_fiche_enquete_marche = function(data_masque, etat_suppression)
				{
					vm.affiche_load = true ;
					var config = {
		                headers : {
		                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
		                }
		            };

		            var id = 0 ;

		            if (!nouvel_fiche_enquete_marche) 
		            {
		            	id = vm.selected_fiche_enquete_marche.id ;
		            }



		            var datas = $.param(
		            {
		            	
		                id:id,      
		                supprimer:etat_suppression,

		                id_district : vm.filtre.id_district ,
		                nom_marche : data_masque.nom_marche ,
		                nom_ville : data_masque.nom_ville ,
		                date_releve : convert_to_date_sql(data_masque.date_releve) ,
		                nbr_jour_ouvrable_mois : data_masque.nbr_jour_ouvrable_mois ,
		                nbr_tot_etal : data_masque.nbr_tot_etal ,
		                nbr_etal_pdt_frais : data_masque.nbr_etal_pdt_frais ,
		                nbr_etal_pdt_transforme : data_masque.nbr_etal_pdt_transforme ,
		                annee : data_masque.annee ,
		                mois : data_masque.mois ,
		                domaines : data_masque.domaines ,
		                id_espece : data_masque.id_espece ,
		                id_presentation : data_masque.id_presentation ,
		                id_conservation : data_masque.id_conservation ,
		                detaillant : data_masque.detaillant ,
		                offre_kg : data_masque.offre_kg ,
		                prix_kg : data_masque.prix_kg 
		                
		                
		                
		            });


		            apiFactory.add("SIP_fiche_enquete_marche/index",datas, config).success(function (data)
	        		{
	        			vm.affiche_load = false ;
	        			var dist = vm.alldistrict.filter(function(obj)
						{
							return obj.id == vm.filtre.id_district;
						});

						var esp = vm.all_espece.filter(function(obj)
						{
							return obj.id == data_masque.id_espece;
						});


						var pres = vm.all_presentation.filter(function(obj)
						{
							return obj.id == data_masque.id_presentation;
						});

						var cons = vm.all_conservation.filter(function(obj)
						{
							return obj.id == data_masque.id_conservation;
						});


						

	        			if (!nouvel_fiche_enquete_marche) 
	        			{
	        				if (etat_suppression == 0) //mise à jour
	        				{
	        				

				                vm.selected_fiche_enquete_marche.id_district = data_masque.id_district  ;
				                vm.selected_fiche_enquete_marche.nom_commune = dist[0].nom ;

				                
				                vm.selected_fiche_enquete_marche.nom_marche = data_masque.nom_marche ;
				                vm.selected_fiche_enquete_marche.nom_ville = data_masque.nom_ville ;
				                vm.selected_fiche_enquete_marche.date_releve = convert_to_date_sql(data_masque.date_releve) ;
				                vm.selected_fiche_enquete_marche.nbr_jour_ouvrable_mois = Number(data_masque.nbr_jour_ouvrable_mois) ;
				               	vm.selected_fiche_enquete_marche.nbr_tot_etal = Number(data_masque.nbr_tot_etal) ;
				                vm.selected_fiche_enquete_marche.nbr_etal_pdt_frais = Number(data_masque.nbr_etal_pdt_frais) ;
				                vm.selected_fiche_enquete_marche.nbr_etal_pdt_transforme = Number(data_masque.nbr_etal_pdt_transforme) ;
				                vm.selected_fiche_enquete_marche.annee = data_masque.annee ;
				                vm.selected_fiche_enquete_marche.mois = data_masque.mois ;
				                vm.selected_fiche_enquete_marche.domaines = data_masque.domaines ;

				                vm.selected_fiche_enquete_marche.id_espece = data_masque.id_espece ;
				                vm.selected_fiche_enquete_marche.nom_scientifique = esp[0].nom_scientifique ;
		    					vm.selected_fiche_enquete_marche.nom_francaise = esp[0].nom_francaise ;
		    					vm.selected_fiche_enquete_marche.nom_local = esp[0].nom_local ;
		    					vm.selected_fiche_enquete_marche.code = esp[0].code ;

				                vm.selected_fiche_enquete_marche.id_presentation = data_masque.id_presentation ;
				                vm.selected_fiche_enquete_marche.libelle_presentation = pres[0].libelle ;

				                vm.selected_fiche_enquete_marche.id_conservation = data_masque.id_conservation ;
				                vm.selected_fiche_enquete_marche.libelle_conservation = cons[0].libelle ;

				                vm.selected_fiche_enquete_marche.detaillant = data_masque.detaillant ;
				                vm.selected_fiche_enquete_marche.offre_kg = Number(data_masque.offre_kg) ;
				                vm.selected_fiche_enquete_marche.prix_kg = Number(data_masque.prix_kg) ;

	        				}
	        				else//Suppression
	        				{
	        					vm.all_fiche_enquete_marche = vm.all_fiche_enquete_marche.filter(function(obj)
								{
									return obj.id !== vm.selected_fiche_enquete_marche.id;
								});

	        				}

	        			}
	        			else
	        			{
	        				var item =
				            {
								id:String(data.response) ,

								id_district : vm.filtre.id_district ,
								nom_district:dist[0].nom,

				                nom_marche : data_masque.nom_marche ,
				                nom_ville : data_masque.nom_ville ,
				                date_releve : convert_to_date_sql(data_masque.date_releve) ,
				                nbr_jour_ouvrable_mois : data_masque.nbr_jour_ouvrable_mois ,
				                nbr_tot_etal : data_masque.nbr_tot_etal ,
				                nbr_etal_pdt_frais : data_masque.nbr_etal_pdt_frais ,
				                nbr_etal_pdt_transforme : data_masque.nbr_etal_pdt_transforme ,
				                annee : data_masque.annee ,
				                mois : data_masque.mois ,
				                domaines : data_masque.domaines ,
				                
				                id_espece : data_masque.id_espece ,
				                nom : esp[0].nom ,
		    					nom_scientifique : esp[0].nom_scientifique ,
		    					nom_francaise : esp[0].nom_francaise ,
		    					nom_local : esp[0].nom_local ,
		    					code : esp[0].code ,      

				                id_presentation : data_masque.id_presentation ,
				                libelle_presentation : pres[0].libelle,

				                id_conservation : data_masque.id_conservation ,
				                libelle_conservation  : cons[0].libelle,
				                
				                detaillant : data_masque.detaillant ,
				                offre_kg : data_masque.offre_kg ,
				                prix_kg : data_masque.prix_kg 

							}          
				            vm.all_fiche_enquete_marche.unshift(item);
	        			}

		        		vm.affichage_masque_fiche_enquete_marche = false ; //Fermeture de la masque de saisie
		        		nouvel_fiche_enquete_marche = false;


	        		})
	        		.error(function (data) {alert("Une erreur s'est produit");}); 
				}
	        
		    //FIN FICHE ENQUETE MARCHE

		//FIN ENQUETE DE MARCHE


		//ARRIVEE FICHE
			vm.selected_arrivee_fiche = {};
			vm.selected_arrivee_fiche.$selected = false ;

			var current_selected_item = {};

			vm.all_arrivee_fiche = [];


			var nouvel_arrivee_fiche = false ;

			vm.entete_liste_arrivee_fiche = 
	        [
			
				{titre:"Année"},
				{titre:"Janvier"},
				{titre:"Février"},
				{titre:"Mars"},
				{titre:"Avril"},
				{titre:"Mai"},
				{titre:"Juin"},
				{titre:"Juillet"},
				{titre:"Août"},
				{titre:"Septembre"},
				{titre:"Octobre"},
				{titre:"Novembre"},
				{titre:"Décembre"}
	        ] ;

			/*vm.get_arrivee_fiche = function()
			{

				apiFactory.getAPIgeneraliserREST("SIP_arrivee_fiche/index","id_permis",vm.selected_permis.id).then(function(result)
				{
					vm.all_arrivee_fiche = result.data.response;

					
				});

			}*/

			

			vm.selection_arrivee_fiche = function(arrivee_fiche)
			{
				vm.selected_arrivee_fiche = arrivee_fiche ;

				if (!vm.selected_arrivee_fiche.$edit) //si simple selection
				{
					nouvel_arrivee_fiche = false ;	
				}

				

				current_selected_item = angular.copy(vm.selected_arrivee_fiche);


			}

			$scope.$watch('vm.selected_arrivee_fiche', function()
			{
				if (!vm.all_arrivee_fiche) return;
				vm.all_arrivee_fiche.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_arrivee_fiche.$selected = true;

			});


			vm.ajouter = function()
			{
				nouvel_arrivee_fiche = true ;
				var item = 
					{
						
						$edit: true,
						$selected: true,
	              		id:'0',
	              		annee:'0',
	              		janvier:'0',
	              		fevrier:'0',
	              		mars:'0',
	              		avril:'0',
	              		mai:'0',
	              		juin:'0',
	              		juillet:'0',
	              		aout:'0',
	              		septembre:'0',
	              		octobre:'0',
	              		novembre:'0',
	              		decembre:'0'
					} ;

				vm.all_arrivee_fiche.unshift(item);
	            vm.all_arrivee_fiche.forEach(function(af)
	            {
	              if(af.$selected == true)
	              {
	                vm.selected_arrivee_fiche = af;
	                
	              }
            	});
			}


			vm.modifier = function()
			{
				nouvel_arrivee_fiche = false ;
				vm.selected_arrivee_fiche.$edit = true;
			}

			vm.annuler = function()
			{
				
				if (nouvel_arrivee_fiche) 
				{
					
					vm.all_arrivee_fiche.shift();
					vm.selected_arrivee_fiche = {} ;
				}
				else
				{
					vm.selected_arrivee_fiche.$edit = false;
					vm.selected_arrivee_fiche.$selected = false;
					vm.selected_arrivee_fiche.annee = current_selected_item.annee ;
					vm.selected_arrivee_fiche.janvier = current_selected_item.janvier ;
					vm.selected_arrivee_fiche.fevrier = current_selected_item.fevrier ;
					vm.selected_arrivee_fiche.mars = current_selected_item.mars ;
					vm.selected_arrivee_fiche.avril = current_selected_item.avril ;
					vm.selected_arrivee_fiche.mai = current_selected_item.mai ;
					vm.selected_arrivee_fiche.juin = current_selected_item.juin ;
					vm.selected_arrivee_fiche.juillet = current_selected_item.juillet ;
					vm.selected_arrivee_fiche.aout = current_selected_item.aout ;
					vm.selected_arrivee_fiche.septembre = current_selected_item.septembre ;
					vm.selected_arrivee_fiche.octobre = current_selected_item.octobre ;
					vm.selected_arrivee_fiche.novembre = current_selected_item.novembre ;
					vm.selected_arrivee_fiche.decembre = current_selected_item.decembre ;
					vm.selected_arrivee_fiche = {};
				}

				
			}

			vm.supprimer = function()
			{
				vm.affichage_masque_commerce_eau_douce = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Etes-vous sûr de supprimer cet enregistrement ?')
				  .textContent('Fiche année: '+vm.selected_arrivee_fiche.annee+" permis n°: "+vm.selected_permis.numero_permis)
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.enregistrer(1);
				}, function() {
				//alert('rien');
				});
			}

			vm.enregistrer = function(etat_suppression)
			{

				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };


	            var datas = $.param(
	            {
	            	
	                supprimer:etat_suppression,
	                id_permis:vm.selected_permis.id,
	                id:vm.selected_arrivee_fiche.id,
	                annee:vm.selected_arrivee_fiche.annee,
	                janvier:vm.selected_arrivee_fiche.janvier,
	                fevrier:vm.selected_arrivee_fiche.fevrier,
	                mars:vm.selected_arrivee_fiche.mars,
	                avril:vm.selected_arrivee_fiche.avril,
	                mai:vm.selected_arrivee_fiche.mai,
	                juin:vm.selected_arrivee_fiche.juin,
	                juillet:vm.selected_arrivee_fiche.juillet,
	                aout:vm.selected_arrivee_fiche.aout,
	                septembre:vm.selected_arrivee_fiche.septembre,
	                octobre:vm.selected_arrivee_fiche.octobre,
	                novembre:vm.selected_arrivee_fiche.novembre,
	                decembre:vm.selected_arrivee_fiche.decembre
	                
	                
	            });

	            apiFactory.add("SIP_arrivee_fiche/index",datas, config).success(function (data)
        		{
        			
        			if (!nouvel_arrivee_fiche) 
        			{
        				if (etat_suppression == 0) 
        				{
        					vm.selected_arrivee_fiche.$edit = false ;
        					vm.selected_arrivee_fiche.$selected = false ;
        					vm.selected_arrivee_fiche = {} ;
        				}
        				else
        				{
        					vm.all_arrivee_fiche = vm.all_arrivee_fiche.filter(function(obj)
							{
								return obj.id !== vm.selected_arrivee_fiche.id;
							});

							vm.selected_arrivee_fiche = {} ;
        				}

        			}
        			else
        			{
        				vm.selected_arrivee_fiche.$edit = false ;
        				//vm.selected_arrivee_fiche.$selected = false ;
        				vm.selected_arrivee_fiche.id = String(data.response) ;
        				
        				
        				
        			}

        			nouvel_arrivee_fiche = false ;

        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
		//FIN ARRIVEE FICHE


		//ETAT


			vm.modules = 
			[
        
		        {titre:"Collecte",id:"collecte"},
		        {titre:"Commercialisation eau douce",id:"commerce_eau_douce"},
		        {titre:"Commercialisation marine",id:"commerce_marine"}
		    
		        
		    ];
			vm.pivots = 
			[
        
		        {titre:"3-1 Quantité collecté par District", id:"sip_get_somme_capture_all_espece_by_dist", module:"collecte"},
		        {titre:"3-2 Quantité collecté par Région", id:"sip_quantite_collecte_region", module:"collecte"},
		        {titre:"3-3 Quantité collecté par Mois", id:"sip_quantite_collecte_mois", module:"collecte"},
		        {titre:"3-4 Quantité collecté par opérateur", id:"sip_quantite_collecte_operateur", module:"collecte"},
		        {titre:"3-5 Quantité collecté par espèces", id:"sip_quantite_collecte_espece", module:"collecte"},
		        {titre:"3-6 Prix moyenne par mois", id:"sip_prix_moyenne_mois", module:"collecte"},
		        {titre:"3-7 Prix moyenne par district", id:"sip_prix_moyenne_district", module:"collecte"},
		        {titre:"3-8 Prix moyenne par région", id:"sip_prix_moyenne_region", module:"collecte"},

		        {titre:"Qté par espèces (Vente locale)", id:"sip_qte_par_espece_vente_local", module:"commerce_marine"},
		        {titre:"Qté par district ventillé par espèces (Vente locale)", id:"sip_qte_par_district_espece_vente_local", module:"commerce_marine"},
		        {titre:"Qté par région ventillé par espèces (Vente locale)", id:"sip_qte_par_region_espece_vente_local", module:"commerce_marine"},
		        {titre:"Prix moyenne par espèces (Vente locale)", id:"sip_prix_moyenne_par_espece_vente_local", module:"commerce_marine"},
		        {titre:"Prix moyenne par district (Vente locale)", id:"sip_prix_moyenne_par_district_vente_local", module:"commerce_marine"},
		        {titre:"Prix moyenne par région (Vente locale)", id:"sip_prix_moyenne_par_region_vente_local", module:"commerce_marine"},
		        {titre:"Qté par opérateur (Vente locale)", id:"sip_qte_par_operateur_vente_local", module:"commerce_marine"},

		        {titre:"Qté par espèces (Expédition interne)", id:"sip_qte_par_espece_expedition_interne", module:"commerce_marine"},
		        {titre:"Qté par district ventillé par espèces (Expédition interne)", id:"sip_qte_par_district_espece_expedition_interne", module:"commerce_marine"},
		        {titre:"Qté par région ventillé par espèces (Expédition interne)", id:"sip_qte_par_region_espece_expedition_interne", module:"commerce_marine"},
		        {titre:"Prix moyenne par espèces (Expédition interne)", id:"sip_prix_moyenne_par_espece_expedition_interne", module:"commerce_marine"},
		        {titre:"Prix moyenne par district (Expédition interne)", id:"sip_prix_moyenne_par_district_expedition_interne", module:"commerce_marine"},
		        {titre:"Prix moyenne par région (Expédition interne)", id:"sip_prix_moyenne_par_region_expedition_interne", module:"commerce_marine"},
		        {titre:"Qté par opérateur (Expédition interne)", id:"sip_qte_par_operateur_expedition_interne", module:"commerce_marine"},

		        {titre:"Qté par espèces (Exportation)", id:"sip_qte_par_espece_exportation", module:"commerce_marine"},
		        {titre:"Qté par district ventillé par espèces (Exportation)", id:"sip_qte_par_district_espece_exportation", module:"commerce_marine"},
		        {titre:"Qté par région ventillé par espèces (Exportation)", id:"sip_qte_par_region_espece_exportation", module:"commerce_marine"},
		        {titre:"Prix moyenne par espèces (Exportation)", id:"sip_prix_moyenne_par_espece_exportation", module:"commerce_marine"},
		        {titre:"Prix moyenne par district (Exportation)", id:"sip_prix_moyenne_par_district_exportation", module:"commerce_marine"},
		        {titre:"Prix moyenne par région (Exportation)", id:"sip_prix_moyenne_par_region_exportation", module:"commerce_marine"},
		        {titre:"Qté par opérateur (Exportation)", id:"sip_qte_par_operateur_exportation", module:"commerce_marine"},

		        {titre:"Qté vente locale (Qté en poids vif)", id:"sip_qte_vente_locale_qte_poids_vif", module:"commerce_marine"},
				{titre:"Qté vente expédition interne (Qté en poids vif)", id:"sip_qte_expedition_interne_qte_poids_vif", module:"commerce_marine"},
				{titre:"Qté exportation (Qté en poids vif)", id:"sip_qte_exportation_qte_poids_vif", module:"commerce_marine"},

				{titre:"Expédition par destination", id:"sip_qte_expedie_par_desination", module:"commerce_marine"},

				{titre:"Qté par espèces (Vente locale)", id:"sip_qte_par_espece_vente_local_eau_douce", module:"commerce_eau_douce"},
				{titre:"Qté par district ventillé par espèces (Vente locale)", id:"sip_qte_par_district_espece_vente_local_eau_douce", module:"commerce_eau_douce"},
				{titre:"Qté par région ventillé par espèces (Vente locale)", id:"sip_qte_par_region_espece_vente_local_eau_douce", module:"commerce_eau_douce"},
				{titre:"Prix moyenne par espèces (Vente locale)", id:"sip_prix_moyenne_par_espece_vente_local_eau_douce", module:"commerce_eau_douce"},
				{titre:"Prix moyenne par district (Vente locale)", id:"sip_prix_moyenne_par_district_vente_local_eau_douce", module:"commerce_eau_douce"},
				{titre:"Prix moyenne par région (Vente locale)", id:"sip_prix_moyenne_par_region_vente_local_eau_douce", module:"commerce_eau_douce"},
				{titre:"Qté par opérateur (Vente locale)", id:"sip_qte_par_operateur_vente_local_eau_douce", module:"commerce_eau_douce"},

				{titre:"Qté par espèces (Expédition interne)", id:"sip_qte_par_espece_expedition_interne_eau_douce", module:"commerce_eau_douce"},
				{titre:"Qté par district ventillé par espèces (Expédition interne)", id:"sip_qte_par_district_espece_expedition_interne_eau_douce", module:"commerce_eau_douce"},
				{titre:"Qté par région ventillé par espèces (Expédition interne)", id:"sip_qte_par_region_espece_expedition_interne_eau_douce", module:"commerce_eau_douce"},
				{titre:"Prix moyenne par espèces (Expédition interne)", id:"sip_prix_moyenne_par_espece_expedition_interne_eau_douce", module:"commerce_eau_douce"},
				{titre:"Prix moyenne par district (Expédition interne)", id:"sip_prix_moyenne_par_district_expedition_interne_eau_douce", module:"commerce_eau_douce"},
				{titre:"Prix moyenne par région (Expédition interne)", id:"sip_prix_moyenne_par_region_expedition_interne_eau_douce", module:"commerce_eau_douce"},
				{titre:"Qté par opérateur (Expédition interne)", id:"sip_qte_par_operateur_expedition_interne_eau_douce", module:"commerce_eau_douce"},

				{titre:"Qté par espèces (Exportation)", id:"sip_qte_par_espece_exportation_eau_douce", module:"commerce_eau_douce"},
				{titre:"Qté par district ventillé par espèces (Exportation)", id:"sip_qte_par_district_espece_exportation_eau_douce", module:"commerce_eau_douce"},
				{titre:"Qté par région ventillé par espèces (Exportation)", id:"sip_qte_par_region_espece_exportation_eau_douce", module:"commerce_eau_douce"},
				{titre:"Prix moyenne par espèces (Exportation)", id:"sip_prix_moyenne_par_espece_exportation_eau_douce", module:"commerce_eau_douce"},
				{titre:"Prix moyenne par district (Exportation)", id:"sip_prix_moyenne_par_district_exportation_eau_douce", module:"commerce_eau_douce"},
				{titre:"Prix moyenne par région (Exportation)", id:"sip_prix_moyenne_par_region_exportation_eau_douce", module:"commerce_eau_douce"},
				{titre:"Qté par opérateur (Exportation)", id:"sip_qte_par_operateur_exportation_eau_douce", module:"commerce_eau_douce"},

				{titre:"Qté vente locale (Qté en poids vif)", id:"sip_qte_vente_locale_qte_poids_vif_eau_douce", module:"commerce_eau_douce"},
				{titre:"Qté vente expédition interne (Qté en poids vif)", id:"sip_qte_expedition_interne_qte_poids_vif_eau_douce", module:"commerce_eau_douce"},
				{titre:"Qté exportation (Qté en poids vif)", id:"sip_qte_exportation_qte_poids_vif_eau_douce", module:"commerce_eau_douce"},

				{titre:"Expédition par destination", id:"sip_qte_expedie_par_desination_eau_douce", module:"commerce_eau_douce"}


		    
		        
		    ];

		    vm.get_etat = function(data_masque)
		    {

		    	vm.affiche_load = true ;

				apiFactory.getParamsDynamic("SIP_reporting_halieutique/index?etat="+data_masque.pivot).then(function(result)
				{

					vm.affiche_load = false ;
					vm.reporting_halieutique = result.data.response;
					
						
					vm.entete_etat = Object.keys(vm.reporting_halieutique[0]).map(function(cle) {
				    	return (cle);
					});

						
				});
		    }
		//FIN ETAT
      
    }
})();
