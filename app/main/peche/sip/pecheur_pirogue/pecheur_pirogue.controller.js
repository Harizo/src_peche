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

			apiFactory.getAll("type_engin/index").then(function(result)
			{
				vm.alltype_engin= result.data.response;

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

					if (!nouvel_carte_pecheur && vm.selected_carte_pecheur.id_fokontany) 
					{
						vm.carte_pecheur.id_fokontany = vm.selected_carte_pecheur.id_fokontany ;
					}
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

		vm.replace_point = function(nbr)
		{
			var str = ""+nbr ;
			var res = str.replace(".",",") ;
			return res ;
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
				{titre:"Carte d'Identité Nationale"},
				{titre:"Date délivrance CIN"},
				{titre:"Lieu de délivrance CIN"},
				{titre:"Nombre pirogue"},
	        ] ;


	        vm.selection_carte_pecheur = function(item) 
	        {
	        	vm.selected_carte_pecheur = item ;
	        	vm.get_engin_by_carte_pecheur(item.id) ;
	        	
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
				vm.carte_pecheur = {} ;
			}

			vm.modif_carte_pecheur = function() 
			{
				nouvel_carte_pecheur = false ;

                vm.carte_pecheur.numero = vm.selected_carte_pecheur.numero ;
                vm.carte_pecheur.date = new Date(vm.selected_carte_pecheur.date) ;

                vm.carte_pecheur.id_fokontany = vm.selected_carte_pecheur.id_fokontany ;
                

                vm.carte_pecheur.id_commune = vm.selected_carte_pecheur.id_commune ;
              

                vm.carte_pecheur.village = vm.selected_carte_pecheur.village ;
                vm.carte_pecheur.association = vm.selected_carte_pecheur.association ;
                vm.carte_pecheur.nom = vm.selected_carte_pecheur.nom ;
                vm.carte_pecheur.prenom = vm.selected_carte_pecheur.prenom ;
                vm.carte_pecheur.cin = Number(vm.selected_carte_pecheur.cin) ;
                vm.carte_pecheur.date_cin = new Date(vm.selected_carte_pecheur.date_cin) ;
                vm.carte_pecheur.date_naissance = new Date(vm.selected_carte_pecheur.date_naissance) ;
                vm.carte_pecheur.lieu_cin = vm.selected_carte_pecheur.lieu_cin ;
                vm.carte_pecheur.nbr_pirogue = Number(vm.selected_carte_pecheur.nbr_pirogue) ;
                vm.affichage_masque_carte_pecheur = true ;
			}

			vm.supprimer_carte_pecheur = function () 
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

				vm.save_in_bdd(vm.selected_carte_pecheur,1);
				}, function() {
				//alert('rien');
				});
			}

			vm.annuler = function () 
			{
				nouvel_carte_pecheur = false ;
				vm.affichage_masque_carte_pecheur = false ;
				vm.selected_carte_pecheur = {} ;
			}

			vm.save_in_bdd = function(data_masque, etat_suppression)
			{
				vm.affiche_load = true ;
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
        			vm.affiche_load = false ;
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
			                vm.selected_carte_pecheur.nom_fokontany = fkt[0].nom ;

			                vm.selected_carte_pecheur.id_commune = data_masque.id_commune ;
			                vm.selected_carte_pecheur.nom_commune = com[0].nom ;

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
        	vm.all_engin_carte_pecheur = [];
	        

	        vm.get_engin_by_carte_pecheur = function (id_carte_pecheur) 
	        {
	        	vm.affiche_load = true ;
	        	apiFactory.getAPIgeneraliserREST("SIP_engin_carte_pecheur/index","id_carte_pecheur",id_carte_pecheur).then(function(result)
				{
					vm.all_engin_carte_pecheur = result.data.response;
					vm.affiche_load = false ;
					
				});
	        }

	        vm.entete_liste_engin = 
	        [
				{titre:"Engin"},
				{titre:"Nbr engin"},
				{titre:"utilisation_engin"},
				{titre:"longueur(m)"},
				{titre:"largeur(m)"},
				{titre:"hauteur(m)"},
				{titre:"maille(cm)"},
				{titre:"hamecon"}
	        ] ;

    
			
    		vm.selected_engin = {} ;
    		var current_selected_engin = {} ;
    		var nouvelle_engin = false ;

    		

			vm.selection_engin = function(item)
			{
				vm.selected_engin = item ;

				if (!vm.selected_engin.$edit) //si simple selection
				{
					nouvelle_engin = false ;	
				}


			}

			$scope.$watch('vm.selected_engin', function()
			{
				if (!vm.all_engin_carte_pecheur) return;
				vm.all_engin_carte_pecheur.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_engin.$selected = true;

			});

			vm.ajouter_engin = function()
			{
				nouvelle_engin = true ;
				var item = 
					{
						
						$edit: true,
						$selected: true,
	              		id:'0',
	              		id_carte_pecheur:vm.selected_carte_pecheur.id,
	              		id_type_engin:'',
	              		nbr_engin:0,
	              		utilisation_engin:'',
	              		longueur:0,
	              		largeur:0,
	              		hauteur:0,
	              		maille:0,
	              		hamecon:''
					} ;

				vm.all_engin_carte_pecheur.unshift(item);
	            vm.all_engin_carte_pecheur.forEach(function(af)
	            {
	              if(af.$selected == true)
	              {
	                vm.selected_engin = af;
	                
	              }
            	});
			}

			vm.modifier_engin = function()
			{
				nouvelle_engin = false ;
				vm.selected_engin.$edit = true;

				vm.selected_engin.nbr_engin = Number(vm.selected_engin.nbr_engin);
				vm.selected_engin.longueur = Number(vm.selected_engin.longueur);
				vm.selected_engin.largeur = Number(vm.selected_engin.largeur);
				vm.selected_engin.hauteur = Number(vm.selected_engin.hauteur);
				vm.selected_engin.maille = Number(vm.selected_engin.maille);

				current_selected_engin = angular.copy(vm.selected_engin);
			}

			vm.supprimer_engin = function()
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

				vm.enregistrer_engin(1);
				}, function() {
				//alert('rien');
				});
			}

			vm.annuler_engin = function()
			{
				if (nouvelle_engin) 
				{
					
					vm.all_engin_carte_pecheur.shift();
					vm.selected_engin = {} ;
					nouvelle_engin = false ;
				}
				else
				{
					vm.selected_engin.$selected = false;
					vm.selected_engin.$edit = false;

					vm.selected_engin.id_type_engin = current_selected_engin.id_type_engin ;
					vm.selected_engin.libelle_type_engin = current_selected_engin.libelle_type_engin ;

					vm.selected_engin.utilisation_engin = current_selected_engin.utilisation_engin ;
					vm.selected_engin.nbr_engin = current_selected_engin.nbr_engin ;
					vm.selected_engin.longueur = current_selected_engin.longueur ;
					vm.selected_engin.largeur = current_selected_engin.largeur ;
					vm.selected_engin.hauteur = current_selected_engin.hauteur ;
					vm.selected_engin.maille = current_selected_engin.maille ;
					vm.selected_engin.hamecon = current_selected_engin.hamecon ;

					vm.selected_engin = {};



				}
			}

			vm.enregistrer_engin = function(etat_suppression)
			{
				vm.affiche_load = true ;
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };


	            var datas = $.param(
	            {
	            	
	                supprimer : etat_suppression,
	                id_carte_pecheur : vm.selected_carte_pecheur.id,

	                id : vm.selected_engin.id ,
	                id_type_engin : vm.selected_engin.id_type_engin ,
					utilisation_engin : vm.selected_engin.utilisation_engin ,
					nbr_engin : vm.selected_engin.nbr_engin ,
					longueur : vm.selected_engin.longueur ,
					largeur : vm.selected_engin.largeur ,
					hauteur : vm.selected_engin.hauteur ,
					maille : vm.selected_engin.maille ,
					hamecon : vm.selected_engin.hamecon 
	                
	                
	            });

	            apiFactory.add("SIP_engin_carte_pecheur/index",datas, config).success(function (data)
        		{
        			vm.affiche_load = false ;
        			var te = vm.alltype_engin.filter(function(obj)
					{
						return obj.id == vm.selected_engin.id_type_engin;
					});
        			if (!nouvelle_engin) 
        			{
        				if (etat_suppression == 0) 
        				{
        					vm.selected_engin.$edit = false ;
        					vm.selected_engin.$selected = false ;
        					vm.selected_engin.libelle_type_engin = te[0].libelle ;

        					vm.selected_engin = {} ;
        				}
        				else
        				{
        					vm.all_engin_carte_pecheur = vm.all_engin_carte_pecheur.filter(function(obj)
							{
								return obj.id !== vm.selected_engin.id;
							});

							vm.selected_engin = {} ;
        				}

        			}
        			else
        			{
        				vm.selected_engin.$edit = false ;
        				vm.selected_engin.$selected = false ;
        				vm.selected_engin.id = String(data.response) ;
        				vm.selected_engin.libelle_type_engin = te[0].libelle ;

        				nouvelle_engin = false ;
        				vm.selected_engin = {};

        			}
        		})
        		.error(function (data) {alert("Une erreur s'est produit");});
			}

		

		

        //FIN ENGIN DE PECHE
        

        //CARTE pirogue

        	vm.affichage_etat_proprietaire = function(etat)
        	{
        		if (Number(etat) == 0) 
        		{
        			return "Non" ;
        		}
        		else
        			return "Oui" ;
        	}

        	

			vm.affichage_bool = function(bool)
			{
				if (!bool) 
					return "Non";
				else
					return "Oui";
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


        	vm.get_carte_pirogue = function () 
	        {

	        	vm.affiche_load = true ;
	        	apiFactory.getAPIgeneraliserREST("SIP_carte_pirogue/index","id_carte_pecheur",vm.selected_carte_pecheur.id).then(function(result)
				{
					vm.all_carte_pirogue = result.data.response;
					vm.affiche_load = false ;

					console.log(vm.all_carte_pirogue);
					
				});
	        }
        
       
    		vm.selected_carte_pirogue = {} ;
    		var nouvel_carte_pirogue = false;
    		vm.all_carte_pirogue = [] ;
	    	

	    	vm.dtOptions =
			{
				dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
				pagingType: 'simple_numbers',
				order:[] 
			};

			vm.entete_liste_carte_pirogue = 
	        [
				{titre:"Immatricule"},
				{titre:"Année de construction"},
				{titre:"Longueur(m)"},
				{titre:"Largeur(m)"},
				{titre:"C(m)"},
				{titre:"Coul"},
				{titre:"Nat"},
				{titre:"Prop"},
				{titre:"Type"},
				{titre:"Propriétaire"},
				{titre:"propriétaire??"},
				{titre:"Observations"}
	        ] ;


	        vm.selection_carte_pirogue = function(item) 
	        {
	        	vm.selected_carte_pirogue = item ;
	        	
	        }

	        $scope.$watch('vm.selected_carte_pirogue', function()
			{
				if (!vm.all_carte_pirogue) return;
				vm.all_carte_pirogue.forEach(function(item)
				{
					item.$selected = false;
				});
				vm.selected_carte_pirogue.$selected = true;

			});

			vm.ajout_carte_pirogue = function() 
			{
				vm.affichage_masque_carte_pirogue = true ;
				nouvel_carte_pirogue = true ;
				vm.carte_pirogue = {} ;
			}

			vm.modif_carte_pirogue = function() 
			{
				nouvel_carte_pirogue = false ;

                vm.carte_pirogue.immatriculation = vm.selected_carte_pirogue.immatriculation ;
                vm.carte_pirogue.an_cons = (vm.selected_carte_pirogue.an_cons) ;
                vm.carte_pirogue.longueur = Number(vm.selected_carte_pirogue.longueur) ;
                vm.carte_pirogue.largeur = Number(vm.selected_carte_pirogue.largeur) ;
                vm.carte_pirogue.c = Number(vm.selected_carte_pirogue.c) ;


                vm.carte_pirogue.coul = vm.selected_carte_pirogue.coul ;
                vm.carte_pirogue.nat = vm.selected_carte_pirogue.nat ;
                vm.carte_pirogue.prop = vm.selected_carte_pirogue.prop ;
                vm.carte_pirogue.type = vm.selected_carte_pirogue.type ;
                vm.carte_pirogue.observations = vm.selected_carte_pirogue.observations ;
                vm.carte_pirogue.etat_proprietaire = vm.convert_int_to_boll(vm.selected_carte_pirogue.etat_proprietaire) ;
                vm.carte_pirogue.proprietaire = vm.selected_carte_pirogue.proprietaire ;


                vm.affichage_masque_carte_pirogue = true ;
			}

			vm.supprimer_carte_pirogue = function () 
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

				vm.save_in_bdd_carte_pirogue(vm.selected_carte_pirogue,1);
				}, function() {
				//alert('rien');
				});
			}

			vm.annuler = function () 
			{
				nouvel_carte_pirogue = false ;
				vm.affichage_masque_carte_pirogue = false ;
				vm.selected_carte_pirogue = {} ;
			}

			vm.save_in_bdd_carte_pirogue = function(data_masque, etat_suppression)
			{
				vm.affiche_load = true ;
				var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            };

	            var id = 0 ;

	            if (!nouvel_carte_pirogue) 
	            {
	            	id = vm.selected_carte_pirogue.id ;
	            }



	            var datas = $.param(
	            {
	            	
	                id : id,      
	                supprimer : etat_suppression,
	                id_carte_pecheur : vm.selected_carte_pecheur.id,
	                immatriculation : data_masque.immatriculation,
	                an_cons : (data_masque.an_cons) ,
	                longueur : (data_masque.longueur) ,
	                largeur : (data_masque.largeur) ,
	                c : (data_masque.c) ,
	                coul : data_masque.coul ,
	                nat : data_masque.nat ,
	                prop : data_masque.prop ,
	                type : data_masque.type ,
	                observations : data_masque.observations ,
	                etat_proprietaire : vm.convert_bool_to_int(data_masque.etat_proprietaire) ,
	                proprietaire : data_masque.proprietaire 
	                
	                
	            });


	            apiFactory.add("SIP_carte_pirogue/index",datas, config).success(function (data)
        		{
        			vm.affiche_load = false ;
        			
        			if (!nouvel_carte_pirogue) 
        			{
        				if (etat_suppression == 0) //mise à jour
        				{
        				
			                vm.selected_carte_pirogue.immatriculation = data_masque.immatriculation ;
			                vm.selected_carte_pirogue.an_cons = (data_masque.an_cons) ;
			                vm.selected_carte_pirogue.longueur = (data_masque.longueur) ;
			                vm.selected_carte_pirogue.largeur = (data_masque.largeur) ;
			                vm.selected_carte_pirogue.c = (data_masque.c) ;


			                vm.selected_carte_pirogue.coul = data_masque.coul ;
			                vm.selected_carte_pirogue.nat = data_masque.nat ;
			                vm.selected_carte_pirogue.prop = data_masque.prop ;
			                vm.selected_carte_pirogue.type = data_masque.type ;
			                vm.selected_carte_pirogue.observations = data_masque.observations ;
			                vm.selected_carte_pirogue.etat_proprietaire = vm.convert_bool_to_int(data_masque.etat_proprietaire) ;
			                vm.selected_carte_pirogue.proprietaire = data_masque.proprietaire ;

        				}
        				else//Suppression
        				{
        					vm.all_carte_pirogue = vm.all_carte_pirogue.filter(function(obj)
							{
								return obj.id !== vm.selected_carte_pirogue.id;
							});

        				}

        			}
        			else
        			{
        				var item =
			            {
							id:String(data.response) ,
							id_carte_pirogue : vm.selected_carte_pirogue.id,
			                immatriculation : data_masque.immatriculation,
			                an_cons : (data_masque.an_cons) ,
			                longueur : (data_masque.longueur) ,
			                largeur : (data_masque.largeur) ,
			                c : (data_masque.c) ,
			                coul : data_masque.coul ,
			                nat : data_masque.nat ,
			                prop : data_masque.prop ,
			                type : data_masque.type ,
			                observations : data_masque.observations ,
			                etat_proprietaire : vm.convert_bool_to_int(data_masque.etat_proprietaire) ,
			                proprietaire : data_masque.proprietaire               
						}          
			            vm.all_carte_pirogue.unshift(item);
        			}

	        		vm.affichage_masque_carte_pirogue = false ; //Fermeture de la masque de saisie
	        		nouvel_carte_pirogue = false;


        		})
        		.error(function (data) {alert("Une erreur s'est produit");}); 
			}
        //FIN CARTE pirogue
    }
})();