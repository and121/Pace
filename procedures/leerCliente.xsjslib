function leerCliente(rut) {
    try {
    var query = 'SELECT *, TO_VARCHAR(FECHANAC,\'DD/MM/YYYY\') as FECHA_NAC, '
    + ' (select TOP 1 DIRECCION from \"QasAffinity.data::clientes.direccion\" where rut = rut ) as DIRECCION'
    + ' FROM "QasAffinity.data::clientes.identificacion" WHERE RUT = ?';
    var oConnection = $.hdb.getConnection();

    var oResultSet = oConnection.executeQuery(query,rut);
    for(let i = 0; i < oResultSet.length; i++){
        var oRut = oResultSet[i].RUT;
        var rRut = oRut.substring(0, oRut.length - 1);
        rRut = parseInt(rRut, 10);
        var oNombre = oResultSet[i].NOMBRE;
        var oApaterno = oResultSet[i].APATERNO;
        var oAmaterno = oResultSet[i].AMATERNO;
        // var oFechaNac = oResultSet.FECHA_NAC;
        var oMail = oResultSet[i].MAIL;
        var fechaNac = oResultSet[i].FECHA_NAC;
        var empresa = oResultSet[i].CHECKEMPRESA;
        var direccion = oResultSet[i].DIRECCION;
    }
    
    query = 'SELECT * FROM "QasAffinity.data::clientes.fonos" WHERE RUT=?';
    oResultSet = oConnection.executeQuery(query,rut);
    
    for(let i = 0; i < oResultSet.length; i++) {
        if(oResultSet[i].NIVEL === "P") {
            var tel1 = oResultSet[i].FONO;
            var tipo1 = oResultSet[i].TIPO; 
        } else if (oResultSet[i].NIVEL === "S") {
            var tel2 = oResultSet[i].FONO;
            var tipo2 = oResultSet[i].TIPO;
        }
    } 
    if (rRut < 50000000) {
    var result =    {
                    RUT:oRut,
                    NOMBRE: oNombre,
                    APATERNO: oApaterno,
                    AMATERNO: oAmaterno,
                    TELEFONO1:tel1,
                    TIPO1:tipo1,
                    TELEFONO2:tel2,
                    TIPO2:tipo2,
                    MAIL: oMail,
                    FECHANAC: fechaNac,
                    FECHA_NAC: fechaNac,
                    CheckEmpresa:empresa,
                    DIRECCION: direccion
                    }; 
    } else {
        result = {
                    RUT:oRut,
                    NOMBRE: oNombre,
                    TELEFONO1:tel1,
                    TIPO1:tipo1,
                    TELEFONO2:tel2,
                    TIPO2:tipo2,
                    MAIL: oMail,
                    FECHANAC: fechaNac,
                    CheckEmpresa:empresa,
                    DIRECCION: direccion
                    }; 
    }    
        oConnection.close(); 
        return result;
    } catch (e) {
        return e + e.messagge;
    }
}
