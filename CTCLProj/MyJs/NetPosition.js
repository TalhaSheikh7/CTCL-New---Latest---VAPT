var OrderPosition = [];
var totalNA = [];
var totalNAqty = [];
var totalbuy = [];
var totalsell = [];
var items = [];
$(document).ready(function () {
    $("#tabstrip").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        }
    });


    var CCC = '';
    var Name = '';

    var timer1 = setInterval(myFunctionClient, 1000);
    function myFunctionClient()
    {
        if ($("#txtSelectedClient").val() == "" || $("#txtSelectedClient").val() == undefined) {

        } else {
            clearInterval(timer1);
            CCC = $("#txtSelectedClient").val().toString().split('-')[0].trim();
            Name = $("#txtSelectedClient").val().toString().split('-')[1].trim();
        }
        //PositionData();
    }

    var Netwisedaywise =
        [
            { value: "2", Id: "2", name: "Day wise" },
            { value: "1", Id: "1", name: "Net Wise" }
        ]

    KendoDropDownList("dtrange", Netwisedaywise, "Id", "name", NPdtChange, false, "", 0);

    var NPMarketSegment =
        [
            { value: "All", Id: "1", name: "All" },
            { value: "CM", Id: "2", name: "CM" },
            { value: "FO", Id: "3", name: "FO" },
            { value: "CD", Id: "4", name: "CD" }
        ];

    KendoDropDownList("drpMarketSelection", NPMarketSegment, "Id", "name", npmktsegChange, false, "", 0);
});

function npmktsegChange()
{
    var strdtrange = '';

    if ($("#drpMarketSelection").data("kendoDropDownList").text() == 'FO') {
        strdtrange = 'Till Today';

    } else if ($("#drpMarketSelection").data("kendoDropDownList").text() == 'All') {
        strdtrange = 'Only Today';
    }

    setTimeout(GetNetPositionReport($("#drpMarketSelection").data("kendoDropDownList").text(), strdtrange), 100);
}

function NPdtChange()
{
    var strdtrange = "";
    if ($('#dtrange').val() == 2) {
        strdtrange = 'Only Today';
    } else if ($('#dtrange').val() == 1) {
        strdtrange = 'Till Today';
    }

    setTimeout(GetNetPositionReport($('#dtrange').val(), strdtrange), 100);
}

$("#nPosition").click(function () {
    var strdtrange = "";
    var strInst = 1

    strdtrange = 'Till Today';
    GetNetPositionReport(strInst, strdtrange);
})
function PositionData() {
//    var Marketsegment =
//[
//  { value: "1", Id: "1", name: "ALL" },
//  { value: "2", Id: "2", name: "CM" },
//  { value: "3", Id: "3", name: "FO" },
//  { value: "4", Id: "4", name: "CD" }
//];

//    $("#drpMarketSelection").kendoDropDownList({
//        dataSource: Marketsegment,
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
//    var Netwisedaywise =
// [
// { value: "1", Id: "1", name: "Net Wise" },
// { value: "2", Id: "2", name: "Day wise" }
// ]

//    $("#dtrange").kendoDropDownList({
//        dataSource: Netwisedaywise,
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
   // var marketsegment = $("#drpMarketSelection").val();
  
}

