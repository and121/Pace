$.import("CL_PACKAGE_PACE_DEV.procedures", "utility");
var utility = $.CL_PACKAGE_PACE_DEV.procedures.utility;

var strPackage = "CL_PACKAGE_PACE_DEV";
var strScheme = "CL_PACE_SCHEME_DEV";
var strPackageAffinity = "PrdAffinity";
var strSchemeAffinity = "PRD_HANA_AFFINITY";
var conn = $.hdb.getConnection();
var JSONObj;

var json = {
		fecha: "",
		JsonEnv: [],
		JsonSalidaFinal: [],
		JsonSQL: [],
		JsonAPI: [],
		Error: [],
		status: [],
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
		}

	},
	rs, flagT = true,
	obj = {
		destinoSQL: strPackageAffinity,
		destinoSQLA: strScheme,
		modo: "", //T
		idAffinity: ""
	};

///////////jsonRespuesta.Status    
var jsonRespuesta = {
	return :[],
	status: []
};
var jsonRespuestaAux = {
	return :[],
	status: []
};

function separadorPago(strMoney) {
	var parts = strMoney.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	return parts.join(".");
}

function getLegal(target, VEHICULO, VALORVEH, NUM_CUOTA, VALOR_CUOTA, VFMG, CONTADO, CAE, TOTALFINANCIAR) {
	var jsonString = [];
	var sLegal;

	try {

		var ultimoDia = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
		const date = new Date();
		var monthShortNames = ["Enero", "Febrero", "Marzo", "Abril",
        "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre",
        "Noviembre", "Diciembre"];
		// 13. Credit total cost: Valor Cuota * (Cuota) + VFMG
		// 14. Vehicle total cost: Valor Cuota * (Cuota) + VGMG + Down payment
		// 15. Total Credit Amount: Calculation Final Price – Down payment.

		let _costoCredito = (Number(NUM_CUOTA) * Number(VALOR_CUOTA)) + Number(VFMG);
		let _costoVehiculo = Number(_costoCredito) + Number(CONTADO);
		let _montoCredito = TOTALFINANCIAR;

		var mes = monthShortNames[date.getMonth()];
		var porcentaje = separadorPago((CONTADO / VALORVEH) * 100);

		/*sLegal = "" + "(*) Simulación corresponde a Credinissan plus (Opción Inteligente," +
			" operado en Chile por Tanner Servicios Financieros S.A), válido para " + " NISSAN " + VEHICULO + ". Precio con bono: $ " +
			separadorPago(VALORVEH) + ", " + NUM_CUOTA + " cuotas de $ " + separadorPago(VALOR_CUOTA) + " una cuota " + (NUM_CUOTA + 1) + " de $ " +
			separadorPago(VFMG) + " y un pie de " + porcentaje + "% ($ " + separadorPago(CONTADO) + "). CAE " + CAE + " %," +
			" costo total del Crédito $ " + separadorPago(_costoCredito) + ", costo total del Vehículo $ " + separadorPago(_costoVehiculo) +
			", monto del crédito: $ " + separadorPago(_montoCredito) + ". " +
			" Crédito sujeto a verificación de antecedentes financieros y comerciales" +
			" del Cliente. Crédito incluye gastos operacionales, impuesto al mutuo, " +
			" seguro de desgravamen y mantenciones prepagadas de 10, 20 y 30 mil kilómetros." +
			" La contratación de cualquier seguro asociado al crédito y mantención " +
			" ofrecido es de carácter voluntario. No válido para la Zona Franca." + " Precio válido hasta " + ultimoDia + " de " + mes + " del " +
			new Date().getFullYear() + ", Stock 20 unidades."; */

		sLegal = "" + "(*) Simulación corresponde a Credinissan Plus (operado en Chile por Nissan - Tanner " +
			"Financial Services  Retail SpA.), con un " + porcentaje + "% de pie, " + NUM_CUOTA + " cuotas iguales " +
			"más cuotón (cuota n°" + (NUM_CUOTA + 1) + " VFMG). Válido para NISSAN " + VEHICULO +
		//". Precio de " + "lista corresponde a $ "+ separadorPago(VALORVEH) + "
		". Precio con bono: $ " + separadorPago(VALORVEH) +
			", bono con financiamiento Credinissan (o financiamientos calificables Autofin S.A.), " +
			NUM_CUOTA + " cuotas de $ " + separadorPago(VALOR_CUOTA) + " más cuota n°" + (NUM_CUOTA + 1) +
			" de $ " + separadorPago(VFMG) + " y un pie de " + porcentaje +"% ($ " + separadorPago(CONTADO) + "). CAE " +
			CAE + " %, costo total del Crédito $ " + separadorPago(_costoCredito) + ", costo total del Vehículo $ " + separadorPago(_costoVehiculo) +
			", monto del crédito: $ " + separadorPago(_montoCredito) + ". " +
			"Crédito sujeto a verificación de antecedentes financieros y comerciales del Cliente. Crédito incluye " +
			"gastos operacionales, impuesto al mutuo, seguro de desgravamen y mantenciones prepagadas de 10, 20 y 30 " +
			"mil kilómetros. La contratación de cualquier seguro asociado al crédito y mantención " +
			"ofrecido es de carácter voluntario. No válido para la Zona Franca." + " Precio válido hasta " +
			ultimoDia + " de " + mes + " del " + new Date().getFullYear() + ", Stock 20 unidades.";

		return sLegal;

	} catch (e) {
		jsonRespuesta.status.push({
			code: 400,
			status: "Error",
			data: "No se encontraron datos de la cotización para generar Legal." + e.message
		});
		return "";
	}

}

