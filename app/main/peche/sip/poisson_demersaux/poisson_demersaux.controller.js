(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.poisson_demersaux')
        .controller('Poisson_demersauxController', Poisson_demersauxController);

    /** @ngInject */
    function Poisson_demersauxController(apiFactory, $scope, $mdDialog,apiUrlExportexcel)
    {
        var vm = this;
        vm.date_now = new Date();
		// Date arrivée par défaut : now
		vm.filtre=[];
		vm.filtre.date_arrive=new Date();
		vm.all_poisson_demersaux=[];
        vm.all_espece =[];
        vm.donnees_reporting=[];
		vm.selected_detail_dynamique={};

		vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			order:[] 
		};
		vm.entete_etat =[];
		vm.afficher_table =true; // Affichage détail table par ligne
		//DEBUT Table paramètre
			apiFactory.getAPIgeneraliser("SIP_navire/index","id_type_navire",3).then(function(result)
			{
				// id_type_navire=3  <=> Navire demersaux
				vm.all_navire = result.data.response;	
			});
			apiFactory.getAPIgeneraliser("SIP_espece/index","id_type_espece",3).then(function(result)
			{
				// id_type_espece=3  <=> Poisson demersaux
				vm.all_espece = result.data.response;	
			});
			apiFactory.getAPIgeneraliser("SIP_poisson_demersaux/index","liste_annee",1).then(function(result)
			{
				vm.annees = result.data.response;	
			});
		//FIN Table paramètre

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
		// DEBUT fonction relative aux filtres
        vm.modifierDatedepart = function() {
			if(convert_to_date_sql(vm.filtre.date_depart) > convert_to_date_sql(vm.filtre.date_arrive)) {
				vm.filtre.date_depart=vm.filtre.date_arrive;
			}	
		}		
        vm.modifierDatearrive = function(){
			if(convert_to_date_sql(vm.filtre.date_arrive)!=undefined && convert_to_date_sql(vm.filtre.date_arrive) >'') {
				if(convert_to_date_sql(vm.filtre.date_arrive) < convert_to_date_sql(vm.filtre.date_depart)) {
					vm.filtre.date_arrive = vm.filtre.date_depart;
				}
			}
		}
		vm.Filtrer = function() {
			vm.affiche_load=true;
			vm.selected_poisson_demersaux ={};
			apiFactory.getAPIgeneraliserREST("SIP_poisson_demersaux/index","date_depart",convert_to_date_sql(vm.filtre.date_depart),"date_arrive",convert_to_date_sql(vm.filtre.date_arrive),"annee",vm.filtre.annee,"mois",vm.filtre.mois).then(function(result)
			{
				vm.all_poisson_demersaux = result.data.response;
				vm.affiche_load=false;
				if(vm.all_poisson_demersaux.length==0 || !vm.all_poisson_demersaux) {
					vm.showAlert("INFORMATION","Aucune donnée à afficher pour le(s) filtre(s) spécifié(s) !.Merci");					
				}
			});			
		}		
		// FIN fonction relative aux filtres
		vm.showAlert = function(titre,textcontent) {
			// Appending dialog to document.body to cover sidenav in docs app
			// Modal dialogs should fully cover application
			// to prevent interaction outside of dialog
			$mdDialog.show(
			  $mdDialog.alert()
				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(false)
				.parent(angular.element(document.body))
				.title(titre)
				.textContent(textcontent)
				.ariaLabel('Alert Dialog Demo')
				.ok('Fermer')
				.targetEvent()
			);
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
		//Poisson demersaux
			vm.selected_poisson_demersaux = {};
			var nouvel_col_mar = false ;
			vm.affichage_masque_poisson_demersaux = false ;
			vm.entete_liste_poisson_demersaux = 
	        [
				{titre:"Navire"},
				{titre:"Nom capitaine"},
				{titre:"Port"},
				{titre:"N° marrée"},
				{titre:"Départ"},
				{titre:"Arrivée"},
				{titre:"Année"},
				{titre:"Mois"},
				{titre:"Réf produit"},
	        ] ;
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
			vm.selection_poisson_demersaux = function(cm)
			{
				vm.selected_poisson_demersaux = cm ;
				vm.get_detail_poisson_demersaux();	
			}

			$scope.$watch('vm.selected_poisson_demersaux', function()
			{
				if (!vm.all_poisson_demersaux) return;
				vm.all_poisson_demersaux.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_poisson_demersaux.$selected = true;
			});
			vm.ajout_col_poisson_demersaux = function()
			{
				vm.afficher_table =false;
				vm.col_poisson_demersaux = {};
				vm.selected_poisson_demersaux = {};
				vm.affichage_masque_poisson_demersaux = true ;
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
			vm.modifier_poisson_demersaux = function()
			{
				vm.afficher_table =false;
				nouvel_col_mar = false ;
				vm.affichage_masque_poisson_demersaux = true ;
				vm.col_poisson_demersaux.id_navire = vm.selected_poisson_demersaux.id_navire ;
				vm.col_poisson_demersaux.nom_navire = vm.selected_poisson_demersaux.nom_navire ;
				vm.col_poisson_demersaux.immatricule = vm.selected_poisson_demersaux.immatricule ;
				vm.col_poisson_demersaux.nom_capitaine = vm.selected_poisson_demersaux.nom_capitaine ;
				vm.col_poisson_demersaux.port = vm.selected_poisson_demersaux.port ;
				vm.col_poisson_demersaux.num_maree = vm.selected_poisson_demersaux.num_maree ;
				vm.col_poisson_demersaux.date_depart = new Date(vm.selected_poisson_demersaux.date_depart) ;
				vm.col_poisson_demersaux.date_arrive = new Date(vm.selected_poisson_demersaux.date_arrive) ;
				vm.col_poisson_demersaux.annee = parseInt(vm.selected_poisson_demersaux.annee) ;
				vm.col_poisson_demersaux.mois = parseInt(vm.selected_poisson_demersaux.mois) ;
				vm.col_poisson_demersaux.reference_produit =vm.selected_poisson_demersaux.reference_produit ;
			}
			vm.annuler_poisson_demersaux = function()
			{
				vm.afficher_table =true;
				nouvel_col_mar = false ;
				vm.affichage_masque_poisson_demersaux = false ;
				vm.selected_poisson_demersaux = {};
			}
			vm.supprimer_poisson_demersaux = function() 
			{
				vm.affichage_masque_poisson_demersaux = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Confirmation de suppression')
				  .textContent('Etes-vous sûr de supprimer cet enregistrement ainsi que les détails de capture ?')
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_poisson_demersaux(vm.selected_poisson_demersaux,1);
				}, function() {
				//alert('rien');
				});
			}
			vm.save_poisson_demersaux = function(data_masque, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };
	            var id = 0 ;

	            if (!nouvel_col_mar) 
	            {
	            	id = vm.selected_poisson_demersaux.id ;
	            }
	            var datas = $.param(
	            {	            	
	                id:id,      
	                supprimer:etat_suppression,
	                id_navire:data_masque.id_navire,
	                immatricule:data_masque.immatricule,
	                nom_navire:data_masque.nom_navire,
	                nom_capitaine:data_masque.nom_capitaine,
	                port:data_masque.port,	                
	                num_maree:data_masque.num_maree,
	                date_depart:convert_to_date_sql(data_masque.date_depart),	                
	                date_arrive:convert_to_date_sql(data_masque.date_arrive),	                
	                annee:data_masque.annee,	                
	                mois:data_masque.mois,	                
	                reference_produit:data_masque.reference_produit,	                
	            });
	            apiFactory.add("SIP_poisson_demersaux/index",datas, config).success(function (data)
        		{
        			if (!nouvel_col_mar) 
        			{
        				if (etat_suppression == 0) //mise à jour
        				{
        					vm.selected_poisson_demersaux.id_navire = 

        					vm.selected_poisson_demersaux.id_navire = data_masque.id_navire,
			                vm.selected_poisson_demersaux.immatricule = data_masque.immatricule,
			                vm.selected_poisson_demersaux.nom_navire = data_masque.nom_navire,
			                vm.selected_poisson_demersaux.nom_capitaine = data_masque.nom_capitaine,
			                vm.selected_poisson_demersaux.port = data_masque.port,
			                vm.selected_poisson_demersaux.num_maree = data_masque.num_maree,
			                vm.selected_poisson_demersaux.date_depart = data_masque.date_depart,
			                vm.selected_poisson_demersaux.date_arrive = data_masque.date_arrive,
			                vm.selected_poisson_demersaux.annee = data_masque.annee,
			                vm.selected_poisson_demersaux.mois = data_masque.mois,
			                vm.selected_poisson_demersaux.reference_produit = data_masque.reference_produit
        				}
        				else//Suppression
        				{
        					vm.all_poisson_demersaux = vm.all_poisson_demersaux.filter(function(obj)
							{
								return obj.id !== vm.selected_poisson_demersaux.id;
							});

        				}
        			}
        			else
        			{
        				var item =
			            {
							id:String(data.response) ,
							id_navire:data_masque.id_navire,
							immatricule:data_masque.immatricule,
							nom_navire:data_masque.nom_navire,
							nom_capitaine:data_masque.nom_capitaine,
							port:data_masque.port,                   
							num_maree:data_masque.num_maree,
							date_depart:data_masque.date_depart,                   
							date_arrive:data_masque.date_arrive,                   
							annee:data_masque.annee,                   
							mois:data_masque.mois,                   
							reference_produit:data_masque.reference_produit,                   
						}          
			            vm.all_poisson_demersaux.unshift(item);
        			}
	        		vm.affichage_masque_poisson_demersaux = false ; //Fermeture de la masque de saisie
					vm.afficher_table =true;
	        		nouvel_col_mar = false;
					vm.selected_poisson_demersaux = {};
        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
			vm.modifierNavire = function (item) { 
				vm.nontrouvee=true;
				vm.all_navire.forEach(function(navi) {
					if(parseInt(navi.id)==parseInt(item.id_navire)) {
						vm.nontrouvee=false;
						vm.col_poisson_demersaux.id_navire=navi.id;
						vm.col_poisson_demersaux.nom_navire=navi.nom_navire;
						vm.col_poisson_demersaux.immatricule=navi.immatricule;
					}
				});
				if(vm.nontrouvee==true) {				
						vm.col_poisson_demersaux.id_navire = null; 
						vm.col_poisson_demersaux.nom_navire = null; 
						vm.col_poisson_demersaux.immatricule = null; 
						
				}
			}	
			vm.modifierEspece = function (item) { 
				vm.nontrouvee=true;
				vm.all_espece.forEach(function(esp) {
					if(parseInt(esp.id)==parseInt(item.id_espece)) {
						vm.nontrouvee=false;
						item.id_espece=esp.id;
						item.nom_espece=esp.nom;
						item.code_espece=esp.code;
					}
				});
				if(vm.nontrouvee==true) {				
						item.id_espece = null; 
						item.nom_espece = null; 
						item.code_espece = null; 
				}
			}	
		//FIN Poisson demersaux     
 		//DETAIL POISSON DEMERSAUX
			vm.selected_detail_poisson_demersaux = {};
			var nouvel_detail_poisson_demersaux = false ;
			var currentItem_detail_poisson_demersaux={};
			vm.entete_liste_detail_poisson_demersaux = 
	        [{titre:"Espèce"},{titre:"Quantité"},{titre:"Actions"}] ;
	        vm.get_detail_poisson_demersaux = function()
	        {
					vm.affiche_load=true;
					vm.selected_detail_poisson_demersaux={};
					//GET DETAIL POISSON DEMERSAUX MALAGASY
					apiFactory.getAPIgeneraliserREST("SIP_poisson_demersaux_detail/index","id_sip_poisson_demersaux",vm.selected_poisson_demersaux.id).then(function(result)
					{
						//Réinitialisation 2 fils : pi,capture car chaque fois qu'on clique sur l'onglet => les détails doivent être réinitialisé
						vm.all_detail_poisson_demersaux=[];
						vm.all_detail_poisson_demersaux=result.data.response;
						vm.affiche_load=false;
					});
					//FIN DETAIL POISSON DEMERSAUX MALAGASY
	        }
	        vm.selection_detail_poisson_demersaux = function(detail_poisson_demersaux)
	        {
	        	vm.selected_detail_poisson_demersaux = detail_poisson_demersaux ;
	        }
	        $scope.$watch('vm.selected_detail_poisson_demersaux', function()
			{
				if (!vm.all_detail_poisson_demersaux) return;
				vm.all_detail_poisson_demersaux.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_detail_poisson_demersaux.$selected = true;
			});
			vm.ajout_detail_poisson_demersaux = function()
			{
				vm.selected_detail_poisson_demersaux = {};
				nouvel_detail_poisson_demersaux = true ;
				vm.selected_detail_poisson_demersaux.$selected = false;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					id_sip_poisson_demersaux: vm.selected_poisson_demersaux.id ,
					id_espece: null ,
					quantite: null ,
					nom_espece: null ,
					code_espece: null ,
				};
				vm.all_detail_poisson_demersaux.unshift(items);
				vm.all_detail_poisson_demersaux.forEach(function(it) {
					if(it.$selected==true) {
						vm.selected_detail_poisson_demersaux = it;
					}
				});			
			}
			vm.modif_detail_poisson_demersaux = function(item)
			{
				nouvel_detail_poisson_demersaux = false ;
				vm.selected_detail_poisson_demersaux = item;
				currentItem_detail_poisson_demersaux = angular.copy(vm.selected_detail_poisson_demersaux);
				$scope.vm.all_detail_poisson_demersaux.forEach(function(it) {
					it.$edit = false;
				});        
				item.$edit = true;	
				vm.selected_detail_poisson_demersaux.$edit = true;	
				item.$selected = true;	
				vm.selected_detail_poisson_demersaux.$selected = true;	
				vm.selected_detail_poisson_demersaux.id_espece=parseInt(vm.selected_detail_poisson_demersaux.id_espece);
				vm.selected_detail_poisson_demersaux.quantite=parseInt(vm.selected_detail_poisson_demersaux.quantite);
			}
			vm.supprimer_detail_poisson_demersaux = function() 
			{
				var confirm = $mdDialog.confirm()
				  .title('Confirmation de suppression')
				  .textContent('Etes-vous sûr de supprimer ce détail de capture ?')
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {
				vm.save_in_bdd_detail_poisson_demersaux(vm.selected_detail_poisson_demersaux,1);
				}, function() {
				//alert('rien');
				});
			}
			vm.annuler_detail_poisson_demersaux = function(item)
			{
				nouvel_detail_poisson_demersaux = false ;
				if (!item.id) {
					vm.all_detail_poisson_demersaux.pop();
					vm.selected_detail_poisson_demersaux.$edit=false;
					return;
				}          
				item.id_espece = currentItem_detail_poisson_demersaux.id_espece;
				item.quantite = currentItem_detail_poisson_demersaux.quantite;
				item.code_espece = currentItem_detail_poisson_demersaux.code_espece;
				item.nom_espece = currentItem_detail_poisson_demersaux.nom_espece;
				item.$selected=currentItem_detail_poisson_demersaux.$selected;
				item.$edit=currentItem_detail_poisson_demersaux.$edit;
				item.$selected=false;
				item.$edit=false;
				vm.selected_detail_poisson_demersaux.$selected=false;	
				vm.selected_detail_poisson_demersaux.$edit=false;	
				vm.selected_detail_poisson_demersaux ={};
			}
			vm.save_in_bdd_detail_poisson_demersaux = function(detail_poisson_demersaux, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };
	            var id = 0 ;
	            if (!nouvel_detail_poisson_demersaux) 
	            {
	            	id = vm.selected_detail_poisson_demersaux.id ;
	            }
	            var datas = $.param(
	            {	            	
	                id:id,      
	                supprimer:etat_suppression,
	                id_sip_poisson_demersaux:vm.selected_poisson_demersaux.id,
	                id_espece:detail_poisson_demersaux.id_espece,
	                quantite:detail_poisson_demersaux.quantite,
	            });
	            apiFactory.add("SIP_poisson_demersaux_detail/index",datas, config).success(function (data)
        		{
        			if (!nouvel_detail_poisson_demersaux) 
        			{
        				if (etat_suppression == 0) //mise à jour
        				{
        					vm.selected_detail_poisson_demersaux.id_sip_poisson_demersaux =  vm.selected_poisson_demersaux.id ;
        					vm.selected_detail_poisson_demersaux.id_espece =  detail_poisson_demersaux.id_espece ;
        					vm.selected_detail_poisson_demersaux.quantite =  detail_poisson_demersaux.quantite ;
        					vm.selected_detail_poisson_demersaux.code_espece =  detail_poisson_demersaux.code_espece ;
        					vm.selected_detail_poisson_demersaux.nom_espece =  detail_poisson_demersaux.nom_espece ;
        				}
        				else//Suppression
        				{
        					vm.all_detail_poisson_demersaux = vm.all_detail_poisson_demersaux.filter(function(obj)
							{
								return obj.id !== vm.selected_detail_poisson_demersaux.id;
							});
        				}
        			}
        			else
        			{
						vm.selected_detail_poisson_demersaux.id=data.response;	
        			}
        			nouvel_detail_poisson_demersaux = false;
					vm.selected_detail_poisson_demersaux.$selected=false;	
					vm.selected_detail_poisson_demersaux.$edit=false;	
					vm.selected_detail_poisson_demersaux ={};
        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
		//FIN DETAIL POISSON DEMERSAUX		
		// ANALYSE CHOIX	
		vm.Reinitialiser_donnees = function() {
			vm.donnees_reporting = [];
			vm.entete_etat=[];
		}
		vm.Filtrer_Reporting = function(export_excel) {
			if(vm.filtre.menu=="menu_11_3" || vm.filtre.menu=="menu_11_6") {
				// EN-TETE FIXE
				vm.affiche_load=true;
				apiFactory.getAPIgeneraliserREST("SIP_reporting_poisson_demersaux/index","menu",vm.filtre.menu,"annee_debut",vm.filtre.annee_debut,"annee_fin",vm.filtre.annee_fin,"table_en_tete","sip_poisson_demersaux","table_detail","sip_poisson_demersaux_detail","cle_etrangere_detail","id_sip_poisson_demersaux","export_excel",export_excel).then(function(result)
				{
					if (export_excel == 'oui') {
						var nom_file = result.data.nom_file;
						var repertoire = result.data.repertoire;
						vm.affiche_load = false ;
						window.location = apiUrlExportexcel+repertoire+nom_file ;
					} else {					
						vm.donnees_reporting = result.data.response;
						vm.affiche_load=false;
						vm.entete_etat = Object.keys(vm.donnees_reporting[0]).map(function(cle) {
							return (cle);
						});
						if(vm.donnees_reporting.length==0 || !vm.donnees_reporting) {
							vm.showAlert("INFORMATION","Aucune donnée à afficher pour les filtres spécifiés !.Merci");					
						}
					}	
				});							
			} else if(vm.filtre.menu!="menu_11_3" && vm.filtre.menu!="menu_11_6") {
				// EN-TETE DYNAMIQUE
				vm.affiche_load=true;
				apiFactory.getAPIgeneraliserREST("SIP_reporting_poisson_demersaux/index","menu",vm.filtre.menu,"annee_debut",vm.filtre.annee_debut,"annee_fin",vm.filtre.annee_fin,"export_excel",export_excel).then(function(result)
				{
					if (export_excel == 'oui') {
						var nom_file = result.data.nom_file;
						var repertoire = result.data.repertoire;
						vm.affiche_load = false ;
						window.location = apiUrlExportexcel+repertoire+nom_file ;
					} else {					
						vm.donnees_reporting = result.data.response;
						vm.affiche_load=false;
						vm.entete_etat = Object.keys(vm.donnees_reporting[0]).map(function(cle) {
							return (cle);
						});
						if(vm.donnees_reporting.length==0 || !vm.donnees_reporting) {
							vm.showAlert("INFORMATION","Aucune donnée à afficher pour les filtres spécifiés !.Merci");					
						}
					}	
				});							
			}
		}		
		vm.selection_detail_dynamique = function(detail)
		{
			vm.selected_detail_dynamique = detail ;
		}
		$scope.$watch('vm.selected_detail_dynamique', function()
		{
			if (!vm.donnees_reporting) return;
			vm.donnees_reporting.forEach(function(item)
			{
				item.$selected = false;
			});
			vm.selected_detail_dynamique.$selected = true;
		});
		
		// FIN ANALYSE CHOIX			
   }
})();
