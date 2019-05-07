(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.enqueteur')
        .controller('EnqueteurController', EnqueteurController);

    /** @ngInject */
    function EnqueteurController($mdDialog, $scope, apiFactory, $state,apiUrlexcel)
    {
      var vm = this;
      vm.ajout = ajout ;

      var NouvelItem=false;
      var currentItem;
      var currentItemrapport;
      vm.titrepage    ="Ajout enqueteur";
      vm.selectedItem = {} ;
      vm.allenqueteur = [];
      vm.alldata      = [];
      vm.afficherboutonfiche_suivi = 0 ;
      vm.afficherboutonrapport     = 0 ;
      vm.afficherboutonnouveau     = 1 ;
      vm.selectedItemrapport       = {} ;

      //variable cache masque de saisie
      vm.affichageMasque            = 0 ;
      vm.affichageMasqueRapport     = 0;
      vm.affichageMasqueFiche_suivi = 0;


      vm.datas    = [] ;
      vm.annees   = [] ;
      vm.filtre   = {} ;
      vm.now_date = new Date();
      vm.annee    = vm.now_date.getFullYear();
      vm.rapport  = {};
      
      vm.rapport.date_fin = vm.now_date ;
      vm.loadingProgress  = false ;
      
      for (var i = 2012; i <= vm.annee; i++) {
        vm.annees.push(i);
      }
      vm.filtre.annee = vm.annee ;
      vm.mois =
      [
        {titre:"Janvier",val:'01'},{titre:"Fevrier",val:'02'},{titre:"Mars",val:'03'},
        {titre:"Avril",val:'04'},{titre:"May",val:'05'},{titre:"Juin",val:'06'},
        {titre:"Juillet",val:'07'},{titre:"Aôut",val:'08'},{titre:"Septembre",val:'09'},
        {titre:"Octobre",val:'10'},{titre:"Novembre",val:'11'},{titre:"Decembre",val:'12'
        }
      ]

      //style
    vm.dtOptions = {
      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType: 'simple',
      autoWidth: false,
      responsive: true
    };

    //col table
    vm.enqueteur_column =
    [
      {
        titre:"Nom"
      },
      {
        titre:"Prenom"
      },
       {
        titre:"Téléphone"
      }
    ];

    vm.rapport_column =
    [
      {
        titre:"Noms des Villages"
      },
      {
        titre:"Questionnaires remplis"
      },
      {
        titre:"Questionnaires validés par le superviseur"
      }
    ];

      apiFactory.getAll("enqueteur/index").then(function(result){
        vm.allenqueteur = result.data.response;
      });


       function ajout(enqueteur,suppression)   
        {
              if (NouvelItem==false) 
              {
                test_existance (enqueteur,suppression); 
              }
              else
              {
                insert_in_base(enqueteur,suppression);
              }     
            
        }

        function insert_in_base(enqueteur,suppression)
        {
           
            //add
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };

            var getId = 0;

            if (NouvelItem==false) 
            {
               getId = vm.selectedItem.id; 
            } 
            var datas = $.param(
            {
                supprimer: suppression,
                id:        getId,
                nom:       enqueteur.nom,      
                prenom:    enqueteur.prenom,
                telephone: enqueteur.telephone
                
            });
       
            //factory
            apiFactory.add("enqueteur/index",datas, config)
                .success(function (data) {

                  if (NouvelItem == false) 
                  {
                    // Update or delete: id exclu
                    
                    if(suppression==0) 
                    {
                      vm.selectedItem.nom        = vm.enqueteur.nom;
                      vm.afficherboutonModif     = 0 ;
                      vm.selectedItem.prenom     = vm.enqueteur.prenom;
                      vm.selectedItem.telephone  = vm.enqueteur.telephone;
                      vm.afficherboutonModifSupr = 0 ;
                      vm.afficherboutonnouveau   = 1 ;
                      vm.selectedItem.$selected  = false;
                      vm.selectedItem ={};
                    } 
                    else 
                    {    
                      vm.allenqueteur = vm.allenqueteur.filter(function(obj) {

                        return obj.id !== currentItem.id;
                      });
                    }
                  }
                  else
                  {
                    var item = {
                        nom:       enqueteur.nom,
                        prenom:    enqueteur.prenom,
                        telephone: enqueteur.telephone,
                        id:        String(data.response) 
                    };
                  //console.log(enqueteur.region_nom);
                    vm.allenqueteur.push(item);
                    vm.enqueteur={};
                    
                    NouvelItem=false;
                  }

                  vm.affichageMasque = 0 ;

                })
                .error(function (data) {
                    alert('Error');
                });
                
        }

        //selection sur la liste
        vm.selection= function (item)
        {         
            vm.selectedItem = item;
            vm.nouvelItem   = item;
            currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
            vm.afficherboutonModifSupr = 1 ;
            vm.afficherboutonModif     = 1 ;
            vm.affichageMasque         = 0 ;
            vm.affichageMasqueFiche_suivi = 0;
            vm.affichageMasqueRapport     = 0;
            vm.afficherboutonnouveau      = 1;
            vm.afficherboutonrapport      = 1;
            vm.afficherboutonfiche_suivi  = 1;

            apiFactory.getFils("enqueteur/index",item.id).then(function(result){
            vm.alldata = result.data.response;
            });
        };

        $scope.$watch('vm.selectedItem', function()
        {
          if (!vm.allenqueteur) return;
          vm.allenqueteur.forEach(function(item) {
              item.$selected = false;
          });
          vm.selectedItem.$selected = true;
        });

      //function cache masque de saisie
        vm.ajouter = function () 
        {
          vm.titrepage       ="Ajout enqueteur";
          vm.affichageMasque = 1 ;
          vm.enqueteur       ={};
          NouvelItem         = true ;
          vm.selectedItem.$selected    = false;
          vm.afficherboutonnouveau     = 1 ;
          vm.afficherboutonModifSupr   = 0 ;
          vm.afficherboutonModif       = 0 ;
          vm.afficherboutonfiche_suivi = 0 ;
          vm.afficherboutonrapport     = 0 ;

        };

        vm.annuler = function() 
        {
          vm.selectedItem            = {} ;
          vm.selectedItem.$selected  = false;
          vm.affichageMasque         = 0 ;
          vm.afficherboutonnouveau   = 1 ;
          vm.afficherboutonModifSupr = 0 ;
          vm.afficherboutonModif     = 0 ;
          vm.afficherboutonfiche_suivi  = 0 ;
          vm.afficherboutonrapport      = 0 ;
          NouvelItem = false;

        };

        vm.modifier = function() 
        {
          vm.titrepage           ="Modifier enqueteur";
          NouvelItem             = false ;
          vm.affichageMasque     = 1 ;
          vm.enqueteur.id        = vm.selectedItem.id ;
          vm.enqueteur.prenom    = vm.selectedItem.prenom ;
          vm.enqueteur.telephone = vm.selectedItem.telephone ;
          vm.enqueteur.nom       = vm.selectedItem.nom ;
          vm.afficherboutonModifSupr   = 0;
          vm.afficherboutonModif       = 1;
          vm.afficherboutonnouveau     = 0;
          vm.afficherboutonfiche_suivi = 0 ;
          vm.afficherboutonrapport     = 0;  
        };

        vm.supprimer = function() 
        {
          vm.affichageMasque         = 0 ;
          vm.afficherboutonModifSupr = 0 ;
          var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');

          $mdDialog.show(confirm).then(function() {

            vm.ajout(vm.selectedItem,1);
          }, function() {
            //alert('rien');
          });
        };

        function test_existance (item,suppression) 
        {           
            if (suppression!=1) 
            {
                var eq = vm.allenqueteur.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(eq[0])
                {
                   if((eq[0].nom!=item.nom)
                    ||(eq[0].prenom!=item.prenom)
                    ||(eq[0].telephone!=item.telephone))                    
                      { 
                         insert_in_base(item,suppression);
                         vm.affichageMasque = 0;
                      }
                      else
                      {  
                         vm.affichageMasque = 0;
                      }
                }
            }
            else
              insert_in_base(item,suppression);
        }

/***********Debut fiche de suivi*************/
        vm.masquefiche_suivi = function()
        {
          vm.affichageMasqueFiche_suivi =1;
          vm.afficherboutonModifSupr    = 0;
          vm.afficherboutonModif        = 0;
          vm.afficherboutonnouveau      = 0;
          vm.afficherboutonfiche_suivi  = 1 ;
          vm.afficherboutonrapport      = 0 ;
          vm.affichageMasque            = 0 ; 
        }

        vm.annulerfiche_suivi = function() 
        {
          vm.selectedItem       = {} ;
          vm.filtre.mois        ='';
          vm.filtre.unite_peche ='';
          vm.filtre.annee       = vm.annee ;
          vm.selectedItem.$selected     = false;
          vm.affichageMasqueFiche_suivi = 0 ;
          vm.afficherboutonnouveau      = 1 ;
          vm.afficherboutonModifSupr    = 0 ;
          vm.afficherboutonModif        = 0 ;
          vm.afficherboutonrapport      = 0 ;
          vm.afficherboutonfiche_suivi  = 0 ;          
          NouvelItem                    = false;

        };
        
        vm.creefiche_suivi = function(filtre)
        {   
          var repertoire="fiche_suivi/"
            var nom     = vm.selectedItem.nom;
            var prenom  = vm.selectedItem.prenom; 
            vm.loadingProgress  = true;          
            apiFactory.getAPIgeneraliserREST("rapport_enqueteur/index","menu","fichesuivienqueteur","id_enqueteur",vm.selectedItem.id,"nom_enqueteur",nom,"prenom_enqueteur",prenom,"annee",filtre.annee,"mois",filtre.mois,'id_unite_peche',filtre.unite_peche,'repertoire',repertoire).success(function (result)
            {
              vm.affichageMasqueFiche_suivi = 0;
              var nom_file=result.response;
              if(nom_file)
              {
                try
                {
                  window.location = apiUrlexcel+"fiche_suivi/fiche_suivi.xlsx" ;
                }catch(error)
                {

                }finally
                {
                  vm.loadingProgress= false;
                }
              }             
                 
            })
            .error(function (data)
            {
                alert('Error');
            });
        }

/***********Fin fiche de suivi*************/
       
        vm.masquerapport = function()
        {
          vm.affichageMasqueRapport     =1;
          vm.afficherboutonModifSupr    = 0;
          vm.afficherboutonModif        = 0;
          vm.afficherboutonnouveau      = 0;
          vm.afficherboutonfiche_suivi  = 0 ;
          vm.afficherboutonrapport      = 1 ;
          vm.affichageMasque            = 0 ;
        }

        vm.annulerrapport = function() 
        {
          vm.selectedItem               = {} ;
          vm.rapport.date_debut         ='';
          vm.selectedItem.$selected     = false;
          vm.affichageMasqueRapport     = 0 ;
          vm.afficherboutonnouveau      = 1 ;
          vm.afficherboutonModifSupr    = 0 ;
          vm.afficherboutonModif        = 0 ;
          vm.afficherboutonfiche_suivi  = 0 ;
          vm.afficherboutonrapport      = 0 ;
      // vm.nbrechantillon_unite = {};

        };
        vm.creerrapportagent = function(rapport)
        { 
            var repertoire      = "rapport_agent/";
            vm.loadingProgress  = true;
           apiFactory.getAPIgeneraliserREST("rapport_agent_enqueteur/index","menu","rapportagent","date_debut",
            convertionDate(rapport.date_debut),"date_fin",convertionDate(rapport.date_fin),"id_enqueteur",
            vm.selectedItem.id,"num_contrat",rapport.num_contrat,"repertoire",repertoire).success(function (result)
            {
              var nom_file = result.response;
              
              if(nom_file)
              {
                  try
                  {
                    window.location = apiUrlexcel+repertoire+nom_file ;
                  }catch(error)
                  {

                  }finally
                  {
                    vm.loadingProgress= false;
                  }
              }         
               vm.affichageMasqueRapport = 0; 
            })
            .error(function (data)
            {
                alert('Error');
            }); 
        }

      function convertionDate(date)
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
              var date_final= annee+"-"+mois+"-"+jour;
              return date_final
          }      
      }

      
    }

})();
