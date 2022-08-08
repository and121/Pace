$.import("CL_PACKAGE_PACE_DEV.procedures", "utility");
var utility = $.CL_PACKAGE_PACE_DEV.procedures.utility;

function grabCliente(JSONObj, jsonOut) {
	var flag = true,
		response = {
			code: 0
		};
	var oConnection = $.hdb.getConnection();
	var rut = JSONObj.RutCliente;
	rut = rut.replace("-", "");
	var nombre = JSONObj.Nombre;
	var apaterno = JSONObj.ApellidoPaterno;
	var amaterno = JSONObj.ApellidoMaterno;
	var mail = JSONObj.Email;
	var nac = JSONObj.FechaNacimiento;
	var empresa = utility.checkNull(JSONObj.CheckEmpresa === null ? null : JSONObj.CheckEmpresa.toUpperCase());
	var fechaInicioActividad = JSONObj.fechaIngresoUltimoTrabajo.substring(0, 4) + JSONObj.fechaIngresoUltimoTrabajo.substring(5, 7) + JSONObj
		.fechaIngresoUltimoTrabajo
		.substring(8, 10);
	//utility.setFechaSQL(JSONObj.fechaIngresoUltimoTrabajo)
	if (nac !== "") {
		/*var pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
		var dt = new Date(nac.replace(pattern, '$3-$2-$1'));
		nac = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();*/
		nac = utility.setFechaSQLWithSeparadores(JSONObj.FechaNacimiento, "-");
	}

	var query = 'SELECT RUT FROM "QasAffinity.data::clientes.identificacion" WHERE RUT=?';
	var rs = oConnection.executeQuery(query, rut);
	for (let i = 0; i < rs.length; i++) {
		flag = false;
		try {
			query = 'UPDATE "QasAffinity.data::clientes.identificacion" SET' +
				' NOMBRE = ?, APATERNO = ?, AMATERNO = ?, MAIL = ?, FECHANAC = ?, CHECKEMPRESA = ?,FECHA_INICIO_ACTIVIDAD = ?  WHERE RUT = ?';
			oConnection.executeUpdate(query, nombre, apaterno, amaterno, mail, nac, empresa, fechaInicioActividad, rut.toString().toUpperCase());
			oConnection.commit();
			response = {
				code: 200,
				message: 'Cliente guardado en affinity'
			};
		} catch (e) {
			response = {
				code: 409,
				message: 'Error: ' + e.message
			};
		} finally {
			oConnection.close();
		}

	}
	if (flag) {
		query = 'INSERT INTO "QasAffinity.data::clientes.identificacion"' +
			' (RUT,NOMBRE,APATERNO,AMATERNO,MAIL,FECHANAC,CHECKEMPRESA,FECHA_INICIO_ACTIVIDAD)' + ' VALUES(?,?,?,?,?,?,?,?)';
		try {
			oConnection.executeUpdate(query, rut.toString().toUpperCase(), nombre, apaterno, amaterno, mail, nac, empresa, fechaInicioActividad);
			oConnection.commit();
			response = {
				code: 200,
				message: 'Cliente guardado en affinity'
			};
		} catch (e) {
			response = {
				code: 409,
				message: 'Error: ' + e.message
			};
		}
	}
	jsonOut.Proccess.push(response);
	if (response.code === 200) {
		return true;
	} else {
		return false;
	}
}
//
//
function actualizarFechaNac(rut, fechaNac, jsonGen) {
	let arry = [],
		tQuery = 'UPDATE "' + jsonGen.destinoSQL + '.data::clientes.identificacion" SET FECHANAC = ? WHERE RUT = ?',
		conn = $.hdb.getConnection();
	if (utility.checkNull(fechaNac) !== null) {
		try {
			arry.push([utility.setFechaSQL(fechaNac), rut.toString().toUpperCase().replace("-", "")]);
			conn.executeUpdate(tQuery, arry);
			conn.commit();
			return true;
		} catch (e) {
			return false;
		}
	}
	return false;
}
//Funcion actualizar nombres y apellidos de cliente
//
function actualziarNomApell(cliente, jsonGen) {
	let arry = [],
		tQuery = 'UPDATE "' + jsonGen.destinoSQL + '.data::clientes.identificacion" SET NOMBRE = ?,APATERNO = ?, AMATERNO = ?' + ' WHERE RUT = ?',
		conn = $.hdb.getConnection();
	if (utility.checkFullNull(cliente.Nombre) !== null && utility.checkFullNull(cliente.ApellidoMaterno) !== null && utility.checkFullNull(
		cliente.ApellidoPaterno) !== null) {
		try {
			arry.push([cliente.Nombre, cliente.ApellidoPaterno, cliente.ApellidoMaterno, cliente.rut.toString().toUpperCase().replace("-", "")]);
			conn.executeUpdate(tQuery, arry);
			conn.commit();
			return true;
		} catch (e) {
			return false;
		}
	}
	return false;
}
//Funcion grabar, modificar y borrar telefono
//
function telefono(jsonIn, destinoSQL) {

	if (utility.checkFullNull(jsonIn.FONO) === null || utility.checkFullNull(jsonIn.RUT) === null) {
		return ({
			Status: 400,
			error: [{
				Type: 'E',
				Code: 400,
				Description: 'Telefono o rut vacios'
            }],
			respuesta: []
		});
	}
	let tQuery = null,
		conn = $.hdb.getConnection(),
		arryT = [],
		estado = 200,
		errT = [];
	switch (jsonIn.ACCION.toUpperCase()) {
		case 'I':
			tQuery = 'INSERT INTO "' + destinoSQL + '.data::clientes.fonos" VALUES(?,?,?,?,1)';
			try {
				conn.executeUpdate(tQuery, jsonIn.FONO, jsonIn.RUT.toString().toUpperCase(), jsonIn.NIVEL.toUpperCase(), jsonIn.TIPO);
				conn.commit();
			} catch (e) {
				errT.push({
					Type: 'E',
					Code: e.code,
					Description: e.message
				});
				estado = 500;
			}
			break;
		case 'D':
			tQuery = 'DELETE FROM "' + destinoSQL + '.data::clientes.fonos" WHERE FONO = ? AND RUT = ?';
			try {
				conn.executeUpdate(tQuery, jsonIn.FONO, jsonIn.RUT.toString().toUpperCase());
				conn.commit();
			} catch (e) {
				errT.push({
					Type: 'E',
					Code: e.code,
					Description: e.message
				});
				estado = 500;
			}
			break;
		case 'U':
			tQuery = 'UPDATE "' + destinoSQL + '.data::clientes.fonos" SET FONO = ?, NIVEL = ?, TIPO = ?' + ' WHERE RUT = ? AND FONO = ?';
			try {
				conn.executeUpdate(tQuery, jsonIn.FONO_N, jsonIn.NIVEL.toUpperCase(), jsonIn.TIPO, jsonIn.RUT.toString().toUpperCase(), jsonIn.FONO);
				conn.commit();
			} catch (e) {
				errT.push({
					Type: 'E',
					Code: e.code,
					Description: e.message
				});
				estado = 500;
			}
			break;
		case 'S':
			tQuery = 'SELECT * FROM "' + destinoSQL + '.data::clientes.fonos" WHERE RUT = ?';
			try {
				let rsT = conn.executeQuery(tQuery, jsonIn.RUT.toString().toUpperCase());
				for (let i = 0; i < rsT.length; i++) {
					arryT.push(rsT[i]);
				}
			} catch (e) {
				errT.push({
					Type: 'E',
					Code: e.code,
					Description: e.message
				});
				estado = 500;
			}
			break;
		default:
			errT.push({
				Type: 'E',
				Code: 400,
				Description: 'Función no valida'
			});
			estado = 400;
			break;
	}
	conn.close();
	return ({
		Status: estado,
		message: errT,
		respuesta: arryT
	});
}