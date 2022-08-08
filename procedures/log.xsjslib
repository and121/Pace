$.import("CL_PACKAGE_PACE_DEV.procedures", "utility");
var utility = $.CL_PACKAGE_PACE_DEV.procedures.utility;
// Funcion Guardar Cabecera Log
// 
function guardarCabeceraLog(jsonIn,jsonOut,jsonGen){
    let arry = [],tQuery = 'INSERT INTO "' + jsonGen.destinoSQL + '.data::log.cabecera" VALUES(?,?,?,?,?,?,?,?,?,?)',conn = $.hdb.getConnection();
    var oConn = $.hdb.getConnection(),queryT = 'SELECT  UTCTOLOCAL( CURRENT_UTCTIMESTAMP,\'UTC-4\' ) as local,CURRENT_UTCTIMESTAMP,CURRENT_TIMESTAMP FROM dummy';
    var date = new Date(oConn.executeQuery(queryT)[0].LOCAL);       
    for(let i = 0;i < jsonIn.length;i++)
    {
        arry.push([jsonIn[i].ID_LOG,
            jsonOut.ID_AFFINITY,
            date,
            (date.getMonth() + 1),
            date.getFullYear(),
            jsonIn[i].APLICACION,
            jsonIn[i].FUNCION,
            jsonIn[i].TIPO,
            jsonIn[i].ORIGEN,
            utility.checkFullNull(jsonIn[i].CPI_ID)
            ]);
    }
    if(arry.length > 0){
        try{
            conn.executeUpdate(tQuery, arry);
            if (jsonGen.modo !== "T"){
                conn.commit();    
            jsonOut.resultadoSQL.push({"datos":"Log",
                                    "code":"200",
                                    "status":"OK",
                                    "Service":"guardarCabeceraLog"});              
            }else{
                jsonOut.resultadoSQL.push({"datos":"Log",
                        "code":"210",
                        "status":"OK-TEST",
                        "Service":"guardarCabeceraLog",
                        arry:arry}); 
            }
        }catch(e){
            jsonOut.error.push({TEXTO_ERROR:e.message,
                                Code:500,
                                Description:e.message,
                                TIPO_ERROR:e.name,
                                LOG_ERROR:"Log",
                                arry:arry});                
        }
        finally{
            conn.close();
        }
    }else{
        jsonOut.resultadoSQL.push({"LOG_ERROR":"Log",
                            "TIPO_ERROR":"220",
                            "TEXTO_ERROR":"NO EXISTEN REGISTROS QUE GUARDAR"});    
    }
    
}
//Funcion guardar detalle de log
//
function guardarDetalleLog(jsonIn,jsonOut,jsonGen){
    let arry = [],tQuery = 'INSERT INTO "' + jsonGen.destinoSQL + '.data::log.detalle" VALUES(?,?,?,?,?)',conn = $.hdb.getConnection();
    for(let i = 0;i < jsonIn.length;i++)
    {
        arry.push([jsonIn[i].ID_LOG,
                    jsonIn[i].ID_LOG_DETALLE,
                    jsonIn[i].CODIGO,
                    jsonIn[i].CONTENIDO,
                    jsonIn[i].TYPE
                    ]);
    }
    if(arry.length > 0){
        try{
            conn.executeUpdate(tQuery, arry);
            if (jsonGen.modo !== "T"){
                conn.commit();    
            jsonOut.resultadoSQL.push({"datos":"Log",
                                    "code":"200",
                                    "status":"OK",
                                    "Service":"guardarDetalleLog"});              
            }else{
                jsonOut.resultadoSQL.push({"datos":"Log",
                        "code":"210",
                        "status":"OK-TEST",
                        "Service":"guardarDetalleLog",
                        arry:arry}); 
            }
        }catch(e){
            jsonOut.error.push({TEXTO_ERROR:e.message,
                                Code:500,
                                Description:e.message,
                                TIPO_ERROR:e.name,
                                LOG_ERROR:"Log",
                                arry:arry});                
        }
        finally{
            conn.close();
        }
    }else{
        jsonOut.resultadoSQL.push({"LOG_ERROR":"Log",
                            "TIPO_ERROR":"220",
                            "TEXTO_ERROR":"NO EXISTEN REGISTROS QUE GUARDAR"});    
    }
    
}
function grabarLog(MsgIn,control,jsonIn,objG) {
    var conn = $.hdb.getConnection(); 
    let oIDLOG = parseInt(utility.nextID('idLog',objG.destinoSQL),10);
    try {
        let cab = [];
        cab.push({ID_LOG:oIDLOG,
                APLICACION:control.aplicacion.toUpperCase(),
                FUNCION:control.funcion.toUpperCase(),
                TIPO:control.tipo.toUpperCase(),
                ORIGEN:control.origen.toUpperCase(),
                CPI_ID:control.cpiID
        });
        guardarCabeceraLog(cab,jsonIn,objG);
        let det = [];
        for(let j = 0; j < MsgIn.length; j++){
            det.push({ID_LOG:oIDLOG,
                    ID_LOG_DETALLE:utility.nextID('idLogDetalle',objG.destinoSQL),
                    CODIGO:(utility.checkFullNull(MsgIn[j].Code) === null ? MsgIn[j].codigo : MsgIn[j].Code),
                    CONTENIDO:(utility.checkFullNull(MsgIn[j].Description) === null ? MsgIn[j].descripcion : MsgIn[j].Description),
                    TYPE:MsgIn[j].Type});
        }
        if(det.length > 0){
            guardarDetalleLog(det,jsonIn,objG);
        }
		} catch (e) {
		}
    conn.close(); 
    return true;
}