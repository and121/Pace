$.import("CL_PACKAGE_PACE_DEV.procedures", "guardarCotizacion");
$.import("CL_PACKAGE_PACE_DEV.procedures", "log");
$.import("CL_PACKAGE_PACE_DEV.procedures", "leerCotizacion");
$.import("CL_PACKAGE_PACE_DEV.procedures", "modificarCotizacion");
$.import("CL_PACKAGE_PACE_DEV.procedures", "utility");
$.import("CL_PACKAGE_PACE_DEV.procedures", "solicitud");
$.import("CL_PACKAGE_PACE_DEV.procedures", "grabarCliente");

let destinoSQL = "CL_PACKAGE_PACE_DEV";

var cotizacion = $.CL_PACKAGE_PACE_DEV.procedures.guardarCotizacion,
	saveLog = $.CL_PACKAGE_PACE_DEV.procedures.log,
	readCot = $.CL_PACKAGE_PACE_DEV.procedures.leerCotizacion,
	modCot = $.CL_PACKAGE_PACE_DEV.procedures.modificarCotizacion,
	utility = $.CL_PACKAGE_PACE_DEV.procedures.utility,
	ReadSol = $.CL_PACKAGE_PACE_DEV.procedures.solicitud,
	Client = $.CL_PACKAGE_PACE_DEV.procedures.grabarCliente;
/*JSONObj = {
		typeData: 2,
		targetSystemLeadId: "c6b5dce7-ccf9-4077-a419-406c2ea34615",
		Salary: 1200000,
		WorkStartDay: '2022-04-22',
		ContractType: 'J'
	},
	jdata = {
		Error: []
	},
	json = {
		error: [],
		Proccess: [],
		timeout: "",
		vdata: "",
		empresa: "",
		respuesta: "",
		respuestas: [],
		ID_AFFINITY: "",
		resultadoSQL: [],
		Status: "200",
		IdEmpresa: 0,
		JsonEnv: [],
		enviarSolicitar: [],
		JsonEnvSolicitar: []
	},
	obj = {
		destinoSQL: "QasAffinity",
		modo: "", //T
		idAffinity: ""
	},
	rs, idEmpresa = 0,
	vdes, cantEmp = 0;
	

try {
	var origen = "N"; //$.request.parameters.get("Origen");
} catch (e) {
	json.error.push({
		Code: '500',
		Description: e.message,
		Type: 'E'
	});
}
*/

