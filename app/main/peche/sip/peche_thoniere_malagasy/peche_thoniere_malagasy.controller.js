(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.peche_thoniere_malagasy')
        .controller('Peche_thoniere_malagasyController', Peche_thoniere_malagasyController);

    /** @ngInject */
    function Peche_thoniere_malagasyController(apiFactory, $scope, $mdDialog)
    {
        var vm = this;

        

		vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			order:[] 
		};
		vm.afficher_table =true; // Affichage détail table par ligne
		//DEBUT Table paramètre
			apiFactory.getAPIgeneraliser("SIP_navire/index","id_type_navire",2).then(function(result)
			{
				vm.all_navire = result.data.response;				
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
	        [
				{titre:"Navire"},
				{titre:"N° FP"},
				{titre:"Nom capitaine"},
				{titre:"Nb équipage"},
				{titre:"Date rapport"},
				{titre:"Déclarant"},
				{titre:"Départ"},
				{titre:"Arrivée"},
				{titre:"Port"},
				{titre:"Jr en mer"},
				{titre:"Nb peche"},
				{titre:"Nb peche zee mdg"},
	        ] ;
			apiFactory.getAll("SIP_peche_thoniere_malagasy/index").then(function(result)
			{
				vm.all_peche_thoniere_malagasy = result.data.response;
			});
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
			vm.selection_peche_thoniere_malagasy = function(cm)
			{
				vm.selected_peche_thoniere_malagasy = cm ;
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
			vm.modifier_peche_thoniere_alagasy = function()
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
			vm.annuler_peche_thoniere_alagasy = function()
			{
				vm.afficher_table =true;
				nouvel_col_mar = false ;
				vm.affichage_masque_peche_thoniere_malagasy = false ;
				vm.selected_peche_thoniere_malagasy = {};
			}
			vm.supprimer_peche_thoniere_alagasy = function() 
			{
				vm.affichage_masque_peche_thoniere_malagasy = false ;
				
				var confirm = $mdDialog.confirm()
				  .title('Etes-vous sûr de supprimer cet enregistrement ?')
				  .textContent('')
				  .ariaLabel('Lucky day')
				  .clickOutsideToClose(true)
				  .parent(angular.element(document.body))
				  .ok('ok')
				  .cancel('annuler');
				$mdDialog.show(confirm).then(function() {

				vm.save_peche_thoniere_alagasy(vm.selected_peche_thoniere_malagasy,1);
				}, function() {
				//alert('rien');
				});
			}
			vm.save_peche_thoniere_alagasy = function(data_masque, etat_suppression)
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
        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
			vm.modifierNavire = function (item) { 
				vm.nontrouvee=true;
				vm.all_navire.forEach(function(navi) {
					if(parseInt(navi.id)==parseInt(item.id_navire)) {
						vm.nontrouvee=false;
						vm.col_peche_thoniere_malagasy.id_navire=navi.id;
						vm.col_peche_thoniere_malagasy.nom_navire=navi.nom;
						vm.col_peche_thoniere_malagasy.immatricule=navi.immatricule;
					}
				});
				if(vm.nontrouvee==true) {				
						vm.col_peche_thoniere_malagasy.id_navire = null; 
						vm.col_peche_thoniere_malagasy.nom_navire = null; 
						vm.col_peche_thoniere_malagasy.immatricule = null; 
				}
			}	
		//FIN Peche thonière malagasy     
    }
})();
