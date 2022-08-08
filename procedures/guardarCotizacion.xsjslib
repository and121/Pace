$.import("CL_PACKAGE_PACE_DEV.procedures", "utility");	
var utility = $.CL_PACKAGE_PACE_DEV.procedures.utility;
// Funcion Guardar Seguros de Cotizacion
// setFechaSQL
function guardarSeguros(jsonIn,jsonOut,jsonGen){
    let arry = [],tQuery = 'INSERT INTO "' + jsonGen.destinoSQL + '.data::cotizaciones.seguros" VALUES(?,?,?,?,?,?,?,?,?,?)',conn = $.hdb.getConnection();
    for(let i = 0;i < jsonIn.length;i++)
    {
        arry.push([jsonOut.ID_AFFINITY,//utility.checkNull(jsonIn[i].ID_AFFINITY),
            jsonOut.IdEmpresa,
            utility.checkNull(jsonIn[i].NOMBRESEG.toUpperCase()),
            utility.checkNull(jsonIn[i].SEGURO),
            (utility.checkNull(jsonIn[i].DEDUCIBLE)),
            (utility.checkNull(jsonIn[i].PRIMA) === null ? null : jsonIn[i].PRIMA.toString().replace(/\,/g, '.')),
            utility.checkNull(jsonIn[i].PLAZO),
            utility.returnBoolean(jsonIn[i].MULTIANUAL),
            utility.checkNull(jsonIn[i].VALOR_TOTAL_SEGURO),
            utility.checkNull(jsonIn[i].VALOR_CUOTA_SEGURO)            
            // false//utility.returnBoolean(jsonIn[i].FINANCIA)
            ]);
    }
    if(arry.length > 0){
        try{
            conn.executeUpdate(tQuery, arry);
            if (jsonGen.modo !== "T"){
                conn.commit();    
            jsonOut.resultadoSQL.push({"datos":"Seguros",
                                    "code":"200",
                                    "status":"OK",
                                    "service":"guardarSeguros"});              
            }else{
                jsonOut.resultadoSQL.push({"datos":"Seguros",
                                        "code":"210",
                                        "status":"OK-TEST",
                                        "service":"guardarSeguros"}); 
            }
        }catch(e){
            jsonOut.Error.push({TEXTO_ERROR:e.message,
                            TIPO_ERROR:e.name,
                            LOG_ERROR:"Seguros",
                            arry:arry});                
        }
        finally{
            conn.close();
        }
    }else{
        jsonOut.resultadoSQL.push({"datos":"Seguros",
                                "code":"300",
                                "status":"NO EXISTEN REGISTROS QUE GUARDAR",
                                "service":"guardarSeguros"});    
    }
    
}