function setRequest(jsonIn, jsonOut, objGen) {
	// 0.- Recibe el JSON de entrada REQUEST
	var vMessageId = jsonIn.targetSystemLeadId,
		vSalary = jsonIn.Salary,
		vWokrStartDay = jsonIn.WorkStartDay,
		vContracType = jsonIn.ContractType;
	jsonOut.JsonIn = jsonIn;
	jsonIn.fechaIngresoUltimoTrabajo = vWokrStartDay;
	// 3.- Leer tabla de precotizacion PACE por MESSAGEID. 
	var oPrequiotation = getPrequotation(vMessageId, jsonOut);

	if (oPrequiotation.length > 0) {
		var vIdentityNumber = oPrequiotation[0].RUT; // Ir a buscar identityNumber a la tabla prequotation
		// 1.- Actualizar tabla cliente PACE.UPDATE Cliente 3 campos adicionales 
		setModifyCustomerRequest(vIdentityNumber, vSalary, vWokrStartDay, vContracType, jsonOut)
		// 2.- Leer tabla de cliente PACE por MESSAGEID.
		var oCliente = getConsultCustomerRequest(vIdentityNumber);
		jsonIn = Object.assign({
			//Correo: oCliente[0].EMAIL,
			//FechaInicioLaboral: oCliente[0].WORKSTARTDAY2,
			//DependienteIndep: oCliente[0].CONTRACTTYPE,
			TipoIngreso: (jsonIn.ContractType !== 'J') ? 'DEPENDIENTE' : 'INDEPENDIENTE',
			IngresoMensual: oCliente[0].SALARY,
			Telefono: oCliente[0].PHONE,
			Observacion: oCliente[0].COMMENTS,
			UsuarioSap: oPrequiotation[0].ID_USUARIOSAP
		}, jsonIn);

		// 5.- (1,2,3) Notificar a TANNER en servicio SOLICITUD. MAPEO. CPI ... TANNER ENVIAR SOLICITUD,
		//jsonOut.CUSTOMER = oCliente;
		//jsonOut.PREQUIOTATION = oPrequiotation;
		var jsonT = {
			"Origen": 'P',
			"IdDistribuidor": oPrequiotation[0].ID_DISTRIBUIDOR.toString(),
			"IdSucursal": oPrequiotation[0].ID_SUCURSAL.toString(),
			"IdVendedor": oPrequiotation[0].ID_VENDEDOR,
			"IdUsuario": oPrequiotation[0].ID_USUARIO,
			"IdModelo": oPrequiotation[0].ID_MODELO,
			"IdVersion": oPrequiotation[0].ID_VERSION.toString(),
			"NuevoUsado": oPrequiotation[0].NUEVOUSADO,
			"ValorVehiculo": oPrequiotation[0].VALORVEH,
			"Contado": oPrequiotation[0].CONTADO,
			"AnoVehiculo": oPrequiotation[0].ANOFABRICACION,
			"IdFormaPago": oPrequiotation[0].ID_FORMAPAGO.toString(),
			"CodigoCredito": oPrequiotation[0].ID_CREDITO.toString(),
			"NumeroCuotas": oPrequiotation[0].NUM_CUOTA.toString(),
			"RutCliente": oPrequiotation[0].RUT, //.replace(/[\.\-]/g, ''), "19038929-4"
			"Email": oPrequiotation[0].CORREO,
			"ApellidoPaterno": oPrequiotation[0].APE_PATERNO,
			"ApellidoMaterno": oPrequiotation[0].APE_MATERNO,
			"Nombre": oPrequiotation[0].NOMBRE,
			"Telefono": jsonIn.Telefono.toString(),
			"MultiAnual": "N",
			"TasaMensual": "",
			"IndMensualidad": "V",
			"ValorIntAseg": "D",
			"ValorUsoEsp": "1",
			"PrcEval": "",
			"Observacion": jsonIn.Observacion,
			"GastosOperacionales": "",
			"FechaNacimiento": utility.setFechaWithSeparadores(oPrequiotation[0].FECHA_NACIMIENTO, '-'), //"02-01-1996", 1987-09-14 ->
			"FechaVencimiento": utility.setFechaWithSeparadores(oPrequiotation[0].FECHA_VENCIMIENTO, '-'), //"18-07-2022", 2022-07-05-> Formato 
			"IdCreditOrigen": 0, //NUEVO
			"IdInstitucionOrigen": 0, //NUEVO
			"CodigoSeguro": "",
			"Deducible": "",
			"MontoRetoma": "",
			"IdMantencion": "",
			"CantidadVehiculos": oPrequiotation[0].CANT_VEH.toString(),
			"FinanciaSN": "N",
			"Adicionales": "",
			SegDesgravamenSN: 'S',
			SegVidaSN: 'N',
			SegCesantiaSN: 'N',
			SegTripleSN: 'N',
			SegAsistenciaRutaSN: 'N',
			SegAsistenciaMedicaSN: 'N',
			"NumeroOperacion": 0, //Codigo Tanner
			"PagoConvenido": [],
			"IdAffinity": "",
			"CheckEmpresa": 'N',
			"Carrito": [],
			"IdEjecutivo": oPrequiotation[0].ID_EJECUTIVO,
			"IdAffinityPadre": 0,
			"Accion": 'N',
			"Porcentaje": "",
			"Lead": false,
			"Flotas": false,
			"Renovaciones": false,
			"NuevoFinanciamiento": false, //NUEVO
			"Retencion": false,
			"Portabilidad": false, //NUEVO
			"SubOrigen": "N"
		};

		Object.assign(jsonIn, jsonT);
		//Object.assign(JSONObj, jsonT);
		//if (validarEmpresa(jsonOut, obj)) {
		jsonOut.IdEmpresa = 0; //idEmpresa;
		jsonOut.empresa = 0;
		jsonOut.JsonEnv = [];
		if (Client.grabCliente(jsonIn, jsonOut)) { // Grabo Datos identificacion y Telefono
			guardarTanner(jsonT, jsonIn, jsonOut, objGen);
			guardarAffinity(jsonIn, jsonOut, objGen);
			enviarSolicitar(jsonIn, jsonOut, objGen);
			
			if (jsonOut.Error.length === 0) {
				jsonOut = {
					Return: {},
					Status: {
						Code: 202,
						Status: "Successful",
						Comment: "Send quotation request to evaluation entity finance TANNER"
					}
				};
			}
		}
		//}
	}
}

