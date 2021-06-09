$(document).ready(function () {

    $("#tabstrip").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        }
    });


    var nAction = 6;
    var sUserId = 892937; //gblnUserId;
    var sProCli = 'Cli';
    var sInstrumentName = 'All';
    var nPageIndex = 0;
    var nToken = 0;
    var sScript = '';
    var sCTCLId = 400072001005;
    GetApiLoginStatus(6);
    tradebook(nAction, sUserId, sProCli, sInstrumentName, nPageIndex, nToken, sScript, sCTCLId);
});

var MarketExchange = [];
MarketExchange.push({
    Id: "1",
    Name: "Scrip (ALL)"
})
script = [];
function tradebook(nAction, sUserId, sProCli, sInstrumentName, nPageIndex, nToken, sScript, sCTCLId) {

    var MarketSegmentchange =
    [
          { value: "All", Id: "All", name: "Market Segment" },
          { value: "CM", Id: "CM", name: "CM" },
          { value: "FO", Id: "FO", name: "FO" },
          { value: "CD", Id: "CD", name: "CD" }
    ];


    $("#mraketsegment").kendoDropDownList({
        dataSource: MarketSegmentchange,
        dataValueField: "Id",
        dataTextField: "name",
        change: Segmentchange,
        animation: {
            close: {
                effects: "zoom:out",
                duration: 200
            }
        }
    });

    var i = 0;
    var arr = new Array();
    var strDisplay = '';
    $.ajax({
        url: "https://ctcl.investmentz.com/iCtclService/api/ReportsV2/",
        method: "get",
        data: {
            nAction: nAction,
            sUserID: sUserId,
            sProCli: sProCli,
            sInstrumentName: sInstrumentName,
            nPageIndex: nPageIndex,
            nToken: nToken,
            sScript: sScript,
            sCTCLId: sCTCLId

        },
        dataType: "json",
        success: function (data) {
            tradebook1 = [];
            var company = "";

            var datafalse = data.IsResultSuccess;
            if (datafalse == false) {
                tradebook1 = [];
            }
            else {

                $.each(data.Result, function (i, row) {

                    if (row.QtyRem == 0) { partial = 'Complete'; } else { partial = 'Partial'; }
                    if (row.CncMis == 0) {
                        var CNCMIS = "CNC / NORMAL";
                    }
                    else {
                        var CNCMIS = "MIS";
                    }

                    if (row.Exchange = 1) {
                        var Exchange = "NSE"
                    }
                    else {
                        var Exchange = "BSE"
                    }
                    strDisplay = $.trim(row.Script + ' ' + (row.Instrument == "" ? '' : row.Instrument) + '-' + (Exchange == "" ? '' : Exchange) + ' ' + (row.Expiry == "" ? '' : Expiry(row.Type, row.Expiry)));
                    // var Scrip = '<span style="color:red;"> ' + row.Script + ' ' + row.Instrument + '-' + Exchange + '</span>';
                    // alert(strDisplay);
                    MarketExchange.push({
                        Id: i,
                        Name: row.Script.toUpperCase()
                    })

                    // alert(Scrip);
                    tradebook1.push({
                        ClientId: row.UserCode,
                        OrderTime: row.TradeTime,
                        Scrip: strDisplay,
                        Quantity: row.TradeQty,
                        OrderPrice: row.OrderPrice,
                       // LTP: "101.1",
                        ExchangeOrderID: row.OrderId,
                        Status: partial,
                        TradePRICETIME: row.TradePrice,
                        CNCMIS: CNCMIS,
                        Status: partial,
                        Qtypending: row.QtyRem,
                        Disqty: row.DisQty,
                        exchangecode: row.Exchange,
                        TradeNumber: row.TradeNumber,
                        sCTCLId: row.sCTCLId,
                        BuySell: row.BuySell,
                        Token: row.Token,
                        isin: row.Isin,
                        Instrument: row.Instrument,
                        Script: row.Script,
                        OrderType :row.OrderType

                    });
                });

              
            }
              $("#marketscript").kendoDropDownList({
                    dataSource: MarketExchange,
                    dataValueField: "Id",
                    dataTextField: "Name",
                    change: ChangeScript,
                    animation: {
                        close: {
                            effects: "zoom:out",
                            duration: 200
                        }
                    }
                });
                $("#tradebookgrid").kendoGrid({
                    dataSource: tradebook1,
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
                            template: "<a class='k-button' onclick='btnConvert(this)' style='width: auto; min-width:auto !important;' data-exchangetype='#= exchangecode #' data-orderno = '#= sCTCLId #' data-tradeno ='#= TradeNumber #' data-orderid ='#= ExchangeOrderID #'data-dealercode ='#= ClientId #' data-cncmis = '#= CNCMIS #'data-Buysell = '#= BuySell #'data-token ='#= Token #' data-isin = '#= isin #'data-stocktype ='#= GetInstrument(Instrument) #'data-scrip ='#= Script #'>" +
                                        "<i class='fa fa-ellipsis-v' aria-hidden='true'></i>" +
                                      "</a>"
                        },
                    {
                        title: "UCC", width: 75,
                        field: "ClientId"

                    }, {
                        title: "Order Time", width: 80,
                        field: "OrderTime"
                    },
                    {
                        title: "Scrip", width: 100,
                        field: "Scrip"
                    }, {
                        title: "Quantity", width: 80,
                        field: "Quantity"

                    },
                      {
                          title: "Order Price", width: 80,
                          field: "OrderPrice"

                      },
                       //{
                       //    title: "LTP", width: 80,
                       //    field: "LTP"

                       //},
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
                        hidden: "true"
                    },
                     {
                         title: "Dis qty<br/>Pending", width: 80,
                         field: "Disqty",
                         hidden: "true"
                     },
                     {
                         title: "Exchange",
                         field: "exchangecode",
                         hidden: "true"
                     },
                     {
                         title: "TradeNumber",
                         field: "TradeNumber",
                         hidden: "true"
                     },
                     {
                         title: "sCTCLId",
                         field: "sCTCLId",
                         hidden: "true"
                     },
                     {
                         title: "BuySell",
                         field: "BuySell",
                         hidden: "true"
                     },
                     {
                         title: "Token ",
                         field: "Token",
                         hidden: "true"
                     },
                     {
                         title: "isin",
                         field: "isin",
                         hidden: "true"
                     },
                     {
                         title: "Instrument",
                         field: "Instrument",
                         hidden: "true"
                     },
                     {
                         title: "Script",
                         field: "Script",
                         hidden: "ture"
                     }

                    ]
                });
        },
        error: function (data) {

        }
    });
}
function GetInstrument(sinstrument) {
    sinstrument = sinstrument.trim();
    var constval = '';

    if (sinstrument == "INDEX_FUTURE" || sinstrument == "FUTIDX") {
        constval = 1; // show FUTURE
    }
    else if (sinstrument == "INDEX_OPTION" || sinstrument == "OPTIDX") {
        constval = 2; //OPTION
    }
    else if (sinstrument == "CASH" || sinstrument == "EQ") {
        constval = 3; //CASH
    }
    else if (sinstrument == "CASH_FUTURE" || sinstrument == "FUTSTK") {
        constval = 4; //FUTURE
    }
    else if (sinstrument == "OPTSTK" || sinstrument == "CASH_OPTION") {
        constval = 5;  //OPTION
    }
    else if (sinstrument == "CURRENCY_FUTURE" || sinstrument == "FUTCUR") {
        constval = 6; //CURR
    }
    else if (sinstrument == "CURRENCY_OPTION" || sinstrument == "OPTCUR") {
        constval = 7; //CURR
    }
    return constval;
}
function btnConvert(data) {
    // alert(this.data - tradeno);
    var cncmis = ""

    var tradeno = data.dataset.tradeno;
    localStorage.setItem("tradeno", tradeno);

    var orderno = data.dataset.orderno;
    localStorage.setItem("orderno", orderno);

    var exchangeid = data.dataset.exchangetype;
    localStorage.setItem("exchangeid", exchangeid);

    var orderid = data.dataset.orderid;
    localStorage.setItem("orderid", orderid);

    var dealercode = data.dataset.dealercode;
    localStorage.setItem("dealercode", dealercode);

    var stocktype = data.dataset.stocktype;
    localStorage.setItem("stocktype", stocktype);

    var cncmis = data.dataset.cncmis;
    localStorage.setItem("cncmis", cncmis);

    var isin = data.dataset.isin;
    localStorage.setItem("isin", isin);

    var buysell = data.dataset.buysell
    localStorage.setItem("buysell", buysell);

    var token = data.dataset.token;
    localStorage.setItem("token", token);

    var script = data.dataset.scrip;
    localStorage.setItem("script", script);

    var kendoWindowAssign = $("#windowForconvertScrip");
    var title = "MIS/CNC Conversion";
    kendoWindowAssign.kendoWindow({
        width: "800px",
        modal: true,
        height: '500px',
        iframe: true,
        resizable: false,
        title: title,
        content: "",
    });

    if (cncmis == "CNC / NORMAL") {
        cncmis = "0";
    }
    else {
        cncmis = "1";
    }

    var nCncMis = 0;
    if (cncmis == "0") {
        cncmis = "CNC TO MIS";
        nCncMis = 1;
    }
    else {
        cncmis = "MIS TO CNC";
    nCncMis = 0;
     }
    $("#msgyn").html("Are you sure want to convert : " + script + " From " + cncmis + " ?");
    var sExchange = "";
    if (exchangeid == 1)
    { sExchange = "NSE"; } else { sExchange = "BSE"; }

    var nBuySell = 1;
    if (buysell == "BUY") {
        nBuySell = 1;
    } else {
        nBuySell = 2;
    }
    VarMargin1(exchangeid, token, stocktype);
    // GetRequiredStockOrMargin(nCncMis, $("#scriptname").data("token"), sExchange, nOrderAmt, nBuySell, nQty, $(this).attr("data-stocktype"), $(this).attr("data-tradeno")); //$(this).attr("data-orderid")
    GetRequiredStockOrMargin1(stocktype, tradeno, dealercode, orderno, nCncMis, orderid, exchangeid, nBuySell)
    var convertmis = $("#windowForconvertScrip").data('kendoWindow');
    convertmis.open();
    convertmis.center();
}

