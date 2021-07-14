
//var common_url = "http://localhost:49180/"
var common_url = https://ctcluat.investmentz.com/
//var gblurl = "http://localhost:1610/api/";
var gblurl = "https://ctcl.investmentz.com/iCtclService/api/";
var gblnUserId;
var clearClntDetails, saveClntDetails, getClntDetails;
var gblnUserId = localStorage.getItem("CCID");
var gblCTCLid = localStorage.getItem("CTCLId");
var gblCTCLtype = localStorage.getItem("EmpCTCLtype");


$(document).ready(function () {
    var NameCode = localStorage.getItem("NameCode");
    $("#BANameCode").html(NameCode);

    $("#NameCodeData").html(NameCode);
    $("#NameCodeData1").html(NameCode);
    $("#NameCodeData2").html(NameCode);

    clearClntDetails = function () {
        setGlobalVariable("AvailEmpClnts", "");

        setEmpDetails("", "");

    };

    saveClntDetails = function (clntInfo) {
        setGlobalVariable("AvailEmpClnts", JSON.stringify(clntInfo));
    };

    getClntDetails(function (data) {
        initAutoComplete(data.EmpBAClientMaster);
    });



    GetBcastUrl(6);
    //getCTCLID();
});


window.formatDate = function (inputDate, inputDateFormat, outPutFormat) {
    if (inputDate == "" && inputDateFormat.val() == "")
        return "";
    else {
        if (inputDate == "NOW")
            return moment().format(outPutFormat);
        else {
            if (inputDateFormat == "") {
                return moment(inputDate).format(outPutFormat);
            }
            else {
                return moment(inputDate, inputDateFormat).format(outPutFormat);
            }
        }
    }
}

//function getCCID() {

//    gblnUserId = getGlobalVariable("CCID", "ACM4859");
//    gblnChartToken = getGlobalVariable("CHARTTOKEN", "");
//}

//function setEmpDetails(ctclid, emptype) {
//    //return getGlobalVariable("CCID", "");
//    setGlobalVariable("EmpCTCLid", ctclid);
//    setGlobalVariable("EmpCTCLtype", emptype);
//}

//function getCTCLID() {
//    gblCTCLid = getEmpDetails("EmpCTCLid", "");
//    gblCTCLtype = getEmpDetails("EmpCTCLtype", "");
//}

//function getEmpDetails(variableName, defaultValue) {
//    if (window.localStorage.getItem(variableName) == undefined || window.localStorage.getItem(variableName) == null) {
//        setGlobalVariable(variableName, defaultValue);
//        return defaultValue;
//    }
//    else
//        return window.localStorage.getItem(variableName);
//}


getClntDetails = function (cbClntDetailsFetched) {
    var option = 3;

    if (gblCTCLtype.toString().toLocaleLowerCase() == "ba") {
        option = 1;
    } else if (gblCTCLtype.toString().toLocaleLowerCase() == "emp") {
        option = 3;
    }

    var data1 = getGlobalVariable("AvailEmpClnts", "");
    if (data1 != "" && cbClntDetailsFetched != null) {
        var decompData = LZString.decompress(data1);
        cbClntDetailsFetched(JSON.parse(decompData));
    }
    else {
        //getCCID();
        var empBaCode = gblnUserId;
        var GetClients = $.ajax(
            {
                url: "https://trade.investmentz.com/" + "InvestmentzAPI/api/EmpBaClients/",
                method: "get",
                data: {
                    EmpBACode: empBaCode,
                    Option: option
                },
                dataType: "json"
            });

        GetClients.done(function (msg) {
            setGlobalVariable("AvailEmpClnts", LZString.compress(JSON.stringify(msg)));
            if (cbClntDetailsFetched != null)
                cbClntDetailsFetched(msg);
        });
        GetClients.fail(function (jqXHR, textStatus) {
            alert("Failed to collect to employee details");
        });
    }
}

//$("#txtSelectedClient").on("change keyup paste", clearStorage);

$(document).on("change keyup paste", "#txtSelectedClient", function (event) {
    clearStorage();
});

