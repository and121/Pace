var oConnection = $.hdb.getConnection();
$.import("CL_DP_AFI_DEALER_PACKAGE_PRD.procedures", "utility");	
var utility = $.CL_DP_AFI_DEALER_PACKAGE_PRD.procedures.utility;
function leerCot(id,destinoSQL) {
	id = parseInt(id, 10);
	var query = 'SELECT '
	        + ' COT.SEGURO,COT.RUT,COT.DISTRIBUIDOR,COT.SUCURSAL,COT.ID_EJECUTIVO_SAP,COT.USUARIOSAP,COT.ID_VENDEDOR,'
	        + ' COT.ANOVEH,COT.MODELO,COT.VERSIONVEH,COT.TESTDRIVE,COT.CANTIDAD,COT.ADICIONALES,COT.VALORVEH,COT.CONTADO,COT.RETOMA,COT.VALORTOTAL,COT.IDPRODUCTO,'
	        + ' COT.FORMAPAGO,COT.INTASEGURABLE,COT.USOESPECIFICO,COT.CUOTAS,COT.OBSERVACION,COT.AUX1,COT.AUX2,COT.AFFINITY AS ORIGEN,'
	        + ' COT.ID_ADJUDICACION,COT.OBSERVACIONSOL,COT.ID_ESTADO,COT.ID_AFFINITY,COT.ID_PADRE_AFFINITY,COT.ACCION,'
	        + ' COT.ID_ORIGEN_AFFINITY,COT.LEAD,COT.FLOTAS,COT.RENOVACIONES,'
	        + ' (SELECT ID_COT_FINANCIERA FROM "' + destinoSQL + '.data::cotizaciones.referencias" WHERE ID_EMPRESA = 2 AND ID_AFFINITY = COT.ID_AFFINITY) AS NUMERO_OPERACION,'
	        + ' TO_VARCHAR (COT.FECHA, \'DD/MM/YYYY\')  as FECHA,'
	        + '(SELECT max(ID_AFFINITY) FROM "' + destinoSQL + '.data::cotizaciones.cotizacion" WHERE ID_PADRE_AFFINITY = COT.ID_AFFINITY ) AS ID_HIJO_AFFINITY,'
	        + ' TO_VARCHAR (COT.FECHASOLICITADA, \'DD/MM/YYYY\')  as FECHASOLICITADA,'
	        + 'COT.FECHASOLICITADA AS FECHASOLICITADA_FULL,'
	        + ' TO_VARCHAR (COT.PAGO, \'DD/MM/YYYY\')  as PAGO,'
	        + ' TO_VARCHAR (COT.PAGARE, \'DD/MM/YYYY\')  as PAGARE,'
	        + ' (SELECT NOMBRE_CREDITO FROM "' + destinoSQL + '.data::maestro.creditos" WHERE ID_CREDITO = COT.IDPRODUCTO) AS PRODUCTO,'
	        + ' ( SELECT GASTOSOPERACIONALES FROM "' + destinoSQL + '.data::cotizaciones.calculoCreditos" WHERE ID_AFFINITY = COT.ID_AFFINITY ) AS GASTOSOPERACIONALES,'
	        + ' ( SELECT TotalFinanciar FROM "' + destinoSQL + '.data::cotizaciones.calculoCreditos" WHERE ID_AFFINITY = COT.ID_AFFINITY ) AS TOTALFIN,'
	        + ' ( SELECT TasaMensual FROM "' + destinoSQL + '.data::cotizaciones.calculoCreditos" WHERE ID_AFFINITY = COT.ID_AFFINITY ) AS TASAMENS,'
	        + ' ( SELECT ValorCuota FROM "' + destinoSQL + '.data::cotizaciones.calculoCreditos" WHERE ID_AFFINITY = COT.ID_AFFINITY ) AS CUOTA,'
	        + ' ( SELECT VFMG FROM "' + destinoSQL + '.data::cotizaciones.calculoCreditos" WHERE ID_AFFINITY = COT.ID_AFFINITY ) AS VFMG,'
	        + ' ( SELECT PreEval FROM "' + destinoSQL + '.data::cotizaciones.calculoCreditos" WHERE ID_AFFINITY = COT.ID_AFFINITY ) AS PREEVAL,'
	        + ' ( SELECT PRCEVAL FROM "' + destinoSQL + '.data::cotizaciones.calculoCreditos" WHERE ID_AFFINITY = COT.ID_AFFINITY ) AS PRCEVAL,'
	        + ' ( SELECT VALORCAE FROM "' + destinoSQL + '.data::cotizaciones.calculoCreditos" WHERE ID_AFFINITY = COT.ID_AFFINITY ) AS VALOR_CAE,'
	        + ' ( SELECT VALORIMPUESTO FROM "' + destinoSQL + '.data::cotizaciones.calculoCreditos" WHERE ID_AFFINITY = COT.ID_AFFINITY ) AS VALOR_IMPUESTO,'
	        + ' ( SELECT ValorSegVida FROM "' + destinoSQL + '.data::cotizaciones.calculoCreditos" WHERE ID_AFFINITY = COT.ID_AFFINITY ) AS ValorSegVida,'
	        + ' ( SELECT ValorSegCesantia FROM "' + destinoSQL + '.data::cotizaciones.calculoCreditos" WHERE ID_AFFINITY = COT.ID_AFFINITY ) AS ValorSegCesantia,'
	        + ' ( SELECT ValorSegTriple FROM "' + destinoSQL + '.data::cotizaciones.calculoCreditos" WHERE ID_AFFINITY = COT.ID_AFFINITY ) AS ValorSegTriple,'
	        + ' ( SELECT ValorSegAsistenciaRuta FROM "' + destinoSQL + '.data::cotizaciones.calculoCreditos" WHERE ID_AFFINITY = COT.ID_AFFINITY ) AS ValorSegAsistenciaRuta,'
            + ' ( SELECT ValorSegDesgravamen FROM "' + destinoSQL + '.data::cotizaciones.calculoCreditos" WHERE ID_AFFINITY = COT.ID_AFFINITY ) AS ValorSegDesgravamen,'	        
	        + ' ( SELECT Valor_SegAsistenciaMedica FROM "' + destinoSQL + '.data::cotizaciones.calculoCreditos" WHERE ID_AFFINITY = COT.ID_AFFINITY ) AS ValorSegAsistenciaMedica,'
	        + ' (SELECT NOMBRE_ESTADO FROM "' + destinoSQL + '.data::maestro.estados" WHERE ID_EMPRESA = 0 AND ID_ESTADO = COT.ID_ESTADO) AS ESTADO,'
	        + ' (SELECT NOMBRE_VERSION FROM "' + destinoSQL + '.data::maestro.versiones" WHERE ID_VERSION = COT.VERSIONVEH AND ID_MODELO = COT.MODELO) AS NOMBRE_VERSION,'
	        + ' (SELECT NOMBRE_MODELO FROM "' + destinoSQL + '.data::maestro.modelos" WHERE ID_MODELO = COT.MODELO) AS NOMBRE_MODELO,'
            // + ' ( SELECT NOMBRESEG FROM  "' + destinoSQL + '.data::cotizaciones.seguros" where ID_AFFINITY = COT.ID_AFFINITY and ID_EMPRESA = 0) AS NOMBRE_SEGURO,'	
            // + ' ( SELECT SEGURO FROM  "' + destinoSQL + '.data::cotizaciones.seguros" where ID_AFFINITY = COT.ID_AFFINITY and ID_EMPRESA = 0) AS COD_SEGURO,'	
            + ' ( SELECT NOMBRE FROM "' + destinoSQL + '.data::maestro.usuario" WHERE ID_SAP = COT.USUARIOSAP) AS NOMBRE_VENDEDOR,'
            + ' ( SELECT APELLIDO FROM "' + destinoSQL + '.data::maestro.usuario" WHERE ID_SAP = COT.USUARIOSAP) AS APELLIDO_VENDEDOR,'
            + ' ( SELECT TELEFONO FROM "' + destinoSQL + '.data::maestro.usuario" WHERE ID_SAP = COT.USUARIOSAP) AS TELEFONO_VENDEDOR,'
            + ' ( SELECT NOMBRE FROM "' + destinoSQL + '.data::maestro.usuario" WHERE ID_SAP = COT.ID_EJECUTIVO_SAP) AS NOMBRE_EJECUTIVO,'
            + ' ( SELECT APELLIDO FROM "' + destinoSQL + '.data::maestro.usuario" WHERE ID_SAP = COT.ID_EJECUTIVO_SAP) AS APELLIDO_EJECUTIVO'
            //+ ' ( SELECT NOMBRE_SUCURSAL FROM "' + destinoSQL + '.data::maestro.sucursal" WHERE ID_SAP = ID_EJECUTIVO_SAP) AS NOMBRE_SUCURSAL'
            + ' FROM "' + destinoSQL + '.data::cotizaciones.cotizacion" AS COT'
            + ' WHERE ID_AFFINITY = ?';
	try {
	    var rs = oConnection.executeQuery(query, id);
		return rs;
	} catch (e) {
		return e.message;
	}
}
//Leer datos de seguro por documento
//
function leerSeguro(id,destinoSQL){
    	id = parseInt(id, 10);
	var query = 'SELECT *'
	            + ' FROM "' + destinoSQL + '.data::cotizaciones.seguros"'
	            + ' WHERE ID_AFFINITY = ? AND ID_EMPRESA = 0',arr = [];
	try {
	    var rs = oConnection.executeQuery(query, id);
	    for(var i = 0; i < rs.length; i++)
	    {
	       // arr.push(rs[i]);
	       arr = rs[i];
	    }
		return arr;
	} catch (e) {
		return arr;
	}    
}
// leer carro de compra por documento
//
function leerCarro(id,destinoSQL)
{
    	id = parseInt(id, 10);
	var query = 'SELECT *'
	            + ' FROM "' + destinoSQL + '.data::cotizaciones.carroCompra"'
	            + ' WHERE ID_AFFINITY = ? AND ID_EMPRESA = 0',arr = [];
	try {
	    var rs = oConnection.executeQuery(query, id);
	    for(var i = 0; i < rs.length; i++)
	    {
	        arr.push(rs[i]);
	    }
		return arr;
	} catch (e) {
		return arr;
	}
}
// leer carro de compra por documento
//
function leerCuotas(id,destinoSQL)
{
    	id = parseInt(id, 10);
	var query = 'SELECT *, TO_VARCHAR (FECHA, \'DD/MM/YYYY\')  as FECHA_PAGO'
	            + ' FROM "' + destinoSQL + '.data::cotizaciones.cuotas"'
	            + ' WHERE ID_AFFINITY = ? AND ID_EMPRESA = 0',
	   arr = [];
	try {
	    var rs = oConnection.executeQuery(query, id);
	    for(var i = 0; i < rs.length; i++){
	        arr.push(rs[i]);
	    }
		return arr;
	} catch (e) {
		return e.message;
	}
}
//Leer ID externo de documento
//
//
function leerIdExternoCot(id,idEmpresa,destinoSQL)
{
    // 	id = parseInt(id, 10);
	var query = 'SELECT *'
	            + ' FROM "' + destinoSQL + '.data::cotizaciones.referencias"'
	            + ' WHERE ID_AFFINITY = ? AND ID_EMPRESA = ?';
	try {
	    var rs = oConnection.executeQuery(query, id,idEmpresa);
	    
	    return (rs.length !== 0 ? rs[0].ID_COT_FINANCIERA : -1);
	} catch (e) {
		return e.message;
	}
}
function validarCot(jsonIn,destinoSQL,idCotF)
{
    if(utility.checkNull(idCotF) !== null && utility.checkNull(jsonIn.ID_AFFINITY) !== null && utility.checkNull(jsonIn.IdEmpresa) !== null){
    	let query = 'SELECT ID_AFFINITY'
    	            + ' FROM "' + destinoSQL + '.data::cotizaciones.referencias"'
    	            + ' WHERE ID_COT_FINANCIERA = ?'
    	            + ' AND ID_EMPRESA = ?'
    	            + ' AND ID_AFFINITY = ?';
    	try {
    	    let rs = oConnection.executeQuery(query, parseInt(idCotF,10),parseInt(jsonIn.IdEmpresa,10),parseInt(jsonIn.ID_AFFINITY,10));
    		return rs.length;
    	} catch (e) {
            jsonIn.error.push({Description:e.message,
                                message:e.message,
                                TIPO_ERROR:e.name,
                                LOG_ERROR:"Validar relacion",
                                Data:[idCotF,jsonIn.ID_AFFINITY,jsonIn.IdEmpresa],
                                Code:500});    	    
    		return 0;
    	}           
    }else{
        return 0;
    }
    
}
//Validar documento no posea estado affinity especifico
// ->Verdadero, no tiene el estado
//
function validarAdjudicado(id,destinoSQL,idEstado)
{
    let idT,query,rs;
    idT = parseInt(id, 10);
    if(utility.checkFullNull(idT) === null){
        return true;
    }else{
    	query = 'SELECT FECHASOLICITADA'
    	            + ' FROM "' + destinoSQL + '.data::cotizaciones.cotizacion"'
    	            + ' WHERE ID_AFFINITY = ? AND ID_ESTADO IN (' + idEstado + ')';
    	try {
    	    rs = oConnection.executeQuery(query, idT);
    		return (rs.length > 0 ? false : true);
    	} catch (e) {
    		return true;
    	}        
    }
    
}
//Validar existencia de Estado en maestro
//
//
function validarExistenciaEdo (idEmpresa,idEstado,destinoSQL){
    let idE,query,rs;
    idE = parseInt(idEmpresa, 10);
	query = 'SELECT ID_ESTADO'
	            + ' FROM "' + destinoSQL + '.data::maestro.estados"'
	            + ' WHERE ID_ESTADO = ? AND ID_EMPRESA = ?';
	try {
	    rs = oConnection.executeQuery(query, idEstado,idE);
		return rs.length;
	} catch (e) {
		return 0;
	} 
}
//Estados entidad financiera
//
function getEstadosP(jsonOut,jsonGen){
let tQuery = 'SELECT edo.*, '
        + ' (select FECHASOLICITADA FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion" where id_affinity = edo.ID_AFFINITY) as FECHASOLICITADA,'
        + ' (SECONDS_BETWEEN((select FECHASOLICITADA FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion" where id_affinity = edo.ID_AFFINITY), edo.FECHA))/60 as DIF,'
        + ' (SECONDS_BETWEEN((select FECHASOLICITADA FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion" where id_affinity = edo.ID_AFFINITY),UTCTOLOCAL( CURRENT_UTCTIMESTAMP,\'UTC-4\' )))/60 as DIFINI,'
        + ' (SELECT PRIORIDAD FROM "' + jsonGen.destinoSQL + '.data::maestro.empresas" WHERE ID_EMPRESA = edo.id_empresa) as PRIORIDAD,'
        + ' (SELECT ADJUDICACION FROM "' + jsonGen.destinoSQL + '.data::maestro.empresas" WHERE ID_EMPRESA = edo.id_empresa) as ADJUDICACION,'
        + ' UPPER((SELECT DESCRIPCION FROM "' + jsonGen.destinoSQL + '.data::maestro.empresas" WHERE ID_EMPRESA = edo.id_empresa)) as DESCRIPCION,'
        + ' (SELECT NOMBRE_ESTADO FROM "' + jsonGen.destinoSQL + '.data::maestro.estados" WHERE ID_EMPRESA = edo.id_empresa and id_ESTADO = edo.Id_ESTADO) as NOMBRE_ESTADO'
        + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.historialEstadosCotizacion" as edo WHERE edo.ID_AFFINITY = ? AND '
        + ' edo.ID_EMPRESA IN (' + jsonOut.Empresas + ')'
        + ' edo.PROCESADO = 0'
        + ' ORDER BY edo.FECHA ASC',
        conn = $.hdb.getConnection(); 
        try{
            var rs = conn.executeQuery(tQuery, jsonOut.ID_AFFINITY);
            if(rs.length > 0)
            {
                for(let i = 0 ; i < rs.length ; i++)
                {
                    jsonOut.estadosP.push(rs[i]);                    
                }                
                return true;
            }
            else{
                jsonOut.Status = 500;
                return false;
            }
            
        }catch(e){
            jsonOut.Status = 500;
            jsonOut.error.push({Description:e.message,
                                message:e.message,
                                TIPO_ERROR:e.name,
                                LOG_ERROR:"Estado por Cotizacion",
                                Data:tQuery,
                                array:[jsonOut.ID_AFFINITY],
                                Code:500});
            return false;
        }
}
//Buscar fecha de envio a solicitar y diferencia de tiempo
//
function getTiempoSol(jsonOut,jsonGen){
let tQuery = 'SELECT FECHASOLICITADA,'
        + ' (SECONDS_BETWEEN(FECHASOLICITADA,UTCTOLOCAL( CURRENT_UTCTIMESTAMP,\'UTC-4\' )))/60 as DIF'
        + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion" WHERE ID_AFFINITY = ?'
        + ' AND FECHASOLICITADA IS NOT NULL',
        conn = $.hdb.getConnection(); 
        try{
            var rs = conn.executeQuery(tQuery, jsonOut.ID_AFFINITY);
            if(rs.length > 0)
            {
                for(let i = 0 ; i < rs.length ; i++)
                {
                    jsonOut.tiempoSol.push(rs[i]);                    
                }                
                return true;
            }
            else{
                return false;
            }
            
        }catch(e){
            jsonOut.error.push({Description:e.message,
                                message:e.message,
                                TIPO_ERROR:e.name,
                                LOG_ERROR:"Tiempo",
                                Data:tQuery,
                                array:[jsonOut.ID_AFFINITY],
                                Code:500});
            return false;
        }
    
}
//Verifica Estados de cotizacion para entidad financiera en historial de estado, sin importar fecha de cambio
//Guarda en jsonOut estos estados, en campo validarEstadosEF
//Retorna false si tiene el estado
function validarEstadosEF(jsonIn,jsonOut,jsonGen){
  if(utility.checkFullNull(jsonIn.IdAffinity) !== null){
    let tQuery = 'select * from "' + jsonGen.destinoSQL + '.data::cotizaciones.historialEstadosCotizacion"'
                + ' where id_estado IN' 
                + ' (select id_estado_financiera from "' + jsonGen.destinoSQL + '.data::maestro.homologacionEstados"' 
                    + ' where id_estado_interno in (' + jsonIn.IdEstadoInterno + ')'
                + ' and id_empresa in (SELECT id_empresa from "' + jsonGen.destinoSQL + '.data::maestro.empresas" where prioridad IN (' + jsonIn.Prioridad + ')))'
                + ' and id_empresa IN (SELECT id_empresa from "' + jsonGen.destinoSQL + '.data::maestro.empresas" where prioridad IN (' + jsonIn.Prioridad + '))'
                + ' and id_affinity = ?',
        conn = $.hdb.getConnection(),
        arrT = []; 
        try{
            var rs = conn.executeQuery(tQuery,jsonIn.IdAffinity);
            for( let i = 0; i < rs.length; i++ ){
                arrT.push({ID_AFFINITY:rs[i].ID_AFFINITY,
                    FECHA:rs[i].FECHA,
                    ID_EMPRESA:rs[i].ID_EMPRESA,
                    ID_ESTADO:rs[i].ID_ESTADO
                });
            }
            jsonOut.validarEstadosEF = arrT;
            if(rs.length > 0)
            {
                jsonOut.error.push({Description:'Documento ' + jsonIn.IdAffinity + ' Posee estado prelativo',
                    message:'Documento ' + jsonIn.IdAffinity + ' Posee estado prelativo',
                    Type: "E",
                    TIPO_ERROR:"ValidaEstadoEF",
                    LOG_ERROR:"validarEstadosEF - leerCotizacion",
                    Data:jsonIn,
                    Code:409}); 
                return false;
            }else
            {
                return true;
            }
        }catch(e){
            jsonOut.error.push({Description:e.message,
                                message:e.message,
                                TIPO_ERROR:e.type,
                                LOG_ERROR:"validarEstadosEF - leerCotizacion",
                                Data:jsonIn,
                                Code:500});
            return true;
        }
        finally{
            conn.close();
        }
            jsonOut.error.push({Description:'Documento ' + jsonIn.IdAffinity + ' Posee estado prelativo',
                            message:'Documento ' + jsonIn.IdAffinity + ' Posee estado prelativo',
                            Type: "E",
                            TIPO_ERROR:"ValidaEstadoEF",
                            LOG_ERROR:"validarEstadosEF - leerCotizacion",
                            Data:jsonIn,
                            Code:409});
            jsonOut.Status = 500;
            
        return false;
  }else{
      return true;
  }
}
// estados entidad financiera opcional
//
function getEstadosEFO(idAffinity,jsonOut,jsonGen){
let tQuery = 'SELECT edo.*, '
        + ' (select FECHASOLICITADA FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion" where id_affinity = edo.ID_AFFINITY) as FECHASOLICITADA,'
        + ' (SECONDS_BETWEEN((select FECHASOLICITADA FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion" where id_affinity = edo.ID_AFFINITY), edo.FECHA))/60 as DIF,'
        + ' (SECONDS_BETWEEN((select FECHASOLICITADA FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion" where id_affinity = edo.ID_AFFINITY),UTCTOLOCAL( CURRENT_UTCTIMESTAMP,\'UTC-4\' )))/60 as DIFINI'
        + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.historialEstadosCotizacion" as edo '
        + ' WHERE edo.ID_AFFINITY = ?'
        + ' AND edo.ID_EMPRESA = (SELECT ID_EMPRESA FROM "' + jsonGen.destinoSQL + '.data::maestro.empresas" where prioridad = 2)'
        + ' AND edo.ID_ESTADO NOT IN (27,8)',
        conn = $.hdb.getConnection(); 
        try{
            var rs = conn.executeQuery(tQuery, idAffinity);
            for(let i = 0 ; i < rs.length ; i++)
            {
                jsonOut.estadosEFO.push(rs[i]);                    
            }           
        }catch(e){
            jsonOut.error.push({Description:e.message,
                                message:e.message,
                                TIPO_ERROR:e.name,
                                LOG_ERROR:"Estado por Cotizacion",
                                Data:tQuery,
                                Code:500});
        }
        finally{
            conn.close();
        }
}
//Valida que los rut sean los mismo entre cotizacion padre e hijo
//
function validarPadre(jsonIn,jsonOut,jsonGen){
  if(utility.checkFullNull(jsonIn.IdAffinityPadre) !== null){
    let tQuery = 'SELECT ACCION,ID_PADRE_AFFINITY '
        + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion"'
        + ' WHERE ID_AFFINITY = ?'
        + ' AND RUT = ?',
        conn = $.hdb.getConnection(); 
        try{
            var rs = conn.executeQuery(tQuery, jsonIn.IdAffinityPadre,jsonIn.Rut.replace(/[\.\-]/g,''));
            if(rs.length > 0)
            {
                return true;
            }else
            {
                jsonOut.error.push({Description:'Rut ' + jsonIn.Rut + ' No pertenece a Padre Affinity: ' + jsonIn.IdAffinityPadre,
                    message:'Rut ' + jsonIn.Rut + ' No pertenece a Padre Affinity: ' + jsonIn.IdAffinityPadre,
                    Type: "E",
                    TIPO_ERROR:"Relacion",
                    LOG_ERROR:"validarPadre - leerCotizacion",
                    Data:jsonIn,
                    Code:409}); 
        	    jsonOut.respuesta = {
        	        "return": {
        			"code": "400",
        			"message": [
        				{
        					"Type": "E",
        					"Code": "420",
        					"Description": 'Rut ' + jsonIn.Rut + ' No pertenece a Padre Affinity: ' + jsonIn.IdAffinityPadre
        				}
        			]
            		},
            		"body": null
        	    };	                    
                return false;
            }
        }catch(e){
            jsonOut.error.push({Description:e.message,
                                message:e.message,
                                TIPO_ERROR:e.type,
                                LOG_ERROR:"validarPadre - leerCotizacion",
                                Data:jsonIn,
                                Code:500});
            return false;
        }
        finally{
            conn.close();
        }
            jsonOut.error.push({Description:'Rut ' + jsonIn.Rut + ' No pertenece a Padre Affinity: ' + jsonIn.IdAffinityPadre,
                                message:'Rut ' + jsonIn.Rut + ' No pertenece a Padre Affinity: ' + jsonIn.IdAffinityPadre,
                                TIPO_ERROR:"Relacion",
                                LOG_ERROR:"validarPadre - leerCotizacion",
                                Data:jsonIn,
                                Code:409});
            jsonOut.Status = 500;
            
        return false;
  }else{
      return true;
  }
}
//Valida que el ID_PADRE no posea un hijo
//
function validarExistenciaHijo(jsonIn,jsonOut,jsonGen){
  if(utility.checkFullNull(jsonIn.IdAffinityPadre) !== null){
    let tQuery = 'SELECT ACCION,ID_PADRE_AFFINITY '
        + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion"'
        + ' WHERE ID_PADRE_AFFINITY = ?',
        conn = $.hdb.getConnection(); 
        try{
            var rsT = conn.executeQuery(tQuery, jsonIn.IdAffinityPadre);
            if(rsT.length > 0)
            {
                jsonOut.error.push({Description:'Documento Affinity: ' + jsonIn.IdAffinityPadre + ' Apelado/Modificado anteriormente',
                    message:'Documento Affinity: ' + jsonIn.IdAffinityPadre + ' Apelado/Modificado anteriormente',
                    TIPO_ERROR:"Relacion",
                    LOG_ERROR:"validarExistenciaHijo - leerCotizacion",
                    Data:jsonIn,
                    Code:409});     
        	    jsonOut.respuesta = {
        	        "return": {
        			"code": "400",
        			"message": [
        				{
        					"Type": "E",
        					"Code": "421",
        					"Description": 'Documento Affinity: ' + jsonIn.IdAffinityPadre + ' Apelado/Modificado anteriormente'
        				}
        			]
            		},
            		"body": null
        	    };                    
                jsonOut.Status = 500;
                    return false;
            }else
            {
                 
                    return true;
               
            }
        }catch(e){
            jsonOut.error.push({Description:e.message,
                                message:e.message,
                                TIPO_ERROR:e.type,
                                LOG_ERROR:"validarExistenciaHijo - leerCotizacion",
                                Data:jsonIn,
                                Code:500});
            return true;
        }
        finally{
            conn.close();
        }
        return true;
  }else{
      return true;
  }
}
//Obetner la fecha de solicitud de documento de documento padre
//cuando es modificacion
function getTiempoApelacion(idAffinity,jsonOut,jsonGen){
let tQuery = 'SELECT ACCION,ID_PADRE_AFFINITY '
        + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion"'
        + ' WHERE ID_AFFINITY = ?',
        conn = $.hdb.getConnection(), fecha = null; 
        try{
            
            var rs = conn.executeQuery(tQuery, idAffinity);
            
            for(let i = 0 ; i < rs.length ; i++)
            {
                tQuery = 'SELECT FECHASOLICITADA,ID_ESTADO,'
                    + ' (ADD_SECONDS(UTCTOLOCAL( CURRENT_UTCTIMESTAMP,\'UTC-4\'),(select ((TIMEOUT * 60) * -1) FROM "' + jsonGen.destinoSQL + '.data::maestro.parametros" where TEXTO_PARAMETRO = \'RESPUESTA_FINANCIERA\'))) as FECHASOLICITADA2'
                    + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion"'
                    + ' WHERE ID_AFFINITY = ?';
                var rs2 = conn.executeQuery(tQuery, rs[i].ID_PADRE_AFFINITY);
                if(rs2.length > 0){
                    if(rs2[0].ID_ESTADO === 1002)
                    {
                        fecha = rs2[0].FECHASOLICITADA2;           
                    }else if(rs2[0].ID_ESTADO === 1009 || rs2[0].ID_ESTADO === 1008 || rs2[0].ID_ESTADO === 1005)
                    {
                        fecha = rs2[0].FECHASOLICITADA;
                    }
                }
            }           
        }catch(e){
            jsonOut.error.push({Description:e.message,
                                message:e.message,
                                TIPO_ERROR:e.name,
                                LOG_ERROR:"Tiempo Apelacion - leerCotizacion",
                                Data:tQuery,
                                Code:500});
        }
        finally{
            conn.close();
        }
        return fecha;
}
//Valida que la cotizacion no se repita
//relacion -> DISTRIBUIDOR/SUCURSAL/RUT/MODELO/VERSION
function validarDuplicado(jsonIn,jsonOut,jsonGen){
    let conn = $.hdb.getConnection(),rsT,tQuery,Description = '';
    if(utility.checkFullNull(jsonIn.IdAffinity) !== null){
        tQuery = 'SELECT ID_AFFINITY '
            + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion"'
            + ' WHERE DISTRIBUIDOR = ?'
            + ' AND SUCURSAL = ?'
            + ' AND RUT = ?'
            + ' AND MODELO = ?'
            + ' AND VERSIONVEH = ?'
            + ' AND ID_ESTADO NOT IN (1003,1004,1006,1005,1100,1101,1102,1103,1104,1105)'
            + ' AND ID_ORIGEN_AFFINITY NOT IN'
            + ' (SELECT ID_ORIGEN_AFFINITY FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion" WHERE ID_AFFINITY = ?)'
            + ' AND FECHA >= ADD_DAYS(UTCTOLOCAL( CURRENT_UTCTIMESTAMP,\'UTC-4\' ),-30)'; 
        Description = 'Documento duplicado no se puede crear, Existe un documento mas reciente fuera de esta relación';
        try{
            rsT = conn.executeQuery(tQuery, jsonIn.IdDistribuidor,jsonIn.IdSucursal,jsonIn.RutCliente.replace(/[\.\-]/g,''),jsonIn.IdModelo,jsonIn.IdVersion,jsonIn.IdAffinity);
        }catch(e){
            jsonOut.error.push({Description:e.message,
                                message:e.message,
                                TIPO_ERROR:e.type,
                                LOG_ERROR:"validarDuplicado - leerCotizacion",
                                Data:jsonIn,
                                Code:500});
            return true;
        }
        // return true;
    }
    
    if(utility.checkFullNull(jsonIn.IdAffinityPadre) !== null){
        tQuery = 'SELECT ID_AFFINITY '
            + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion"'
            + ' WHERE DISTRIBUIDOR = ?'
            + ' AND SUCURSAL = ?'
            + ' AND RUT = ?'
            + ' AND MODELO = ?'
            + ' AND VERSIONVEH = ?'
            + ' AND ID_ESTADO NOT IN (1003,1004,1006,1005,1100,1101,1102,1103,1104,1105)'
            + ' AND ID_ORIGEN_AFFINITY NOT IN'
            + ' (SELECT ID_ORIGEN_AFFINITY FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion" WHERE ID_AFFINITY = ?)'
            + ' AND FECHA >= ADD_DAYS(UTCTOLOCAL( CURRENT_UTCTIMESTAMP,\'UTC-4\' ),-30)'; 
            Description = 'Documento duplicado no se puede crear, Existe un documento mas reciente fuera de esta relación';
        try{
            rsT = conn.executeQuery(tQuery, jsonIn.IdDistribuidor,jsonIn.IdSucursal,jsonIn.RutCliente.replace(/[\.\-]/g,''),jsonIn.IdModelo,jsonIn.IdVersion,jsonIn.IdAffinityPadre);
        }catch(e){
            jsonOut.error.push({Description:e.message,
                                message:e.message,
                                TIPO_ERROR:e.type,
                                LOG_ERROR:"validarDuplicado - leerCotizacion",
                                Data:jsonIn,
                                Code:500});
            return true;
        }
    }else if(utility.checkFullNull(jsonIn.IdAffinity) === null){
        tQuery = 'SELECT ID_AFFINITY '
            + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion"'
            + ' WHERE DISTRIBUIDOR = ?'
            + ' AND SUCURSAL = ?'
            + ' AND RUT = ?'
            + ' AND MODELO = ?'
            + ' AND VERSIONVEH = ?'
            + ' AND ID_ESTADO NOT IN (1003,1004,1006,1100,1101,1102,1103,1104,1105)'
            + ' AND FECHA >= ADD_DAYS(UTCTOLOCAL( CURRENT_UTCTIMESTAMP,\'UTC-4\' ),-30)'; 
            Description = 'Documento duplicado no se puede crear, existe un documento mas reciente'; 
        try{
            rsT = conn.executeQuery(tQuery, jsonIn.IdDistribuidor,jsonIn.IdSucursal,jsonIn.RutCliente.replace(/[\.\-]/g,''),jsonIn.IdModelo,jsonIn.IdVersion);
            
            
        }catch(e){
            jsonOut.error.push({Description:e.message,
                                message:e.message,
                                TIPO_ERROR:e.type,
                                LOG_ERROR:"validarDuplicado - leerCotizacion",
                                Data:jsonIn,
                                Code:500});
            return true;
        }
    }
    conn.close();
    if(rsT.length > 0)
    {
        jsonOut.error.push({Description:Description,
            message:Description,
            TIPO_ERROR:"Duplicidad",
            LOG_ERROR:"validarDuplicado - leerCotizacion",
            Data:rsT,
            Code:409});     
	    jsonOut.respuesta = {
	        "return": {
			"code": "400",
			"message": [
				{
					"Type": "E",
					"Code": "421",
					"Description": Description
				}
			]
    		},
    		"body": null
	    };                    
        jsonOut.Status = 500;
        return false;
    }else
    {
        return true;
    }    
    return true;
}
//Leer codigo referencia de entidad financiera
//
function leerReferencia(cot,jsonGen) {
    var oCon = $.hdb.getConnection();
    var json = {
        code:200,
        error:[],
        rs:""
    },query = "";
    if(cot !== '0')
    {
    	query = 'SELECT DISTINCT ID_AFFINITY' 
                + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.referencias"'
                + ' WHERE ID_EMPRESA = 4 AND ID_COT_FINANCIERA = 0 AND ID_AFFINITY = ?';
    }else{
    	query = 'SELECT DISTINCT ID_AFFINITY' 
                + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.referencias"'
                + ' WHERE ID_EMPRESA = 4 AND ID_COT_FINANCIERA = 0';      
    }
    if(jsonGen.modo === 'T'){
    	query = 'SELECT DISTINCT ID_AFFINITY' 
            + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.referencias"'
            + ' WHERE ID_AFFINITY = ?';  
    }    
	try {
	    var rs;
	    if(cot !== '0')
        {
	        rs = oCon.executeQuery(query,cot);
        }
        else
        {
            rs = oCon.executeQuery(query);
        }
        if(rs.length <= 0){
            json.code = 400;
            json.error.push({Code:410,Description:"NO existe cotizacion para enviar",Type:'W'});
        }else
        {
    		json.rs = rs;            
        }
	} catch (e) {
	    json.code = 500;
		json.error.push({Code:500,Description:e.message,Type:'E'});
	}
	oCon.close();
	return json;
}
function leerCotAutoFin(id,jsonGen) {
    var oCon = $.hdb.getConnection();
    var json = {
        code:"",
        error:[]
    };
	id = parseInt(id, 10);
	var query = 'SELECT DISTINCT ' +
	    ' COT.ID_AFFINITY, COT.FECHA, COT.SEGURO, COT.RUT, COT.DISTRIBUIDOR,' +
	    ' (SELECT NOMBRE_MODELO FROM "' + jsonGen.destinoSQL + '.data::maestro.modelos" WHERE ID_MODELO = COT.MODELO) AS NOMBRE_MODELO, ' + 
	    ' (SELECT NOMBRE_VERSION FROM "' + jsonGen.destinoSQL + '.data::maestro.versiones" WHERE ID_MODELO = COT.MODELO AND ID_VERSION = COT.VERSIONVEH) AS NOMBRE_VERSION,' + 
	    ' COT.SUCURSAL, COT.ID_VENDEDOR, COT.ANOVEH, COT.MODELO, COT.VERSIONVEH,' +
	    ' COT.TESTDRIVE, COT.CANTIDAD, COT.ADICIONALES, COT.VALORVEH, COT.CONTADO,' +
	    ' COT.RETOMA, COT.VALORTOTAL, COT.IDPRODUCTO, COT.PRODUCTO, COT.CUOTAS,' +
	    ' COT.PAGARE, COT.FORMAPAGO, COT.INTASEGURABLE, COT.USOESPECIFICO,COT.TIPO_CREDITO,' +
	    ' COT.OBSERVACION, COT.OBSERVACIONSOL, COT.ID_EJECUTIVO_SAP, COT.PAGO,COT.ID_PADRE_AFFINITY,COT.ACCION,' +
	    ' COT.LEAD,COT.FLOTAS,COT.RENOVACIONES,'+
	    ' CARCOM.ID_ELEMENTO AS CID_ELEMENTO, CARCOM.ID_EMPRESA AS CID_EMPRESA, CARCOM.NOMBRE_ELEMENTO,' +
	    ' CARCOM.NOMBRE_SUB_ELEMENTO, CARCOM.VALOR_UNITARIO, CARCOM.MODIFICADO,' +
	    ' CALCRE.ID_EMPRESA AS CALEMPRESA, CALCRE.GASTOSOPERACIONALES, CALCRE.TOTALFINANCIAR,' +
	    ' CALCRE.VALORCUOTA, CALCRE.VFMG, CALCRE.PREEVAL, CALCRE.PRCEVAL,' +
	    ' CALCRE.VALORUF, CALCRE.VALORCAE, CALCRE.VALORIMPUESTO, CALCRE.TASAMENSUAL,' +
	    ' CALCRE.VALORSEGDESGRAVAMEN, CALCRE.VALORSEGVIDA, CALCRE.VALORSEGCESANTIA,' +
        ' CALCRE.VALORSEGTRIPLE, CALCRE.VALORSEGASISTENCIARUTA,CALCRE.VALOR_SEGASISTENCIAMEDICA,' +
	    ' CALCRE.VALOR_BRUTO_SEGDESGRAVAMEN, CALCRE.VALOR_BRUTO_SEGVIDA, CALCRE.VALOR_BRUTO_SEGCESANTIA,' +
        ' CALCRE.VALOR_BRUTO_SEGTRIPLE, CALCRE.VALOR_BRUTO_SEGASISTENCIARUTA,CALCRE.VALOR_BRUTO_SEGASISTENCIAMEDICA,' +        
        ' SEGURO.ID_EMPRESA AS SEGEMPRESA, SEGURO.NOMBRESEG, SEGURO.SEGURO AS COD_SEGURO, SEGURO.DEDUCIBLE,' +
        ' SEGURO.PRIMA, SEGURO.PLAZO, SEGURO.MULTIANUAL,' +
        ' SEGURO.VALOR_TOTAL_SEGURO, SEGURO.VALOR_CUOTA_SEGURO,' +
        ' CUOTAS.CUOTA, CUOTAS.ID_EMPRESA AS CUOEMPRESA, CUOTAS.MONTO, CUOTAS.MONTOTOTAL,' +
        ' CUOTAS.MODIFICADOSN, CUOTAS.BLOQUEADOSN, CUOTAS.CUOTONSN, CUOTAS.AMORTIZACION,' +
        ' CUOTAS.MONTO_SALDO_CAPITAL, CUOTAS.MONTO_CUOTA_SEGURO,' +
        ' CUOTAS.MONTOINTERES' +
        '    FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion" AS COT' +
        '    LEFT JOIN "' + jsonGen.destinoSQL + '.data::cotizaciones.carroCompra" AS CARCOM' +
        '    ON CARCOM.ID_AFFINITY = COT.ID_AFFINITY' +
        '    LEFT JOIN "' + jsonGen.destinoSQL + '.data::cotizaciones.calculoCreditos" AS CALCRE' +
        '    ON CALCRE.ID_AFFINITY = COT.ID_AFFINITY' +
        '    LEFT JOIN "' + jsonGen.destinoSQL + '.data::cotizaciones.seguros" AS SEGURO' +
        '    ON SEGURO.ID_AFFINITY = COT.ID_AFFINITY' + 
        '    LEFT JOIN "' + jsonGen.destinoSQL + '.data::cotizaciones.cuotas" AS CUOTAS' +
        '    ON CUOTAS.ID_AFFINITY = COT.ID_AFFINITY' + 
        '    WHERE COT.ID_AFFINITY = ?';	
	try {
	    var rs = oCon.executeQuery(query, id);
		json.rs = rs;
	} catch (e) {
	    json.code = 500;
		json.error.push({Code:500,Description:e.message,Type:'E'});
	}
	oCon.close();
	return json;
}

