function getParameterByName(name, url) {
    name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
    var regexS = name + '=([^&#]*)';

    var regex = new RegExp(regexS);
    var results = regex.exec(url);

    if (results === null) {
        return false;
    } else {
        return decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
}

var IdentityProvider = function (config) {
    var that = this;

    this.getAccessToken = function (callback) {

        // Begin Authorization
        var authorize_url;

        authorize_url = config.endpoint + '?response_type=' + config.response_type + '&client_id=' + config.client_id + '&redirect_uri=' + config.redirect_uri + '&display=' + config.display + '&access_type=' + config.access_type + '&scope=' + config.scope;


        // open the InAppBrowser with the link 
        ref = window.open(authorize_url, '_blank', 'location=no');
        ref.addEventListener('loadstop', function (event) {
            that.locationChanged(event.url, callback);
        });

        ref.addEventListener('loaderror', function (event) {
            alert("Load error: " + event.message);
        });

    }

    this.locationChanged = function (loc, callback) {
            console.log(loc);
        if (loc.indexOf('access_token=') !== -1) {
            ref.close();
            var token = getParameterByName('access_token', loc);
            callback(token);
        }
    }
}