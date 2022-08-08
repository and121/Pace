
var json = {
    "typeData": 1,
    "targetSystemLeadId": "",
    "firstName": "Nicole",
    "lastName": "Pamela",
    "identityNumber": "14061687-7",
    "email": "nicole@gmail.com",
    "mobilePhoneNumber": 987654321,
    "phone": 987654321,
    "dealer": "CLDN00250",
    "comments": "test"
};

function encodeB64(cadena){
    return $.util.codec.encodeBase64($.security.crypto.sha256(cadena));   
}

function decodeB64(cadena){
    return $.util.codec.decodeBase64($.security.crypto.sha256(cadena).getByte());
}

var cadena = "Hola Mundo";
var key = "NissanChileSha256";

var e64 = encodeB64(cadena);

var d64 = decodeB64("w6Si5J2R8hdxE6mt/LnvmvlnncRVego6RgLhvTmm9IE=");

$.response.setBody( d64 );