function guardarTanner(jsonT, jsonIn, jsonOut, objGen) {
	try {
		if (utility.checkFullNull(jsonIn.IdAffinity) === null) {
			jsonOut.ID_AFFINITY = utility.nextID("idAffinity", objGen.destinoSQL);
			jsonT.IdAffinity = jsonOut.ID_AFFINITY;
		} else if (utility.checkFullNull(jsonIn.NumeroOperacion) === null && utility.checkFullNull(jsonIn.IdAffinityPadre) === null && jsonIn.Accion ===
			'N') {
			jsonOut.ID_AFFINITY = utility.nextID("idAffinity", objGen.destinoSQL);
			jsonT.IdAffinity = jsonOut.ID_AFFINITY;
		}
		jsonOut.JsonEnv.push(jsonT);
		var client = new $.net.http.Client();
		var url = "/http/Tanner/Cotizador/EnviarCotizacion"; // Grabar 
		var dest = $.net.http.readDestination("CL_PACKAGE_PACE_DEV.procedures", "CPI");
		var req = new $.net.http.Request($.net.http.POST, url);
		req.setBody(JSON.stringify(jsonT));
		client.request(req, dest);
		var response = client.getResponse();
		jsonOut.respuesta = JSON.parse(response.body.asString().replace(/[\r\n]/g, ''));
		jsonOut.respuestas.push(JSON.parse(response.body.asString().replace(/[\r\n]/g, '')));
		var sapId = '';
		for (let i = 0; i < response.headers.length; i++) {
			if (response.headers[i].name === 'sap_messageprocessinglogid') {
				sapId = response.headers[i].value;
			}
		}
		if ((jsonOut.respuesta.return.code !== "200" && jsonOut.respuesta.return.code !== 200) || jsonOut.respuesta.return === undefined) {
			jsonOut.Status = 500;
			if (jsonOut.respuesta.return.code === "500" || jsonOut.respuesta.return.code === 500) {
				let msg = [{
					Description: jsonOut.respuesta.return.originalError.errorBody,
					Code: jsonOut.respuesta.return.originalError.statusCode,
					Type: 'E'
				}];
				saveLog.grabarLog(msg, {
					tipo: "Normal",
					origen: "TANNER",
					aplicacion: "Guardar",
					funcion: "Guardar Tanner",
					cpiID: sapId
				}, jsonOut, objGen);
			}
		}
	} catch (e) {
		jsonOut.respuesta = {
			"return": {
				"code": "400",
				"message": [
					{
						"Type": "E",
						"Code": "500",
						"Description": response.body.asString()
				}
			]
			},
			"body": null
		};
		let msg = [];
		try {
			msg.push({
				Description: response.body.asString().replace(/[\r\n]/g, ''),
				Code: response.status,
				Type: 'E'
			});
		} catch (e1) {

		}
		msg.push({
			Description: e.message,
			Code: 500,
			Type: 'E'
		});
		saveLog.grabarLog(msg, {
			tipo: "Catch",
			origen: "Tanner",
			aplicacion: "Guardar",
			funcion: "Guardar Tanner",
			cpiID: sapId
		}, jsonOut, objGen);
		jsonOut.error.push({
			empresa: jsonOut.empresa,
			Status: "500",
			message: e.message,
			cuerpo: response.body.asString()
		});
		jsonOut.Status = 500;
	}
}

