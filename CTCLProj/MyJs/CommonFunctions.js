$(document).ready(function () {
    GetBcastUrl(6);

    $("#tabstrip").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        }
    });

    $("#tabstrip1").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        }
    });
});

function floatSafeModulusQty(val, step, segment) {
    var x = parseFloat(val.toString()) - (step);
    return parseFloat(x);
}

function floatSafeModulus(val, step) {
    var valDecCount = (val.toString().split('.')[1] || '').length;
    var stepDecCount = (step.toString().split('.')[1] || '').length;
    var decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    var valInt = parseInt(val.toFixed(decCount).replace('.', ''));
    var stepInt = parseInt(step.toFixed(decCount).replace('.', ''));
    return (valInt % stepInt) / Math.pow(10, decCount);
}

function GetRequiredStockMargin(nCncMis, nToken, Exchange, nOrderAmt, nBuySell, nQty, nSegment) {
    var nStockType;
    if (nQty == -1) {
        nQty = $("#txtqty").val();
    }

    if (nBuySell == 2) {
        if ((nSegment == 3 || nSegment == 8 || nSegment == 9) && nCncMis == 0) {
            document.getElementById('reqMarText').innerHTML = 'REQUIRED STOCK';
            document.getElementById('availMarText').innerHTML = 'AVAILABLE/STOCK';
            document.getElementById('excessMarText').innerHTML = 'EXCESS STOCK';
        }
        else {
            document.getElementById('reqMarText').innerHTML = 'REQUIRED MARGIN';
            document.getElementById('availMarText').innerHTML = 'AVAILABLE/MARGIN';
            document.getElementById('excessMarText').innerHTML = 'EXCESS MARGIN';
        }

    } else if (nBuySell == 1) {
        document.getElementById('reqMarText').innerHTML = 'REQUIRED MARGIN';
        document.getElementById('availMarText').innerHTML = 'AVAILABLE/MARGIN';
        document.getElementById('excessMarText').innerHTML = 'EXCESS MARGIN';
    }


    var nBuySell;

    if (nSegment == 3 || nSegment == 8 || nSegment == 9) {
        nStockType = 3;
    } else {
        nStockType = nSegment;
    }

    var nExchangeId = 0;

    var nUserId = $("#cmbClients").val();
    var nOrderId = "";
    var nMarketRate = parseFloat($("#ltp").text())


    if (Exchange == "NSE") {
        nExchangeId = 1;

    } else if (Exchange == "BSE") {
        nExchangeId = 2;
    }

    var URL = gblurl + "OrderV5/";

    var rowdata = {
        nCncMis: nCncMis,
        nStockType: nStockType,
        nToken: nToken,
        nExchangeId: nExchangeId,
        nUserId: 869368,
        nOrderId: nOrderId,
        nOrderAmt: parseFloat(nOrderAmt),
        nMarketRate: parseFloat(nMarketRate),
        nBuySell: nBuySell,
        nQty: nQty
    }

    $.ajax({
        url: URL,
        type: "get",
        data: rowdata,
        dataType: "json",
        success: function (data) {
            //console.log(data);
            if (data.IsResultSuccess == true) {
                if (nBuySell == 1) {
                    $("#availMargin").html(data.Result[0].AvailMargin);
                    $("#reqMargin").html(data.Result[0].RequiredMargin);
                    $("#excessMargin").html(data.Result[0].RequiredExtraMargin);
                } else if (nBuySell == 2) {
                    if (nCncMis == 0) {
                        $("#availMargin").html(data.Result[0].AvailStock);
                        $("#reqMargin").html(data.Result[0].RequiredStock);
                        $("#excessMargin").html(data.Result[0].RequiredExtraStock);
                    }
                    else {
                        $("#availMargin").html(data.Result[0].AvailMargin);
                        $("#reqMargin").html(data.Result[0].RequiredMargin);
                        $("#excessMargin").html(data.Result[0].RequiredExtraMargin);
                    }
                }

            } else {

               // $("#varmarper").val("0%");
            }

        }
    });

}


