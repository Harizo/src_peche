(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.navire')
        .controller('pecheur_pirogueController', pecheur_pirogueController);

    /** @ngInject */
    function pecheur_pirogueController(apiFactory, $scope, $mdDialog)
    {
    	var vm = this ;

    		vm.carte_pecheur = {};
    		vm.date_now = new Date();
    	//clé etrangere
    		apiFactory.getAll("region/index").then(function(result)
			{
				vm.allregion= result.data.response;
			});

			vm.get_district_by_region = function()
			{
				vm.filtre.id_district = null ;
				vm.carte_pecheur.id_commune = null ;
				vm.carte_pecheur.id_fokontany = null ;
				vm.allcommune = [];
				vm.allfokontany = [];
				apiFactory.getAPIgeneraliserREST("district/index","id_region",vm.filtre.id_region).then(function(result)
				{
					vm.alldistrict = result.data.response;
				});
			}

			vm.get_commune_district = function()
			{
				vm.carte_pecheur.id_commune = null ;
				vm.carte_pecheur.id_fokontany = null ;
				vm.allfokontany = [];
				apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_district).then(function(result)
				{
					
					vm.allcommune = result.data.response;
					
				});
			}

			vm.get_fokontany_by_commune = function()
			{
				vm.carte_pecheur.id_fokontany = null ;
				apiFactory.getAPIgeneraliserREST("fokontany/index","cle_etrangere",vm.carte_pecheur.id_commune).then(function(result)
				{
					
					vm.allfokontany = result.data.response;
				});
			}

			$scope.$watch('vm.carte_pecheur.id_commune', function()
			{
				if (!vm.carte_pecheur.id_commune) return;
				

				if (vm.carte_pecheur.id_commune) 
				{
					vm.get_fokontany_by_commune() ;
				}

			});
    	//fin clé etrangere

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

		vm.convert_to_annee_mois = function(date)
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
				var date_final= vm.affichage_mois(mois)+'-'+annee;
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

    	//CARTE PECHEUR
    		vm.selected_carte_pecheur = {} ;
    		var nouvel_carte_pecheur = false;
    		vm.all_carte_pecheur = [] ;
	    	vm.get_carte_pecheur_by_district = function() 
	    	{
	    		apiFactory.getAPIgeneraliserREST("SIP_carte_pecheur/index","id_district",vm.filtre.id_district).then(function(result)
				{
					vm.all_carte_pecheur = result.data.response;
					console.log(vm.all_carte_pecheur);

					vm.selected_carte_pecheur = {} ;
					
				});
	    	}

	    	vm.dtOptions =
			{
				dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
				pagingType: 'simple_numbers',
				order:[] 
			};

			vm.entete_liste_carte_pecheur = 
	        [
				{titre:"Commune"},
				{titre:"Fokontany"},
				{titre:"Village"},
				{titre:"N° carte pêcheur"},
				{titre:"Date"},
				{titre:"Association"},
				{titre:"Nom et prénom"},
				{titre:"Date de naissance"},
				{titre:"Carte d'identité nationale"},
				{titre:"Date délivrance CIN"},
				{titre:"Lieu de délivrance CIN"},
				{titre:"Nombre pirogue"},
	        ] ;


	        vm.selection_carte_pecheur = function(item) 
	        {
	        	vm.selected_carte_pecheur = item ;
	        }

	        $scope.$watch('vm.selected_carte_pecheur', function()
			{
				if (!vm.all_carte_pecheur) return;
				vm.all_carte_pecheur.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_carte_pecheur.$selected = true;

			});

			vm.ajout_carte_pecheur = function() 
			{
				vm.affichage_masque_carte_pecheur = true ;
				nouvel_carte_pecheur = true ;
			}

			vm.save_in_bdd = function(data_masque, etat_suppression)
			{
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };

	            var id = 0 ;

	            if (!nouvel_carte_pecheur) 
	            {
	            	id = vm.selected_carte_pecheur.id ;
	            }



	            var datas = $.param(
	            {
	            	
	                id:id,      
	                supprimer:etat_suppression,

	                numero:data_masque.numero,
	                date:convert_to_date_sql(data_masque.date),
	                id_fokontany:data_masque.id_fokontany,
	                village:data_masque.village,
	                association:data_masque.association,
	                nom:data_masque.nom,
	                prenom:data_masque.prenom,
	                cin:data_masque.cin,
	                date_cin:convert_to_date_sql(data_masque.date_cin),
	                date_naissance:convert_to_date_sql(data_masque.date_naissance),
	                lieu_cin:data_masque.lieu_cin,
	                nbr_pirogue:data_masque.nbr_pirogue
	                
	                
	            });


	            apiFactory.add("SIP_carte_pecheur/index",datas, config).success(function (data)
        		{
        			var com = vm.allcommune.filter(function(obj)
					{
						return obj.id == data_masque.id_commune;
					});

					var fkt = vm.allfokontany.filter(function(obj)
					{
						return obj.id == data_masque.id_fokontany;
					});

        			if (!nouvel_carte_pecheur) 
        			{
        				if (etat_suppression == 0) //mise à jour
        				{
        				


			                vm.selected_carte_pecheur.numero = data_masque.numero ;
			                vm.selected_carte_pecheur.date = convert_to_date_sql(data_masque.date) ;
			                vm.selected_carte_pecheur.id_fokontany = data_masque.id_fokontany ;
			                vm.selected_carte_pecheur.village = data_masque.village ;
			                vm.selected_carte_pecheur.association = data_masque.association ;
			                vm.selected_carte_pecheur.nom = data_masque.nom ;
			                vm.selected_carte_pecheur.prenom = data_masque.prenom ;
			                vm.selected_carte_pecheur.cin = data_masque.cin ;
			                vm.selected_carte_pecheur.date_cin = convert_to_date_sql(data_masque.date_cin) ;
			                vm.selected_carte_pecheur.date_naissance = convert_to_date_sql(data_masque.date_naissance) ;
			                vm.selected_carte_pecheur.lieu_cin = data_masque.lieu_cin ;
			                vm.selected_carte_pecheur.nbr_pirogue = data_masque.nbr_pirogue ;

        				}
        				else//Suppression
        				{
        					vm.all_carte_pecheur = vm.all_carte_pecheur.filter(function(obj)
							{
								return obj.id !== vm.selected_carte_pecheur.id;
							});

        				}

        			}
        			else
        			{
        				var item =
			            {
							id:String(data.response) ,
							numero:data_masque.numero,
			                date:convert_to_date_sql(data_masque.date),

			                id_fokontany:data_masque.id_fokontany,
			                nom_fokontany:fkt[0].nom,

			                id_commune:data_masque.id_commune,
			                nom_commune:com[0].nom,

			                village:data_masque.village,
			                association:data_masque.association,
			                nom:data_masque.nom,
			                prenom:data_masque.prenom,
			                cin:data_masque.cin,
			                date_cin:convert_to_date_sql(data_masque.date_cin),
			                date_naissance:convert_to_date_sql(data_masque.date_naissance),
			                lieu_cin:data_masque.lieu_cin,
			                nbr_pirogue:data_masque.nbr_pirogue               
						}          
			            vm.all_carte_pecheur.unshift(item);
        			}

	        		vm.affichage_masque_carte_pecheur = false ; //Fermeture de la masque de saisie
	        		nouvel_carte_pecheur = false;


        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
        //FIN CARTE PECHEUR

        //ENGIN DE PECHE

        //FIN ENGIN DE PECHE
    }
})();