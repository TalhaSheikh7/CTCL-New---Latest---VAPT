
var idList1 = {
    'key1': 'availMarText1',
    'key2': 'availMar1',
    'key3': 'reqMarText1',
    'key4': 'reqMar1',
    'key5': 'excessMarText1',
    'key6': 'excessMar1'
};

$(document).ready(function () {
    var orderstatus = $("#OStatus").val();
   // OrderBook();
    GetOrder(orderstatus);

});
$("#OCkick").click(function () {
    var orderstatus = "C,M,E,Q,A,X,U,P,O,X,Z";
    // OrderBook();
    GetOrder(orderstatus);
})
//function OrderBook() {
    //    var OMarketSegmentchange =
    //[
    //      { value: "All", Id: "All", name: "Market Segment" },
    //      { value: "CM", Id: "CM", name: "CM" },
    //      { value: "FO", Id: "FO", name: "FO" },
    //      { value: "CD", Id: "CD", name: "CD" }
    //];


    //    $("#Omraketsegment").kendoDropDownList({
    //        dataSource: OMarketSegmentchange,
    //        dataValueField: "Id",
    //        dataTextField: "name",
    //        change: '',
    //        animation: {
    //            close: {
    //                effects: "zoom:out",
    //                duration: 200
    //            }
    //        }
    //    });

    //    var OrderStatus =
    // [
    //       { value: "C,M,E,Q,A,X,U,P,O,X,Z", Id: "C,M,E,Q,A,X,U,P,O,X,Z", name: "All" },
    //       { value: "C,M", Id: "C,M", name: "Pending" },
    //       { value: "M", Id: "M", name: "Modified" },
    //       { value: "X", Id: "X", name: "Cancelled" },
    //       { value: "Z", Id: "Z", name: "AMO" },
    //       { value: "E", Id: "E", name: "Error" },
    //       { value: "Q", Id: "Q", name: "RMS Rejected" }
    // ];

    //    $("#OStatus").kendoDropDownList({
    //        dataSource: OrderStatus,
    //        dataValueField: "Id",
    //        dataTextField: "name",
    //        change: Orderstatuschange,
    //        animation: {
    //            close: {
    //                effects: "zoom:out",
    //                duration: 200
    //            }
    //        }
    //    });
   // }

    //function Orderstatuschange() {
    //    var orderstatus = $("#OStatus").val()
    //    GetOrder(orderstatus);
    //};

    function GetOrder(orderstatus) {

        var orderAction = 1;
        var userId = $("#txtSelectedClient").val().split('-')[0].trim();
        var orderId = "-1";
        var pageIndex = "1";
        var OrderSegment = "0";
        var orderStatus = "C,M,E,Q,A,X,U,P,O,X,Z";
        var d = new Date();
        var DateRange1 = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();//"2021/6/18";
        var DateRange2 = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate(); "2021/6/18";
        var sCTCLId = gblCTCLid;//"400072001005";
        var ScriptName = "";
        var strDisplay = "";
        var qtypending = "";
        var discqtypend = '0';
        var arr = new Array();

        $.ajax({
            url: "https://ctcl.investmentz.com/iCtclService/api/OrderV5",
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
                OrderBook = [];
                var company = "";
                var currrate = "";
                var sScripts = "";

                var datafalse = data.IsResultSuccess;
                if (datafalse == false) {
                    OrderBook = [];
                }
                else {

                    $.each(data.Result, function (i, row) {
                        if (row.BuySell == "1") {
                            var Getbuysell = "BUY"
                        }
                        else {
                            var Getbuysell = "SELL"
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

                        strDisplay = $.trim(row.sScript + ' ' + (row.Instrument == "" ? '' : row.Instrument) + '-' + (row.ExchangeName == "" ? '' : row.ExchangeName) + ' ' + (row.Expiry == "" ? '' : Expiry(row.Expiry)));
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
                            TradePRICETIME: row.Price,
                            CNCMIS: cncmis,
                            Qtypending: qtypending,
                            Disqty: discqtypend,
                            Getbuysell: row.BuySell,
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
                    columnMenu: true,
                    noRecords: true,
                    height: 400,
                    serverPaging: true,
                    serverFiltering: true,
                    toolbar: ["search", "excel", "pdf"],
                    filterable: {
                        mode: "row"
                    },
                    columns: [
                        {
                            field: "",
                            width: 25,
                            title: "",
                            template: "#if(Status != 'REJECTED' && Status != 'CANCELLED') {# <a class='k-button' onclick='btncancelmodify(this)' style='width: auto; min-width:auto !important;' data-buysell='#= Getbuysell #' data-exchange-id='#= nExchangeID #' data-instrument='#= Instrument #' data-strike='#= strike #' data-cp='#= cp#' data-expiry-date='#= Expiry #' data-token='#= Token #' data-exchange-constants='#= exchangeconstants #' data-ordertype='#= ordertype#' data-orderno='#= OrderNumber #' data-price='#= TradePRICETIME#' data-trgprice='#= TriggerPrice #' data-orderqty='#= Quantity #' data-pendqty='#= Qtypending #' data-discqty='#= DisclosedQty #' data-cncmis='#= CNCMIS #' data-script='#= Script #' data-Scrip='#= Scrip#' data-ExchangeName='#= ExchangeName#' data-ExchangeOrderID='#= ExchangeOrderID#' data-ClientId='#= ClientId#' data-LTP=''> <i class='fa fa-ellipsis-v' aria-hidden='true'></i></a>#} else{}#"

                        },
                        {
                            title: "UCC", width: 75,
                            field: "ClientId"

                        }, {
                            title: "Order Time", width: 80,
                            field: "OrderTime",
                            hidden: "true"
                        },
                        {
                            title: "Scrip", width: 100,
                            field: "Scrip"
                        },
                        {
                            title: "BuySell",
                            field: "BuySell",
                            hidden: "true"
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
                            field: "TradePRICETIME",
                            hidden: "true"
                        },
                        {
                            title: "CNC/MIS", width: 80,
                            field: "CNCMIS",
                            hidden: "true"
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

    function btncancelmodify(data) {
        $("#modscrip").html(data.dataset.script);

        var ltpid = data.dataset.exchangeConstants + "_" + data.dataset.token
        var ltp = parseFloat($("." + ltpid + "_LR").text()).toFixed(2)
        $("#ltprice").html(ltp);
        $("#LoginIDNameO").html(localStorage.getItem("NameCode"))

        var OCNCMIS = "";
        var buysell = data.dataset.buysell;//1
        localStorage.setItem("buysell", buysell)
        var cncmis = data.dataset.cncmis;
        localStorage.setItem("cncmis", cncmis)
        var cp = data.dataset.cp;
        var discqty = data.dataset.discqty;
        var exchangeConstants = data.dataset.exchangeConstants;
        var exchangeId = data.dataset.exchangeId;
        localStorage.setItem("exchangeId", exchangeId)
        var expiryDate = data.dataset.expiryDate;
        var instrument = data.dataset.instrument;
        localStorage.setItem("instrument", instrument)
        var orderno = data.dataset.orderno;
        localStorage.setItem("OrderNo", orderno)
        var orderqty = data.dataset.orderqty;
        var ordertype = data.dataset.ordertype;
        localStorage.setItem("ordertype", ordertype)
        var pendqty = data.dataset.pendqty;
        var price = data.dataset.price;
        var script = data.dataset.script;//2
        localStorage.setItem("script", script)
        var strike = data.dataset.strike;
        var token = data.dataset.token;
        localStorage.setItem("token", token)
        var trgprice = data.dataset.trgprice;
        var Scrip = data.dataset.scrip;
        var ExchangeName = data.dataset.exchangename;
        localStorage.setItem("ExchangeName", ExchangeName)
        var exchangeorderid = data.dataset.exchangeorderid
        var clientid = data.dataset.clientid

        $("#tradeqty").val(orderqty);
        $("#tradeprice").val(price);
        $("#triggerprice").val(trgprice);
        $("#txtdisclosedqty1").val(discqty)
        if (cncmis == "CNC/NORMAL") {
            document.getElementById("ONRML").checked = true;
            OCNCMIS = '0';
        }
        else if (cncmis == "MIS") {
            document.getElementById("OMIS").checked = true;
            OCNCMIS = '1';
        }
        if (buysell == "1") {
            var BUYSELL = "Buy"
        }
        else {
            var BUYSELL = "Sell"
        }
        $("#buysellO").html(BUYSELL);
        $("#scripO").html(Scrip);
        $("#qytO").html(orderqty);

        if (ordertype == "1") {
            document.getElementById("limitorder").checked = true;
            $('#triggerprice').attr("disabled", "disabled")
        }
        else if (ordertype == "3") {
            document.getElementById("stoploss").checked = true;
        }
        else if (ordertype == "11") {
            document.getElementById("marketorder").checked = true;
            $('#triggerprice').attr("disabled", "disabled")
        }
        else if (ordertype == "12") {

        }
        var stocktype = GetInstrument(instrument);
        VarMargin(exchangeId, token, stocktype);
        var nCncMis = 0;
        if (cncmis == "0") {
            cncmis = "CNC TO MIS";
            nCncMis = 1;
        }
        else {
            cncmis = "MIS TO CNC";
            nCncMis = 0;
        }

        GetRequiredStockOrMargin(nCncMis, token, ExchangeName, price, buysell, orderqty, stocktype, orderno, 3, idList1);
        GetHolding(script)
        GetNetPositionDetails(token, stocktype, 0);

        KendoWindow("modifycancel", 650, 360, "MODIFY / CANCEL ORDER", 0);
        $("#modifycancel").closest(".k-window").css({
            top: "25%",
            left: "30%"
        });
    }
    $("#ModifyOrder").click(function () {
        var sinstrument = GetInstrument(localStorage.getItem("instrument"));

        var successstring = '';
        var orderId = localStorage.getItem("OrderNo");  //OrderNo
        var TotalQty = parseInt($("#tradeqty").val());
        var ExchangeID = localStorage.getItem("exchangeId");  //Added by PSN on 19/03/2018 for BSE  nExchangeID
        var Price = parseFloat($("#tradeprice").val());
        var StockType = sinstrument;//get it here  OrderType
        var OrderType = localStorage.getItem("ordertype");
        var TriggerPrice = parseFloat($("#triggerprice").val());
        var DQ = parseInt($("#txtdisclosedqty1").val());
        var MarketPrice = $("#ltp").text();//parseInt($("#ltp").data("ltp"));
        var Source = "W";
        var CTCLId = localStorage.getItem("CTCLId");//"400072001005";//localStorage.getItem("EmpCTCLid");

        sScript = $("#scriptname").text();
        segmenttype = $("#segmenttype").text();
        buysell = localStorage.getItem("buysell")
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
        var segmenttype = localStorage.getItem("instrument");
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
            //url: "https://1trade.investmentz.com/EasyTradeAPI/api/OrderV5/",
            // url: "http://localhost:1610/api/OrderV4",
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
                        successstring = '<h2 style="color: #999; font-weight: 500;font-size:17px">YOUR ORDER TO' + BUYSELL + '<br>' + sScript + '(' + segmenttype + ')<br><b>' + $("#tradeqty").val().toString() + 'SHARES @ ₹' + $("#tradeprice").val() + '</b><br> IS UPDATED SUCCESSFULLY</h2>';
                    }
                    else {
                        successstring = '<h2 style="color: #999; font-weight: 500;font-size:17px">YOUR ORDER TO' + BUYSELL + '<br>' + sScript + '(' + segmenttype + ')<br><b>' + $("#tradeqty").val() + 'SHARES @ ₹' + $("#tradeprice").val() + '</b><br> IS UPDATED SUCCESSFULLY</h2>';
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
        var sinstrument = GetInstrument(localStorage.getItem("instrument"));
        var segmenttype = GetStringInstrumentForDisplay(sinstrument);

        if (gblCTCLtype.toString().toLocaleLowerCase() == "ba" || gblCTCLtype.toString().toLocaleLowerCase() == "emp") {
            devicesource = "C";
        } else {
            devicesource = "W";
        }

        var porderId = localStorage.getItem("OrderNo");  //OrderNo
        var pSource = "C"; //"W";
        var StockType = sinstrument;//get it here
        var ExchangeID = localStorage.getItem("exchangeId");
        var successstring = '';
        var sScript = localStorage.getItem("script");
        var segmenttype = segmenttype;
        var ExchangeName = localStorage.getItem("ExchangeName");
        var BuySell = localStorage.getItem("buysell");

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

        CANCELORDER.done(function (msg) {
            if (ExchangeID == 1) {
                successstring = '<h2 style="color: #999; font-weight: 500;font-size:17px">YOUR ORDER TO' + BuySell + '<br>' + sScript + ' (' + segmenttype + ')<br><b>' + $("#txtqty").val().toString() + 'SHARES @ ₹' + $("#txtorderprice").val().toString() + '</b><br> IS CANCELLED SUCCESSFULLY</h2>';
            }
            else {
                successstring = '<h2 style="color: #999; font-weight: 500;font-size:17px">YOUR ORDER TO' + BuySell + '<br>' + sScript + ' (' + segmenttype + ')<br><b>' + $("#txtqty").val().toString() + 'SHARES @ ₹' + $("#txtorderprice").val().toString() + '</b><br> IS CANCELLED SUCCESSFULLY</h2>';
            }

                $("#modifycancel").data("kendoWindow").close();
                $('#successmsg').html(successstring);
                KendoWindow("myModalnt", 450, 150, "Order", 0, true);

                $("#modBuySell").delay(1000).fadeOut(100, function () {
            });
            $('#btnLoadMore').removeClass("btn-load-more-hidden").addClass("btn-load-more");

            var orderstatus = "C,M,E,Q,A,X,U,P,O,X,Z";
            GetOrder(orderstatus);
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
        //$('#txtSelectedClient').removeAttr("disabled");
        // $('#txtSelectedClient').attr("readonly", true);
        // $('#txtSelectedClient').val($("#lblClientCode").html());
        $("#clientprofile").html($("#lblClientCode").html());          //vpg 24042018

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

    function GetBoiLienSetting() {
        if ($("#hfldBOIYN").val() == "Y") {
            document.getElementById("fgft").style.visibility = "visible";
            $("#FL").prop("disabled", false); $("#FL").prop("checked", true);
            return;
        }
        $("#FL").prop("disabled", true); $("#FL").prop("checked", false);
        //   document.getElementById("fgft").style.visibility = "visible";
        $.ajax(
            {
                url: gblurl + "BOIAccountV1/",
                method: "get",
                async: false,
                data: {
                    CommonClientCode: $("#txtSelectedClient").val().split('-')[0].trim(),//gblnUserId
                    nActionId: 2
                },
                dataType: "json"
            });
        success: (function (msg) {
            alert(msg.ResultStatus)
            if (msg.ResultStatus == 3) {
                if (msg.Result == true) {
                    //$("#FL").attr('checked', true);
                    $("#FL").prop("disabled", false); $("#FL").prop("checked", true);
                }
                else {
                    //$("#FL").attr('checked', false);
                    $("#FL").prop("disabled", true); $("#FL").prop("checked", false);
                }
            }
            else {
                //$("#FL").attr('checked', false);
                $("#FL").prop("disabled", true); $("#FL").prop("checked", false);
            }
        });
        error: (function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus + ' GetBoiLienSetting');
        });
    }
    $("#ONRML").click(function () {

        var token = localStorage.getItem("token");
        var ExchangeName = localStorage.getItem("ExchangeName");
        var price = $("#tradeprice").val();
        var buysell = localStorage.getItem("buysell");
        var Qty = $("#tradeqty").val();
        var stocktype = GetInstrument(localStorage.getItem("instrument"));
        var OrderNo = localStorage.getItem("OrderNo");
        GetRequiredStockOrMargin(0, token, ExchangeName, price, buysell, Qty, stocktype, OrderNo);
    })
    $("#OMIS").click(function () {
        var token = localStorage.getItem("token");
        var ExchangeName = localStorage.getItem("ExchangeName");
        var price = $("#tradeprice").val();
        var buysell = localStorage.getItem("buysell");
        var Qty = $("#tradeqty").val();
        var stocktype = GetInstrument(localStorage.getItem("instrument"));
        var OrderNo = localStorage.getItem("OrderNo");
        GetRequiredStockOrMargin(1, token, ExchangeName, price, buysell, Qty, stocktype, OrderNo);
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
        GetRequiredStockOrMargin(nCncMis, token, ExchangeName, price, buysell, Qty, stocktype, OrderNo);
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
        GetRequiredStockOrMargin(nCncMis, token, ExchangeName, price, buysell, Qty, stocktype, OrderNo);
    }

    function VarMargin(nExchangeId, nToken, nstockType) {
        var URL = "https://ctcl.investmentz.com/iCtclService/api/ScriptV1/";
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

            //url: "http://192.168.0.104/EasyTradeAPI/api/ReportsV2/",
            //url: "http://120.63.142.234/EasyTradeAPIv2/api/ReportsV2/",
            url: gblurl + "ReportsV2/",
            //url: "https://1trade.investmentz.com/EasyTradeAPI/api/ReportsV2",
            //url: "http://localhost:1610/api/ReportsV2",

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
                console.log(msg.IsResultSuccess);
            }

        });

        GetNetPosition.fail(function (jqXHR, textStatus) {
            alert("Request Failed dis one :" + jqXHR + ' GetNetPosition');
            alert("Trades not found");
            console.log(jqXHR)

        });
    }
