
var idList1 = {
    'key1': 'availMarText1',
    'key2': 'availMar1',
    'key3': 'reqMarText1',
    'key4': 'reqMar1',
    'key5': 'excessMarText1',
    'key6': 'excessMar1'
};

var lotId1 = {
    'key1': 'tradeqty',
    'key2': 'tradeprice',
    'key3': 'triggerprice',
    'key4': 'MClotsize',
};

var CanModId = {
    'key1': 'modOType',
    'key2': 'oIoc',
    'key3': 'triggerprice',
    'key4': 'txtdisclosedqty1',
    'key5': 'mcsegmenttype',
    'key6': 'tradeprice',
    'key7': 'ltprice'
}

var instrumentindex;
var orderprice = 0;
var triggprice = 0;
var nExchangeId = 1;
var orderstatus = '';
$(document).ready(function () {

    //var orderstatus = $("#OStatus").val();
    // OrderBook();
    //GetOrder(orderstatus);

    var Selection = [
        { value: 0, Id: 1, name: localStorage.getItem("NameCode") },
        { value: 1, Id: 2, name: "All" }
    ];

    KendoDropDownList("obselectTrades", Selection, "Id", "name", obWatchSelection, false, "", 0);

    var MarketSegment =
        [
            { value: "All", Id: "0", name: "Market Segment" },
            { value: "CM", Id: "2", name: "CM" },
            { value: "FO", Id: "1", name: "FO" },
            { value: "CD", Id: "3", name: "CD" }
        ];

    KendoDropDownList("obmarketsegment", MarketSegment, "Id", "name", mktsegChange, false, "", 0);

    var OrderStatus =
        [
            { value: "C,M,E,Q,A,X,U,P,O,X,Z", Id: "C,M,E,Q,A,X,U,P,O,X,Z", name: "All" },
            { value: "C,M", Id: "C,M", name: "Pending" },
            { value: "M", Id: "M", name: "Modified" },
            { value: "X", Id: "X", name: "Cancelled" },
            { value: "Z", Id: "Z", name: "AMO" },
            { value: "E", Id: "E", name: "Error" },
            { value: "Q", Id: "Q", name: "RMS Rejected" }
        ];

    KendoDropDownList("obmarketStatus", OrderStatus, "Id", "name", Orderstatuschange, false, "", 0);
    
});

function obWatchSelection()
{
    orderstatus = $("#obmarketStatus ").val();
    GetOrder(orderstatus);
}

function mktsegChange()
{

    orderstatus = $("#obmarketStatus ").val();
    GetOrder(orderstatus);
}

$("#oBook").click(function () {
    orderstatus = "C,M,E,Q,A,X,U,P,O,X,Z";
    // OrderBook();
    GetOrder(orderstatus);
})

function Orderstatuschange()
{
    orderstatus = $("#obmarketStatus ").val();
    GetOrder(orderstatus);
}

