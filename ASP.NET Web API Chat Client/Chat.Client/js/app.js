/// <reference path="referencies.js" />
var WebChat = WebChat || {};

$(document).ready(function () {
    var container = $("#chat-wrapper");

    var baseUrl = "http://chatroom-2.apphb.com/api/";
    var dataHelpers = WebChat.DataPersisters;
    dataHelpers.init({ apiUrl: baseUrl });

    var viewModels = WebChat.ViewModels;
    viewModels.init({ dataController: dataHelpers });

    // If logged user - load chat client, else load login
    var isLoggedUser = dataHelpers.checkLoggedUser();
    var userVM = viewModels.userViewModel();
    var interval = "";

    if (!isLoggedUser) {
        loadLoginClient()
    } else {
        loadChatClient();
    }
    
    function loadLoginClient() {
        var loginView = WebChat.Views.loginView(function (view) {
            var loginContainer = $('<div id="loginContainer"></div>');

            loginContainer.html(view);

            var registerView = WebChat.Views.registerView(function (view) {
                loginContainer.append($(view));
                container.html(loginContainer);

                ko.applyBindings(userVM, $("#loginContainer").get(0));

                $("#btn-login").click(function () {
                    $("#btn-login").button("loading");
                });

                $("#btn-register").click(function () {
                    $("#registerDialog").removeClass("hide");
                    $("#registerDialog").addClass("show");
                });

                $("#btn-cancel-register").click(function () {
                    $("#registerDialog").removeClass("show");
                    $("#registerDialog").addClass("hide");
                });
            });
        });
    }

    function loadChatClient() {
        var chatView = WebChat.Views.chatLayout(function (view) {
            container.html(view);
            $("#newChatRoomForm").hide();
            $("#btn-login").button("reset");

            var currUserData = {};
            var chatVM = viewModels.chatViewModel();
            
            chatVM.currentUserName(dataHelpers.users().getCurrentUserData(function (userData) {
                currUserData = userData;
                viewModels.setCurrUserData(userData);

                chatVM.currentUserName(currUserData.Username);
                userVM.loggedUsername(currUserData.Username);
                
                chatVM.getRoomData();

                ko.applyBindings(chatVM, $("#chat-panel").get(0));
                ko.applyBindings(userVM, $("#head-bar").get(0));

                interval = setInterval(function () {
                    chatVM.getRoomData();
                    chatVM.getCurrRoomMessages();
                }, 5000);
            }, function (err) {
                console.log(err)
            }));

            $("#newchatRoom").click(function () {
                $("#newChatRoomForm").show();
            });
        });
    }

    // Events:
    $(document).on("logged", function (ev) {
        userVM.err(false);
        userVM.errMessage("");

        loadChatClient();
    });

    $(document).on("loggedout", function (ev) {
        clearInterval(interval);
        loadLoginClient();
    });

    $(document).on("error", function (ev) {
        $("#btn-login").button("reset");
    });
});