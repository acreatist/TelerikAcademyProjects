/// <reference path="../referencies.js" />
var WebChat = WebChat || {};

WebChat.ViewModels = (function () {
    var dataHelpers = {};
    var currUserData = {};

    var UserViewModel = function () {
        var self = this;
        var usersDataHelper = dataHelpers.users();

        self.username = ko.observable();
        self.password = ko.observable();
        self.passwordConfirm = ko.observable();

        self.isLogged = ko.observable(false);
        self.loggedUsername = ko.observable();

        self.err = ko.observable(false);
        self.errMessage = ko.observable();

        self.login = function () {
            var userData = {
                Password: self.password(),
                Username: self.username()
            }

            usersDataHelper.login(userData, function (loggedUserData) {
                self.isLogged(true);
                currUserData = loggedUserData;

                $.event.trigger({
                    type: "logged",
                    message: "User Loggedin",
                    time: new Date()
                });
            }, function () {
                $.event.trigger({
                    type: "error",
                    message: "Login error, please try again.",
                    time: new Date()
                });
            });
        }

        self.register = function () {
            var userData = {
                Password: self.password(),
                Username: self.username()
            }

            if (self.password() === self.passwordConfirm()) {
                
                usersDataHelper.register(userData, function (loggedUserData) {
                    self.isLogged(true);
                    currUserData = loggedUserData;
                    $.event.trigger({
                        type: "logged",
                        message: "User Loggedin",
                        time: new Date()
                    });
                }, function () {
                    $.event.trigger({
                        type: "error",
                        message: "Login error, please try again.",
                        time: new Date()
                    });
                });
            } else {
                self.err(true);
                self.errMessage("Password missmatch");
            }
        }

        self.logout = function () {
            usersDataHelper.logout(function () {
                self.isLogged(false);
                $.event.trigger({
                    type: "loggedout",
                    message: "Logged out",
                    time: new Date()
                });
            }, function (err) {
                console.log(err);
            });
        }
    };

    var RoomModel = Class.create({
        init: function (data) {
            this.id = ko.observable(data.ChatRoomId),
            this.name = ko.observable(data.Name),
            this.postsCount = ko.observable(data.PostCount),
            this.usersCount = ko.observable(data.UserCount),
            // currently the api doesn't hold a field of who is the room creator, so we can't observe it.
            this.isOwn = ko.observable(true);
        }
    });

    var UserModel = Class.create({
        init: function (data) {
            this.username = ko.observable(data.Username)
        }
    });

    var PostModel = Class.create({
        init: function (data) {
            this.userId = ko.observable(data.UserId),
            this.content = ko.observable(data.Content)
        }
    });

    var ChatViewModel = function () {
        var self = this;

        self.currentUserName = ko.observable();
        self.rooms = ko.observableArray([]);
        self.selectedRoom = ko.observable();
        self.newRoomName = ko.observable();
        
        self.users = ko.observableArray([]);
        self.posts = ko.observableArray([]);
        
        self.newPost = ko.observable();
        self.isSubscribed = ko.observable(false);
        self.roomId = 0;

        var populateCurrRoomData = function (roomData) {
            self.selectedRoom(roomData);
            self.users([]);
            self.posts([]);

            for (var u = 0; u < roomData.Users.length; u++) {
                if (roomData.Users[u].Username === currUserData.username) {
                    self.isSubscribed(true);
                }

                self.users.push(new UserModel({ "Username": roomData.Users[u].Username }));
            }

            for (var p = 0; p < roomData.Posts.length; p++) {
                self.posts.push(new PostModel({
                    "UserId": roomData.Posts[p].Username,
                    "Content": roomData.Posts[p].Content
                }));
            }
        }

        self.getRoomData = function () {
            dataHelpers.chatRooms().getAll(function (roomsData) {
                self.rooms([]);
                for (var i = 0; i < roomsData.length; i++) {
                    var roomModel = new RoomModel(roomsData[i]);

                    self.rooms.push(roomModel);
                }
            }, function (err) {
                console.log(err);
            });
        }

        self.getCurrRoomMessages = function () {
            dataHelpers.chatRooms().getById(self.selectedRoom().ChatRoomId, function (roomData) {
                populateCurrRoomData(roomData);
            });
        }

        self.selectRoom = function (room) {
            dataHelpers.chatRooms().getById(room.id(), function (roomData) {
                populateCurrRoomData(roomData);
            });
        }

        self.createRoom = function (success) {
            var newRoomData = {
                "Name": self.newRoomName()
            };

            dataHelpers.chatRooms().create(newRoomData, function (newRoom) {
                var newRoomModelParse = {
                    "ChatRoomId": newRoom.Id,
                    "Name": newRoom.Name,
                    "PostCount": newRoom.Posts,
                    "UserCount": newRoom.Users
                }
                var newRoomModel = new RoomModel(newRoomModelParse);
                newRoomModel.isOwn(true);
                self.rooms.push(newRoomModel);
                self.newRoomName("");

                success();
            }, function (err) {
                console.log(err);
            });

        }

        self.deleteRoom = function (room) {
            dataHelpers.chatRooms().delete(room.id(), function () {
                self.rooms.remove(room);
                self.selectedRoom(false);
            }, function (err) {
                console.log(err);
            });
        }

        self.subscribe = function () {
            dataHelpers.chatRooms().subscribe(currUserData, self.selectedRoom().ChatRoomId,
                function (res) {
                    self.users.push(new UserModel({ "Username": currUserData.Username }));
                    self.isSubscribed(true);
                }, function (err) {
                    console.log(err);
                });
        }

        self.postMessage = function () {
            var messageData = {
                "Date": new Date(),
                "Content": self.newPost(),
                "UserId": currUserData.UserId,
                "ChatRoomId": self.selectedRoom().ChatRoomId
            };

            dataHelpers.messages().sendMessage(messageData, function (res) {
                self.posts.push(new PostModel({
                    "UserId": res.UserId,
                    "Content": res.Content
                }));

                self.newPost("");
            }, function (err) {
                console.log(err);
            });
        }
    };

    return {
        init: function (params) {
            if (params.dataController != undefined) {
                dataHelpers = params.dataController;
            } else {
                console.log("No Data Persister");
            }
        },

        setCurrUserData: function (userData) {
            currUserData = userData;
        },

        getCurrUserData: function () {
            return currUserData;
        },

        userViewModel: function () {
            return new UserViewModel();
        },

        chatViewModel: function () {
            return new ChatViewModel();
        }
    }
})();