function GetOrder(orderstatus)
{

    var orderAction = 1;
    var userId = $("#txtSelectedClient").val().split('-')[0].trim();
    var orderId = -1;
    var pageIndex = 1;
    var OrderSegment = $("#obmarketsegment").val();
    var orderStatus = orderstatus;
    var d = new Date();
    var DateRange1 = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
    var DateRange2 = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate(); "2021/6/18";
    var sCTCLId = "";
    if ($("#obselectTrades").val() == 1)
    {
        sCTCLId = gblCTCLid;
    }
    else if ($("#obselectTrades").val() == 2)
    {
        sCTCLId = "";
    }
    
    var ScriptName = "";
    var strDisplay = "";
    var qtypending = "";
    var discqtypend = '0';
    var arr = new Array();

    $.ajax({
        url: gblurl + "OrderV5",
        method: "get",
        data: {
            orderAction: orderAction,
            userId: userId,
            orderId: orderId,
            pageIndex: pageIndex,
            OrderSegment: OrderSegment,
            orderStatus: orderStatus,
            DateRange1: DateRange1,
            DateRange2: DateRange2,
            sCTCLId: sCTCLId,
            ScriptName: ScriptName
        },
        dataType: "json",
        success: function (data) {
            //console.log(data);
            OrderBook = [];
            var company = "";
            var currrate = "";
            var sScripts = "";
            var Getbuysell = "";
            var datafalse = data.IsResultSuccess;
            if (datafalse == false) {
                OrderBook = [];
            }
            else {

                $.each(data.Result, function (i, row) {
                    if (row.BuySell == "1") {
                        Getbuysell = "BUY(" + GetOrdetype(row.OrderType) + ")";
                    }
                    else {
                        Getbuysell = "SELL(" + GetOrdetype(row.OrderType) + ")";
                    }
                    var cncmis = '';

                    if (row.CncMis == 0) {
                        cncmis = "CNC/NORMAL";
                    }
                    else if (row.CncMis == 1) {
                        cncmis = "MIS";
                    }

                    if (row.QtyRemaining == null) {
                        qtypending = 0;
                    }
                    else { qtypending = row.QtyRemaining; }

                    if (arr.indexOf(row.Script) < 0) {
                        arr.push(row.sScript);
                    }


                    if (row.DisclosedQtyRemaining == null) {
                        discqtypend = 0;
                    }
                    else { discqtypend = row.DisclosedQtyRemaining; }

                    if (row.ExchnageBroadcastConstant == 12 || row.ExchnageBroadcastConstant == 13) {
                        currrate = '<span><strong class= "' + row.ExchnageBroadcastConstant + '_' + row.Token + '_LR">0.0000</strong></span>';
                    }
                    else {
                        currrate = '<span><strong class= "' + row.ExchnageBroadcastConstant + '_' + row.Token + '_LR">0.00</strong></span>';
                    }

                    var lltp = $("." + row.ExchnageBroadcastConstant + "_" + row.Token + "_LR").text();

                    strDisplay = $.trim(row.sScript + ' ' + (row.Instrument == "" ? '' : row.Instrument) + '-' + (row.ExchangeName == "" ? '' : row.ExchangeName) + ' ' + (row.Expiry == "" ? '' : GetExpiry(row.Instrument, row.Expiry)));
                    //strDisplay = $.trim(row.StockName + ' ' + (row.StrikePrice == "" ? '' : row.StrikePrice) + ' ' + (row.CallPut == "" ? '' : row.CallPut) + ' ' + (row.Expiry == null ? '' : GetExpiry(row.Type, row.Expiry)));
                    OrderBook.push({
                        ClientId: row.sUserID,
                        OrderTime: row.OrderEntryTime,
                        Scrip: strDisplay,
                        Quantity: row.TotalQty,
                        OrderPrice: row.Price,
                        LTP: currrate,
                        LLTP: lltp,
                        ExchangeOrderID: row.sExchangeOrderNo,
                        Status: row.OrderStatusDetail,
                        TradeTimePrice: row.Price,
                        CNCMIS: cncmis,
                        Qtypending: qtypending,
                        Disqty: discqtypend,
                        Getbuysell: row.BuySell,
                        BuySell: Getbuysell,
                        nExchangeID: row.nExchangeID,
                        Instrument: row.Instrument,
                        strike: row.Strike,
                        cp: row.sCP,
                        Expiry: row.Expiry,
                        Token: row.Token,
                        exchangeconstants: row.ExchnageBroadcastConstant,
                        ordertype: row.OrderType,
                        OrderNumber: row.ID,
                        TriggerPrice: row.TriggerPrice,
                        DisclosedQty: row.DisclosedQty,
                        Script: row.sScript,
                        ExchangeName: row.ExchangeName

                    });

                    sScripts = sScripts + row.ExchnageBroadcastConstant + '.' + row.Token + ','

                    if (blnBroadCastFlag == true) {
                        CloseSocket();//Close and open
                    }

                    var lblScript = "lblScriptsObook";
                    
                    $('#lblScriptsObook').html(sScripts.substring(0, sScripts.length - 1));
                    $('#lblScriptsObook').html($('#lblScriptsObook').html() + "," + "17.999908,17.999988,5.1")
                    
                    
                    reconnectSocketAndSendTokens(lblScript);
                });


            }
            //$("#Omarketscript").kendoDropDownList({
            //    dataSource: MarketExchange,
            //    dataValueField: "Id",
            //    dataTextField: "Name",
            //    change: ChangeScript,
            //    animation: {
            //        close: {
            //            effects: "zoom:out",
            //            duration: 200
            //        }
            //    }
            //});
            $("#OrderBookgrid").kendoGrid({
                dataSource: {
                    data: OrderBook,
                    pageSize: 15
                },
                sortable: true,
                resizable: true,
                pageable: true,
                reorderable: true,
                columnMenu: false,
                noRecords: true,
                height: 400,
                serverPaging: true,
                serverFiltering: true,
                toolbar: ["search", "excel", "pdf"],
                filterable: {
                    mode: "row"
                },
                pdf: {
                    fileName: "OrderBook.pdf"
                },
                columns: [
                    {
                        field: "",
                        width: 25,
                        title: "",
                        template: "#if(Status != 'REJECTED' && Status != 'CANCELLED') {# <a class='k-button' onclick='btncancelmodify(this)' style='width: auto; min-width:auto !important;' data-buysell='#= Getbuysell #' data-exchange-id='#= nExchangeID #' data-instrument='#= Instrument #' data-strike='#= strike #' data-cp='#= cp#' data-expiry-date='#= Expiry #' data-token='#= Token #' data-exchange-constants='#= exchangeconstants #' data-ordertype='#= ordertype#' data-orderno='#= OrderNumber #' data-price='#= TradeTimePrice#' data-trgprice='#= TriggerPrice #' data-orderqty='#= Quantity #' data-pendqty='#= Qtypending #' data-discqty='#= DisclosedQty #' data-cncmis='#= CNCMIS #' data-script='#= Script #' data-Scrip='#= Scrip#' data-ExchangeName='#= ExchangeName#' data-ExchangeOrderID='#= ExchangeOrderID#' data-ClientId='#= ClientId#' data-LTP=''> <i class='fa fa-ellipsis-v' aria-hidden='true'></i></a>#} else{}#"

                    },
                    {
                        title: "UCC", width: 75,
                        field: "ClientId"

                    }, {
                        title: "Order Time", width: 80,
                        field: "OrderTime",
                        /*  hidden: true*/
                    },
                    {
                        title: "Scrip", width: 100,
                        field: "Scrip"
                    },
                    {
                        title: "BuySell", width: 100,
                        field: "BuySell",
                        /*  hidden: true*/
                    },
                    {
                        title: "Quantity", width: 80,
                        field: "Quantity"

                    },
                    {
                        title: "Order Price", width: 80,
                        field: "OrderPrice"

                    },
                    {
                        title: "LTP",
                        field: "LTP",
                        width: 70,
                        template: "#= LTP #"
                    },
                    {
                        title: "Exchange Order ID", width: 80,
                        field: "ExchangeOrderID"
                    },
                    {
                        title: "Trade price", width: 80,
                        field: "TradeTimePrice",
                        /*     hidden: true*/
                    },
                    {
                        title: "CNC/MIS", width: 80,
                        field: "CNCMIS",
                        /*   hidden: true*/
                    },
                    {
                        title: "Status", width: 80,
                        field: "Status"
                    },
                    {
                        title: "Qty <br/>pending", width: 80,
                        field: "Qtypending",

                    },
                    {
                        title: "Dis qty", width: 80,
                        field: "Disqty",

                    }
                ]
            });
        },
        error: function (data) {
            console.log(data);
        }
    });
}

