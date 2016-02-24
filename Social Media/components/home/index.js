'use strict';

app.home = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home


// START_CUSTOM_CODE_homeModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
(function(parent) {
    var provider = app.data.socialMedia,
        mode = 'signin',
        registerRedirect = 'aboutView',
        signinRedirect = 'aboutView',
        init = function(error) {
            if (error) {
                if (error.message) {
                    alert(error.message);
                }
                return false;
            }

            var activeView = mode === 'signin' ? '.signin-view' : '.signup-view';

            if (provider.setup && provider.setup.offlineStorage && !app.isOnline()) {
                $('.offline').show().siblings().hide();
            } else {
                $(activeView).show().siblings().hide();
            }
        },
        successHandler = function(data) {
            var redirect = mode === 'signin' ? signinRedirect : registerRedirect;
            if (data && data.result) {
                app.user = data.result;
                setTimeout(function() {
                    app.mobileApp.navigate('components/' + redirect + '/view.html');
                }, 0);
            } else {
                init();
            }
        },
        homeModel = kendo.observable({
            displayName: '',
            email: '',
            password: '',
            validateData: function(data) {
                if (!data.email) {
                    alert('Missing email');
                    return false;
                }

                if (!data.password) {
                    alert('Missing password');
                    return false;
                }

                return true;
            },
            signin: function() {
                var model = homeModel,
                    email = model.email.toLowerCase(),
                    password = model.password;

                if (!model.validateData(model)) {
                    return false;
                }
                provider.Users.login(email, password, successHandler, init);
            },
            register: function() {
                var model = homeModel,
                    email = model.email.toLowerCase(),
                    password = model.password,
                    displayName = model.displayName,
                    attrs = {
                        Email: email,
                        DisplayName: displayName
                    };

                if (!model.validateData(model)) {
                    return false;
                }

                provider.Users.register(email, password, attrs, successHandler, init);
            },
            facebookLogin: function() {

                var facebookConfig = {
                    name: 'Facebook',
                    loginMethodName: 'loginWithFacebook',
                    endpoint: 'https://www.facebook.com/dialog/oauth',
                    response_type: 'token',
                    client_id: 1086764318010540,
                    redirect_uri: "http://www.facebook.com/connect/login_success.html",
                    access_type: 'online',
                    scope: 'email',
                    display: 'touch'
                };

                var facebook = new IdentityProvider(facebookConfig);

                app.mobileApp.showLoading();

                facebook.getAccessToken(function(token) {
                    provider.Users.loginWithFacebook(token)
                        .then(function() {
                            app.mobileApp.hideLoading();
                            provider.User.currentUser(successHandler, init);
                        });
                });
            },
            toggleView: function() {
                mode = mode === 'signin' ? 'register' : 'signin';
                init();
            }
        });

    parent.set('homeModel', homeModel);
    parent.set('afterShow', function() {
        provider.Users.currentUser().then(successHandler, init);
    });
})(app.home);
// END_CUSTOM_CODE_homeModel