function guardarAffinity(jsonIn, jsonOut, objGen) {
	if (jsonOut.Status !== 500) // Si No hay error a Grabar a Tanner guardo en Affinity
	{
		cotizacion.guardarHistoricoCotizacion(jsonIn, jsonOut, objGen); //Umbrales
		if (utility.checkFullNull(jsonIn.IdAffinity) === null) {
			cotizacion.guardarCotizacion(jsonIn, jsonOut, objGen);
		}
		try {
			let ref = [];
			ref.push({
				ID_COT_FINANCIERA: jsonOut.respuesta.body.Resultados[0].NumeroOperacion,
				ID_EMPRESA: jsonOut.IdEmpresa
			});
			cotizacion.guardarReferencias(ref, jsonOut, objGen);

			let calculoCreditos = [];
			calculoCreditos.push({
				GASTOSOPERACIONALES: jsonOut.respuesta.body.Resultados[0].GastosOperacionales,
				TOTALFINANCIAR: jsonOut.respuesta.body.Resultados[0].TotalFinanciar,
				VALORCUOTA: jsonOut.respuesta.body.Resultados[0].ValorCuota,
				VFMG: jsonOut.respuesta.body.Resultados[0].VFMG,
				PREEVAL: jsonOut.respuesta.body.Resultados[0].PreEval,
				PRCEVAL: null,
				VALORUF: jsonOut.respuesta.body.Resultados[0].Uf,
				VALORCAE: jsonOut.respuesta.body.Resultados[0].Cae,
				VALORIMPUESTO: jsonOut.respuesta.body.Resultados[0].ValorImpuesto,
				TASAMENSUAL: jsonOut.respuesta.body.Resultados[0].TasaMensual,
				VALORSEGDESGRAVAMEN: jsonOut.respuesta.body.Resultados[0].ValorSegDesgravamen,
				VALORSEGVIDA: jsonOut.respuesta.body.Resultados[0].ValorSegVida,
				VALORSEGCESANTIA: jsonOut.respuesta.body.Resultados[0].ValorSegCesantia,
				VALORSEGTRIPLE: jsonOut.respuesta.body.Resultados[0].ValorSegTriple,
				VALORSEGASISTENCIARUTA: jsonOut.respuesta.body.Resultados[0].ValorSegAsistenciaRuta,
				VALOR_BRUTO_SEGDESGRAVAMEN: jsonOut.respuesta.body.Resultados[0].ValorBrutoSegDesgravamen,
				VALOR_BRUTO_SEGVIDA: jsonOut.respuesta.body.Resultados[0].ValorBrutoSegVida,
				VALOR_BRUTO_SEGCESANTIA: jsonOut.respuesta.body.Resultados[0].ValorBrutoSegCesantia,
				VALOR_BRUTO_SEGTRIPLE: jsonOut.respuesta.body.Resultados[0].ValorBrutoSegTriple,
				VALOR_BRUTO_SEGASISTENCIARUTA: jsonOut.respuesta.body.Resultados[0].ValorBrutoSegAsistenciaRuta,
				VALOR_BRUTO_SEGASISTENCIAMEDICA: jsonOut.respuesta.body.Resultados[0].ValorBrutoSegAsistenciaMedica,
				VALOR_SEGASISTENCIAMEDICA: jsonOut.respuesta.body.Resultados[0].ValorSegAsistenciaMedica
			});
			cotizacion.guardarCalculoCreditos(calculoCreditos, jsonOut, objGen);
			let seguros = [];
			if (utility.checkNull(jsonIn.CodigoSeguro) !== null) {
				seguros.push({
					NOMBRESEG: jsonIn.NOMBRESEG,
					SEGURO: jsonIn.CodigoSeguro,
					DEDUCIBLE: jsonIn.DEDUCIBLE,
					PRIMA: jsonIn.PRIMA,
					PLAZO: jsonIn.PLAZO,
					MULTIANUAL: jsonIn.MULTIANUAL,
					VALOR_TOTAL_SEGURO: jsonOut.respuesta.body.Resultados[0].ValorTotalSegMultiAnual,
					VALOR_CUOTA_SEGURO: jsonOut.respuesta.body.Resultados[0].ValorCuotaSegMultiAnual
				});
				cotizacion.guardarSeguros(seguros, jsonOut, objGen);
			}
			let cuotas = [];
			for (let i = 0; i < jsonOut.respuesta.body.Resultados[0].Cuotas.length; i++) {
				cuotas.push({
					BLOQUEADOSN: jsonOut.respuesta.body.Resultados[0].Cuotas[i].BloqueadoSN,
					FECHA: jsonOut.respuesta.body.Resultados[0].Cuotas[i].FechaPago,
					CUOTONSN: (i < parseInt(jsonIn.NumeroCuotas, 10) ? false : true), //false,
					MODIFICADOSN: setPagoConvenido(jsonIn.PagoConvenido, jsonOut.respuesta.body.Resultados[0].Cuotas[i].NumeroCuota), //jsonOut.respuesta.body.Resultados[0].Cuotas[i].ModificadoSN,
					MONTO: jsonOut.respuesta.body.Resultados[0].Cuotas[i].Monto,
					MONTOTOTAL: jsonOut.respuesta.body.Resultados[0].Cuotas[i].Montototal,
					CUOTA: jsonOut.respuesta.body.Resultados[0].Cuotas[i].NumeroCuota,
					AMORTIZACION: jsonOut.respuesta.body.Resultados[0].Cuotas[i].Amortizacion,
					MONTOINTERES: jsonOut.respuesta.body.Resultados[0].Cuotas[i].MontoInteres,
					MONTO_SALDO_CAPITAL: jsonOut.respuesta.body.Resultados[0].Cuotas[i].MontoSaldoCapital,
					MONTO_CUOTA_SEGURO: jsonOut.respuesta.body.Resultados[0].Cuotas[i].MontoCuotaSeguro
				});
			} //
			cotizacion.guardarCuotas(cuotas, jsonOut, objGen);
			let carro = [];
			for (let i = 0; i < jsonIn.Carrito.length; i++) {
				carro.push({
					ID_ELEMENTO: jsonIn.Carrito[i].IdElemento,
					NOMBRE_ELEMENTO: jsonIn.Carrito[i].Elemento,
					NOMBRE_SUB_ELEMENTO: jsonIn.Carrito[i].SubElemento,
					VALOR_UNITARIO: jsonIn.Carrito[i].ValorUnitario,
					MODIFICADO: jsonIn.Carrito[i].Editable,
					ID_TRANSACCION_MESOS: jsonIn.Carrito[i].IdTransaccionMesos
				});
			}
			cotizacion.guardarCarroCompra(carro, jsonOut, objGen);
			let historialEstado = [];
			if (jsonIn.Accion !== 'MA') {
				historialEstado.push({
					ID_AFFINITY: jsonOut.ID_AFFINITY,
					ID_ESTADO: 1007,
					ID_EMPRESA: 0,
					OBSERVACION: "",
					MOTIVO: [],
					EJECUTIVO: {}
				});

				historialEstado.push({
					ID_AFFINITY: jsonOut.ID_AFFINITY,
					ID_ESTADO: 3,
					ID_EMPRESA: jsonOut.IdEmpresa,
					OBSERVACION: "",
					MOTIVO: [],
					EJECUTIVO: {}
				});
			}
			cotizacion.guardarHistorialEstados(historialEstado, jsonOut, objGen);
			cotizacion.guardarCotizacionEstado(historialEstado, jsonOut, objGen);
		} catch (e) {
			jsonOut.error.push({
				empresa: e.type,
				Status: "500",
				message: e.message,
				In: jsonIn
			});
		}
	}
}