$('input[type=radio][name=modOType]').on('change', function ()
{
    ChangeOrderType(CanModId);
});

function btncancelmodify(data) {
    var nToken;
    $("#modscrip").html(data.dataset.script);

    var ltpid = data.dataset.exchangeConstants + "_" + data.dataset.token
    var ltp = parseFloat($("." + ltpid + "_LR").text()).toFixed(2)
    $("#ltprice").html(ltp);
    $("#LoginIDNameO").html(localStorage.getItem("NameCode"))

    var nCncMis;
    var cncmis = data.dataset.cncmis;
    var buysell = data.dataset.buysell;

    $('#modscrip').html(data.dataset.script);
    $('#modscrip').data('token', data.dataset.token);
    $('#modscrip').data('buysell', data.dataset.buysell);

    $('#modscrip').data('ExchangeID', data.dataset.exchangeId);
    $('#modscrip').data('orderstatus', 'M');
    $('#modscrip').data('orderid', data.dataset.orderno);
    $('#modscrip').data('instrument', data.dataset.instrument);
    $('#modscrip').data('ordertype', data.dataset.ordertype);
    $('#modscrip').data('cncmis', cncmis);

    instrumentindex = GetInstrument(data.dataset.instrument);
    var segmentindex = GetStringInstrumentForDisplay(instrumentindex);
    var ExchangeName = GetExchangeType(data.dataset.exchangeId);

    $('#mcmarkettype').data('stocktype', instrumentindex);

    if (data.dataset.cp == "C" || data.dataset.cp == "CE") {
        $("#mcOptCallPut").html('<option selected="selected" class="service-small">CE</option>');
        $('#mcsegmenttype').html(ExchangeName + ',' + segmentindex + ', CALL');
    }
    else if (data.dataset.cp == "P" || data.dataset.cp == "PE") {
        $("#mcOptCallPut").html('<option selected="selected" class="service-small">PE</option>');
        $('#mcsegmenttype').html(ExchangeName + ',' + segmentindex + ', PUT');
    } else {
        $('#mcsegmenttype').html(ExchangeName + ',' + segmentindex);
    }

    if (data.dataset.ordertype == "1")
    {
        $('input[type=radio][name=modOType][id=lOrder]').prop('checked', true);
    }
    else if (data.dataset.ordertype == "11")
    {
        $('input[type=radio][name=modOType][id=mOrder]').prop('checked', true);
    }
    else if (data.dataset.ordertype == "3")
    {
        $('input[type=radio][name=modOType][id=SLOrder]').prop('checked', true);
    }
    else if (data.dataset.ordertype == "12")
    {
        $('input[type=radio][name=modOType][id=SLMOrder]').prop('checked', true);
    }

    

    $('#mcsegmenttype').attr("data-segement", segmentindex);

    $("#triggerprice").val("");

    orderprice = parseFloat(data.dataset.price);
    triggprice = parseFloat(data.dataset.trgprice);

    if (segmentindex == 'CURR') {
        $("#tradeprice").attr("step", tickpriceCurrency);
        $("#tradeprice").attr("min", tickpriceCurrency);
        $("#tradeprice").val(parseFloat(orderprice).toFixed(4));
        $("#triggerprice").attr("step", tickpriceCurrency);
        $("#triggerprice").attr("min", tickpriceCurrency);
    }
    else {
        $("#tradeprice").attr("step", tickprice);
        $("#tradeprice").attr("min", tickprice);
        $("#tradeprice").val(parseFloat(triggprice).toFixed(2));
        $("#txttrigprice").attr("step", tickprice);
        $("#txttrigprice").attr("min", tickprice);
    }

    if (data.dataset.expiryDate != "")
    {
        $("#mcExpirydate").html('<option selected="selected" class="service-small">' + formatDate(data.dataset.expiryDate, '', "DD MMM YYYY") + '</option>');
    }

    if (GetInstrument(data.dataset.instrument) == 3) {
        var sScript = $("#modscrip").html();
        GetHolding(sScript);
    }

    if (GetInstrument(data.dataset.instrument) == 1 || GetInstrument(data.dataset.instrument) == 2 || GetInstrument(data.dataset.instrument) == 4 || GetInstrument(data.dataset.instrument) == 5) {
        nToken = $("#modscrip").data("token");
        //GetNetPositionforFO(nToken, 0);
    }

    var Code = $("#txtSelectedClient").val().split('-')[0].trim();
    var Name = $("#txtSelectedClient").val().split('-')[1].trim();

    $("#OBClientnameucc").html(Name + '(' + Code + ')')

    $("#tradeqty").val(data.dataset.pendqty);
    $("#tradeprice").val(parseFloat(data.dataset.price).toFixed(2));
    $("#txtdisclosedqty1").val(data.dataset.discqty);
    $("#triggerprice").val(data.dataset.trgprice);

    var Source = "W";
    nExchangeId = data.dataset.exchangeId;
    var nOrderAmt = $("#tradeprice").val();
    var nOrderNo = $('#modscrip').data('orderid');

    var nCncMis = 0;
    if ($("#ONRML").is(":checked")) {
        nCncMis = 0;
    } else if ($("#OMIS").is(":checked")) {
        nCncMis = 1;
    }


    if (buysell == "1") {
        $("#radio-three").prop("checked", true);
        var BUYSELL = "Buy"
    }
    else {
        $("#radio-four").prop("checked", true);
        var BUYSELL = "Sell"
    }

    if (cncmis == "CNC/NORMAL") {
        document.getElementById("ONRML").checked = true;
        nCncMis = 0;
        $("#ONRML").click();
    }
    else if (cncmis == "MIS") {
        document.getElementById("OMIS").checked = true;
        nCncMis = 1;
        $("#OMIS").click();
    }

    //$("#buysellO").html(BUYSELL);
    //$("#scripO").html(Scrip);
    //$("#qytO").html(orderqty);

    var stocktype = GetInstrument(data.dataset.instrument);
    //VarMargin(nExchangeId, nToken, stocktype);
    
    VarMargin1(nExchangeId, $("#modscrip").data("token"), GetInstrumentNumber(data.dataset.instrument), 'varper1');
    GetRequiredStockOrMargin(nCncMis, $("#modscrip").data("token"), ExchangeName, data.dataset.price, data.dataset.buysell, data.dataset.orderqty, stocktype, data.dataset.orderno, 3, idList1);
    
    GetHolding(data.dataset.script);
    GetNetPositionDetails(data.dataset.token, stocktype, 0);

    MCShowHide();

    if (segmentindex == 'CURR') {
        $("#tradeprice").val(parseFloat($("#tradeprice").val()).toFixed(4));
    }
    else {
        $("#tradeprice").val(parseFloat($("#tradeprice").val()).toFixed(2));
    }

    KendoWindow("modifycancel", 650, 500, "MODIFY / CANCEL ORDER", 0);
    $("#modifycancel").closest(".k-window").css({
        top: "20%",
        left: "25%"
    });

    $("#tradeqty").attr("data-qty", data.dataset.pendqty);
    $("#tradeqty").attr("data-lotsize", "1");
    $("#tradeqty").attr("data-oldvalue", data.dataset.orderqty);
    $("#tradeqty").attr("min", "1");

    if (instrumentindex != 3) {

    }
    else
    {
        $("#tradeqty").attr("data-oldvalue", $(this).attr("data-pendqty"));
    }

    getLotSize(data.dataset.token, instrumentindex, 2, lotId1);
}