//////////////////////////////////////////////
// Validar solicitud 
/////////////////////////////////////////////
function getExistenDatos(leadId, deposit, term, baseprice) {

	var _term = term - 1;
	jsonRespuesta.return.pop();
	var querySelect = '  ' +
		' select JSON from "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::pace.PREQUOTATION" ' +
		" WHERE TARGETSYSTEMID_REF = '" + leadId + "' " +
		" AND CONTADO_PORC = '" + deposit + "'" +
		" AND NUM_CUOTA = " + _term +
		" AND VALORVEH = " + baseprice;

	try {

		var oConnT = $.hdb.getConnection();
		var rsHana = oConnT.executeQuery(querySelect);
		if (rsHana.length > 0) {
			for (var x = 0; x < rsHana.length; x++) {

				jsonRespuesta.return.push(JSON.parse(rsHana[x].JSON));
				if (x === 0) {
					jsonRespuesta.status.push({
						code: 200,
						status: "success",
						data: "Los datos fueron generados anteriormente."
					});
				}
			}

			if (jsonRespuesta.status[0].code === 200) {
				return true;
			} else {
				return false;
			}
		} else {
			jsonRespuesta.status.push({
				code: 400,
				status: "Error",
				data: "No se encontraron datos precargados para el LeadID en consulta de Base de Datos."
			});
		}
	} catch (e) {
		jsonRespuesta.status.push({
			code: 400,
			status: "Error",
			data: "No se encontraron datos precargados para el LeadID."
		});
		return false;
	} finally {
		rsHana.close();
	}
}
//////////////////////////////////////////////
//Obtener datos de tabla PIE y TIPOCREDITO 
//////////////////////////////////////////////
function getPieTipoCredito() {
	var querySelect = ' select lt.KEY as "CUOTA", dep.KEY as "PIE" ' +
		' from "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::master.deposit"  dep, ' +
		' "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::master.loanTerm"  lt ' + ' where lt.ID_PRODUCT = dep.ID_PRODUCT ';

	var oConnT = $.hdb.getConnection();
	try {
		var rsT = oConnT.executeQuery(querySelect);

		let jsonPTC = "";

		for (var x = 0; x < rsT.length; x++) {
			jsonPTC = {
				"CUOTA": rsT[x].CUOTA - 1,
				"PIE": rsT[x].PIE
			};
			json.RespuestaPTC.push(jsonPTC);
		}

		return true;
	} catch (e) {
		jsonRespuesta.status.push({
			code: 400,
			status: "Error",
			data: "Error en la busqueda Cuotas y Tipos de Créditos."
		});
		return false;
	} finally {
		oConnT.close();
	}
}

