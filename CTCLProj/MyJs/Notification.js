
var fcmPubKey = 'BDTM2QWDxgDfPHDTHKYHS7WZC2pVsxRimAy-XD4rhlehHKrxenY5bUCQpTV3wHn4plmmIxV9jYoDyvdjaZQn4WY';
$(document).ready(function () {

    const messaging = firebase.messaging();
    messaging.usePublicVapidKey(fcmPubKey);

    messaging.onTokenRefresh(() => {
        messaging.getToken().then((refreshedToken) => {
        }).catch((err) => {
            console.log('Unable to retrieve refreshed token ', err);
            showToken('Unable to retrieve refreshed token ', err);
        });
    });

    messaging.onMessage((payload) => {
        $.notify({
            newest_on_top: true,
            title: "<strong>" + payload.notification.title + "</strong> " + '<br />',
            message: "  " + payload.notification.body.replace("to buy", "to <b>buy</b>").replace("to sell", "to <b>sell</b>"),
            url: "https://trade.investmentz.com/Web/WebForms/Alerts.aspx",
            target: "_self"
        }, {
            type: getCssClass(payload),
            placement: {
                from: "bottom",
                align: "right"
            },
        });

    });

    function getCssClass(payload) {
        if (payload.data.NotificationType == 1 && (payload.notification.body.indexOf("to SELL") >= 0))
            return "red";
        else if (payload.data.NotificationType == 1 && (payload.notification.body.indexOf("to BUY") >= 0))
            return "info";
        else if (payload.data.NotificationType == 2 && (payload.notification.body.indexOf("to SELL") >= 0))
            return "red";
        else if (payload.data.NotificationType == 2 && (payload.notification.body.indexOf("to BUY") >= 0))
            return "info";
        else if (payload.data.NotificationType == 3 || payload.data.NotificationType == 4)
            return "bluegray";
        else if (payload.data.NotificationType == 6)
            return "warning";
        else if (payload.data.NotificationType == 7)
            return "success";
        else if (payload.data.NotificationType == 8)
            return "lightred";
        else if (payload.data.NotificationType == 9)
            return "lightpink";
        else
            return "success";
    }
});
var firebaseConfig = {
    apiKey: "AIzaSyA5RKpJkXyjLy095J4A9XDPopAwDWRtlP4",
    authDomain: "investmentz-41e35.firebaseapp.com",
    databaseURL: "https://investmentz-41e35.firebaseio.com",
    projectId: "investmentz-41e35",
    storageBucket: "",
    messagingSenderId: "446159099029",
    appId: "1:446159099029:web:2db2613c86f6d353"
};


firebase.initializeApp(firebaseConfig);