function MCShowHide() {
    var StockType = $("#mcmarkettype").data("stocktype");

    if (StockType == 2 || StockType == 5 || StockType == 7) {
        $("#mcExpirydate").show();
        $("#mcOptStrike").show();
        $("#mcOptCallPut").show();

        $("#lblexpdate").show();
        $("#lblstrike").show();
        $("#lblcallput").show();
    }

    if (StockType == 1 || StockType === 4 || StockType == 6) {
        $("#mcExpirydate").show();
        $("#mcOptStrike").hide();
        $("#mcOptCallPut").hide();

        $("#lblexpdate").show();
        $("#lblstrike").hide();
        $("#lblcallput").hide();

    }

    if (StockType == 3) {
        $("#OBForm").hide();
        $("#mcExpirydate").hide();
        $("#mcOptStrike").hide();
        $("#mcOptCallPut").hide();

        $("#lblexpdate").hide();
        $("#lblstrike").hide();
        $("#lblcallput").hide();

    }
}

$("#ModifyOrder").click(function () {
    var sinstrument = GetInstrument($("#modscrip").data("instrument"));

    var successstring = '';
    var orderId = $("#modscrip").data("orderid");
    var TotalQty = parseInt($("#tradeqty").val());
    var ExchangeID = $('#modscrip').data('ExchangeID');
    var Price = parseFloat($("#tradeprice").val());
    var StockType = sinstrument;
    var OrderType = $('#modscrip').data('ordertype');
    var TriggerPrice = parseFloat($("#triggerprice").val());
    var DQ = parseInt($("#txtdisclosedqty1").val());
    var MarketPrice = $("#ltprice").text();
    var Source = "W";
    var CTCLId = localStorage.getItem("CTCLId");

    sScript = $("#modscrip").text();
    segmenttype = $("#segmenttype").text();
    buysell = $('#modscrip').data('buysell');
    if (buysell == "1") {
        var BUYSELL = "Buy"
    }
    else {
        var BUYSELL = "Sell"
    }
    var CncMis = 0;//set
    if ($('#ONRML').is(':checked')) {
        CncMis = 0;
    }
    else if ($('#OMIS').is(':checked')) {
        CncMis = 1;
    }

    var empclientid = '';
    if (gblCTCLtype.toString().toLocaleLowerCase() == "ba" || gblCTCLtype.toString().toLocaleLowerCase() == "emp") {
        empclientid = $("#cmbClients").val();
        devicesource = "C";
    } else {
        empclientid = gblnUserId;
        devicesource = "W";
    }
    var NewBOIFlag = "0";
    if ($("#hfldBOIYN").val().toString() == "Y" || $("#txtSelectedClient").css('color') == "rgb(0, 0, 255)") {
        NewBOIFlag = 1;
    }
    else {
        NewBOIFlag = 0;
    }
    var segmenttype = $("#modscrip").data("instrument");

    var UpdateOrderParams = JSON.stringify({
        'orderId': orderId,
        'StockType': StockType,
        'Qty': TotalQty,
        'DQ': DQ,
        'Price': Price,
        'TriggerPrice': TriggerPrice,
        'OrderType': OrderType,
        'MarketPrice': MarketPrice,
        //'Source': "W",
        'Source': "C",
        'OrderHandling': CncMis,
        'ExchangeId': ExchangeID,
        'IsBoiOrder': NewBOIFlag,
        'CTCLId': CTCLId,

    });

    $.ajax({
        url: gblurl + "OrderV5/",
        type: 'PUT',
        contentType: 'application/json',
        data: UpdateOrderParams,
        dataType: "json",
        complete: function (data, status, xhr) {
            var msgtoshow = "";
            successstring = "";
            if (JSON.parse(data.responseText).ResultStatus == 1) {
                msgtoshow = JSON.parse(data.responseText).Result;
                alert(msgtoshow)
                //successstring = '<h2 style="color: #999; font-weight: 500;font-size:50px">' + JSON.parse(data.responseText).Result; +  '</h2>';
                $('#ordermodify').html(msgtoshow);
                $('#modTradeOrderModifyOld').show();

                $('#btnLoadMore').removeClass("btn-load-more-hidden").addClass("btn-load-more");

                var orderstatus = "C,M,E,Q,A,X,U,P,O,X,Z";
                // OrderBook();
                GetOrder(orderstatus);

                return;
            }
            else if (JSON.parse(data.responseText).ResultStatus == 3) {
                $("#modifycancel").data("kendoWindow").close();
                if (ExchangeID == 1) {
                    successstring = '<h2 style="color: #999; font-weight: 500;font-size:17px">YOUR ORDER TO ' + BUYSELL + '<br>' + sScript + '(' + $("#mcsegmenttype").html() + ')<br><b>' + $("#tradeqty").val().toString() + 'SHARES @ ₹' + $("#tradeprice").val() + '</b><br> IS UPDATED SUCCESSFULLY</h2>';
                }
                else {
                    successstring = '<h2 style="color: #999; font-weight: 500;font-size:17px">YOUR ORDER TO ' + BUYSELL + '<br>' + sScript + '(' + $("#mcsegmenttype").html() + ')<br><b>' + $("#tradeqty").val() + 'SHARES @ ₹' + $("#tradeprice").val() + '</b><br> IS UPDATED SUCCESSFULLY</h2>';
                }

                $('#successmsg').html("YOUR ORDER IS UPDATED SUCCESSFULLY");
                KendoWindow("myModalnt", 450, 150, "Order", 0, true);
                var orderstatus = "C,M,E,Q,A,X,U,P,O,X,Z";
                // OrderBook();
                GetOrder(orderstatus);
                //KendoWindow("modTradeOrderModify", 650, 360, "", 0);
                //$("#modTradeOrderModify").closest(".k-window").css({
                //    top: 350,
                //    left: 200
                //  });
                //  $("#modTradeOrderModifyO").html(successstring);
            }
            else {
                msgtoshow = "Error : " + JSON.parse(data.responseText);
                successstring = "Error : " + JSON.parse(data.responseText).Result;
                $('#errormsg').html(successstring);
                $('#successmsg').html(successstring);
                $("#modTradeOrderModify1").show();
                alert(successstring)

            }

            $('#successmsg').html(successstring);
            setTimeout(function () {

                $('#btnLoadMore').removeClass("btn-load-more-hidden").addClass("btn-load-more");

                var orderstatus = "C,M,E,Q,A,X,U,P,O,X,Z";
                // OrderBook();
                GetOrder(orderstatus);
                $("#tBook").click();
                $('#modTradeOrderModify').hide()
                $("#modBuySell").hide();
            }, 200);
        },
        error: function () {
            console.log('Error while Modifying orders');
        },
    });
})

