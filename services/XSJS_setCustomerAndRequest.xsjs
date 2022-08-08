$.import("CL_PACKAGE_PACE_DEV.procedures", "utility");
let destinoSQL = "CL_PACKAGE_PACE_DEV";

var
	utility = $.CL_PACKAGE_PACE_DEV.procedures.utility;
var json = {
	Result: [],
	Status: []
};
var JsonIn;
var jsonTemp = {
		Sinacofi: []
	},
	jdata = {
		RUT: "",
		APE_PATERNO: "",
		APE_MATERNO: "",
		NOMBRE: "",
		FECHA_NACIMIENTO: "",
		CORREO: "",
		FECHALABORAL: "",
		IDOTROINGRESOS: "",
		DESCRIPCIONDEPEN: "",
		INGRESO: "",
		TELEFONO: "",
		IDOTROINGRESOSLIQ: "",
		ID_EJECUTIVO: "",
		DIRECCION: "",
		COMUNA: "",
		CIUDAD: ""
	},
	JSONObj = {},
	obj = {
		destinoSQL: "QasAffinity",
		destinoSQLA: "CL_PACKAGE_PACE_DEV",
		modo: "", //T
		idAffinity: ""
	};

///////////////////////////////////////////
//Valida Cliente en Sinacofi
///////////////////////////////////////////
function getSinacofi(rut) {
	try {
		var client = new $.net.http.Client();
		var url = "/http/Tanner/Cotizador/ObtenerInformacion/Sinacofi";
		var dest = $.net.http.readDestination("CL_PACKAGE_PACE_DEV.services", "ci_IntegrationSuite");
		var req = new $.net.http.Request($.net.http.POST, url);
		req.parameters.set('rut', rut);
		client.request(req, dest);
		var response = client.getResponse();
		let respuestaT = JSON.parse(response.body.asString().replace(/[\r\n]/g, '')).body;
		//08-06-2022
		if (respuestaT) {
			var Sinacofi = [];
			var cpiId = "";
			for (let i = 0; i < response.headers.length; i++) {
				if (response.headers[i].name === 'sap_messageprocessinglogid') {
					cpiId = response.headers[i].value;
				}
			}
			Sinacofi = {
				Edad: respuestaT.FullAge.Years,
				Ciudad: respuestaT.Persona.ciudad,
				Comuna: respuestaT.Persona.comuna,
				Direccion: respuestaT.Persona.direccion,
				IsValid: respuestaT.Persona.IsValid,
				ApellidoMaterno: respuestaT.Persona.personaNatural.apellidoMaterno,
				ApellidoPaterno: respuestaT.Persona.personaNatural.apellidoPaterno,
				Nombre: respuestaT.Persona.personaNatural.nombreCompleto,
				EstadoCivil: respuestaT.Persona.personaNatural.estadoCivil,
				FechaNacimiento: respuestaT.Persona.personaNatural.fechaNac,
				Nacionalidad: respuestaT.Persona.personaNatural.nacionalidad,
				Sexo: respuestaT.Persona.personaNatural.sexo,
				MessageID: cpiId
			};
			jsonTemp.Sinacofi.push(Sinacofi);
			return true;
		}
		//08-06-2022
	} catch (e) {
		json.Status.push({
			code: 500,
			status: "Error",
			data: "Servicio Sinacofi, no se valida Rut en Sinacofi. Error: " + e.message
		});
		return false;
	}
	// 	finally {
	// 		return true;
	// 	}

}

