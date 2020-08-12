(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.poisson_demersaux')
        .controller('Poisson_demersauxController', Poisson_demersauxController);

    /** @ngInject */
    function Poisson_demersauxController(apiFactory, $scope, $mdDialog)
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
			apiFactory.getAll("SIP_navire/index").then(function(result)
			{
				vm.all_navire = result.data.response;				
			});
			apiFactory.getAPIgeneraliserREST("SIP_espece/index","id_type_espece",6).then(function(result)
			{
				vm.all_espece = result.data.response;	
					console.log(vm.all_espece);
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
				{titre:"Espèce"},
				{titre:"Qté"},
	        ] ;
			apiFactory.getAll("SIP_poisson_demersaux/index").then(function(result)
			{
				vm.all_poisson_demersaux = result.data.response;
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
			vm.selection_poisson_demersaux = function(cm)
			{
				vm.selected_poisson_demersaux = cm ;
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
				vm.col_poisson_demersaux.nom = vm.selected_poisson_demersaux.nom ;
				vm.col_poisson_demersaux.immatricule = vm.selected_poisson_demersaux.immatricule ;
				vm.col_poisson_demersaux.nom_capitaine = vm.selected_poisson_demersaux.nom_capitaine ;
				vm.col_poisson_demersaux.port = vm.selected_poisson_demersaux.port ;
				vm.col_poisson_demersaux.num_maree = vm.selected_poisson_demersaux.num_maree ;
				vm.col_poisson_demersaux.date_depart = new Date(vm.selected_poisson_demersaux.date_depart) ;
				vm.col_poisson_demersaux.date_arrive = new Date(vm.selected_poisson_demersaux.date_arrive) ;
				vm.col_poisson_demersaux.annee = parseInt(vm.selected_poisson_demersaux.annee) ;
				vm.col_poisson_demersaux.mois = parseInt(vm.selected_poisson_demersaux.mois) ;
				vm.col_poisson_demersaux.id_espece = parseInt(vm.selected_poisson_demersaux.id_espece) ;
				vm.col_poisson_demersaux.reference_produit =vm.selected_poisson_demersaux.reference_produit ;
				vm.col_poisson_demersaux.code_espece =vm.selected_poisson_demersaux.code_espece ;
				vm.col_poisson_demersaux.nom_espece =vm.selected_poisson_demersaux.nom_espece ;
				vm.col_poisson_demersaux.quantite = parseInt(vm.selected_poisson_demersaux.quantite) ;
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
				  .title('Etes-vous sûr de supprimer cet enregistrement ?')
				  .textContent('')
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
	                nom:data_masque.nom,
	                nom_capitaine:data_masque.nom_capitaine,
	                port:data_masque.port,	                
	                num_maree:data_masque.num_maree,
	                date_depart:convert_to_date_sql(data_masque.date_depart),	                
	                date_arrive:convert_to_date_sql(data_masque.date_arrive),	                
	                annee:data_masque.annee,	                
	                mois:data_masque.mois,	                
	                reference_produit:data_masque.reference_produit,	                
	                id_espece:data_masque.id_espece,	                
	                quantite:data_masque.quantite,
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
			                vm.selected_poisson_demersaux.nom = data_masque.nom,
			                vm.selected_poisson_demersaux.nom_capitaine = data_masque.nom_capitaine,
			                vm.selected_poisson_demersaux.port = data_masque.port,
			                vm.selected_poisson_demersaux.num_maree = data_masque.num_maree,
			                vm.selected_poisson_demersaux.date_depart = data_masque.date_depart,
			                vm.selected_poisson_demersaux.date_arrive = data_masque.date_arrive,
			                vm.selected_poisson_demersaux.annee = data_masque.annee,
			                vm.selected_poisson_demersaux.mois = data_masque.mois,
			                vm.selected_poisson_demersaux.reference_produit = data_masque.reference_produit,
			                vm.selected_poisson_demersaux.id_espece = data_masque.id_espece,
			                vm.selected_poisson_demersaux.quantite = data_masque.quantite,
			                vm.selected_poisson_demersaux.nom_espece = data_masque.nom_espece,
			                vm.selected_poisson_demersaux.code_espece = data_masque.code_espece
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
							nom:data_masque.nom,
							nom_capitaine:data_masque.nom_capitaine,
							port:data_masque.port,                   
							num_maree:data_masque.num_maree,
							date_depart:data_masque.date_depart,                   
							date_arrive:data_masque.date_arrive,                   
							annee:data_masque.annee,                   
							mois:data_masque.mois,                   
							reference_produit:data_masque.reference_produit,                   
							id_espece:data_masque.id_espece,                   
							quantite:data_masque.quantite,
							nom_espece:data_masque.nom_espece,
							code_espece:data_masque.code_espece,
						}          
			            vm.all_poisson_demersaux.unshift(item);
        			}
	        		vm.affichage_masque_poisson_demersaux = false ; //Fermeture de la masque de saisie
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
						vm.col_poisson_demersaux.id_navire=navi.id;
						vm.col_poisson_demersaux.nom=navi.nom;
						vm.col_poisson_demersaux.immatricule=navi.immatricule;
					}
				});
				if(vm.nontrouvee==true) {				
						vm.col_poisson_demersaux.id_navire = null; 
						vm.col_poisson_demersaux.nom = null; 
						vm.col_poisson_demersaux.immatricule = null; 
				}
			}	
			vm.modifierEspece = function (item) { 
				vm.nontrouvee=true;
				vm.all_espece.forEach(function(esp) {
					if(parseInt(esp.id)==parseInt(item.id_espece)) {
						vm.nontrouvee=false;
						vm.col_poisson_demersaux.id_espece=esp.id;
						vm.col_poisson_demersaux.nom_espece=esp.nom;
						vm.col_poisson_demersaux.code_espece=esp.code;
					}
				});
				if(vm.nontrouvee==true) {				
						vm.col_poisson_demersaux.id_espece = null; 
						vm.col_poisson_demersaux.nom_espece = null; 
						vm.col_poisson_demersaux.code_espece = null; 
				}
			}	
		//FIN Peche thonière malagasy     
    }
})();