//Grabar PRE - Cotización en Hana 
function setSavePrequotion(jsonIn, _deposit) {
	var query = "";
	var queryFull = "";
	var vFecha = new Date();
	try {

		for (var x = 0; x < jsonIn.length; x++) {
			query = 'INSERT INTO "' + strScheme + '"."' + strPackage + '.data::pace.PREQUOTATION" ' + ' VALUES (' + "'" + json.JsonAPI[0].messages.message[
				x].id + "'," /*01 TARGETSYSTEMID <NVARCHAR(36)>*/ + " NOW() ," /*02 FECHAPROCESO <SECONDDATE>*/ + jsonIn[x].IdDistribuidor + "," /*03 ID_DISTRIBUIDOR <INTEGER>*/ +
				jsonIn[x].IdSucursal + "," /*04 ID_SUCURSAL <INTEGER>*/ + "'" + jsonIn[x].IdVendedor + "'," /*05 ID_VENDEDOR <NVARCHAR(10)>*/ + "'" +
				jsonIn[x].IdUsuario + "'," /*06 ID_USUARIO <NVARCHAR(10)>*/ + "'" + jsonIn[x].UsuarioSap + "'," /*07 ID_USUARIOSAP <NVARCHAR(10)>*/ +
				"'" + jsonIn[x].IdEjecutivo + "'," /*08 ID_EJECUTIVO <NVARCHAR(10)>*/ + "'" + jsonIn[x].RutCliente + "'," /*09 RUT <NVARCHAR(20)>*/ +
				"'" + jsonIn[x].Email + "'," /*10 CORREO <NVARCHAR(50)>*/ + "'" + jsonIn[x].Nombre + "'," /*11 NOMBRE <NVARCHAR(100)>*/ + "'" + jsonIn[
					x].ApellidoPaterno + "'," /*12 APE_PATERNO <NVARCHAR(100)>*/ + "'" + jsonIn[x].ApellidoMaterno + "'," /*13 APE_MATERNO <NVARCHAR(100)>*/ +
				"'" + jsonIn[x].FechaNacimiento + "'," /*14 FECHA_NACIMIENTO <NVARCHAR(50)>*/ + "'" + jsonIn[x].NombreSolicitante + "'," /*15 NOM_SOLICITANTE <NVARCHAR(100)>*/ +
				"'" + jsonIn[x].Direccion + "'," /*16 DIRECCION <NVARCHAR(100)>*/ + "'" + jsonIn[x].Comuna + "'," /*17 COMUNA <NVARCHAR(50)>*/ + "'" +
				jsonIn[x].Ciudad + "'," /*18 CIUDAD <NVARCHAR(50)>*/ + jsonIn[x].ValorVehiculo + "," /*19 VALORVEH <INTEGER>*/ + jsonIn[x].Contado +
				"," /*20 CONTADO <INTEGER>*/ + jsonIn[x].IdFormaPago + "," /*21 ID_FORMAPAGO <INTEGER>*/ + jsonIn[x].CodigoCredito + "," /*22 ID_CREDITO <INTEGER>*/ +
				jsonIn[x].NumeroCuotas + "," /*23 NUM_CUOTA <INTEGER>*/ + jsonIn[x].MontoTotal + "," /*24 MON_TOTAL <INTEGER>*/ + "'" + jsonIn[x].SegVidaSN +
				"'," /*25 SEGURO_DEGRA <NVARCHAR(1)>*/ + jsonIn[x].DiaPago + "," /*26 DIA_PAGO <INTEGER>*/ + "'" + jsonIn[x].FechaVencimiento + "'," /*27 FECHA_VENCIMIENTO <NVARCHAR(50)>*/ +
				jsonIn[x].IdModelo + "," /*28 ID_MODELO <INTEGER>*/ + jsonIn[x].IdVersion + "," /*29 ID_VERSION <INTEGER>*/ + jsonIn[x].MontoRetoma +
				"," /*30 MONTO_RETOMA <INTEGER>*/ + "'N'," /*31 NUEVOUSADO <NVARCHAR(1)>*/ + jsonIn[x].AnoVehiculo + "," /*32 ANOFABRICACION <INTEGER>*/ +
				jsonIn[x].CantidadVehiculos + "," /*33 CANT_VEH <INTEGER>*/ + "'" + JSONObj.additionalInfo.leadId + "'," /*34 TARGETSYSTEMID_REF <NVARCHAR(36)>*/ +
				json.JsonAPI[0].messages.message[x].root.body.Resultados.VFMG + "," /*35 VFMG <INTEGER>*/ + json.JsonAPI[0].messages.message[x].root.body
				.Resultados.ValorCuota + "," /*36 VALOR_CUOTA <INTEGER>*/ + "'" + JSON.stringify(jsonRespuesta.return[x]) + "'," /*37 JSON <NVARCHAR(2000)>*/ +
				"'" + json.JsonAPI[0].messages.message[x].root.body.Resultados.Cae + "'," /*38 CAE <NVARCHAR(10)>*/ + "'" + json.RespuestaPTC[x].PIE +
				"');"; /*39 CONTADO_PORC <NVARCHAR(10)>*/
			conn.executeUpdate(query);

			conn.commit();
		}

		jsonRespuesta.status.push({
			code: 200,
			status: "Sucess",
			commet: "Se almaceno correctamente la Pre-Cotización."
		});
		return true;
	} catch (e) {
		jsonRespuesta.status.push({
			code: 400,
			status: "Error",
			commet: "Error en insertar precotización. Error: " + e.message
		});
		return false;
	} finally {
		conn.close();
	}

}
//////////////////////////////////////////////
//Obtener datos de tabla Hana Customer... 
////////////////////////////////////////////
function getCustomer(v_messageId) {
	var querySelect = ' SELECT * FROM "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::pace.CUSTOMER" ' + " WHERE MESSAGEID = ? ";

	var oConnT = $.hdb.getConnection();
	try {
		var rsT = oConnT.executeQuery(querySelect, v_messageId);

		let jsonCustomer = {
			"IDENTITYNUMBER": rsT[0].IDENTITYNUMBER,
			"FIRSTNAME": rsT[0].FIRSTNAME,
			"LASTNAME": rsT[0].LASTNAME,
			"EMAIL": rsT[0].EMAIL,
			"MOBILEPHONENUMBER": rsT[0].MOBILEPHONENUMBER,
			"PHONE": rsT[0].PHONE,
			"ID_DEALER_OFFICE": rsT[0].ID_DEALER_OFFICE,
			"COMMENTS": rsT[0].COMMENTS,
			"CONTRACTTYPE": rsT[0].CONTRACTTYPE,
			"ID_DEALER": rsT[0].ID_DEALER,
			"AGE": rsT[0].AGE,
			"CITY": rsT[0].CITY,
			"COMMUNE": rsT[0].COMMUNE,
			"STREET": rsT[0].STREET,
			"LASTNAME_F": rsT[0].LASTNAME_F,
			"LASTNAME_M": rsT[0].LASTNAME_M,
			"CIVIL_STATE": rsT[0].CIVIL_STATE,
			"BIRTH_DATE": rsT[0].BIRTH_DATE,
			"NATIONALITY": rsT[0].NATIONALITY,
			"SEX": rsT[0].SEX,
			"MESSAGEID": rsT[0].MESSAGEID
		};

		json.RespuestaCustomer.push(jsonCustomer);

		return true;
	} catch (e) {
		jsonRespuesta.status.push({
			code: 400,
			status: "Error",
			data: "Error en la busqueda de cliente. Error: No se encuentra creado el ID LeadId,"
		});
		return false;
	} finally {
		oConnT.close();
	}
}
//Respuesta al servicio HTTP