function GetRequiredStockOrMargin(nCncMis, nToken, Exchange, nOrderAmt, nBuySell, nQty, nSegment, noid, pageid, idList)
{

    var nStockType;
    if (nQty == -1) {
        if (pageid == 1) {
            nQty = $("#txtqty").val();
        } else if (pageid == 2) {
            nQty = $("#tradeqty1").val();
        } else if (pageid == 3) {
            nQty = $("#tradeqty").val();
        } else if (pageid == 4) {
            nQty = '';
        }
    }

    if (nBuySell == 2) {
        if ((nSegment == 3 || nSegment == 8 || nSegment == 9) && nCncMis == 0) {
            document.getElementById(idList.key3).innerHTML = 'REQUIRED STOCK';
            document.getElementById(idList.key1).innerHTML = 'AVAILABLE/STOCK';
            document.getElementById(idList.key5).innerHTML = 'EXCESS STOCK';
        }
        else {
            document.getElementById(idList.key3).innerHTML = 'REQUIRED MARGINN';
            document.getElementById(idList.key1).innerHTML = 'AVAILABLE/MARGIN';
            document.getElementById(idList.key5).innerHTML = 'EXCESS MARGIN';
        }

    } else if (nBuySell == 1) {
        document.getElementById(idList.key3).innerHTML = 'REQUIRED MARGINN';
        document.getElementById(idList.key1).innerHTML = 'AVAILABLE/MARGIN';
        document.getElementById(idList.key5).innerHTML = 'EXCESS MARGIN';
    }


    var nBuySell;
    //if (nBuySell == 5)
    //{
    //    nBuySell = localStorage.getItem("buysell");
    //}

    //if ($("#btnbuy").hasClass("active")) {
    //    nBuySell = 1;
    //} else if ($("#btnsell").hasClass("active")) {
    //    nBuySell = 2;
    //}

    if (nSegment == 3 || nSegment == 8 || nSegment == 9) {
        nStockType = 3;
    } else {
        nStockType = nSegment;
    }

    //var nQty = $("#txtqty").val();

    var nExchangeId = 0;
    //var nBuySell = 0;
    //var nOrderAmt = $("#txtorderprice").val();
    var nUserId = $("#txtSelectedClient").val().toString().split('-')[0].trim(); //localStorage.getItem("UserId");
    var nOrderId = "";
    var nMarketRate;
    if (pageid == 1) {
        nMarketRate = parseFloat($("#ltp").text());
    } else if (pageid == 2) {
        nMarketRate = parseFloat($("#ltprice1").text());
    } else if (pageid == 3) {
        nMarketRate = parseFloat($("#ltprice").text());
    } else if (pageid == 4) {
        nMarketRate = '';
    }

    
    // alert(nMarketRate);


    if (Exchange == "NSE") {
        nExchangeId = 1;

    } else if (Exchange == "BSE") {
        nExchangeId = 2;
    }

    //if ($(this).attr("data-buysell") == 1) {
    //    nBuySell = 1;
    //}
    //else if ($(this).attr("data-buysell") == 2) {
    //    nBuySell = 2;
    //}
    nOrderId = noid;
    //var URL = "http://localhost:1610/api/OrderV5/";
    var URL = gblurl + "OrderV5/";

    var rowdata = {
        nCncMis: nCncMis,
        nStockType: nStockType,
        nToken: nToken,
        nExchangeId: nExchangeId,
        nUserId: nUserId,
        nOrderId: nOrderId,
        nOrderAmt: parseFloat(nOrderAmt),
        nMarketRate: parseFloat(nMarketRate),
        nBuySell: nBuySell,
        nQty: nQty
    }

    $.ajax({
        url: URL,
        type: "get",
        data: rowdata,
        dataType: "json",
        success: function (data) {
            //console.log(data);
            if (data.IsResultSuccess == true) {
                if (nBuySell == 1) {
                    $("#" + idList.key2).html(data.Result[0].AvailMargin);
                    $("#" + idList.key4).html(data.Result[0].RequiredMargin);
                    $("#" + idList.key6).html(data.Result[0].RequiredExtraMargin);
                } else if (nBuySell == 2) {
                    if (nCncMis == 0) {
                        $("#" + idList.key2).html(data.Result[0].AvailStock);
                        $("#" + idList.key4).html(data.Result[0].RequiredStock);
                        $("#" + idList.key6).html(data.Result[0].RequiredExtraStock);
                    }
                    else {
                        $("#" + idList.key2).html(data.Result[0].AvailMargin);
                        $("#" + idList.key4).html(data.Result[0].RequiredMargin);
                        $("#" + idList.key6).html(data.Result[0].RequiredExtraMargin);
                    }

                }

            } else {

                //$("#varper").val("0%");
            }

        },
        error: function (data) {
            console.log(data);
        }
    });

}