function clearStorage() {
    if ($("#txtSelectedClient").val() == "") {
        $("#cmbClients").val("All").trigger("change");
    }
}


$(document).on("change", "#cmbClients", function (event) {
    $('#hfldUser').val($("#cmbClients").val());

    setGlobalVariable("BaClientcode", $("#cmbClients").val());
    setGlobalVariable("selectedBaText", $("#txtSelectedClient").val());

    if (gblCTCLtype.toString().toLocaleLowerCase() == "emp" || gblCTCLtype.toString().toLocaleLowerCase() == "ba") {
        $("#cmbClients").val(getGlobalVariable("BaClientcode", ""));

        getClntInfo(function (data) {
            hfldBOIYN = "false";
            for (i = 0; i < data.ClientInfo.length; i++) {
                if (data.ClientInfo[i].Segment.toUpperCase() == "CASH") {
                    $("#hfldBOIYN").val(data.ClientInfo[i].BOIFlag);

                    if ($("#hfldBOIYN").val() == "Y") {
                        //$("#txtSelectedClient1").css('color', 'Blue');
                        //$("#txtSelectedClient1").css('font-weight', 'bold');
                        $("#txtSelectedClient").css('color', 'Blue');
                        $("#txtSelectedClient").css('font-weight', 'bold');
                    }
                    else {
                        //$("#txtSelectedClient1").css('color', 'Black');
                        //$("#txtSelectedClient1").css('font-weight', 'normal');
                        $("#txtSelectedClient").css('color', 'Black');
                        $("#txtSelectedClient").css('font-weight', 'normal');
                    }
                    GetBoiLienSetting();
                    break;
                }
            }
        }, $("#cmbClients").val());

    }
    else {
        getClntInfo(function (data) {
            hfldBOIYN = "false";
            for (i = 0; i < data.ClientInfo.length; i++) {
                if (data.ClientInfo[i].Segment.toUpperCase() == "CASH") {
                    $("#hfldBOIYN").val(data.ClientInfo[i].BOIFlag);
                    if ($("#hfldBOIYN").val() == "Y") {
                        //$("#txtSelectedClient1").css('color', 'Blue');
                        //$("#txtSelectedClient1").css('font-weight', 'bold');
                        $("#txtSelectedClient").css('color', 'Blue');
                        $("#txtSelectedClient").css('font-weight', 'bold');

                    }
                    else {
                        //$("#txtSelectedClient1").css('color', 'Black');
                        //$("#txtSelectedClient1").css('font-weight', 'normal');
                        $("#txtSelectedClient").css('color', 'Black');
                        $("#txtSelectedClient").css('font-weight', 'normal');
                    }
                    GetBoiLienSetting();
                    break;
                }
            }
        }, gblnUserId);
    }

});

clearClntInfo = function () {
    setGlobalVariable("AvailClnts", "");
};


saveClntInfo = function (clntInfo) {
    setGlobalVariable("AvailClnts", JSON.stringify(clntInfo));
};

getClntInfo = function (cbClntInfoFetched, ctclselectedclient) {
    clearClntInfo();
    var data = getGlobalVariable("AvailClnts", "");
    if (data != "" && cbClntInfoFetched != null) {
        cbClntInfoFetched(JSON.parse(JSON.parse(data)));
    }
    else {
        var empCode = ctclselectedclient;//gblnUserId;
        var GetClients = $.ajax(
            {
                url: gblurl + "URLSecure/",
                method: "get",
                data: {
                    UCC: empCode
                },
                dataType: "json"
            });

        GetClients.done(function (msg) {
            saveClntInfo(JSON.stringify(msg));
            if (cbClntInfoFetched != null)
                cbClntInfoFetched(msg);
        });
        GetClients.fail(function (jqXHR, textStatus) {
            if (jqXHR.readyState != 0) {
                alert("Failed to collect to Client Info jqXHR = " + JSON.stringify(jqXHR) + "\n textStatus= " + JSON.stringify(textStatus));
            }
        });
    }
}

