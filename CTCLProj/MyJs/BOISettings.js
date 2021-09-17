$(document).ready(function () {

});

function GetBoiLienSetting() {

    var timer = setInterval(myFunction, 1000);
    function myFunction() {
        if ($("#txtSelectedClient").val() == "" || $("#txtSelectedClient").val() == undefined) {

        } else {
            clearInterval(timer);
            BOISettingState();
        }
        
    }
}



function BOISettingState()
{
    if ($("#hfldBOIYN").val() != "Y") {
        $("#BOIDiv").attr("hidden", true);
        //$("#lienOff").prop("checked", true);
        //$("#lienOn").prop("checked", false);
    } else {
        $("#BOIDiv").attr("hidden", false);
        //$("#lienOff").prop("checked", false);
        //$("#lienOn").prop("checked", true);
        $.ajax({
            url: gblurl + "BOIAccountV1/",
            method: "get",
            async: false,
            data: {
                CommonClientCode: $("#txtSelectedClient").val().split('-')[0].trim(),
                nActionId: 2
            },
            dataType: "json",
            success: (function (msg) {
                if (msg.ResultStatus == 3) {
                    if (msg.Result == true) {
                        $("#lienOff").prop("checked", false);
                        $("#lienOn").prop("checked", true);
                    }
                    else {
                        $("#lienOff").prop("checked", true);
                        $("#lienOn").prop("checked", false);
                    }
                }
                else {
                    $("#lienOff").prop("checked", true);
                    $("#lienOn").prop("checked", false);
                }
            }),
            error: (function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus + ' GetBoiLienSetting');
            })
        });
    }
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
