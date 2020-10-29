(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.peche_artisanale')
        .controller('Peche_artisanaleController', Peche_artisanaleController);

    /** @ngInject */
    function Peche_artisanaleController(apiFactory, $scope, $mdDialog,apiUrlExportexcel)
    {
        var vm = this;
        vm.date_now = new Date();
		// Date arrivée par défaut : now
		vm.filtre=[];
		vm.filtre.date_arrive=new Date();
		vm.all_peche_artisanale=[];
		vm.all_espece =[];
        vm.donnees_reporting=[];
		vm.selected_detail_menu_1_3={};
		vm.selected_detail_menu_1_6={};
		vm.selected_detail_dynamique={};

		vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			order:[] 
		};
		vm.entete_etat =[];
		vm.entete_menu_1_3=[{titre:"Année"},{titre:"Espèce"},{titre:"Total"},{titre:"Janv"},{titre:"Fév"},{titre:"Mars"},{titre:"Avr"},{titre:"Mai"},{titre:"Juin"},{titre:"Juil"},{titre:"Aout"},{titre:"Sept"},{titre:"Oct"},{titre:"Nov"},{titre:"Déc"},]
		vm.entete_menu_1_6=[{titre:"Année"},{titre:"Nom navire"},{titre:"Espèce"},{titre:"Total"},{titre:"Janv"},{titre:"Fév"},{titre:"Mars"},{titre:"Avr"},{titre:"Mai"},{titre:"Juin"},{titre:"Juil"},{titre:"Aout"},{titre:"Sept"},{titre:"Oct"},{titre:"Nov"},{titre:"Déc"},]
		vm.afficher_table =true; // Affichage détail table par ligne
		//DEBUT Table paramètre
			apiFactory.getAPIgeneraliser("SIP_navire/index","id_type_navire",4).then(function(result)
			{
				vm.all_navire = result.data.response;				
			});
			apiFactory.getAPIgeneraliser("SIP_espece/index","id_type_espece",6).then(function(result)
			{
				// id_type_espece=6  <=> Artisanale
				vm.all_espece = result.data.response;	
			});
			apiFactory.getAPIgeneraliser("SIP_sortie_peche_artisanale/index","liste_annee",1).then(function(result)
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
			vm.selected_peche_artisanale={};
			apiFactory.getAPIgeneraliserREST("SIP_sortie_peche_artisanale/index","date_depart",convert_to_date_sql(vm.filtre.date_depart),"date_arrive",convert_to_date_sql(vm.filtre.date_arrive),"annee",vm.filtre.annee,"mois",vm.filtre.mois).then(function(result)
			{
				vm.all_peche_artisanale = result.data.response;
				vm.affiche_load=false;
				if(vm.all_peche_artisanale.length==0 || !vm.all_peche_artisanale) {
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
		//Peche artisanale
			vm.selected_peche_artisanale = {};
			var nouvel_col_mar = false ;
			vm.affichage_masque_peche_artisanale = false ;
			vm.entete_liste_peche_artisanale = 
	        [
				{titre:"Navire"},
				{titre:"Nom capitaine"},
				{titre:"Port"},
				{titre:"N° marrée"},
				{titre:"Départ"},
				{titre:"Arrivée"},
				{titre:"Année"},
				{titre:"Mois"},
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
			vm.selection_peche_artisanale = function(cm)
			{
				vm.selected_peche_artisanale = cm ;
				vm.get_detail_peche_artisanale();	
			}

			$scope.$watch('vm.selected_peche_artisanale', function()
			{
				if (!vm.all_peche_artisanale) return;
				vm.all_peche_artisanale.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_peche_artisanale.$selected = true;
			});
			vm.ajout_col_peche_artisanale = function()
			{
				vm.afficher_table =false;
				vm.col_peche_artisanale = {};
				vm.selected_peche_artisanale = {};
				vm.affichage_masque_peche_artisanale = true ;
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
			vm.modifier_peche_artisanale = function()
			{
				vm.afficher_table =false;
				nouvel_col_mar = false ;
				vm.affichage_masque_peche_artisanale = true ;
				vm.col_peche_artisanale.id_navire = vm.selected_peche_artisanale.id_navire ;
				vm.col_peche_artisanale.nom_navire = vm.selected_peche_artisanale.nom_navire ;
				vm.col_peche_artisanale.immatricule = vm.selected_peche_artisanale.immatricule ;
				vm.col_peche_artisanale.nom_capitaine = vm.selected_peche_artisanale.nom_capitaine ;
				vm.col_peche_artisanale.port = vm.selected_peche_artisanale.port ;
				vm.col_peche_artisanale.num_maree = vm.selected_peche_artisanale.num_maree ;
				vm.col_peche_artisanale.date_depart = new Date(vm.selected_peche_artisanale.date_depart) ;
				vm.col_peche_artisanale.date_arrive = new Date(vm.selected_peche_artisanale.date_arrive) ;
				vm.col_peche_artisanale.annee = parseInt(vm.selected_peche_artisanale.annee) ;
				vm.col_peche_artisanale.mois = parseInt(vm.selected_peche_artisanale.mois) ;
			}
			vm.annuler_peche_artisanale = function()
			{
				vm.afficher_table =true;
				nouvel_col_mar = false ;
				vm.affichage_masque_peche_artisanale = false ;
				vm.selected_peche_artisanale = {};
			}
			vm.supprimer_peche_artisanale = function() 
			{
				vm.affichage_masque_peche_artisanale = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Confirmation de suppression')
				  .textContent('Etes-vous sûr de supprimer cet enregistrement ainsi que les détails de capture ?')
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_peche_artisanale(vm.selected_peche_artisanale,1);
				}, function() {
				//alert('rien');
				});
			}
			vm.save_peche_artisanale = function(data_masque, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };
	            var id = 0 ;

	            if (!nouvel_col_mar) 
	            {
	            	id = vm.selected_peche_artisanale.id ;
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
	            });
	            apiFactory.add("SIP_sortie_peche_artisanale/index",datas, config).success(function (data)
        		{
        			if (!nouvel_col_mar) 
        			{
        				if (etat_suppression == 0) //mise à jour
        				{
        					vm.selected_peche_artisanale.id_navire = 

        					vm.selected_peche_artisanale.id_navire = data_masque.id_navire,
			                vm.selected_peche_artisanale.immatricule = data_masque.immatricule,
			                vm.selected_peche_artisanale.nom_navire = data_masque.nom_navire,
			                vm.selected_peche_artisanale.nom_capitaine = data_masque.nom_capitaine,
			                vm.selected_peche_artisanale.port = data_masque.port,
			                vm.selected_peche_artisanale.num_maree = data_masque.num_maree,
			                vm.selected_peche_artisanale.date_depart = data_masque.date_depart,
			                vm.selected_peche_artisanale.date_arrive = data_masque.date_arrive,
			                vm.selected_peche_artisanale.annee = data_masque.annee,
			                vm.selected_peche_artisanale.mois = data_masque.mois
        				}
        				else//Suppression
        				{
        					vm.all_peche_artisanale = vm.all_peche_artisanale.filter(function(obj)
							{
								return obj.id !== vm.selected_peche_artisanale.id;
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
						}          
			            vm.all_peche_artisanale.unshift(item);
        			}
	        		vm.affichage_masque_peche_artisanale = false ; //Fermeture de la masque de saisie
					vm.afficher_table =true;
	        		nouvel_col_mar = false;
					vm.selected_peche_artisanale = {};
        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
			vm.modifierNavire = function (item) { 
				vm.nontrouvee=true;
				vm.all_navire.forEach(function(navi) {
					if(parseInt(navi.id)==parseInt(item.id_navire)) {
						vm.nontrouvee=false;
						vm.col_peche_artisanale.id_navire=navi.id;
						vm.col_peche_artisanale.nom_navire=navi.nom_navire;
						vm.col_peche_artisanale.immatricule=navi.immatricule;
					}
				});
				if(vm.nontrouvee==true) {				
						vm.col_peche_artisanale.id_navire = null; 
						vm.col_peche_artisanale.nom_navire = null; 
						vm.col_peche_artisanale.immatricule = null; 
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
		//FIN Peche artisanale     
		//DETAIL PECHE ARTISANALE
			vm.selected_detail_peche_artisanale = {};
			var nouvel_detail_peche_artisanale = false ;
			var currentItem_detail_peche_artisanale={};
			vm.entete_liste_detail_peche_artisanale = 
	        [{titre:"Espèce"},{titre:"Quantité"},{titre:"Actions"}] ;
	        vm.get_detail_peche_artisanale = function()
	        {
					vm.affiche_load=true;
					vm.selected_detail_peche_artisanale={};
					//GET DETAIL PECHE ARTISANALE MALAGASY
					apiFactory.getAPIgeneraliserREST("SIP_sortie_peche_artisanale_detail/index","id_sip_sortie_peche_artisanale",vm.selected_peche_artisanale.id).then(function(result)
					{
						//Réinitialisation 2 fils : pi,capture car chaque fois qu'on clique sur l'onglet => les détails doivent être réinitialisé
						vm.all_detail_peche_artisanale=[];
						vm.all_detail_peche_artisanale=result.data.response;
						vm.affiche_load=false;
					});
					//FIN DETAIL PECHE ARTISANALE MALAGASY
	        }
	        vm.selection_detail_peche_artisanale = function(detail_peche_artisanale)
	        {
	        	vm.selected_detail_peche_artisanale = detail_peche_artisanale ;
	        }
	        $scope.$watch('vm.selected_detail_peche_artisanale', function()
			{
				if (!vm.all_detail_peche_artisanale) return;
				vm.all_detail_peche_artisanale.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_detail_peche_artisanale.$selected = true;
			});
			vm.ajout_detail_peche_artisanale = function()
			{
				vm.selected_detail_peche_artisanale = {};
				nouvel_detail_peche_artisanale = true ;
				vm.selected_detail_peche_artisanale.$selected = false;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					id_sip_sortie_peche_artisanale: vm.selected_peche_artisanale.id ,
					id_espece: null ,
					quantite: null ,
					nom_espece: null ,
					code_espece: null ,
				};
				vm.all_detail_peche_artisanale.unshift(items);
				vm.all_detail_peche_artisanale.forEach(function(it) {
					if(it.$selected==true) {
						vm.selected_detail_peche_artisanale = it;
					}
				});			
			}
			vm.modif_detail_peche_artisanale = function(item)
			{
				nouvel_detail_peche_artisanale = false ;
				vm.selected_detail_peche_artisanale = item;
				currentItem_detail_peche_artisanale = angular.copy(vm.selected_detail_peche_artisanale);
				$scope.vm.all_detail_peche_artisanale.forEach(function(it) {
					it.$edit = false;
				});        
				item.$edit = true;	
				vm.selected_detail_peche_artisanale.$edit = true;	
				item.$selected = true;	
				vm.selected_detail_peche_artisanale.$selected = true;	
				vm.selected_detail_peche_artisanale.id_espece=parseInt(vm.selected_detail_peche_artisanale.id_espece);
				vm.selected_detail_peche_artisanale.quantite=parseInt(vm.selected_detail_peche_artisanale.quantite);
			}
			vm.supprimer_detail_peche_artisanale = function() 
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
				vm.save_in_bdd_detail_peche_artisanale(vm.selected_detail_peche_artisanale,1);
				}, function() {
				//alert('rien');
				});
			}
			vm.annuler_detail_peche_artisanale = function(item)
			{
				nouvel_detail_peche_artisanale = false ;
				if (!item.id) {
					vm.all_detail_peche_artisanale.pop();
					vm.selected_detail_peche_artisanale.$edit=false;
					return;
				}       
				vm.selected_detail_peche_artisanale.$selected=false;	
				vm.selected_detail_peche_artisanale.$edit=false;	
				vm.selected_detail_peche_artisanale ={};	
				item.id_espece = currentItem_detail_peche_artisanale.id_espece;
				item.quantite = currentItem_detail_peche_artisanale.quantite;
				item.code_espece = currentItem_detail_peche_artisanale.code_espece;
				item.nom_espece = currentItem_detail_peche_artisanale.nom_espece;
				item.$selected=currentItem_detail_peche_artisanale.$selected;
				item.$edit=currentItem_detail_peche_artisanale.$edit;
				$scope.vm.all_detail_peche_artisanale.forEach(function(it) {
					it.$edit = false;
					it.$selected = false;					
				});        
				item.$selected=false;
				item.$edit=false;
				item.$selected=false;
				item.$edit=false;
			}
			vm.save_in_bdd_detail_peche_artisanale = function(detail_peche_artisanale, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };
	            var id = 0 ;
	            if (!nouvel_detail_peche_artisanale) 
	            {
	            	id = vm.selected_detail_peche_artisanale.id ;
	            }
	            var datas = $.param(
	            {	            	
	                id:id,      
	                supprimer:etat_suppression,
	                id_sip_sortie_peche_artisanale:vm.selected_peche_artisanale.id,
	                id_espece:detail_peche_artisanale.id_espece,
	                quantite:detail_peche_artisanale.quantite,
	            });
	            apiFactory.add("SIP_sortie_peche_artisanale_detail/index",datas, config).success(function (data)
        		{
        			if (!nouvel_detail_peche_artisanale) 
        			{
        				if (etat_suppression == 0) //mise à jour
        				{
        					vm.selected_detail_peche_artisanale.id_sip_sortie_peche_artisanale =  vm.selected_peche_artisanale.id ;
        					vm.selected_detail_peche_artisanale.id_espece =  detail_peche_artisanale.id_espece ;
        					vm.selected_detail_peche_artisanale.quantite =  detail_peche_artisanale.quantite ;
        					vm.selected_detail_peche_artisanale.code_espece =  detail_peche_artisanale.code_espece ;
        					vm.selected_detail_peche_artisanale.nom_espece =  detail_peche_artisanale.nom_espece ;
        				}
        				else//Suppression
        				{
        					vm.all_detail_peche_artisanale = vm.all_detail_peche_artisanale.filter(function(obj)
							{
								return obj.id !== vm.selected_detail_peche_artisanale.id;
							});
        				}
        			}
        			else
        			{
						vm.selected_detail_peche_artisanale.id=data.response;	
        			}
        			nouvel_detail_peche_artisanale = false;
					vm.selected_detail_peche_artisanale.$selected=false;	
					vm.selected_detail_peche_artisanale.$edit=false;	
					vm.selected_detail_peche_artisanale ={};
        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
		//FIN DETAIL PECHE ARTISANALE	
		// ANALYSE CHOIX	
		vm.Reinitialiser_donnees = function() {
			vm.donnees_reporting = [];
			vm.entete_etat=[];
		}
		vm.Filtrer_Reporting = function(export_excel) {
			if(vm.filtre.menu=="menu_1_3" || vm.filtre.menu=="menu_1_6") {
				// EN-TETE FIXE
				vm.affiche_load=true;
				apiFactory.getAPIgeneraliserREST("SIP_reporting_peche_artisanale/index","menu",vm.filtre.menu,"annee_debut",vm.filtre.annee_debut,"annee_fin",vm.filtre.annee_fin,"table_en_tete","sip_sortie_peche_artisanale","table_detail","sip_sortie_peche_artisanale_detail","cle_etrangere_detail","id_sip_sortie_peche_artisanale","export_excel",export_excel).then(function(result)
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
			} else if(vm.filtre.menu!="menu_1_3" && vm.filtre.menu!="menu_1_6") {
				// EN-TETE DYNAMIQUE
				vm.affiche_load=true;
				apiFactory.getAPIgeneraliserREST("SIP_reporting_peche_artisanale/index","menu",vm.filtre.menu,"annee_debut",vm.filtre.annee_debut,"annee_fin",vm.filtre.annee_fin,"export_excel",export_excel).then(function(result)
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
		vm.selection_detail_menu_1_3 = function(detail)
		{
			vm.selected_detail_menu_1_3 = detail ;
		}
		$scope.$watch('vm.selected_detail_menu_1_3', function()
		{
			if (!vm.donnees_reporting) return;
			vm.donnees_reporting.forEach(function(item)
			{
				item.$selected = false;
			});
			vm.selected_detail_menu_1_3.$selected = true;
		});
		vm.selection_detail_menu_1_6 = function(detail)
		{
			vm.selected_detail_menu_1_6 = detail ;
		}
		$scope.$watch('vm.selected_detail_menu_1_6', function()
		{
			if (!vm.donnees_reporting) return;
			vm.donnees_reporting.forEach(function(item)
			{
				item.$selected = false;
			});
			vm.selected_detail_menu_1_6.$selected = true;
		});
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
		// DEBUT EXPORT EXCEL
		vm.Export_Excel = function() {
		}	
		// FIN EXPORT EXCEL
    }
})();
