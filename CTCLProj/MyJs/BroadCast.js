var ws;
var wsD;
var wsManaged;
var gblBCastUrl;
var tokens;
var tokensH;
var blnBroadCastFlag = false;
var rateread = false;

var heartBeatSeqNo = 1;
var heartBeatPeriod = 3;
var heartBeatFromServerTimer = -1;
var heartBeatPeriodServer = 2;
var lastServerHBSeqNo = 1;
var subscribedKeys = [];
var subscribedKeys2 = [];
var exchangeMsgsSubs = false;

$(document).ready(function () {
    tokens = [];
    tokensH = [];
    gblBCastUrl = getgblBCastUrl();

});

function CloseSocket() {
    blnBroadCastFlag = false;
    ws.close();
    return false;
}

function sendTokens(lblScript) {

    //var TokensValues = $('#lblScripts').html() + "," + $('#lblHoldingScripts').html() + "," + $('#lblScripts2').html() + "," + $('#lblScripts3').html() + "," + $('#lblScripts4').html() + "," + $('#lblScriptsObook').html() + "," + "17.999908,17.999988,5.1"
    var TokensValues = $('#lblScripts').html();
    //console.log("tokens.length" + tokens.length);
    if (tokens.length > 0) {
        setTimeout(function () {
            SendJson = { SeqNo: 1, Action: "sub.add.topics", RType: "O1", Topic: "", Body: TokensValues };
            ws.send(JSON.stringify(SendJson));
        }, 100);
    }
    else {
        setTimeout(sendTokens(lblScript), 100);
    }
}

function reconnectSocketAndSendTokensNP(lblScript) {

    var scriplblName = lblScript;
    var TokensValues = $('#lblScripts2').html();

    //var TokensValues = $('#lblScripts2').html() + "," + "17.999908,17.999988,5.1"
    if (ws == null || ws == undefined || ws.readyState != WebSocket.OPEN || ws.readyState != WebSocket.CONNECTING) {
        ws = new WebSocket(gblBCastUrl);
        blnBroadCastFlag = true;
        ws.onopen = function () {
            setTimeout(function () {
                SendJson = { SeqNo: 1, Action: "sub.add.topics", RType: "O1", Topic: "", Body: TokensValues };
                ws.send(JSON.stringify(SendJson));
            }, 100);
            //sendTokens(scriplblName);
        };
        ws.onmessage = function (evt) {
            ProcessData(evt.data, lblScript);
            $("#Broadcast1").attr("src", "../img/dis-2.png");
        };
        ws.onerror = function (evt) {
            $("#Broadcast1").attr("src", "../img/dis-1.png");
        };
        ws.onclose = function () {

        };
    }
    else {
        sendTokens(scriplblName);
    }
    return false;
}


function reconnectSocketAndSendTokens(lblScript) {

    var scriplblName = lblScript;
    var TokensValues = $('#lblScripts').html() + "," + $('#lblHoldingScripts').html() + "," + $('#lblScripts3').html() + "," + $('#lblScripts4').html() + "," + $('#lblScriptsObook').html() + "," + "17.999908,17.999988,5.1"

    //var TokensValues = $('#lblScripts2').html() + "," + "17.999908,17.999988,5.1"
    if (ws == null || ws == undefined || ws.readyState != WebSocket.OPEN || ws.readyState != WebSocket.CONNECTING) {
        ws = new WebSocket(gblBCastUrl);
        blnBroadCastFlag = true;
        ws.onopen = function () {
            setTimeout(function () {
                SendJson = { SeqNo: 1, Action: "sub.add.topics", RType: "O1", Topic: "", Body: TokensValues };
                ws.send(JSON.stringify(SendJson));
            }, 100);
            //sendTokens(scriplblName);
        };
        ws.onmessage = function (evt) {
            ProcessData(evt.data, lblScript);
            $("#Broadcast1").attr("src", "../img/dis-2.png");
        };
        ws.onerror = function (evt) {
            $("#Broadcast1").attr("src", "../img/dis-1.png");
        };
        ws.onclose = function () {

        };
    }
    else {
        sendTokens(scriplblName);
    }
    return false;
}

