/// <reference path="../referencies.js" />

var WebChat = WebChat || {};

WebChat.DataPersisters = (function () {
    var apiUrl = "";

    var saveUserToStorage = function (userData) {
        localStorage.setItem("username", userData.Username);
        localStorage.setItem("userId", userData.Id);
    }

    var clearUserStorage = function () {
        localStorage.clear();
    }

    var UserHelpers = function () {
        var self = this;
        self.apiUrl = apiUrl + "Users/";

        self.login = function (userData, success, fail) {
            httpRequester.putJSON(self.apiUrl + "login", userData, function (data) {
                saveUserToStorage(data);
                success(data);
            }, function (err) {
                fail(err);
            });
        }

        self.logout = function (userData, success, fail) {
            httpRequester.putJSON(self.apiUrl + "logout", userData, function (data) {
                clearUserStorage();
                success(data);
            }, function (err) {
                fail(err);
            });
        }

        self.getCurrentUserData = function (success, fail) {
            if ((localStorage.getItem("userId") != "") || (localStorage.getItem("userId") != undefined)) {
                httpRequester.getJSON(self.apiUrl + "get/" + localStorage.getItem("userId"),
                    function (userData) {
                        success(userData);
                    },
                    function (err) {
                        fail(err);
                    });
            }
        }
    }

    var ChatRooms = function () {
        var self = this;
        self.apiUrl = apiUrl + "ChatRooms/";

        self.getAll = function (success, fail) {
            httpRequester.getJSON(self.apiUrl, function (roomsData) {
                success(roomsData);
            }, function (err) {
                fail(err);
            })
        }

        self.getById = function (id, success, fail) {
            httpRequester.getJSON(self.apiUrl + "get/" + id, function (roomData) {
                success(roomData);
            }, function (err) {
                fail(err);
            });
        }

        self.create = function (roomData, success, fail) {
            httpRequester.postJSON(self.apiUrl + "create/", roomData, function (newRoom) {
                success(newRoom);
            }, function (err) {
                fail(err);
            });
        }

        self.delete = function (roomId, success, fail) {
            httpRequester.deleteJSON(self.apiUrl + "delete/" + roomId, function () {
                success();
            }, function (err) {
                fail(err);
            });
        }

        self.subscribe = function (user, roomId, success, fail) {
            httpRequester.putJSON(self.apiUrl + "subscribe/" + roomId, user,
                function () {
                    success();
                }, function (err) {
                    fail(err);
                });
        }
    }

    var Messages = function () {
        var self = this;
        self.apiUrl = apiUrl + "Posts/";

        self.sendMessage = function (messageData, success, fail) {
            httpRequester.postJSON(self.apiUrl + "send", messageData, function (res) {
                success(res);
            }, function (err) {
                fail(err);
            });
        }
    }

    return {
        init: function (params) {
            if (params.apiUrl != undefined) {
                apiUrl = params.apiUrl;
            } else {
                console.log("No API Url defined");
            }
        },
        users: function () {
            return new UserHelpers();
        },
        chatRooms: function () {
            return new ChatRooms();
        },
        messages: function () {
            return new Messages();
        },
        checkLoggedUser: function () {
            if (localStorage.getItem("userId") != null) {
                return true;
            }
        }
    }
})();