$("#CancelOrder").click(function () {

    var sinstrument = GetInstrument($("#modscrip").data("instrument"));
    var segmenttype = GetStringInstrumentForDisplay(sinstrument);

    if (gblCTCLtype.toString().toLocaleLowerCase() == "ba" || gblCTCLtype.toString().toLocaleLowerCase() == "emp") {
        devicesource = "C";
    } else {
        devicesource = "W";
    }

    var porderId = $("#modscrip").data("orderid");  //OrderNo
    var pSource = "C"; //"W";
    var StockType = sinstrument;//get it here
    var ExchangeID = $('#modscrip').data('ExchangeID');
    var successstring = '';
    var sScript = $("#modscrip").text();
    var segmenttype = $("#segmenttype").text();
    var ExchangeName = GetExchangeType(ExchangeID);
    var BuySell = $('#modscrip').data('buysell');

    if (BuySell == "1") {
        BuySell = "Buy"
    }
    else {
        BuySell = "Sell"
    }
    var NewBOIFlag = "0";
    var CTCLId = localStorage.getItem("CTCLId");//"400072001005";

    if ($("#hfldBOIYN").val().toString() == "Y" || $("#txtSelectedClient").css('color') == "rgb(0, 0, 255)") {
        NewBOIFlag = 1;
    }
    else {
        NewBOIFlag = 0;
    }
    var segmenttype = localStorage.getItem("instrument");

    var CANCELORDER = $.ajax(
        {
            url: gblurl + "OrderV5/?OrderId=" + porderId + "&StockType=" + StockType + "&Source=" + pSource + "&ExchangeId=" + ExchangeID + "&IsBoiOrder=" + NewBOIFlag.toString() + "&CTCLId=" + CTCLId,
            method: "DELETE",
            contentType: "application/json",
        });
    tradeprice
    CANCELORDER.done(function (msg) {
        //console.log(msg);
        if (ExchangeID == 1) {
            successstring = '<h2 style="font-weight: 500;font-size:17px">YOUR ORDER TO ' + BuySell + '<br>' + sScript + ' (' + $("#mcsegmenttype").html() + ')<br><b>' + parseFloat($("#tradeqty").val().toString()).toFixed(2) + ' SHARES @ ₹' + $("#tradeprice").val().toString() + '</b><br> IS CANCELLED SUCCESSFULLY</h2>';
        }
        else {
            successstring = '<h2 style="font-weight: 500;font-size:17px">YOUR ORDER TO ' + BuySell + '<br>' + sScript + ' (' + $("#mcsegmenttype").html() + ')<br><b>' + parseFloat($("#tradeqty").val().toString()).toFixed(2) + ' SHARES @ ₹' + $("#tradeprice").val().toString() + '</b><br> IS CANCELLED SUCCESSFULLY</h2>';
        }

        $("#modifycancel").data("kendoWindow").close();
        $('#successmsg').html(successstring);
        KendoWindow("myModalnt", 450, 150, "Order", 0, true);

        $("#modBuySell").delay(1000).fadeOut(100, function () {
        });
        $('#btnLoadMore').removeClass("btn-load-more-hidden").addClass("btn-load-more");

        var orderstatus = "C,M,E,Q,A,X,U,P,O,X,Z";
        GetOrder(orderstatus);
        $("#tBook").click();
    });

    CANCELORDER.fail(function (msg) {
        alert('Error While Deleting' + textstatus + 'DeleteOrders');
    });
    
})