function ProcessData(bcastData, lblScript) {
    var Data = JSON.parse(JSON.parse(bcastData).Body);

    var SymbolId = '';

    if (Data.SymbolKey == undefined) {
        return;
    }
    SymbolId = Data.SymbolKey.replace(".", "_").toUpperCase();
    //console.log("SymbolId:" + SymbolId);
    var atp;

    //if (scriplblName == "lblHoldingScripts") {
    //    if ($("." + SymbolId + "_LRH").length == 0) {

    //    } else {
    //        $("." + SymbolId + "_LRH").text(Data.Last / ((startsWith(Data.SymbolKey, '12.') || startsWith(Data.SymbolKey, '13.')) == false ? 100 : 10000));

    //        if (startsWith(Data.SymbolKey, '12.') == true || startsWith(Data.SymbolKey, '13.') == true) {
    //            $("." + SymbolId + "_LRH").text(parseFloat($("." + SymbolId + "_LRH").text()).toFixed(4));
    //        } else {
    //            $("." + SymbolId + "_LRH").text(parseFloat($("." + SymbolId + "_LRH").text()).toFixed(2));
    //        }
    //    }
    //} else if (scriplblName == "lblScripts") {
    
        var nPerChange = 0;
        var nDifference = 0;
    
        $("." + SymbolId + "_LR").html(Data.Last / ((startsWith(Data.SymbolKey, '12.') || startsWith(Data.SymbolKey, '13.')) == false ? 100 : 10000));
        $("." + SymbolId + "_LRH").text(Data.Last / ((startsWith(Data.SymbolKey, '12.') || startsWith(Data.SymbolKey, '13.')) == false ? 100 : 10000));
        $("." + SymbolId + "_LTP").text(Data.Last / ((startsWith(Data.SymbolKey, '12.') || startsWith(Data.SymbolKey, '13.')) == false ? 100 : 10000));

        $("." + SymbolId + "_H").text(Data.High / ((startsWith(Data.SymbolKey, '12.') || startsWith(Data.SymbolKey, '13.')) == false ? 100 : 10000));
        $("." + SymbolId + "_L").text(Data.Low / ((startsWith(Data.SymbolKey, '12.') || startsWith(Data.SymbolKey, '13.')) == false ? 100 : 10000));
        $("." + SymbolId + "_O").text(Data.Open / ((startsWith(Data.SymbolKey, '12.') || startsWith(Data.SymbolKey, '13.')) == false ? 100 : 10000));
        $("." + SymbolId + "_PC").text(Data.PClose / ((startsWith(Data.SymbolKey, '12.') || startsWith(Data.SymbolKey, '13.')) == false ? 100 : 10000));
        $("." + SymbolId + "_LP").text(Data.Last / ((startsWith(Data.SymbolKey, '12.') || startsWith(Data.SymbolKey, '13.')) == false ? 100 : 10000));
        $("." + SymbolId + "_LQ").text(Data.LastQty);
        $("." + SymbolId + "_TQ").text(Data.TotalQty);
        $("." + SymbolId + "_TV").text(Data.TotalValue / ((startsWith(Data.SymbolKey, '12.') || startsWith(Data.SymbolKey, '13.')) == false ? 100 : 10000));
        $("." + SymbolId + "_OI").text(Data.OpenInt);

        $("." + SymbolId + "_BQ").text(Data.Buy1Qty);
        $("." + SymbolId + "_BR").text(Data.Buy1Rate / ((startsWith(Data.SymbolKey, '12.') || startsWith(Data.SymbolKey, '13.')) == false ? 100 : 10000));
        $("." + SymbolId + "_SR").text(Data.Sell1Rate / ((startsWith(Data.SymbolKey, '12.') || startsWith(Data.SymbolKey, '13.')) == false ? 100 : 10000));
        $("." + SymbolId + "_SQ").text(Data.Sell1Qty);


        if (Data.TotalValue == 0) {
            atp = 0;
        } else {
            if (startsWith(Data.SymbolKey, '5.') == false) { //bse false
                if (startsWith(Data.SymbolKey, '12.') == true || startsWith(Data.SymbolKey, '13.') == true) {
                    atp = (parseFloat(Data.TotalValue) / 1000) / parseFloat(Data.TotalQty);
                }
                else {
                    atp = (parseFloat(Data.TotalValue)) / parseFloat(Data.TotalQty);
                }
            }
            else {
                atp = (parseFloat(Data.TotalValue)) / parseFloat(Data.TotalQty);
            }
        }

        $("." + SymbolId + "_ATP").text(atp);

        if (startsWith(Data.SymbolKey, '12.') == true || startsWith(Data.SymbolKey, '13.') == true) {
            $("." + SymbolId + "_LR").text(parseFloat($("." + SymbolId + "_LR").html()).toFixed(4));
            $("." + SymbolId + "_LRH").text(parseFloat($("." + SymbolId + "_LRH").text()).toFixed(4));
            $("." + SymbolId + "_H").text(parseFloat($("." + SymbolId + "_H").text()).toFixed(4));
            $("." + SymbolId + "_L").text(parseFloat($("." + SymbolId + "_L").text()).toFixed(4));
            $("." + SymbolId + "_O").text(parseFloat($("." + SymbolId + "_O").text()).toFixed(4));
            $("." + SymbolId + "_PC").text(parseFloat($("." + SymbolId + "_PC").text()).toFixed(4));
            $("." + SymbolId + "_LP").text(parseFloat($("." + SymbolId + "_LP").text()).toFixed(4));
            $("." + SymbolId + "_TV").text(parseFloat($("." + SymbolId + "_TV").text()).toFixed(4));
            $("." + SymbolId + "_OI").text(parseFloat($("." + SymbolId + "_OI").text()).toFixed(4));
            $("." + SymbolId + "_BR").text(parseFloat($("." + SymbolId + "_BR").text()).toFixed(4));
            $("." + SymbolId + "_SR").text(parseFloat($("." + SymbolId + "_SR").text()).toFixed(4));
            $("." + SymbolId + "_ATP").text(parseFloat($("." + SymbolId + "_ATP").text()).toFixed(4));

           // $("." + SymbolId + "_CV").text(parseFloat($("." + SymbolId + "_LR").text() * qty).toFixed(4));
        }
        else {
            $("." + SymbolId + "_LR").text(parseFloat($("." + SymbolId + "_LR").html()).toFixed(2));
            $("." + SymbolId + "_LRH").text(parseFloat($("." + SymbolId + "_LRH").text()).toFixed(2));
            $("." + SymbolId + "_H").text(parseFloat($("." + SymbolId + "_H").text()).toFixed(2));
            $("." + SymbolId + "_L").text(parseFloat($("." + SymbolId + "_L").text()).toFixed(2));
            $("." + SymbolId + "_O").text(parseFloat($("." + SymbolId + "_O").text()).toFixed(2));
            $("." + SymbolId + "_PC").text(parseFloat($("." + SymbolId + "_PC").text()).toFixed(2));
            $("." + SymbolId + "_LP").text(parseFloat($("." + SymbolId + "_LP").text()).toFixed(2));
            $("." + SymbolId + "_TV").text(parseFloat($("." + SymbolId + "_TV").text()).toFixed(2));
            $("." + SymbolId + "_OI").text(parseFloat($("." + SymbolId + "_OI").text()).toFixed(2));
            $("." + SymbolId + "_BR").text(parseFloat($("." + SymbolId + "_BR").text()).toFixed(2));
            $("." + SymbolId + "_SR").text(parseFloat($("." + SymbolId + "_SR").text()).toFixed(2));
            $("." + SymbolId + "_ATP").text(parseFloat($("." + SymbolId + "_ATP").text()).toFixed(2));

           // alert($("." + SymbolId + "_LR").text()) 
         //   $("." + SymbolId + "_CV").text(parseFloat($("." + SymbolId + "_LR").text() * qty).toFixed(2));
        }

        $("." + SymbolId + "_LUD").text(formatDate(Data.LastTradeTime, '', "DD/MM/YYYY"));
        $("." + SymbolId + "_LUDT").text(formatDate(Data.LastTradeTime, '', "HH:mm:ss"));

        nDifference = parseFloat($("." + SymbolId + "_LR").text()) - parseFloat($("." + SymbolId + "_PC").text());
        nPerChange = (parseFloat($("." + SymbolId + "_LR").text()) * 100 / parseFloat($("." + SymbolId + "_PC").text())) - 100;

        if (nDifference >= 0) {
            if ($("#Iratechange").attr('data-symbol') == SymbolId) {
                $("#lblChange").html('(' + nPerChange.toFixed(2) + '%)');
            }

            if (startsWith(Data.SymbolKey, '12.') == true || startsWith(Data.SymbolKey, '13.') == true) {
                $("." + SymbolId + "_RateChange").html(nDifference.toFixed(4));
                $("." + SymbolId + "_RateChangePc").html('(' + nPerChange.toFixed(4) + '%)');

                $("." + SymbolId + "_RateChange").html(nDifference.toFixed(4));
                $("." + SymbolId + "_RateChangePc").html('(' + nPerChange.toFixed(4) + '%)');

                $("." + SymbolId + "_RateChangePc").css("color", "#01fb01");
                $("." + SymbolId + "_RateChange").css("color", "#01fb01");
            } else {
                $("." + SymbolId + "_RateChange").html(nDifference.toFixed(2));
                $("." + SymbolId + "_RateChangePc").html('(' + nPerChange.toFixed(2) + '%)');

                $("." + SymbolId + "_RateChange").html(nDifference.toFixed(2));
                $("." + SymbolId + "_RateChangePc").html('(' + nPerChange.toFixed(2) + '%)');

                $("." + SymbolId + "_RateChange").css("color", "#01fb01");
                $("." + SymbolId + "_RateChangePc").css("color", "#01fb01");
            }
            if (SymbolId == "17_999908" || SymbolId == "17_999988" || SymbolId == "5_1") {

                $("." + SymbolId + "_nf").css("background-color", "green");
                $("." + SymbolId + "_nf").css("border-color", "green");
                $("." + SymbolId + "_nf1").css("background-color", "green");
                $("." + SymbolId + "_nf1").css("border-color", "green");

                $("." + SymbolId + "_RateChange").css("color", "white");
                $("." + SymbolId + "_RateChangePc").css("color", "white");
                $("." + SymbolId + "_IRateChange").attr("src", "../img/icons/up-arrow.png");
            }
        }
        else if (nDifference < 0) {
            if ($("#Iratechange").attr('data-symbol') == SymbolId) {
                $("#lblChange").html('(' + nPerChange.toFixed(2) + '%)');
            }
            if (startsWith(Data.SymbolKey, '12.') == true || startsWith(Data.SymbolKey, '13.') == true) {
                $("." + SymbolId + "_RateChange").text(nDifference.toFixed(4));
                $("." + SymbolId + "_RateChangePc").text('(' + nPerChange.toFixed(4) + '%)');


                $("." + SymbolId + "_RateChange").val(nDifference.toFixed(4));
                $("." + SymbolId + "_RateChangePc").val('(' + nPerChange.toFixed(4) + '%)');

                $("." + SymbolId + "_RateChangePc").css("color", "red");
                $("." + SymbolId + "_RateChange").css("color", "red");
            } else {
                $("." + SymbolId + "_RateChange").text(nDifference.toFixed(2));
                $("." + SymbolId + "_RateChangePc").text('(' + nPerChange.toFixed(2) + '%)');


                $("." + SymbolId + "_RateChange").val(nDifference.toFixed(2));
                $("." + SymbolId + "_RateChangePc").val('(' + nPerChange.toFixed(2) + '%)');

                //var columnIndex = $("#WatchList").wrapper.find(".k-grid-header [data-field=" + "Change" + "]").index();

                //var cell = row.children().eq(columnIndex);
                //cell.addClass("critical");

                $("." + SymbolId + "_RateChangePc").css("color", "red");
                $("." + SymbolId + "_RateChange").css("color", "red");
            }
            if (SymbolId == "17_999908" || SymbolId == "17_999988" || SymbolId == "5_1") {

                $("." + SymbolId + "_nf").css("background-color", "red");
                $("." + SymbolId + "_nf").css("border-color", "red");
                $("." + SymbolId + "_nf1").css("background-color", "red");
                $("." + SymbolId + "_nf1").css("border-color", "red");

                $("." + SymbolId + "_RateChangePc").css("color", "white");
                $("." + SymbolId + "_RateChange").css("color", "white");
                $("." + SymbolId + "_IRateChange").attr("src", "../img/icons/down-arrow.png");
            }
        }

        if (lblScript == "lblScripts2") {
            var MtoM = 0;
            var NetVal = parseFloat($("." + SymbolId + "_tdNV").html());

            if (parseFloat($("." + SymbolId + "_tdNQ").html()) == 0) {
                MtoM = NetVal;
            }
            else if (parseFloat($("." + SymbolId + "_tdNQ").html()) > 0) {
                MtoM = parseFloat($("." + SymbolId + "_tdNQ").html()) * (parseFloat($("." + SymbolId + "_LR").html()) - parseFloat($("." + SymbolId + "_tdnavg").html()));
            }
            else {
                MtoM = parseFloat($("." + SymbolId + "_tdNQ").html()) * (parseFloat($("." + SymbolId + "_tdnavg").html()) - parseFloat($("." + SymbolId + "_LR").html()));
            }
            
            if (MtoM == "" || MtoM == undefined)
            { MtoM = 0; }

            if (startsWith(Data.SymbolKey, '12.') == true || startsWith(Data.SymbolKey, '13.') == true) {
                $("." + SymbolId + "_LR").text(parseFloat($("." + SymbolId + "_LR").text()).toFixed(4));
                if (SymbolId != "17_999908" && SymbolId != "17_999988") {
                    M2mlive(SymbolId, parseFloat(MtoM).toFixed(4));
                }
            } else {                
                $("." + SymbolId + "_LR").html(parseFloat($("." + SymbolId + "_LR").html()).toFixed(2));
                if (SymbolId != "17_999908" && SymbolId != "17_999988") {
                    M2mlive(SymbolId, parseFloat(MtoM).toFixed(2));
                }
            }

            if ($("." + SymbolId + "_LR").text() != "")
            {
                LTP = $("." + SymbolId + "_LR").text();
            }
            else
            {
                LTP = 0;
            }

            var PL = 0;
            var Netavg = 0;
            if (parseFloat($("." + SymbolId + "_tdnavg").text()) < 0) {
                Netavg = parseFloat($("." + SymbolId + "_tdnavg").text()) * -1;
            }
            else { Netavg = parseFloat($("." + SymbolId + "_tdnavg").text()); }
            if (((LTP - Netavg) * parseFloat($("." + SymbolId + "_tdNQ").text())) > 1) {
                $("." + SymbolId + "_data-pl").text(Math.round((parseFloat(LTP) - Netavg) * parseFloat($("." + SymbolId + "_tdNQ").text()), 0));
            }
            else {

                $("." + SymbolId + "_data-pl").text(Math.round((parseFloat(LTP) - Netavg) * parseFloat($("." + SymbolId + "_tdNQ").text()), 2));
            }

            var totpl = 0;


        }
}