///////////////////////////////////////////
//CASO PROCESS 1 : Creación de cliente
///////////////////////////////////////////
function setCreateCustomer(vIdentityNumber, vFirstName, vLastName, vEmail, vMobilePhoneNumber, vPhone, vDealerOffice, vDealer, vComments,
	vMessageId) {
	let conn = $.hdb.getConnection();
	var queryCreate = ' INSERT INTO "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::pace.CUSTOMER" VALUES ( ' + "'" + vIdentityNumber + "'," /*IDENTITYNUMBER <NVARCHAR(11)>*/ +
		"'" + jsonTemp.Sinacofi[0].MessageID + "'," /*MESSAGEID <NVARCHAR(100)>*/ + "'" + jsonTemp.Sinacofi[0].Nombre + "'," /*FIRSTNAME <NVARCHAR(100)>*/ +
		"'" + jsonTemp.Sinacofi[0].ApellidoPaterno + " " + jsonTemp.Sinacofi[0].ApellidoMaterno + "'," /*LASTNAME <NVARCHAR(100)>*/ + "'" +
		vEmail + "'," /*EMAIL <NVARCHAR(50)>*/ + vMobilePhoneNumber + "," /*MOBILEPHONENUMBER <INTEGER>*/ + vPhone + "," /*PHONE <INTEGER>*/ +
		vDealerOffice + "," /*ID_DEALER_OFFICE <INTEGER>*/ + "'" + vComments + "'," /*COMMENTS <NVARCHAR(100)>*/ + null + "," /*SALARY <DECIMAL>*/ +
		null + "," /*WORKSTARTDAY <DATE>*/ + "'N'," /*CONTRACTTYPE <NVARCHAR(1)>*/ + vDealer + "," /*ID_DEALER <INTEGER>*/ + jsonTemp.Sinacofi[0]
		.Edad + "," /*AGE <INTEGER>*/ + "'" + jsonTemp.Sinacofi[0].Ciudad + "'," /*CITY <NVARCHAR(100)>*/ + "'" + jsonTemp.Sinacofi[0].Comuna +
		"'," /*COMMUNE <NVARCHAR(100)>*/ + "'" + jsonTemp.Sinacofi[0].Direccion + "'," /*STREET <NVARCHAR(100)>*/ + "'" + jsonTemp.Sinacofi[0].ApellidoPaterno +
		"'," /*LASTNAME_F <NVARCHAR(100)>*/ + "'" + jsonTemp.Sinacofi[0].ApellidoMaterno + "'," /*LASTNAME_M <NVARCHAR(100)>*/ + "'" + jsonTemp.Sinacofi[
			0].EstadoCivil + "'," /*CIVIL_STATE <NVARCHAR(20)>*/ + "'" + jsonTemp.Sinacofi[0].FechaNacimiento + "'," /*BIRTH_DATE <DATE>*/ + "'" +
		jsonTemp.Sinacofi[0].Nacionalidad + "'," /*NATIONALITY <NVARCHAR(40)>*/ + "'" + jsonTemp.Sinacofi[0].Sexo /*SEX <NVARCHAR(1)>*/ + "' )";

	try {
		conn.executeUpdate(queryCreate);
		conn.commit();
		json.Status.push({
			code: 200,
			status: "success",
			data: "fun:setCreateCustomer. Cliente creado correctamente. "
		});

	} catch (e) {
		json.Status.push({
			code: e.code,
			status: "error",
			data: "fun:setCreateCustomer. " + e.message
		});

	} finally {
		conn.close();
		json.Result.push({
			"targetSystemLeadId": jsonTemp.Sinacofi[0].MessageID
		});
	}
}

