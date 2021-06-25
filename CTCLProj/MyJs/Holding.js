var HoldingColumns = [];
var topicName1;
var nExchangeId1 = 1;
var instrumentindex = 0;

$(document).ready(function () {

});

$("#HVClick").click(function () {
    var ClientCode = $("#txtSelectedClient").val().split('-')[0].trim();
    getHolding(3, ClientCode, 1, 0)
})

function getHolding(nAction, sUserID, nPageIndex, nAccountSegment) {
    var nrow = 0;
    $.ajax({
        url: "https://ctcl.investmentz.com/iCtclService/api/AccoutingV1/",
        method: "get",
        data: {
            nAction: nAction,
            sUserid: sUserID,
            nPageIndex: nPageIndex,
            AccountSegment: nAccountSegment
        },
        dataType: "json",
        success: function (data) {
            //console.log(data);
            HoldingColumns = [];
            var ISIN = "";
            var ScripName = "";
            var YesterDayPrice = "";
            var Quantity = "";
            var Valuation = "";
            var PoolQty = "";
            var DematQty = "";
            var currrate;
            var sScripts = "";
            var ScripName = "";
            var tempinst = "";
            var ProfLoss = 0;
            var ProfLossPerc = 0;
            var BuyingValue = 0;
            var CurrentValue = 0;

            if (data.ResultStatus == 3) {
                if (data.Result == "No Data Found") {
                    HoldingColumns = [];
                } else {
                    var record = 0;

                    $.each(data.Result.Result, function (i, row) {

                        if (row.nBroadCastContants == 12 || row.nBroadCastContants == 13) {
                            currrate = '<span><strong class= "' + row.nBroadCastContants + '_' + row.nToken + '_LR">0.0000</strong></span>';
                            CurrentValue = '<span><strong id= "">' + parseFloat(currrate) * parseFloat(row.nQty); +'</strong></span>';
                        }
                        else {
                            currrate = '<span><strong class= "' + row.nBroadCastContants + '_' + row.nToken + '_LR">0.00</strong></span>';
                            CurrentValue = '<span><strong id= "">' + parseFloat(currrate) * parseFloat(row.nQty); +'</strong></span>';
                        }

                        ScripName = 'EQ -' + 'NSE ' + row.sScript;

                        sScripts = sScripts.concat(row.nBroadCastContants + '.' + row.nToken + ',');


                        BuyingValue = parseFloat(row.nBuyAvg).toFixed(2) * parseFloat(row.nQty).toFixed(2);
                        //
                        //ProfLoss = parseFloat(CurrentValue) - parseFloat(BuyingValue);
                        //ProfLossPerc = (parseFloat(ProfLoss) / parseFloat(BuyingValue)) * 100;

                        //alert(BuyingValue);
                        //alert(CurrentValue);
                        //alert(ProfLoss);
                        //alert(ProfLossPerc);

                        var lblScript = "lblHoldingScripts";
                        var token = "tokens2"

                        $('#lblHoldingScripts').html(sScripts.substring(0, sScripts.length - 1));
                        $('#lblHoldingScripts').html($('#lblHoldingScripts').html() + "," + "17.999908,17.999988,5.1")
                        tokens.push(row.nToken);

                        reconnectSocketAndSendTokens(lblScript);
                        //return false;

                        HoldingColumns.push({
                            LTPH: currrate,
                            ISIN: row.sISINNumber,
                            ScripName: ScripName,
                            Quantity: row.nQty,
                            BuyAvg: row.nBuyAvg,
                            PoolQty: row.nPoolQty,
                            DematQty: row.nDematQty,
                            BroadCastConstant: row.nBroadCastContants,
                            ExchangId: row.nExchangeId,
                            ScriptId: row.nScriptId,
                            PriceStatus: row.sPriceStatus,
                            MarketWatchId: row.nMktWatchId,
                            Instrument: row.sInstrument,
                            Strike: row.nStrike,
                            CP: row.sCP,
                            Token: row.nToken,
                            BuyVal: parseFloat(BuyingValue).toFixed(2),
                            Curr: CurrentValue,
                            PL: ProfLoss,
                            PLPer: ProfLossPerc
                        });


                    });



                    $("#HoldingValuation").kendoGrid({
                        dataSource: {
                            data: HoldingColumns
                        },
                        filterable: {
                            multi: true,
                            search: true
                        },
                        height: 272,
                        navigatable: true,
                        selectable: 'row',
                        scrollable: true,
                        sortable: true,
                        resizable: true,
                        reorderable: true,
                        columnMenu: true,
                        columnShow: function (e) {
                        },
                        toolbar: ["search", { name: 'excel', text: 'Excel' }, { name: 'pdf', text: 'PDF' }],
                        excel: {
                            fileName: "Holding Details.xlsx",
                            proxyURL: "https://demos.telerik.com/kendo-ui/service/export",
                            filterable: true
                        },
                        pdf: {
                            fileName: "Holding Details.pdf",
                            allPages: true
                        },
                        columns: [
                            {
                                field: "",
                                width: 80,
                                title: "",
                                template: '<button class="k-button" style="min-width: 30px; background-color:Green;" ' +
                                    ' id="#= BroadCastConstant #_#= Token #_buy" title="Buy" ' +
                                    ' data-buysell="1" data-exchangeid = "#= ExchangId #"' +
                                    ' data-script-id = "#= ScriptId #"' +
                                    ' data-priceStatus  = "#= PriceStatus #"' +
                                    ' data-marketwatch-id  = "#= MarketWatchId #"' +
                                    ' data-instrument = "#= Instrument #"' +
                                    ' data-strike = "#= Strike #"' +
                                    ' data-cp = "#= CP #"' +
                                    ' data-token = "#= Token #"' +
                                    ' data-exchangeconstants = "#= BroadCastConstant #"' +
                                    ' data-script = "#= ScripName #" onclick="buysellwindow1(this)">' +
                                    'ADD' +
                                    '</button>' +
                                    '<button class="k-button" style="min-width: 30px; background-color:red;" ' +
                                    ' id="#= BroadCastConstant #_#= Token #_sell" title="Buy" ' +
                                    ' data-buysell="2" data-exchangeid = "#= ExchangId #"' +
                                    ' data-script-id = "#= ScriptId #"' +
                                    ' data-priceStatus  = "#= PriceStatus #"' +
                                    ' data-marketwatch-id  = "#= MarketWatchId #"' +
                                    ' data-instrument = "#= Instrument #"' +
                                    ' data-strike = "#= Strike #"' +
                                    ' data-cp = "#= CP #"' +
                                    ' data-token = "#= Token #"' +
                                    ' data-exchangeconstants = "#= BroadCastConstant #"' +
                                    ' data-script = "#= ScripName #" onclick="buysellwindow1(this)">' +
                                    'SELL' +
                                    '</button>',
                                attributes: {
                                    "class": "holdText"
                                }
                            },
                            {
                                title: "Scrip",
                                width: 100,
                                field: "ScripName",
                                template: "#= ScripName #",
                                attributes: {
                                    "class": "holdText"
                                }
                            },
                            {
                                title: "ISIN",
                                width: 70,
                                field: "ISIN",
                                template: "#= ISIN #",
                                attributes: {
                                    "class": "holdText"
                                }
                            },
                            {
                                title: "Quantity",
                                width: 60,
                                field: "Quantity",
                                template: "#= Quantity #",
                                attributes: {
                                    "class": "holdText"
                                }
                            },
                            {
                                title: "Demat Quantity",
                                width: 80,
                                field: "DematQty",
                                template: "#= DematQty #",
                                attributes: {
                                    "class": "holdText"
                                }
                            },
                            {
                                title: "Pool Quantity",
                                width: 70,
                                field: "PoolQty",
                                template: "#= PoolQty #",
                                attributes: {
                                    "class": "holdText"
                                }
                            },
                            {
                                title: "Buy.Avg",
                                width: 60,
                                field: "BuyAvg",
                                template: "#= BuyAvg #",
                                attributes: {
                                    "class": "holdText"
                                }
                            },
                            {
                                title: "LTP",
                                width: 60,
                                field: "LTPH",
                                template: "#= LTPH #",
                                attributes: {
                                    "class": "holdText"
                                }
                            },
                            {
                                title: "Buy Value",
                                width: 60,
                                field: "BuyVal",
                                template: "#= BuyVal #",
                                attributes: {
                                    "class": "holdText"
                                }
                            },
                            {
                                title: "Current Value",
                                width: 60,
                                field: "CurVal",
                                template: "#= 0 #",
                                attributes: {
                                    "class": "holdText"
                                }
                            },
                            {
                                title: "P/L",
                                width: 80,
                                field: "PL",
                                template: "#= 0 #",
                                attributes: {
                                    "class": "holdText"
                                }
                            },
                            {
                                title: "P/L(%)",
                                width: 80,
                                field: "PLPer",
                                template: "#= 0 #",
                                attributes: {
                                    "class": "holdText"
                                }
                            }
                        ],
                        dataBound: function () {
                            var rows = this.items();
                            $(rows).each(function () {
                                var index = $(this).index() + 1;
                                var rowLabel = $(this).find(".row-number");
                                $(rowLabel).html(index);
                            });
                        }

                    })
                }


            } else {

            }
        },
        error: function (data) {

        }
    });
}