function M2mlive(SymbolId, MtoM)
{
    var nrow = 0;
    var $tds;
    var gview = $("#NetPositionGrid").data("kendoGrid");
    var selectedItem = gview.dataSource.options;
    var vsymbolid = "";
    var netqty;
    var sqm2m;
    var Netavg;
    var vltp;
    var MtoMNew = 0;
    var TokenId;

    console.log(selectedItem);
    $.each(selectedItem.data, function (i, row) {
        nrow = nrow + 1;
        //netqty = row.NetQty;
        //sqm2m = row.Netval;
        //Netavg = row.Netavg;
        //vltp = row.LTP;
        TokenId = row.ExchangeBroadcastConstant + "_" + row.Token;
        netqty = $("<div/>").html(row.NetQty).text();
        sqm2m = $("<div/>").html(row.Netval).text();
        Netavg = $("<div/>").html(row.Netavg).text();
        vltp = $("." +TokenId + "_LR").html();

        if (row.MISCNC == "CNC / NORMAL") {
            vsymbolid = SymbolId + "_tdM2MCNC" + '_' + nrow;
        } else {
            vsymbolid = SymbolId + "_tdM2MCNC" + '_' + nrow;
        }
        
        var MtoMNew = 0;

        if (parseFloat(netqty) == 0 || parseFloat(vltp) == 0)
        {
            $("." + vsymbolid).html(sqm2m);
        } else if (parseFloat(netqty) != 0)
        {
            MtoMNew = parseFloat(netqty) * (parseFloat(vltp) - Math.abs(parseFloat(Netavg)));
            $("." + vsymbolid).html(parseFloat(MtoMNew).toFixed(2));
        } else
        {
            MtoMNew = Math.abs(parseFloat(netqty)) * (Math.abs(parseFloat(Netavg)) - vltp);
            $("." + vsymbolid).html(parseFloat(MtoMNew).toFixed(2));
        }

    });

}