function GetRequiredStockOrMargin1(nStockType, sTradeNo, sDealerCode, sOrderNo, nCNCMIS, nOrderId, Exchange, nBuySell) {
    var nTargetCNCMIS = 0;
    if (nCNCMIS == 1) {
        nTargetCNCMIS = 0;
    }
    else {
        nTargetCNCMIS = 1;
    }

    if ((nBuySell == 2 && nTargetCNCMIS == 1) || (nBuySell == 1 && nTargetCNCMIS == 1) || (nBuySell == 1 && nTargetCNCMIS == 0)) {
        document.getElementById('reqMarText').innerHTML = 'REQUIRED MARGIN';
        document.getElementById('availMarText').innerHTML = 'AVAILABLE/MARGIN';
        document.getElementById('excessMarText').innerHTML = 'EXCESS MARGIN';
    }
    else {
        document.getElementById('reqMarText').innerHTML = 'REQUIRED STOCK';
        document.getElementById('availMarText').innerHTML = 'AVAILABLE/STOCK';
        document.getElementById('excessMarText').innerHTML = 'EXCESS STOCK';
    }
    var URL = "https://ctcl.investmentz.com/iCtclService/api/OrderV5/";

    var rowdata = {
        sTradeNo: sTradeNo,
        sOrderNo: sOrderNo,
        nCncMis: nCNCMIS,
        sDealerCode: sDealerCode,
        nOrderId: nOrderId,
        nExchangeId: Exchange,
        nStockType: nStockType
    }

    $.ajax({
        url: URL,
        type: "get",
        data: rowdata,
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data.IsResultSuccess == true) {
                if ((nBuySell == 2 && nTargetCNCMIS == 1) || (nBuySell == 1 && nTargetCNCMIS == 1) || (nBuySell == 1 && nTargetCNCMIS == 0)) {
                    $("#availMar").html(data.Result[0].AvailMargin);
                    $("#reqMar").html(data.Result[0].RequiredMargin);
                    $("#excessMar").html(data.Result[0].RequiredExtraMargin);
                }
                else {
                    $("#availMar").html(data.Result[0].AvailStock);
                    $("#reqMar").html(data.Result[0].RequiredStock);
                    $("#excessMar").html(data.Result[0].RequiredExtraStock);
                }
            } else {

                $("#varper").val("0%");
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}
function VarMargin1(nExchangeId, nToken, nstockType) {
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
            console.log(data);
            if (data.IsResultSuccess == true) {
                $("#varper").html(data.Result.nVarMarginInPerc + '%');
            } else {
                $("#varper").html("0%");
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}
function Segmentchange() {

    var nAction = 6;
    var sUserId = 869397;
    var sProCli = 'Cli';
    var sInstrumentName = $("#mraketsegment").val();
    var nPageIndex = 0;
    var nToken = 0;
    var sScript = '';
    var sCTCLId = 400072001005;
    tradebook(nAction, sUserId, sProCli, sInstrumentName, nPageIndex, nToken, sScript, sCTCLId);
};


function ChangeScript() {
    var nAction = 6;
    var sUserId = 869397;
    var sProCli = 'Cli';
    var sInstrumentName = $("#mraketsegment").val();
    var nPageIndex = 0;
    var nToken = 0;
    var sScript = $("marketscript").val();
    var sCTCLId = 400072001005;
    tradebook(nAction, sUserId, sProCli, sInstrumentName, nPageIndex, nToken, sScript, sCTCLId)
}

$("#btnyes").click(function () {

    var clientcode = $('#hfldUser').val();

    var StockType = localStorage.getItem("stocktype");
    var TradeNo = localStorage.getItem("tradeno");
    var DealerCode = localStorage.getItem("dealercode");
    var OrderNo = localStorage.getItem("orderno");
    var CNCMIS = localStorage.getItem("cncmis");
    var OrderId = localStorage.getItem("orderid");
    var Exchange = localStorage.getItem("exchangeid");
    if ($("#FL").is(':checked') && $("#hfldBOIYN").val() == "Y" && Math.ceil($("#excessMar").html()) > 0) {
        if ($("#excessMarText").html() == "EXCESS MARGIN") {
            LeanAmount(clientcode, clientcode,
                        2,
                        Math.ceil($("#excessMar").html()),
                        '', function () {
                            ConvertOrder(StockType, TradeNo, DealerCode, OrderNo, CNCMIS, OrderId, Exchange)
                        }); //call back function - saverecord function inside Leanamount - so after leanamount executes saverecord will execute
        }
        else {
            LeanAmount(clientcode, clientcode, 3, $("#excessMar").html(),
                       $(this).attr("isin"),
                       function () {
                           ConvertOrder(StockType, TradeNo, DealerCode, OrderNo, CNCMIS, OrderId, Exchange)
                       });
        }
    }
    else {
        ConvertOrder(StockType, TradeNo, DealerCode, OrderNo, CNCMIS, OrderId, Exchange)
    }
})
function LeanAmount(psLoginId, psUCC, pnTranType, pnTranAmount, psIsin, cbOnDone) {

    $("#BoiModal").show(); //to show 

    var LeanAmountParam = JSON.stringify(
        {
            'LoginID': "", //psLoginId,
            'UCC': psUCC,
            'TransactType': pnTranType,
            'TransactValue': pnTranAmount,
            'ISIN': psIsin
        });

    $.ajax(
   {
       url: gblurl + "BOIAccountV1/",
       type: 'POST',
       contentType: 'application/json',
       data: LeanAmountParam,
       dataType: "json"
   });

    success: (function (msg) {
        if (msg.ResultStatus == 3) {

            $("#lienResult").css("display", "block");

            //if (pnTranType == 2) {
            if ($("#excessMarText").html() == "EXCESS MARGIN") {
                $("#BoiLienHead").html("Fund Block Processed");
                $("#LienAmt").html("Blocking Rs. " + pnTranAmount); 
            }
            else {
                $("#BoiLienHead").html("Stock Block Processed");
                $("#LienAmt").html("Blocking Qty. " + pnTranAmount);
            }

            $("#LienAmtResult").html("Succeed");
            $("#checkUncheck").attr("src", "../img/check.png")



            setTimeout(function () {
                // dont hide lets see ... if it appears
                $("#BoiModal").hide();

                if (cbOnDone != null && cbOnDone != undefined)
                    cbOnDone();

            }, 5000);


        }
        else {

            $("#lienResult").css("display", "block");

            if ($("#excessMarText").html() == "EXCESS MARGIN") {
                $("#BoiLienHead").html("Fund Block Processed");
                $("#LienAmt").html("Blocking Rs. " + pnTranAmount); //
            }
            else {
                $("#BoiLienHead").html("Stock Block Processed");
                $("#LienAmt").html("Blocking Qty. " + pnTranAmount);
            }

            //$("#LienAmt").html("Blocking Rs. " + pnTranAmount);
            $("#LienAmtResult").html("Failed");
            $("#checkUncheck").attr("src", "../img/uncheck.png")
            //$("#BoiModal").toggle();

            setTimeout(function () {
                $("#BoiModal").hide(); 

                if (cbOnDone != null && cbOnDone != undefined)
                    cbOnDone();
            }, 5000);


        }
    });
    error: (function (jqXHR, textStatus) {
        $("#BoiModal").hide();
        alert("Request failed: " + textStatus + ' PostLeanAmount');
        if (cbOnDone != null && cbOnDone != undefined)
            cbOnDone();
    });
}
function GetApiLoginStatus(nAction) {
    $.ajax(
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

    success: (function (msg) {

        if (msg.ResultStatus == 3) {
            if (msg.Result.nLoginStatus == 1) {

                savegblBCastUrl(msg.Result.sCtclBroadcastUrl.toString().trim());
            }
            else {

            }
        } else {

        }
    });

    error: (function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus + ' GetOStatus');
    });
}

getCTCLID();
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

    $('#txtSelectedClient').removeAttr("disabled");
    $('#txtSelectedClient').attr("readonly", true);
    $('#txtSelectedClient').val($("#lblClientCode").html());
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
               CommonClientCode: "869397",//gblnUserId
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
function ConvertOrder(nStockType, sTradeNo, sDealerCode, sOrderNo, nCNCMIS, nOrderId, Exchange) {
      $.ajax({
        url: gblurl + "OrderV5/",
        type: 'PUT',
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify({

            'orderId': nOrderId,
            'StockType': nStockType,
            'Qty': 0,
            'DQ': 0,
            'Price': 0,
            'TriggerPrice': 0,
            'OrderType': 0,
            'MarketPrice': 0,
            'Source': "W",
            'ExchangeId': Exchange,
            'ConvertOrder':
            {
                'nStockType': nStockType,
                'sTradeNo': sTradeNo,
                'sDealerCode': sDealerCode.trim(),
                'sOrderNo': sOrderNo,
                'nCNCMIS': nCNCMIS,
                'nOrderId': nOrderId
            }
        })


        //    ,
        //type: "json"
    });

    success: (function (msg) {
        if (msg.ResultStatus == 3) {

            $('#modconvertorder').modal('hide');

            $('#displayrms').html('<strong>' + msg.Result + '</strong>');

            $('#modrmsvalidation').modal('show');


            setTimeout(function () {
                var nAction = 6;
                var sUserId = 869397; //gblnUserId;
                var sProCli = 'Cli';
                var sInstrumentName = 'All';
                var nPageIndex = 0;
                var nToken = 0;
                var sScript = '';
                var sCTCLId = 400072001005;
                tradebook(nAction, sUserId, sProCli, sInstrumentName, nPageIndex, nToken, sScript, sCTCLId);
            }, 100);

        }
        else {
            $('#modconvertorder').modal('hide');
            $('#displayrms').html("Failed : " + msg.Result);
            $('#modrmsvalidation').modal('show');
        }
    });

    error:(function (jqXHR, textStatus) {
        //alert("Request failed: " + textStatus + 'ConvertOrder');
        $('#displayrms').html("Failed : " + textStatus);
        $('#modrmsvalidation').modal('show');
    });
}
