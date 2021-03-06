
// domingo es el dia 0, sabado es el dia 6.
Date.prototype.DIAS_DE_LA_SEMANA = ["Domingo", "Lunes", "Martes", "Mi\xE9rcoles", "Jueves", "Viernes", "S\xE1bado"];

// enero es el mes 0, diciembre es el mes 11
Date.prototype.MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];


Date.prototype.getMinutosDesdeMedianoche = function () {
	return this.getHours() * 60 + this.getMinutes();
};

Date.prototype.getDiaDeLaSemana = function() {
	return this.DIAS_DE_LA_SEMANA[this.getDay()];
};

Date.prototype.getNombreDelMes = function() {
	return this.MESES[this.getMonth()];
};

Date.prototype.getFechaCorta = function(){
	return this.format('dd-MM-yyyy');
};

Date.prototype.format = function(format) //author: meizz
{
  var o = {
    "M+" : this.getMonth()+1, //month
    "d+" : this.getDate(),    //day
    "h+" : this.getHours(),   //hour
    "m+" : this.getMinutes(), //minute
    "s+" : this.getSeconds(), //second
    "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
    "S" : this.getMilliseconds() //millisecond
  }

  if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
    (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)if(new RegExp("("+ k +")").test(format))
    format = format.replace(RegExp.$1,
      RegExp.$1.length==1 ? o[k] :
        ("00"+ o[k]).substr((""+ o[k]).length));
  return format;
}


Date.prototype.getFechaLarga = function() {
	return this.getDiaDeLaSemana() + ' ' + this.getDate() + ' de ' + this.getNombreDelMes().toLowerCase();
};

Date.prototype.getFechaLargaConAnio = function() {
	return this.getDiaDeLaSemana() + ' ' + this.getDate() + ' de ' + this.getNombreDelMes().toLowerCase() + ' de ' + this.getFullYear();
};

Date.prototype.esElMismoDiaQue = function(otroDate) {
	return this.getDate() == otroDate.getDate()
	&& this.getMonth() == otroDate.getMonth()
	&& this.getFullYear() == otroDate.getFullYear()
};

Date.prototype.getHoraEnString = function() {

	/* esto si son las 09:03 muestra 9:3
	if(this.getMinutes() !=0)
		return this.getHours() + ":" + this.getMinutes()
	else
		return this.getHours();
	*/

	var horaH = this.getHours();
    var minutoM = this.getMinutes();

	// Queremos ceros a la izquierda
	var horaHH = (horaH < 10) ? '0' + horaH : horaH;
	var minutoMM = (minutoM < 10) ? '0' + minutoM : minutoM
	
	return horaHH + ':' + minutoMM;
};

Date.prototype.ajustarHoraYMinutos = function(minutosDesdeMedianoche) {
	var horas = Math.floor(minutosDesdeMedianoche/60);
	var minutos = minutosDesdeMedianoche - horas*60;
	this.setHours(horas,minutos,0,0);
};

agregarMetodoAClase(Date,"stringTimestampToDate", function(stringDeTimestamp){
	return new Date(parseInt(stringDeTimestamp));
});
