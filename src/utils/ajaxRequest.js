import properties from '../properties'

export function makePostCall(url, body, success, error, authError) {
    makeBodyCall("POST", url, body, success, error, authError);
}

export function makePutCall(url, body, success, error, authError) {
    makeBodyCall("PUT", url, body, success, error, authError);
}

export function makeGetCall(url, success, error, authError) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", properties.backendServer + url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("usertoken", localStorage.getItem("userToken"));
    xhr.send();
    xhr.onreadystatechange = function() {
        onReadyStateChange(xhr, success, error, authError);
    }
}

function onReadyStateChange(xhr, success, error, authError) {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status != 200) {
            // обработать ошибку
            if (xhr.status === 500) {
                //alert(500);
                if (error)
                    error(JSON.parse(xhr.responseText));
                else {
                    defaultErrorHandler(xhr);
                }
            }
            if (xhr.status === 401) {
                if (authError)
                //alert(401);
                    authError(xhr);
                else
                    defaultErrorHandler(xhr);
            }
            //alert(xhr.status + ': ' + xhr.statusText + "\nreadyState: " + xhr.readyState); // пример вывода: 404: Not Found
        } else {
            if (xhr.status === 200) {
                // вывести результат
                if (xhr.getAllResponseHeaders().indexOf("usertoken") >= 0) {
                    if (xhr.getResponseHeader("usertoken") != null) {
                        localStorage.setItem("userToken", xhr.getResponseHeader("usertoken"));
                    }
                }
                success(JSON.parse(xhr.responseText));
                //alert(xhr.responseText); // responseText -- текст ответа.
            }
        }
    }

}

function makeBodyCall(method, url, body, success, error, authError) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, properties.backendServer + url, true, );
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("usertoken", localStorage.getItem("userToken"));
    //xhr.setRequestHeader("Transfer-Encoding", "Access-Control-Expose-Headers");
    xhr.send(JSON.stringify(body));
    xhr.onreadystatechange = function() {
        onReadyStateChange(xhr, success, error, authError);
    }
}

function defaultErrorHandler(xhr) {
    alert(xhr.status + ": " + xhr.responseText);
}