function enviarSolicitar(jsonIn, jsonOut, objGen) {
	if (jsonOut.Status !== 500) {
		var jdata = mapeo(jsonOut);
		if (funCliente()) {
			var dat = ReadSol.leerDatos(objGen, jdata);
			var Resp = {
				NumeroOperacion: readCot.leerIdExternoCot(jsonOut.ID_AFFINITY, 0, objGen.destinoSQL), //cot.toString(),
				Observacion: 'PACE',
				IdUsuario: jdata.ID_EJECUTIVO,
				Solicitud: dat.msg,
				ArchivoCarpetaTributaria: null,
				TipoEvaluacion: 0
			};
			var fecha = obtenerFecha();
			bloquear(fecha, jsonOut.ID_AFFINITY, jsonOut, objGen); //fecha del momento
			grabarSolicitud(Resp, jsonOut, objGen, jdata);
		}
	}
}

function mapeo(JSONObj) {
	var jdata = {};
	jdata.RUT = JSONObj.RutCliente;
	jdata.RUT = jdata.RUT.replace(/[\.\-]/g, '');
	jdata.APE_PATERNO = JSONObj.ApellidoPaterno;
	jdata.APE_MATERNO = JSONObj.ApellidoMaterno;
	jdata.NOMBRE = JSONObj.Nombre;
	jdata.FECHA_NACIMIENTO = utility.setFechaSQL(JSONObj.FechaNacimiento);
	jdata.CORREO = JSONObj.Email.trim();
	jdata.FECHALABORAL = JSONObj.fechaIngresoUltimoTrabajo.substring(0, 4) + JSONObj.fechaIngresoUltimoTrabajo.substring(5, 7) + JSONObj.fechaIngresoUltimoTrabajo
		.substring(8, 10); //utility.setFechaSQL(JSONObj.fechaIngresoUltimoTrabajo);
	jdata.TELEFONO = JSONObj.Telefono;
	jdata.ID_EJECUTIVO = JSONObj.IdEjecutivo;
	if (utility.checkCampo(JSONObj.DIRECCION, 'C') === null) {
		jdata.DIRECCION = 'nn';
	} else {
		jdata.DIRECCION = JSONObj.DIRECCION;
	}
	jdata.COMUNA = JSONObj.COMUNA;
	jdata.CIUDAD = JSONObj.CIUDAD;

	jdata.IDOTROINGRESOS = JSONObj.IngresoMensual;
	jdata.INGRESO = JSONObj.IngresoMensual;
	return jdata;
}

