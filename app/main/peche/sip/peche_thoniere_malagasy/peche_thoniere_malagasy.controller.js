(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.peche_thoniere_malagasy')
        .controller('Peche_thoniere_malagasyController', Peche_thoniere_malagasyController);

    /** @ngInject */
    function Peche_thoniere_malagasyController(apiFactory, $scope, $mdDialog,apiUrlExportexcel)
    {
        var vm = this;
        vm.date_now = new Date();
		// Date arrivée par défaut : now
		vm.filtre=[];
		vm.filtre.date_arrive=new Date();
		vm.all_peche_thoniere_malagasy=[];
		vm.all_sequence=[];
		vm.all_sequence_pi=[];
		vm.all_sequence_capture=[];
		vm.all_espece=[];
		vm.detail_pi_charge=false;
		vm.detail_capture_charge=false;
        vm.donnees_reporting=[];
		vm.selected_detail_menu_12_2={};
		vm.selected_detail_menu_12_3={};
		vm.selected_detail_menu_12_6_8_9={};
		vm.selected_detail_dynamique={};
		vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			order:[] 
		};
		vm.entete_etat =[];
		vm.entete_menu_12_2=[{titre:"Année"},{titre:"Espèce"},{titre:"Total"},{titre:"Janv"},{titre:"Fév"},{titre:"Mars"},{titre:"Avr"},{titre:"Mai"},{titre:"Juin"},{titre:"Juil"},{titre:"Aout"},{titre:"Sept"},{titre:"Oct"},{titre:"Nov"},{titre:"Déc"},]
		vm.entete_menu_12_3=[{titre:"Année"},{titre:"Nom navire"},{titre:"Espèce"},{titre:"Total"},{titre:"Janv"},{titre:"Fév"},{titre:"Mars"},{titre:"Avr"},{titre:"Mai"},{titre:"Juin"},{titre:"Juil"},{titre:"Aout"},{titre:"Sept"},{titre:"Oct"},{titre:"Nov"},{titre:"Déc"},]		
		vm.entete_menu_12_6_8_9=[{titre:"Année"},{titre:"Armateur"},{titre:"Espèce"},{titre:"Total"},{titre:"Janv"},{titre:"Fév"},{titre:"Mars"},{titre:"Avr"},{titre:"Mai"},{titre:"Juin"},{titre:"Juil"},{titre:"Aout"},{titre:"Sept"},{titre:"Oct"},{titre:"Nov"},{titre:"Déc"},]		
		vm.afficher_table =true; // Affichage détail table par ligne
		vm.affiche_load=false;
		//DEBUT Table paramètre
			apiFactory.getAPIgeneraliser("SIP_navire/index","id_type_navire",2).then(function(result)
			{
				// id_type_navire=2 <=> Navire malagasy
				vm.all_navire = result.data.response;				
			});
			apiFactory.getAll("SIP_type_espece/index").then(function(result)
			{
				vm.all_type_espece = result.data.response;	
			});
			apiFactory.getAPIgeneraliser("SIP_peche_thoniere_malagasy/index","liste_annee",1).then(function(result)
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
			vm.selected_peche_thoniere_malagasy={};
			apiFactory.getAPIgeneraliser("SIP_peche_thoniere_malagasy/index","date_depart",convert_to_date_sql(vm.filtre.date_depart),"date_arrive",convert_to_date_sql(vm.filtre.date_arrive)).then(function(result)
			{
				vm.all_peche_thoniere_malagasy = result.data.response;
				vm.affiche_load=false;
				// Pour désactiver les 2 derniers onglets
				vm.selected_sequence_peche_thoniere_malagasy={};
				vm.detail_pi_charge=false;
				vm.detail_capture_charge=false;
				vm.all_sequence_pi=[];
				vm.all_sequence_capture=[];
				if(vm.all_peche_thoniere_malagasy.length==0 || !vm.all_peche_thoniere_malagasy) {
					vm.showAlert("INFORMATION","Aucune donnée à afficher pour l'interval de date spécifié !.Merci");					
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
		//Peche thonière malagasy
			vm.selected_peche_thoniere_malagasy = {};
			var nouvel_col_mar = false ;
			vm.affichage_masque_peche_thoniere_malagasy = false ;
			vm.entete_liste_peche_thoniere_malagasy = 
	        [{titre:"Navire"},{titre:"N° FP"},{titre:"Nom capitaine"},{titre:"Nb équipage"},{titre:"Date rapport"},
				{titre:"Déclarant"},{titre:"Départ"},{titre:"Arrivée"},{titre:"Port"},
				{titre:"Jr en mer"},{titre:"Nb peche"},{titre:"Nb peche zee mdg"}] ;
			vm.selection_peche_thoniere_malagasy = function(cm)
			{
				vm.selected_peche_thoniere_malagasy = cm ;
				vm.titre_sequence_peche="Séquence de peche : (navire : " + cm.immatricule + " / " + cm.nom_navire + ")";
				vm.all_sequence=[];
				// Une fois selectionné; charger les séquences par l'intermediaire du clique sur l'onglet sequence
				// et ce n'est pas la peine de récharger tout le temps chaque fois que l'utilisateur clique sur l'onglet séquence
				// alors vm.charge_sequence reste false tant que l'utilisateur ne choisit pas un autre item ou la même ligne
				vm.charge_sequence=true;
				// Pour désactiver les 2 derniers onglets
				vm.selected_sequence_peche_thoniere_malagasy={};
				vm.detail_pi_charge=false;
				vm.detail_capture_charge=false;
				vm.all_sequence_pi=[];
				vm.all_sequence_capture=[];
			}
			$scope.$watch('vm.selected_peche_thoniere_malagasy', function()
			{
				if (!vm.all_peche_thoniere_malagasy) return;
				vm.all_peche_thoniere_malagasy.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_peche_thoniere_malagasy.$selected = true;
			});
			vm.ajout_col_peche_thoniere_malagasy = function()
			{
				vm.afficher_table =false;
				vm.col_peche_thoniere_malagasy = {};
				vm.selected_peche_thoniere_malagasy = {};
				vm.affichage_masque_peche_thoniere_malagasy = true ;
				nouvel_col_mar = true ;
			}
			vm.modifier_peche_thoniere_malagasy = function()
			{
				vm.afficher_table =false;
				nouvel_col_mar = false ;
				vm.affichage_masque_peche_thoniere_malagasy = true ;
				vm.col_peche_thoniere_malagasy.id_navire = vm.selected_peche_thoniere_malagasy.id_navire ;
				vm.col_peche_thoniere_malagasy.nom_navire = vm.selected_peche_thoniere_malagasy.nom_navire ;
				vm.col_peche_thoniere_malagasy.immatricule = vm.selected_peche_thoniere_malagasy.immatricule ;
				vm.col_peche_thoniere_malagasy.numfp = vm.selected_peche_thoniere_malagasy.numfp ;
				vm.col_peche_thoniere_malagasy.nom_capitaine = vm.selected_peche_thoniere_malagasy.nom_capitaine ;
				vm.col_peche_thoniere_malagasy.nbr_equipage = parseInt(vm.selected_peche_thoniere_malagasy.nbr_equipage) ;
				vm.col_peche_thoniere_malagasy.date_rapport = new Date(vm.selected_peche_thoniere_malagasy.date_rapport) ;
				vm.col_peche_thoniere_malagasy.nom_declarant = vm.selected_peche_thoniere_malagasy.nom_declarant ;
				vm.col_peche_thoniere_malagasy.date_depart = new Date(vm.selected_peche_thoniere_malagasy.date_depart) ;
				vm.col_peche_thoniere_malagasy.date_arrive = new Date(vm.selected_peche_thoniere_malagasy.date_arrive) ;
				vm.col_peche_thoniere_malagasy.port = vm.selected_peche_thoniere_malagasy.port ;
				vm.col_peche_thoniere_malagasy.nbr_jour_en_mer = parseInt(vm.selected_peche_thoniere_malagasy.nbr_jour_en_mer) ;
				vm.col_peche_thoniere_malagasy.nbr_peche = parseInt(vm.selected_peche_thoniere_malagasy.nbr_peche) ;
				vm.col_peche_thoniere_malagasy.nbr_peche_zee_mdg = parseInt(vm.selected_peche_thoniere_malagasy.nbr_peche_zee_mdg) ;
			}
			vm.annuler_peche_thoniere_malagasy = function()
			{
				vm.afficher_table =true;
				nouvel_col_mar = false ;
				vm.affichage_masque_peche_thoniere_malagasy = false ;
				vm.selected_peche_thoniere_malagasy = {}; 
				vm.titre_sequence_peche="Séquence de peche : ";
				vm.selected_sequence_peche_thoniere_malagasy={};
				vm.detail_pi_charge=false;
				vm.detail_capture_charge=false;
				vm.all_sequence_pi=[];
				vm.all_sequence_capture=[];
			}
			vm.supprimer_peche_thoniere_malagasy = function() 
			{
				vm.affichage_masque_peche_thoniere_malagasy = false ;				
				var confirm = $mdDialog.confirm()
				  .title('Confirmation de suppression avec les détails correspondant')
				  .textContent('Etes-vous sûr de supprimer cet enregistrement ?')
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_peche_thoniere_malagasy(vm.selected_peche_thoniere_malagasy,1);
				}, function() {
				//alert('rien');
				});
			}
			vm.save_peche_thoniere_malagasy = function(data_masque, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };
	            var id = 0 ;

	            if (!nouvel_col_mar) 
	            {
	            	id = vm.selected_peche_thoniere_malagasy.id ;
	            }
	            var datas = $.param(
	            {	            	
	                id:id,      
	                supprimer:etat_suppression,
	                id_navire:data_masque.id_navire,
	                immatricule:data_masque.immatricule,
	                nom_navire:data_masque.nom_navire,
	                numfp:data_masque.numfp,
	                nom_capitaine:data_masque.nom_capitaine,
	                nbr_equipage:data_masque.nbr_equipage,
	                date_rapport:convert_to_date_sql(data_masque.date_rapport),
	                nom_declarant:data_masque.nom_declarant,	                
	                date_depart:convert_to_date_sql(data_masque.date_depart),	                
	                date_arrive:convert_to_date_sql(data_masque.date_arrive),	                
	                port:data_masque.port,	                
	                nbr_jour_en_mer:data_masque.nbr_jour_en_mer,	                
	                nbr_peche:data_masque.nbr_peche,	                
	                nbr_peche_zee_mdg:data_masque.nbr_peche_zee_mdg,	                
	            });
	            apiFactory.add("SIP_peche_thoniere_malagasy/index",datas, config).success(function (data)
        		{
        			if (!nouvel_col_mar) 
        			{
        				if (etat_suppression == 0) //mise à jour
        				{
        					vm.selected_peche_thoniere_malagasy.id_navire = 

        					vm.selected_peche_thoniere_malagasy.id_navire = data_masque.id_navire,
			                vm.selected_peche_thoniere_malagasy.immatricule = data_masque.immatricule,
			                vm.selected_peche_thoniere_malagasy.nom_navire = data_masque.nom_navire,
			                vm.selected_peche_thoniere_malagasy.numfp = data_masque.numfp,
			                vm.selected_peche_thoniere_malagasy.nom_capitaine = data_masque.nom_capitaine,
			                vm.selected_peche_thoniere_malagasy.nbr_equipage = data_masque.nbr_equipage,
			                vm.selected_peche_thoniere_malagasy.date_rapport = data_masque.date_rapport,
			                vm.selected_peche_thoniere_malagasy.nom_declarant = data_masque.nom_declarant,
			                vm.selected_peche_thoniere_malagasy.date_depart = data_masque.date_depart,
			                vm.selected_peche_thoniere_malagasy.date_arrive = data_masque.date_arrive,
			                vm.selected_peche_thoniere_malagasy.port = data_masque.port,
			                vm.selected_peche_thoniere_malagasy.nbr_jour_en_mer = data_masque.nbr_jour_en_mer,
			                vm.selected_peche_thoniere_malagasy.nbr_peche = data_masque.nbr_peche,
			                vm.selected_peche_thoniere_malagasy.nbr_peche_zee_mdg = data_masque.nbr_peche_zee_mdg
        				}
        				else//Suppression
        				{
        					vm.all_peche_thoniere_malagasy = vm.all_peche_thoniere_malagasy.filter(function(obj)
							{
								return obj.id !== vm.selected_peche_thoniere_malagasy.id;
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
							numfp:data_masque.numfp,
							nom_capitaine:data_masque.nom_capitaine,
							nbr_equipage:data_masque.nbr_equipage,
							date_rapport:data_masque.date_rapport,
							nom_declarant:data_masque.nom_declarant,                   
							date_depart:data_masque.date_depart,                   
							date_arrive:data_masque.date_arrive,                   
							port:data_masque.port,                   
							nbr_jour_en_mer:data_masque.nbr_jour_en_mer,                   
							nbr_peche:data_masque.nbr_peche,                   
							nbr_peche_zee_mdg:data_masque.nbr_peche_zee_mdg,                   
						}          
			            vm.all_peche_thoniere_malagasy.unshift(item);
        			}
	        		vm.affichage_masque_peche_thoniere_malagasy = false ; //Fermeture de la masque de saisie
					vm.afficher_table =true;
	        		nouvel_col_mar = false;
					vm.titre_sequence_peche="Séquence de peche : ";
					vm.selected_peche_thoniere_malagasy = {}; 
					// Pour désactiver les 2 derniers onglets
					vm.selected_sequence_peche_thoniere_malagasy={};
					vm.detail_pi_charge=false;
					vm.detail_capture_charge=false;
					vm.all_sequence_pi=[];
					vm.all_sequence_capture=[];
        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
			vm.modifierNavire = function (item) { 
				vm.nontrouvee=true;
				vm.all_navire.forEach(function(navi) {
					if(parseInt(navi.id)==parseInt(item.id_navire)) {
						vm.nontrouvee=false;
						vm.col_peche_thoniere_malagasy.id_navire=navi.id;
						vm.col_peche_thoniere_malagasy.nom_navire=navi.nom_navire;
						vm.col_peche_thoniere_malagasy.immatricule=navi.immatricule;
						alert("teo");
					}
				});
				if(vm.nontrouvee==true) {				
						vm.col_peche_thoniere_malagasy.id_navire = null; 
						vm.col_peche_thoniere_malagasy.nom_navire = null; 
						vm.col_peche_thoniere_malagasy.immatricule = null; 
						alert("ratsy")
				}
			}	
		//FIN Peche thonière malagasy 
		//SEQUENCE PECHE
			vm.selected_sequence_peche_thoniere_malagasy = {};
			var nouvel_sequence_peche_thoniere_malagasy = false ;
			var currentItem_sequence_peche_thoniere_malagasy={};
			vm.titre_sequence_peche="Séquence de peche : ";
			vm.entete_liste_sequence_peche_thon_malagasy = 
	        [{titre:"N° séquence"},{titre:"N° FP"},{titre:"Actions"}] ;
	        vm.get_sequence_peche_thon_malagasy = function()
	        {
				if(vm.charge_sequence==true) {
					vm.affiche_load=true;
					vm.selected_sequence_peche_thoniere_malagasy={};
					//GET SEQUENCE PECHE THON MALAGASY
					apiFactory.getAPIgeneraliserREST("SIP_sequence_peche_thon_malagasy/index","id_peche_thoniere_malagasy",vm.selected_peche_thoniere_malagasy.id).then(function(result)
					{
						//Réinitialisation 2 fils : pi,capture car chaque fois qu'on clique sur l'onglet => les détails doivent être réinitialisé
						vm.all_sequence_capture=[];
						vm.all_sequence_pi=[];
						vm.all_sequence=[];
						vm.detail_pi_charge=false;
						vm.detail_capture_charge=false;
						vm.all_sequence=result.data.response;
						vm.affiche_load=false;
						vm.charge_sequence=false;
					});
					//FIN SEQUENCE PECHE THON MALAGASY
				}	
	        }
	        vm.selection_sequence_peche_thon_malagasy = function(sequence_peche_thoniere_malagasy)
	        {
	        	vm.selected_sequence_peche_thoniere_malagasy = sequence_peche_thoniere_malagasy ;
				vm.detail_pi_charge=false;	
				vm.detail_capture_charge=false;	
				vm.get_sequence_peche_thon_malagasy_capture();	
				vm.get_sequence_peche_thon_malagasy_pi();
	        }
	        $scope.$watch('vm.selected_sequence_peche_thoniere_malagasy', function()
			{
				if (!vm.all_sequence) return;
				vm.all_sequence.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_sequence_peche_thoniere_malagasy.$selected = true;
			});
			vm.ajout_sequence_peche_thon_malagasy = function()
			{
				vm.sequence_peche_thoniere_malagasy = {};
				vm.selected_sequence_peche_thoniere_malagasy = {};
				nouvel_sequence_peche_thoniere_malagasy = true ;
				vm.selected_sequence_peche_thoniere_malagasy.$selected = false;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					id_peche_thoniere_malagasy: vm.selected_peche_thoniere_malagasy.id ,
					numseqpeche: null ,
					numfp: null ,
				};
				vm.all_sequence.unshift(items);
				vm.all_sequence.forEach(function(it) {
					if(it.$selected==true) {
						vm.selected_sequence_peche_thoniere_malagasy = it;
					}
				});			
			}
			vm.modif_sequence_peche_thon_malagasy = function(item)
			{
				nouvel_sequence_peche_thoniere_malagasy = false ;
				vm.selected_sequence_peche_thoniere_malagasy = item;
				currentItem_sequence_peche_thoniere_malagasy = angular.copy(vm.selected_sequence_peche_thoniere_malagasy);
				$scope.vm.all_sequence.forEach(function(it) {
					it.$edit = false;
				});        
				item.$edit = true;	
				vm.selected_sequence_peche_thoniere_malagasy.$edit = true;	
				item.$selected = true;	
				vm.selected_sequence_peche_thoniere_malagasy.$selected = true;	
			}
			vm.supprimer_sequence_peche_thon_malagasy = function() 
			{
				var confirm = $mdDialog.confirm()
				  .title('Confirmation de suppression de tous les details PI et CAPTURE correspondant')
				  .textContent('Etes-vous sûr de supprimer cet sequence peche ?')
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {
				vm.save_in_bdd_sequence_peche_thon_malagasy(vm.selected_peche_thoniere_malagasy,1);
				}, function() {
				//alert('rien');
				});
			}
			vm.annuler_sequence_peche_thon_malagasy = function(item)
			{
				vm.sequence_peche_thoniere_malagasy = {} ;
				nouvel_sequence_peche_thoniere_malagasy = false ;
				vm.selected_sequence_peche_thoniere_malagasy={};
				if (!item.id) {
					vm.all_sequence.pop();
					vm.selected_sequence_peche_thoniere_malagasy.$edit=false;
					return;
				}          
				item.$selected=false;
				item.$edit=false;
				item.numseqpeche = currentItem_sequence_peche_thoniere_malagasy.numseqpeche;
				item.numfp = currentItem_sequence_peche_thoniere_malagasy.numfp;
				vm.selected_sequence_peche_thoniere_malagasy = {} ;
				vm.selected_sequence_peche_thoniere_malagasy.$selected = false;
			}
			vm.save_in_bdd_sequence_peche_thon_malagasy = function(sequence_peche_thoniere_malagasy, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };
	            var id = 0 ;
	            if (!nouvel_sequence_peche_thoniere_malagasy) 
	            {
	            	id = vm.selected_sequence_peche_thoniere_malagasy.id ;
	            }
	            var datas = $.param(
	            {	            	
	                id:id,      
	                supprimer:etat_suppression,
	                id_peche_thoniere_malagasy:vm.selected_peche_thoniere_malagasy.id,
	                numseqpeche:sequence_peche_thoniere_malagasy.numseqpeche,
	                numfp:sequence_peche_thoniere_malagasy.numfp,
	            });
	            apiFactory.add("SIP_sequence_peche_thon_malagasy/index",datas, config).success(function (data)
        		{
        			if (!nouvel_sequence_peche_thoniere_malagasy) 
        			{
        				if (etat_suppression == 0) //mise à jour
        				{
        					vm.selected_sequence_peche_thoniere_malagasy.id_peche_thoniere_malagasy =  vm.selected_peche_thoniere_malagasy.id ;
        					vm.selected_sequence_peche_thoniere_malagasy.numseqpeche =  sequence_peche_thoniere_malagasy.numseqpeche ;
        					vm.selected_sequence_peche_thoniere_malagasy.numfp =  sequence_peche_thoniere_malagasy.numfp ;
        				}
        				else//Suppression
        				{
        					vm.all_sequence = vm.all_sequence.filter(function(obj)
							{
								return obj.id !== vm.selected_sequence_peche_thoniere_malagasy.id;
							});
							// Delete en cascade : ok au niveau BDD => affichage à réctifier seulement
        					vm.all_sequence_pi = vm.all_sequence_pi.filter(function(obj)
							{
								return obj.id_sequence_peche_thon_malagasy !== vm.selected_sequence_peche_thoniere_malagasy.id;
							});
        					vm.all_sequence_capture = vm.all_sequence_capture.filter(function(obj)
							{
								return obj.id_sequence_peche_thon_malagasy !== vm.selected_sequence_peche_thoniere_malagasy.id;
							});
							// Désactiver les onglets PI et CAPTURE jusq'à ce qu'un item soit selectionné de nouveau
							vm.detail_pi_charge=false;
							vm.detail_capture_charge=false;
        				}
        			}
        			else
        			{
						vm.selected_sequence_peche_thoniere_malagasy.id=data.response;	
        			}
        			nouvel_sequence_peche_thoniere_malagasy = false;
					vm.selected_sequence_peche_thoniere_malagasy.$selected=false;	
					vm.selected_sequence_peche_thoniere_malagasy.$edit=false;	
					vm.selected_sequence_peche_thoniere_malagasy ={};
        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
		//FIN SEQUENCE PECHE		
		//SEQUENCE PECHE PI
			vm.selected_sequence_peche_thoniere_malagasy_pi = {};
			var nouvel_col_pi = false ;
			vm.afficher_table_pi=true;
			vm.affichage_masque_peche_thoniere_pi_malagasy = false ;
			vm.entete_liste_peche_thoniere_pi_malagasy = 
	        [{titre:"Date"},{titre:"Hr:Mn"},{titre:"Latitude"},{titre:"Longitude"},{titre:"Temperature"},
				{titre:"Nb ham entrf"},{titre:"Nb ham util"},{titre:"Appats util"}] ;
	        vm.get_sequence_peche_thon_malagasy_pi = function()
	        {
				if(parseInt(vm.selected_sequence_peche_thoniere_malagasy.detail_sequence_pi_charge)==0) {
					vm.affiche_load=true;
					//GET SEQUENCE CAPTURE THON MALAGASY
					apiFactory.getAPIgeneraliserREST("SIP_sequence_peche_thon_malagasy_pi/index","id_sequence_peche_thon_malagasy",vm.selected_sequence_peche_thoniere_malagasy.id).then(function(result)
					{
						vm.all_sequence_pi=[];
						vm.all_sequence_pi=result.data.response;
						vm.affiche_load=false;
						vm.detail_pi_charge=true;
					});
					//FIN SEQUENCE CAPTURE THON MALAGASY
				} 	
	        }
			vm.selection_peche_thoniere_pi_malagasy = function(cm)
			{
				vm.selected_sequence_peche_thoniere_malagasy_pi = cm ;
			}
	        $scope.$watch('vm.selected_sequence_peche_thoniere_malagasy_pi', function()
			{
				if (!vm.all_sequence_pi) return;
				vm.all_sequence_pi.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_sequence_peche_thoniere_malagasy_pi.$selected = true;
			});
			vm.ajout_col_peche_thoniere_pi_malagasy = function()
			{
				vm.afficher_table_pi =false;
				vm.col_peche_thoniere_pi_malagasy = {};
				vm.selected_sequence_peche_thoniere_malagasy_pi = {};
				vm.affichage_masque_peche_thoniere_pi_malagasy = true ;
				nouvel_col_pi = true ;
			}
			vm.modifier_peche_thoniere_pi_malagasy = function()
			{
				vm.afficher_table_pi =false;
				nouvel_col_pi = false ;
				vm.affichage_masque_peche_thoniere_pi_malagasy = true ;

				vm.col_peche_thoniere_pi_malagasy.id_sequence_peche_thon_malagasy = vm.selected_sequence_peche_thoniere_malagasy_pi.id_sequence_peche_thon_malagasy ;
				vm.col_peche_thoniere_pi_malagasy.date_pi = new Date(vm.selected_sequence_peche_thoniere_malagasy_pi.date_pi) ;
				// vm.col_peche_thoniere_pi_malagasy.annee = vm.selected_sequence_peche_thoniere_malagasy_pi.annee ;
				// vm.col_peche_thoniere_pi_malagasy.jour = vm.selected_sequence_peche_thoniere_malagasy_pi.jour ;
				// vm.col_peche_thoniere_pi_malagasy.mois = vm.selected_sequence_peche_thoniere_malagasy_pi.mois ;
				vm.col_peche_thoniere_pi_malagasy.heuret = parseInt(vm.selected_sequence_peche_thoniere_malagasy_pi.heuret) ;
				vm.col_peche_thoniere_pi_malagasy.minutet = parseInt(vm.selected_sequence_peche_thoniere_malagasy_pi.minutet) ;
				vm.col_peche_thoniere_pi_malagasy.postlatitude = vm.selected_sequence_peche_thoniere_malagasy_pi.postlatitude ;
				vm.col_peche_thoniere_pi_malagasy.postlongitude = vm.selected_sequence_peche_thoniere_malagasy_pi.postlongitude ;
				vm.col_peche_thoniere_pi_malagasy.temperature = parseInt(vm.selected_sequence_peche_thoniere_malagasy_pi.temperature) ;
				vm.col_peche_thoniere_pi_malagasy.nb_ham_entrflot = parseInt(vm.selected_sequence_peche_thoniere_malagasy_pi.nb_ham_entrflot) ;
				vm.col_peche_thoniere_pi_malagasy.nb_ham_util = parseInt(vm.selected_sequence_peche_thoniere_malagasy_pi.nb_ham_util) ;
				vm.col_peche_thoniere_pi_malagasy.appats_util = vm.selected_sequence_peche_thoniere_malagasy_pi.appats_util ;
			}
			vm.annuler_peche_thoniere_pi_malagasy = function()
			{
				vm.afficher_table_pi =true;
				nouvel_col_pi = false ;
				vm.affichage_masque_peche_thoniere_pi_malagasy = false ;
				vm.selected_sequence_peche_thoniere_malagasy_pi = {};
			}
			vm.supprimer_peche_thoniere_pi_malagasy = function() 
			{
				vm.affichage_masque_peche_thoniere_pi_malagasy = false ;				
				var confirm = $mdDialog.confirm()
				  .title('Confirmation de suppression')
				  .textContent('Etes-vous sûr de supprimer cet séquence de PI ?')
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_sequence_peche_thoniere_pi_malagasy(vm.selected_sequence_peche_thoniere_malagasy_pi,1);
				}, function() {
				//alert('rien');
				});
			}
			vm.save_sequence_peche_thoniere_pi_malagasy = function(sequence_pi, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };
	            var id = 0 ;

	            if (!nouvel_col_pi) 
	            {
	            	id = vm.selected_sequence_peche_thoniere_malagasy_pi.id ;
	            }
	            var datas = $.param(
	            {	            	
	                id:id,      
	                supprimer:etat_suppression,
	                id_sequence_peche_thon_malagasy:vm.selected_sequence_peche_thoniere_malagasy.id,
	                date_pi:convert_to_date_sql(sequence_pi.date_pi),
	                // annee:sequence_pi.annee,
	                // mois:sequence_pi.mois,
	                // jour:sequence_pi.jour,
	                heuret:sequence_pi.heuret,
	                minutet:sequence_pi.minutet,
	                postlatitude:sequence_pi.postlatitude,
	                postlongitude:sequence_pi.postlongitude,
	                temperature:sequence_pi.temperature,	                
	                nb_ham_entrflot:sequence_pi.nb_ham_entrflot,	                
	                nb_ham_util:sequence_pi.nb_ham_util,	                
	                appats_util:sequence_pi.appats_util,	                
	            });
	            apiFactory.add("SIP_sequence_peche_thon_malagasy_pi/index",datas, config).success(function (data)
        		{
        			if (!nouvel_col_pi) 
        			{
        				if (etat_suppression == 0) //mise à jour
        				{
        					// vm.selected_sequence_peche_thoniere_malagasy_pi.annee = sequence_pi.annee,
			                // vm.selected_sequence_peche_thoniere_malagasy_pi.mois = sequence_pi.mois,
			                // vm.selected_sequence_peche_thoniere_malagasy_pi.jour = sequence_pi.jour,
        					vm.selected_sequence_peche_thoniere_malagasy_pi.id_sequence_peche_thon_malagasy = sequence_pi.id_sequence_peche_thon_malagasy,
        					vm.selected_sequence_peche_thoniere_malagasy_pi.date_pi = sequence_pi.date_pi,
			                vm.selected_sequence_peche_thoniere_malagasy_pi.heuret = sequence_pi.heuret,
			                vm.selected_sequence_peche_thoniere_malagasy_pi.minutet = sequence_pi.minutet,
			                vm.selected_sequence_peche_thoniere_malagasy_pi.postlatitude = sequence_pi.postlatitude,
			                vm.selected_sequence_peche_thoniere_malagasy_pi.postlongitude = sequence_pi.postlongitude,
			                vm.selected_sequence_peche_thoniere_malagasy_pi.temperature = sequence_pi.temperature,
			                vm.selected_sequence_peche_thoniere_malagasy_pi.nb_ham_entrflot = sequence_pi.nb_ham_entrflot,
			                vm.selected_sequence_peche_thoniere_malagasy_pi.nb_ham_util = sequence_pi.nb_ham_util,
			                vm.selected_sequence_peche_thoniere_malagasy_pi.appats_util = sequence_pi.appats_util
        				}
        				else//Suppression
        				{
        					vm.all_sequence_pi = vm.all_sequence_pi.filter(function(obj)
							{
								return obj.id !== vm.selected_sequence_peche_thoniere_malagasy_pi.id;
							});

        				}
        			}
        			else
        			{
        				var item =
			            {
							id:String(data.response) ,
							id_sequence_peche_thon_malagasy:vm.selected_sequence_peche_thoniere_malagasy.id,
							date_pi:sequence_pi.date_pi,
							// annee:sequence_pi.annee,
							// mois:sequence_pi.mois,
							// jour:sequence_pi.jour,
							heuret:sequence_pi.heuret,
							minutet:sequence_pi.minutet,
							postlatitude:sequence_pi.postlatitude,
							postlongitude:sequence_pi.postlongitude,
							temperature:sequence_pi.temperature,                   
							nb_ham_entrflot:sequence_pi.nb_ham_entrflot,                   
							nb_ham_util:sequence_pi.nb_ham_util,                   
							appats_util:sequence_pi.appats_util,                   
						}          
			            vm.all_sequence_pi.unshift(item);
        			}
	        		vm.affichage_masque_peche_thoniere_pi_malagasy = false ; //Fermeture de la masque de saisie
					vm.afficher_table_pi =true;
	        		nouvel_col_pi = false;
        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
		//FIN //SEQUENCE PECHE PI				
		//SEQUENCE CAPTURE PECHE THON
			vm.selected_sequence_peche_thoniere_malagasy_capture = {};
			var nouvel_sequence_peche_thoniere_malagasy_capture = false ;
			var currentItem_sequence_peche_thoniere_malagasy_capture={};
			vm.entete_liste_sequence_peche_thon_malagasy_capture = 
	        [
				{titre:"Type Espèce"},
				{titre:"Espèce"},
				{titre:"Quantité"},
				{titre:"Nombre"},
				{titre:"Actions"},
	        ] ;
	        vm.get_sequence_peche_thon_malagasy_capture = function()
	        {
				if(parseInt(vm.selected_sequence_peche_thoniere_malagasy.detail_sequence_capture_charge)==0) {
					vm.affiche_load=true;
					//GET SEQUENCE CAPTURE THON MALAGASY
					apiFactory.getAPIgeneraliserREST("SIP_sequence_peche_thon_malagasy_capture/index","id_sequence_peche_thon_malagasy",vm.selected_sequence_peche_thoniere_malagasy.id).then(function(result)
					{
						vm.all_sequence_capture=[];
						vm.all_sequence_capture=result.data.response;
						vm.affiche_load=false;
						vm.detail_capture_charge=true;
					});
					//FIN SEQUENCE CAPTURE THON MALAGASY
				} 	
	        }
	        vm.selection_sequence_peche_thon_malagasy_capture = function(sequence_capture_thon)
	        {
	        	vm.selected_sequence_peche_thoniere_malagasy_capture = sequence_capture_thon ;	        	
	        }
	        $scope.$watch('vm.selected_sequence_peche_thoniere_malagasy_capture', function()
			{
				if (!vm.all_sequence_capture) return;
				vm.all_sequence_capture.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_sequence_peche_thoniere_malagasy_capture.$selected = true;
			});
			vm.ajout_sequence_peche_thon_malagasy_capture = function()
			{
				vm.selected_sequence_peche_thoniere_malagasy_capture = {};
				nouvel_sequence_peche_thoniere_malagasy_capture = true ;
				vm.selected_sequence_peche_thoniere_malagasy_capture.$selected = false;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					id_sequence_peche_thon_malagasy: vm.selected_sequence_peche_thoniere_malagasy.id ,
					id_espece: null ,
					qte: null ,
					nbre: null ,
					id_type_espece:null,
					type_espece:null
				};
				vm.all_sequence_capture.unshift(items);
				vm.all_sequence_capture.forEach(function(it) {
					if(it.$selected==true) {
						vm.selected_sequence_peche_thoniere_malagasy_capture = it;
					}
				});			
			}
			vm.modif_sequence_peche_thon_malagasy_capture = function(item)
			{
				nouvel_sequence_peche_thoniere_malagasy_capture = false ;
				vm.selected_sequence_peche_thoniere_malagasy_capture = item;
				currentItem_sequence_peche_thoniere_malagasy_capture = angular.copy(vm.selected_sequence_peche_thoniere_malagasy_capture);
				vm.selected_sequence_peche_thoniere_malagasy_capture.qte = parseFloat(item.qte);
				vm.selected_sequence_peche_thoniere_malagasy_capture.nbre = parseInt(item.nbre);
				vm.all_sequence_capture.forEach(function(it) {
					it.$edit = false;
				});        
				// A chaque modification => charger les détails des espèces correspondant au type espece choisi			
				apiFactory.getAPIgeneraliser("SIP_espece/index","type_espece",item.id_type_espece).then(function(result)
				{
					vm.all_espece = result.data.response;	
				});
				item.$edit = true;	
				vm.selected_sequence_peche_thoniere_malagasy_capture.$edit = true;	
				item.$selected = true;	
				vm.selected_sequence_peche_thoniere_malagasy_capture.$selected = true;	
			}
			vm.supprimer_sequence_peche_thon_malagasy_capture = function(item_sequence_capture) 
			{
				var confirm = $mdDialog.confirm()
				  .title('Confirmation de suppression')
				  .textContent('Etes-vous sûr de supprimer cet sequence de capture ?')
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_in_bdd_sequence_peche_thon_malagasy_capture(item_sequence_capture,1);
				}, function() {
				//alert('rien');
				});
			}
			vm.annuler_sequence_peche_thon_malagasy_capture = function(item)
			{
				nouvel_sequence_peche_thoniere_malagasy_capture = false ;
				vm.selected_sequence_peche_thoniere_malagasy_capture={};
				if (!item.id) {
					vm.all_sequence_capture.pop();
					vm.selected_sequence_peche_thoniere_malagasy_capture.$edit=false;
					return;
				}          
				item.$selected=false;
				item.$edit=false;
				item.id_espece = currentItem_sequence_peche_thoniere_malagasy_capture.id_espece;
				item.espece = currentItem_sequence_peche_thoniere_malagasy_capture.espece;
				item.qte = currentItem_sequence_peche_thoniere_malagasy_capture.qte;
				item.nbre = currentItem_sequence_peche_thoniere_malagasy_capture.nbre;
				item.id_type_espece = currentItem_sequence_peche_thoniere_malagasy_capture.id_type_espece;
				item.type_espece = currentItem_sequence_peche_thoniere_malagasy_capture.type_espece;
				vm.selected_sequence_peche_thoniere_malagasy_capture = {} ;
				vm.selected_sequence_peche_thoniere_malagasy_capture.$selected = false;
			}
			vm.save_in_bdd_sequence_peche_thon_malagasy_capture = function(sequence_capture_thon, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };
	            var id = 0 ;
	            if (!nouvel_sequence_peche_thoniere_malagasy_capture) 
	            {
	            	id = sequence_capture_thon.id ;
	            }
	            var datas = $.param(
	            {	            	
	                id:id,      
	                supprimer:etat_suppression,
	                id_sequence_peche_thon_malagasy:vm.selected_sequence_peche_thoniere_malagasy.id,
	                id_espece:sequence_capture_thon.id_espece,
	                qte:sequence_capture_thon.qte,
	                nbre:sequence_capture_thon.nbre,
	            });
	            apiFactory.add("SIP_sequence_peche_thon_malagasy_capture/index",datas, config).success(function (data)
        		{
        			if (!nouvel_sequence_peche_thoniere_malagasy_capture) 
        			{
        				if (etat_suppression == 0) //mise à jour
        				{
        					vm.selected_sequence_peche_thoniere_malagasy_capture.id_sequence_peche_thon_malagasy =  vm.selected_sequence_peche_thoniere_malagasy.id ;
        					vm.selected_sequence_peche_thoniere_malagasy_capture.id_espece =  sequence_capture_thon.id_espece ;
        					vm.selected_sequence_peche_thoniere_malagasy_capture.nom_espece =  sequence_capture_thon.nom_espece ;
        					vm.selected_sequence_peche_thoniere_malagasy_capture.code_espece =  sequence_capture_thon.code_espece ;
        					vm.selected_sequence_peche_thoniere_malagasy_capture.qte =  sequence_capture_thon.qte ;
        					vm.selected_sequence_peche_thoniere_malagasy_capture.nbre =  sequence_capture_thon.nbre ;
        					vm.selected_sequence_peche_thoniere_malagasy_capture.id_type_espece =  sequence_capture_thon.id_type_espece ;
        					vm.selected_sequence_peche_thoniere_malagasy_capture.type_espece =  sequence_capture_thon.type_espece ;
        				}
        				else//Suppression
        				{
        					vm.all_sequence_capture = vm.all_sequence_capture.filter(function(obj)
							{
								return obj.id !== sequence_capture_thon.id;
							});
        				}
        			}
        			else
        			{
						vm.selected_sequence_peche_thoniere_malagasy_capture.id=data.response;	
        			}
        			nouvel_sequence_peche_thoniere_malagasy_capture = false;
					vm.selected_sequence_peche_thoniere_malagasy_capture.$selected=false;	
					vm.selected_sequence_peche_thoniere_malagasy_capture.$edit=false;	
					vm.selected_sequence_peche_thoniere_malagasy_capture ={};
        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
		//FIN SEQUENCE CAPTURE PECHE THON	
		// Controle modification espèce poisson
		vm.modifierEspece = function (item) { 
			vm.nontrouvee=true;
			vm.all_espece.forEach(function(esp) {
				if(parseInt(esp.id)==parseInt(item.id_espece)) {
					vm.nontrouvee=false;
					item.id_espece=esp.id;
					item.nom_espece=esp.nom_espece;
					item.code_espece=esp.code;
				}
			});
			if(vm.nontrouvee==true) {				
					item.id_espece = null; 
					item.nom_espece = null; 
					item.code_espece = null; 
			}
		}	
		vm.FiltrerParTypeEspece = function (item) { 
			// Affectation type espèce
			vm.all_type_espece.forEach(function(tesp) {
				if(parseInt(tesp.id)==parseInt(item.id_type_espece)) {
					vm.nontrouvee=false;
					item.id_type_espece=tesp.id;
					item.type_espece=tesp.libelle;
				}
			});
			item.id_espece=null;
			apiFactory.getAPIgeneraliser("SIP_espece/index","type_espece",item.id_type_espece).then(function(result)
			{
				vm.all_espece = result.data.response;	
			});
		}	
		// ANALYSE CHOIX	
		vm.Reinitialiser_donnees = function() {
			vm.donnees_reporting = [];
			vm.entete_etat=[];
		}
		vm.Filtrer_Reporting = function(export_excel) {
			// EN-TETE DYNAMIQUE
			vm.affiche_load=true;
			apiFactory.getAPIgeneraliserREST("SIP_reporting_peche_thon_malagasy/index","menu",vm.filtre.menu,"annee_debut",vm.filtre.annee_debut,"annee_fin",vm.filtre.annee_fin,"export_excel",export_excel).then(function(result)
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