function mapeoContizacion(cot, est) {
var Cabecera = {
                   IdAffinity: "",
                   Fecha:"",
                   Seguro:"",
                   Rut:"",
                   Distribuidor:"",
                   Sucursal:"",
                   Vendedor:"",
                   YearVeh:"",
                   Modelo:"",
                   NombreModelo:"",
                   VersionVeh:"",
                   NombreVersion:"",
                   TestDrive:"",
	         	   Cantidad: "",
           	 	   Adicionales: "",
        		   ValorVeh: "",
        		   Contado: "",
        		   Retoma: "",
        		   ValorTotal: "",
        		   IdProducto: "",
        		   Producto: "",
        		   Cuotas: "",
        		   Pagare: "",
        		   FormaPago: "",
        		   FechaPago: "",
        		   IntAsegurable: "",
        		   UsoEspecifico: "",
        		   Observacion: "",
        		   ObservacionSol: "",
        		   IdEjecutivo: "",
        		   TipoCredito:"",
        		   IdAffinityPadre:"",
        		   Accion:"",
        		   Lead:"",
        		   Flotas:"",
        		   Renovaciones:""

};
var DetalleCredito = {
            GastosOperacionales: "",
            TotalFinanciar : "",
            ValorCuota : "",
            Vfmg : "",
            PreEval : "",
            PrcEval : "",
            ValorUf : "",
            ValorCae : "",
            ValorImpuesto : "",
            TasaMensual : "",
            ValorSegDesgravamen : "",
            ValorSegVida : "",
            ValorSegCesantia : "",
            ValorSegTriple : "",
            ValorSegAsistenciaruta : "",
            ValorSegasistenciaMedica:"",
            ValorBrutoSegDesgravamen:"",
            ValorBrutoSegVida:"",
            ValorBrutoSegCesantia:"",
            ValorBrutoSegTriple:"",
            ValorBrutoSegAsistenciaRuta:"",
            ValorBrutoSegAsistenciaMedica:""             
};

var Seguro = {
            NombreSeg: "",
            Seguro: "",
            Deducible: "",
            Prima: "",
            Plazo: "",
            MultiAnual : "",
            Codigo: "",
            ValorTotalSeguro:"",
            ValorCuotaSeguro:""
        };




			switch (est) {
				case 'Cabecera':
                    Cabecera.IdAffinity     = cot.ID_AFFINITY; 
                    Cabecera.Fecha          = cot.FECHA; 
                    Cabecera.Seguro         = cot.SEGURO; 
                    Cabecera.Rut            = cot.RUT; 
                    Cabecera.Distribuidor   = cot.DISTRIBUIDOR; 
                    Cabecera.Sucursal       = cot.SUCURSAL; 
                    Cabecera.Vendedor       = cot.ID_VENDEDOR; 
                    Cabecera.YearVeh        = cot.ANOVEH; 
                    Cabecera.Modelo         = cot.MODELO; 
                    Cabecera.VersionVeh     = cot.VERSIONVEH; 
                    Cabecera.TestDrive      = cot.TESTDRIVE; 
                    Cabecera.Cantidad       = cot.CANTIDAD; 
                    Cabecera.Adicionales    = cot.ADICIONALES; 
                    Cabecera.ValorVeh       = cot.VALORVEH; 
                    Cabecera.Contado        = cot.CONTADO; 
                    Cabecera.Retoma         = cot.RETOMA; 
                    Cabecera.ValorTotal     = cot.VALORTOTAL; 
                    Cabecera.IdProducto     = cot.IDPRODUCTO; 
                    Cabecera.Producto       = cot.PRODUCTO; 
                    Cabecera.Cuotas         = cot.CUOTAS; 
                    Cabecera.Pagare         = cot.PAGARE; 
                    Cabecera.FormaPago      = cot.FORMAPAGO; 
                    Cabecera.FechaPago      = cot.PAGO; 
                    Cabecera.IntAsegurable  = cot.INTASEGURABLE; 
                    Cabecera.UsoEspecifico  = cot.USOESPECIFICO; 
                    Cabecera.Observacion    = cot.OBSERVACION; 
                    Cabecera.ObservacionSol = cot.OBSERVACIONSOL;
                    Cabecera.IdEjecutivo    = cot.ID_EJECUTIVO_SAP;
        		    Cabecera.IdAffinityPadre = cot.ID_PADRE_AFFINITY;
        		    Cabecera.Accion = cot.ACCION;
        		    Cabecera.TipoCredito = cot.TIPO_CREDITO;
                    Cabecera.NombreModelo = cot.NOMBRE_MODELO;
                    Cabecera.NombreVersion = cot.NOMBRE_VERSION;
                    Cabecera.Lead = utility.returnBoolean(cot.LEAD);
                    Cabecera.Flotas = utility.returnBoolean(cot.FLOTAS);
                    Cabecera.Renovaciones = utility.returnBoolean(cot.RENOVACIONES);
        		    return Cabecera;
                    // respuestaJ.Cabecera = Cabecera;
				// 	break;
				case 'DetaCredito':
				    DetalleCredito.GastosOperacionales              = cot.GASTOSOPERACIONALES; 
				    DetalleCredito.TotalFinanciar                   = cot.TOTALFINANCIAR; 
				    DetalleCredito.ValorCuota                       = cot.VALORCUOTA; 
				    DetalleCredito.Vfmg                             = cot.VFMG; 
				    DetalleCredito.PreEval                          = cot.PREEVAL; 
				    DetalleCredito.PrcEval                          = cot.PRCEVAL; 
				    DetalleCredito.ValorUf                          = cot.VALORUF; 
				    DetalleCredito.ValorCae                         = cot.VALORCAE; 
				    DetalleCredito.ValorImpuesto                    = cot.VALORIMPUESTO; 
				    DetalleCredito.TasaMensual                      = cot.TASAMENSUAL; 
				    DetalleCredito.ValorSegDesgravamen              = cot.VALORSEGDESGRAVAMEN; 
				    DetalleCredito.ValorSegVida                     = cot.VALORSEGVIDA; 
				    DetalleCredito.ValorSegCesantia                 = cot.VALORSEGCESANTIA; 
				    DetalleCredito.ValorSegTriple                   = cot.VALORSEGTRIPLE; 
				    DetalleCredito.ValorSegAsistenciaruta           = cot.VALORSEGASISTENCIARUTA; 
                    DetalleCredito.ValorSegasistenciaMedica         = cot.VALOR_SEGASISTENCIAMEDICA;
                    DetalleCredito.ValorBrutoSegDesgravamen         = cot.VALOR_BRUTO_SEGDESGRAVAMEN;
                    DetalleCredito.ValorBrutoSegVida                = cot.VALOR_BRUTO_SEGVIDA;
                    DetalleCredito.ValorBrutoSegCesantia            = cot.VALOR_BRUTO_SEGCESANTIA;
                    DetalleCredito.ValorBrutoSegTriple              = cot.VALOR_BRUTO_SEGTRIPLE;
                    DetalleCredito.ValorBrutoSegAsistenciaRuta      = cot.VALOR_BRUTO_SEGASISTENCIARUTA;
                    DetalleCredito.ValorBrutoSegAsistenciaMedica    = cot.VALOR_BRUTO_SEGASISTENCIAMEDICA;  				    
				    return DetalleCredito;
				    // respuestaJ.DetalleCredito = DetalleCredito;
				// 	break;
				case 'Seguro':
			        Seguro.NombreSeg  = cot.NOMBRESEG; 	    
			        Seguro.Seguro     = cot.SEGURO; 	    
			        Seguro.Deducible  = cot.DEDUCIBLE; 	    
			        Seguro.Prima      = cot.PRIMA; 	    
			        Seguro.Plazo      = cot.PLAZO; 	    
			        Seguro.MultiAnual = cot.MULTIANUAL;
			        Seguro.Codigo = cot.COD_SEGURO;
			        Seguro.ValorTotalSeguro = cot.VALOR_TOTAL_SEGURO;
                    Seguro.ValorCuotaSeguro = cot.VALOR_CUOTA_SEGURO;
			        return Seguro;
			     //   respuestaJ.Seguro = Seguro; 
				// 	break;
				default:    
            }

} 
function leerRsCotizacion(rs) {
    var car       = [];
    var cuota     = [];
    let i         = 0;
    var clave     = "";
    // var cot       = "";
	let mapCot    = new Map();
	let mapCarro  = new Map();
	let mapCred   = new Map();
	let mapSeg    = new Map();
	let mapCuo    = new Map();
    let respuestaJ = {
        Cabecera:"",
        CarroCompra:"",
        DetalleCredito:"",
        Seguro:"",
        Cuotas:""
        
    };	
    // var limit = rs.length;
    for (i = 0; i < rs.length; i++) {
// Cotizacion          
        clave = rs[i].ID_AFFINITY;
      if (!mapCot.has(clave)) {
            mapCot.set(clave, rs[i]);
            respuestaJ.Cabecera = mapeoContizacion(rs[i],'Cabecera');
        }

// Carro de Compra
      if(rs[i].CID_ELEMENTO !== null) {
          clave = rs[i].ID_AFFINITY + 'E' + rs[i].CID_ELEMENTO + 'EM' + rs[i].CID_EMPRESA;
          if (!mapCarro.has(clave)) {
                mapCarro.set(clave, rs[i]);
                let jsonCarro = {
                        "NombreElemento"    : rs[i].NOMBRE_ELEMENTO, 
                        "NombreSubElemento" : rs[i].NOMBRE_SUB_ELEMENTO,
                        "ValorUnitario"     : rs[i].VALOR_UNITARIO,
                        "Modificado"        : rs[i].MODIFICADO  
                };
                car.push(jsonCarro);
           }
      }

// Detalle de Credito
      if(rs[i].CALEMPRESA !== null) {
          clave = rs[i].ID_AFFINITY + 'E' + 'EM' + rs[i].CALEMPRESA;
          if (!mapCred.has(clave)) {
                mapCred.set(clave, rs[i]);
                respuestaJ.DetalleCredito = mapeoContizacion(rs[i],'DetaCredito');
           }
       }    

// Seguro
      if(rs[i].SEGEMPRESA !== null) {
          clave = rs[i].ID_AFFINITY + 'EM' + rs[i].SEGEMPRESA;
          if (!mapSeg.has(clave)) {
                mapSeg.set(clave, rs[i]);
                respuestaJ.Seguro = mapeoContizacion(rs[i],'Seguro');
           }
       }    

// Cuotas
      if(rs[i].CUOTA !== null) {
          clave = rs[i].CUOTA + 'A' + rs[i].ID_AFFINITY + 'EM' + rs[i].CUOEMPRESA;
          if (!mapCuo.has(clave)) {
                mapCuo.set(clave, rs[i]);
                let jsonCuota = {
                        "Cuota"        : rs[i].CUOTA, 
                        "Monto"        : rs[i].MONTO,
                        "Modificado"   : rs[i].MODIFICADOSN,
                        "MontoTotal"   : rs[i].MONTOTOTAL,  
                        "Bloqueado"    : rs[i].BLOQUEADOSN,  
                        "Cuoton"       : rs[i].CUOTONSN,  
                        "Amortizacion" : rs[i].AMORTIZACION,  
                        "MontoInteres" : rs[i].MONTOINTERES,
                        "MontoSaldoCapital":rs[i].MONTO_SALDO_CAPITAL,
                        "MontoCuotaSeguro":rs[i].MONTO_CUOTA_SEGURO
                };
                cuota.push(jsonCuota);
           }
       }    

    } // For
     respuestaJ.CarroCompra            = car; // mapCarro.size;  
     respuestaJ.Cuotas                 = cuota;  
     return respuestaJ;

}
//Funcion Obtener fecha de precurse
//
function getPreCurse(cot,edo,destinoSQL){
    let queryTS = '';
	let conn = $.hdb.getConnection(),rsT,edoT = [];    
    if(edo === 1004 || edo === 1001 || edo === 1002 || edo === 1003){
        queryTS = 'SELECT ID_ESTADO_FINANCIERA AS ESTADO FROM \"' + destinoSQL + '.data::maestro.homologacionEstados\"' 
            + ' WHERE ID_ESTADO_INTERNO = 5';
        try{
            rsT = conn.executeQuery(queryTS);
            
            if(rsT.length > 0){
                for(let i = 0; i < rsT.length; i++){
                    edoT.push(rsT[i].ESTADO);
                }
            }else
            {
                return "";
            }
        }catch(e){
            return "";
        }  
    	try{
    	    var queryT = 'SELECT to_VARCHAR(FECHA,\'DD/MM/YYYY hh24:mi:ss\') as FECHA '
            + ' FROM \"' + destinoSQL + '.data::cotizaciones.historialEstadosCotizacion\"'
    	    + ' WHERE  ID_AFFINITY = ? AND ID_ESTADO in (' + edoT + ')'
    	    + ' ORDER BY FECHA DESC';
    	    rsT = conn.executeQuery(queryT,cot);
    	    if(rsT.length > 0){
    	        return rsT[0].FECHA; 
    	    }
        }catch(e)
        {
            return "";
        }finally{
            conn.close();    
        }        
    }
	return "";
}
//Funcion obtener si es cotizacion de vehiculo nuevo o usado
//
function getCondicion(jsonIn,jsonOut,jsonGen){
    let conn = $.hdb.getConnection(),rsT,tQuery;
    if(utility.checkFullNull(jsonIn.IdAffinity) !== null){
        tQuery = 'SELECT NUEVO '
            + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion"'
            + ' WHERE ID_AFFINITY = ?'; 
        try{
            rsT = conn.executeQuery(tQuery,jsonIn.IdAffinity);
            conn.close();
            for(let i = 0; i < rsT.length; i++){
                return utility.getNuevoBool(rsT[i].NUEVO,'I');
            }
            return true;
        }catch(e){
            jsonOut.error.push({Description:e.message,
                                message:e.message,
                                TIPO_ERROR:e.type,
                                LOG_ERROR:"getCondicion - leerCotizacion",
                                Data:jsonIn,
                                Code:500});
            return true;
        }
        // return true;
    }
}
//Funcion valida que no exista un rechazo en validacion posterior al aprobado
//retorna verdadero si existe
function checkRechazo(jsonIn,jsonOut,jsonGen){
    let conT = $.hdb.getConnection(),rsT,tQuery,flag = false;
    tQuery = 'SELECT *'
        + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.historialEstadosCotizacion"'
        + ' WHERE ID_AFFINITY = ? AND ID_EMPRESA = ?'
        + ' AND FECHA > ?'
        + 'AND ID_ESTADO IN (SELECT ID_ESTADO_FINANCIERA FROM "' + jsonGen.destinoSQL + '.data::maestro.homologacionEstados" WHERE ID_ESTADO_INTERNO = 9)'; 
    try{
        for(let i = 0; i < jsonIn.length; i++){
            rsT = conT.executeQuery(tQuery,jsonIn[i].ID_AFFINITY,jsonIn[i].ID_EMPRESA,jsonIn[i].FECHA);  
            if(rsT.length > 0){
                flag = true;
            }else
            {
                flag = false;
            }
        }
        conT.close();
        // return (rsT.length > 0 ? true : false);
        return flag;
    }catch(e){
        jsonOut.error.push({Description:e.message,
                            message:e.message,
                            TIPO_ERROR:e.type,
                            LOG_ERROR:"checkRechazo - leerCotizacion",
                            Data:jsonIn,
                            Code:500});
        return flag;
    }    
    return flag;
}
//Valida estado existente en historico de cambios de estado para cotizacion por estado interno
//retorna ->true si existe
function checkHistorialEstado(jsonIn,jsonOut,jsonGen){
    let conT = $.hdb.getConnection(),rsT,tQuery,arrT = [];
    tQuery = 'SELECT ID_AFFINITY,ID_ESTADO'
        + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.historialEstadosCotizacion"'
        + ' WHERE ID_AFFINITY = ? AND ID_EMPRESA = ? AND' 
        + ' ID_ESTADO IN (SELECT ID_ESTADO_FINANCIERA FROM "' + jsonGen.destinoSQL + '.data::maestro.homologacionEstados" WHERE ID_ESTADO_INTERNO = (' + jsonIn.estado + '))'; 
    try{
        rsT = conT.executeQuery(tQuery,jsonIn.idAffinity,jsonIn.idEmpresa);
        conT.close();
        for(let i = 0; i < rsT.length; i++){
            arrT.push(rsT[i]);
        }
        // jsonOut.respuesta.push(rsT);
        return (rsT.length > 0 ? true : false);
    }catch(e){
        jsonOut.error.push({Description:e.message,
                            message:e.message,
                            TIPO_ERROR:e.type,
                            LOG_ERROR:"checkHistorialEstado - leerCotizacion",
                            Data:jsonIn,
                            Code:500});
        return false;
    }    
    return false;
}
//Verifica si el documento pertenece a una sucursal que esta sujeta al nuevo flujo de opcion complementaria
// retorna ->1 si es cierto.
function checkNuevoFlujo(jsonIn,destinoSQL){
    let conT = $.hdb.getConnection(),rsT,tQuery;
    tQuery = 'SELECT * FROM "' + destinoSQL + '.data::maestro.distribuidoresNuevoFlujo"'
        + ' WHERE ID_DISTRIBUIDOR = '
        + '(SELECT DISTRIBUIDOR FROM "' + destinoSQL + '.data::cotizaciones.cotizacion"'
        + ' WHERE ID_AFFINITY = ?)'; 
    try{
        rsT = conT.executeQuery(tQuery,jsonIn);
        conT.close();
        return ((rsT.length > 0 && utility.getParametro('NUEVO_FLUJO_COMPLEMENTARIA',destinoSQL) === '1') ? '1' : '0');
    }catch(e){
        return '0';
    }    
    return '0';
}
//Funcion buscar datos de los documentos sustentatorios
//de la carta de aprobacion de Autofin
function getDatosDocSustentatoriosCartaAutofin(jsonIn,destinoSQL){
    let conT = $.hdb.getConnection(),rsT,tQuery,arrT = [];
    tQuery = 'SELECT * FROM "' + destinoSQL + '.data::cotizaciones.docSustentatorios"'
        + ' WHERE ID_AFFINITY = ? AND ID_EMPRESA = ?'; 
    try{
        rsT = conT.executeQuery(tQuery,jsonIn.ID_AFFINITY,jsonIn.ID_EMPRESA);
        for(let i = 0; i < rsT.length; i++){
            arrT.push({Id:rsT[i].ID_DOCUMENTO,
                    Nombre:rsT[i].NOMBRE_DOCUMENTO,
                    Observacion:rsT[i].OBSERVACION});
        }
        conT.close();
        return (arrT);
        // return ((utility.getParametro('NUEVO_FLUJO_COMPLEMENTARIA',destinoSQL) === '1') ? '1' : '0');
    }catch(e){
        return [];
    }    
    return [];    
}
//Funcion buscar observacion de Riesgo
//de la carta de aprobacion de Autofin
function getObservacionRiesgoCartaAutofin(jsonIn,destinoSQL){
    let conT = $.hdb.getConnection(),rsT,tQuery;
    tQuery = 'SELECT * FROM "' + destinoSQL + '.data::cotizaciones.observacionRiesgo"'
        + ' WHERE ID_AFFINITY = ? AND ID_EMPRESA = ?'; 
    try{
        rsT = conT.executeQuery(tQuery,jsonIn.ID_AFFINITY,jsonIn.ID_EMPRESA);
        conT.close();
        return ((rsT.length > 0 ? rsT[0].OBSERVACION : null));
    }catch(e){
        return null;
    }    
    return null;    
}
//Verifica que el cambio de estado este reportado a Tanner
//Retorna -> el valor de notificaicion
function checkNotificacionToTanner(jsonIn,destinoSQL){
    let conT = $.hdb.getConnection(),rsT,tQuery;
    tQuery = 'SELECT * FROM "' + destinoSQL + '.data::cotizaciones.historialEstadosCotizacion"'
        + ' WHERE ID_AFFINITY = ? AND ID_EMPRESA = 4 AND ID_ESTADO = ?'; 
    try{
        rsT = conT.executeQuery(tQuery,jsonIn.ID_AFFINITY,jsonIn.ID_ESTADO);
        conT.close();
        return ((rsT.length > 0 ? rsT[0].NOTIFICADO : null));
    }catch(e){
        return null;
    }    
    return null;    
}
//Valida estado existente a partir de una fecha en historico de cambios de estado para cotizacion 
//retorna ->true si existe
function checkHistorialEstadoPosterior(jsonIn,jsonOut,jsonGen){
    let conT = $.hdb.getConnection(),rsT,tQuery;
    tQuery = 'SELECT ID_AFFINITY'
        + ' FROM "' + jsonGen.destinoSQL + '.data::cotizaciones.historialEstadosCotizacion"'
        + ' WHERE ID_AFFINITY = ? AND ID_EMPRESA = '
        + ' (SELECT ID_EMPRESA FROM "' + jsonGen.destinoSQL + '.data::maestro.empresas" where prioridad = ?)'
        + ' AND ID_ESTADO IN (SELECT ID_ESTADO_FINANCIERA FROM "' + jsonGen.destinoSQL + '.data::maestro.homologacionEstados" WHERE ID_ESTADO_INTERNO in (' + jsonIn.estadoInterno + '))'
        + ' AND FECHA > ?'; 
    try{
        rsT = conT.executeQuery(tQuery,jsonIn.idAffinity,jsonIn.Prioridad,jsonIn.fecha);
        conT.close();
        return (rsT.length > 0 ? true : false);
    }catch(e){
        jsonOut.error.push({Description:e.message,
                            message:e.message,
                            TIPO_ERROR:e.type,
                            LOG_ERROR:"checkHistorialEstadoPosterior - leerCotizacion",
                            Data:jsonIn});
        return false;
    }    
    return false;
}
//Busca un campo a nivel de cabecera del documento
//Retorna -> el valor del campo o null si no existe 
function getCampoCabCot(jsonIn,destinoSQL){
    let conT = $.hdb.getConnection(),rsT,tQuery;
    tQuery = 'SELECT ' + jsonIn.Campos + ' FROM "' + destinoSQL + '.data::cotizaciones.cotizacion"'
        + ' WHERE ID_AFFINITY = ?'; 
    try{
        rsT = conT.executeQuery(tQuery,jsonIn.ID_AFFINITY);
        conT.close();
        return ((rsT.length > 0 ? rsT[0] : null));
    }catch(e){
        return null;
    }    
    return null;    
}
//Funcion obtener historico de cambios de estado por cotizacion
//
function leerHistoricoCambiosEstados(id,destinoSQL){
    let conT = $.hdb.getConnection(),rsT,tQuery,arr = [];
    tQuery = 'select edo.id_affinity,edo.fecha_estado,'
    + 'edo.fecha,edo.id_estado,'
    + '(select descripcion from "' + destinoSQL + '.data::maestro.empresas" where id_empresa = edo.id_empresa) as empresa,'
    + '(SELECT NOMBRE_ESTADO FROM "' + destinoSQL + '.data::maestro.estados" WHERE ID_EMPRESA = edo.id_empresa and id_ESTADO = edo.Id_ESTADO) as NOMBRE_ESTADO'
    +' FROM "' + destinoSQL + '.data::cotizaciones.historialEstadosCotizacion" as edo WHERE edo.ID_AFFINITY = ?'
    + 'ORDER BY edo.FECHA asc;'; 
    try{
        rsT = conT.executeQuery(tQuery,id);
        
        conT.close();
        for(let i = 0; i < rsT.length; i++){
            arr.push(rsT[i]);
        }
    }catch(e){
        return arr;
    }    
    return arr;     
}