function funCliente() {
	let rep = false;
	ReadSol.deleteIngresosLiquido(jdata, obj, json);
	ReadSol.deleteOtros(jdata, obj, json);
	switch (JSONObj.TipoIngreso) {
		case "DEPENDIENTE":
			// Ingresos Liquidos 
			jdata.IDOTROINGRESOSLIQ = utility.nextID("idIngresoLiq", obj.destinoSQL);
			jdata.DESCRIPCIONDEPEN = "DEPENDIENTE";
			rep = ReadSol.crearIngresosLiquido(jdata, obj, json);
			break;
		case "INDEPENDIENTE":
			// Otros Ingresos
			jdata.IDOTROINGRESOS = utility.nextID("idIngresoOtro", obj.destinoSQL);
			jdata.DESCRIPCIONDEPEN = "INDEPENDIENTE";
			rep = ReadSol.crearOtros(jdata, obj, json);
			break;
	}
	return rep;
}

function obtenerFecha() {
	let oConn = $.hdb.getConnection();
	let query = 'SELECT  UTCTOLOCAL( CURRENT_UTCTIMESTAMP,\'UTC-3\' ) as local,CURRENT_UTCTIMESTAMP,CURRENT_TIMESTAMP FROM dummy';
	let fecha = new Date(oConn.executeQuery(query)[0].LOCAL);
	oConn.close();
	return fecha;
}

function bloquear(fechaIn, XID_AFFINITY, json, obj) {
	var oConn = $.hdb.getConnection();
	var query;
	try {
		query = 'UPDATE "' + obj.destinoSQL + '.data::cotizaciones.cotizacion" SET FECHASOLICITADA = ? WHERE ID_AFFINITY = ?';
		oConn.executeUpdate(query, fechaIn, XID_AFFINITY);
		oConn.commit();
	} catch (e) {
		json.error.push({
			message: e.message,
			name: e.name,
			Query: query
		});
	}
	oConn.close();
}