function initAutoComplete(datasource) {

    $('#txtSelectedClient').autocomplete({
        lookup: datasource,
        minChars: 3,
        maxHeight: 150,
        formatResult: function (dataElement, b) {
            var c = "(" + b.replace(RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\)", "g"), "\\$1") + ")";
            return dataElement["CommonClientCode"].replace(RegExp(c, "gi"), "<strong>$1</strong>") + " - " + dataElement["ClientName"].replace(RegExp(c, "gi"), "<strong>$1</strong>")
        },
        lookupFilter: function (dataElement, b, searchText) {

            if ($("#clntSearchType").val() == "C")
                return dataElement["CommonClientCode"].toLowerCase().substring(0, searchText.length) === searchText.toLowerCase()
            else
                return dataElement["ClientName"].toLowerCase().substring(0, searchText.length) === searchText.toLowerCase()

        },
        onSelect: function (suggestion) {
            var dispText = suggestion["CommonClientCode"] + " - " + suggestion["ClientName"];
            $("#cmbClients").val(suggestion["CommonClientCode"]).trigger("change");
            setGlobalVariable("selectedBaText", dispText);
            $(this).val(dispText);
            //$('#txtSelectedClient1').val(dispText);
            $('#txtSelectedClient').val(dispText);
            $("#cmbclients1").val(dispText);
            $("#cmbclients2").val(dispText);
            $("#clientprofile").html(dispText);
        }
    });
    if (datasource.length > 0) {
        $("#iLoader").css("display", "none");
        $("#imgIcon").css("display", "block");
        $('#txtSelectedClient').removeAttr("disabled");
        $("#clntSearchType").removeAttr("disabled");
    }
}

function getgblBCastUrl() {
    return getGlobalVariable("BroadcastUrl", "");
}

function getGlobalVariable(variableName, defaultValue) {
    if (window.localStorage.getItem(variableName) == undefined || window.localStorage.getItem(variableName) == null) {
        setGlobalVariable(variableName, defaultValue);
        return defaultValue;
    }
    else
        return window.localStorage.getItem(variableName);
}

function setGlobalVariable(variableName, value) {
    window.localStorage.setItem(variableName, value);
}

function savegblBCastUrl(ibturl) {
    setGlobalVariable("BroadcastUrl", ibturl);
}

function cleardefualtwatchlist() {
    setGlobalVariable("DefWatchList", "");
}

function savedefualtwatchlist(watchListId) {
    setGlobalVariable("DefWatchList", watchListId);
}

function getDefaWatchList() {
    return getGlobalVariable("DefWatchList", "");
}

function cleargblBCastUrl() {
    setGlobalVariable("BroadcastUrl", "");
}

function GetBcastUrl(nAction) {
    var GetUrl = $.ajax(
        {
            url: gblurl + "AccoutingV1/",
            method: "get",
            async: false,
            data: {
                nAction: nAction,
                sUserId: "",
                nPageIndex: 1,
                AccountSegment: 0,
                nExchange: 1
            },
            dataType: "json"
        });

    GetUrl.done(function (msg) {

        if (msg.ResultStatus == 3) {
            if (msg.Result.nLoginStatus == 1) {
                $("#Exchange").attr("src", "../img/dis-2.png");
                $("#Exchang1").attr("src", "../img/dis-2.png");

                if (msg.Result.sAmoMsg.toString().trim() != "") {
                    alert("This Order will be treated as AMO order, Order Will be Processed on next trading Day.");
                }
                savegblBCastUrl(msg.Result.sCtclBroadcastUrl.toString().trim());
            }
            else {
                $("#Exchange").attr("src", "../img/dis-1.png");
                $("#Exchang1").attr("src", "../img/dis-1.png");
                $("#amo").html("");
            }
        } else {
            $("#Exchange").attr("src", "../img/dis-1.png");
            $("#Exchang1").attr("src", "../img/dis-1.png");
            $("#amo").html("");
        }
    });

    GetUrl.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus + ' GetOStatus');
    });
}