//getCTCLID();
if (gblCTCLtype.toString().toLocaleLowerCase() == "ba" || gblCTCLtype.toString().toLocaleLowerCase() == "emp") {
    $("#baimg").css('display', 'inline');
    $("#baimgdiv").addClass('styled-select-new2');
    $("#Img4").css('display', 'inline');
    $('.news').css('display', 'none');
    $("#cmbCtclSelect").css('display', 'inline');
    $("#cmbCtclSelect").html('<option value="">All</option>' + '<option value="' + gblCTCLid + '" selected="selected">' + $("#lblClientCode").html() + '</option>');

    getClntDetails(function (data) {

        initAutoComplete(data.EmpBAClientMaster);
    });
}
else {
    $("#clientprofile").html($("#lblClientCode").html());

    $("#cmbclients1").val($("#lblClientCode").html($("#lblClientCode").html()));
    $("#baimgdiv").removeClass('styled-select-new2');
    setGlobalVariable("selectedBaText", $("#txtSelectedClient").val());
    $("#Img5").css("display", "none");
    $("#iLoader").css("display", "none");
    $("#imgIcon").css("display", "block");
    $("#clntSearchType").css("display", 'none');
    $("#btnCleanText").css("display", 'none');
    $("#cmbCtclSelect").css('display', 'none');

    $("#lblBAName").css('display', 'none');
    $("#baimg").css('display', 'none');
    $("#Img4").css('display', 'none');

    getClntInfo(function (data) {
        hfldBOIYN = "false";
        for (i = 0; i < data.ClientInfo.length; i++) {
            if (data.ClientInfo[i].Segment.toUpperCase() == "CASH") {
                $("#hfldBOIYN").val(data.ClientInfo[i].BOIFlag);

                // alert(data.ClientInfo[i].BOIFlag)
                if ($("#hfldBOIYN").val() == "Y") {

                }
                else {

                }
                GetBoiLienSetting();
                break;
            }
        }
    }, gblnUserId);
    //>>>> 
}


