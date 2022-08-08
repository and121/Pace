///////////////////////////////////////////
// Homologacion 
///////////////////////////////////////////
function getValueMapping(Table, Column, InValue, json) {

	var querySelect = ' SELECT NEW_VALUE FROM "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::master.VALUEMAPPING" WHERE TECHNICAL_TABLE = \'' +
		Table + '\'   AND TECHNICAL_FIELD = \'' + Column + '\'   AND VALUE = \'' + InValue + '\'';
	var oConnT = $.hdb.getConnection();
	try {
		var rsT = oConnT.executeQuery(querySelect);
		if (rsT.length > 0) {
			return rsT[0].NEW_VALUE;
		} else {

			json.status.push({
				code: 400,
				status: "error",
				data: "fun:getHomologation. "
			});
			return "Error Servicio Homologación";
		}

	} catch (e) {
		json.status.push({
			code: e.code,
			status: "error",
			data: [{
				key: "fun:getConsultCustomer. " + e.message
			}]
		});
		return "Error Servicio Homologación";
	}
}

function returnBoolean(val) {
	if (val === "true" || val === "1" || val === 1 || val === 'S' || val === 's' || val === true) {
		return 'true';
	} else {
		return 'false';
	}
}

function returnSN(val) {
	if (val === "true" || val === "1" || val === 1 || val === 'S' || val === 's' || val === true) {
		return 'S';
	} else {
		return 'N';
	}
}

function checkNull(val) {
	if (val === null || val === "" || val === undefined || val === 'null' || val === 'undefined') {
		return null;
	} else {
		return val;
	}
}

function checkFullNull(val) {
	if (val === null || val === "" || val === undefined || val === 'null' || val === 'undefined' || val === 0 || val === '0') {
		return null;
	} else {
		return val;
	}
}

function nextID(val, destinoSQL) {
	try {
		var oConn = $.hdb.getConnection(),
			sql = 'select "' + destinoSQL + '.data::' + val + '".NEXTVAL AS NUM from dummy';
		var rs = oConn.executeQuery(sql);
		oConn.close();
		return rs[0].NUM.toString();
	} catch (e) {
		return null;
	}
}
/*
Buscar datos de empresa por proridad
*/
function buscarEmpresa(prio, destinoSQL) {
	let oConn = $.hdb.getConnection();
	let query = 'select ID_EMPRESA, DATA, DESCRIPCION,ADJUDICACION from "' + destinoSQL +
		'.data::maestro.empresas" WHERE PRIORIDAD = ? ORDER BY PRIORIDAD';
	let rs = oConn.executeQuery(query, prio);
	oConn.close();
	return rs;
}
/*
Tiempo de timeout para consumo de servicios externos
*/
function fTimeout(destinoSQL) {
	let oConn = $.hdb.getConnection();
	let querytime = 'select TIMEOUT from "' + destinoSQL + '.data::maestro.parametros" where TEXTO_PARAMETRO = \'TIMEOUT\'';
	let timeout = oConn.executeQuery(querytime);
	if (timeout[0].TIMEOUT === null || timeout[0].TIMEOUT === '') {
		timeout = 10;
	} else {
		timeout = parseInt(timeout[0].TIMEOUT, 10);
	}
	oConn.close();
	return timeout;
}
/*
Tiempo de prioridad para financiera en adjudicacion de documento
*/
function fRespuestaFin(destinoSQL) {
	let oConn = $.hdb.getConnection();
	let querytime = 'select TIMEOUT from "' + destinoSQL + '.data::maestro.parametros" where TEXTO_PARAMETRO = \'RESPUESTA_FINANCIERA\'';
	let timeout = oConn.executeQuery(querytime);
	if (timeout[0].TIMEOUT === null || timeout[0].TIMEOUT === '') {
		timeout = 30;
	} else {
		timeout = parseInt(timeout[0].TIMEOUT, 10);
	}
	oConn.close();
	return timeout;
}
/*
Tiempo de prioridad para financiera en adjudicacion de documento
*/
function fRespuestaFinS(destinoSQL) {
	let oConn = $.hdb.getConnection();
	let querytime = 'select TIMEOUT from "' + destinoSQL + '.data::maestro.parametros" where TEXTO_PARAMETRO = \'RESPUESTA_FINANCIERA2\'';
	let timeout = oConn.executeQuery(querytime);
	if (timeout[0].TIMEOUT === null || timeout[0].TIMEOUT === '') {
		timeout = 30;
	} else {
		timeout = parseInt(timeout[0].TIMEOUT, 10);
	}
	oConn.close();
	return timeout;
}
/*
Retorna fecha en formato 
OUT-> YYYYMMDD
IN-> DD/MM/YYYY
IN-> DD.MM.YYYY
IN-> DD-MM-YYYY
*/
function setFechaSQL(val) {
	var aux = 0;
	if (val === undefined) {
		aux = 1;
	}
	return (val.substring(6, 10) + val.substring(3, 5) + val.substring(0, 2));
}
/*
Retorna fecha en formato 
OUT-> YYYY-MM-DD
IN-> DD/MM/YYYY
IN-> DD.MM.YYYY
IN-> DD-MM-YYYY
*/
function setFechaSQLWithSeparadores(val, sep) {
	return (val.substring(6, 10) + sep + val.substring(3, 5) + sep + val.substring(0, 2));
}
/*
Retorna fecha en formato 
OUT-> DD.MM.YYYY
IN-> YYYY-MM-DD
*/
function setFechaWithSeparadores(val, sep) {
	return (val.substring(8, 10) + sep + val.substring(5, 7) + sep + val.substring(0, 4));
}