function GetNetPositionReport(strInst, strdtrange) {
    if ($('#drpMarketSelection').find(":selected").text() != 'FO') {
        if ($('#drpMarketSelection').find(":selected").text() == 'All') {
            strdtrange = 'Only Today';
        } else {
            if ($('#dtrange').val() == 2) {
                strdtrange = 'Only Today';
            } else if ($('#dtrange').val() == 1) {
                strdtrange = 'Till Today';
            }
        }
    }


    //strdtrange = $('#dtrange').find(":selected").text(); //$('#dtrange').find(":selected").text();
    strInst = $("#drpMarketSelection").data("kendoDropDownList").text();
    if (strdtrange == "")
    {
        strdtrange = "Only Today";
    }
    var nAction = 5;
    var sUserID = 0;
    var nPageIndex = 1;
    var sdtrange = strdtrange;  
    var sAccCD = '';//$("#cmbClients").val(); //gblnUserId
    var nToken = -1;
    var sFromDate = "2010/01/29"
    var sTillDate = "";
    var sProCli = "Cli";
    var sInstrumentName = strInst;

    if (gblCTCLtype.toString().toLocaleLowerCase() == "emp" || gblCTCLtype.toString().toLocaleLowerCase() == "ba") {
        empclientid = $("#cmbClients").val();
    }
    else {
        empclientid = gblnUserId;
    }
    if (empclientid == "All") { empclientid = ''; }

    if ($("#cmbCtclSelect").val() == "") {
    }
    var ClientCode = $("#txtSelectedClient").val().split('-')[0].trim();
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
            sAccCD: ClientCode,//sAccCD,
            sProCli: sProCli,
            sInstrumentName: sInstrumentName,
            sCTCLId: ""//localStorage.getItem("CTCLId")//""
        },
        type: "json"
    });
    GetNetPosition.done(function (msg) {
        //console.log(msg);
        if (msg.IsResultSuccess) {
            FillGrid(msg.Result);
        }
        else {
            FillGrid(msg.Result);
        }
    });

    GetNetPosition.fail(function (jqXHR, textStatus) {
        alert("Request Failed dis one :" + jqXHR + ' GetNetPosition');

    });


}

function getTotalNetAvg()
{
    return parseFloat(totalNA[totalNA.length - 1].TotalNetAverage).toFixed(2);
}

function getTotalNetVal() {
    return parseFloat(totalNAqty[totalNAqty.length - 1].TotalNetVal).toFixed(2);
}

function getTotalNetQty() {
    return parseFloat(totalNAqty[totalNAqty.length - 1].TotalNetQty).toFixed(2);
}

function getTotalBuyVal() {
    return parseFloat(totalbuy[totalbuy.length - 1].TotalBuyVal);
}

function getTotalBuyQty() {
    return parseFloat(totalbuy[totalbuy.length - 1].TotalBuyQty);
}

function getTotalSellVal() {
    return parseFloat(totalsell[totalsell.length - 1].TotalSellVal);
}

function getTotalSellQty() {
    return parseFloat(totalsell[totalsell.length - 1].TotalSellQty);
}