$("#ONRML").click(function () {

    var token = $("#modscrip").data("token");
    var ExchangeName = $("#mcsegmenttype").text().split(',')[0];
    var price = $("#tradeprice").val();
    var buysell = $('#modscrip').data('buysell');
    var Qty = $("#tradeqty").val();
    var nCncMis = $('#modscrip').data('cncmis');
    var stocktype = GetInstrument($('#modscrip').data('instrument'));
    var OrderNo = $('#modscrip').data('orderid');
    GetRequiredStockOrMargin(0, token, ExchangeName, price, buysell, Qty, stocktype, OrderNo, 3, idList1);
})
$("#OMIS").click(function () {
    var token = $("#modscrip").data("token");
    var ExchangeName = $("#mcsegmenttype").text().split(',')[0];
    var price = $("#tradeprice").val();
    var buysell = $('#modscrip').data('buysell');
    var Qty = $("#tradeqty").val();
    var nCncMis = $('#modscrip').data('cncmis');
    var stocktype = GetInstrument($('#modscrip').data('instrument'));
    var OrderNo = $('#modscrip').data('orderid');
    GetRequiredStockOrMargin(1, token, ExchangeName, price, buysell, Qty, stocktype, OrderNo, 3, idList1);
})


function changeQty() {

    var cncmis = localStorage.getItem("cncmis");
    var nCncMis = 0;
    if (cncmis == "0") {
        cncmis = "CNC TO MIS";
        nCncMis = 1;
    }
    else {
        cncmis = "MIS TO CNC";
        nCncMis = 0;
    }
    var token = localStorage.getItem("token");
    var ExchangeName = localStorage.getItem("ExchangeName");
    var price = $("#tradeprice").val();
    var buysell = localStorage.getItem("buysell");
    var Qty = $("#tradeqty").val();
    var stocktype = GetInstrument(localStorage.getItem("instrument"));
    var OrderNo = localStorage.getItem("OrderNo");

    GetRequiredStockOrMargin(nCncMis, token, ExchangeName, price, buysell, Qty, stocktype, OrderNo, 3, idList1);
}