function respuestaJson(_term, _deposit, _basePrice, _nombreModelVersion) {
	let v_termValue = " meses";
	let arrRepayments = [];
	let arrRecalculatedItems = [];
	let arrRespuestaJson = [];

	let jsonRecalculatedItems = {};
	//    arrRepayments.push(jsonRecalculatedItems);
	let jsonRepayments = "";
	let jsonPace = "";
	let legal = "";
	let _pie = 0;
	for (var x = 0; x < json.JsonAPI[0].messages.message.length; x++) {
		_pie = (Number(_basePrice) * Number(_deposit)) / 100;
		jsonRepayments = "";
		jsonPace = "";

		var _cuotas = json.Respuesta[x].NumeroCuotas + 1;

		legal = getLegal(
			json.JsonAPI[0].messages.message[x].id,
			_nombreModelVersion,
			JSONObj.financeInfo.basePrice,
			json.Respuesta[x].NumeroCuotas,
			json.JsonAPI[0].messages.message[x].root.body.Resultados.ValorCuota,
			json.JsonAPI[0].messages.message[x].root.body.Resultados.VFMG,
			json.Respuesta[x].Contado,
			json.JsonAPI[0].messages.message[x].root.body.Resultados.Cae,
			json.JsonAPI[0].messages.message[x].root.body.Resultados.TotalFinanciar
		);

		jsonRepayments = [{
			"cat": json.JsonAPI[0].messages.message[x].root.body.Resultados.Cae,
			"frequency": "monthly",
			"intervalPayment": json.JsonAPI[0].messages.message[x].root.body.Resultados.ValorCuota,
			"intervalPaymentForAsset": 0,
			"intervalPaymentForOtherServices": 0,
			"totalCreditAmount": json.JsonAPI[0].messages.message[x].root.body.Resultados.TotalFinanciar,
			"balloonRepayment": json.JsonAPI[0].messages.message[x].root.body.Resultados.VFMG
			//              "recalculatedItems"                 : arrRecalculatedItems
		}];

		jsonPace = {
			//                "idPreQuotation"                    :JSONObj.additionalInfo.leadId, 
			"purchaseTotal": JSONObj.financeInfo.basePrice,
			"interestRate": json.JsonAPI[0].messages.message[x].root.body.Resultados.TasaMensual,
			"currency": "CLP",
			"deposit": json.Respuesta[x].Contado,
			"initialPayment": json.Respuesta[x].Contado,
			"openingCommission": 0,
			"openingCommissionPercentage": 0,
			"loanTerm": _cuotas,
			"termValue": _cuotas + v_termValue,
			"cashInsurance": 0,
			"repayments": jsonRepayments,
			"financeType": "retail",
			"userInputParamUsed": true,
			"disclaimer": legal
		};
		//    json.JsonSalidaFinal.push(jsonPace);

		jsonRespuesta.return.push(jsonPace);
		var _term2 = _term - 1;
		if ((_term2 == json.Respuesta[x].NumeroCuotas) && (_deposit == _pie)) {
			jsonRespuestaAux.return.push(jsonPace);
		}
	}
}
//Obtener el Calculo de Cuotas - TANNER 
function getCalcular() {
	try {
		var client = new $.net.http.Client();
		var url = "/http/Tanner/Cotizador/ObtenerCalculoCuotasMasivo";
		var dest = $.net.http.readDestination(strPackage + ".services", "ci_IntegrationSuite");
		var req = new $.net.http.Request($.net.http.POST, url);

		var aux = {
			"root": json.Respuesta
		};

		req.setBody(JSON.stringify(aux));
		client.request(req, dest);
		var response = client.getResponse();
		if (response.status !== 200) {
			jsonRespuesta.status.push({
				code: 400,
				status: "Error",
				data: "Error Servicio Calcular"
			});
		} else {
			let respuestaT = JSON.parse(response.body.asString().replace(/@/g, ''));
			json.JsonAPI.push(respuestaT);
		}
		return true;
	} catch (e) {
		jsonRespuesta.status.push({
			code: 400,
			status: "Error",
			data: "Error Servicio Calcular. Error: " + e.message
		});
		return false;
	}
}

