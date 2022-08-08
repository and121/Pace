function leerDatos(objG,jsonout) {
    $.import("CL_PACKAGE_PACE_DEV.procedures", "utility");	
    var utility = $.CL_PACKAGE_PACE_DEV.procedures.utility;    
    let query,sol = [], err = [];
	var obj = {
			IdTipoRelacionOperacion: 1, // 1 = Titular 
			FirmaPagare:'S' // Unico Pagare
		};	    
    query = 'SELECT *,TO_VARCHAR(FECHA_INICIO_ACTIVIDAD,\'DD-MM-YYYY\') as FECHA_INICIO_ACTIVIDAD2,TO_VARCHAR(FECHANAC,\'DD-MM-YYYY\') as FECHANAC2 '
            + ' FROM "' + objG.destinoSQL + '.data::clientes.identificacion"'
            + ' WHERE RUT=?';
	var oConnT = $.hdb.getConnection();
    var rsT = oConnT.executeQuery(query,jsonout.RUT);
    if(rsT.length <= 0){
		    jsonout.Error.push({
				codigo: 510,
				descripcion: 'Para rut ' + jsonout.RUT + ' modulo obligatorio identificación no existe'
			});
    }                
    var identificacion = '';
    for(let j = 0; j < rsT.length; j++){
            var rutS = rsT[j].RUT.substring(0, rsT[j].RUT.length - 1),
                divS = rsT[j].RUT.substring(rsT[j].RUT.length - 1, rsT[j].RUT.length);
			identificacion = {
    				"Rut": rutS, // *
    				"Dv": divS,
    				"NumeroSerie": rsT[j].SERIE, // *
    				"Nombre": rsT[j].NOMBRE, // *
    				"ApellidoPaterno": rsT[j].APATERNO, // *
    				"ApellidoMaterno": rsT[j].AMATERNO, // *
    				"IdNacionalidad": rsT[j].NACIONALIDAD, // *
    				"FechaNacimiento": rsT[j].FECHANAC2,
    				"IdGenero": rsT[j].GENERO, // *
    				"IdEstadoCivil": (rsT[j].ESTADOCIVIL === undefined || rsT[j].ESTADOCIVIL === null ? '0' : rsT[j].ESTADOCIVIL.toString()),
    				"NumeroCarga": (rsT[j].CARGAFAM === undefined || rsT[j].CARGAFAM === null ? '0' : rsT[j].CARGAFAM.toString()), 
    				"IdEstudios": rsT[j].ESTUDIOS,
    				"Profesion": rsT[j].PROFESION,
    				"Correo": rsT[j].MAIL,
    				"IdTipoPropiedad": "",
    				"Arriendo": "0",
    				"DescripcionActividad": "",
    				"Observacion": rsT[j].OBSERVACION,
    				"RazonSocial": "",
    				"NombreFanstasia": "",
    				"FechaConstitucion": "",
    				"GiroPrincipal": "",
    				"Habita": "0",
    				"TipoPersona":rsT[j].CHECKEMPRESA,//
    				"FechaInicioActividad":rsT[j].FECHA_INICIO_ACTIVIDAD2
    			};
	
                if(utility.checkFullNull(rsT[j].RUT) === null || utility.checkFullNull(rsT[j].NOMBRE) === null
                    || utility.checkFullNull(rsT[j].APATERNO) === null || utility.checkFullNull(rsT[j].AMATERNO) === null
                    ){
                   identificacion = ''; 
                }  
    }
        
    if(identificacion !== '')
        {
            obj['Identificacion'] = identificacion;
        }else{
			jsonout.Error.push({
				codigo: 511,
				descripcion: 'Para rut ' + jsonout.RUT + ' modulo obligatorio identificación se encuentra incompleto'
			}); 
			return ({code: 'error',msg: err}); 
        }            
        query = 'SELECT * FROM "' + objG.destinoSQL + '.data::clientes.ingresosliq" WHERE RUT=?';
        rsT = oConnT.executeQuery(query,jsonout.RUT);
        let ingresos = [];
        for(let j = 0; j < rsT.length; j++){
				var obj3 = {
					"RazonSocial": rsT[j].EMPLEADOR,
					"Rut": (utility.checkFullNull(rsT[j].RUTEMP) === null ? "" : rsT[j].RUTEMP.substring(0,rsT[j].RUTEMP.length - 1) ),
					"Dv": (utility.checkFullNull(rsT[j].RUTEMP) === null ? "" : rsT[j].RUTEMP.substring(rsT[j].RUTEMP.length - 1,rsT[j].RUTEMP.length) ),
					"Telefono": (utility.checkFullNull(rsT[j].FONOEMP === null) ? "" : rsT[j].FONOEMP),
					"Direccion": rsT[j].DIRECCIONEMP,
					"IdRegion": rsT[j].REGIONEMP,
					"IdCiudad": rsT[j].CIUDADEMP,
					"IdComuna": rsT[j].COMUNAEMP,
					"Cargo": rsT[j].CARGO,
					"InicioActividad": rsT[j].ACTIVIDAD,
					"IdTipoContrato": rsT[j].TIPOCONT,
					"IdTipoRemuneracion": rsT[j].TIPOREMU,
					"IngresoLiquidoMensual": rsT[j].INGRESOLIQ,
					"Observacion": rsT[j].OBSERVACION,
					"YearActividad": ""
				};
				ingresos.push(obj3);                
        }
        query = 'SELECT * FROM "' + objG.destinoSQL + '.data::clientes.otroingreso" WHERE RUT = ?';
        rsT = oConnT.executeQuery(query,jsonout.RUT);
		let otroingresos = [];
		for(let j = 0; j < rsT.length; j++){
				var obj4 = {
					"IdTipoActividad": rsT[j].TIPOOTRO,
					"Descripcion": rsT[j].DESCRIPCIONOTRO,
					"Monto": rsT[j].OTROINGRESO
				};
				otroingresos.push(obj4);			    
		}
		query = 'SELECT * FROM "' + objG.destinoSQL + '.data::clientes.bienesraices" WHERE RUT=?';
	    rsT = oConnT.executeQuery(query,jsonout.RUT);
	    let bienraiz = [];
		for(let j = 0; j < rsT.length; j++){
				var obj5 = {
					"IdTipoBienRaiz": rsT[j].TIPO,
					"Direccion": rsT[j].DIRECCION,
					"IdHabitaPropiedad": rsT[j].VIVE,
					"IdRegion": rsT[j].REGION,
					"IdCiudad": rsT[j].CIUDAD,
					"IdComuna": rsT[j].COMUNA,
					"IdHipoteca": rsT[j].HIPOTECA,
					"Dividendo": rsT[j].DIVIDENDO,
					"ValorComercial": rsT[j].VALORCOM,
					"IngresoRenta": rsT[j].INGRENTA,
					"FechaInicio": rsT[j].FECHAINC,
					"RolSII": rsT[j].ROLSII,
					"Observacion": rsT[j].OBSERVACION
				};
				bienraiz.push(obj5);			    
		}	
		query = 'SELECT * FROM "' + objG.destinoSQL + '.data::clientes.direccion" WHERE RUT = ?';
		rsT = oConnT.executeQuery(query,jsonout.RUT);
		let direccion = [];
		if (rsT.length > 0) {
    		for(let j = 0; j < rsT.length; j++) {
    			var obj6 = {
    				"IdTipoDireccion": rsT[j].TIPODIR,
    				"Direccion": rsT[j].DIRECCION,
    				"IdRegion": rsT[j].REGION,
    				"IdCiudad": rsT[j].CIUDAD,
    				"IdComuna": rsT[j].COMUNA,
    				"IdCorreo": rsT[j].CORREO,
    				"IdPagare": rsT[j].PAGARE
    			};
    			direccion.push(obj6);
    		}	
		} else {
		    
    			direccion.push({
    			    "IdTipoDireccion": '1', // 1
    				"Direccion": jsonout.DIRECCION,
    				"IdRegion": '13',
    				"IdCiudad": null,
    				"IdComuna": '277',
    				"IdCorreo": "N",
    				"IdPagare": "S"
    			}); 
		}
		query = 'SELECT * FROM "' + objG.destinoSQL + '.data::clientes.fonos" WHERE RUT = ?';
		rsT = oConnT.executeQuery(query,jsonout.RUT);
		let telefonos = [];
		for(let j = 0; j < rsT.length; j++) {
				var obj7 = {
					"IdTipoTelefono": (utility.checkFullNull(rsT[j].TIPO) === null ? 7 : rsT[j].TIPO),
					"Telefono": rsT[j].FONO
				};
				telefonos.push(obj7);
		}
		query = 'SELECT * FROM "' + objG.destinoSQL + '.data::clientes.iva" WHERE RUT = ?';
		rsT = oConnT.executeQuery(query,jsonout.RUT);
		let iva = [];
		for(let j = 0; j < rsT.length; j++) {
			var obj8 = {
				"MesYear": rsT[j].MES,
				"VentasExentas": rsT[j].VENTASEX,
				"IvaVentas": rsT[j].IVA,
				"ComprasExentas": rsT[j].COMPRASEX,
				"IvaCompras": rsT[j].IVACOMPRA
			};
			iva.push(obj8);
		}		
		query = 'SELECT *, (D156 - D157) as NETO FROM "' + objG.destinoSQL + '.data::clientes.dai" WHERE RUT = ?';
		rsT = oConnT.executeQuery(query,jsonout.RUT);
		let dai = [];
		for(let j = 0; j < rsT.length; j++) {
				var obj9 = {
					"YearDai": rsT[j].ANO,//AnoDai
					"Folio": Number(rsT[j].FOLIO),
					"BaseImpGComplementario": {
						"SubTotal": (utility.checkFullNull(rsT[j].D156) === null ? 0 : Number(rsT[j].D156)),
						"ImpGlobalComplementario": (utility.checkFullNull(rsT[j].D157) === null ? 0 : Number(rsT[j].D157)),
    					"IngresoNeto": (utility.checkFullNull(rsT[j].NETO) === null ? 0 : Number(rsT[j].NETO)),
    					"1aCategRentasEfect":(utility.checkFullNull(rsT[j].D018) === null ? 0 : Number(rsT[j].D018)),
    					"PagosPrevisionales":(utility.checkFullNull(rsT[j].D036) === null ? 0 : Number(rsT[j].D036)),
    				    "ResLiquidAnualImpRenta":(utility.checkFullNull(rsT[j].D305) === null ? 0 : Number(rsT[j].D305)),
    					"RetPorRentasDeclaradas":(utility.checkFullNull(rsT[j].D611) === null ? 0 : Number(rsT[j].D611))
    				},
					"BaseImpPrimeraCategoria": {
						"IngresoGiro": (utility.checkFullNull(rsT[j].D628) === null ? 0 : Number(rsT[j].D628)),
						"InteresesPercibidos": (utility.checkFullNull(rsT[j].D629) === null ? 0 : Number(rsT[j].D629)),
						"Depreciacion": (utility.checkFullNull(rsT[j].D632) === null ? 0 : Number(rsT[j].D632)),
						"InteresesPagados": (utility.checkFullNull(rsT[j].D633) === null ? 0 : Number(rsT[j].D633)),
						"RestaLiquida": (utility.checkFullNull(rsT[j].D636) === null ? 0 : Number(rsT[j].D636))
					},
					"DatosContables": {
						"ExistenciaFinal": (utility.checkFullNull(rsT[j].D129) === null ? 0 : Number(rsT[j].D129)),
						"TotalActivo": (utility.checkFullNull(rsT[j].D122) === null ? 0 : Number(rsT[j].D122)),
						"TotalPasivo": (utility.checkFullNull(rsT[j].D123) === null ? 0 : Number(rsT[j].D123)),
						"CapitalEfectivo": (utility.checkFullNull(rsT[j].D102) === null ? 0 : Number(rsT[j].D102)),
						"CapitalPropioTributario": (utility.checkFullNull(rsT[j].D645646) === null ? 0 : Number(rsT[j].D645646)),
						"ActivoInmovilizado": (utility.checkFullNull(rsT[j].D647) === null ? 0 : Number(rsT[j].D647)), 
						"BienesLeasing": (utility.checkFullNull(rsT[j].D648) === null ? 0 : Number(rsT[j].D648))
					}
				};
			dai.push(obj9);
		}
		query = 'SELECT * FROM "' + objG.destinoSQL + '.data::clientes.vehiculos" WHERE RUT = ?';
		rsT = oConnT.executeQuery(query,jsonout.RUT);
		let vehiculo = [];
		for(let j = 0; j < rsT.length; j++) {
			var obj10 = {
				"IdTipoVehiculo": rsT[j].TIPO,
				"Marca": rsT[j].MARCA,
				"Modelo": rsT[j].MODELO,
				"Patente": rsT[j].PATENTE,
				"YearVehiculo": rsT[j].ANO,//AnoVehiculo
				"IdLeasing": rsT[j].LEASING,
				"IdPrenda": rsT[j].PRENDA,
				"Valor": rsT[j].VALOR,
				"Observacion": rsT[j].OBSERVACION
			};
			vehiculo.push(obj10);
		}
		query = 'SELECT * FROM "' + objG.destinoSQL + '.data::clientes.referenciasbanc" WHERE RUT = ?';
		rsT = oConnT.executeQuery(query,jsonout.RUT);
		let refBanc = [];
		for(let j = 0; j < rsT.length; j++) {
			var obj11 = {
				"Banco": rsT[j].BANCO,
				"YearAntiguedad": (utility.checkFullNull(rsT[j].ANOS) === null ? 0 : rsT[j].ANOS),
				"MontoLC": (utility.checkFullNull(rsT[j].MONTOLC) === null ? 0 : rsT[j].MONTOLC),
				"Observacion": rsT[j].OBSERVACION
			};
			refBanc.push(obj11);
		}
		query = 'SELECT * FROM "' + objG.destinoSQL + '.data::clientes.referenciapersonal" WHERE RUT = ?';
		rsT = oConnT.executeQuery(query,jsonout.RUT);
		let refPers = [];
		for(let j = 0; j < rsT.length; j++) {
			var obj12 = {
				"NombreCompleto": rsT[j].NOMBRE,
				"Relacion": rsT[j].RELACION,
				"Telefono": rsT[j].FONO,
				"Observacion": rsT[j].OBSERVACION
			};
			refPers.push(obj12);
		}
		query = 'SELECT *,replace(replace(participacion,\'N/A\',\'\'),\'%\',\'\') as PARTICIPACION2 FROM "' + objG.destinoSQL + '.data::clientes.relaciones" WHERE RUTREL = ?';
		rsT = oConnT.executeQuery(query,jsonout.RUT);
		let relaciones = [];
		for(let j = 0; j < rsT.length; j++) {
			var obj13 = {
				"Rut": (utility.checkFullNull(rsT[j].RUT) === null ? "" : rsT[j].RUT.substring(0,rsT[j].RUT.length - 1) ),
				"Dv": (utility.checkFullNull(rsT[j].RUT) === null ? "" : rsT[j].RUT.substring(rsT[j].RUT.length - 1,rsT[j].RUT.length) ),
				"Nombre": rsT[j].NOMBRE,
				"ApellidoPaterno": rsT[j].APATERNO,
				"ApellidoMaterno": rsT[j].AMATERNO,
				"IdTipoRelacion": rsT[j].TIPO,
				"PorcentParticipacion": rsT[j].PARTICIPACION2,
				"indFirmaPagare": rsT[j].PAGARE,
				"indFirmaMPrenda": rsT[j].PRENDA
			};
			relaciones.push(obj13);
		}			
		if (ingresos.length !== 0) {
			obj['Ingresos'] = ingresos;
		}       
		if (otroingresos.length !== 0) {
			obj['OtrosIngresos'] = otroingresos;
		} 	
		if (bienraiz.length !== 0) {
			obj['BienRaiz'] = bienraiz;
		}
		if (direccion.length !== 0) {
			obj['Direccion'] = direccion;
		}
	
		if (telefonos.length !== 0) {
			obj['Telefonos'] = telefonos;
		}
		if (iva.length !== 0) {
			obj['Iva'] = iva;
		}
		if (dai.length !== 0) { 
			obj['Dai'] = dai;
		}
		if (vehiculo.length !== 0) {
			obj['Vehiculo'] = vehiculo;
		}	
		if (refBanc.length !== 0) {
			obj['ReferenciaBancaria'] = refBanc;
		}	
		if (refPers.length !== 0) {
			obj['ReferenciaPersonal'] = refPers;
		}	
		if (relaciones.length !== 0) {
			obj['Relaciones'] = relaciones;
		}			
        sol.push(obj);
        oConnT.close();

 	if (err.length > 0 || sol.length === 0) {
		return ({
			code: 'error',
			msg: err
		});
	} else {
	    return ({
			code: 'ok',
			msg: sol
		});
	}
}
function leerIdentificacion(entrada,objG) {
    var oConnection = $.hdb.getConnection();
    let query, res = false;
 	query = 'SELECT * FROM "' + objG.destinoSQL + '.data::clientes.identificacion" WHERE RUT = ?';
	var rs = oConnection.executeQuery(query,entrada.RUT);
	if(rs.length > 0) { res = true;}
   oConnection.close();
   return res;
}