function changeprice() {
    var cncmis = localStorage.getItem("cncmis");
    var nCncMis = 0;
    if (cncmis == "0") {
        cncmis = "CNC TO MIS";
        nCncMis = 1;
    }
    else {
        cncmis = "MIS TO CNC";
        nCncMis = 0;
    }
    var token = localStorage.getItem("token");
    var ExchangeName = localStorage.getItem("ExchangeName");
    var price = $("#tradeprice").val();
    var buysell = localStorage.getItem("buysell");
    var Qty = $("#tradeqty").val();
    var stocktype = GetInstrument(localStorage.getItem("instrument"));
    var OrderNo = localStorage.getItem("OrderNo");

    GetRequiredStockOrMargin(nCncMis, token, ExchangeName, price, buysell, Qty, stocktype, OrderNo, 3, idList1);

}

function VarMargin(nExchangeId, nToken, nstockType) {
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
            if (data.IsResultSuccess == true) {
                $("#varper1").html(data.Result.nVarMarginInPerc + '%');
            } else {
                $("#varper1").html("0%");
            }
        },
        error: function (data) {
            console.log(data);
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
    rowdata = {
        nAction: 3,
        sUserid: $("#txtSelectedClient").val().split('-')[0].trim(),
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
                    $("#Oholdings").html(row.nQty);
                })

            } else {
                $("#Hqty").html("0");
            }
        }
    });

}


function GetNetPositionDetails(nToken, strInst, nCNCMIS) {

    var nAction = 5;
    var sUserID = 0;
    var nPageIndex = 1;
    var nToken = nToken;
    var sFromDate = "2010/01/29"
    var sTillDate = "";
    var sdtrange = "Only Today";
    var sAccCD = '';//$("#cmbClients").val(); //gblnUserId
    var sProCli = "Cli";
    // var sInstrumentName = strInst; //"ALL";
    var sInstrumentName = GetStringInstrumentForDisplay(strInst);

    if (gblCTCLtype.toString().toLocaleLowerCase() == "ba" || gblCTCLtype.toString().toLocaleLowerCase() == "emp") {
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
            nAction: nAction,
            sUserID: sUserID,
            nPageIndex: nPageIndex,
            nToken: nToken,
            sFromDate: sFromDate,
            sTillDate: sTillDate,
            sdtrange: sdtrange,
            sAccCD: $("#txtSelectedClient").val().split('-')[0].trim(),//sAccCD,
            sProCli: sProCli,
            sInstrumentName: sInstrumentName,
            sCTCLId: localStorage.getItem("CTCLId"),//400072001005,
            nCNCMIS: nCNCMIS
        },
        type: "json"
    });
    GetNetPosition.done(function (msg) {
        var htmlval = '';
        var sScripts = '';
        var m2mtot = 0;
        //$('#tblNetPositionList tbody').empty();

        if (msg.IsResultSuccess) {
            //console.log(msg);
        }

    });

    GetNetPosition.fail(function (jqXHR, textStatus) {
        alert("Request Failed dis one :" + jqXHR + ' GetNetPosition');
        alert("Trades not found");
        console.log(jqXHR)

    });
}
