angular.module('reservasApp').service('comunicadorEntreVistasService',function(){

    var evento = {};
    var dia = {};

    var cosasDeUnaVista = {

        setEvento: function(unEvento){
            evento = unEvento;
            console.log('Evento seteado');
        },
        getEvento: function () {
            return evento;
        },
        setDia: function(unDia){
            dia = unDia;
        },
        getDia: function(){
            return dia;
        }
    }

    return cosasDeUnaVista;
})