function ResetAll(topicName) {
    $("#lblTopBidQty1").html(0);
    $("#lblTopBidQty2").html(0);
    $("#lblTopBidQty3").html(0);
    $("#lblTopBidQty4").html(0);
    $("#lblTopBidQty5").html(0);

    $("#lblTopBidQtyTotal").html(0);

    $("#lblTopAskQty1").html(0);
    $("#lblTopAskQty2").html(0);
    $("#lblTopAskQty3").html(0);
    $("#lblTopAskQty4").html(0);
    $("#lblTopAskQty5").html(0);

    $("#lblTopAskQtyTotal").html(0);

    var isCd = startsWith(topicName, '12.') || startsWith(topicName, '13.');

    $("#lblTopBidRate1").html((0).toFixed(isCd ? 4 : 2));
    $("#lblTopBidRate2").html((0).toFixed(isCd ? 4 : 2));
    $("#lblTopBidRate3").html((0).toFixed(isCd ? 4 : 2));
    $("#lblTopBidRate4").html((0).toFixed(isCd ? 4 : 2));
    $("#lblTopBidRate5").html((0).toFixed(isCd ? 4 : 2));

    $("#lblTopAskRate1").html((0).toFixed(isCd ? 4 : 2));
    $("#lblTopAskRate2").html((0).toFixed(isCd ? 4 : 2));
    $("#lblTopAskRate3").html((0).toFixed(isCd ? 4 : 2));
    $("#lblTopAskRate4").html((0).toFixed(isCd ? 4 : 2));
    $("#lblTopAskRate5").html((0).toFixed(isCd ? 4 : 2));


    isCd ? $("#lblAP").html('0.0000') : $("#lblAP").html('0.00');
    isCd ? $("#lblHigh52").html('N/A') : $("#lblHigh52").html('0.00');
    isCd ? $("#lblLow52").html('N/A') : $("#lblLow52").html('0.00');
    $("#lblLowLim").html((0).toFixed(isCd ? 4 : 2));
    $("#lblUpLim").html((0).toFixed(isCd ? 4 : 2));
}