function grabarSolicitud(Resp, jsonOut, objGen, jdata) {
	try {
		var client = new $.net.http.Client();
		var dest = $.net.http.readDestination("CL_PACKAGE_PACE_DEV.procedures", "CPI");
		var req = new $.net.http.Request($.net.http.PUT, "/http/Tanner/Cotizador/EnviarSolicitud");
		req.setBody(JSON.stringify(Resp, null, "\t"));
		jsonOut.JsonEnvSolicitar.push(Resp);
		client.request(req, dest);
		var respuesta = client.getResponse();
		var val = JSON.parse(respuesta.body.asString().replace(/[\r\n]/g, ''));
		jsonOut.respuesta = val;
		jsonOut.enviarSolicitar = [];
		jsonOut.enviarSolicitar.push(val);
		var sapId = '';
		for (let i = 0; i < respuesta.headers.length; i++) {
			if (respuesta.headers[i].name === 'sap_messageprocessinglogid') {
				sapId = respuesta.headers[i].value;
			}
		}
		saveLog.grabarLog([{
				Description: respuesta.body.asString(),
				Code: 300,
				Type: 'W'
			}], {
				tipo: "Normal",
				origen: "PACE",
				aplicacion: "solicitar online",
				funcion: "solicitar tanner",
				cpiID: sapId
			},
			jsonOut, objGen);
		if (val.return.code === "200" || val.return.code === 200 || val.return.code === "500" || val.return.code === 500) {
			setBloqueo(jsonOut, objGen);
			let ref = [];
			ref.push({
				ID_COT_FINANCIERA: 0,
				ID_EMPRESA: 4
			});
			cotizacion.guardarReferencias(ref, jsonOut, objGen);

			let historialEstado = [];
			historialEstado.push({
				ID_AFFINITY: jsonOut.ID_AFFINITY,
				ID_ESTADO: 1000,
				ID_EMPRESA: 0,
				OBSERVACION: null,
				MOTIVO: [],
				EJECUTIVO: {
					NOMBRE: jdata.ID_EJECUTIVO,
					RUT: "",
					CORREO: ""
				}
			});
			cotizacion.guardarHistorialEstados(historialEstado, jsonOut, objGen);
			let edoAff = [];
			edoAff.push({
				ID_AFFINITY: jsonOut.ID_AFFINITY,
				ESTADOAFFI: 'PENDIENTE',
				ID_ESTADO: 1000
			});
			modCot.actualizarCotizacionEstado(edoAff, jsonOut, objGen);
			jsonOut.solicitudCreada = true;
		} else {
			var mensaje = val.return.code + ' ' + val.return.message[0].Description;
			jsonOut.Error.push('Error al Grabar Solicitud -- Servicio Ejecutado --> "EnviarSolicitud " Estaus --> ' + mensaje);
			//bloquear(null);
		}
	} catch (e) {
		jsonOut.Error.push({
			Code: '500',
			Description: e.message,
			Type: 'E'
		});
		try {
			saveLog.grabarLog([{
						Description: respuesta.body.asString(),
						Code: 500,
						Type: 'E'
					},
					{
						Description: e.message,
						Code: 500,
						Type: 'E'
					}], {
					tipo: "Catch",
					origen: "TANNER",
					aplicacion: "solicitar online",
					funcion: "solicitar tanner",
					cpiID: sapId
				},
				jsonOut, objGen);
		} catch (w) {
			saveLog.grabarLog([{
					Description: e.message,
					Code: 500,
					Type: 'E'
				}], {
					tipo: "Catch",
					origen: "TANNER",
					aplicacion: "solicitar online",
					funcion: "solicitar tanner",
					cpiID: sapId
				},
				jsonOut, objGen);
			jsonOut.Error.push({
				Code: '500',
				Description: w.message,
				Type: 'E'
			});
		}
		jsonOut.respuesta = {
			"return": {
				"code": "200",
				"message": [
					{
						"Type": "S",
						"Code": "300",
						"Description": "Grabar Solicitud --- Se ha enviado a solicitar cotizacion"
				}
			]
			}
		};
		setBloqueo(jsonOut, objGen);
		let ref = [];
		ref.push({
			ID_COT_FINANCIERA: 0,
			ID_EMPRESA: 4
		});
		cotizacion.guardarReferencias(ref, jsonOut, objGen);

		let historialEstado = [];
		historialEstado.push({
			ID_AFFINITY: jsonOut.ID_AFFINITY,
			ID_ESTADO: 1000,
			ID_EMPRESA: 0,
			OBSERVACION: null,
			MOTIVO: [],
			EJECUTIVO: {
				NOMBRE: jdata.ID_EJECUTIVO,
				RUT: "",
				CORREO: ""
			}
		});
		cotizacion.guardarHistorialEstados(historialEstado, jsonOut, objGen);
		let edoAff = [];
		edoAff.push({
			ID_AFFINITY: jsonOut.ID_AFFINITY,
			ESTADOAFFI: 'PENDIENTE',
			ID_ESTADO: 1000
		});
		modCot.actualizarCotizacionEstado(edoAff, jsonOut, objGen);
		jsonOut.Error.push({
			"Type": "W",
			"Code": "500",
			"Description": 'Grabar Solicitud ' + e.message
		});
	}
}

