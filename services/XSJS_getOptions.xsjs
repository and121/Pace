$.import("CL_PACKAGE_PACE_DEV.procedures", "utility");
let destinoSQL = "CL_PACKAGE_PACE_DEV";
var utility = $.CL_PACKAGE_PACE_DEV.procedures.utility;

var json = {
	financeType: [],
	status: []
};

var jsonComplementario = {
	eligibilityCriteria: [],
	financeProducts: [],
	inputCriteria: [],
	loanTerm: []
};

function getMasterData(v_basePrice) {
	getFinanceType(v_basePrice);
}

function getFinanceType(v_basePrice) {
	var querySelect = ' SELECT * FROM "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::master.product" ';
	var oConnT = $.hdb.getConnection();
	try {
		var rsT = oConnT.executeQuery(querySelect);

		for (var i = 0; i < rsT.length; i++) {
			let eligibilityCriteria = getEligibility(rsT[i].ID_PRODUCT, v_basePrice);
			let boolDefault = true;
			//if (rsT[i].DEFAULT == 1) boolDefault = true;

			let letFinanceType =

				{
					"name": rsT[i].NAME,
					"key": rsT[i].ID_PRODUCT,
					"default": boolDefault,
					"description": rsT[i].DESCRIPTION,
					"others": rsT[i].OTHERS,
					"paymentFrequency": rsT[i].PAYMENTFRECUENCY,
					"eligibilityCriteria": eligibilityCriteria
				};
			json.financeType.push(letFinanceType);
			oConnT.close();
		}
		json.status.push({
			code: 200,
			status: "Sucess",
			comment: "Consulta Exitosa."
		});
	} catch (e) {
		json.status.push({
			code: 200,
			status: "Error",
			comment: "Consulta Exitosa."
		});
	}
}

function getEligibility(idProducts, v_basePrice) {
	var querySelect = ' SELECT * FROM "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::master.eligibility" ';
	var oConnT = $.hdb.getConnection();
	jsonComplementario.eligibilityCriteria = [];
	try {
		var rsT2 = oConnT.executeQuery(querySelect);
		let letEligibility = "";
		let letInputCriteria = "";
		let InputCriteria = getInputCriteria(idProducts, v_basePrice);
		for (var j = 0; j < rsT2.length; j++) {
			let boolDefault2 = false;
			if (rsT2[j].DEFAULT == 1) boolDefault2 = true;

			letEligibility = {
				"name": rsT2[j].NAME,
				"key": rsT2[j].ID_ELIGIBILITY,
				"default": boolDefault2,
				"financeProducts": [
					{
						"inputCriteria": InputCriteria
                        }
                    ]
			};
			jsonComplementario.eligibilityCriteria.push(letEligibility);
		}

	} catch (e) {

	} finally {
		return jsonComplementario.eligibilityCriteria;
	}
}

function getInputCriteria(idProducts, v_basePrice) {
	var querySelect = ' SELECT * FROM "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::master.inputCriteria" where ID_PRODUCT = ?';
	var oConnT = $.hdb.getConnection();
	try {
		var rsT3 = oConnT.executeQuery(querySelect, idProducts);
		let InputCriteria = "";
		let LoanTerm = "";
		let Deposit = "";
		LoanTerm = getLoanTerm(idProducts);
		Deposit = getDeposit(idProducts);

		jsonComplementario.InputCriteria = [];

		for (var x = 0; x < rsT3.length; x++) {
			let boolDefault3 = false;
			if (rsT3[x].MANDATORY == 1) boolDefault3 = true;

			switch (rsT3[x].NAME) {
				case ("deposit"):

					InputCriteria = {
						"name": rsT3[x].NAME,
						"defaultKey": rsT3[x].DEFAULTKEY,
						"defaultValue": rsT3[x].DEFAULTVALUE,
						"unit": rsT3[x].UNIT,
						"mandatory": boolDefault3,
						"possibleValues": Deposit
					};
					jsonComplementario.InputCriteria.push(InputCriteria);
					break;
				case ("loanTerm"):
					InputCriteria = {
						"name": rsT3[x].NAME,
						"defaultKey": rsT3[x].DEFAULTKEY,
						"defaultValue": rsT3[x].DEFAULTVALUE,
						"unit": rsT3[x].UNIT,
						"mandatory": boolDefault3,
						"possibleValues": LoanTerm
					};
					jsonComplementario.InputCriteria.push(InputCriteria);
					break;

			}
		}
		return jsonComplementario.InputCriteria;

	} catch (e) {

	} finally {
		return jsonComplementario.InputCriteria;
	}
}