function actualizarIdentificacion(entrada,objG,jsonout) {
    var conn = $.hdb.getConnection();
    var res = false;
    let query;
    let arry = [];

    query = 'UPDATE "' + objG.destinoSQL + '.data::clientes.identificacion"'
    + ' SET NOMBRE = ?, APATERNO = ?, AMATERNO = ?, MAIL = ?, FECHANAC = ?, FECHA_INICIO_ACTIVIDAD = ?, ESTADOCIVIL = 324 WHERE RUT = ?';
    arry.push([entrada.NOMBRE,
            entrada.APE_PATERNO,
            entrada.APE_MATERNO,
            entrada.CORREO,
            entrada.FECHA_NACIMIENTO,
            entrada.FECHALABORAL,
            entrada.RUT.toString().toUpperCase()
            ]);    
  
    try{
     	 conn.executeUpdate(query,arry);
 		 conn.commit();
 		 res = true;
       }catch(e) {
         jsonout.error.push('Actualizar Datos Identificación' + e.message);
    }
    conn.close();   
    return res;
}
function crearIdentificacion(entrada,objG,jsonout) {
    var oConnection = $.hdb.getConnection();
    let arry = [];
    var res = false;
    let query = 'INSERT INTO "' + objG.destinoSQL + '.data::clientes.identificacion"'
        + ' (RUT,NOMBRE,APATERNO,AMATERNO,MAIL,FECHANAC,CHECKEMPRESA,FECHA_INICIO_ACTIVIDAD,ESTADOCIVIL)'
        + ' VALUES(?,?,?,?,?,?,?,?,324)';
    arry.push([entrada.RUT.toString().toUpperCase(), 
            entrada.NOMBRE,
            entrada.APE_PATERNO,
            entrada.APE_MATERNO,
            entrada.CORREO,
            entrada.FECHA_NACIMIENTO,
            null,
            entrada.FECHALABORAL
            ]);    
    try{
     	 oConnection.executeUpdate(query,arry);
 		 oConnection.commit();
 		 res = true;
       }catch(e) {
        jsonout.error.push('Crear Datos Identificación' + e.message);
    }
    oConnection.close();
    return res;
}
function crearOtros(entrada,objG,jsonout) {
    try{
        $.import("CL_PACKAGE_PACE_DEV.procedures", "utility");	
        var utility = $.CL_PACKAGE_PACE_DEV.procedures.utility; 
        var oConnection = $.hdb.getConnection();
        let arry = [];
        var res = false;
    
        let query = 'INSERT INTO "' + objG.destinoSQL + '.data::clientes.otroingreso"'
            + ' (K_OTROINGRESO,RUT,TIPOOTRO,DESCRIPCIONOTRO,OTROINGRESO,NTIPOOTRO)'
            + ' VALUES(?,?,?,?,?,?)';
    
        arry.push([utility.checkCampo(entrada.IDOTROINGRESOS, 'N'),
                entrada.RUT,
                5,
                entrada.DESCRIPCIONDEPEN,
                utility.checkCampo(entrada.INGRESO, 'N'), 
                'OTRO']);    
     	 oConnection.executeUpdate(query,arry);
 		 oConnection.commit();
 		 res = true;
       }catch(e) {
        jsonout.error.push('Crear Otros Ingresos' + e.message);
    }
    oConnection.close();
    return res;
}
function deleteOtros(entrada,objG,jsonout) {
    $.import("CL_PACKAGE_PACE_DEV.procedures", "utility");	
    var utility = $.CL_PACKAGE_PACE_DEV.procedures.utility; 
    var oConnection = $.hdb.getConnection();
    let arry = [];
    var res = false;
    let query = 'DELETE FROM "' + objG.destinoSQL + '.data::clientes.otroingreso"'
        + ' WHERE RUT = ?';
    arry.push([entrada.RUT.toString().toUpperCase()]);    
//   jsonout.Error.push(query);
//   jsonout.Error.push(arry);
    try{
     	 oConnection.executeUpdate(query,arry);
 		 oConnection.commit();
 		 res = true;
       }catch(e) {
        jsonout.Error.push('Delete Otros Ingresos' + e.message);
    }
    oConnection.close();
    return res;
}
function leerFonos(entrada,objG,jsonout) {
    $.import("CL_PACKAGE_PACE_DEV.procedures", "utility");	
    var utility = $.CL_PACKAGE_PACE_DEV.procedures.utility; 
    var oConnection = $.hdb.getConnection();
    var res = false;
    let query = 'SELECT * FROM "' + objG.destinoSQL + '.data::clientes.fonos"'
        + ' WHERE FONO = ? AND RUT = ?';
    try{
      	 var rs = oConnection.executeQuery(query,utility.checkCampo(entrada.TELEFONO, 'N'),entrada.RUT.toString().toUpperCase());
   	 	 if(rs.length > 0) { res = true;}
       }catch(e) {
         jsonout.Error.push('Leer Datos Fonos' + e.message);
    }
    oConnection.close();
    return res;
}
function crearFonos(entrada,objG,jsonout) {
    $.import("CL_PACKAGE_PACE_DEV.procedures", "utility");	
    var utility = $.CL_PACKAGE_PACE_DEV.procedures.utility; 
    var oConnection = $.hdb.getConnection();
    let arry = [];
    var res = false;
    let query = 'INSERT INTO "' + objG.destinoSQL + '.data::clientes.fonos"'
        + ' (FONO,RUT,NIVEL,TIPO,ID)'
        + ' VALUES(?,?,?,?,?)';
    arry.push([utility.checkCampo(entrada.TELEFONO, 'N'), 
            entrada.RUT.toString().toUpperCase(),
            'P',
            1,
            1]);    
    try{
     	 oConnection.executeUpdate(query,arry);
 		 oConnection.commit();
 		 res = true;
       }catch(e) {
        jsonout.error.push('Crear Datos Fonos' + e.message);
    }
    oConnection.close();
    return res;
}
function crearIngresosLiquido(entrada,objG,jsonout) {
    var oConnection = $.hdb.getConnection();
    let arry = [];
    var res = false;
    let query = 'INSERT INTO "' + objG.destinoSQL + '.data::clientes.ingresosliq"'
        + ' (INGRESOSLIQ,RUT,EMPLEADOR,RUTEMP,FONOEMP,DIRECCIONEMP,REGIONEMP,CIUDADEMP,'  
        + 'COMUNAEMP,CARGO,ACTIVIDAD,TIPOCONT,TIPOREMU,INGRESOLIQ,OBSERVACION)'
        + ' VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    arry.push([entrada.IDOTROINGRESOSLIQ, 
            entrada.RUT.toString().toUpperCase(),
            null, // EMPLEADOR
            null, // RUTEMP
            null, // FINIEMP
            null, // DIRECCIONEMP   
            null, // REGIONEMP
            null, // CIUDADEMP
            null, // COMUNAEMP
            null, // CARGO
            null, // ACTIVIDAD
            null, // TIPOCONT 1
            null, // TIPOREMU 1
            entrada.INGRESO, // INGRESOLIQ
            'Affinity ONLINE' // OBSERVACION
            ]);    
    try{
     	 oConnection.executeUpdate(query,arry);
 		 oConnection.commit();
 		 res = true;
       }catch(e) {
        jsonout.error.push('Crear Datos IngresoLiquidos' + e.message);
    }
    oConnection.close();
    return res;
}
function deleteIngresosLiquido(entrada,objG,jsonout) {
    $.import("CL_PACKAGE_PACE_DEV.procedures", "utility");	
    var utility = $.CL_PACKAGE_PACE_DEV.procedures.utility; 
    var oConnection = $.hdb.getConnection();
    let arry = [];
    var res = false;
    let query = 'DELETE FROM "' + objG.destinoSQL + '.data::clientes.ingresosliq"'
        + ' WHERE RUT = ?';
    arry.push([entrada.RUT.toString().toUpperCase()]);    
//   jsonout.Error.push(query);
//   jsonout.Error.push(arry);
    try{
     	 oConnection.executeUpdate(query,arry);
 		 oConnection.commit();
 		 res = true;
       }catch(e) {
        jsonout.error.push('Delete Ingresos Liquidos' + e.message);
    }
    oConnection.close();
    return res;
}
function deleteFonos(entrada,objG,jsonout) {
    var oConnection = $.hdb.getConnection();
    let arry = [];
    var res = false;
    let query = 'DELETE FROM "' + objG.destinoSQL + '.data::clientes.fonos"'
        + ' WHERE RUT = ? AND NIVEL = ?';
    arry.push([entrada.RUT.toString().toUpperCase(),'P']);    
    try{
     	 oConnection.executeUpdate(query,arry);
 		 oConnection.commit();
 		 res = true;
       }catch(e) {
        jsonout.error.push('Delete de Fono' + e.message);
    }
    oConnection.close();
    return res;
}