function getLotSize(nToken, nstockType) {

    if (nstockType == "" || nstockType == "8" || nstockType == "9") {
        nstockType = "3";
    }
    var ParamGetLotSize = {
        'stockAction': 3,
        'pageIndex': parseInt(nToken),
        'ScriptType': parseInt(nstockType),
        'userID': 0,
        'ScriptName': '',
        'ExchangeId': nExchangeId,
        'Expiry': null,
        'CP': null,
        'Strike': 0
    };

    var WLotSize = $.ajax(
        {
            url: gblurl + "ScriptV1/",
            type: "GET",
            contentType: 'application/json',
            data: ParamGetLotSize,
            dataType: "json"
        });

    WLotSize.done(function (msg) {
        //console.log(msg);
        if (msg.IsResultSuccess) {
            if (instrumentindex != 3 && instrumentindex != 8) {
                $("#txtqty").val(msg.Result.LotSize);
                $("#lotsize").html(msg.Result.LotSize);

                $("#txtqty").attr("data-qty", msg.Result.LotSize);
                $("#txtqty").attr("data-lotsize", msg.Result.LotSize);
                $("#txtqty").attr("data-oldvalue", msg.Result.LotSize);
                $("#txtqty").attr("step", msg.Result.LotSize);
                $("#txtqty").attr("min", msg.Result.LotSize);
            } else {
                $("#txtqty").val(1);
                $("#lotsize").html(1);

                $("#txtqty").attr("data-qty", 1);
                $("#txtqty").attr("data-lotsize", 1);
                $("#txtqty").attr("data-oldvalue", 1);
                $("#txtqty").attr("step", 1);
                $("#txtqty").attr("min", 1);
            }

            if (msg.Result.TickPrice != 0) {
                tickprice = msg.Result.TickPrice;
                $("#txtorderprice").attr("step", msg.Result.TickPrice);
                $("#txtorderprice").attr("min", msg.Result.TickPrice);

                $("#txttrigprice").attr("step", msg.Result.TickPrice);
                $("#txttrigprice").attr("min", msg.Result.TickPrice);
            }
            else {
                tickprice = 0.05;
                tickpriceCurrency = 0.0025;
            }
            

            TopicName = msg.Result.BroadcastConstant + '.' + msg.Result.Key;
            var isCd = startsWith(TopicName, '12.') || startsWith(TopicName, '13.');

            if (startsWith(TopicName, '17.') == true || startsWith(TopicName, '5.') == true) { 
                $("#lblLow52").html((msg.Result.WeekLow52).toFixed(isCd ? 4 : 2));
                $("#lblHigh52").html((msg.Result.WeekHigh52).toFixed(isCd ? 4 : 2));

                $("#lblLowLim").html((msg.Result.MinPrice).toFixed(isCd ? 4 : 2));
                $("#lblUpLim").html((msg.Result.MaxPrice).toFixed(isCd ? 4 : 2));
            }

            else {
                $("#lblLow52").html("N/A");
                $("#lblHigh52").html("N/A");


                $("#lblLowLim").html((msg.Result.MinPrice).toFixed(isCd ? 4 : 2));
                $("#lblUpLim").html((msg.Result.MaxPrice).toFixed(isCd ? 4 : 2));
            }
            $("#sISIN").text('');
            $("#tdISINCode").html('');
            if (nstockType == 3) {
                $("#sISIN").text(msg.Result.ISINNumber);
                $("#tdISINCode").html(msg.Result.ISINNumber);
            }
        }
        else {
            $("#txtqty").val(1);
        }

        $("#sISIN").text(msg.Result.ISINNumber);
        $("#lblesttot").text('');

        SetEstTotal($("#txtqty").val(), $("#txtorderprice").val());

        

        var nBuySell;


        if (localStorage.getItem("BuySell") == "Buy") {
            nBuySell = 1;
        } else if (localStorage.getItem("BuySell") == "Sell") {
            nBuySell = 2;
        }

        var nOrderAmt = $("#txtorderprice").val();
        
        sinstrument = $("#cmbSegment1").val();
        if (sinstrument == 9 || sinstrument == 8 || sinstrument == 1 || sinstrument == 2 || sinstrument == 4 || sinstrument == 5) {
            
            //GetRequiredStockOrMargin(0, $("#scriptname").data("token"), $("#Select2").val(), nOrderAmt, nBuySell, $("#txtqty").val(), sinstrument);
        }

        //GetNetPositionDetails(nToken, nstockType, 0)

    });

    WLotSize.fail(function (jqXHR, textstatus) {
        alert('Error Description : ' + jqXHR + "At getLotSize");

    });
}

function SetEstTotal(Qty, price) {
    var EstTotal = parseFloat(Qty) * parseFloat(price);

    if ($('#segmenttype').attr("data-segement") == "CURR") {
        $('#lblesttot').html(parseFloat(EstTotal).toFixed(4) + '&nbsp;<b style="font-size:10px">(x1000)</b>');
    }
    else {
        $('#lblesttot').html(parseFloat(EstTotal).toFixed(2));
    }
}

