/* 
 * CSInterface - v9.4.0 
 * Standard Adobe CEP Library
 */
function CSInterface() {
    this.PROTOCOL_VERSION = "6.0.0";
    this.hostEnvironment = JSON.parse(window.__adobe_cep__.getHostEnvironment());
}
CSInterface.prototype.evalScript = function (script, callback) {
    if (callback === null || callback === undefined) {
        callback = function (result) { };
    }
    window.__adobe_cep__.evalScript(script, callback);
};
CSInterface.prototype.addEventListener = function (type, listener, obj) {
    window.__adobe_cep__.addEventListener(type, listener, obj);
};
CSInterface.prototype.getSystemPath = function (pathType) {
    return window.__adobe_cep__.getSystemPath(pathType);
};
CSInterface.prototype.closeExtension = function () {
    window.__adobe_cep__.closeExtension();
};