function tiempoGestion(destinoSQL) {
	let oConn = $.hdb.getConnection();
	let querytime = 'select TIMEOUT from "' + destinoSQL + '.data::maestro.parametros" where TEXTO_PARAMETRO = \'RESPUESTA_FINANCIERA\'';
	let timeout = oConn.executeQuery(querytime);
	if (timeout[0].TIMEOUT === null || timeout[0].TIMEOUT === '') {
		timeout = 10;
	} else {
		timeout = parseInt(timeout[0].TIMEOUT, 10);
	}
	oConn.close();
	return timeout;
}
/*
buscar datos de empresa por id empresa
*/
function buscarEmpresaByPrio(id, destinoSQL) {
	if (checkNull(id) !== null) {
		let oConn = $.hdb.getConnection();
		let query = 'select PRIORIDAD,ID_EMPRESA, DATA, DESCRIPCION,ADJUDICACION from "' + destinoSQL +
			'.data::maestro.empresas" WHERE ID_EMPRESA = ?';
		let rs = oConn.executeQuery(query, id);
		oConn.close();
		return rs[0];
	} else {
		return null;
	}
}
// Busca homologacion de estados entre financieras y estados financieras en affinity
//
//
function getEstadosHomologados(idEstado, idEmpresa, destinoSQL) {
	let oConn = $.hdb.getConnection();
	let query = 'select ID_ESTADO_INTERNO from "' + destinoSQL +
		'.data::maestro.homologacionEstados" WHERE ID_EMPRESA = ? AND ID_ESTADO_FINANCIERA = ?';
	let rs = oConn.executeQuery(query, idEmpresa, idEstado);
	oConn.close();
	oConn.close();
	if (rs.length > 0) {
		return rs[0].ID_ESTADO_INTERNO.toString();
	} else {
		return -1;
	}
}
//Construye Where segun campos
//
function getWhereEqual(campoIn) {
	if (campoIn.valcampo !== null) {
		switch (campoIn.operador) {
			case '=':
				if (campoIn.type === "N") {
					campoIn.where = campoIn.where + " AND " + campoIn.campo + " = " + campoIn.valcampo;
				} else if (campoIn.type === "C") {
					campoIn.where = campoIn.where + " AND " + campoIn.campo + " = " + "'" + campoIn.valcampo + "'";
				}
				break;
			case 'LIKE':
				campoIn.where = campoIn.where + " AND " + campoIn.campo + " LIKE " + campoIn.valcampo;
				break;
			case 'IS NULL':
				campoIn.where = campoIn.where + " AND " + campoIn.campo + " IS NULL ";
				break;
			case 'BT':
				if (campoIn.type === "D") {
					campoIn.where = campoIn.where + " AND " + campoIn.campo + " BETWEEN TO_SECONDDATE(\'" + campoIn.valcampo +
						"\', 'YYYY.MM.DD HH24:MI:SS') AND TO_SECONDDATE(\'" + campoIn.valcampoH + "\', 'YYYY.MM.DD HH24:MI:SS')";
				} else if (campoIn.type === "C") {
					campoIn.where = campoIn.where + " AND " + campoIn.campo + " BETWEEN \'" + campoIn.valcampo + '\' AND \'' + campoIn.valcampoH + '\'';
				} else {
					campoIn.where = campoIn.where + " AND " + campoIn.campo + " BETWEEN " + campoIn.valcampo + ' AND ' + campoIn.valcampoH;
				}
				break;
			case 'IN':
				campoIn.where = campoIn.where + " AND " + campoIn.campo + " IN (" + campoIn.valcampo + ")";
				campoIn.contador = campoIn.contador - 1;
				break;
			default:
				break;
		}
		campoIn.contador = campoIn.contador + 1;
	}
	return {
		flag: campoIn.contador,
		where: campoIn.where
	};
}
//Parsea valor para consulta SQL
//
function parse(val, type) {
	if (type === "N") {
		if (val !== "") {
			var r = parseInt(val, 10);
		} else {
			r = null;
		}
	} else if (type === "C") {
		if (val.length === 0) {
			r = null;
		} else {
			r = val;
		}
	} else if (type === "L") {
		if (val.length === 0) {
			r = null;
		} else {
			r = '\'%' + val + '%\'';
		}

	}
	return r;
}

