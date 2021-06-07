$(document).ready(function () {

});

function GetBoiLienSetting() {
    if ($("#hfldBOIYN").val() == "Y") {
        document.getElementById("fgft").style.visibility = "visible";
        $("#FL").prop("disabled", false); $("#FL").prop("checked", true);
        return;
    }
    $("#FL").prop("disabled", true); $("#FL").prop("checked", false);
    $.ajax(
       {
           url: gblurl + "BOIAccountV1/",
           method: "get",
           async: false,
           data: {
               CommonClientCode: "869397",//gblnUserId
               nActionId: 2
           },
           dataType: "json"
       });
    success: (function (msg) {
        if (msg.ResultStatus == 3) {
            if (msg.Result == true) {
                $("#FL").prop("disabled", false); $("#FL").prop("checked", true);
            }
            else {
                $("#FL").prop("disabled", true); $("#FL").prop("checked", false);
            }
        }
        else {
            $("#FL").prop("disabled", true); $("#FL").prop("checked", false);
        }
    });
    error: (function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus + ' GetBoiLienSetting');
    });
}

function UpdateBoiSetting(smode) {

    var SettingsParams = JSON.stringify({
        'UCC': $("#cmbClients").val(),//gblnUserId,//
        'AutoModeOn': smode,
    });

    $.ajax({
        url: gblurl + "BOIAccountV1/",
        type: 'PUT',
        contentType: 'application/json',
        data: SettingsParams,
        dataType: "json",
        complete: function (data, status, xhr) {

            if (JSON.parse(data.responseText).ResultStatus == 3) {
                return;
            }
        },
        error: function () {
            alert('Error while Saving Settings');
        },
    });



}