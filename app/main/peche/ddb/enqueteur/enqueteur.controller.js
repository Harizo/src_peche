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
      vm.titrepage="Ajout enqueteur";
      vm.selectedItem = {} ;
      vm.allenqueteur = [] ;
      vm.alldata      = [];

      //variale affichage bouton rapport
      vm.afficherboutonrapport = 0 ;

      //variale affichage bouton nouveau
      vm.afficherboutonnouveau = 1 ;

      //variable cache masque de saisie
      vm.affichageMasque = 0 ;
      vm.affichageMasqueRapport = 0;

      vm.filtre = {} ;
      vm.now_date = new Date();
      vm.annee = vm.now_date.getFullYear();
      vm.filtre.date_fin = vm.now_date ;
      vm.annees = [] ;
      vm.datas = [] ;
      vm.affiche_load = false ;
      for (var i = 2012; i <= vm.annee; i++) {
        vm.annees.push(i);
      }
      vm.filtre.annee = vm.annee ;
      vm.mois = [
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
    vm.enqueteur_column = [
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
                supprimer:suppression,
                id:getId,      
                prenom: enqueteur.prenom,
                nom: enqueteur.nom,
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
                      vm.selectedItem.nom = vm.enqueteur.nom;
                      vm.selectedItem.prenom = vm.enqueteur.prenom;
                      vm.selectedItem.telephone = vm.enqueteur.telephone;
                      vm.afficherboutonModifSupr = 0 ;
                      vm.afficherboutonnouveau = 1 ;
                      vm.selectedItem.$selected = false;
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
                        nom: enqueteur.nom,
                        prenom: enqueteur.prenom,
                        telephone: enqueteur.telephone,
                        id:String(data.response) 
                    };
                  //console.log(enqueteur.region_nom);
                    vm.allenqueteur.push(item);
                    vm.enqueteur.prenom='';
                    vm.enqueteur.nom='';
                    vm.enqueteur.telephone='';
                    
                    NouvelItem=false;
                  }

                  vm.affichageMasque = 0 ;

                })
                .error(function (data) {
                    alert('Error');
                });
                
        }


      //selection sur la liste
      vm.selection= function (item) {
  //      vm.modifiercategorie(item);
        
          vm.selectedItem = item;
          vm.nouvelItem = item;
          currentItem = JSON.parse(JSON.stringify(vm.selectedItem));
          vm.afficherboutonModifSupr = 1 ;
          vm.affichageMasque = 0 ;
          vm.afficherboutonnouveau = 1 ;
          vm.afficherboutonrapport = 1 ;

        apiFactory.getFils("enqueteur/index",item.id).then(function(result){
        vm.alldata = result.data.response;

        console.log(vm.alldata);
      });

      };

      $scope.$watch('vm.selectedItem', function() {
        if (!vm.allenqueteur) return;
        vm.allenqueteur.forEach(function(item) {
            item.$selected = false;
        });
        vm.selectedItem.$selected = true;
      });

      //function cache masque de saisie
        vm.ajouter = function () 
        {
      vm.titrepage="Ajout enqueteur";
          vm.selectedItem.$selected = false;
          vm.affichageMasque = 1 ;
          vm.enqueteur.telephone='';
          vm.enqueteur.nom='';
          vm.enqueteur.prenom='';
          vm.enqueteur.enqueteur_id='';
          NouvelItem = true ;

        };

        vm.annuler = function() 
        {
          vm.selectedItem = {} ;
          vm.selectedItem.$selected = false;
          vm.affichageMasque = 0 ;
          vm.afficherboutonnouveau = 1 ;
          vm.afficherboutonModifSupr = 0 ;
          NouvelItem = false;

        };

        vm.modifier = function() 
        {
      vm.titrepage="Modifier enqueteur";
          NouvelItem = false ;
          vm.affichageMasque = 1 ;
          vm.enqueteur.id = vm.selectedItem.id ;
          vm.enqueteur.prenom = vm.selectedItem.prenom ;
          vm.enqueteur.telephone = vm.selectedItem.telephone ;
          vm.enqueteur.nom = vm.selectedItem.nom ;
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau = 0;  

        };

        vm.supprimer = function() 
        {
          vm.affichageMasque = 0 ;
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

        vm.masquerapport = function()
        {
          vm.affichageMasqueRapport=1;
        }

        vm.annulerrapport = function() 
        {
          vm.selectedItem = {} ;
          vm.filtre.mois ='';
          vm.filtre.unite_peche ='';
          vm.filtre.annee = vm.annee ;
          vm.selectedItem.$selected = false;
          vm.affichageMasqueRapport = 0 ;
          vm.afficherboutonnouveau = 1 ;
          vm.afficherboutonModifSupr = 0 ;
          vm.afficherboutonrapport = 0 ;          
          NouvelItem = false;

        };
        vm.creerapport = function(filtre)
        {   var repertoire="fiche_suivi/"
            var nom = vm.selectedItem.nom;
            var prenom = vm.selectedItem.prenom; 
            vm.loadingProgress= true;          
            apiFactory.getAPIgeneraliserREST("rapport_enqueteur/index","menu","raportenqueteur","id_enqueteur",vm.selectedItem.id,"nom_enqueteur",nom,"prenom_enqueteur",prenom,"annee",filtre.annee,"mois",filtre.mois,'id_unite_peche',filtre.unite_peche,'repertoire',repertoire).success(function (result)
            {
              vm.affichageMasqueRapport = 0;

              vm.data=result.response;
              console.log(vm.data);
              vm.data2=result.max;
              
              console.log(vm.data2);
                window.location = apiUrlexcel+"fiche_suivi/fiche_suivi.xlsx" ;
                vm.loadingProgress= false;
            })
            .error(function (data)
            {
                alert('Error');
            });
        }
    }

})();