//Calcular fecha de vencimiento
function getCalcularFechaVencimiento(xdias) {
	var day, mes, year, vFecha;
	vFecha = new Date();
	vFecha.setDate(vFecha.getDate() + 30);
	var vDay = vFecha.getDate();
	if (vDay <= xdias) {
		day = ('0' + xdias.toString()).slice(-2);
		mes = ('0' + (vFecha.getMonth() + 1)).toString().slice(-2);
		year = vFecha.getFullYear();
	} else {
		vFecha.setDate(new Date().getDate() + 60);
		mes = vFecha.getMonth();
		day = ('0' + xdias.toString()).slice(-2);
		mes = ('0' + mes).toString().slice(-2);
		year = vFecha.getFullYear();
	}
	vFecha = year + '-' + mes + '-' + day;
	return "2022-09-05";
}
//Obtener Año de Vehiculo
function getAnioVehiculo() {
	var day, mes, year, vFecha;
	vFecha = new Date();
	var vMes = vFecha.getMonth();
	if (vMes >= 9) {
		year = vFecha.getFullYear() + 1;
	} else {
		year = vFecha.getFullYear();
	}
	return year;
}
//Obtener calculo fecha de nacimiento
function getFechaNacimiento(val) {
	var dia = val.getDate();
	var mes = val.getMonth() + 1; //Cambio 28-07
	var annio = val.getFullYear();
    
    
	if (dia < 10) {
		dia = '0' + dia;
	}
	if (mes < 10) {
		mes = '0' + mes;
	}
	$.response.contentType = "application/json";
	$.response.status = 200;
	$.response.contentType = "text/plain";

	//Implementation of GET call
	function fnHandleGet() {
		return {
			"myResult": "success"
		};
	}

	//Implementation of PUT call
	function fnHandlePut() {
		return {
			"myStatus": "success"
		};
	}

	return (annio + "-" + mes + "-" + dia);
}