function getLoanTerm(idProducts) {
	var querySelect =
		' SELECT * FROM "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::master.loanTerm" where ID_PRODUCT = ? order by KEY desc ';
	var oConnT = $.hdb.getConnection();
	try {
		var rsT4 = oConnT.executeQuery(querySelect, idProducts);
		let loanTerm = "";
		jsonComplementario.loanTerm = [];

		for (var y = 0; y < rsT4.length; y++) {

			loanTerm = {
				"key": rsT4[y].KEY,
				"value": rsT4[y].VALUE
			};
			jsonComplementario.loanTerm.push(loanTerm);
		}
	} catch (e) {
		json.status.push({
			code: 400,
			status: "Error",
			comment: "Error Loan Term."
		});
	} finally {
		return jsonComplementario.loanTerm;
	}

}

function getDeposit(idProducts) {
	var querySelect = ' SELECT * FROM "CL_PACE_SCHEME_DEV"."CL_PACKAGE_PACE_DEV.data::master.deposit" where ID_PRODUCT = ? order by KEY asc ';
	var oConnT = $.hdb.getConnection();
	try {
		var rsT4 = oConnT.executeQuery(querySelect, idProducts);
		let loanTerm = "";
		jsonComplementario.loanTerm = [];

		for (var y = 0; y < rsT4.length; y++) {

			loanTerm = {
				"key": rsT4[y].KEY,
				"value": rsT4[y].VALUE
			};
			jsonComplementario.loanTerm.push(loanTerm);
		}
	} catch (e) {
		json.status.push({
			code: 400,
			status: "Error",
			comment: "Error Loan Term."
		});
	} finally {
		return jsonComplementario.loanTerm;
	}
}

if ($.request.method === $.net.http.GET) {
	var v_BasePrice = $.request.parameters.get("basePrice");
	var v_ModelCode = $.request.parameters.get("modelCode");
	var v_VersionKey = $.request.parameters.get("versionKey");
	var flag = true;
	//	v_ModelCode = 886008857;
	//	v_VersionKey = 886011720;
	//	v_BasePrice = 1;

	try {
		v_ModelCode = utility.getValueMapping("MODEL", "ID_MODEL", v_ModelCode, json);
		v_VersionKey = utility.getValueMapping("VERSION", "ID_VERSION", v_VersionKey, json);
		let error = "Error Servicio Homologación";

		if (error == v_ModelCode || error == v_VersionKey) {
			json.status.push({
				code: 400,
				status: "Error",
				data: "Error en la homologación de modelo y/o versión."
			});
			flag = false;
		} else {
			if (parseInt(v_BasePrice) >= 1) {
				getMasterData(v_BasePrice);

				// send response
			} else {
				json.status.push({
					code: 400,
					status: "Error",
					data: "Error en el precio base debe ser mayor a 0."
				});
				flag = false;
			}
		}
	} catch (e) {
		json.status.push({
			code: 400,
			status: "Error",
			data: "Error en los datos de modelo versión."
		});
	}

	if (flag == true && json.status[0].code == 200) {
		$.response.status = $.net.http.OK;
		var newJson = {
			financeType: [json.financeType[0]]
		};
		$.response.setBody(JSON.stringify(newJson, null, "\t"));
		$.response.contentType = "application/json; charset=UTF-8";
	} else {
		var newJsonRespuesta = {
			success: false,
			code: 400,
			message: json.status[0].data
		};

		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody(JSON.stringify(newJsonRespuesta, null, "\t"));
		$.response.contentType = "application/json; charset=UTF-8";
	}
}