//////////////////////////////////////////////////////////////////////////////////////////
// funcion Guardar Cuotas de Cotizacion
// 
function guardarCuotas(jsonIn,jsonOut,jsonGen){
    let arry = [],tQuery = 'INSERT INTO "' + jsonGen.destinoSQL + '.data::cotizaciones.cuotas" VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',conn = $.hdb.getConnection();
    
    for(let i = 0;i < jsonIn.length;i++)
    {
        arry.push([utility.checkNull(jsonIn[i].CUOTA),
            jsonOut.ID_AFFINITY,
            jsonOut.IdEmpresa,
            utility.setFechaSQL(jsonIn[i].FECHA),
            utility.checkNull(parseInt(jsonIn[i].MONTO,10)),
            utility.returnBoolean(jsonIn[i].MODIFICADOSN),
            utility.checkNull(parseInt(jsonIn[i].MONTOTOTAL,10)),
            utility.returnBoolean(jsonIn[i].BLOQUEADOSN),
            utility.returnBoolean(jsonIn[i].CUOTONSN),
            utility.checkNull(parseInt(jsonIn[i].AMORTIZACION,10)),
            utility.checkNull(parseInt(jsonIn[i].MONTOINTERES,10)),
            utility.checkNull(parseInt(jsonIn[i].MONTO_SALDO_CAPITAL,10)),
            utility.checkNull(parseInt(jsonIn[i].MONTO_CUOTA_SEGURO,10))]);
    }
    if(arry.length > 0){
        try{
            conn.executeUpdate(tQuery, arry);
            if (jsonGen.modo !== "T"){
                conn.commit();    
            jsonOut.resultadoSQL.push({"datos":"Cuotas",
                                    "code":"200",
                                    "status":"OK",
                                    "service":"guardarCuotas"});                
            }else{
                jsonOut.resultadoSQL.push({"datos":"Cuotas",
                                        "code":"210",
                                        "status":"OK-TEST",
                                        "service":"guardarCuotas"}); 
            }
        }catch(e){
            jsonOut.Error.push({TEXTO_ERROR:e.message,
                                TIPO_ERROR:e.name,
                                LOG_ERROR:"Cuotas",
                        arry:arry});                
        }
        finally{
            conn.close();
        }
    }else{
        jsonOut.resultadoSQL.push({"datos":"Cuotas",
                                "code":"300",
                                "status":"NO EXISTEN REGISTROS QUE GUARDAR",
                                "service":"guardarCuotas"});    
    }
    
}
// Funcion Guardar Carro de Compra de Cotizacion
// 
function guardarCarroCompra(jsonIn,jsonOut,jsonGen){
    let arry = [],tQuery = 'INSERT INTO "' + jsonGen.destinoSQL + '.data::cotizaciones.carroCompra" VALUES(?,?,?,?,?,?,?,?)',conn = $.hdb.getConnection();
    for(let i = 0;i < jsonIn.length;i++)
    {
        arry.push([jsonOut.ID_AFFINITY,//utility.checkNull(jsonIn[i].ID_AFFINITY),
            utility.checkNull(jsonIn[i].ID_ELEMENTO),
            utility.checkNull(jsonOut.IdEmpresa),
            (utility.checkNull(jsonIn[i].NOMBRE_ELEMENTO) === null ? null : jsonIn[i].NOMBRE_ELEMENTO.toUpperCase()),
            // utility.checkNull(jsonIn[i].NOMBRE_ELEMENTO.toUpperCase()),
            (utility.checkNull(jsonIn[i].NOMBRE_SUB_ELEMENTO) === null ? null : jsonIn[i].NOMBRE_SUB_ELEMENTO.toUpperCase()),
            // utility.checkNull(jsonIn[i].NOMBRE_SUB_ELEMENTO.toUpperCase()),
            // utility.checkNull(parseInt(jsonIn[i].VALOR_UNITARIO.toString().replace(/\./g, ''),10)),
            (utility.checkNull(jsonIn[i].VALOR_UNITARIO) === null ? null : parseInt(jsonIn[i].VALOR_UNITARIO,10)),
            // utility.checkNull(parseInt(jsonIn[i].VALOR_UNITARIO.toString())),
            utility.returnBoolean(jsonIn[i].MODIFICADO),
            jsonIn[i].ID_TRANSACCION_MESOS]);
    }
    if(arry.length > 0){
        try{
            conn.executeUpdate(tQuery, arry);
            if (jsonGen.modo !== "T"){
                conn.commit();    
            jsonOut.resultadoSQL.push({"datos":"Carro Compra",
                                    "code":"200",
                                    "status":"OK",
                                    "service":"guardarCarroCompra"});                
            }else{
                jsonOut.resultadoSQL.push({"datos":"Carro Compra",
                                        "code":"210",
                                        "status":"OK-TEST",
                                        "service":"guardarCarroCompra"}); 
            }
        }catch(e){
            jsonOut.Error.push({TEXTO_ERROR:e.message,
                                TIPO_ERROR:e.name,
                                LOG_ERROR:"Carro Compra"});                
        }
        finally{
            conn.close();
        }
    }else{
        jsonOut.resultadoSQL.push({"datos":"Carro Compra",
                                "code":"300",
                                "status":"NO EXISTEN REGISTROS QUE GUARDAR",
                                "service":"guardarCarroCompra"});    
    }
    
}
// Funcion guardar historial de estados de cotizacion 
// 
function guardarHistorialEstados(jsonIn,jsonOut,jsonGen){
    let arry = [],tQuery = 'INSERT INTO "' + jsonGen.destinoSQL + '.data::cotizaciones.historialEstadosCotizacion" VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',conn = $.hdb.getConnection();
    let tQueryHE = 'INSERT INTO "' + jsonGen.destinoSQL + '.data::cotizaciones.historialMotivosEstadosCotizacion" VALUES(?,?,?,?,?,?)';
    let arryHE = [];
    var oConn = $.hdb.getConnection(),queryT = 'SELECT  UTCTOLOCAL( CURRENT_UTCTIMESTAMP,\'UTC-4\' ) as local,CURRENT_UTCTIMESTAMP,CURRENT_TIMESTAMP FROM dummy';
    var date = new Date(oConn.executeQuery(queryT)[0].LOCAL);
    oConn.close();
    for(let i = 0;i < jsonIn.length;i++)
    {
        let trut = utility.checkNull(jsonIn[i].EJECUTIVO.RUT);
        if(trut !== null){ 
            trut = trut.replace(/[\.\-]/g,'');
        }
        arry.push([jsonIn[i].ID_AFFINITY,//jsonOut.ID_AFFINITY
            utility.checkNull(jsonIn[i].ID_EMPRESA),
            utility.checkNull(jsonIn[i].ID_ESTADO),
            date,
            (utility.checkNull(jsonIn[i].FECHA_ESTADO) === null ? date : jsonIn[i].FECHA_ESTADO),
            (utility.checkNull(jsonIn[i].OBSERVACION) === null ? null : jsonIn[i].OBSERVACION.replace(/(?:\\[rn]|[\r\n]+)+/g,'')),
            (utility.checkNull(jsonIn[i].EJECUTIVO.NOMBRE) === null ? null : jsonIn[i].EJECUTIVO.NOMBRE.toUpperCase()),
            (trut === null ? null : trut.toUpperCase()),
            (utility.checkNull(jsonIn[i].EJECUTIVO.CORREO) === null ? null : jsonIn[i].EJECUTIVO.CORREO.toUpperCase()),
            utility.checkFullNull(jsonIn[i].NOTIFICADO === null ? 'true' : jsonIn[i].NOTIFICADO),
            utility.checkNull(jsonIn[i].CANT_INTENTOS === null ? 10 : jsonIn[i].CANT_INTENTOS),
            utility.checkNull(jsonIn[i].PROCESADO === null ? '0' : jsonIn[i].PROCESADO)]);
            if(jsonIn[i].MOTIVO.length > 0)
            {
                for(let j = 0; j < jsonIn[i].MOTIVO.length; j++){
                    arryHE.push([jsonOut.ID_AFFINITY,
                                utility.checkNull(jsonIn[i].ID_EMPRESA),
                                utility.checkNull(jsonIn[i].ID_ESTADO),
                                date,
                                jsonIn[i].MOTIVO[j].ID,
                                jsonIn[i].MOTIVO[j].TEXTO.toUpperCase()]);
                }
            }            
    }
    if(arry.length > 0){
        try{
            conn.executeUpdate(tQuery, arry);
            if(arryHE.length > 0)
            {
                conn.executeUpdate(tQueryHE, arryHE);
            }
            if (jsonGen.modo !== "T"){
                conn.commit();    
            jsonOut.resultadoSQL.push({"datos":"Historial Estados",
                                    "code":"200",
                                    "status":"OK",
                                    "service":"guardarHistorialEstados"});                
            }else{
                jsonOut.resultadoSQL.push({"datos":"Historial Estados",
                                        "code":"210",
                                        "status":"OK-TEST",
                                        "service":"guardarHistorialEstados"}); 
            }
        }catch(e){
            jsonOut.Status = 500;
            jsonOut.Error.push({TEXTO_ERROR:e.message,
                                TIPO_ERROR:e.name,
                                LOG_ERROR:"Historial Estados"});                
        }
        finally{
            conn.close();
        }
    }else{
        // jsonOut.Status = 300;
        jsonOut.resultadoSQL.push({"datos":"Historial Estados",
                                "code":"300",
                                "status":"NO EXISTEN REGISTROS QUE GUARDAR",
                                "service":"guardarHistorialEstados"});   
    }
    
}
// Funcion Guardar Codigos de Referencia de Cotizacion segun Empresas Financieras
// 
function guardarReferencias(jsonIn,jsonOut,jsonGen){
    let arry = [],tQuery = 'INSERT INTO "' + jsonGen.destinoSQL + '.data::cotizaciones.referencias" VALUES(?,?,?)',conn = $.hdb.getConnection();
    for(let i = 0;i < jsonIn.length;i++)
    {
        arry.push([jsonOut.ID_AFFINITY,//utility.checkNull(jsonIn[i].ID_AFFINITY),
            utility.checkNull(jsonIn[i].ID_EMPRESA),
            utility.checkNull(jsonIn[i].ID_COT_FINANCIERA)]);
    }
    if(arry.length > 0){
        try{
            conn.executeUpdate(tQuery, arry);
            if (jsonGen.modo !== "T"){
                conn.commit();    
            jsonOut.resultadoSQL.push({"datos":"Codigos de Referencias por Cotizacion",
                                    "code":"200",
                                    "status":"OK",
                                    "service":"guardarReferencias"});                
            }else{
                jsonOut.resultadoSQL.push({"datos":"Codigos de Referencias por Cotizacion",
                        "code":"210",
                        "status":"OK-TEST",
                        "service":"guardarReferencias"}); 
            }
        }catch(e){
            jsonOut.Error.push({TEXTO_ERROR:e.message,
                                TIPO_ERROR:e.name,
                                LOG_ERROR:"Codigos de Referencias por Cotizacion"});                
        }
        finally{
            conn.close();
        }
    }else{
        jsonOut.resultadoSQL.push({"datos":"Codigos de Referencias por Cotizacion",
                                "code":"300",
                                "status":"NO EXISTEN REGISTROS QUE GUARDAR",
                                "service":"guardarReferencias"});    
    }
    
}
// Funcion Guardar Estado Final Cotizacion por Empresa Financiera
// 
function guardarCotizacionEstado(jsonIn,jsonOut,jsonGen){
    let arry = [],tQuery = 'INSERT INTO "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacionEstado" VALUES(?,?,?,?)',conn = $.hdb.getConnection();
    var oConn = $.hdb.getConnection(),queryT = 'SELECT  UTCTOLOCAL( CURRENT_UTCTIMESTAMP,\'UTC-4\' ) as local,CURRENT_UTCTIMESTAMP,CURRENT_TIMESTAMP FROM dummy';
    var date = new Date(oConn.executeQuery(queryT)[0].LOCAL);    
    oConn.close();
    // date = new Date();
    for(let i = 0;i < jsonIn.length;i++)
    {
        arry.push([jsonIn[i].ID_AFFINITY,//,jsonOut.ID_AFFINITY
            utility.checkNull(jsonIn[i].ID_EMPRESA),
            utility.checkNull(jsonIn[i].ID_ESTADO),
            date]);
    }
    if(arry.length > 0){
        try{
            conn.executeUpdate(tQuery, arry);
            if (jsonGen.modo !== "T"){
                conn.commit();    
            jsonOut.resultadoSQL.push({"datos":"Estado por Cotizacion",
                                    "code":"200",
                                    "status":"OK",
                                    "service":"guardarCotizacionEstado"});                
            }else{
                jsonOut.resultadoSQL.push({"datos":"Estado por Cotizacion",
                        "code":"210",
                        "status":"OK-TEST",
                        "service":"guardarCotizacionEstado"}); 
            }
        }catch(e){
            jsonOut.Error.push({TEXTO_ERROR:e.message,
                                    TIPO_ERROR:e.name,
                                    LOG_ERROR:"Estado por Cotizacion"});                
        }
        finally{
            conn.close();
        }
    }else{
        jsonOut.resultadoSQL.push({"datos":"Estado por Cotizacion",
                                "code":"300",
                                "status":"NO EXISTEN REGISTROS QUE GUARDAR",
                                "service":"guardarCotizacionEstado"});    
    }
    
}
// Funcion Actualizar Estado Final Cotizacion por Empresa Financiera
// 
function actualizarCotizacionEstado(jsonIn,jsonOut,jsonGen){
    let arry = [],tQuery = 'UPDATE "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacionEstado" SET ID_ESTADO = ?, FECHA = ? WHERE ID_AFFINITY = ? AND ID_EMPRESA = ?',
        conn = $.hdb.getConnection(); 
        var oConn = $.hdb.getConnection(),queryT = 'SELECT  UTCTOLOCAL( CURRENT_UTCTIMESTAMP,\'UTC-4\' ) as local,CURRENT_UTCTIMESTAMP,CURRENT_TIMESTAMP FROM dummy';
        var date = new Date(oConn.executeQuery(queryT)[0].LOCAL);
        // date = new Date();
        
    for(let i = 0;i < jsonIn.length;i++)
    {
        arry.push([utility.checkNull(jsonIn[i].ID_ESTADO),
            date,
            jsonIn[i].ID_AFFINITY,
            utility.checkNull(jsonIn[i].ID_EMPRESA)]);
    }
    if(arry.length > 0){
        try{
            conn.executeUpdate(tQuery, arry);
            if (jsonGen.modo !== "T"){
                conn.commit();    
            jsonOut.resultadoSQL.push({"datos":"Actualzair Estado por Cotizacion",
                                    "code":"200",
                                    "status":"OK",
                                    "service":"actualizarCotizacionEstado"});                
            }else{
                jsonOut.resultadoSQL.push({"datos":"Actualzair Estado por Cotizacion",
                        "code":"210",
                        "status":"OK-TEST",
                        "service":"actualizarCotizacionEstado"}); 
            }
        }catch(e){
            jsonOut.Error.push({TEXTO_ERROR:e.message,
                TIPO_ERROR:e.name,
                LOG_ERROR:"Actualzair Estado por Cotizacion",
                "Service":"guardarCotizacion"});
        }
        finally{
            conn.close();
        }
    }else{
        jsonOut.resultadoSQL.push({"datos":"Actualzair Estado por Cotizacion",
                                "code":"300",
                                "status":"NO EXISTEN REGISTROS QUE ACTUALIZAR",
                                "service":"actualizarCotizacionEstado"});    
    }
    
}
// Funcion Guardar calculos de creditos
// 
function guardarCalculoCreditos(jsonIn,jsonOut,jsonGen){
    let arry = [],tQuery = 'INSERT INTO "' + jsonGen.destinoSQL + '.data::cotizaciones.calculoCreditos" VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',conn = $.hdb.getConnection();
    for(let i = 0;i < jsonIn.length;i++)
    {
        arry.push([jsonOut.ID_AFFINITY,
            utility.checkNull(jsonOut.IdEmpresa),
            utility.checkNull(jsonIn[i].GASTOSOPERACIONALES),
            utility.checkNull(jsonIn[i].TOTALFINANCIAR),
            utility.checkNull(jsonIn[i].VALORCUOTA),
            utility.checkNull(jsonIn[i].VFMG),
            utility.checkNull(jsonIn[i].PREEVAL),
            utility.checkNull(jsonIn[i].PRCEVAL),
            utility.checkNull(jsonIn[i].VALORUF),
            utility.checkNull(jsonIn[i].VALORCAE),
            utility.checkNull(jsonIn[i].VALORIMPUESTO),
            utility.checkNull(jsonIn[i].TASAMENSUAL),
            utility.checkNull(jsonIn[i].VALORSEGDESGRAVAMEN),
            utility.checkNull(jsonIn[i].VALORSEGVIDA),
            utility.checkNull(jsonIn[i].VALORSEGCESANTIA),
            utility.checkNull(jsonIn[i].VALORSEGTRIPLE),
            utility.checkNull(jsonIn[i].VALORSEGASISTENCIARUTA),
            utility.checkNull(jsonIn[i].VALOR_BRUTO_SEGDESGRAVAMEN),
            utility.checkNull(jsonIn[i].VALOR_BRUTO_SEGVIDA),
            utility.checkNull(jsonIn[i].VALOR_BRUTO_SEGCESANTIA),
            utility.checkNull(jsonIn[i].VALOR_BRUTO_SEGTRIPLE),
            utility.checkNull(jsonIn[i].VALOR_BRUTO_SEGASISTENCIARUTA),
            utility.checkNull(jsonIn[i].VALOR_BRUTO_SEGASISTENCIAMEDICA),
            utility.checkNull(jsonIn[i].VALOR_SEGASISTENCIAMEDICA)
            ]);
    }
    if(arry.length > 0){
        try{
            conn.executeUpdate(tQuery, arry);
            if (jsonGen.modo !== "T"){
                conn.commit();    
            jsonOut.resultadoSQL.push({"datos":"Calculo de Credito",
                                    "code":"200",
                                    "status":"OK",
                                    "service":"guardarCalculoCreditos"});                
            }else{
                jsonOut.resultadoSQL.push({"datos":"Calculo de Credito",
                                        "code":"210",
                                        "status":"OK-TEST",
                                        "service":"guardarCalculoCreditos"});
            }
        }catch(e){
            jsonOut.Error.push({TEXTO_ERROR:e.message,
                                TIPO_ERROR:e.name,
                                LOG_ERROR:"Calculo de Credito Catch"});                
        }
        finally{
            conn.close();
        }
    }else{
        jsonOut.resultadoSQL.push({"datos":"Calculo de Credito",
                                "code":"300",
                                "status":"NO EXISTEN REGISTROS QUE GUARDAR",
                                "service":"guardarCalculoCreditos"});    
    }
    
}
// Funcion Guardar Cabecera Cotizacion
// 
function guardarCotizacion(jsonIn,jsonOut,jsonGen){
    var getIdOrigen = function(idAffinity,idAffinityPadre,destinoSQL){
        let query = 'SELECT ID_ORIGEN_AFFINITY from "' + destinoSQL + '.data::cotizaciones.cotizacion" WHERE ID_AFFINITY = ?',
        conT = $.hdb.getConnection();
        if(utility.checkFullNull(idAffinityPadre) === null){
            return idAffinity;
        }else{
             try{
                let rsT = conT.executeQuery(query,idAffinityPadre);
                if(rsT.length > 0){
                    if(utility.checkFullNull(rsT[0].ID_ORIGEN_AFFINITY) !== null){
                       return rsT[0].ID_ORIGEN_AFFINITY; 
                    }
                    else{
                        return idAffinityPadre;
                    }
                }else{
                    return idAffinity;
                }
            }catch(e){
                return null;
            }       
        }
    };
    let arry = [],tQuery = 'INSERT INTO "' + jsonGen.destinoSQL + '.data::cotizaciones.cotizacion"' 
        + ' VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?'//20
        + ',?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?'//20
        + ',?,?,?,?,?,?,?,?,?,?)',conn = $.hdb.getConnection();//10
        var oConn = $.hdb.getConnection(),queryT = 'SELECT  UTCTOLOCAL( CURRENT_UTCTIMESTAMP,\'UTC-4\' ) as local,CURRENT_UTCTIMESTAMP,CURRENT_TIMESTAMP FROM dummy';
        var date = new Date(oConn.executeQuery(queryT)[0].LOCAL);
        jsonOut.FECHA_CREACION = date;
        var montoTotal = jsonIn.ValorVehiculo - jsonIn.Contado;
        arry.push([date,//FECHA
            ((utility.checkNull(jsonIn.CodigoSeguro) !== null ) ? "S" : "N"),//SEGURO
            'COTIZACION',//ESTADO
            jsonIn.RutCliente.replace("-", "").toUpperCase(),//RUT-4
            parseInt(jsonIn.IdDistribuidor.toString(), 10),//DISTRIBUIDOR
            parseInt(jsonIn.IdSucursal.toString(), 10),//SUCURSAL
            jsonIn.IdVendedor.toUpperCase(),//USUARIOSAP UsuarioSap
            ((utility.checkNull(jsonIn.IdVendedor) !== null ) ? jsonIn.IdVendedor.toUpperCase() : null),//utility.checkNull(jsonIn.IdTpVendedor),//ID_VENDEDOR
            parseInt(jsonIn.AnoVehiculo.toString(), 10),//ANOVEH - 9
            ((utility.checkNull(jsonIn.IdModelo.toString()) !== null ) ? parseInt(jsonIn.IdModelo.toString(), 10) : null),//MODELO-14
            ((utility.checkNull(jsonIn.IdVersion.toString()) !== null ) ? parseInt(jsonIn.IdVersion.toString(), 10) : null),//VERSIONVEH
            utility.checkNull(jsonIn.TestDrive),//null,//TESTDRIVE
            parseInt(jsonIn.CantidadVehiculos, 10),//CANTIDAD
	        ((utility.checkNull(jsonIn.Adicionales.toString()) !== null ) ? parseInt(jsonIn.Adicionales.toString(), 10) : null),//ADICIONALES
            ((utility.checkNull(jsonIn.ValorVehiculo.toString()) !== null ) ? parseInt(jsonIn.ValorVehiculo.toString(), 10) : null),//VALORVEH
            ((utility.checkNull(jsonIn.Contado.toString()) !== null ) ? parseInt(jsonIn.Contado.toString(), 10) : null),//CONTADO-20 //PIE
            ((utility.checkNull(jsonIn.MontoRetoma.toString()) !== null ) ? parseInt(jsonIn.MontoRetoma.toString(), 10) : null),//RETOMA
            montoTotal,//VALORTOTAL //SALDO
            parseInt(jsonIn.CodigoCredito, 10),//IDPRODUCTO - 19
            ((utility.checkNull(jsonIn.Producto) !== null ) ? jsonIn.Producto.toUpperCase() : null),//PRODUCTO //null,
            parseInt(jsonIn.NumeroCuotas, 10),//CUOTAS
            date,//PAGARE
            parseInt(jsonIn.IdFormaPago.toString(), 10),//FORMAPAGO
            utility.setFechaSQL(jsonIn.FechaVencimiento),//PAGO
            0, //ID_PRODUCTO FINANCIAMIENTO - 25
    	    0, //IDCREDITO_ORIGEN - 26
    	    0, //ID INSTITUCION_FINANCIERA - 27
    	    (utility.checkNull(jsonIn.ValorIntAseg) !== null ? jsonIn.ValorIntAseg : null),//INTASEGURABLE
    	    (utility.checkNull(jsonIn.ValorUsoEsp) !== null ? parseInt(jsonIn.ValorUsoEsp, 10) : null),//USOESPECIFICO
            utility.checkNull(jsonIn.Observacion),//OBSERVACION - 27
            'D',//AFFINITY D = Web Dealer
            null,//AUX1 - 29
            null,//AUX2
            null,//FECHASOLICITADA
            jsonOut.ID_AFFINITY,//ID_AFFINITY
            null,//ID_ADJUDICACION
            null,//OBSERVACIONSOL
            jsonIn.IdEjecutivo,//ID_EJECUTIVO_SAP - 35
            null,//FECHA_MOD Ultima modificación
            1007,//ID_ESTADO
            utility.checkFullNull(jsonIn.IdAffinityPadre),//- 38
            ((utility.checkNull(jsonIn.Accion) !== null ) ? jsonIn.Accion.toUpperCase() : null),
            ((utility.checkNull(jsonIn.TipoCredito) !== null ) ? parseInt(jsonIn.TipoCredito,10) : null),//
            date.getFullYear(),//Year - 41
            getIdOrigen(jsonOut.ID_AFFINITY,jsonIn.IdAffinityPadre,jsonGen.destinoSQL),//ID_ORIGEN_AFFINITY
            utility.returnBoolean(jsonIn.Lead),
            utility.returnBoolean(jsonIn.Flotas),
            utility.returnBoolean(jsonIn.Renovaciones),
            utility.getNuevoBool(jsonIn.NuevoUsado,'I').toString(),// NUENO - 46
            0
            ]);
    //}
    if(arry.length > 0){
        try{
            conn.executeUpdate(tQuery, arry);
            if (jsonGen.modo !== "T"){
                conn.commit();    
            jsonOut.ContCreada = true;    
            jsonOut.resultadoSQL.push({"datos":"Cotizacion",
                                    "code":"200",
                                    "status":"OK",
                                    "service":"guardarCotizacion"});                
            }else{
                jsonOut.ContCreada = true;
                jsonOut.resultadoSQL.push({"datos":"Cotizacion",
                        "code":"210",
                        "status":"OK-TEST",
                        "service":"guardarCotizacion"}); 
            }
        }catch(e){
            jsonOut.Error.push({TEXTO_ERROR:e.message,
                                TIPO_ERROR:e.name,
                                LOG_ERROR:" Guardar Cotizacion",
                                arry:arry,
                                tQuery:tQuery});
            jsonOut.Status = 500;
        }
        finally{
            conn.close();
        }
    }else{
        jsonOut.resultadoSQL.push({"datos":"Cotizacion",
                                "code":"300",
                                "status":"NO EXISTEN REGISTROS QUE GUARDAR",
                                "service":"guardarCotizacion"}); 
        // jsonOut.Status = 300;
    }
}
//Guardar historico de cambios
//
function guardarHistoricoCotizacion(jsonIn,jsonOut,jsonGen){
    $.import("CL_PACKAGE_PACE_DEV.procedures", "leerCotizacion");	
	var readCot = $.CL_PACKAGE_PACE_DEV.procedures.leerCotizacion;    
    var getIdOrigen = function(idAffinity,idAffinityPadre,destinoSQL){
        let query = 'SELECT ID_ORIGEN_AFFINITY from "' + destinoSQL + '.data::cotizaciones.cotizacion" WHERE ID_AFFINITY = ?',
        conT = $.hdb.getConnection();
        if(utility.checkFullNull(idAffinityPadre) === null){
            return idAffinity;
        }else{
             try{
                let rsT = conT.executeQuery(query,idAffinityPadre);
                if(rsT.length > 0){
                    if(utility.checkFullNull(rsT[0].ID_ORIGEN_AFFINITY) !== null){
                      return rsT[0].ID_ORIGEN_AFFINITY; 
                    }
                    else{
                        return idAffinityPadre;
                    }
                }else{
                    return idAffinity;
                }
            }catch(e){
                return null;
            }       
        }
    },
    getValor = function(idAffinityIn,ValorIn,destinoSQL){
        let query = 'SELECT ' + ValorIn + ' from "' + destinoSQL + '.data::cotizaciones.cotizacion" WHERE ID_AFFINITY = ?',
        conT = $.hdb.getConnection(),rsT;
        try{
            rsT = conT.executeQuery(query,idAffinityIn);
            return rsT[0][ValorIn];
        }catch(e){
            return null;
        }
        return null;//[0][ValorIn];
    };
    let arry = [],tQuery = 'INSERT INTO "' + jsonGen.destinoSQL + '.data::cotizaciones.historicoCambios"' 
        + ' VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'//20
        + '?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'//20
        + '?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'//20
        +  '?,?,?,?,?,?,?,?,?,?,?,?)',//11
        conn = $.hdb.getConnection();
        var Resultados = jsonOut.respuesta.body.Resultados[0];
        var oConn = $.hdb.getConnection(),queryT = 'SELECT  UTCTOLOCAL( CURRENT_UTCTIMESTAMP,\'UTC-4\' ) as local,CURRENT_UTCTIMESTAMP,CURRENT_TIMESTAMP FROM dummy';
        var date = new Date(oConn.executeQuery(queryT)[0].LOCAL);
        
        var montoTotal = jsonIn.ValorVehiculo-jsonIn.Contado;
        
    arry.push([jsonOut.ID_AFFINITY,//ID_AFFINITY//1
        date.getFullYear(),//FECHA
        date,//FECHA - Traer Original
        getValor(jsonIn.IdAffinity,'ID_ESTADO',jsonGen.destinoSQL),//ID_ESTADO
        // utility.checkFullNull(jsonIn.IdAffinityPadre),//ID_PADRE_AFFINITY//5
        // getIdOrigen(jsonOut.IdAffinity,jsonIn.IdAffinityPadre,jsonGen.destinoSQL),//ID_ORIGEN_AFFINITY    
        ((utility.checkFullNull(jsonIn.Accion) !== null ) ? (jsonIn.Accion.toUpperCase() !== 'MA' ? jsonIn.Accion.toUpperCase() : 'U' ) : 'N'),//ACCION
        utility.checkNull(jsonIn.Observacion),//OBSERVACION
        //Solicitud
        getValor(jsonIn.IdAffinity,'FECHASOLICITADA',jsonGen.destinoSQL),// FECHASOLICITADA//10
        getValor(jsonIn.IdAffinity,'ID_ADJUDICACION',jsonGen.destinoSQL),// ID_ADJUDICACION
        getValor(jsonIn.IdAffinity,'OBSERVACIONSOL',jsonGen.destinoSQL),// OBSERVACIONSOL
        // //Datos de sucursal
        jsonIn.RutCliente.replace("-", "").toUpperCase(),// RUT
        parseInt(jsonIn.IdDistribuidor.toString(), 10),// DISTRIBUIDOR
        parseInt(jsonIn.IdSucursal.toString(), 10),// SUCURSAL
        jsonIn.IdEjecutivo,// USUARIOSAP//15 CLEON 8/6/2022
        (utility.checkNull(jsonIn.IdVendedor) !== null ? jsonIn.IdVendedor.toUpperCase() : null),// ID_VENDEDOR
        jsonIn.IdEjecutivo,// ID_EJECUTIVO_SAP  
        // //Datos del vehiculos
        (utility.checkNull(jsonIn.ValorIntAseg) !== null ? jsonIn.ValorIntAseg : null),// INTASEGURABLE
        (utility.checkNull(jsonIn.ValorUsoEsp) !== null ? parseInt(jsonIn.ValorUsoEsp, 10) : null),// USOESPECIFICO     
        parseInt(jsonIn.AnoVehiculo.toString(), 10),// ANOVEH
        ((utility.checkNull(jsonIn.IdModelo.toString()) !== null ) ? parseInt(jsonIn.IdModelo.toString(), 10) : null),// MODELO
        ((utility.checkNull(jsonIn.IdVersion.toString()) !== null ) ? parseInt(jsonIn.IdVersion.toString(), 10) : null),// VERSIONVEH
        utility.checkNull(jsonIn.TestDrive),// TESTDRIVE //24
        parseInt(jsonIn.CantidadVehiculos, 10),// CANTIDAD
        ((utility.checkNull(jsonIn.Adicionales.toString()) !== null ) ? parseInt(jsonIn.Adicionales.toString(), 10) : null),// ADICIONALES
        ((utility.checkNull(jsonIn.ValorVehiculo.toString()) !== null ) ? parseInt(jsonIn.ValorVehiculo.toString(), 10) : null),// VALORVEH
        ((utility.checkNull(jsonIn.Contado.toString()) !== null ) ? parseInt(jsonIn.Contado.toString(), 10) : null),// CONTADO
        ((utility.checkNull(jsonIn.MontoRetoma.toString()) !== null ) ? parseInt(jsonIn.MontoRetoma.toString(), 10) : null),// RETOMA
        montoTotal,// VALORTOTAL //30       
        //(jsonIn.ValorVehiculo-jsonIn.Contado),// //Datos del Credito
        parseInt(jsonIn.CodigoCredito, 10),// IDPRODUCTO
        ((utility.checkNull(jsonIn.PRODUCTO) !== null ) ? jsonIn.PRODUCTO.toUpperCase() : null),// PRODUCTO
        ((utility.checkNull(jsonIn.TipoCredito) !== null ) ? parseInt(jsonIn.TipoCredito,10) : null),// TIPO_CREDITO
        parseInt(jsonIn.NumeroCuotas, 10),// CUOTAS //34
        date,// PAGARE
        parseInt(jsonIn.IdFormaPago.toString(), 10),// FORMAPAGO
        utility.setFechaSQL(jsonIn.FechaVencimiento),// PAGO
        Resultados.GastosOperacionales,// GASTOSOPERACIONALES
        Resultados.TotalFinanciar,// TOTALFINANCIAR
        Resultados.ValorCuota,// VALORCUOTA
        Resultados.VFMG,// VFMG //40
        Resultados.PreEval,// PREEVAL
        null,// PRCEVAL
        Resultados.Uf,// VALORUF      
            //CAE + valor Impuesto + tasa Impuesto
        Resultados.Cae,//VALORCAE //44
        Resultados.ValorImpuesto,// VALORIMPUESTO   
        Resultados.TasaMensual,// TASAMENSUAL  
        //     //Datos seguros del Credito
        Resultados.ValorSegDesgravamen,// VALORSEGDESGRAVAMEN //47
        Resultados.ValorSegVida,// VALORSEGVIDA
        Resultados.ValorSegCesantia,// VALORSEGCESANTIA
        Resultados.ValorSegTriple,// VALORSEGTRIPLE   
        Resultados.ValorSegAsistenciaRuta,// VALORSEGASISTENCIARUTA
        Resultados.ValorBrutoSegDesgravamen,// VALOR_BRUTO_SEGDESGRAVAMEN
        Resultados.ValorBrutoSegVida,// VALOR_BRUTO_SEGVIDA
        Resultados.ValorBrutoSegCesantia,// VALOR_BRUTO_SEGCESANTIA
        Resultados.ValorBrutoSegTriple,// VALOR_BRUTO_SEGTRIPLE
        Resultados.ValorBrutoSegAsistenciaRuta,// VALOR_BRUTO_SEGASISTENCIARUTA //56 
        //Seguro Automotriz
        ((utility.checkNull(jsonIn.CodigoSeguro) !== null ) ? "S" : "N"),// SEGURO: String(1);
        utility.checkFullNull(jsonIn.NOMBRESEG),// NOMBRESEG
        utility.checkFullNull(jsonIn.CodigoSeguro),// COD_SEGURO
        utility.checkFullNull(jsonIn.DEDUCIBLE),// DEDUCIBLE
        (utility.checkNull(jsonIn.PRIMA) === null ? null : jsonIn.PRIMA.toString().replace(/\,/g, '.')),// PRIMA
        utility.checkNull(jsonIn.PLAZO),// PLAZO
        utility.returnBoolean(jsonIn.MULTIANUAL),// MULTIANUAL
        //Dato Aux
        'D',//AFFINITY D = Web Dealer
    //    (readCot.validarAdjudicado(jsonIn.IdAffinity,jsonGen.destinoSQL,[1001,1002]) ? getValor(jsonIn.IdAffinity,'AFFINITY',jsonGen.destinoSQL) : 'U'),
        //getValor(jsonIn.ID_AFFINITY,'AFFINITY',jsonGen.destinoSQL),// AFFINITY: String(1);
        getValor(jsonIn.IdAffinity,'AUX1',jsonGen.destinoSQL),// AUX1: String(50);
        getValor(jsonIn.IdAffinity,'AUX2',jsonGen.destinoSQL),// AUX2: String(50);
        'MOD',// AUX3: String(50);//67
        utility.returnBoolean(jsonIn.Lead),
        utility.returnBoolean(jsonIn.Flotas),
        utility.returnBoolean(jsonIn.Renovaciones),
        utility.getNuevoBool(jsonIn.NuevoUsado,'I').toString(),
        Resultados.ValorBrutoSegAsistenciaMedica,//VALOR_BRUTO_SEGASISTENCIAMEDICA
        Resultados.ValorSegAsistenciaMedica, //VALOR_SEGASISTENCIAMEDICA        
        0
    ]);    
    if(arry.length > 0){
        try{
            conn.executeUpdate(tQuery, arry);
            if (jsonGen.modo !== "T"){
                conn.commit();    
            jsonOut.resultadoSQL.push({"datos":"Historial Cotizacion",
                                    "code":"200",
                                    "status":"OK",
                                    "service":"guardarHistoricoCotizacion"});                
            }else{
                jsonOut.resultadoSQL.push({"datos":"Historial Cotizacion",
                        "code":"210",
                        "status":"OK-TEST",
                        "service":"guardarHistoricoCotizacion"}); 
            }
        }catch(e){
            jsonOut.Error.push({TEXTO_ERROR:e.message,
                                TIPO_ERROR:e.name,
                                arry:arry,
                                LOG_ERROR:"Historial Cotizacion"});
        }
        finally{
            conn.close();
        }
    }else{
        jsonOut.resultadoSQL.push({"datos":"Historial Cotizacion",
                                "code":"300",
                                "status":"NO EXISTEN REGISTROS QUE GUARDAR",
                                "service":"guardarHistoricoCotizacion"}); 
        // jsonOut.Status = 300;
    }   
}
// Funcion Guardar Documentos Sustentatorios
// 
function guardarDocSustentatorios(jsonIn,jsonOut,jsonGen){
    let arry = [],tQuery = 'INSERT INTO "' + jsonGen.destinoSQL + '.data::cotizaciones.docSustentatorios" VALUES(?,?,?,?,?)',conn = $.hdb.getConnection();
    for(let i = 0;i < jsonIn.length;i++)
    {
        arry.push([jsonIn[i].ID_AFFINITY,
            jsonIn[i].ID_EMPRESA,
            utility.checkNull(jsonIn[i].ID_DOC.toUpperCase()),
            utility.checkNull(jsonIn[i].NOMBRE_DOCUMENTO.toUpperCase()),
            (utility.checkNull(jsonIn[i].OBSERVACION.toUpperCase()))
            ]);
    }
    if(arry.length > 0){
        try{
            conn.executeUpdate(tQuery, arry);
            if (jsonGen.modo !== "T"){
                conn.commit();    
            jsonOut.resultadoSQL.push({"datos":"Documentos Sustentatorios",
                                    "code":"200",
                                    "status":"OK",
                                    "service":"guardarDocSustentatorios"});              
            }else{
                jsonOut.resultadoSQL.push({"datos":"Documentos Sustentatorios",
                        "code":"210",
                        "status":"OK-TEST",
                        "service":"guardarDocSustentatorios",
                        arry:arry}); 
            }
        }catch(e){
            jsonOut.Error.push({TEXTO_ERROR:e.message,
                                TIPO_ERROR:e.name,
                                LOG_ERROR:"Documentos Sustentatorios",
                                arry:arry});                
        }
        finally{
            conn.close();
        }
    }else{
        jsonOut.resultadoSQL.push({"datos":"Documentos Sustentatorios",
                                "code":"300",
                                "status":"NO EXISTEN REGISTROS QUE GUARDAR",
                                "service":"guardarDocSustentatorios"});    
    }
}
// Funcion Guardar Observaciones de Riesgo
// 
function guardarObservacionRiesgo(jsonIn,jsonOut,jsonGen){
    let arry = [],tQuery = 'INSERT INTO "' + jsonGen.destinoSQL + '.data::cotizaciones.observacionRiesgo" VALUES(?,?,?)',conn = $.hdb.getConnection();
    for(let i = 0;i < jsonIn.length;i++)
    {
        arry.push([jsonIn[i].ID_AFFINITY,
            jsonIn[i].ID_EMPRESA,
            (utility.checkNull(jsonIn[i].OBSERVACION))
            ]);
    }
    if(arry.length > 0){
        try{
            conn.executeUpdate(tQuery, arry);
            if (jsonGen.modo !== "T"){
                conn.commit();    
            jsonOut.resultadoSQL.push({"datos":"Observaciones Riesgo",
                                    "code":"200",
                                    "status":"OK",
                                    "service":"guardarObservacionRiesgo"});              
            }else{
                jsonOut.resultadoSQL.push({"datos":"Observaciones Riesgo",
                        "code":"210",
                        "status":"OK-TEST",
                        "service":"guardarObservacionRiesgo",
                        arry:arry}); 
            }
        }catch(e){
            jsonOut.Error.push({TEXTO_ERROR:e.message,
                                TIPO_ERROR:e.name,
                                LOG_ERROR:"Observaciones Riesgo",
                                arry:arry});                
        }
        finally{
            conn.close();
        }
    }else{
        jsonOut.resultadoSQL.push({"datos":"Observaciones Riesgo",
                                "code":"300",
                                "status":"NO EXISTEN REGISTROS QUE GUARDAR",
                                "service":"guardarObservacionRiesgo"});    
            }
}
function guardarPreCotizacion(jsonSave,ID_AFFINITY,destinoSQLA) {
	  var oConn = $.hdb.getConnection();
  	  var queryT = 'SELECT  UTCTOLOCAL( CURRENT_UTCTIMESTAMP,\'UTC-4\' ) as local,CURRENT_UTCTIMESTAMP,CURRENT_TIMESTAMP FROM dummy';
      var date = new Date(oConn.executeQuery(queryT)[0].LOCAL);
      var arry = [], tQuery = 'INSERT INTO "' + destinoSQLA + '.data::cotizaciones.cotizacion"' 
       + ' VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?'//20
       + ',?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';//13
       arry.push([ID_AFFINITY,
             date,//FECHA
             (utility.checkCampo(jsonSave.Respuesta[0].IdDistribuidor, 'N')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].IdSucursal, 'N')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].IdVendedor, 'C')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].IdUsuario, 'C')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Infcomple.idSap, 'C')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].IdModelo, 'N')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].IdVersion, 'N')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].IdEjecutivo, 'C')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].NuevoUsado, 'C')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].ValorVehiculo, 'N')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].Contado, 'N')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].AnoVehiculo, 'N')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].IdFormaPago, 'N')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].CodigoCredito, 'N')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].NumeroCuotas, 'N')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].RutCliente, 'C').toUpperCase()),//DISTRIBUIDOR
             jsonSave.Respuesta[0].Email.trim(), // correo
             (utility.checkCampo(jsonSave.Respuesta[0].ApellidoPaterno, 'C')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].ApellidoMaterno, 'C')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].Nombre, 'C')),//DISTRIBUIDOR
             null, // telefono
             (utility.checkCampo(jsonSave.Respuesta[0].MontoTotal, 'N')), // monto total
             null, //(utility.checkCampo(jsonSave.Respuesta[0].TasaMensual, 'D')),,
             (utility.checkCampo(jsonSave.Respuesta[0].FechaNacimiento, 'C')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].FechaVencimiento, 'C')),//DISTRIBUIDOR
             null, // Deducuble
             (utility.checkCampo(jsonSave.Respuesta[0].MontoRetoma, 'N')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].CantidadVehiculos, 'N')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].SegDesgravamenSN, 'C')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].NombreSolicitante, 'C')),//DISTRIBUIDOR
             (utility.checkCampo(jsonSave.Respuesta[0].DiaPago, 'N')),
             (utility.checkCampo(jsonSave.Respuesta[0].Direccion, 'C')), // DIRECCION
             (utility.checkCampo(jsonSave.Respuesta[0].Comuna, 'C')), //COMUNA
             (utility.checkCampo(jsonSave.Respuesta[0].Cuidad, 'C')), //CIUDAD
             (utility.checkCampo(jsonSave.Infcomple.MessageId, 'C'))
            ]);    
     if(arry.length > 0){
         try{
                oConn.executeUpdate(tQuery, arry);
                oConn.commit();  
                jsonSave.Infcomple.idAffinity = ID_AFFINITY; 
                jsonSave.Respuesta[0].IdPrecotizacion = jsonSave.Infcomple.MessageId;
                jsonSave.ResultadoSQL.push({"datos":"Cotizacion-OnLine " + ID_AFFINITY,
                                        "code":"200",
                                        "status":"OK",
                                        "service":"guardarPrecotizacion"});                
            }catch(e){
                jsonSave.Error.push({TEXTO_ERROR:e.message,
                                    TIPO_ERROR:e.name,
                                    LOG_ERROR:" Guardar Precotizacion-OnLine",
                                    arry:arry,
                                    tQuery:tQuery});
                jsonSave.Status = 500;
            }
       } else {
              jsonSave.ResultadoSQL.push({"datos":"Precotizacion-OnLine",
                                      "code":"300",
                                      "status":"NO EXISTEN REGISTROS QUE GUARDAR",
                                      "service":"guardarPrecotizacion"}); 
       }       
   oConn.close();
}
///
function grabCliente(JSONObj,jsonSave,destinoSQLA) {
    var flag = true,response = true;
	var oConnection = $.hdb.getConnection();
	var rut = JSONObj.RutCliente;
	rut = rut.replace("-", "");
	var nombre = JSONObj.Nombre;
	var apaterno = JSONObj.ApellidoPaterno;
	var amaterno = JSONObj.ApellidoMaterno;
	var mail = JSONObj.Email;
	var nac = JSONObj.FechaNacimiento;
	nac = JSONObj.FechaNacimiento.substring(6, 10) + '-' +
	      JSONObj.FechaNacimiento.substring(3, 5) + '-' + JSONObj.FechaNacimiento.substring(0, 2);
	var empresa = '';
    var query = 'SELECT RUT FROM "' + destinoSQLA + '.data::clientes.identificacion"' 
                + 'WHERE RUT=?';
     
	var rs = oConnection.executeQuery(query,rut);
    for( let i = 0; i < rs.length; i++){
        flag = false;
        try{
    		query = 'UPDATE "' + destinoSQLA + '.data::clientes.identificacion"'
    		+ 'SET NOMBRE = ?, APATERNO = ?, AMATERNO = ?, MAIL = ?, FECHANAC = ?, CHECKEMPRESA = ? WHERE RUT = ?';  
		    oConnection.executeUpdate(query,nombre,apaterno,amaterno,mail,nac,empresa,rut.toUpperCase());
		    oConnection.commit();
		    response = true;
		}catch(e){
            jsonSave.Error.push({TEXTO_ERROR:e.message,
                                    TIPO_ERROR:e.name,
                                    LOG_ERROR:" Guardar Cliente",
                                    tQuery:query});
            jsonSave.Status = 500;
			response = {
				code: 409,
				message: 'Error: ' + e.message
			};
		}
	
		
    } 

//CHECKEMPRESA este campo es vacio    
	if (flag) {
        query = 'INSERT INTO "' + destinoSQLA + '.data::clientes.identificacion"'
        + ' (RUT,NOMBRE,APATERNO,AMATERNO,MAIL,FECHANAC)'
        + ' VALUES(?,?,?,?,?,?)';
        try{
            oConnection.executeUpdate(query,rut.toUpperCase(),nombre,apaterno,amaterno,mail,nac);
            oConnection.commit();
            response = true;
		} catch (e) {
            jsonSave.Error.push({TEXTO_ERROR:e.message,
                                    TIPO_ERROR:e.name,
                                    LOG_ERROR:" Guardar Cliente",
                                    tQuery:query});                        
		    jsonSave.Status = 500;
			response = {
				code: 409,
				message: 'Error: ' + e.message
			};
			response = {
				code: 409,
				message: 'Error: ' + e.message
			};
		}
	}
    oConnection.close();
	return response;
}