function inicio(JSON) {
	try {
		let vModelCode = utility.getValueMapping("MODEL", "ID_MODEL", JSONObj.vehicleInfo.modelCode, json);
		let vVersionKey = utility.getValueMapping("VERSION", "ID_VERSION", JSONObj.vehicleInfo.versionId, json);
		let error = "Error Servicio Homologación";
		if (error == vModelCode || error == vVersionKey) {
			jsonRespuesta.status.push({
				code: 400,
				status: "Error",
				data: "Error en la homologación de modelo y/o versión."
			});
		} else {
			let nombreMV;
			nombreMV = nombreMV + "-";
			let _nombreModelVersion = utility.getNombreModelVersion(vVersionKey, strPackageAffinity, nombreMV);

			if (!getExistenDatos(JSON.additionalInfo.leadId,
				JSON.financeInfo.deposit,
				JSON.financeInfo.term,
				JSON.financeInfo.basePrice)) {
				if (getCustomer(JSON.additionalInfo.leadId)) {

					if (json.RespuestaCustomer[0].AGE >= 18) {

						var seguroDegravament = "S";
						if (json.RespuestaCustomer[0].AGE >= 65) {
							seguroDegravament = "N";
						}

						let vFechaNacimiento = getFechaNacimiento(json.RespuestaCustomer[0].BIRTH_DATE);

						let jsonTanner = "";

						if (getPieTipoCredito()) {

							for (var z = 0; z < json.RespuestaPTC.length; z++) {
								var _Pie = (JSONObj.financeInfo.basePrice * json.RespuestaPTC[z].PIE) / 100;

								jsonTanner = {
									IdDistribuidor: json.RespuestaCustomer[0].ID_DEALER,
									IdVendedor: 'P002355',
									IdSucursal: json.RespuestaCustomer[0].ID_DEALER_OFFICE,
									IdUsuario: 'P002354',
									UsuarioSap: 'P001700',
									IdModelo: vModelCode,
									IdVersion: vVersionKey,
									NuevoUsado: "N",
									ValorVehiculo: JSONObj.financeInfo.basePrice,
									//            Contado:                                JSONObj.financeInfo.deposit,
									Contado: _Pie,
									AnoVehiculo: getAnioVehiculo(),
									IdFormaPago: "1",
									//            CodigoCredito:                         JSONObj.financeInfo.productCode,
									CodigoCredito: "15",
									//            NumeroCuotas:                           JSONObj.financeInfo.term,
									NumeroCuotas: json.RespuestaPTC[z].CUOTA,
									RutCliente: json.RespuestaCustomer[0].IDENTITYNUMBER, // RUT
									Nombre: json.RespuestaCustomer[0].FIRSTNAME,
									FechaNacimiento: vFechaNacimiento,
									FechaVencimiento: getCalcularFechaVencimiento(5),
									MontoRetoma: 0,
									CantidadVehiculos: "1",
									SegDesgravamenSN: seguroDegravament,
									SegVidaSN: "N",
									IdEjecutivo: 'P001700',
									NombreSolicitante: json.RespuestaCustomer[0].FIRSTNAME,
									Apellido: json.RespuestaCustomer[0].LASTNAME,
									DiaPago: '5',
									Email: json.RespuestaCustomer[0].EMAIL,
									ApellidoPaterno: json.RespuestaCustomer[0].LASTNAME_F,
									ApellidoMaterno: json.RespuestaCustomer[0].LASTNAME_M,
									MontoTotal: JSONObj.financeInfo.basePrice - _Pie,
									Direccion: json.RespuestaCustomer[0].STREET,
									Comuna: json.RespuestaCustomer[0].COMMUNE,
									Ciudad: json.RespuestaCustomer[0].CITY
								};
								json.Respuesta.push(jsonTanner);
							}

							if (getCalcular()) {
								respuestaJson(JSONObj.financeInfo.term,
									JSONObj.financeInfo.deposit,
									JSONObj.financeInfo.basePrice,
									_nombreModelVersion);
								setSavePrequotion(
									json.Respuesta,
									JSONObj.financeInfo.deposit);
							}

							jsonRespuesta = jsonRespuestaAux;
							var aux = getExistenDatos(JSON.additionalInfo.leadId,
								JSON.financeInfo.deposit,
								JSON.financeInfo.term,
								JSON.financeInfo.basePrice);

						}

					} else {
						jsonRespuesta.status.push({
							code: 400,
							status: "Error",
							data: "Es menor a 18 años, no es posible cotizar."
						});
					}
				} else {
					jsonRespuesta.status.push({
						code: 400,
						status: "Error",
						data: "Error, no se encuentra id Customer."
					});
				}
			}
		}
	} catch (e) {
		jsonRespuesta.status.push({
			code: 400,
			status: "Error",
			data: "Error en la homologación de modelo y/o versión."
		});
	}
}