var ws2;
var lastSubscriptionV2 = "";
function RefreshScriptsLevel2(topicName) {

    ResetAll(topicName);
    var SendJson;

    if (ws2 == null || ws2 == undefined || ws2.readyState != WebSocket.OPEN) {

        ws2 = new WebSocket(gblBCastUrl);

        ws2.onopen = function () {

            lastSubscriptionV2 = topicName;

            setTimeout(function () {
                SendJson = { SeqNo: 1, Action: "sub.add.topics", RType: "O2", Topic: "", Body: topicName };
                ws2.send(JSON.stringify(SendJson));
            }, 100);


        };
        ws2.onmessage = function (evt) {

            ProcessData2(evt.data);
        };
        ws2.onerror = function (evt) {

        };
        ws2.onclose = function () {

        };
        return false;
    }
    else {
        lastSubscriptionV2 = topicName;
        setTimeout(function () {
            SendJson = { SeqNo: 1, Action: "sub.add.topics", RType: "O2", Topic: "", Body: topicName };
            ws2.send(JSON.stringify(SendJson));
        }, 100);
    }
}

function ProcessData2(bcastData) {
    var Data = JSON.parse(JSON.parse(bcastData).Body);
    var Type = JSON.parse(bcastData).RType;
    var Topic = JSON.parse(bcastData).Topic;
    var isCd = startsWith(Topic, '12.') || startsWith(Topic, '13.');

    var SymbolId = '';

    if (Data.SymbolKey == undefined) {
        return;
    }
    SymbolId = Data.SymbolKey.replace(".", "_").toUpperCase();

    if ($("#" + SymbolId + "_LR").length == 0) {
    } else {

        var nPerChange = 0;
        var nDifference = 0;

        nDifference = parseFloat($("#" + SymbolId + "_LR").text()) - parseFloat($("#" + SymbolId + "_PC").text());
        nPerChange = (parseFloat($("#" + SymbolId + "_LR").text()) * 100 / parseFloat($("#" + SymbolId + "_PC").text())) - 100;

        if (nDifference >= 0) {
            if (startsWith(Data.SymbolKey, '12.') == true || startsWith(Data.SymbolKey, '13.') == true) {
                $("#lblChng").html(nDifference.toFixed(4));
                $("#lblPercChange").html('(' + nPerChange.toFixed(4) + '%)');
            } else {
                $("#lblChng").html(nDifference.toFixed(2));
                $("#lblPercChange").html('(' + nPerChange.toFixed(2) + '%)');
            }
            // if ($("#Iratechange").attr('data-symbol') == SymbolId) {
            $("#lblChange").html('(' + nPerChange.toFixed(2) + '%)');
            // }
        } else if (nDifference < 0) {
            if (startsWith(Data.SymbolKey, '12.') == true || startsWith(Data.SymbolKey, '13.') == true) {
                $("#lblChng").html(nDifference.toFixed(4));
                $("#lblPercChange").html('(' + nPerChange.toFixed(4) + '%)');
            } else {
                $("#lblChng").html(nDifference.toFixed(2));
                $("#lblPercChange").html('(' + nPerChange.toFixed(2) + '%)');
            }
            // if ($("#Iratechange").attr('data-symbol') == SymbolId) {
            $("#lblChange").html('(' + nPerChange.toFixed(2) + '%)');
            // }
        }
    }



    if (Type == "O2" && lastSubscriptionV2 == Topic) {


        $("#lblTopBidQty1").html(Data.Buy1Qty);
        $("#lblTopBidQty2").html(Data.Buy2Qty);
        $("#lblTopBidQty3").html(Data.Buy3Qty);
        $("#lblTopBidQty4").html(Data.Buy4Qty);
        $("#lblTopBidQty5").html(Data.Buy5Qty);

        $("#lbltotbid").html("Total Qty");
        var TotalBidQty = Data.TotalBuyQty;
        $("#lblTopBidQtyTotal").html(TotalBidQty);

        $("#lblTopAskQty1").html(Data.Sell1Qty);
        $("#lblTopAskQty2").html(Data.Sell2Qty);
        $("#lblTopAskQty3").html(Data.Sell3Qty);
        $("#lblTopAskQty4").html(Data.Sell4Qty);
        $("#lblTopAskQty5").html(Data.Sell5Qty);

        $("#lbltotAsk").html("Total Qty");
        var TotalAskQty = Data.TotalSellQty;
        $("#lblTopAskQtyTotal").html(TotalAskQty);

        $("#lblTopBidRate1").html((Data.Buy1Rate == undefined ? 0 : Data.Buy1Rate / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));
        $("#lblTopBidRate2").html((Data.Buy2Rate == undefined ? 0 : Data.Buy2Rate / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));
        $("#lblTopBidRate3").html((Data.Buy3Rate == undefined ? 0 : Data.Buy3Rate / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));
        $("#lblTopBidRate4").html((Data.Buy4Rate == undefined ? 0 : Data.Buy4Rate / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));
        $("#lblTopBidRate5").html((Data.Buy5Rate == undefined ? 0 : Data.Buy5Rate / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));

        $("#lblTopAskRate1").html((Data.Sell1Rate == undefined ? 0 : Data.Sell1Rate / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));
        $("#lblTopAskRate2").html((Data.Sell2Rate == undefined ? 0 : Data.Sell2Rate / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));
        $("#lblTopAskRate3").html((Data.Sell3Rate == undefined ? 0 : Data.Sell3Rate / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));
        $("#lblTopAskRate4").html((Data.Sell4Rate == undefined ? 0 : Data.Sell4Rate / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));
        $("#lblTopAskRate5").html((Data.Sell5Rate == undefined ? 0 : Data.Sell5Rate / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));

        $("#lblMAP").html('WIP');
        $("#lblMAP_1").html('WIP');

        $("#lblOpen").html((Data.Open / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));
        $("#lblHigh").html((Data.High / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));
        $("#lblLow").html((Data.Low / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));

        //$("#lblchange").html(0);

        //var LR = Data.Last / ((startsWith(Data.SymbolKey, '12.') || startsWith(Data.SymbolKey, '13.')) == false ? 100 : 10000)
        //var PC = Data.PClose / ((startsWith(Data.SymbolKey, '12.') || startsWith(Data.SymbolKey, '13.')) == false ? 100 : 10000)


        $("#lblLTP").html((Data.Last / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));

        $("#lblClose").html((Data.Last / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));

        //if (rateread == false) {

        //    $("#txtorderprice").val((Data.Last / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2)).trigger('change');
        //    rateread = true;
        //}

        $("#lblPrevClose").html((Data.PClose / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));
        $("#script_rate1").html((0 / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));
        $("#script_rate1").html((0 / (isCd ? 10000 : 100)).toFixed(isCd ? 4 : 2));

        if (parseFloat(Data.TotalQty).toFixed(0) > 0) {

            if (startsWith(Topic, '5.') == false) {
                $("#lblAP").html(parseFloat((Data.TotalValue / (isCd ? 1000 : 1)) / Data.TotalQty).toFixed(isCd ? 4 : 2));
                $("#lblAP_1").html(parseFloat((Data.TotalValue / (isCd ? 1000 : 1)) / Data.TotalQty).toFixed(isCd ? 4 : 2));
                $("#lblAP_FS").html(parseFloat((Data.TotalValue / (isCd ? 1000 : 1)) / Data.TotalQty).toFixed(isCd ? 4 : 2));
            }
            else {
                $("#lblAP").html(parseFloat((Data.TotalValue) / Data.TotalQty).toFixed(2));
                $("#lblAP_1").html(parseFloat((Data.TotalValue) / Data.TotalQty).toFixed(2));
                $("#lblAP_FS").html(parseFloat((Data.TotalValue) / Data.TotalQty).toFixed(2));
            }
        }
        else {
            $("#lblAP").html(0);
            $("#lblAP_1").html(0);
            $("#lblAP_FS").html(0);
        }

        $("#lblOI").html((Data.OpenInt).toFixed(0));

        if (Data.TotalValue == 0) {
            $("#lbltotalvalue").html('0');
        }
        else {
            $("#lbltotalvalue").html(parseFloat(Data.TotalValue) / 100);
        }
        $("#lblVolume").html(parseFloat(Data.TotalQty));

        time = new Date().valueOf();
    }
}



