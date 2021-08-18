var GetNotification = [];
var Getresearch = [];
var Gettrade = [];
var Exchangemessage = [];

var idList = {
    'key1': 'availMarText',
    'key2': 'availMargin',
    'key3': 'reqMarText',
    'key4': 'reqMargin',
    'key5': 'excessMarText',
    'key6': 'excessMargin'
};

$(document).ready(function () {

    var norderAction = 5;
    var suserID = gblnUserId;
    var norderId = -1;
    var sorderStatus = "";
    var dDateRange1 = "";
    var dDateRange2 = "";
    var LoginCode = localStorage.getItem("BACode");
    Gettradealert("4", "", norderId, "1", "0", sorderStatus, dDateRange1, dDateRange2);
    Notification(norderAction, LoginCode, norderId, "1", "0", sorderStatus, dDateRange1, dDateRange2);

    var norderAction = 2;
    var dDateRange1 = "";
    var dDateRange2 = "";
    npageIndexNew = 1;
    GetResearchCall(norderAction, 1, dDateRange1, dDateRange2);

    manageWsData("", 3, true);

    //  manageWsData("", 3, true);
    norderAction = 5;
    //       1 = 1;
    dDateRange1 = '';
    dDateRange2 = '';
    userId = gblnUserId;
    sOrderStatus = '';
    nOrderSegment = 0;
    OrderId = -1;
    var LoginCode = localStorage.getItem("BACode");
    GetCorpActions(norderAction, LoginCode, OrderId, "1", nOrderSegment, sorderStatus, dDateRange1, dDateRange2);
});

function gotSystemMessage(Msg, Time) {

    if (datafalse == false) {
        Exchangemessage = [];
    } else {
        Exchangemessage.push({
            Date: Time.slice(0, Time.indexOf(',')).trim(),
            ActionDesc: Time.slice(Time.indexOf(',') + 1, Time.length).trim()
        });
    }

    $("#Exchangemessage1").kendoGrid({
        dataSource: {
            data: Exchangemessage,
        },
        sortable: true,
        resizable: true,
        pageable: true,
        reorderable: true,
        columnMenu: true,
        noRecords: true,
        height: 400,
        serverPaging: true,
        noRecords: true,
        serverFiltering: true,
        toolbar: ["search", { name: 'excel', text: 'Excel' }, { name: 'pdf', text: 'PDF' }],
        filterable: {
            mode: "row"
        },

        columns: [
        {
            title: "Date",
            field: "Date",
            template: "#= Date #",
            width: 80
        },
        {
            title: "ActionDesc",
            field: "ActionDesc",
            template: "#= ActionDesc #",
            width: 500
        }
        ]
    });

    var data = $("#Exchangemessage1").data('kendoGrid');
    var arrows = [37, 38, 39, 40];
    data.table.on("keydown", function (e) {

        if (arrows.indexOf(e.keyCode) >= 0) {
            setTimeout(function () {
                data.select($("#Exchangemessage1_active_cell").closest("tr"));
            }, 1);
        }
    });
}

function Notification(norderAction, suserID, norderId, npageIndexNew, nOrderSegment, sorderStatus, dDateRange1, dDateRange2) {
    $.ajax({
        url: gblurl + "OrderV5/",
        method: "get",
        data: {
            orderAction: norderAction,
            userId: suserID,
            orderId: norderId,
            pageIndex: npageIndexNew,
            OrderSegment: nOrderSegment,
            orderStatus: sorderStatus,
            DateRange1: dDateRange1,
            DateRange2: dDateRange2,
            ScriptName: "",
            sCTCLId: localStorage.getItem("CTCLId")//"400072001005"

        },
        dataType: "json",
        success: function (data) {

            var company = "";

            var datafalse = data.IsResultSuccess;
            if (datafalse == false) {
                GetNotification = [];
            }
            else {

                $.each(data.Result, function (i, row) {
                    var date = formatDate(row.genDate, '', "DD-MMM-YYYY (hh:mm:ss a)");
                    GetNotification.push({
                        Title: row.title,
                        NotificationMessage: row.message,
                        Date: date
                    });
                });
                $("#Notificationgrid").kendoGrid({
                    dataSource: {
                        data: GetNotification,
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
                        title: "Title",
                        field: "Title",
                        width: 80


                    },
                    {
                        title: "Notification Message",
                        field: "NotificationMessage",
                        width: 500
                    },
                    {
                        title: "Date",
                        field: "Date",
                        width: 80
                    }
                    ]
                });

            }
        },
        error: function (data) {

        }
    });

}