/////////////////
//Inicio de Proceso
/////////////////

try {
	var JsonString = $.request.body.asString();
	var JSONObj = JSON.parse(JsonString);
    /*
	//Revisar este caso...
	var JSONObj = {
		"financeInfo": {
			"deposit": 20,
			"term": 37,
			"productCode": "15",
			"eligibilityKey": "1",
			"basePrice": 40090000
		},
		"vehicleInfo": {
			"modelCode": "29354",
			"versionId": "FDTALVZ"
		},
		"additionalInfo": {
			"leadId": "AGLil0y5Mj_waOUMaaL6pmx5HA9H"
		}
	};*/

	inicio(JSONObj);

	if (jsonRespuesta.status[0].code == 200) {
		var newJsonRspuesta = jsonRespuesta;
		if (jsonRespuesta.return.length > 0) {
			newJsonRspuesta = jsonRespuesta.return[0];
			//newJsonRspuesta.status = jsonRespuesta.status;
		} else {
			newJsonRspuesta = {
				status: jsonRespuesta.status
			};
		}
		$.response.setBody(JSON.stringify(newJsonRspuesta, null, "\t"));
		$.response.status = $.net.http.OK;
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
} catch (e) {
	json.status.push({
		code: 400,
		status: "Error",
		data: "Json de entrada con error."
	});
}