function getNuevoBool(val, modo) {
	switch (modo) {
		case 'I':
			if (val === 'N' || val === 'n' || val === 1 || val === '1') {
				return true;
			} else {
				return false;
			}
			break;
		case 'O':
			if (val) {
				return 'N';
			} else {
				return 'U';
			}
			break;
	}

}
//Funcion obtener parametro X
//
function getParametro(parametro, destinoSQL) {

	let oConn = $.hdb.getConnection();
	let query = 'select valor from "' + destinoSQL + '.data::maestro.parametros" WHERE TEXTO_PARAMETRO = ?';
	let rsT = oConn.executeQuery(query, parametro);
	oConn.close();
	if (rsT.length > 0) {
		return rsT[0].VALOR;
	} else {
		return null;
	}

}
//Funcion Verifica valores null o undefined en un JSON
//Retorna false en caso de que un campo sea null o undefined
function checkNotNull(jsonIn, nombreCampos, jsonOut) {
	var flag = true;
	for (var i = 0; i < nombreCampos.length; i++) {
		switch (nombreCampos[i].Tipo) {
			case 1 || '1':
				if (checkFullNull(jsonIn[nombreCampos[i].Campo]) === null) {
					flag = false;
					jsonOut.push(nombreCampos[i].Nombre);
				}
				break;
			case 2 || '2':
				if (checkNull(jsonIn[nombreCampos[i].Campo]) === null) {
					flag = false;
					jsonOut.push(nombreCampos[i].Nombre);
				}
				break;
			case 3 || '3':
				if (jsonIn[nombreCampos[i].Campo] === null || jsonIn[nombreCampos[i].Campo] === undefined || jsonIn[nombreCampos[i].Campo] === 'null' ||
					jsonIn[nombreCampos[i].Campo] === 'undefined') {
					flag = false;
					jsonOut.push(nombreCampos[i].Nombre);
				}
				break;
		}
	}
	return flag;

}
//Funcion Verifica relacion Modelo/Version del vehiculo
//Retorna false en caso de que la relacion no exista
function checkModeloVersion(jsonIn, destinoSQL, modelo) {

	let oConn = $.hdb.getConnection();
	let query = 'select modelo.id_modelo,modelo.nombre_modelo,ver.id_version,ver.nombre_version,ver.activo' + ' from "' + destinoSQL +
		'.data::maestro.modelos" as modelo' + ' inner join "' + destinoSQL +
		'.data::maestro.versiones" as ver on ver.id_modelo = modelo.id_modelo' + ' where ver.id_version = ? and ver.activo = 1;';
	//        + ' where ver.id_version = ? and modelo.id_modelo = ? and ver.activo = 1;';
	let rsT = oConn.executeQuery(query, jsonIn.ID_VERSION);
	if (rsT.length > 0) {
		modelo = rsT[0];
	}
	oConn.close();
	return (rsT.length > 0 ? true : false);

}
//Funcion obtener condicion especial de sucursal
// retorna verdadero segun tipo de condicion buscado
function getSucursalCond(jsonIn, destinoSQL) {

	let oConn = $.hdb.getConnection();
	let query = 'select id_sucursal,nombre_sucursal' + ' from "' + destinoSQL + '.data::maestro.sucursales" ' +
		' where id_sucursal = ? and id_tipo = ?';
	let rsT = oConn.executeQuery(query, jsonIn.ID_SUCURSAL, jsonIn.ID_TIPO);
	oConn.close();
	return (rsT.length > 0 ? true : false);
}