///////////////////////////////////////////
//CASO PROCESS 1 : Modificación de cliente
///////////////////////////////////////////
function setModifyCustomer(vIdentityNumber, vFirstName, vLastName, vEmail, vMobilePhoneNumber, vPhone, vDealerOffice, vDealer, vComments,
	vMessageId) {
	let conn = $.hdb.getConnection();
	var queryUpdate = ' UPDATE "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::pace.CUSTOMER" ' + " SET " + "	FIRSTNAME = '" + vFirstName +
		"'," + "	LASTNAME = '" + vLastName + "'," + "	EMAIL = '" + vEmail + "'," + "	MOBILEPHONENUMBER  = " + vMobilePhoneNumber + "," +
		"	PHONE  = " + vPhone + "," + "	ID_DEALER_OFFICE  = " + vDealerOffice + "," + "	ID_DEALER  = " + vDealer + "," + "	COMMENTS  = '" +
		vComments + "'," + " AGE = " + jsonTemp.Sinacofi[0].Edad + "," + " CITY = '" + jsonTemp.Sinacofi[0].Ciudad + "'," + " COMMUNE = '" +
		jsonTemp.Sinacofi[0].Comuna + "'," + " STREET = '" + jsonTemp.Sinacofi[0].Direccion + "'," + " LASTNAME_F = '" + jsonTemp.Sinacofi[0].ApellidoMaterno +
		"'," + " LASTNAME_M = '" + jsonTemp.Sinacofi[0].ApellidoPaterno + "'," + " CIVIL_STATE = '" + jsonTemp.Sinacofi[0].EstadoCivil + "'," +
		" BIRTH_DATE = '" + jsonTemp.Sinacofi[0].FechaNacimiento + "'," + " NATIONALITY = '" + jsonTemp.Sinacofi[0].Nacionalidad + "'," +
		" SEX = '" + jsonTemp.Sinacofi[0].Sexo + "'" + " WHERE IDENTITYNUMBER = '" + vIdentityNumber + "' ";
	try {
		conn.executeUpdate(queryUpdate);
		conn.commit();

		json.Status.push({
			code: 200,
			status: "success",
			data: "fun:setModifyCustomer. Cliente actualizado correctamente. "
		});

	} catch (e) {
		json.Status.push({
			code: e.code,
			status: "error",
			data: "fun:setModifyCustomer. " + e.message
		});
	} finally {
		conn.close();
		json.Result.push({
			"targetSystemLeadId": vMessageId
		});
	}
}

///////////////////////////////////////////
//CASO PROCESS 1 : Consulta Dealer
///////////////////////////////////////////
function getConsultDealer(vIdDealerOffice) {
	var querySelect = ' SELECT ID_DISTRIBUIDOR FROM "PRD_HANA_AFFINITY"."PrdAffinity.data::maestro.sucursales" where ID_SUCURSAL= ' +
		vIdDealerOffice;
	var oConnT = $.hdb.getConnection();
	try {
		var rsT = oConnT.executeQuery(querySelect);
		if (rsT[0].length > 0) {
			return rsT[0].ID_DISTRIBUIDOR;
		}

	} catch (e) {
		json.Status.push({
			code: e.code,
			status: "error",
			data: "fun:getConsultCustomer. " + e.message
		});
		return 0;
	}
}

///////////////////////////////////////////
//CASO PROCESS 1 : Consulta de cliente
///////////////////////////////////////////
function getConsultCustomer(vIdentityNumber, vFirstName, vLastName, vEmail, vMobilePhoneNumber, vPhone, vDealer, vComments, vMessageId) {
	var querySelect =
		' SELECT IDENTITYNUMBER , MESSAGEID FROM "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::pace.CUSTOMER" WHERE IDENTITYNUMBER = ?';
	var oConnT = $.hdb.getConnection();
	if (getSinacofi(vIdentityNumber)) {
		try {
			var rsT = oConnT.executeQuery(querySelect, vIdentityNumber);

			var vDealerOffice_new = utility.getValueMapping("SUCURSAL", "ID_SUCURSAL", vDealer, json);
			var vDealer_new = getConsultDealer(vDealerOffice_new);
			if (rsT.length > 0) {
				setModifyCustomer(vIdentityNumber, vFirstName, vLastName, vEmail, vMobilePhoneNumber,
					vPhone, vDealerOffice_new, vDealer_new, vComments, rsT[0].MESSAGEID);
			} else {
				setCreateCustomer(vIdentityNumber, vFirstName, vLastName, vEmail, vMobilePhoneNumber,
					vPhone, vDealerOffice_new, vDealer_new, vComments, vMessageId);
			}

		} catch (e) {
			json.Status.push({
				code: 400,
				status: "error",
				data: "fun:getConsultCustomer." + e.message
			});
		}
	} else {
		json.Status.push({
			code: 300,
			status: "error",
			data: "fun:sinacofi no encuentra información del cliente."
		});
	}
}