function FillGrid(msg) {
    var htmlval = '';
    var strExp = '';
    $('#tblheader tbody').empty();

    var sScripts = '';
    var totbuyqty = 0;
    var totbuyval = 0;
    var totsellqty = 0;
    var totsellval = 0;
    var totNetqty = 0;
    var totNetavg = 0;
    var totNetval = 0;
    var totm2m = 0;
    var nrow = 0;
    var totpl = 0;
    OrderPosition = [];
    totalNA = [];
    if (msg == "Get net postion returned no records") {
        OrderPosition = [];
        totalNA = [];
    }
    else {
        $.each(msg, function (i, row) {
            nrow = nrow + 1;
            var currrate = 0;
            var vstrike = 0;
            var vprice = 0;
            var trgprice = 0;
            var vcp = "";
            var buyqty = "";
            var buyval = "";
            var sellqty = "";
            var sellval = "";
            var buyavg = "";
            var sellavg = "";
            var netqty = "";
            var netval = "";
            var NetM2M = "";
            var Netavg = "";

            var tmpcncmis = row.nCNCMIS == 0 ? 'CNC/NORMAL' : 'MIS';
            var vcncmis = row.nCNCMIS == 0 ? 'CNC' : 'MIS';
            if (arr.indexOf(row.Script) < 0) {
                //if (a < 0) {
                arr.push(row.Script);
            }
            if (row.ExchangeBroadcastConstant == 12 || row.ExchangeBroadcastConstant == 13) {
                currrate = '<span><strong class= "' + row.ExchangeBroadcastConstant + '_' + row.Token + '_LR"></strong></span>';

                NetM2M = '<span  class="' + row.ExchangeBroadcastConstant + '_' + row.Token + '_tdM2M' + vcncmis + '_' + nrow + '" class="netposition-12 ' + row.ExchangeBroadcastConstant + '_' + row.Token + '_tdM2M" style="font-weight: bold;">0.00</span>';

                buyqty = row.BuyQty;
                buyavg = parseFloat(row.BuyAvg).toFixed(4);
                buyval = parseFloat(row.BuyValue).toFixed(4);
                sellqty = row.SellQty;
                sellval = parseFloat(row.SellValue).toFixed(4);
                sellavg = parseFloat(row.SellAvg).toFixed(4);

                //if (parseFloat(row.BuyValue) >= 0) {
                //    //buyval = '<td>' + parseFloat(row.BuyAvg).toFixed(4) + '<br><Span  class="num-qty1">' + parseFloat(row.BuyValue).toFixed(4) + '</span></td>';
                //    buyavg = parseFloat(row.BuyAvg).toFixed(4);
                //    buyval = parseFloat(row.BuyValue).toFixed(4);
                //}
                //else {
                //    //buyval = '<td>' + parseFloat(row.BuyAvg).toFixed(4) + '<br><span class="num-qty2">' + parseFloat(row.BuyValue).toFixed(4) + '</span></td>';
                //    buyavg = parseFloat(row.BuyAvg).toFixed(4);
                //    buyval = parseFloat(row.BuyValue).toFixed(4);
                //}
             
                //if (parseFloat(row.SellValue) >= 0) {
                //    sellval = '<td>' + parseFloat(row.SellAvg).toFixed(4) + '<br><span class="num-qty2">' + parseFloat(row.SellValue).toFixed(4) + '</span></td>';
                //}
                //{
                //    sellval = '<td>' + parseFloat(row.SellAvg).toFixed(4) + '<br><span class="num-qty1">' + parseFloat(row.SellValue).toFixed(4) + '</span></td>';
                //}

                netqty = '<td class="' + row.ExchangeBroadcastConstant + '_' + row.Token + '_tdNQ">' + row.NetQty + '</td>';
                netval = '<td class="' + row.ExchangeBroadcastConstant + '_' + row.Token + '_tdNV">' + parseFloat(row.NetValue).toFixed(4) + '</td>';

                if (row.NetQty > 0) {

                    Netavg = '<span class="' + row.ExchangeBroadcastConstant + '_' + row.Token + '_tdnavg" >' + parseFloat(Math.abs(row.NetValue / row.NetQty)).toFixed(4) + '</span>';

                }
                else if (row.NetQty < 0) {

                    Netavg = '<span class="' + row.ExchangeBroadcastConstant + '_' + row.Token + '_tdnavg" >' + parseFloat(Math.abs(row.NetValue / row.NetQty)).toFixed(4) + '</span>';
                }
                else {
                    Netavg = '<span class="' + row.ExchangeBroadcastConstant + '_' + row.Token + '_tdnavg" >0</span>';
                }
            }
            else {
                currrate = '<span><strong class= "' + row.ExchangeBroadcastConstant + '_' + row.Token + '_LR">0.0000</strong></span>';
                NetM2M = '<span  class="' + row.ExchangeBroadcastConstant + '_' + row.Token + '_tdM2M' + vcncmis + '_' + nrow + '" >0.00</span>';
                //NetM2M = '<span  class="' + row.ExchangeBroadcastConstant + '_' + row.Token + '_tdM2M' + vcncmis + '_' + nrow + '"  class="netposition-12 ' + row.ExchangeBroadcastConstant + '_' + row.Token + '_tdM2M" style="font-weight: bold;">0.00</span>';
                buyqty = row.BuyQty;
                buyavg = parseFloat(row.BuyAvg).toFixed(2);
                buyval = parseFloat(row.BuyValue).toFixed(2);
                sellqty = row.SellQty;
                sellval = parseFloat(row.SellValue).toFixed(2);
                sellavg = parseFloat(row.SellAvg).toFixed(2);

                //if (parseFloat(row.BuyValue) >= 0) {
                //    buyval = '<td>' + parseFloat(row.BuyAvg).toFixed(2) + '<br><span  class="num-qty1">' + parseFloat(row.BuyValue).toFixed(2) + '</span></td>';
                //}
                //else {
                //    buyval = '<td>' + parseFloat(row.BuyAvg).toFixed(2) + '<br><span class="num-qty2">' + parseFloat(row.BuyValue).toFixed(2) + '</span></td>';
                //}

                //if (parseFloat(row.SellValue) >= 0) {
                //    sellval = '<td>' + parseFloat(row.SellAvg).toFixed(2) + '<br><span  class="num-qty2">' + parseFloat(row.SellValue).toFixed(2) + '</span></td>';
                //}
                //{
                //    sellval = '<td>' + parseFloat(row.SellAvg).toFixed(2) + '<br><span class="num-qty1">' + parseFloat(row.SellValue).toFixed(2) + '</span></td>';
                //}
                
                netqty = '<span class="' + row.ExchangeBroadcastConstant + '_' + row.Token + '_tdNQ">' + row.NetQty + '</span>';
                netval = '<span class="' + row.ExchangeBroadcastConstant + '_' + row.Token + '_tdNV">' + parseFloat(row.NetValue).toFixed(2) + '</span>';
                
                if (row.NetQty > 0) {
                    Netavg = '<span class="' + row.ExchangeBroadcastConstant + '_' + row.Token + '_tdnavg" >' + parseFloat(Math.abs((row.BuyValue - row.SellValue) / row.NetQty)).toFixed(2) + '</span>';
                }
                else if (row.NetQty < 0) {
                    Netavg = '<span class="' + row.ExchangeBroadcastConstant + '_' + row.Token + '_tdnavg" >' + parseFloat(Math.abs((row.SellValue - row.BuyValue) / Math.abs(parseFloat(row.NetQty)))).toFixed(2) + '</span>';
                }
                else {
                    Netavg = '<span class="' + row.ExchangeBroadcastConstant + '_' + row.Token + '_tdnavg" >0</span>';
                }

            }
            var instru = row.OrderType.toString().trim();
            if (row.CallPut != "" && row.CallPut != "XX") {
                vcp = '<td id="tdCP" class="script_rate">' + row.CallPut + '</td>'
            }
            else { vcp = '<td id="tdCP" class="script_rate"></td>' }


            if (parseFloat(row.Strike) > 0) {
                if (instru == "CURR") {
                    vstrike = '<td id="tdStrike" class="netposition-3">' + parseFloat(row.Strike).toFixed(4) + '<br>' + row.CallPut + '</td>'
                }
                else {
                    vstrike = '<td id="tdStrike" class="netposition-3">' + parseFloat(row.Strike).toFixed(2) + '<br>' + row.CallPut + '</td>'
                }
            }
            else {
                vstrike = '<td id="tdStrike" class="netposition-3"></td>'
            }
            var exchangeval = '';
            if (row.Exchange == 1) {
                exchangeval = 'NSE'
            }
            else {
                exchangeval = 'BSE'
            }
            strDisplay = $.trim(row.Script + ' ' + (row.OrderType == "" ? '' : row.OrderType) + '-' + (exchangeval == "" ? '' : exchangeval) + ' ' + (row.Expiry));

            if (row.nCNCMIS == 0) {
                var CNCMIS = "CNC / NORMAL"
            }
            else {
                var CNCMIS = "MIS"
            }
            if (row.NetQty > 0) {
                totNetavg = parseFloat(totNetavg) + parseFloat(row.BuyValue - row.SellValue).toFixed(2) / row.NetQty;
            }
            else if (row.NetQty < 0) {
                totNetavg = parseFloat(totNetavg) + parseFloat(row.SellValue - row.BuyValue).toFixed(2) / Math.abs(parseFloat(row.NetQty));
            }
            if (row.Exchange == 1) {
                var Exchange = "NSE";
            }
            else {
                var Exchange = "BSE";
            }

            totalNA.push({
                TotalNetAverage: totNetavg
            });

            $("#todaypl").html(NetM2M);
            OrderPosition.push({
                ClientCode: row.UserCode,
                MISCNC: CNCMIS,
                Scrip: strDisplay,
                BuyQty: buyqty,
                BuyAvg: buyavg,
                BuyVal: buyval,
                SellQty: sellqty,
                SellAvg: sellavg,
                SellVal: sellval,
                NetQty: netqty,
                Netavg: Netavg,
                Netval: netval,
                LTP: currrate,
                MTOM: NetM2M,
                //Netavg: $("<div/>").html(Netavg).text(),
                //LTP: $("<div/>").html(currrate).text(),
                //MTOM: $("<div/>").html(NetM2M).text() ,
                Exchange: Exchange,
                Token: row.Token,
                ExchangeBroadcastConstant: row.ExchangeBroadcastConstant,
                Script: row.Script,
                Expiry: row.Expiry,
                Strike: row.Strike,
                OrderType: row.OrderType

            });

            totbuyqty = (parseFloat(totbuyqty) + parseFloat(row.BuyQty));
            totbuyval = (parseFloat(totbuyval) + parseFloat(row.BuyValue)).toFixed(2);

            totsellqty = (parseFloat(totsellqty) + parseFloat(row.SellQty));
            totsellval = (parseFloat(totsellval) + parseFloat(row.SellValue)).toFixed(2);

            totNetqty = (parseFloat(totNetqty) + parseFloat(row.NetQty));
            totNetval = (parseFloat(totNetval) + parseFloat(row.NetValue)).toFixed(2);

            totalbuy.push({
                TotalBuyQty: totbuyqty,
                TotalBuyVal: totbuyval
            });

            totalsell.push({
                TotalSellQty: totsellqty,
                TotalSellVal: totsellval
            });

            totalNAqty.push({
                TotalNetQty: totNetqty,
                TotalNetVal: totNetval
            });

            //totNetval = parseFloat(totNetval) + parseFloat(row.NetValue);
            sScripts = sScripts + row.ExchangeBroadcastConstant + '.' + row.Token + ','
            if (blnBroadCastFlag == true) {
                CloseSocket();//Close and open
            }
            var lblScript = "lblScripts2";

            $('#lblScripts2').html(sScripts.substring(0, sScripts.length - 1));
            //$('#lblScripts2').html($('#lblScripts2').html() + "," + "17.999908,17.999988,5.1");
            $('#lblScripts2').html($('#lblScripts2').html());
            tokens.push(row.Token);
            reconnectSocketAndSendTokensNP(lblScript);
            
        })
    }

    $("#NetPositionGrid").kendoGrid({
        dataSource: {
            //transport: {
                //read: {
                    //url: "https://demos.telerik.com/kendo-ui/service/Products",
                    //dataType: "jsonp"
                    data: OrderPosition,
                    pageSize: 15,
               // }
//},            
            schema: {
                model: {
                    id: "ClientCode",
                    template: "#= ClientCode #",
                }
            }
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
        change: onChange,
        toolbar: ["search", "excel", "pdf"],
        filterable: {
            mode: "row"
        },
        columns: [
                   {
                       selectable: true,
                       width: "50px"
                   },
                   {
                       title: "UCC",
                       field: "ClientCode",
                       width: 80
                       
                   },
                   {
                       title: "MIS/CNC", 
                       field: "MISCNC",
                       width: 100
                   },
                   {
                       title: "Scrip", 
                       field: "Scrip",
                       width: 100,
                       footerTemplate: "Total: "
                   },
                   {
                       title: "Buy Qty",
                       field: "BuyQty",
                       width: 95,
                       footerTemplate: "#=getTotalBuyQty()#"
                   },
                   {
                       title: "Buy Avg",
                       field: "BuyAvg",
                       width: 100
                       //footerTemplate: "Total: #=getTotalNetQty()#"
                   },
                   {
                       title: "Buy Value",
                       field: "BuyVal",
                       width: 100,
                       footerTemplate: "#=getTotalBuyVal()#"
                   },
                   {
                       title: "Sell Qty",
                       field: "SellQty",
                       width: 90,
                       footerTemplate: "#=getTotalSellQty()#"
                   },
                   {
                       title: "Sell Avg",
                       field: "SellAvg",
                       width: 100
                       //footerTemplate: "Total: #=getTotalNetQty()#"
                   },
                   {
                       title: "Sell Value",
                       field: "SellVal",
                       width: 100,
                       footerTemplate: "#=getTotalSellVal()#"
                   },
                   {
                       title: "Net Qty",
                       field: "NetQty",
                       template: "#= NetQty #",
                       width: 100,
                       footerTemplate: "#=getTotalNetQty()#"
                   },
                   {
                       title: "Net avg", 
                       field: "Netavg",
                       template: "#= Netavg #",
                       footerTemplate: "#=getTotalNetAvg()#"
                   },
                   
                   {
                       title: "Net Val", 
                       field: "Netval",
                       width: 100,
                       template: "#= Netval #",
                       footerTemplate: "#=getTotalNetVal()#"
                   },
                   {
                       title: "LTP",
                       field: "LTP",
                       template: "#= LTP #"
                   },
                   {
                       title: "M2M",
                       field: "MTOM",
                       template: "#= MTOM #"
                   },
                   {
                       title: "Exchange",
                       field: "Exchange",
                       hidden: "true"
                   },
                   {
                       title: "Token",
                       field: "Token",
                       hidden:"true"
                   },
                   {
                       title: "ExchangeBroadcastConstant",
                       field: "ExchangeBroadcastConstant",
                       hidden:"true"
                   },
                   {
                       title: "Script",
                       field: "Script",
                       hidden:"true"
                   },
                   {
                       title: "Expiry",
                       field: "Expiry",
                       hidden:"true"
                   },
                   {
                       title: "Strike",
                       field: "Strike",
                       hidden: "true"
                   },
                   {
                       title: "OrderType",
                       field: "OrderType",
                       hidden:"true"
                   }
        ],
        save: function (e) {
            setTimeout(function () { $("#footerPlaceholder").text(getTotalNetAvg()); });
            setTimeout(function () { $("#footerPlaceholder1").text(getTotalNetQty()); });
            setTimeout(function () { $("#footerPlaceholder2").text(getTotalNetVal()); });
        }
    });

}

$("#btnRefresh").click(function () {
    PositionData();
})

$("#drpMarketSelection").change(function () {
    var marketsegment = $("#drpMarketSelection").val();
    var strdtrange = "";
    if ($('#dtrange').val() == 2) {
        strdtrange = 'Only Today';
    } else if ($('#dtrange').val() == 1) {
        strdtrange = 'Till Today';
    }
    GetNetPositionReport(marketsegment, strdtrange);
})
$("#dtrange").change(function () {
    var marketsegment = $("#drpMarketSelection").val();
    var strdtrange = "";
    if ($('#dtrange').val() == 2) {
        strdtrange = 'Only Today';
    } else if ($('#dtrange').val() == 1) {
        strdtrange = 'Till Today';
    }
    GetNetPositionReport(marketsegment, strdtrange);
})
function onChange() {
    items = [];
    var grid = $("#NetPositionGrid").data("kendoGrid");

    var sel = $("input:checked", grid.tbody).closest("tr");


    $.each(sel, function (idx, row) {
        var item = grid.dataItem(row);
        items.push({
            ClientCode: item.ClientCode,
            LTP: item.LTP,
            MISCNC: item.MISCNC,
            NetQty: item.NetQty,
            Scrip: item.Scrip,
            Script: item.Script,
            Token: item.Token,
            Exchange: item.Exchange,
            OrderType: item.OrderType
        });
    });
   // alert("selected: " + JSON.stringify(items));
}

$("#btnsqoff").click(function () {
    KendoWindow("sqoffpopup", 900, 380, "Are you sure want to Square off following Scrips ?", 0);
    $("#sqoffpopup").closest(".k-window").css({
        top: 190,
        left: 285
    });

    $("#sqallgrid").kendoGrid({
        dataSource: {
            data: items,
        },
        columns: [
            {
                title: "UCC",
                field: "ClientCode",
                width: 100,

            },
            {
                title: "MIS/CNC",
                field: "MISCNC",
                width: 100
            },
            {
                title: "Scrip",
                field: "Scrip",
                width: 100
            },
            {
                title: "Net Qty",
                field: "NetQty",
                template: "#= NetQty #",
                width: 100
            }
        ]
    });
});

function sqALLCancel()
{
    $("#sqoffpopup").data("kendoWindow").close();
}

function btnSqALL() {
    //console.log(items);
    $.each(items, function (i, val) {
        var clientcode = val.ClientCode;
        var MISCNC = val.MISCNC;
        var NetQty = val.NetQty;
        var script = val.Script;
        var Token = val.Token;
        var Exchange = val.Exchange;
        var OrderType = val.OrderType;
        var instrumentindex = GetInstrument(OrderType)

        if (NetQty == "0") {
            alert("You have no position in this scrip.");
            return false;
            
        }
        if (NetQty < 0) {
            buysell = "BUY";
        }
        else {
            buysell = "SELL";
        }

        if (buysell == "BUY")
        {
            bs = 1;
        } else
        {
            bs = 2;
        }

        if (MISCNC == "CNC / NORMAL")
        {
           var cncmis = "0";
        }
        else if (MISCNC == "MIS")
        {
          var  cncmis = "1";
        }

        SaveRecordSqOffALL(script, Token, bs, Math.abs(NetQty), instrumentindex, cncmis, Exchange)

    });
}

function SaveRecordSqOffALL(sScript, nToken, nBuysell, NetQty, nstocktype, cncmis, ExchangeID) { //Modified by PSN on 29/05/2018
    var empclientid = '';
    var sqAllMessage = "";
            if (gblCTCLtype.toString().toLocaleLowerCase() == "ba" || gblCTCLtype.toString().toLocaleLowerCase() == "emp") {
        empclientid = $("#cmbClients").val();
        Source = "C";
    } else {
        empclientid = gblnUserId;
        Source = "W";
    }

    var sScript = sScript;
    var Token = nToken;
    var BuySell = nBuysell;
    var TotalQty = NetQty;
    var nExchangeID = ExchangeID;
    var Price = 0;
    var StockType = nstocktype;
    var Expiry = '';
    var CP = '';
    var Strike = 0;
    var OrderType = 11;
    var TriggerPrice = 0;
    var DQ = 0;
    var MarketPrice = 0;
    var successstring = '';
    var buysellstring = '';
    var CncMis;//
    CncMis = cncmis;
    if (StockType == 2 || StockType == 5 || StockType == 7) {

        Expiry = $("#expirydate").text();
        Strike = parseFloat($("#optStrike").text());
        CP = $("#optCallPut").text();
    }

    if (StockType == 1 || StockType === 4 || StockType == 6) {
        Expiry = $("#expirydate").text();
    }

    if (StockType == 3) {
        Expiry = '';
        Strike = 0;
        CP = '';
    }

    if ($('#Day').is(':checked')) {
        DayIoc = 1
    }
    else {
        DayIoc = 0
    }

    var NewOrderParams = JSON.stringify({
        'userId': empclientid,
        'sScript': sScript,
        'Token': Token,
        'BuySell': BuySell,
        'TotalQty': TotalQty,
        'Price': Price,
        'StockType': StockType,
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
        'ExchangeId': ExchangeID,
        'CTCLId': gblCTCLid
    });
    $.ajax({
        url: gblurl + "OrderV5/",
        type: 'POST',
        contentType: 'application/json',
        data: NewOrderParams,
        dataType: "json",
        async: false,
        complete: function (data, status, xhr) {
            if (JSON.parse(data.responseText).ResultStatus == 1) {
                if (sqAllMessage == '') {
                    sqAllMessage = sqAllMessage + ' ' + sScript + " " + JSON.parse(data.responseText).Result;
                }
                else {
                    sqAllMessage = sqAllMessage + '\n' + sScript + " " + JSON.parse(data.responseText).Result;
                }
            }
            else if (JSON.parse(data.responseText).ResultStatus == 3) {
                //$('#OrderResult').html("Order Request Created with ID : " + JSON.parse(data.responseText).Result.Id);
                //$('#myModalnt').modal('show');
                if (sqAllMessage == '') {
                    sqAllMessage = sqAllMessage + ' ' + sScript + " Order Request Created with ID : " + JSON.parse(data.responseText).Result.Id;
                }
                else {
                    sqAllMessage = sqAllMessage + '\n' + sScript + " Order Request Created with ID : " + JSON.parse(data.responseText).Result.Id;
                }
                
            }
            else {
                //vpg 10032018 for any error to show  [hitesh told]
                //$('#modrmsvalidation').modal('show');
                //$('#displayrms').html("" + JSON.parse(data.responseText).Result);
                if (sqAllMessage == '') {
                    sqAllMessage = sqAllMessage + ' ' + sScript + " " + JSON.parse(data.responseText).Result;
                }
                else {
                    sqAllMessage = sqAllMessage + '\n' + sScript + " " + JSON.parse(data.responseText).Result;
                }
            }
            alert(sqAllMessage)
        },
        error: function () {
            console.log('there is some error');

        },

    });
}