$('input[type=radio][name=switch]').change(function () {
    if (this.value == 'buy') {
        document.querySelector('#btntrade').innerHTML = 'BUY';
        $("#btntrade").css("background-color", "#4987ee");
        localStorage.setItem("BuySell", "Buy");
    }
    else if (this.value == 'sell') {
        document.querySelector('#btntrade').innerHTML = 'SELL';
        $("#btntrade").css("background-color", "#ca2222");
        localStorage.setItem("BuySell", "Sell");
    }
});

function buysellwindow1(data) {

    if (data.dataset.buysell == 1) {
        $("#radio-one").prop("checked", true);
        document.querySelector('#btntrade').innerHTML = 'BUY';
        $("#btntrade").css("background-color", "#4987ee");
        localStorage.setItem("BuySell", "Buy");

    } else if (data.dataset.buysell == 2) {
        $("#radio-two").prop("checked", true);
        document.querySelector('#btntrade').innerHTML = 'SELL';
        $("#btntrade").css("background-color", "#ca2222");
        localStorage.setItem("BuySell", "Sell");
    }



    GetBcastUrl(6);

    if ($("#Exchange").attr("src") == "../img/dis-1.png") {
        alert('Due to techical reason you cannot place order now, try after sometime')
        return;
    }

    $('#btntrade').prop("disabled", false);

    $("#Iratechange").attr('data-symbol', data.dataset.exchangeconstants + '_' + data.dataset.token);

    var ltpid = data.dataset.exchangeconstants + '_' + data.dataset.token;
    var pricechangeid = data.dataset.exchangeconstants + '_' + data.dataset.token;
    topicName1 = data.dataset.exchangeconstants + '.' + data.dataset.token;

    DayClick();

    $("#txtqty").val('');
    $("#txtorderprice").val('');
    $("#txttrigprice").val('');
    $("#txtdisclosedqty").val('');

    var buySell = "";

    if (data.dataset.buysell == 1) {
        buySell = "Buy";
    } else if (data.dataset.buysell == 2) {
        buySell = "Sell";
    }

    $("#sellbuy").text(buySell);
    $("#scriptname").text(data.dataset.script);
    $('#scriptname').data('token', data.dataset.token);
    $('#scriptname').attr('data-buysell', data.dataset.buysell);
    $('#scriptname').data('ExchangeID', data.dataset.exchangeid);

    if (GetInstrument(data.dataset.instrument) == 3) {
        var sScript = $("#scriptname").html();
        GetHolding(sScript);
    }

    nExchangeId1 = data.dataset.exchangeid;

    if (nExchangeId == 2) {
        $('#Select2').val('BSE');
    }
    else {
        $('#Select2').val('NSE');
    }

    var ExchangeName = GetExchangeType(nExchangeId);
    instrumentindex = GetInstrument(data.dataset.instrument);
    $('#markettype').data('stocktype', instrumentindex);

    $("#expDate").hide();
    $("#sPrice").hide();
    $("#nOption").hide();

    var segmentindex = GetStringInstrumentForDisplay(instrumentindex);

    $('#segmenttype').html((ExchangeName) + ',' + segmentindex);

    $('#segmenttype').attr("data-segement", segmentindex);

    $("#txtdisclosedqty").val('0');


    if (segmentindex == 'CURR') {
        $("#txtorderprice").attr("step", tickpriceCurrency);
        $("#txtorderprice").attr("min", tickpriceCurrency);
        $("#txtorderprice").val(parseFloat($('#' + ltpid + '_LRH').text()).toFixed(4));

        $("#ltp").text(parseFloat($('#' + ltpid + '_LRH').text()).toFixed(4));
        $("#txttrigprice").attr("step", tickpriceCurrency);
        $("#txttrigprice").attr("min", tickpriceCurrency);

    }
    else {
        $("#txtorderprice").attr("step", tickprice);
        $("#txtorderprice").attr("min", tickprice);
        $("#txtorderprice").val(parseFloat($('#' + ltpid + '_LRH').text()).toFixed(2));

        $("#ltp").text(parseFloat($('#' + ltpid + '_LRH').text()).toFixed(2));
        $("#txtorderprice").val(parseFloat($('#' + ltpid + '_LRH').text()).toFixed(2));
    }

    $("#txtorderprice").attr("data-price", parseFloat($('#' + ltpid + '_LRH').text()).toFixed(4));

    $("#cmbSegment1").val(GetInstrument(data.dataset.instrument));

    VarMargin1(nExchangeId, data.dataset.token, GetInstrument(data.dataset.instrument));

    if (GetInstrument(data.dataset.instrument) == 1 || GetInstrument(data.dataset.instrument) == 2 || GetInstrument(data.dataset.instrument) == 4 || GetInstrument(data.dataset.instrument) == 5) {

        var nToken = $("#scriptname").data("token");
        var CNCMIS = 0;
        GetNetPositionforFO(nToken, CNCMIS);
    }

    ShowHide();

    KendoWindow("windowbuysell", 650, 490, "", 0);

    $("#windowbuysell").closest(".k-window").css({
        top: 250,
        left: 200
    });

    $('#mis').removeAttr("checked");
    $('#cnc').prop("checked", "checked");

    $("#txtqty").attr("data-qty", "1");
    $("#txtqty").attr("data-lotsize", "1");
    $("#txtqty").attr("data-oldvalue", "1");
    $("#txtqty").attr("min", "1");
    $("#lotsize").html('1');

    if (instrumentindex != 3) {

    }
    else {
        $("#txtqty").attr("step", 1);
        $("#txtqty").val("1");
        $("#lotsize").html('1');
    }

    getLotSize(data.dataset.token, instrumentindex);

    if ($('input[name="oType"]:checked').val() == 1 || $('input[name="oType"]:checked').val() == 11) {
        document.getElementById('Ioc').disabled = false;
        document.getElementById('txttrigprice').disabled = true;

        if ($('#Ioc').attr('Checked') == true) {
            if ($('#segmenttype').attr("data-segement") == "FUTURE" || $('#segmenttype').attr("data-segement") == "OPTION") {
                $("#trtxtdisclosedqty").invisible = true;
                $("#txtdisclosedqty").val('');
                document.getElementById('txtdisclosedqty').disabled = true;
            }
            else {
                $("#trtxtdisclosedqty").visible = true;
                document.getElementById('txtdisclosedqty').disabled = false;
            }
        } else {
            $("#trtxtdisclosedqty").visible = true;
            document.getElementById('txtdisclosedqty').disabled = false;
        }
    } else if ($('input[name="oType"]:checked').val() == 3 || $('input[name="oType"]:checked').val() == 12) {
        document.getElementById('Ioc').disabled = true;
        document.getElementById('txttrigprice').disabled = false;
        if ($('input[name="oType"]:checked').val() == 12) {
            $("#trtxtdisclosedqty").invisible = true;
            $("#txtdisclosedqty").val('');
            document.getElementById('txtdisclosedqty').disabled = true;
        }

        document.getElementById('txtdisclosedqty').disabled = true;
    }

    localStorage.setItem("buysell", data.dataset.buysell);

    if (GetInstrument(data.dataset.instrument) == 3) {
        var nToken = $("#scriptname").data("token");
        var nCncMis = 0;
        if ($("#cnc").is(":checked")) {
            nCncMis = 0;
        } else if ($("#mis").is(":checked")) {
            nCncMis = 1;
        }
        //var Exchange = $("#Select2").val();
        var Exchange = "NSE";
        var nOrderAmt = $("#txtorderprice").val();

        sinstrument = GetInstrument(data.dataset.instrument);

        var nqty = $("#txtqty").val();

        var segment = $("#cmbSegment1").val();
        var buyorsell = data.dataset.buysell;

        GetRequiredStockMargin(nCncMis, nToken, Exchange, nOrderAmt, buyorsell, nqty, segment);

    }
}

function DayClick() {
    $("#Day").prop("checked", true);
    document.getElementById('txtdisclosedqty').disabled = true;
    $('#txtdisclosedqty').val("");
}


function ShowHide() {

    var StockType = $("#markettype").data("stocktype")

    if (StockType == 2 || StockType == 5 || StockType == 7) { //option

        $("#expDate").show();
        $("#sPrice").show();
        $("#nOption").show();
    }
    if (StockType == 1 || StockType === 4 || StockType == 6) { //future
        $("#expDate").show();
        $("#sPrice").hide();
        $("#nOption").hide();
    }

    if (StockType == 3 || StockType == 8 || StockType == 9) { //cash
        $("#expDate").hide();
        $("#sPrice").hide();
        $("#nOption").hide();
    }
}