///////////////////////////////////////////
//CASO PROCESS 1 : Inicia proceso carga Cliente - Valida datos de Cliente
///////////////////////////////////////////
function setInitProcessCustomer() {
	let vStr, vRes;
	// nombre campo, tipocampo L = Letra N = Numerico S = String, C = Cadena quitar Carcateres especiales, campo Mandatorio M 0 Mandatorio O = Opcional  

	var vMessageId = JsonIn.targetSystemLeadId;

	var vFirstName = JsonIn.firstName;
	vStr = "firstName" + ";" + "S" + ";" + "M";
	vRes = utility.validarCampoFormato(vFirstName, vStr, json);

	var vLastName = JsonIn.lastName;
	vStr = "lastName" + ";" + "S" + ";" + "M";
	vRes = utility.validarCampoFormato(vLastName, vStr, json);

	var vIdentityNumber = JsonIn.identityNumber;
	vStr = "identityNumber" + ";" + "S" + ";" + "M";
	vRes = utility.validarCampoFormato(vIdentityNumber, vStr, json);

	var vEmail = JsonIn.email;
	vStr = "email" + ";" + "S" + ";" + "M";
	vRes = utility.validarCampoFormato(vEmail, vStr, json);

	var vMobilePhoneNumber = JsonIn.mobilePhoneNumber;
	vStr = "mobilePhoneNumber" + ";" + "N" + ";" + "M";
	vRes = utility.validarCampoFormato(vMobilePhoneNumber, vStr, json);

	var vPhone = JsonIn.phone;

	var vDealer = JsonIn.dealer;

	var vComments = JsonIn.comments;
	vStr = "Commets" + ";" + "S" + ";" + "O";
	vRes = utility.validarCampoFormato(vComments, vStr, json);

	var vRut = vIdentityNumber.split("-");
	if (vRut.length > 0) {
		let rutRep = utility.generaVerificador(vRut[0]);
		let digito = rutRep.split("-");
		if (vRut[1] !== digito[1]) {
			json.Status.push({
				code: "300",
				status: "error",
				data: "fun:getValidation. Rut ingresado es incorrecto. "
			});

		} else {
			getConsultCustomer(vIdentityNumber, vFirstName, vLastName, vEmail, vMobilePhoneNumber, vPhone, vDealer, vComments, vMessageId);
		}
	}

}

///////////////////////////////////////////
//Inicio de Proceso : Customer And Request
///////////////////////////////////////////
///////////////////////////////////////////
//Acceso de datos API
///////////////////////////////////////////
try {
	//var JsonString = $.request.body.asString();
	// JsonIn = JSON.parse(JsonString);
	var JsonIn = {
		"TypeData": 1,
		"TargetSystemLeadId": "123",
		"FirstName": "Gabriel",
		"LastName": "Rivera",
		"IdentityNumber": "17843513-2",
		"Email": "gabriel.rivera@gmail.com",
		"MobilePhoneNumber": 987654321,
		"Phone": 987654321,
		"Dealer": "CLDN00250",
		"Comments": "test"
	};

	var typeData = JsonIn.typeData;

	switch (typeData) {
		case 1:
			setInitProcessCustomer();
			break;
		case 2:
			setRequest();
			break;
	}
} catch (e) {
	json.Status.push({
		code: 300,
		status: "Error",
		data: "Inicio API: Json de entrada con error.",
		e: e.message
	});
}

$.response.setBody(JSON.stringify(json, null, "\t"));
$.response.contentType = "application/json; charset=UTF-8";
$.response.status = $.net.http.OK;