function checkCampo(val, tipo) {
	var ret;
	if (val === null || val === "" || val === undefined || val === 'null' || val === 'undefined') {
		return null;
	} else {
		switch (tipo) {
			case ('N'):
				ret = parseInt(val.toString(), 10);
				// stringToNum(val);
				break;
			default:
				ret = val;
				break;
		}
		return ret;
	}
}
//
function campoMandatorio(jValor, str, json) {
	var nombreCampo, tipoCampo, mandatorio, resp;
	var strSplit = str.split(";");
	resp = true;
	nombreCampo = strSplit[0];
	tipoCampo = strSplit[1];
	mandatorio = strSplit[2];
	if (jValor === null || jValor === undefined || jValor.length === 0 || jValor === 'null' || jValor === 'undefined') {
		resp = false;
		if (mandatorio === 'M') {
			json.error.push({
				"Type": "E",
				"Code": "303",
				"Description": "El Campo " + nombreCampo + " es obligatorio"
			});

		}
	} else {
		switch (tipoCampo) {
			case 'S':
				resp = false;
				break;
			case 'C':
				//                       json.CampoCadena = jValor;
				//                       json.CampoCadena = json.CampoCadena.toUpperCase().replace(/[^\w\s]/gi, ''); 
				resp = false;
				break;
		}

	}
	return resp;
}

function querySwi(xTipo) {
	switch (xTipo) {
		case 'L':
			return 'SELECT LOCATE_REGEXPR(START \'[^a-zA-Z]\' IN ?) FROM DUMMY;';
		case 'N':
			return 'SELECT LOCATE_REGEXPR(START \'[^0-9\-\.\,\+e]\' IN ?) FROM DUMMY;';
		default:
			return '';
	}
}

function validarCampoFormato(jValor, str, json) {
	var nombreCampo, tipoCampo, mandatorio;
	var strSplit = str.split(";");
	nombreCampo = strSplit[0];
	tipoCampo = strSplit[1];
	mandatorio = strSplit[2];
	if (campoMandatorio(jValor, str, json) === false) {
		return false;
	} else {
		var query = querySwi(tipoCampo); // Arma el query
		let oConn = $.hdb.getConnection();
		let rsT = oConn.executeQuery(query, jValor);
		oConn.close();
		if (rsT[0].LOCATE_REGEXPR !== 0) {
			var pos = rsT[0].LOCATE_REGEXPR - 1;
			json.Response.push({
				"Status": "300",
				"Message": "El Campo " + nombreCampo + ", valor enviado " + jValor +
					", posee caracter invalido en la pos " + rsT[0].LOCATE_REGEXPR + " --> " + jValor[pos]
			});
			json.Status = '303';
		}
		return (rsT.length > 0 ? true : false);
	}
}

