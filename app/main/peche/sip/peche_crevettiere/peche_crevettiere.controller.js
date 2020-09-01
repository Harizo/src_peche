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
			retrieve:'true',
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

				vm.selected_bateau = {} ;
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
				{titre:"Déstination Exp"},
				{titre:"Qté Export"},
				{titre:"PUM Export"},
				{titre:"Val Export"},
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
				vm.commerce_crevette.dest_exp = vm.selected_commerce.dest_exp ;


				vm.commerce_crevette.qte_export = Number(vm.selected_commerce.qte_export) ;
				vm.commerce_crevette.pum_export = Number(vm.selected_commerce.pum_export) ;
				vm.commerce_crevette.val_export = Number(vm.selected_commerce.val_export) ;
				vm.commerce_crevette.dest_export = vm.selected_commerce.dest_export ;
			}

			vm.supprimer_commerce_crevette = function()
			{
				vm.affichage_masque_commerce = false ;
				
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
	                dest_exp:data_masque.dest_exp,

	                qte_export:data_masque.qte_export,
	                pum_export:data_masque.pum_export,
	                val_export:data_masque.val_export,
	                dest_export:data_masque.dest_export
	                
	                
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


			                vm.selected_commerce.qte_export = data_masque.qte_export ;
			                vm.selected_commerce.pum_export = data_masque.pum_export ;
			                vm.selected_commerce.val_export = data_masque.val_export ;
			                vm.selected_commerce.dest_export = data_masque.dest_export ;
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
			                dest_exp:data_masque.dest_exp,

			                qte_export:data_masque.qte_export,
			                pum_export:data_masque.pum_export,
			                val_export:data_masque.val_export,
			                dest_export:data_masque.dest_export
			                            
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

    		vm.entete_liste_exportation = 
	        [
				{titre:"Année"},
				{titre:"Mois"},
				{titre:"Date VISA"},
				{titre:"Numero VISA"},
				{titre:"Date COS"},
				{titre:"Numero COS"},
				{titre:"Date EDRD"},
				{titre:"Espèce"},
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

			vm.ajout_exportation_crevette = function()
			{
				vm.affichage_masque_exportation = true ;
				nouvelle_exportation = true ;
				vm.exportation_crevette = {} ;
				vm.selected_exportation = {} ;
			}

			vm.modif_exportation_crevette = function()
			{
				nouvelle_exportation = false ;
				vm.affichage_masque_exportation = true ;

				vm.exportation_crevette.annee = vm.selected_exportation.annee ;
				vm.exportation_crevette.mois = vm.selected_exportation.mois ;

				vm.exportation_crevette.date_visa = new Date(vm.selected_exportation.date_visa) ;
				vm.exportation_crevette.numero_visa = vm.selected_exportation.numero_visa ;
				vm.exportation_crevette.date_cos = new Date(vm.selected_exportation.date_cos) ;
				vm.exportation_crevette.numero_cos = vm.selected_exportation.numero_cos ;
				vm.exportation_crevette.date_edrd = new Date(vm.selected_exportation.date_edrd) ;

				vm.exportation_crevette.id_espece = vm.selected_exportation.id_espece ;
				vm.exportation_crevette.id_presentation = vm.selected_exportation.id_presentation ;
				vm.exportation_crevette.id_conservation = vm.selected_exportation.id_conservation ;

				vm.exportation_crevette.quantite = Number(vm.selected_exportation.quantite) ;
				vm.exportation_crevette.valeur_ar = Number(vm.selected_exportation.valeur_ar) ;
				vm.exportation_crevette.valeur_euro = Number(vm.selected_exportation.valeur_euro) ;
				vm.exportation_crevette.valeur_usd = Number(vm.selected_exportation.valeur_usd) ;
				vm.exportation_crevette.destination = vm.selected_exportation.destination 
			}

			vm.annuler_exportation = function()
			{
				nouvelle_exportation = false ;
				vm.affichage_masque_exportation = false ;
				vm.selected_exportation = {};
			}

			vm.supprimer_exportation_crevette = function()
			{
				vm.affichage_masque_exportation = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Etes-vous sûr de supprimer cet enregistrement ?')
				  .textContent('Exportation société: '+vm.selected_societe_crevette.nom)
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_in_bdd_exportation(vm.selected_exportation,1);
				}, function() {
				//alert('rien');
				});
			}

			vm.save_in_bdd_exportation = function(data_masque, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };

	            var id = 0 ;

	            if (!nouvelle_exportation) 
	            {
	            	id = vm.selected_exportation.id ;
	            }

	            var datas = $.param(
	            {
	            	
	                id:id,      
	                supprimer:etat_suppression,
	                id_societe_crevette:vm.selected_societe_crevette.id,
	                annee:data_masque.annee,
	                mois:data_masque.mois,

	                date_visa:convert_to_date_sql(data_masque.date_visa),
	                numero_visa:data_masque.numero_visa,
	                date_cos:convert_to_date_sql(data_masque.date_cos),
	                numero_cos:data_masque.numero_cos,
	                date_edrd:convert_to_date_sql(data_masque.date_edrd),

	                id_espece:data_masque.id_espece,
	                id_presentation:data_masque.id_presentation,
	                id_conservation:data_masque.id_conservation,

	                quantite:data_masque.quantite,
	                valeur_ar:data_masque.valeur_ar,
	                valeur_euro:data_masque.valeur_euro,
	                valeur_usd:data_masque.valeur_usd,
	                destination:data_masque.destination
	                
	                
	            });

	            apiFactory.add("SIP_exportation_crevette/index",datas, config).success(function (data)
        		{
        			var cons = vm.all_conservation.filter(function(obj)
					{
						return obj.id == data_masque.id_conservation;
					});

					var pres = vm.all_presentation.filter(function(obj)
					{
						return obj.id == data_masque.id_presentation;
					});

					var esp = vm.all_espece.filter(function(obj)
					{
						return obj.id == data_masque.id_espece;
					});

					if (!nouvelle_exportation) 
        			{
        				if (etat_suppression == 0) 
        				{
        					vm.selected_exportation.annee = data_masque.annee ;
			                vm.selected_exportation.mois = data_masque.mois ;

			                vm.selected_exportation.date_visa = convert_to_date_sql(data_masque.date_visa) ;
			                vm.selected_exportation.numero_visa = data_masque.numero_visa ;
			                vm.selected_exportation.date_cos = convert_to_date_sql(data_masque.date_cos) ;
			                vm.selected_exportation.numero_cos = data_masque.numero_cos ;
			                vm.selected_exportation.date_edrd = convert_to_date_sql(data_masque.date_edrd) ;

			                vm.selected_exportation.id_espece = data_masque.id_espece ;
							vm.selected_exportation.nom_espece = esp[0].nom ;


			                vm.selected_exportation.id_presentation = data_masque.id_presentation ;
			                vm.selected_exportation.libelle_presentation = pres[0].libelle ;

			                vm.selected_exportation.id_conservation = data_masque.id_conservation ;
			                vm.selected_exportation.libelle_conservation = cons[0].libelle ;

							

			                vm.selected_exportation.quantite = data_masque.quantite ;
			                vm.selected_exportation.valeur_ar = data_masque.valeur_ar ;
			                vm.selected_exportation.valeur_euro = data_masque.valeur_euro ;
			                vm.selected_exportation.valeur_usd = data_masque.valeur_usd ;
			                vm.selected_exportation.destination = data_masque.destination ;
        				}
        				else 
        				{
        					vm.all_exportation = vm.all_exportation.filter(function(obj)
							{
								return obj.id !== vm.selected_exportation.id ;
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

							date_visa:convert_to_date_sql(data_masque.date_visa),
			                numero_visa:data_masque.numero_visa,
			                date_cos:convert_to_date_sql(data_masque.date_cos),
			                numero_cos:data_masque.numero_cos,
			                date_edrd:convert_to_date_sql(data_masque.date_edrd),

			                id_espece:data_masque.id_espece,
							nom_espece:esp[0].nom,

							id_conservation:data_masque.id_conservation,
							libelle_conservation:cons[0].libelle,

							id_presentation:data_masque.id_presentation,
							libelle_presentation:pres[0].libelle,



			                quantite:data_masque.quantite,
			                valeur_ar:data_masque.valeur_ar,
			                valeur_euro:data_masque.valeur_euro,
			                valeur_usd:data_masque.valeur_usd,
			                destination:data_masque.destination
			                            
						}          
			            vm.all_exportation.unshift(item);

			            nouvelle_exportation = false ;
        			}

        			vm.affichage_masque_exportation = false ;

        		});
			}
    	//FIN EXPORTATION

    	//BATEAU
    		var nouvelle_bateau = false ;
    		vm.affichage_masque_bateau = false ; 
    		vm.selected_bateau = {} ;
    		
    		vm.bateau_crevette = {} ;
    	

    		vm.entete_liste_bateau = 
	        [
				{titre:"immatriculation"},
				{titre:"Nom"},
				{titre:"Début validité"},
				{titre:"Fin validité"},
				{titre:"Segment"},
				{titre:"Type"},
				{titre:"Année d'acquisition"},
				{titre:"Coût"},
				{titre:"Numero license"},
				{titre:"License 1"},
				{titre:"License 2"}
	        ] ;


	        vm.get_bateau = function()
			{
				vm.affiche_load = true ;
				apiFactory.getParamsDynamic("SIP_bateau_crevette?id_societe_crevette="+vm.selected_societe_crevette.id).then(function(result)
				{
					vm.affiche_load = false ;
					vm.all_bateau = result.data.response;
				});
			}

			vm.selection_bateau = function(item)
			{
				vm.selected_bateau = item ;
				
			}

			$scope.$watch('vm.selected_bateau', function()
			{
				if (!vm.all_bateau) return;
				vm.all_bateau.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_bateau.$selected = true;

			});

			vm.ajout_bateau_crevette = function()
			{
				vm.affichage_masque_bateau = true ;
				nouvelle_bateau = true ;
				vm.bateau_crevette = {} ;
				vm.selected_bateau = {} ;
			}

			vm.modif_bateau_crevette = function()
			{
				nouvelle_bateau = false ;
				vm.affichage_masque_bateau = true ;

				vm.bateau_crevette.immatriculation = vm.selected_bateau.immatriculation ;
				vm.bateau_crevette.nom = vm.selected_bateau.nom ;

				vm.bateau_crevette.deb_validite = new Date(vm.selected_bateau.deb_validite) ;
				vm.bateau_crevette.fin_validite = new Date(vm.selected_bateau.fin_validite) ;

				vm.bateau_crevette.segment = vm.selected_bateau.segment ;
				vm.bateau_crevette.type = vm.selected_bateau.type ;
				vm.bateau_crevette.numero_license = vm.selected_bateau.numero_license ;
				vm.bateau_crevette.license_1 = vm.selected_bateau.license_1 ;
				vm.bateau_crevette.license_2 = vm.selected_bateau.license_2 ;
				vm.bateau_crevette.an_acquis = vm.selected_bateau.an_acquis ;
				vm.bateau_crevette.cout = Number(vm.selected_bateau.cout) ;
			}

			vm.supprimer_bateau_crevette = function()
			{
				vm.affichage_masque_bateau = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Etes-vous sûr de supprimer cet enregistrement ?')
				  .textContent('Bateau du société: '+vm.selected_societe_crevette.nom)
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_in_bdd_bateau(vm.selected_bateau,1);
				}, function() {
				//alert('rien');
				});
			}

			vm.annuler_bateau = function()
			{
				nouvelle_bateau = false ;
				vm.affichage_masque_bateau = false ;
				vm.selected_bateau = {};
			}

			vm.save_in_bdd_bateau = function(data_masque, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };

	            var id = 0 ;

	            if (!nouvelle_bateau) 
	            {
	            	id = vm.selected_bateau.id ;
	            }

	            var datas = $.param(
	            {
	            	
	                id:id,      
	                supprimer:etat_suppression,
	                id_societe_crevette:vm.selected_societe_crevette.id,
	                immatriculation:data_masque.immatriculation,
	                nom:data_masque.nom,
	                deb_validite:convert_to_date_sql(data_masque.deb_validite),
	                fin_validite:convert_to_date_sql(data_masque.fin_validite),
	                segment:data_masque.segment,
	                type:data_masque.type,
	                numero_license:data_masque.numero_license,
	                license_1:data_masque.license_1,
	                license_2:data_masque.license_2,
	                an_acquis:data_masque.an_acquis,
	                cout:data_masque.cout
	                
	                
	            });

	            apiFactory.add("SIP_bateau_crevette/index",datas, config).success(function (data)
        		{
        			if (!nouvelle_bateau) 
        			{
        				if (etat_suppression == 0) 
        				{
        					

			                vm.selected_bateau.immatriculation = data_masque.immatriculation ;
			                vm.selected_bateau.nom = data_masque.nom ;
			                vm.selected_bateau.deb_validite = convert_to_date_sql(data_masque.deb_validite) ;
			                vm.selected_bateau.fin_validite = convert_to_date_sql(data_masque.fin_validite) ;
			                vm.selected_bateau.segment = data_masque.segment ;
			                vm.selected_bateau.type = data_masque.type ;
			                vm.selected_bateau.numero_license = data_masque.numero_license ;
			                vm.selected_bateau.license_1 = data_masque.license_1 ;
			                vm.selected_bateau.license_2 = data_masque.license_2 ;
			                vm.selected_bateau.an_acquis = data_masque.an_acquis ;
			                vm.selected_bateau.cout = data_masque.cout ;
        				}
        				else 
        				{
        					vm.all_bateau = vm.all_bateau.filter(function(obj)
							{
								return obj.id !== vm.selected_bateau.id ;
							});
						
        				}
        			}
        			else
        			{
        				var item =
			            {
							id:String(data.response) ,

							id_societe_crevette:vm.selected_societe_crevette.id,

							immatriculation:data_masque.immatriculation,
			                nom:data_masque.nom,
			                deb_validite:convert_to_date_sql(data_masque.deb_validite),
			                fin_validite:convert_to_date_sql(data_masque.fin_validite),
			                segment:data_masque.segment,
			                type:data_masque.type,
			                numero_license:data_masque.numero_license,
			                license_1:data_masque.license_1,
			                license_2:data_masque.license_2,
			                an_acquis:data_masque.an_acquis,
			                cout:data_masque.cout
			                            
						}          
			            vm.all_bateau.unshift(item);

			            nouvelle_bateau = false ;
        			}

        			vm.affichage_masque_bateau = false ;
	            });

			}
    	//FIN BATEAU

    	//PRODUCTION
    		var nouvelle_production = false ;
    		vm.affichage_masque_production = false ; 
    		vm.selected_production = {} ;
    		
    		vm.production_crevette = {} ;
    	

    		vm.entete_liste_production = 
	        [
				{titre:"Zone de pêche"},
				{titre:"Année"},
				{titre:"Num marée"},
				{titre:"Marée"},
				{titre:"Qté crevette"},
				{titre:"Nombre de fiche"}
	        ] ;


	        vm.get_production = function()
			{
				vm.affiche_load = true ;
				apiFactory.getParamsDynamic("SIP_production_crevette?id_bateau_crevette="+vm.selected_bateau.id).then(function(result)
				{
					vm.affiche_load = false ;
					vm.all_production = result.data.response;
				});
			}

			vm.selection_production = function(item)
			{
				vm.selected_production = item ;
				
			}

			$scope.$watch('vm.selected_production', function()
			{
				if (!vm.all_production) return;
				vm.all_production.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_production.$selected = true;

			});

			vm.ajout_production_crevette = function()
			{
				vm.affichage_masque_production = true ;
				nouvelle_production = true ;
				vm.production_crevette = {} ;
				vm.selected_production = {} ;
			}

			vm.modif_production_crevette = function()
			{
				nouvelle_production = false ;
				vm.affichage_masque_production = true ;

				vm.production_crevette.zone_peche = vm.selected_production.zone_peche ;
				vm.production_crevette.annee = vm.selected_production.annee ;
				vm.production_crevette.num_maree = vm.selected_production.num_maree ;
				vm.production_crevette.maree = vm.selected_production.maree ;
				vm.production_crevette.qte_crevette = Number(vm.selected_production.qte_crevette) ;
				vm.production_crevette.nbr_fiche = Number(vm.selected_production.nbr_fiche) ;
			}

			vm.supprimer_production_crevette = function()
			{
				vm.affichage_masque_production = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Etes-vous sûr de supprimer cet enregistrement ?')
				  .textContent('Production du bateau: '+vm.selected_bateau.nom)
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_in_bdd_production(vm.selected_production,1);
				}, function() {
				//alert('rien');
				});
			}

			vm.annuler_production = function()
			{
				nouvelle_production = false ;
				vm.affichage_masque_production = false ;
				vm.selected_production = {};
			}

			vm.save_in_bdd_production = function(data_masque, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };

	            var id = 0 ;

	            if (!nouvelle_production) 
	            {
	            	id = vm.selected_production.id ;
	            }

	            var datas = $.param(
	            {
	                id:id,      
	                supprimer:etat_suppression,
	                id_bateau_crevette:vm.selected_bateau.id,
	                zone_peche:data_masque.zone_peche,
	                annee:data_masque.annee,
	                num_maree:data_masque.num_maree,
	                maree:data_masque.maree,
	                qte_crevette:data_masque.qte_crevette,
	                nbr_fiche:data_masque.nbr_fiche
	            });

	            apiFactory.add("SIP_production_crevette/index",datas, config).success(function (data)
        		{
        			if (!nouvelle_production) 
        			{
        				if (etat_suppression == 0) 
        				{
        					vm.selected_production.zone_peche = data_masque.zone_peche ;
			                vm.selected_production.annee = data_masque.annee ;
			                vm.selected_production.num_maree = data_masque.num_maree ;
			                vm.selected_production.maree = data_masque.maree ;
			                vm.selected_production.qte_crevette = data_masque.qte_crevette ;
			                vm.selected_production.nbr_fiche = data_masque.nbr_fiche ;
        				}
        				else 
        				{
        					vm.all_production = vm.all_production.filter(function(obj)
							{
								return obj.id !== vm.selected_production.id ;
							});
        				}

        			}
        			else
        			{
        				var item =
			            {
							id:String(data.response) ,
							id_bateau_crevette:vm.selected_bateau.id,
			                zone_peche:data_masque.zone_peche,
			                annee:data_masque.annee,
			                num_maree:data_masque.num_maree,
			                maree:data_masque.maree,
			                qte_crevette:data_masque.qte_crevette,
			                nbr_fiche:data_masque.nbr_fiche
			                            
						}          
			            vm.all_production.unshift(item);

			            nouvelle_production = false ;

        			}

        			vm.affichage_masque_production = false ;
	            });
			}
    	//FIN PRODUCTION

    	//fiche_peche
    		var nouvelle_fiche_peche = false ;
    		vm.affichage_masque_fiche_peche = false ; 
    		vm.selected_fiche_peche = {} ;


    		
    		vm.fiche_peche_crevette = {} ;

    	

    		vm.entete_liste_fiche_peche = 
	        [
				{titre:"Numero fiche"},
				{titre:"Capitaine"},
				{titre:"Date de départ"},
				{titre:"Date de retour"}
	        ] ;


	        


	        vm.get_fiche_peche = function()
			{
				vm.affiche_load = true ;
				apiFactory.getParamsDynamic("SIP_fiche_peche_crevette?id_bateau_crevette="+vm.selected_bateau.id).then(function(result)
				{
					vm.affiche_load = false ;
					vm.all_fiche_peche = result.data.response;
				});
			}


			vm.generer_numero_fiche = function()
			{	
				vm.fiche_peche_crevette.date_depart =  vm.date_now;
				vm.fiche_peche_crevette.date_retour =  vm.date_now;
				var now_year = new Date().getFullYear();
				apiFactory.getParamsDynamic("SIP_fiche_peche_crevette?annee="+now_year).then(function(result)
				{
					
					var nbr = result.data.response.nbr;

					var numero = Number(nbr) + 1;

					if (nbr >= 1000) 
					{
						vm.fiche_peche_crevette.numfp = now_year+""+numero;
					
					}
					if ((nbr >= 100) && (nbr <=999)) 
					{
						vm.fiche_peche_crevette.numfp = now_year+"0"+numero;
					
					}
					if ((nbr >= 10) && (nbr <=99)) 
					{
						vm.fiche_peche_crevette.numfp = now_year+"00"+numero;
					
					}


					if ((nbr >= 0) && (nbr <=9)) 
					{
						vm.fiche_peche_crevette.numfp = now_year+"000"+numero;
					
					}
				});

			}

			

			vm.selection_fiche_peche = function(item)
			{
				vm.selected_fiche_peche = item ;
				vm.get_sequence_peche(item);

				
			}

			$scope.$watch('vm.selected_fiche_peche', function()
			{
				if (!vm.all_fiche_peche) return;
				vm.all_fiche_peche.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_fiche_peche.$selected = true;

			});

			//sequence peche
				vm.entete_sequence_peche = 
		        [
					{titre:"N° Séquence de pêche"}
		        ] ;
				vm.selected_sequence_peche = {} ;
				var current_selected_sequence_peche = {} ;
				var nouvelle_sequence_peche = false ;

				vm.get_sequence_peche = function(item)
		        {
		        	vm.selected_sequence_peche = {} ;
					vm.affiche_load = true ;
					apiFactory.getParamsDynamic("SIP_sequence_peche?id_fiche_peche_crevette="+item.id).then(function(result)
					{
						vm.affiche_load = false ;
						vm.all_sequence_peche = result.data.response;

					});
		        }

		        vm.selection_sequence_peche = function(item)
		        {
					vm.selected_sequence_peche = item ;
					current_selected_sequence_peche = angular.copy(vm.selected_sequence_peche);

					if (item.id !=0) //si déjà enregistrer
					{
						vm.get_sequence_transbordement(item);
						vm.get_sequence_capture(item);

					}

					if (!vm.selected_sequence_peche.$edit) //si simple selection
					{
						nouvelle_sequence_peche = false ;
					}

		        }

		        $scope.$watch('vm.selected_sequence_peche', function()
		        {
		          if (!vm.all_sequence_peche) return;
		          vm.all_sequence_peche.forEach(function(item)
		          {
		            item.$selected = false;
		          });
		          vm.selected_sequence_peche.$selected = true;

		        });

		        vm.generer_numero_sequence_peche = function()
				{	
					vm.xxx = 0 ;
					var now_year = new Date(vm.selected_fiche_peche.date_depart).getFullYear();
					
					apiFactory.getParamsDynamic("SIP_sequence_peche?annee="+now_year+"&get_nbr_sequence_peche=1").then(function(result)
					{
						
						var nbr = result.data.response[0].nbr_sequence_peche;

						var numero = Number(nbr) + 1;
						

						if (numero >= 1000) 
						{
							vm.xxx = now_year+""+numero;
						
						}
						if ((numero >= 100) && (numero <=999)) 
						{
							vm.xxx = now_year+"0"+numero;
						
						}
						if ((numero >= 10) && (numero <=99)) 
						{
							vm.xxx = now_year+"00"+numero;
						
						}


						if ((numero >= 0) && (numero <=9)) 
						{
							vm.xxx = now_year+"000"+numero;
						
						}

						var item = 
			            {
			              
							$edit: true,
							$selected: true,
							id:'0',
							numseqpeche:vm.xxx
			            } ;

		          		vm.all_sequence_peche.unshift(item);
		                vm.all_sequence_peche.forEach(function(af)
		                {
							if(af.$selected == true)
							{
								vm.selected_sequence_peche = af;

							}
		                });
					});

				}

				vm.affichage_espece = function(id_espece) 
				{
					var esp = vm.all_espece.filter(function(obj)
                    {
                      return obj.id == id_espece;
                    });

                    return esp[0].nom ;

				}

		        vm.ajouter_sequence_peche = function()
		        {
		        	vm.generer_numero_sequence_peche();
		          	nouvelle_sequence_peche = true ;
		          
		        }

		        vm.modifier_sequence_peche = function()
		        {
		          nouvelle_sequence_peche = false ;
		          vm.selected_sequence_peche.$edit = true;
		          vm.selected_sequence_peche.date = new Date(vm.selected_sequence_peche.date);
		          
		        }

		        vm.supprimer_sequence_peche = function()
		        {

		          
		          var confirm = $mdDialog.confirm()
		            .title('Etes-vous sûr de supprimer cet enregistrement ?')
		            .textContent('Cliquer sur OK pour confirmer')
		            .ariaLabel('Lucky day')
		            .clickOutsideToClose(true)
		            .parent(angular.element(document.body))
		            .ok('OK')
		            .cancel('Annuler');
		          $mdDialog.show(confirm).then(function() {

		          vm.enregistrer_sequence_peche(1);
		          }, function() {
		          //alert('rien');
		          });
		        }

		        vm.annuler_sequence_peche = function()
		        {
		          if (nouvelle_sequence_peche) 
		          {
		            vm.all_sequence_peche.shift();
		            vm.selected_sequence_peche = {} ;
		            nouvelle_sequence_peche = false ;
		          }
		          else
		          {
		            vm.selected_sequence_peche.$selected = false;
		            vm.selected_sequence_peche.$edit = false;
		            vm.selected_sequence_peche.numseqpeche = current_selected_sequence_peche.numseqpeche ;
		            vm.selected_sequence_peche = {};



		          }
		        }

		        vm.enregistrer_sequence_peche = function(etat_suppression)
		        {
		          var config = {
		                    headers : {
		                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
		                    }
		                };


		                var datas = $.param(
		                {
		                  
		                    supprimer:etat_suppression,
		                    id_fiche_peche_crevette:vm.selected_fiche_peche.id,
		                    id:vm.selected_sequence_peche.id,

		                    numseqpeche:vm.selected_sequence_peche.numseqpeche
		                    
		                    
		                });

		                apiFactory.add("SIP_sequence_peche/index",datas, config).success(function (data)
						{
						if (!nouvelle_sequence_peche) 
						{
							if (etat_suppression == 0) 
							{
								vm.selected_sequence_peche.$edit = false ;
								vm.selected_sequence_peche.$selected = false ;
								vm.selected_sequence_peche = {} ;
							}
							else
							{
								vm.all_sequence_peche = vm.all_sequence_peche.filter(function(obj)
								{
								  return obj.id !== vm.selected_sequence_peche.id;
								});

								vm.selected_sequence_peche = {} ;
							}

							}
							else
							{
								vm.selected_sequence_peche.$edit = false ;
								vm.selected_sequence_peche.$selected = false ;
								vm.selected_sequence_peche.id = String(data.response) ;
								vm.selected_sequence_peche.id_fiche_peche_crevette = vm.selected_fiche_peche.id ;

								nouvelle_sequence_peche = false ;
								vm.selected_sequence_peche = {};

							}
						})
						.error(function (data) {alert("Une erreur s'est produit");});
		        }

		      

		    //fin sequence peche

			//sequence transbordement
				vm.entete_sequence_transbordement = 
		        [
					{titre:"Date"},
					{titre:"HeureP"},
					{titre:"MinuteP"},
					{titre:"HeureT"},
					{titre:"MinuteT"},
					{titre:"Post latitude"},
					{titre:"Post longitude"}
		        ] ;
	    		vm.selected_sequence_transbordement = {} ;
	    		var current_selected_sequence_transbordement = {} ;
	    		var nouvelle_sequence_transbordement = false ;

	    		vm.get_sequence_transbordement = function(item)
				{
					vm.affiche_load = true ;
					apiFactory.getParamsDynamic("SIP_sequence_transbordement?id_sequence_peche="+item.id).then(function(result)
					{
						vm.affiche_load = false ;
						vm.all_sequence_transbordement = result.data.response;

						
					});
				}

				vm.selection_sequence_transbordement = function(item)
				{
					vm.selected_sequence_transbordement = item ;
					

					if (!vm.selected_sequence_transbordement.$edit) //si simple selection
					{
						nouvelle_sequence_transbordement = false ;	
					}

					

					


				}

				$scope.$watch('vm.selected_sequence_transbordement', function()
				{
					if (!vm.all_sequence_transbordement) return;
					vm.all_sequence_transbordement.forEach(function(item)
					{
						item.$selected = false;
					});
					vm.selected_sequence_transbordement.$selected = true;

				});

				vm.ajouter_sequence_transbordement = function()
				{
					nouvelle_sequence_transbordement = true ;
					var item = 
						{
							
							$edit: true,
							$selected: true,
		              		id:'0',
		              		date:new Date(),
		              		heurep:'0',
		              		minutep:'0',
		              		heuret:'0',
		              		minutet:'0',
		              		postlatitude:'',
		              		postlongitude:''
						} ;

					vm.all_sequence_transbordement.unshift(item);
		            vm.all_sequence_transbordement.forEach(function(af)
		            {
		              if(af.$selected == true)
		              {
		                vm.selected_sequence_transbordement = af;
		                
		              }
	            	});
				}

				vm.modifier_sequence_transbordement = function()
				{
					nouvelle_sequence_transbordement = false ;
					vm.selected_sequence_transbordement.$edit = true;
					vm.selected_sequence_transbordement.date = new Date(vm.selected_sequence_transbordement.date);
					current_selected_sequence_transbordement = angular.copy(vm.selected_sequence_transbordement);
				}

				vm.supprimer_sequence_transbordement = function()
				{

					
					var confirm = $mdDialog.confirm()
					  .title('Etes-vous sûr de supprimer cet enregistrement ?')
					  .textContent('Cliquer sur OK pour confirmer')
					  .ariaLabel('Lucky day')
					  .clickOutsideToClose(true)
					  .parent(angular.element(document.body))
					  .ok('OK')
					  .cancel('Annuler');
					$mdDialog.show(confirm).then(function() {

					vm.enregistrer_sequence_transbordement(1);
					}, function() {
					//alert('rien');
					});
				}

				vm.annuler_sequence_transbordement = function()
				{
					if (nouvelle_sequence_transbordement) 
					{
						
						vm.all_sequence_transbordement.shift();
						vm.selected_sequence_transbordement = {} ;
						nouvelle_sequence_transbordement = false ;
					}
					else
					{
						vm.selected_sequence_transbordement.$selected = false;
						vm.selected_sequence_transbordement.$edit = false;
						vm.selected_sequence_transbordement.date = current_selected_sequence_transbordement.date ;
						vm.selected_sequence_transbordement.heurep = current_selected_sequence_transbordement.heurep ;
						vm.selected_sequence_transbordement.minutep = current_selected_sequence_transbordement.minutep ;
						vm.selected_sequence_transbordement.heuret = current_selected_sequence_transbordement.heuret ;
						vm.selected_sequence_transbordement.minutet = current_selected_sequence_transbordement.minutet ;
						vm.selected_sequence_transbordement.postlatitude = current_selected_sequence_transbordement.postlatitude ;
						vm.selected_sequence_transbordement.postlongitude = current_selected_sequence_transbordement.postlongitude ;
						vm.selected_sequence_transbordement = {};



					}
				}

				vm.enregistrer_sequence_transbordement = function(etat_suppression)
				{
					var config = {
		                headers : {
		                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
		                }
		            };


		            var datas = $.param(
		            {
		            	
		                supprimer:etat_suppression,
		                id_sequence_peche:vm.selected_sequence_peche.id,
		                id:vm.selected_sequence_transbordement.id,

		                date:convert_to_date_sql(vm.selected_sequence_transbordement.date),
		                heurep:vm.selected_sequence_transbordement.heurep,
		                minutep:vm.selected_sequence_transbordement.minutep,

		                heuret:vm.selected_sequence_transbordement.heuret,
		                minutet:vm.selected_sequence_transbordement.minutet,

		                postlatitude:vm.selected_sequence_transbordement.postlatitude,
		                postlongitude:vm.selected_sequence_transbordement.postlongitude
		                
		                
		            });

		            apiFactory.add("SIP_sequence_transbordement/index",datas, config).success(function (data)
	        		{
	        			if (!nouvelle_sequence_transbordement) 
	        			{
	        				if (etat_suppression == 0) 
	        				{
	        					vm.selected_sequence_transbordement.$edit = false ;
	        					vm.selected_sequence_transbordement.$selected = false ;
	        					vm.selected_sequence_transbordement = {} ;
	        				}
	        				else
	        				{
	        					vm.all_sequence_transbordement = vm.all_sequence_transbordement.filter(function(obj)
								{
									return obj.id !== vm.selected_sequence_transbordement.id;
								});

								vm.selected_sequence_transbordement = {} ;
	        				}

	        			}
	        			else
	        			{
	        				vm.selected_sequence_transbordement.$edit = false ;
	        				vm.selected_sequence_transbordement.$selected = false ;
	        				//vm.selected_arrivee_fiche.$selected = false ;
	        				vm.selected_sequence_transbordement.id = String(data.response) ;
	        				vm.selected_sequence_transbordement.id_sequence_peche = vm.selected_sequence_peche.id ;
	        				/*vm.selected_sequence_transbordement.heurep = vm.sequence_transbordement.heurep ;
	        				vm.selected_sequence_transbordement.minutep = vm.sequence_transbordement.minutep ;
	        				vm.selected_sequence_transbordement.heuret = vm.sequence_transbordement.heuret ;
	        				vm.selected_sequence_transbordement.minutet = vm.sequence_transbordement.minutet ;
	        				vm.selected_sequence_transbordement.postlatitude = vm.sequence_transbordement.postlatitude ;
	        				vm.selected_sequence_transbordement.postlongitude = vm.sequence_transbordement.postlongitude ;*/

	        				nouvelle_sequence_transbordement = false ;
	        				vm.selected_sequence_transbordement = {};

	        			}
	        		})
	        		.error(function (data) {alert("Une erreur s'est produit");});
				}

			

			//fin sequence transbordement

			//sequence capture
				vm.entete_sequence_capture = 
		        [
					{titre:"Espèce"},
					{titre:"Quantité (Kg)"}
		        ] ;
	    		vm.selected_sequence_capture = {} ;
	    		var current_selected_sequence_capture = {} ;
	    		var nouvelle_sequence_capture = false ;

	    		vm.get_sequence_capture = function(item)
				{
					vm.affiche_load = true ;
					apiFactory.getParamsDynamic("SIP_sequence_capture?id_sequence_peche="+item.id).then(function(result)
					{
						vm.affiche_load = false ;
						vm.all_sequence_capture = result.data.response;

					});
				}

				vm.selection_sequence_capture = function(item)
				{
					vm.selected_sequence_capture = item ;

					if (!vm.selected_sequence_capture.$edit) //si simple selection
					{
						nouvelle_sequence_capture = false ;	
					}

					

					


				}

				$scope.$watch('vm.selected_sequence_capture', function()
				{
					if (!vm.all_sequence_capture) return;
					vm.all_sequence_capture.forEach(function(item)
					{
						item.$selected = false;
					});
					vm.selected_sequence_capture.$selected = true;

				});

				vm.ajouter_sequence_capture = function()
				{
					nouvelle_sequence_capture = true ;
					var item = 
						{
							
							$edit: true,
							$selected: true,
		              		id:'0',
		              		id_espece:'',
		              		quantite:0
						} ;

					vm.all_sequence_capture.unshift(item);
		            vm.all_sequence_capture.forEach(function(af)
		            {
		              if(af.$selected == true)
		              {
		                vm.selected_sequence_capture = af;
		                
		              }
	            	});
				}

				vm.modifier_sequence_capture = function()
				{
					nouvelle_sequence_capture = false ;
					vm.selected_sequence_capture.$edit = true;
					vm.selected_sequence_capture.quantite = Number(vm.selected_sequence_capture.quantite);
					current_selected_sequence_capture = angular.copy(vm.selected_sequence_capture);
				}

				vm.supprimer_sequence_capture = function()
				{

					
					var confirm = $mdDialog.confirm()
					  .title('Etes-vous sûr de supprimer cet enregistrement ?')
					  .textContent('Cliquer sur OK pour confirmer')
					  .ariaLabel('Lucky day')
					  .clickOutsideToClose(true)
					  .parent(angular.element(document.body))
					  .ok('OK')
					  .cancel('Annuler');
					$mdDialog.show(confirm).then(function() {

					vm.enregistrer_sequence_capture(1);
					}, function() {
					//alert('rien');
					});
				}

				vm.annuler_sequence_capture = function()
				{
					if (nouvelle_sequence_capture) 
					{
						
						vm.all_sequence_capture.shift();
						vm.selected_sequence_capture = {} ;
						nouvelle_sequence_capture = false ;
					}
					else
					{
						vm.selected_sequence_capture.$selected = false;
						vm.selected_sequence_capture.$edit = false;
						vm.selected_sequence_capture.id_espece = current_selected_sequence_capture.id_espece ;
						vm.selected_sequence_capture.quantite = current_selected_sequence_capture.quantite 
						vm.selected_sequence_capture = {};



					}
				}

				vm.enregistrer_sequence_capture = function(etat_suppression)
				{
					var config = {
		                headers : {
		                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
		                }
		            };


		            var datas = $.param(
		            {
		            	
		                supprimer:etat_suppression,
		                id_sequence_peche:vm.selected_sequence_peche.id,
		                id:vm.selected_sequence_capture.id,

		                id_espece:vm.selected_sequence_capture.id_espece,
		                quantite:vm.selected_sequence_capture.quantite
		                
		                
		            });

		            apiFactory.add("SIP_sequence_capture/index",datas, config).success(function (data)
	        		{
	        			if (!nouvelle_sequence_capture) 
	        			{
	        				if (etat_suppression == 0) 
	        				{
	        					vm.selected_sequence_capture.$edit = false ;
	        					vm.selected_sequence_capture.$selected = false ;
	        					vm.selected_sequence_capture = {} ;
	        				}
	        				else
	        				{
	        					vm.all_sequence_capture = vm.all_sequence_capture.filter(function(obj)
								{
									return obj.id !== vm.selected_sequence_capture.id;
								});

								vm.selected_sequence_capture = {} ;
	        				}

	        			}
	        			else
	        			{
	        				vm.selected_sequence_capture.$edit = false ;
	        				vm.selected_sequence_capture.$selected = false ;
	        				vm.selected_sequence_capture.id = String(data.response) ;
	        				vm.selected_sequence_capture.id_sequence_peche = vm.selected_sequence_peche.id ;

	        				nouvelle_sequence_capture = false ;
	        				vm.selected_sequence_capture = {};

	        			}
	        		})
	        		.error(function (data) {alert("Une erreur s'est produit");});
				}

			

			//fin sequence capture

			vm.ajout_fiche_peche_crevette = function()
			{
				vm.affichage_masque_fiche_peche = true ;
				nouvelle_fiche_peche = true ;
				vm.fiche_peche_crevette = {} ;
				vm.selected_fiche_peche = {} ;

				vm.generer_numero_fiche();
			}

			vm.modif_fiche_peche_crevette = function()
			{
				nouvelle_fiche_peche = false ;
				vm.affichage_masque_fiche_peche = true ;

				vm.fiche_peche_crevette.numfp = vm.selected_fiche_peche.numfp ;
				vm.fiche_peche_crevette.nom_capitaine = vm.selected_fiche_peche.nom_capitaine ;
				vm.fiche_peche_crevette.date_depart = new Date(vm.selected_fiche_peche.date_depart) ;
				vm.fiche_peche_crevette.date_retour = new Date(vm.selected_fiche_peche.date_retour) ;
			}

			vm.supprimer_fiche_peche_crevette = function()
			{
				vm.affichage_masque_fiche_peche = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Etes-vous sûr de supprimer cet enregistrement ?')
				  .textContent('fiche_peche du bateau: '+vm.selected_bateau.nom)
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_in_bdd_fiche_peche(vm.selected_fiche_peche,1);
				}, function() {
				//alert('rien');
				});
			}

			vm.annuler_fiche_peche = function()
			{
				nouvelle_fiche_peche = false ;
				vm.affichage_masque_fiche_peche = false ;
				vm.selected_fiche_peche = {};
			}

			vm.save_in_bdd_fiche_peche = function(data_masque, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };

	            var id = 0 ;

	            if (!nouvelle_fiche_peche) 
	            {
	            	id = vm.selected_fiche_peche.id ;
	            }

	            var datas = $.param(
	            {
	                id:id,      
	                supprimer:etat_suppression,
	                id_bateau_crevette:vm.selected_bateau.id,
	                numfp:data_masque.numfp,
	                nom_capitaine:data_masque.nom_capitaine,
	                date_depart:convert_to_date_sql(data_masque.date_depart),
	                date_retour:convert_to_date_sql(data_masque.date_retour)
	            });

	            apiFactory.add("SIP_fiche_peche_crevette/index",datas, config).success(function (data)
        		{
        			if (!nouvelle_fiche_peche) 
        			{
        				if (etat_suppression == 0) 
        				{
        					vm.selected_fiche_peche.numfp = data_masque.numfp ;
			                vm.selected_fiche_peche.nom_capitaine = data_masque.nom_capitaine ;
			                vm.selected_fiche_peche.date_depart = convert_to_date_sql(data_masque.date_depart) ;
			                vm.selected_fiche_peche.date_retour = convert_to_date_sql(data_masque.date_retour) ;
        				}
        				else 
        				{
        					vm.all_fiche_peche = vm.all_fiche_peche.filter(function(obj)
							{
								return obj.id !== vm.selected_fiche_peche.id ;
							});
        				}

        			}
        			else
        			{
        				var item =
			            {
							id:String(data.response) ,
							id_bateau_crevette:vm.selected_bateau.id,
			                numfp:data_masque.numfp,
			                nom_capitaine:data_masque.nom_capitaine,
			                date_depart:convert_to_date_sql(data_masque.date_depart),
			                date_retour:convert_to_date_sql(data_masque.date_retour)
			                            
						}          
			            vm.all_fiche_peche.unshift(item);

			            nouvelle_fiche_peche = false ;

        			}

        			vm.affichage_masque_fiche_peche = false ;
	            });
			}
    	//FIN fiche_peche

    	
    }
})();