function setBloqueo(jsonOut, obj) {
	var oConnT = $.hdb.getConnection();
	var query;
	try {
		query = 'INSERT INTO "' + obj.destinoSQL + '.data::clientes.bloqueo" values(?,?,?)';
		oConnT.executeUpdate(query, jsonOut.ID_AFFINITY, 'S', 'N');
		oConnT.commit();
	} catch (e) {
		jsonOut.Error.push({
			message: e.message,
			name: e.name,
			Query: query
		});
	}
	oConnT.close();
}

function setPagoConvenido(PagoConvenido, idCuotaIn) {
	for (var i = 0; i < PagoConvenido.length; i++) {
		if (parseInt(PagoConvenido[i].NumeroCuota, 10) === parseInt(idCuotaIn, 10)) {
			return true;
		}
	}
	return false;
}

function validarEmpresa(json, obj) {
	var flag = false;
	var rs = utility.buscarEmpresa('1', obj.destinoSQL); // Empresa Financiera 1 ---> Tanner 
	if (rs.length > 0) {
		flag = true;
		json.timeout = utility.fTimeout(obj.destinoSQL);
		idEmpresa = rs[0].ID_EMPRESA;
		json.empresa = rs[0].DESCRIPCION.toLowerCase();
		json.vdata = rs[0].DATA;
	} else {
		json.Error.push({
			empresa: "",
			Status: "500",
			message: "Tabla empresa sin datos"
		});
	}
	return flag;
}

function isJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

function setModifyCustomerRequest(vIdentityNumber, vSalary, vWokrStartDay, vContracType, jsonOut) {
	let conn = $.hdb.getConnection();
	var queryUpdate = ' UPDATE "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::pace.CUSTOMER" ' + " SET " + "	SALARY = '" + vSalary + "'," +
		"	WORKSTARTDAY = '" + vWokrStartDay + "'," + "	CONTRACTTYPE = '" + vContracType + "'" + " WHERE IDENTITYNUMBER = '" + vIdentityNumber +
		"' ";
	try {
		conn.executeUpdate(queryUpdate);
		conn.commit();
		jsonOut.Proccess.push({
			code: 200,
			status: "success",
			data: "fun:setModifyCustomerRequest. Cliente actualizado correctamente. "
		});
	} catch (e) {
		jsonOut.Error.push({
			code: e.code,
			status: "error",
			data: "fun:setModifyCustomerRequest. " + e.message
		});
	}
}

function getConsultCustomerRequest(vIdentityNumber) {
	var querySelect =
		' SELECT *, TO_VARCHAR (WORKSTARTDAY, \'DD-MM-YYYY\') AS WORKSTARTDAY2 FROM "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::pace.CUSTOMER" WHERE IDENTITYNUMBER = ?';
	var oConnT = $.hdb.getConnection();
	var rsT = oConnT.executeQuery(querySelect, vIdentityNumber);
	return rsT;
}

function getPrequotation(vMessageId, jsonOut) {
	var rsT = "";
	let oConn = $.hdb.getConnection();
	let query = 'SELECT * FROM "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::pace.PREQUOTATION" WHERE TARGETSYSTEMID = ? ';
	try {
		rsT = oConn.executeQuery(query, vMessageId);
		if (rsT.length === 0) {
			jsonOut.Error.push({
				Code: '300',
				Description: 'Id PreCotilización no existe ',
				data: "fun:getPrequotation.",
				Type: 'M'
			});
		}
	} catch (e) {
		jsonOut.Error.push({
			Type: 'E',
			Code: "500",
			data: "fun:getPrequotation." + e.message
		});
	}
	oConn.close();
	return rsT;
}