function validarEmail(oMail, json) {
	var res = false;
	var mail = oMail;
	var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
	if (emailRegex.test(mail) && mail !== "") {
		res = true;
	} else {
		json.error.push({
			"Type": "E",
			"Code": "303",
			"Description": "Formato de correo incorrecto " + oMail
		});
		json.Estado = '303';
	}
	return res;
}
//Funcion para generar rut
function generaVerificador(a) {
	if (a !== null) {
		var rut = a.toString();
		var rutRegex = /^(\d{1,2})(\d{3})(\d{3})([0-9kK]{1})$/;
		var serie = [
					2,
					3,
					4,
					5,
					6,
					7,
					2,
					3
				];
		var sum = 0;
		var i = 1;
		while (i <= rut.length) {
			sum = sum + rut.charAt(rut.length - i) * serie[i - 1];
			i++;
		}
		var dv = 11 - sum % 11;
		if (dv === 10) {
			dv = "K";
		} else if (dv === 11) {
			dv = "0";
		} else {
			dv.toString();
		}
		rut = rut + dv;
		rut = rut.replace(rutRegex, "$1$2$3-$4");
		return rut;
	}
}

function getNombreModelVersion(_Version, destinoSQL, nombre) {
	let oConn = $.hdb.getConnection();
	let query = " select concat(modelo.nombre_modelo,concat(' ',ver.nombre_version)) as nombre " + ' from "' + destinoSQL +
		'.data::maestro.modelos" as modelo ' + ' inner join "' + destinoSQL +
		'.data::maestro.versiones" as ver on ver.id_modelo = modelo.id_modelo' + ' where ver.id_version = ? and ver.activo = 1;'
	let rsT = "";
	try {
		rsT = oConn.executeQuery(query, _Version);
		if (rsT.length > 0) {
			nombre = rsT[0].NOMBRE;
			return rsT[0].NOMBRE;
		}
		oConn.close();
	} catch (e) {
		return " Error obtener nombre vehículo. Versión: " + _Version + " SQL: " + query;
	}

}

function getValueMappingV2(Table, Column, InValue, oConfig, oSalida) {
	var strHana = '"' + oConfig.strScheme + '"."' + oConfig.strPackage + '.data::master.VALUEMAPPING"',
		sQuerySelect =
		'SELECT NEW_VALUE FROM ' + strHana + ' WHERE TECHNICAL_TABLE = ? AND TECHNICAL_FIELD = ? AND VALUE = ?';
	var oConnT = $.hdb.getConnection();
	try {
		var rsT = oConnT.executeQuery(sQuerySelect, Table, Column, InValue);
		if (rsT.length > 0) {
			return rsT[0].NEW_VALUE;
		} else {
			oSalida.errors.push({
				error: true,
				title: 'No se encontraron registros getValueMappingV2()',
				sql: sQuerySelect,
				data: [Table, Column, InValue]
			});
		}
	} catch (e) {
		oSalida.errors.push({
			error: true,
			title: "Error Consulta getValueMappingV2()",
			sql: e,
			data: [Table, Column, InValue],
		});
	}
}

function getNombreModelVersionV2(_Version, destinoSQL, oSalida) {
	let oConn = $.hdb.getConnection();
	let query = " select concat(modelo.nombre_modelo,concat(' ',ver.nombre_version)) as nombre " + ' from "' + destinoSQL +
		'.data::maestro.modelos" as modelo ' + ' inner join "' + destinoSQL +
		'.data::maestro.versiones" as ver on ver.id_modelo = modelo.id_modelo' + ' where ver.id_version = ? and ver.activo = 1;'
	let rsT = "";
	try {
		rsT = oConn.executeQuery(query, _Version);
		if (rsT.length > 0) {
			return rsT[0].NOMBRE;
		} else {
			oSalida.errors.push({
				error: true,
				title: 'No se encontraron registros getNombreModelVersionV2()',
				sql: query,
				data: [_Version]
			});
		}
		oConn.close();
	} catch (e) {
		oSalida.errors.push({
			error: true,
			title: "Error Consulta getNombreModelVersionV2()",
			sql: e,
			data: [_Version]
		});
	}

}