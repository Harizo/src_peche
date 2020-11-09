(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.navire')
        .controller('NavireController', NavireController);

    /** @ngInject */
    function NavireController(apiFactory, $scope, $mdDialog)
    {
        var vm = this;  
		vm.all_type_navire = [];	
		vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			order:[] 
		};
		//CLE ETRANGERE
			apiFactory.getAll("SIP_type_navire/index").then(function(result)
			{
				vm.all_type_navire = result.data.response;
			});
			apiFactory.getAll("SIP_espece/index").then(function(result)
			{
				vm.all_espece = result.data.response;
				console.log(vm.all_espece);
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
		//navire
			vm.afficher_table_navire=true;
			vm.selected_navire = {};
			var nouvel_col_navire = false ;
			vm.affichage_masque_navire = false ;
			vm.entete_liste_navire = 
	        [
				{titre:"Immatricule"},
				{titre:"Nom"},
				{titre:"Pavillon"},
				{titre:"Armateur"},
				{titre:"Adresse"},
				{titre:"Tonnage Brut"},
				{titre:"Lht"},
				{titre:"Cap cale"},
				{titre:"Indic ratio"},
				{titre:"Type navire"}
	        ] ;
			apiFactory.getAll("SIP_navire/index").then(function(result)
			{
				vm.all_navire = result.data.response;
			});
			vm.affichage_col_navire = function(int)
			{
				if (int == '0') 
					return "Non";
				else
					return "Oui";
			}
			vm.affichage_col_navire_bool = function(bool)
			{
				if (!bool) 
					return "Non";
				else
					return "Oui";
			}
			vm.selection_navire = function(cm)
			{
				vm.selected_navire = cm ;
				//désélection fils
					vm.selected_autorisation_navire = {};
					vm.selected_collecte = {} ;
				//fin désélection fils
			}
			$scope.$watch('vm.selected_navire', function()
			{
				if (!vm.all_navire) return;
				vm.all_navire.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_navire.$selected = true;
			});
			vm.ajout_col_navire = function()
			{
				vm.col_navire = {};
				vm.selected_navire = {};
				vm.affichage_masque_navire = true ;
				nouvel_col_navire = true ;
				vm.afficher_table_navire=false;
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
			vm.modif_col_navire = function()
			{
				nouvel_col_navire = false ;
				vm.affichage_masque_navire = true ;
				vm.col_navire.immatricule = vm.selected_navire.immatricule ;
				vm.col_navire.nom = vm.selected_navire.nom ;
				vm.col_navire.pavillon = vm.selected_navire.pavillon ;
				vm.col_navire.armateur = vm.selected_navire.armateur ;
				vm.col_navire.adresse = vm.selected_navire.adresse ;
				vm.col_navire.tonnage_brute = parseFloat(vm.selected_navire.tonnage_brute) ;
				vm.col_navire.lht = parseFloat(vm.selected_navire.lht) ;
				vm.col_navire.capacite_cale = parseInt(vm.selected_navire.capacite_cale) ;
				vm.col_navire.indication_ratio = vm.selected_navire.indication_ratio ;
				vm.col_navire.type_navire = parseInt(vm.selected_navire.type_navire) ;
				vm.col_navire.libelle_type_navire = vm.selected_navire.libelle_type_navire ;
				vm.afficher_table_navire=false;
			}
			vm.annuler_col_navire = function()
			{
				nouvel_col_navire = false ;
				vm.affichage_masque_navire = false ;
				vm.selected_navire = {};
				vm.afficher_table_navire=true;
			}
			vm.supprimer_col_navire = function() 
			{
				vm.affichage_masque_navire = false ;				
				var confirm = $mdDialog.confirm()
				  .title('Etes-vous sûr de supprimer cet enregistrement ?')
				  .textContent('')
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
					apiFactory.getParamsDynamic("SIP_peche_thoniere_etranger/index?id_navire="+vm.selected_navire.id+"").then(function (resultat) {
            			vm.peche_thoniere_etranger = resultat.data.response.length;
            
          				apiFactory.getParamsDynamic("SIP_peche_thoniere_malagasy/index?id_navire="+vm.selected_navire.id+"").then(function (resultat) {
            				vm.peche_thoniere_malagasy = resultat.data.response.length;
            
            				apiFactory.getParamsDynamic("SIP_autorisation_navire/index?id_navire="+vm.selected_navire.id+"").then(function (resultat) {
           						vm.autorisation_navire = resultat.data.response.length;
            
            					apiFactory.getParamsDynamic("SIP_sortie_peche_artisanale/index?id_navire="+vm.selected_navire.id+"").then(function (resultat) {
            						vm.sortie_peche_artisanale = resultat.data.response.length;
           							if ( (vm.peche_thoniere_etranger>0) ||(vm.peche_thoniere_malagasy>0) ||(vm.sortie_peche_artisanale>0)|| (vm.autorisation_navire>0)) 
          							{
            							vm.dial();
          							}
          							else{
            							$mdDialog.show(confirm).then(function() {

										vm.save_in_bdd(vm.selected_navire,1);
            
            							}, function() {
							              //alert('rien');
							            });
							        }
							    }); 
            
        					}); 

        				});
        			}); 

			}

			 vm.dial = function (ev)
			  {
			    var confirm = $mdDialog.confirm({
			      controller: ControlDialog,
			      templateUrl: 'app/main/peche/sip/ddbsip/dialogue/dialog_Fils.html',
			      parent: angular.element(document.body),
			      targetEvent: ev, 
			    
			    })
			    $mdDialog.show(confirm).then(function(resultat)
			    {
			      console.log(resultat) ; 
			    }, function(){//alert('rien');
			    });
			  }
			  
			  function ControlDialog($mdDialog, $scope, apiFactory, $state)  
			  {
			    var dg=$scope;
			    //style
			    dg.tOptions = {
			      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			      pagingType: 'simple',
			      autoWidth: false          
			    };
			    
			    dg.titre_column = [
			              {titre:"Pêche thoniere Malagasy"},
			              {titre:"Pêche thoniere étranger"},
			              {titre:"Autorisation navire"},
			              {titre:"Sortie pêche artisanale"}

			    ]; 

			    dg.nbr1 = vm.peche_thoniere_malagasy;
			    dg.nbr2 = vm.peche_thoniere_etranger;
			    dg.nbr3 = vm.autorisation_navire;
			    dg.nbr4 = vm.sortie_peche_artisanale;

			    dg.cancel = function()
			    {
			      $mdDialog.hide();
			    }

			  }

			vm.save_in_bdd = function(data_masque, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };
	            var id = 0 ;
	            if (!nouvel_col_navire) 
	            {
	            	id = vm.selected_navire.id ;
	            }
	            var datas = $.param(
	            {	            	
	                id:id,      
	                supprimer:etat_suppression,
	                immatricule:data_masque.immatricule,
	                nom:data_masque.nom,
	                pavillon:data_masque.pavillon,
	                armateur:data_masque.armateur,
	                adresse:data_masque.adresse,
	                tonnage_brute:data_masque.tonnage_brute,
	                lht:data_masque.lht,
	                capacite_cale:data_masque.capacite_cale,
	                indication_ratio:data_masque.indication_ratio,
	                type_navire:data_masque.type_navire,
	                libelle_type_navire:data_masque.libelle_type_navire,
	            });
	            apiFactory.add("SIP_navire/index",datas, config).success(function (data)
        		{
        			if (!nouvel_col_navire) 
        			{
        				if (etat_suppression == 0) //mise à jour
        				{
        					vm.selected_navire.immatricule = data_masque.immatricule,
			                vm.selected_navire.nom = data_masque.nom,
			                vm.selected_navire.pavillon = data_masque.pavillon,
			                vm.selected_navire.armateur = data_masque.armateur,
			                vm.selected_navire.adresse = data_masque.adresse,
			                vm.selected_navire.tonnage_brute = data_masque.tonnage_brute,
			                vm.selected_navire.lht = data_masque.lht,
			                vm.selected_navire.capacite_cale = data_masque.capacite_cale,
			                vm.selected_navire.indication_ratio = data_masque.indication_ratio,
			                vm.selected_navire.type_navire = data_masque.type_navire,
			                vm.selected_navire.libelle_type_navire = data_masque.libelle_type_navire
        				}
        				else//Suppression
        				{
        					vm.all_navire = vm.all_navire.filter(function(obj)
							{
								return obj.id !== vm.selected_navire.id;
							});
        				}
        			}
        			else
        			{
        				var item =
			            {
							id:String(data.response) ,
							immatricule:data_masque.immatricule,
							nom:data_masque.nom,
							pavillon:data_masque.pavillon,
							armateur:data_masque.armateur,
							adresse:data_masque.adresse,
							tonnage_brute:data_masque.tonnage_brute,
							lht:data_masque.lht,
							capacite_cale:data_masque.capacite_cale,
							indication_ratio:data_masque.indication_ratio,                  
							type_navire:data_masque.type_navire,                  
							libelle_type_navire:data_masque.libelle_type_navire                
						}          
			            vm.all_navire.unshift(item);
        			}
	        		vm.affichage_masque_navire = false ; //Fermeture de la masque de saisie
	        		nouvel_col_navire = false;
					vm.afficher_table_navire=true;
        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
		//FIN navire

		//AUTORISATION NAVIRE
			vm.selected_autorisation_navire = {};
			vm.afficher_table_autorisation_navire=true;
			var nouvel_autorisation_navire = false ;
			vm.affichage_masque_autorisation_navire = false ;
			vm.entete_liste_autorisation_navire = 
	        [
				{titre:"Zone autorisée"},
				{titre:"Espèce 1 autorisée"},
				{titre:"Espèce 2 autorisée"},
	        ] ;
	        vm.get_autorisation_navire = function()
	        {
	        	//GET AUTORISATION PAR NAVIRE
				apiFactory.getAPIgeneraliserREST("SIP_autorisation_navire/index","id_navire",vm.selected_navire.id).then(function(result)
				{
					vm.all_autorisation_navire = result.data.response;
				});
				//FIN GET AUTORISATION PAR NAVIRE
	        }
	        vm.selection_autorisation_navire = function(autorisation_navire)
	        {
	        	vm.selected_autorisation_navire = autorisation_navire ;	        	
	        }
	        $scope.$watch('vm.selected_autorisation_navire', function()
			{
				if (!vm.all_autorisation_navire) return;
				vm.all_autorisation_navire.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_autorisation_navire.$selected = true;
			});
			vm.ajout_autorisation_navire = function()
			{
				vm.autorisation_navire = {};
				vm.selected_autorisation_navire = {};
				vm.affichage_masque_autorisation_navire = true ;
				nouvel_autorisation_navire = true ;
				vm.afficher_table_autorisation_navire=false;
			}
			vm.modif_autorisation_navire = function()
			{
				nouvel_autorisation_navire = false ;
				vm.affichage_masque_autorisation_navire = true ;
				vm.autorisation_navire.id_navire = vm.selected_autorisation_navire.id_navire ;
				vm.autorisation_navire.navire = vm.selected_autorisation_navire.navire ;
				vm.autorisation_navire.zone_autorisee = vm.selected_autorisation_navire.zone_autorisee ;
				vm.autorisation_navire.espece_1_autorisee = parseInt(vm.selected_autorisation_navire.espece_1_autorisee) ;
				vm.autorisation_navire.code_espece1 = vm.selected_autorisation_navire.code_espece1 ;
				vm.autorisation_navire.nom_espece1 = vm.selected_autorisation_navire.nom_espece1 ;
				vm.autorisation_navire.espece_2_autorisee = parseInt(vm.selected_autorisation_navire.espece_2_autorisee) ;
				vm.autorisation_navire.code_espece2 = vm.selected_autorisation_navire.code_espece2 ;
				vm.autorisation_navire.nom_espece2 = vm.selected_autorisation_navire.nom_espece2 ;
				vm.afficher_table_autorisation_navire=false;
			}
			vm.supprimer_autorisation_navire = function() 
			{
				vm.affichage_masque_navire = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Etes-vous sûr de supprimer cet autorisation_navire ?')
				  .textContent('Confirmation de suppression')
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_in_bdd_autorisation_navire(vm.selected_navire,1);
				}, function() {
				//alert('rien');
				});
			}
			vm.annuler_autorisation_navire = function()
			{
				vm.autorisation_navire = {} ;
				nouvel_autorisation_navire = false ;
				vm.affichage_masque_autorisation_navire = false ;
				vm.afficher_table_autorisation_navire=true;
				vm.selected_autorisation_navire={};
			}
			vm.save_in_bdd_autorisation_navire = function(autorisation_navire, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };
	            var id = 0 ;
	            if (!nouvel_autorisation_navire) 
	            {
	            	id = vm.selected_autorisation_navire.id ;
	            }
	            var datas = $.param(
	            {	            	
	                id:id,      
	                supprimer:etat_suppression,
	                id_navire:vm.selected_navire.id,
	                navire:autorisation_navire.navire,
	                zone_autorisee:autorisation_navire.zone_autorisee,
	                espece_1_autorisee:autorisation_navire.espece_1_autorisee,
	                espece_2_autorisee:autorisation_navire.espece_2_autorisee,
	            });
	            apiFactory.add("SIP_autorisation_navire/index",datas, config).success(function (data)
        		{
        			if (!nouvel_autorisation_navire) 
        			{
        				if (etat_suppression == 0) //mise à jour
        				{
        					vm.selected_autorisation_navire.id_navire =  autorisation_navire.id_navire ;
        					vm.selected_autorisation_navire.navire =  autorisation_navire.navire ;
        					vm.selected_autorisation_navire.zone_autorisee =  autorisation_navire.zone_autorisee ;
        					vm.selected_autorisation_navire.espece_1_autorisee =  autorisation_navire.espece_1_autorisee ;
        					vm.selected_autorisation_navire.code_espece1 =  autorisation_navire.code_espece1 ;
        					vm.selected_autorisation_navire.nom_espece1 =  autorisation_navire.nom_espece1 ;
        					vm.selected_autorisation_navire.espece_2_autorisee =  autorisation_navire.espece_2_autorisee ;
        					vm.selected_autorisation_navire.code_espece2 =  autorisation_navire.code_espece2 ;
        					vm.selected_autorisation_navire.nom_espece2 =  autorisation_navire.nom_espece2 ;
        				}
        				else//Suppression
        				{
        					vm.all_autorisation_navire = vm.all_autorisation_navire.filter(function(obj)
							{
								return obj.id !== vm.selected_autorisation_navire.id;
							});
        				}
        			}
        			else
        			{
        				var item =
			            {
							id:String(data.response) ,
							id_navire:autorisation_navire.id_navire,
			                navire:autorisation_navire.navire,
			                zone_autorisee:autorisation_navire.zone_autorisee,
			                espece_1_autorisee:autorisation_navire.espece_1_autorisee,
			                code_espece1:autorisation_navire.code_espece1,
			                nom_espece1:autorisation_navire.nom_espece1,
			                espece_2_autorisee:autorisation_navire.espece_2_autorisee,
			                code_espece2:autorisation_navire.code_espece2,
			                nom_espece2:autorisation_navire.nom_espece2,
						}          
			            vm.all_autorisation_navire.unshift(item);
        			}
        			vm.affichage_masque_autorisation_navire = false ; //Fermeture de la masque de saisie
        			nouvel_autorisation_navire = false;
					vm.afficher_table_autorisation_navire=true;
        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
		//FIN AUTORISATION NAVIRE  
			vm.modifierTypeNavire = function (item) { 
				vm.nontrouvee=true;
				vm.all_type_navire.forEach(function(navi) {
					if(parseInt(navi.id)==parseInt(item.type_navire)) {
						vm.nontrouvee=false;
						vm.col_navire.type_navire=navi.id;
						vm.col_navire.libelle_type_navire=navi.libelle;
					}
				});
				if(vm.nontrouvee==true) {				
						vm.col_navire.type_navire = null; 
						vm.col_navire.libelle_type_navire = null; 
				}
			}	
			vm.modifierEspece1 = function (item) { 
				vm.nontrouvee=true;
				vm.all_espece.forEach(function(esp) {
					if(parseInt(esp.id)==parseInt(item.espece_1_autorisee)) {
						vm.nontrouvee=false;
						vm.autorisation_navire.espece_1_autorisee=esp.id;
						vm.autorisation_navire.code_espece1=esp.code;
						vm.autorisation_navire.nom_espece1=esp.nom;
					}
				});
				if(vm.nontrouvee==true) {	
					vm.autorisation_navire.espece_1_autorisee = null; 
					vm.autorisation_navire.code_espece1 = null; 
					vm.autorisation_navire.nom_espece1 = null; 
				}
			}	
			vm.modifierEspece2 = function (item) { 
				vm.nontrouvee=true;
				vm.all_espece.forEach(function(esp) {
					if(parseInt(esp.id)==parseInt(item.espece_2_autorisee)) {
						vm.nontrouvee=false;
						vm.autorisation_navire.espece_2_autorisee=esp.id;
						vm.autorisation_navire.code_espece2=esp.code;
						vm.autorisation_navire.nom_espece2=esp.nom;
					}
				});
				if(vm.nontrouvee==true) {				
						vm.autorisation_navire.espece_2_autorisee = null; 
						vm.autorisation_navire.code_espece2 = null; 
						vm.autorisation_navire.nom_espece2 = null; 
				}
			}	
		
    }
})();
