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

    if (!isLoggedUser) {
        var userVM = viewModels.userViewModel();

        var loginView = WebChat.Views.loginView(function (view) {
            container.html(view);
            ko.applyBindings(userVM, null);

            $("#btn-login").click(function () {
                $("#btn-login").button("loading");
            });
        });
    } else {
        loadChatClient();
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
                chatVM.getRoomData();

                ko.applyBindings(chatVM, $("#chat-panel").get(0));

                var interval = setInterval(function () {
                    chatVM.getRoomData();
                }, 1000);
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
        loadChatClient();
    });

    $(document).on("error", function (ev) {
        $("#btn-login").button("reset");
    });
});