function RefreshScriptsDetail(data) {
    if (wsD == null || wsD == undefined || wsD.readyState != WebSocket.OPEN) {

        wsD = new WebSocket("wss://acmfeed.investmentz.com:7005");
        wsD.onopen = function () {
            setTimeout(function () {
                SendJson = { SeqNo: 9, Action: "req", RType: "MASTER", Topic: data, Body: "" };
                wsD.send(JSON.stringify(SendJson));
            }, 100);
        };
        wsD.onmessage = function (evt) {
            if (JSON.parse(evt.data).Action == "reply") {
                //console.log(JSON.stringify(evt.data));
                fntblshow(evt.data);
            }
        };
        wsD.onerror = function (evt) {

        };
        wsD.onclose = function () {

        };
    }
    else {
        setTimeout(function () {
            SendJson = { SeqNo: 11, Action: "req", RType: "MASTER", Topic: data, Body: "" };
            wsD.send(JSON.stringify(SendJson));
        }, 100);
    }
    return false;
}

//ajax to get and set broadcast url.
//var gblurl = "https://trade.investmentz.com/EasyTradeApi/api/";
function savegblBCastUrl(url) {
    window.localStorage.setItem("BroadcastUrl", url);
}

function getGblBCastUrl() {
    return window.localStorage.getItem("BroadcastUrl");
}

