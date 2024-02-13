// The sendingRequest and responseReceived functions will be called for all requests/responses sent/received by ZAP, 
// including automated tools (e.g. active scanner, fuzzer, ...)

// Note that new HttpSender scripts will initially be disabled
// Right click the script in the Scripts tree and select "enable"  

// 'initiator' is the component the initiated the request:
// 		1	PROXY_INITIATOR
// 		2	ACTIVE_SCANNER_INITIATOR
// 		3	SPIDER_INITIATOR
// 		4	FUZZER_INITIATOR
// 		5	AUTHENTICATION_INITIATOR
// 		6	MANUAL_REQUEST_INITIATOR
// 		7	CHECK_FOR_UPDATES_INITIATOR
// 		8	BEAN_SHELL_INITIATOR
// 		9	ACCESS_CONTROL_SCANNER_INITIATOR
// 		10	AJAX_SPIDER_INITIATOR
// For the latest list of values see the HttpSender class:
// https://github.com/zaproxy/zaproxy/blob/main/zap/src/main/java/org/parosproxy/paros/network/HttpSender.java
// 'helper' just has one method at the moment: helper.getHttpSender() which returns the HttpSender 
// instance used to send the request.
//
// New requests can be made like this:
// msg2 = msg.cloneAll() // msg2 can then be safely changed as required without affecting msg
// helper.getHttpSender().sendAndReceive(msg2, false);
// print('msg2 response=' + msg2.getResponseHeader().getStatusCode())

var HttpRequestHeader = Java.type("org.parosproxy.paros.network.HttpRequestHeader");
var HtmlParameter = Java.type("org.parosproxy.paros.network.HtmlParameter");
var HtmlParameterType = Java.type("org.parosproxy.paros.network.HtmlParameter.Type");
var HttpMessage = Java.type("org.parosproxy.paros.network.HttpMessage");
var HttpHeader = Java.type("org.parosproxy.paros.network.HttpHeader");
var URI = Java.type("org.apache.commons.httpclient.URI");
var LastTokenGenerationTime;

function sendingRequest(msg, initiator, helper) {
    var url = msg.getRequestHeader().getURI().toString();
    if (url.contains('http://host.docker.internal:3000')) { // Adding token to requests containing following url
        print('requestReceived called for url=' + url);
        msg2 = msg.cloneAll()
        requestUri = new URI('http://host.docker.internal:3000/rest/user/login', false);
        requestHeader = new HttpRequestHeader(HttpRequestHeader.POST, requestUri, HttpHeader.HTTP10);

        msg2.setRequestHeader(requestHeader);
        msg2.getRequestBody().setBody("email=admin%40juice-sh.op&password=admin123")
        var msgheader = msg2.getRequestHeader();
        msgheader.addHeader("Content-Length", msg2.getRequestBody().length());
        msg2.setRequestHeader(msgheader);

        try {

            helper.getHttpSender().sendAndReceive(msg2, true); //Generating token

            print('msg2 request=' + msg2.getRequestHeader());
            print('msg2 response status=' + msg2.getResponseHeader().getStatusCode())
            print('msg2 response body=' + msg2.getResponseBody())
            print('token ****' + JSON.parse(msg2.getResponseBody()).authentication.token)
            //------------- Creating Get Token Request (Can update as per your token generation API call) -end ----------

            org.zaproxy.zap.extension.script.ScriptVars.setGlobalVar("logintoken", JSON.parse(msg2.getResponseBody()).authentication.token);

            //Adding authorization header to all calls made by ZAP

        } catch (err) {
            print('continue on error');
            print(err.message);
        }

        var header = msg.getRequestHeader();
        header.setHeader("Authorization", "Bearer " + org.zaproxy.zap.extension.script.ScriptVars.getGlobalVar("logintoken"));
        msg.setRequestHeader(header);

        print('msg request header=' + msg.getRequestHeader())
    }
}

function responseReceived(msg, initiator, helper) {
    // Debugging can be done using println like this
    // print('responseReceived called for url=' + msg.getRequestHeader().getURI().toString())
    var url = msg.getRequestHeader().getURI().toString();
    if (url.contains('http://host.docker.internal:3000')) { // Adding token to requests containing following url
        print('responseReceived called for url=' + msg.getRequestHeader().getURI().toString())
        print('responseReceived called response status = ' + msg.getResponseHeader().getStatusCode())
    }
}