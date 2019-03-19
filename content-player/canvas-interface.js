if (!window.genieservice) {
    getCurrentUser = function () {
        return window.parent.handleAction('getCurrentUser');
    }

    getAllUserProfile = function (profileRequest) {
        return window.parent.handleAction('getAllUserProfile', [profileRequest]);
    }

    setUser = function (userId) {
        return window.parent.handleAction('setUser', [userId]);
    }

    getContent = function (contentId) {
        return window.parent.handleAction('getContent', [contentId]);
    }

    getRelatedContent = function () {
        return window.parent.handleAction('getRelatedContent');
    }

    getContentList = function (filter) {
        return window.parent.handleAction('getContentList', [filter]);
    }

    sendFeedback = function (args) {
        return window.parent.handleAction('sendFeedback', [args]);
    }

    languageSearch = function (filter) {
        return window.parent.handleAction('languageSearch', [filter]);
    }

    endGenieCanvas = function () {
        return window.parent.handleAction('endGenieCanvas');
    }

    endContent = function () {
        return window.parent.handleAction('endContent');
    }

    launchContent = function () {
        return window.parent.handleAction('launchContent');
    }

    send = function (object, apiName) {
        return window.parent.handleAction.send(object);
    }
    window.genieservice = (function () {
        return {
            getCurrentUser,
            getAllUserProfile,
            setUser,
            getContent,
            getRelatedContent,
            getContentList,
            sendFeedback,
            endGenieCanvas,
            endContent,
            launchContent
        }
    })();

    window.telemetry = (function () { return { send } });
    console.log("GenieService Loaded");
}