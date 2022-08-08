$.import("CL_PACKAGE_PACE_DEV.procedures", "utility");
var utility = $.CL_PACKAGE_PACE_DEV.procedures.utility;
var strPackage = "CL_PACKAGE_PACE_DEV";
var strScheme = "CL_PACE_SCHEME_DEV";
var strPackageAffinity = "PrdAffinity";
var strSchemeAffinity = "PRD_HANA_AFFINITY";
var conn = $.hdb.getConnection();

var json = {
		fecha: "",
		JsonEnv: [],
		JsonSalidaFinal: [],
		JsonSQL: [],
		JsonAPI: [],
		Error: [],
		Respuestas: [],
		Estado: "200",
		Respuesta: [],
		RespuestaJson: [],
		RespuestaFinal: [],
		RespuestaCustomer: [],
		RespuestaPTC: [],
		ResultadoSQL: [],
		Infcomple: {
			idSap: "",
			idAffinity: "",
			targetSystemId: ""
		},
		StatusError: false
	},
	rs, flagT = true,
	obj = {
		destinoSQL: strPackageAffinity,
		destinoSQLA: strScheme,
		modo: "", //T
		idAffinity: ""
	};
var jsonRespuesta = {
	status: []
};
//////////////////////////////////////////////
// Buscar datos para Legal
/////////////////////////////////////////////
function separadorPago(strMoney) {
	var parts = strMoney.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	return parts.join(".");
}

//////////////////////////////////////////////
// Validar si existe cotizacion segun parametros de entrada
/////////////////////////////////////////////
function getExistenDatos(target, cuotas, total, pie, modelo, version) {
	var contado = total * (pie / 100);
	var querySelect = ' select TARGETSYSTEMID,JSON from "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::pace.PREQUOTATION" ' +
		" WHERE TARGETSYSTEMID_REF = '" +
		target + "' AND NUM_CUOTA = " +
		cuotas + " AND VALORVEH = " +
		total + " AND CONTADO = " +
		contado;
	var oConnT = $.hdb.getConnection();
	var jsonString = [];
	try {
		var rsT = oConnT.executeQuery(querySelect);
		if (rsT.length > 0) {
			var sJson;
			for (var x = 0; x < rsT.length; x++) {
				sJson = JSON.parse(rsT[x].JSON);
				jsonRespuesta.confirmedCalculationId = rsT[x].TARGETSYSTEMID
			}
			if (rsT.length > 0) {
				jsonRespuesta.status.push({
					code: 200,
					status: "success",
					data: "Informacion recuperada completamente."
				});
				return true;
			}
		} else {
			jsonRespuesta.status.push({
				code: 400,
				status: "error",
				data: "No se encontraron datos en el sistema."
			});
			return false;
		}
	} catch (e) {
		jsonRespuesta.status.push({
			code: 400,
			status: "Error",
			data: "No se encontraron datos de la cotización."
		});
		return false;
	} finally {
		oConnT.close();
	}
}
/////////////////
//Inicio de Proceso
/////////////////
///////////////////////////////////////////
//Acceso de datos API
///////////////////////////////////////////
try {
	var JsonString = $.request.body.asString();
	var JSONObj = JSON.parse(JsonString);
	getExistenDatos(
		JSONObj.additionalInfo.leadId,
		JSONObj.financeInfo.term - 1,
		JSONObj.financeInfo.basePrice,
		JSONObj.financeInfo.deposit,
		JSONObj.vehicleInfo.modelCode,
		JSONObj.vehicleInfo.versionId);
} catch (e) {
	jsonRespuesta.status.push({
		code: 400,
		status: "Error",
		data: "Json de entrada con error."
	});
}

if (jsonRespuesta.status[0].code == 200) {
	$.response.status = $.net.http.OK;
	var newJson = {
	    confirmedCalculationId : jsonRespuesta.confirmedCalculationId
	};
	$.response.setBody(JSON.stringify(newJson, null, "\t"));
} else {
	var newJsonRespuesta = {
		success: false,
		code: 400,
		message: jsonRespuesta.status[0].data
	}; 
	$.response.status = $.net.http.BAD_REQUEST;
	$.response.setBody(JSON.stringify(newJsonRespuesta, null, "\t"));
}

$.response.contentType = "application/json; charset=UTF-8";