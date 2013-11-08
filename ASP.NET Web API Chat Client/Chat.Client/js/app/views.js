/// <reference path="../referencies.js" />
var WebChat = WebChat || {};

WebChat.Views = (function () {
    var root = "js/partials/";
    var loadPartialHtml = function (name, callback) {
        var view = "";

        $.ajax({
            url: root + name + ".html",
            type: "GET",
            success: function (templateHtml) {
                view = templateHtml;
                callback(view);
            },
            error: function (err) {
                console.log(err)
            }
        });
    };

    
    return {
        loginView: function (callback) {
            return loadPartialHtml("login-view", callback);
        },

        registerView: function (callback) {
            return loadPartialHtml("register-view", callback);
        },

        registerView: function (callback) {
            return loadPartialHtml("register-view", callback);
        },

        chatLayout: function (callback) {
            return loadPartialHtml("chat-layout", callback);
        },

        newChatRoom: function (callback) {
            return loadPartialHtml("new-chatroom-form", callback);
        }
    };
    
})();