function VarMargin1(nExchangeId, nToken, nstockType, id) {
    var URL = gblurl + "ScriptV1/";

    var rowdata = {
        'stockAction': 4,
        'pageIndex': parseInt(nToken),
        'ScriptType': parseInt(nstockType),
        'userID': 0,
        'ScriptName': '',
        'ExchangeId': nExchangeId,
        'Expiry': null,
        'CP': null,
        'Strike': 0
    }

    $.ajax({
        url: URL,
        type: "get",
        data: rowdata,
        dataType: "json",
        success: function (data) {
            //console.log(data);
            if (data.IsResultSuccess == true) {
                $("#" + id).html(data.Result.nVarMarginInPerc + '%');

            } else {
                $("#" + id).html("0%");
            }
        }
    });
}

function GetHolding(sScript) {
    var URL = gblurl + "AccoutingV1/";
    if (gblCTCLtype.toString().toLocaleLowerCase() == "emp" || gblCTCLtype.toString().toLocaleLowerCase() == "ba") {
        empclientid = $("#cmbClients").val();
    }
    else {
        empclientid = gblnUserId;
    }
    if (empclientid == "All") { empclientid = ''; }

    var ClientCode = $("#txtSelectedClient").val().toString().split('-')[0].trim();
    rowdata = {
        nAction: 3,
        sUserid: ClientCode,
        strScript: sScript,
        nPageIndex: 1,
        AccountSegment: 0
    }

    $.ajax({
        url: URL,
        type: "get",
        data: rowdata,
        dataType: "json",
        success: function (data) {
            if (data.Result != "No Data Found") {
                $.each(data.Result.Result, function (i, row) {
                    $("#Hqty").html(row.nQty);
                })

            } else {
                $("#Hqty").html("0");
            }
        }
    });

}

function GetNetPositionforFO(nToken, CNCMIS) {

    var nAction = 5;
    var sUserID = localStorage.getItem("UserId");
    var nPageIndex = 1;

    var sFromDate = '2010/01/29';
    var sTillDate = "";
    var sdtrange = 'Till Today';
    var sAccCD = localStorage.getItem("UserId");
    var sProCli = 'Cli';
    var sInstrumentName = 'FO';
    var sCTCLId = '';
    //var nCNCMIS = 0;

    if (gblCTCLtype.toString().toLocaleLowerCase() == "emp" || gblCTCLtype.toString().toLocaleLowerCase() == "ba") {
        empclientid = $("#cmbClients").val();
    }
    else {
        empclientid = gblnUserId;
    }
    if (empclientid == "All") { empclientid = ''; }

    var GetNetPosition = $.ajax({

        url: gblurl + "ReportsV2/",


        method: "get",
        data: {
            nAction: 5,
            sUserID: sUserID,//sUserID,
            nPageIndex: 1,
            nToken: nToken,
            sFromDate: '2010/01/29',
            sTillDate: '',
            sdtrange: 'Till Today',
            sAccCD: 892910,//sUserID,
            sProCli: 'Cli',
            sInstrumentName: 'FO',
            sCTCLId: '',
            nCNCMIS: CNCMIS
        },
        type: "json"
    });

    GetNetPosition.done(function (msg) {
        //console.log(msg);
        //if (msg.IsResultSuccess) {
        //    var NetAverage = '';
        //    var M2M = 0;
        //    var ltp = parseFloat($("#ltp").text());

        //    if (msg.Result[0].NetQty > 0) {
        //        NetAverage = parseFloat(Math.abs(msg.Result[0].NetValue / msg.Result[0].NetQty)).toFixed(2)
        //    } else if (msg.Result[0].NetQty < 0) {
        //        NetAverage = parseFloat(Math.abs(msg.Result[0].NetValue / msg.Result[0].NetQty)).toFixed(2)
        //    } else {
        //        NetAverage = "0";
        //    }

        //    $("#NWQty").html(msg.Result[0].NetQty);
        //    $("#NWVal").html(msg.Result[0].NetValue);
        //    $("#NWAvg").html(NetAverage);

        //    if (msg.Result[0].NetQty == 0) {
        //        M2M = msg.Result[0].NetValue;
        //    } else if (msg.Result[0].NetQty > 0) {
        //        M2M = msg.Result[0].NetQty * (ltp - NetAverage)
        //    } else {
        //        M2M = parseFloat(Math.abs(msg.Result[0].NetQty)) * (NetAverage - ltp)
        //    }

        //    $("#NWM2M").html(parseFloat(M2M).toFixed(2));
        //} else {
        //    $('#NWQty').html("0");
        //    $('#NWVal').html("0.00");
        //    $('#NWAvg').html("0.00");
        //    $('#NWM2M').html("0.00");
        //}
    });
}