function resetServerHbListener() {
    if (heartBeatFromServerTimer != -1)
        clearInterval(heartBeatFromServerTimer);

    heartBeatFromServerTimer = setInterval(function () {

    }, heartBeatPeriodServer * 2 * 1000);
}

function manageWsData(keysList, level, subscribe) {
    var SendJson;
    var RType = "";
    if (wsManaged == null || wsManaged == undefined || wsManaged.readyState == WebSocket.CLOSED) {
        wsManaged = new WebSocket("wss://acmfeed.investmentz.com:7005");

        wsManaged.onopen = function () {

            //$("#Broadcast").attr("src", "../img/dis-2.png");
            //$("#Broadcast1").attr("src", "../img/dis-2.png");

            setTimeout(function () {
                if (keysList.length > 0)
                    manageWsData(keysList, level, subscribe);
            }, 500);
            heartBeatTimer = setInterval(function () {
                manageWsData(heartBeatSeqNo, 0, true);
                heartBeatSeqNo++;
            }, heartBeatPeriod * 1000);
            resetServerHbListener();
        };
        wsManaged.onmessage = function (evt) {
            var RType = JSON.parse(evt.data).RType;
            if (RType == "TEXT") {
                var strMsg = JSON.parse(evt.data).Body.split("|");
                gotSystemMessage(strMsg[2], strMsg[0]);
            }
        };
        wsManaged.onerror = function (evt) {
            alert("Some websocket error = " + JSON.stringify(evt));
        };
        wsManaged.onclose = function (event) {

            var reason;
            alert(event.code);
            if (event.code == 1000)
                reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
            else if (event.code == 1001)
                reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
            else if (event.code == 1002)
                reason = "An endpoint is terminating the connection due to a protocol error";
            else if (event.code == 1003)
                reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
            else if (event.code == 1004)
                reason = "Reserved. The specific meaning might be defined in the future.";
            else if (event.code == 1005)
                reason = "No status code was actually present.";
            else if (event.code == 1006)
                reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
            else if (event.code == 1007)
                reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
            else if (event.code == 1008)
                reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
            else if (event.code == 1009)
                reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
            else if (event.code == 1010) // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
                reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
            else if (event.code == 1011)
                reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
            else if (event.code == 1015)
                reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
            else
                reason = "Unknown reason";
        };
    } else {
        if (level > 0) {
            setTimeout(function () {
                if (level == 1) {
                    if (subscribe) {
                        var newKeys = keysList.filter(function (el) {
                            return subscribedKeys.indexOf(el) < 0;
                        });
                        subscribedKeys = subscribedKeys.concat(newKeys);

                        var sendKeys = newKeys.join(",");

                        if (sendKeys != "") {
                            SendJson = { SeqNo: 1, Action: "sub.add.topics", RType: "O1", Topic: "", Body: sendKeys };
                            wsManaged.send(JSON.stringify(SendJson));
                        }
                    }
                    else {
                        SendJson = { SeqNo: 2, Action: "sub.remove.topics", RType: "O1", Topic: "", Body: keysList };
                        wsManaged.send(JSON.stringify(SendJson));
                        subscribedKeys = subscribedKeys.filter(function (key) {
                            return keysList.indexOf(subKey) < 0;
                        });
                    }
                }
                else if (level == 2) {
                    if (subscribe) {
                        var sendKeys = keysList.filter(function (key) {
                            return subscribedKeys2.indexOf(key) == -1;
                        }).join(",");

                        if (sendKeys != "") {
                            lastSubscriptionV2 = sendKeys;
                            SendJson = { SeqNo: 1, Action: "sub.add.topics", RType: "O2", Topic: "", Body: sendKeys };
                            wsManaged.send(JSON.stringify(SendJson));
                        }
                    }
                    else {
                        SendJson = { SeqNo: 2, Action: "sub.remove.topics", RType: "O2", Topic: "", Body: keysList };
                        wsManaged.send(JSON.stringify(SendJson));
                        subscribedKeys2 = subscribedKeys2.filter(function (key) {
                            return keysList.indexOf(subKey) < 0;
                        });
                    }
                }
                else if (level == 3) {
                    if (subscribe) {

                        if (!exchangeMsgsSubs) {
                            SendJson = { SeqNo: 2, Action: "sub.add.topics", RType: "TEXT", Topic: "", Body: "NSE,NFO" };
                            wsManaged.send(JSON.stringify(SendJson));
                            exchangeMsgsSubs = true;
                        }
                    }
                    else {
                        SendJson = { SeqNo: 3, Action: "sub.remove.topics", RType: "TEXT", Topic: "", Body: "NSE,NFO" };
                        wsManaged.send(JSON.stringify(SendJson));
                    }
                }
            }, 200);
        }
        else {
            if (level == 0) {
                if (subscribe) {
                    SendJson = { SeqNo: keysList, Action: "", RType: "HB", Topic: "", Body: heartBeatPeriod.toString() };
                    wsManaged.send(JSON.stringify(SendJson));
                }
                else {
                    clearInterval(heartBeatTimer);
                }
            }
        }
    }
}


function endsWith(sourceString, endingString) {
    if (sourceString.length < endingString.length)
        return false;
    else if (sourceString.match(endingString + "$"))
        return true;
    else
        return false;
}
function startsWith(sourceString, startsString) {
    if (sourceString.length < startsString.length)
        return false;
    else if (sourceString.match("^" + startsString))
        return true;
    else
        return false;
}