function GetResearchCall(norderAction, npageindex, dDateRange1, dDateRange2) {
    $.ajax({
        url: gblurl + "UtilityV1/",
        method: "get",
        data: {
            nAction: norderAction,
            pageIndex: npageIndexNew,
            DateRange1: dDateRange1,
            DateRange2: dDateRange2


        },
        dataType: "json",
        success: function (data) {
            //console.log(data)
            var company = "";

            var datafalse = data.Result.Result;
            if (datafalse == false) {
                Getresearch = [];
            }
            else {

                $.each(data.Result.Result, function (i, row) {
                    //show average of Target price not range of Targetprice
                    var Tprice = '';
                    if (parseFloat(row.TargetPriceUpto) != 0) {
                        Tprice = (parseFloat(row.TargetPriceFrom) + parseFloat(row.TargetPriceUpto)) / 2
                    }
                    else {
                        Tprice = row.TargetPriceFrom;
                    }
                    var CallPrice = '';
                    var avgCallPrice = 0;
                    //show range of price but consider average price for exp return%
                    if (parseFloat(row.PriceUpto) != 0) {
                        CallPrice = parseFloat(row.PriceFrom) + ' - ' + parseFloat(row.PriceUpto);
                        avgCallPrice = (parseFloat(row.PriceFrom) + parseFloat(row.PriceUpto)) / 2;
                    }
                    else {
                        CallPrice = row.PriceFrom;
                        avgCallPrice = row.PriceFrom;
                    }
                    if (row.BuySell == 1) {
                        ExpRet = parseFloat(Tprice) - parseFloat(avgCallPrice);
                        ExpRetPercent = ((parseFloat(ExpRet) / parseFloat(avgCallPrice)) * 100);
                        buysell = "BUY";
                        buyselltd = parseFloat(ExpRetPercent).toFixed(2);

                    } else {
                        ExpRet = parseFloat(avgCallPrice) - parseFloat(Tprice);
                        ExpRetPercent = ((parseFloat(ExpRet) / parseFloat(avgCallPrice)) * 100);
                        buysell = "SELL";
                        buyselltd = parseFloat(ExpRetPercent).toFixed(2);
                    }
                    if (row.CallType == 1) {
                        vv = 'Acmiil Positional Call';
                    }
                    else if (row.CallType == 2) {
                        vv = 'Acmiil Momentum Call (Cash)';
                    }
                    else if (row.CallType == 3) {
                        vv = 'Acmiil Momentum Call (Futures)';
                    }
                    else if (row.CallType == 4) {
                        vv = 'Master Trades High Risk (Futures)';
                    }
                    else if (row.CallType == 5) {
                        vv = 'Master Trades High Risk (options)';
                    }
                    else if (row.CallType == 6) {
                        vv = 'Master Trades Medium Risk';
                    }
                    else if (row.CallType == 7) {
                        vv = 'Acmiil Expiry Trade';
                    }
                    else if (row.CallType == 8) {
                        vv = 'Acmiil Expiry Trade';
                    }
                    else if (row.CallType == 9) {
                        vv = 'ACMIIL INVESTMENT IDEA';
                    }
                    else if (row.CallType == 10) {
                        vv = 'Acmiil Smart Delivery Trade';
                    }
                    else if (row.CallType == 11) {
                        vv = 'Acmiil Daily Pick Intraday (Cash)';
                    }
                    else if (row.CallType == 12) {
                        vv = 'Acmiil Daily Pick Intraday (Futures)';
                    }

                    var vInstrument = GetStringInstrument(row.sSegment);
                    if (row.sStrike == 0) {
                        var vstrike = '';
                    }
                    else {
                        var vstrike = row.sStrike;
                    }
                    if (row.CloseType == "Successful") {
                        closetype = '<span style = "color: #008640; font-weight: bolder;"><strong>Successful</strong></span>';
                        closeRemark = '<strong>Close Remark : </strong>' + row.CloseRemark;
                    }
                    else if (row.CloseType == "Unsuccessful") {
                        closetype = '<span style = "color: red; font-weight: bolder;"><strong>Unsuccessful</strong></span>';
                        closeRemark = '<strong>Close Remark : </strong>' + row.CloseRemark;
                    }
                    else if (row.CloseType == "Neutral") {
                        closetype = '<span style = "color: deeppink; font-weight: bolder;"><strong>Neutral</strong></span>';
                        closeRemark = '<strong>Close Remark : </strong>' + row.CloseRemark;
                    }
                    else {
                        closetype = '<span style = "font-weight: bolder;"><strong>Open</strong></span>';
                        closeRemark = '';
                    }
                    Getresearch.push({
                        buysell: buysell,
                        buyselltd: buyselltd,
                        sScrip: row.sScrip,
                        callType: vv,
                        vInstrument: vInstrument,
                        sExpiry: row.sExpiry,
                        vstrike: vstrike,
                        sCallPut: row.sCallPut,
                        PriceFrom: parseFloat(row.PriceFrom).toFixed(2),
                        PriceUpto: parseFloat(row.PriceUpto).toFixed(2),
                        stoploss: parseFloat(row.StopLoss).toFixed(2),
                        Tprice: Tprice,
                        CallDate: row.CallDate,
                        TargetDate: row.TargetDate,
                        ExpRet: parseFloat(ExpRet).toFixed(2),
                        ExpRetPercent: parseFloat(ExpRetPercent).toFixed(2),
                        Duration: row.Duration,
                        closetype: closetype,
                        Remark: row.Remark,
                        nToken: row.nToken,
                        nConstant: row.nConstant,
                        nMinQty: row.nLotsize,
                        CallTypeorder: row.CallType,
                        sSegment: row.sSegment
                    });
                });

                $("#NotificationgridReseaarchcall").kendoGrid({
                    dataSource: {
                        data: Getresearch,
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
                              field: "BYU/SELL",
                              width: 50,
                              title: "",
                              template: "<a class='k-button' onclick='Researchbuysell(this)'  style='width: auto; min-width:auto !important;' data-buysell='#= buysell #' data-nToken='#= nToken#' data-nConstant='#= nConstant#' data-vInstrument='#= vInstrument#' data-nMinQty='#= nMinQty#' data-CallTypeorder='#= CallTypeorder#' data-sScrip='#= sScrip#' data-sExpiry='#= sExpiry#' data-vstrike='#= vstrike#' data-sCallPut='#= sCallPut#' data-sSegment='#= sSegment#'>" +
                                          "<i class='fa fa-ellipsis-v' aria-hidden='true'></i>" +
                                        "</a>"

                          }, {
                              field: "Remark",
                              width: 50,
                              title: "",
                              template: "<a class='k-button' onclick='remarkclick(this)' style='width: auto; min-width:auto !important;' data-Remark='#= Remark #'>" +
                                          "<i class='fa fa-ellipsis-v' aria-hidden='true'></i>" +
                                        "</a>"

                          }, {
                              title: "Action",
                              field: "buysell",
                              width: 80,
                              //  template: "#= buysell + ' <br/> ' + buyselltd #"

                          },
                    {
                        title: "Scrip",
                        field: "sScrip",
                        width: 100,
                        //template: "#= sScrip + ' <br/> ' + callType #"
                    },
                    {
                        title: "Call Type",
                        field: "callType",
                        width: 210,
                        // template: "#= sScrip + ' <br/> ' + callType #"
                    },
                    {
                        title: "Instrument ",
                        field: " vInstrument",
                        width: 130,
                        //  template: "#= vInstrument + ' <br/> ' + sExpiry #"
                    },
                    {
                        title: "Expiry ",
                        field: " sExpiry",
                        width: 130,
                        //template: "#= vInstrument + ' <br/> ' + sExpiry #"
                    },
                    {
                        title: "Strike Price",
                        field: "vstrike",
                        width: 80,
                        //  template: "#= vstrike + ' <br/> ' + sCallPut #"

                    },
                    {
                        title: "Call Put",
                        field: "sCallPut",
                        width: 80,
                        //  template: "#= vstrike + ' <br/> ' + sCallPut #"

                    },
                    {
                        title: "Price",
                        field: "PriceFrom",
                        width: 80,
                        //emplate: "#= PriceFrom + ' <br/> ' + PriceUpto #"

                    },
                     {
                         title: "PriceUpto",
                         field: "PriceUpto",
                         width: 80,
                         //    template: "#= PriceFrom + ' <br/> ' + PriceUpto #"

                     },
                    {
                        title: "Stop Loss",
                        field: "stoploss",
                        width: 80,
                        //template: "#= stoploss + ' <br/> ' + Tprice #"
                    },
                     {
                         title: "Target Price",
                         field: "Tprice",
                         width: 80,
                         //  template: "#= stoploss + ' <br/> ' + Tprice #"
                     },
                     {
                         title: "Call Date",
                         field: "CallDate",
                         width: 100,
                         //  template: "#= CallDate + ' <br/> ' + TargetDate #"
                     },
                    {
                        title: "Target Date",
                        field: "TargetDate",
                        width: 100,
                        //  template: "#= CallDate + ' <br/> ' + TargetDate #"
                    },
                    {
                        title: "Exp. Return Value ",
                        field: "ExpRet",
                        width: 90,
                        //  template: "#= ExpRet + ' <br/> ' + ExpRetPercent #"
                    },
                    {
                        title: "Exp.Return %",
                        field: "ExpRetPercent",
                        width: 90,

                    },
                    {
                        title: "Duration",
                        field: "Duration",
                        width: 80,

                    },
                    {
                        title: "Call Status",
                        field: "closetype",
                        template: "#=closetype #",
                        width: 110,
                    }

                    ]
                });

            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}


function Gettradealert(norderAction, suserID, norderId, npageindex, nOrderSegment, sorderStatus, dDateRange1, dDateRange2, sScript) {
    $.ajax({
        url: gblurl + "OrderV5/",
        method: "get",
        data: {
            orderAction: norderAction,
            userId: suserID,
            orderId: norderId,
            pageIndex: npageindex,
            OrderSegment: nOrderSegment,
            orderStatus: sorderStatus,
            DateRange1: dDateRange1,
            DateRange2: dDateRange2,
            ScriptName: sScript,
            sCTCLId: localStorage.getItem("CTCLId")//"400072001005"

        },
        dataType: "json",
        success: function (data) {

            var company = "";

            var datafalse = data.IsResultSuccess;
            //console.log(data)
            if (datafalse == false) {
                Gettrade = [];
            }
            else {

                $.each(data.Result, function (i, row) {
                    var date1 = formatDate(row.ActivityTime, '', "DD-MMM-YYYY (hh:mm:ss a)");
                    ordtype = GetOrdetype(row.OrderType);
                    oerror = row.OrderError;
                    if (row.BuySell == 1) {
                        buysell = "BUY";
                        //buyselltd = '<span class="num-qty1"><strong>' + buysell + '</strong></span>' + ordtype + '</td>'
                    } else {
                        buysell = "SELL";
                        // buyselltd = '<span class="num-qty2"><strong>' + buysell + '</strong></span>' + ordtype + '</td>'
                    }
                    strDisplay = $.trim(row.sScript + ' ' + (row.Instrument == "" ? '' : row.Instrument) + '-' + (row.ExchangeName == "" ? '' : row.ExchangeName) + ' ' + (row.Expiry == "" ? '' : Expiry(row.Expiry)));
                    Gettrade.push({
                        UCC: row.sUserID,
                        sExchangeOrderNo: row.sExchangeOrderNo,
                        datetime: date1,
                        buysell: buysell,
                        Script: strDisplay,
                        QtyRemaining: row.QtyRemaining,
                        Price: row.Price,
                        TradedQty: row.TradedQty,
                        TradedPrice: row.TradedPrice,
                        OrderStatusDetail: row.OrderStatusDetail

                    });
                });
                $("#alerttrade").kendoGrid({
                    dataSource: {
                        data: Gettrade,
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
                    excel: {
                        allPages: true
                    },
                    excelExport: exportGridWithTemplatesContent,
                    filterable: {
                        mode: "row"
                    },

                    columns: [
                    {
                        title: "UCC",
                        field: "UCC",
                        width: 80


                    },
                    {
                        title: "Exc. Order No.",
                        field: "sExchangeOrderNo",
                        width: 80
                    },
                    {
                        title: "Exc. Time Stamp ",
                        field: "datetime",
                        width: 120
                    },
                    {
                        title: "Script",
                        field: "Script",
                        width: 100
                    },
                    {
                        title: "Order Type",
                        field: "buysell",
                        width: 50
                    },
                    {
                        title: "Order Qty",
                        field: "QtyRemaining",
                        width: 50
                    },
                    {
                        title: "Order Price",
                        field: "Price",
                        width: 50
                    },
                    {
                        title: "Trade Qty",
                        field: "TradedQty",
                        width: 50
                    },
                    {
                        title: "Trade Price",
                        field: "TradedPrice",
                        width: 50
                    },
                    {
                        title: "Status",
                        field: "OrderStatusDetail",
                        width: 80
                    }
                    ]
                });

            }
        },
        error: function (data) {

        }
    });
}

function exportGridWithTemplatesContent(e) {
    var data = e.data;
    var gridColumns = e.sender.columns;
    var sheet = e.workbook.sheets[0];
    var visibleGridColumns = [];
    var columnTemplates = [];
    var dataItem;
    // Create element to generate templates in.
    var elem = document.createElement('div');

    // Get a list of visible columns
    for (var i = 0; i < gridColumns.length; i++) {
        if (!gridColumns[i].hidden) {
            visibleGridColumns.push(gridColumns[i]);
        }
    }

    // Create a collection of the column templates, together with the current column index
    for (var i = 0; i < visibleGridColumns.length; i++) {
        if (visibleGridColumns[i].template) {
            columnTemplates.push({ cellIndex: i, template: kendo.template(visibleGridColumns[i].template) });
        }
    }

    // Traverse all exported rows.
    for (var i = 1; i < sheet.rows.length; i++) {
        var row = sheet.rows[i];
        // Traverse the column templates and apply them for each row at the stored column position.

        // Get the data item corresponding to the current row.
        var dataItem = data[i - 1];
        for (var j = 0; j < columnTemplates.length; j++) {
            var columnTemplate = columnTemplates[j];
            // Generate the template content for the current cell.
            elem.innerHTML = columnTemplate.template(dataItem);
            if (row.cells[columnTemplate.cellIndex] != undefined)
                // Output the text content of the templated cell into the exported cell.
                row.cells[columnTemplate.cellIndex].value = elem.textContent || elem.innerText || "";
        }
    }
}


function GetCorpActions(norderAction, suserID, norderId, npageindex, nOrderSegment, sorderStatus, dDateRange1, dDateRange2) {

    $.ajax({
        url: gblurl + "AlertsV1/",
        method: "get",
        data: {
            alertAction: norderAction,
            pageIndex: npageindex,
            userId: suserID,
            DateRange1: dDateRange1,
            DateRange2: dDateRange2,
            OrderStatus: sorderStatus,
            OrderSegment: nOrderSegment,
            OrderId: norderId

        },
        dataType: "json",
        success: function (data) {
            //console.log(data);
            var company = "";

            var datafalse = data.IsResultSuccess;
            if (datafalse == false) {
                Exchangemessage = [];
            }
            else {

                $.each(data.Result, function (i, row) {
                    var date = formatDate(row.ActionDate, '', "DD-MMM-YYYY (hh:mm:ss a)");
                    Exchangemessage.push({
                        Date: date,
                        ActionDesc: row.ActionDesc
                    });
                });
                $("#Exchangemessage1").kendoGrid({
                    dataSource: {
                        data: Exchangemessage,
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
                        title: "Date",
                        field: "Date",
                        width: 80
                    },
                    {
                        title: "ActionDesc",
                        field: "ActionDesc",
                        width: 500
                    }
                    ]
                });

            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}


function remarkclick(data) {
    KendoWindow("remaeks", 650, 120, "Remark", 0);
    $("#remaeks").closest(".k-window").css({
        top: 350,
        left: 200
    });
    var Remark = data.dataset.remark;
    $("#remarkdetails").html(Remark)
}

function Researchbuysell(data) {

    if (gblCTCLtype.toString().toLocaleLowerCase() == "emp" && $("#cmbClients").val() == "All") {
        KendoWindow("ClientSelection", 450, 110, "", 0, true);
        return false;
    }
    if (gblCTCLtype.toString().toLocaleLowerCase() == "emp" && $("#txtSelectedClient").val() == "") {
        KendoWindow("ClientSelection", 450, 110, "", 0, true);
        return false;
    }

    var sScripts = "";
    var currrate = "";
    KendoWindow("researchbuysell", 650, 370, "Order", 0);
    $("#researchbuysell").closest(".k-window").css({
        top: 220,
        left: 340
    });
    $("#tradeprice1").val("0.00")
    $("#marketorder1").attr('checked', 'checked');
    var buysell = data.dataset.buysell;
    localStorage.setItem("buysell1", buysell);
    
    if (buysell == "BUY") {
        var buysellreq = 1
        $("#Buyordersearch").show();
        $("#Sellordersearch").hide();
    }
    else {
        var buysellreq = 2
        $("#Sellordersearch").show();
        $("#Buyordersearch").hide();
    }
    var nconstant = data.dataset.nconstant;
    localStorage.setItem("nconstant", nconstant);
    var ntoken = data.dataset.ntoken;
    localStorage.setItem("ntoken", ntoken);
    var CallTypeorder = data.dataset.calltypeorder;
    localStorage.setItem("CallTypeorder", CallTypeorder);
    var sScrip = data.dataset.sscrip;
    localStorage.setItem("sScrip", sScrip)
    var sExpiry = data.dataset.sexpiry;
    localStorage.setItem("sExpiry", sExpiry);
    var vstrike = data.dataset.vstrike
    localStorage.setItem("vstrike", vstrike);
    
    var sCallPut = data.dataset.scallput;
    localStorage.setItem("sCallPut", sCallPut);
    if (nconstant == 12 || nconstant == 13) {
        currrate = '<span><strong id= "' + nconstant + '_' + ntoken + '_LR">0.0000</strong></span>';
    }
    else {
        currrate = '<span><strong id= "' + nconstant + '_' + ntoken + '_LR">0.0000</strong></span>';
    }
    
    sScripts = sScripts + nconstant + '.' + ntoken + ','
    if (blnBroadCastFlag == true) {
        CloseSocket();//Close and open
    }
    var lblScript = "lblScripts2";
    
    $('#lblScripts2').html(sScripts.substring(0, sScripts.length - 1));
    $('#lblScripts2').html($('#lblScripts2').html() + "," + "17.999908,17.999988,5.1")
    reconnectSocketAndSendTokens(lblScript);
    
    $("#ltprice1").html(currrate);
    
    var minqty = data.dataset.nminqty
    $("#tradeqty1").val(minqty)
    var stocktype = data.dataset.ssegment
    VarMargin1(1, ntoken, stocktype)
    
    
    var CncMis = 0;//set
    if ($('#ONRML1').is(':checked')) {
        CncMis = 0;
    }
    else if ($('#OMIS1').is(':checked')) {
        CncMis = 1;
    }
    if (CncMis == "0") {
        nCncMis = 1;
    }
    else {
        nCncMis = 0;
    }
    var ExchangeName = 'NSE';
    var price = $("#tradeprice1").val();
    var Qty = $("#tradeqty1").val();
    var CncMis = 0;//set
    if ($('#marketorder1').is(':checked')) {
        var nconstant1 = localStorage.getItem("nconstant");
        var ntoken = localStorage.getItem("ntoken");
        var ltpid = nconstant1 + "_" + ntoken
        var price = parseFloat($("#" + ltpid + "_LR").text()).toFixed(2)
    
    }
    else if ($('#limitorder1').is(':checked')) {
        var price = $("#tradeprice1").val();
    }
    else if ($('#stoplossmarket1').is(':checked')) {
    
        var nconstant1 = localStorage.getItem("nconstant");
        var ntoken = localStorage.getItem("ntoken");
        var ltpid = nconstant1 + "_" + ntoken
        var price = parseFloat($("#" + ltpid + "_LR").text()).toFixed(2)
    }
    else if ($('#stoploss1').is(':checked')) {
        var price = $("#tradeprice1").val();
    }
    var OrderNo = 0;
    GetRequiredStockOrMargin(nCncMis, ntoken, ExchangeName, price, buysellreq, Qty, CallTypeorder, OrderNo, 2, idList);
}


$("#limitorder1").click(function () {
    $("#tradeprice1").prop("disabled", false);
    var nconstant1 = localStorage.getItem("nconstant");
    var ntoken = localStorage.getItem("ntoken");
    var ltpid = nconstant1 + "_" + ntoken
    var ltp = parseFloat($("#" + ltpid + "_LR").text()).toFixed(2)
    //  $("#ltprice").html(ltp);
    $("#tradeprice1").val(ltp);
})
$("#stoploss1").click(function () {
    $("#tradeprice1").prop("disabled", true);
    $("#tradeprice1").val("0.00");
})
$("#marketorder1").click(function () {
    $("#tradeprice1").prop("disabled", true);
    $("#tradeprice1").val("0.00");
})
$("#stoplossmarket1").click(function () {
    $("#tradeprice1").prop("disabled", false);
    var nconstant1 = localStorage.getItem("nconstant");
    var ntoken = localStorage.getItem("ntoken");
    var ltpid = nconstant1 + "_" + ntoken
    var ltp = parseFloat($("#" + ltpid + "_LR").text()).toFixed(2)
    //  $("#ltprice").html(ltp);
    $("#tradeprice1").val(ltp);
});


$("#Buyordersearch").click(function () {
    var CncMis = 0;//set
    if ($('#ONRML1').is(':checked')) {
        CncMis = 0;
    }
    else if ($('#OMIS1').is(':checked')) {
        CncMis = 1;
    }

    var nStockType = localStorage.getItem("CallTypeorder")
    var ntoken = localStorage.getItem("ntoken");
    var nOrderAmt = $("#tradeprice1").val();
    var nconstant1 = localStorage.getItem("nconstant");
    var ntoken = localStorage.getItem("ntoken");
    var ltpid = nconstant1 + "_" + ntoken
    var ltp = parseFloat($("#" + ltpid + "_LR").text()).toFixed(2)
    var nMarketRate = ltp;
    var nQty = $("#tradeqty1").val();
    var buysell = localStorage.getItem("buysell1");
    if (buysell == "BUY") {
        var nBuySell = 1
    }
    else {
        var nBuySell = 0
    }

    if (nStockType == 2 || nStockType == 5 || nStockType == 7) {

        Expiry = localStorage.getItem("sExpiry");
        Strike = localStorage.getItem("vstrike");
        CP = localStorage.getItem("sCallPut");
    }

    if (nStockType == 1 || nStockType === 4 || nStockType == 6) {
        Expiry = localStorage.getItem("sExpiry");
    }

    if (nStockType == 3) {
        Expiry = '';
        Strike = 0;
        CP = '';
    }
    var sScrip = localStorage.getItem("sScrip");
    var OrderType = 11;
    var TriggerPrice = 0;
    var DQ = 0;
    var MarketPrice = 0;
    var successstring = '';
    var buysellstring = '';

    if ($('#Day').is(':checked')) {
        var DayIoc = 1
    }
    else {
        var DayIoc = 0
    }
    if (gblCTCLtype.toString().toLocaleLowerCase() == "ba" || gblCTCLtype.toString().toLocaleLowerCase() == "emp") {
        empclientid = $("#cmbClients").val();
        Source = "C";
    } else {
        empclientid = gblnUserId;
        Source = "W";
    }
        var ClientCode = $("#txtSelectedClient").val().split('-')[0].trim()
    var UpdateOrderParams = JSON.stringify({

        'userId': ClientCode, //gblnUserId,// nuserId,
        'sScript': sScript,
        'Token': ntoken,
        'BuySell': nBuySell,
        'TotalQty': nQty,
        'Price': nOrderAmt,
        'StockType': nStockType,
        'Expiry': Expiry,
        'CP': CP,
        'Strike': Strike,
        'OrderType': OrderType,
        'TriggerPrice': TriggerPrice,
        'DayIoc': DayIoc,
        'DQ': DQ,
        'MarketPrice': MarketPrice,
        'Source': Source,
        'OrderHandling': CncMis,
        'ExchangeId': 1,
        'CTCLId': localStorage.getItem("CTCLId")//gblCTCLid

    });

    $.ajax({
        url: "https://1trade.investmentz.com/EasyTradeAPI/api/OrderV4/",
        // url: "http://localhost:1610/api/OrderV4",
        url: gblurl + "OrderV5/",
        type: 'PUT',
        contentType: 'application/json',
        data: UpdateOrderParams,
        dataType: "json",
        success: function (data) {
            alert("success");

        },
        error: function (data) {
            console.log(data);
        },
    });
})


function changeQty1() {

    var CncMis = 0;//set
    if ($('#ONRML1').is(':checked')) {
        CncMis = 0;
    }
    else if ($('#OMIS1').is(':checked')) {
        CncMis = 1;
    }
    if (CncMis == "0") {
        nCncMis = 1;
    }
    else {
        nCncMis = 0;
    }
    var token = localStorage.getItem("ntoken");
    var ExchangeName = 'NSE';
    if ($('#marketorder1').is(':checked')) {
        var nconstant1 = localStorage.getItem("nconstant");
        var ntoken = localStorage.getItem("ntoken");
        var ltpid = nconstant1 + "_" + ntoken
        var price = parseFloat($("#" + ltpid + "_LR").text()).toFixed(2)

    }
    else if ($('#limitorder1').is(':checked')) {
        var price = $("#tradeprice1").val();
    }
    else if ($('#stoplossmarket1').is(':checked')) {

        var nconstant1 = localStorage.getItem("nconstant");
        var ntoken = localStorage.getItem("ntoken");
        var ltpid = nconstant1 + "_" + ntoken
        var price = parseFloat($("#" + ltpid + "_LR").text()).toFixed(2)
    }
    else if ($('#stoploss1').is(':checked')) {
        var price = $("#tradeprice1").val();
    }
    var buysell = localStorage.getItem("buysell1");
    if (buysell == "BUY") {
        var buysellreq = 1

    }
    else {
        var buysellreq = 2
    }
    var Qty = $("#tradeqty1").val();
    var stocktype = localStorage.getItem("CallTypeorder");
    var OrderNo = 0;
    GetRequiredStockOrMargin(nCncMis, token, ExchangeName, price, buysellreq, Qty, stocktype, OrderNo, 2);
}
function changeprice1() {
    var CncMis = 0;//set
    if ($('#ONRML1').is(':checked')) {
        CncMis = 0;
    }
    else if ($('#OMIS1').is(':checked')) {
        CncMis = 1;
    }
    if (CncMis == "0") {
        nCncMis = 1;
    }
    else {
        nCncMis = 0;
    }
    var token = localStorage.getItem("ntoken");
    var ExchangeName = 'NSE';
    var price = $("#tradeprice1").val();
    var buysell = localStorage.getItem("buysell1");
    var Qty = $("#tradeqty1").val();
    var stocktype = GetInstrument(localStorage.getItem("CallTypeorder"));
    var OrderNo = 0;
    GetRequiredStockOrMargin(nCncMis, token, ExchangeName, price, buysell, Qty, stocktype, OrderNo, 2);
}

$("#ONRML1").click(function () {

    var CncMis = 0;//set
    if ($('#ONRML1').is(':checked')) {
        CncMis = 0;
    }
    else if ($('#OMIS1').is(':checked')) {
        CncMis = 1;
    }
    if (CncMis == "0") {
        nCncMis = 1;
    }
    else {
        nCncMis = 0;
    }
    var token = localStorage.getItem("ntoken");
    var ExchangeName = 'NSE';
    if ($('#marketorder1').is(':checked')) {
        var nconstant1 = localStorage.getItem("nconstant");
        var ntoken = localStorage.getItem("ntoken");
        var ltpid = nconstant1 + "_" + ntoken
        var price = parseFloat($("#" + ltpid + "_LR").text()).toFixed(2)

    }
    else if ($('#limitorder1').is(':checked')) {
        var price = $("#tradeprice1").val();
    }
    else if ($('#stoplossmarket1').is(':checked')) {

        var nconstant1 = localStorage.getItem("nconstant");
        var ntoken = localStorage.getItem("ntoken");
        var ltpid = nconstant1 + "_" + ntoken
        var price = parseFloat($("#" + ltpid + "_LR").text()).toFixed(2)
    }
    else if ($('#stoploss1').is(':checked')) {
        var price = $("#tradeprice1").val();
    }
    var buysell = localStorage.getItem("buysell1");
    if (buysell == "BUY") {
        var buysellreq = 1

    }
    else {
        var buysellreq = 2
    }
    var Qty = $("#tradeqty1").val();
    var stocktype = localStorage.getItem("CallTypeorder");
    var OrderNo = 0;
    GetRequiredStockOrMargin(nCncMis, token, ExchangeName, price, buysellreq, Qty, stocktype, OrderNo, 2);
})
$("#OMIS1").click(function () {
    var CncMis = 0;//set
    if ($('#ONRML1').is(':checked')) {
        CncMis = 0;
    }
    else if ($('#OMIS1').is(':checked')) {
        CncMis = 1;
    }
    if (CncMis == "0") {
        nCncMis = 1;
    }
    else {
        nCncMis = 0;
    }
    var token = localStorage.getItem("ntoken");
    var ExchangeName = 'NSE';
    if ($('#marketorder1').is(':checked')) {
        var nconstant1 = localStorage.getItem("nconstant");
        var ntoken = localStorage.getItem("ntoken");
        var ltpid = nconstant1 + "_" + ntoken
        var price = parseFloat($("#" + ltpid + "_LR").text()).toFixed(2)

    }
    else if ($('#limitorder1').is(':checked')) {
        var price = $("#tradeprice1").val();
    }
    else if ($('#stoplossmarket1').is(':checked')) {

        var nconstant1 = localStorage.getItem("nconstant");
        var ntoken = localStorage.getItem("ntoken");
        var ltpid = nconstant1 + "_" + ntoken
        var price = parseFloat($("#" + ltpid + "_LR").text()).toFixed(2)
    }
    else if ($('#stoploss1').is(':checked')) {
        var price = $("#tradeprice1").val();
    }
    var buysell = localStorage.getItem("buysell1");
    if (buysell == "BUY") {
        var buysellreq = 1

    }
    else {
        var buysellreq = 2
    }
    var Qty = $("#tradeqty1").val();
    var stocktype = localStorage.getItem("CallTypeorder");
    var OrderNo = 0;
    GetRequiredStockOrMargin(nCncMis, token, ExchangeName, price, buysellreq, Qty, stocktype, OrderNo, 2);
});

$(document).keydown(function (e) {

    if (e.which == 27 && isCtrl == false) {
        if ($("#researchbuysell").is(":visible") == true) {
            $("#researchbuysell").data("kendoWindow").close();
        }
    }
});
