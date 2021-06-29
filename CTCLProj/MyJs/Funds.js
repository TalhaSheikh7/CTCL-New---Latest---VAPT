
var HeaderColumns = [];
var TrancationColumn = [];
var HoldingDataColumns = [];

$(document).ready(function () {



    
});
$("#FClick").click(function () {
    var ClientCode = $("#txtSelectedClient").val().split('-')[0].trim();
    //var ClientCode = 5014669;
    GetHoldingDetails(3, ClientCode, 1, 0);
    GetAccountDetails(ClientCode, 8, 1, 0);
    GetHeaderDetails(ClientCode, 10, 1, 0);
    GetOthertDetails(ClientCode, 9, 1, 0);
    GetRunLedTransDetails(ClientCode, 11, 1, 0);
})
function Backoffice() {

    $.ajax({
        method: "POST",
        url: "https://ctcluat.investmentz.com/Home/Old_GoToBackReport",
        data: {},
        success: function (data) {
            debugger;
            //console.log(data)
            // window.open('https://web.investmentz.com/BackOfficeReport/?LoginId=ACM5046&SessionId=5badbe41-7193-4ca9-91af-1574a9761c99&Bacode=RC115', '_blank');
            window.open('https://web.investmentz.com/BackOfficeReport/?LoginId=' + data[0] + '&SessionId=' + data[1] + '&Bacode=RC115', '_blank');
            //window.open('http://localhost/BackOfficeReport/?LoginId=' + data[0] + '&SessionId=' + data[1] + '&Bacode=RC115', '_blank');
        },
        error: function (data) {

        }
    });
}

function GetHoldingDetails(nAction, sUserID, nPageIndex, nAccountSegment)
{
    var valuation = 0;
    HoldingDataColumns = [];
    kendo.ui.progress($("#holdingData"), true);
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
            
            $("#curHolding").html(Intl.NumberFormat('en-IN').format(parseFloat(valuation).toFixed(2)))
            if (data.ResultStatus != 3) {
                
            } else {
                if (data.Result != "No Data Found") {
                    valuation = data.Result.Result[0].nClosingValuationCumalative;
                    $("#curHolding").html(Intl.NumberFormat('en-IN').format(parseFloat(valuation).toFixed(2)));

                    HoldingDataColumns = [];
                    var ISIN = "";
                    var ScripName = "";
                    var YesterDayPrice = "";
                    var Quantity = "";
                    var Valuation = "";
                    var PoolQty = "";
                    var DematQty = "";
                    var currrate;
                    var sScripts = "";
                    var record = 0;

                    $.each(data.Result.Result, function (i, row) {
                        HoldingDataColumns.push({
                            ISIN: row.sISINNumber,
                            ScripName: row.sScript,
                            YesterDayPrice: row.nClosingRate,
                            Quantity: row.nQty,
                            Valuation: row.nClosingValuation,
                            PoolQty: row.nPoolQty,
                            DematQty: row.nDematQty,
                        });
                        //reconnectSocketAndSendTokens(lblScript, token);
                    });
                } else {
                    HoldingDataColumns = [];
                }
             }
                $("#holdingData").kendoGrid({
                        dataSource: {
                            data: HoldingDataColumns
                        },
                        filterable: {
                            multi: true,
                            search: true
                        },
                        height: 320,
                        navigatable: true,
                        selectable: 'row',
                        scrollable: true,
                        sortable: true,
                        resizable: true,
                        reorderable: true,
                        columnMenu: true,
                        noRecords: true,
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
                                title: "Scrip Name",
                                width: 60,
                                field: "ScripName",
                                template: "#= ScripName #",
                                attributes: {
                                    "class": "holdText"
                                }
                            },
                            {
                                title: "ISIN No.",
                                width: 60,
                                field: "ISIN",
                                template: "#= ISIN #",
                                attributes: {
                                    "class": "holdText"
                                }
                            },
                            {
                                title: "Yesterday Price (BSE)",
                                width: 90,
                                field: "YesterDayPrice",
                                template: "#= YesterDayPrice #",
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
                                title: "Valuation",
                                width: 50,
                                field: "Valuation",
                                template: "#= Valuation #",
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
                                title: "Demat Quantity",
                                width: 70,
                                field: "DematQty",
                                template: "#= DematQty #",
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

                    });
                kendo.ui.progress($("#holdingData"), false);
        },
        error: function (data) {

        }
    });
}

function GetAccountDetails(sUserID, nAction, nPageIndex, nAccountSegment) {
    $.ajax({
        url: gblurl + "AccoutingV1/",
        method: "get",
        data: {
            nAction: nAction,
            sUserId: sUserID,
            nPageIndex: nPageIndex,
            AccountSegment: nAccountSegment
        },
        datatype: "json",
        success: function (data) {
            //console.log(data);
            var opening;
            var collat;
            var intraday;
            var holding;
            var margin;
            var mannual;
            var additional;

            $.each(data.Result.Result, function (key, value) {

                if (value.HeaderName == "Op. Ledger Balance") {
                    $("#balance").html(Intl.NumberFormat('en-IN').format(parseFloat(value.TradingOpening).toFixed(2)));
                    $("#opening").html(Intl.NumberFormat('en-IN').format(parseFloat(value.TradingOpening).toFixed(2)));

                    opening = Intl.NumberFormat('en-IN').format(parseFloat(value.TradingOpening).toFixed(2));
                }
                else if (value.HeaderName == "Collateral Stock Value") {
                    $("#collat").html(Intl.NumberFormat('en-IN').format(parseFloat(value.TradingOpening).toFixed(2)));

                    collat = Intl.NumberFormat('en-IN').format(parseFloat(value.TradingOpening).toFixed(2));
                }
                else if (value.HeaderName == "Intraday Payin") {
                    $("#payin").html(Intl.NumberFormat('en-IN').format(parseFloat(value.TradingOpening).toFixed(2)));

                    intraday = Intl.NumberFormat('en-IN').format(parseFloat(value.TradingOpening).toFixed(2));
                }
                else if (value.HeaderName == "Holding Sell Valuation") {
                    $("#holselval").html(Intl.NumberFormat('en-IN').format(parseFloat(value.TradingOpening).toFixed(2)));

                    holding = Intl.NumberFormat('en-IN').format(parseFloat(value.TradingOpening).toFixed(2));
                }
                else if (value.HeaderName == "Margin Release Valuation") {
                    $("#margin").html(Intl.NumberFormat('en-IN').format(parseFloat(value.TradingOpening).toFixed(2)));

                    margin = Intl.NumberFormat('en-IN').format(parseFloat(value.TradingOpening).toFixed(2));
                }
                else if (value.HeaderName == "Manual Admin Limit") {
                    $("#mannnual").html(Intl.NumberFormat('en-IN').format(parseFloat(value.TradingOpening).toFixed(2)));

                    mannual = Intl.NumberFormat('en-IN').format(parseFloat(value.TradingOpening).toFixed(2))
                }
                else if (value.HeaderName == "Additional Limit") {
                    $("#Addlimit").html(Intl.NumberFormat('en-IN').format(parseFloat(value.TradingOpening).toFixed(2)));

                    additional = Intl.NumberFormat('en-IN').format(parseFloat(value.TradingOpening).toFixed(2));
                }
                //parseFloat(additional.replace(/,/g, ''))

            });
            

            var total = parseFloat(opening.replace(/,/g, '')) + parseFloat(collat.replace(/,/g, '')) + parseFloat(intraday.replace(/,/g, '')) + parseFloat(holding.replace(/,/g, '')) + parseFloat(margin.replace(/,/g, '')) + parseFloat(mannual.replace(/,/g, '')) + parseFloat(additional.replace(/,/g, ''));

            total = total.toFixed(2);
            //alert(total);
            $("#totalBalance").html(Intl.NumberFormat('en-IN').format(parseFloat(total).toFixed(2)));
        },
        error: function (data) {

        }

    });
}

function GetOthertDetails(sUserID, nAction, nPageIndex, nAccountSegment) {

    $.ajax({
        url: gblurl + "AccoutingV1/",
        method: "get",
        data: {
            nAction: nAction,
            sUserId: sUserID,
            nPageIndex: nPageIndex,
            AccountSegment: nAccountSegment
        },
        datatype: "json",
        success: function (data) {
            //console.log(data);
            $.each(data.Result.Result, function (key, value) {
                if (value.HeaderName == "Op. Ledger Balance") {
                    $("#otheropening").html(parseFloat(value.OtherOpening).toFixed(2));
                }
                else if (value.HeaderName == "Intraday Payin") {
                    $("#othercollat").html(parseFloat(value.OtherOpening).toFixed(2));
                }
            });
        },
        error: function (data) {

        }

    });
}

function GetHeaderDetails(sUserID, nAction, nPageIndex, nAccountSegment) {
    HeaderColumns = [];
    $.ajax({
        url: gblurl + "AccoutingV1/",
        method: "get",
        data: {
            nAction: nAction,
            sUserId: sUserID,
            nPageIndex: nPageIndex,
            AccountSegment: nAccountSegment
        },
        datatype: "json",
        success: function (data) {
            //console.log(data);
            var Cncmis;
            var Otheravail;
            var OtherOpening;
            var totalUtilised = 0;


            $.each(data.Result.Result, function (key, value) {

                if (Cncmis == 2) {
                    Otheravail = Intl.NumberFormat('en-IN').format(parseFloat(value.OtherAvail).toFixed(2));
                    OtherOpening = Intl.NumberFormat('en-IN').format(parseFloat(value.OtherOpen).toFixed(2))
                } else {
                    Otheravail = Intl.NumberFormat('en-IN').format(parseFloat(value.Available).toFixed(2));
                    OtherOpening = Intl.NumberFormat('en-IN').format(parseFloat(value.TradeOpenBalance).toFixed(2));
                }

                HeaderColumns.push({
                    Header: value.Head,
                    Multiple: value.nMFactor,
                    Opening: OtherOpening,
                    Utilised: Intl.NumberFormat('en-IN').format(parseFloat(value.Utilize).toFixed(2)),
                    Deducted: Intl.NumberFormat('en-IN').format(parseFloat(value.Deductions).toFixed(2)),
                    Available: Otheravail
                });

                totalUtilised = totalUtilised + value.Utilize;

                $("#utilised").html(parseFloat(totalUtilised).toFixed(2))
                if (value.AccHeadId == 12) {
                    $("#available").html(parseFloat(value.Available).toFixed(2));
                }
            });

            $("#headerset").kendoGrid({
                dataSource: {
                    data: HeaderColumns
                },
                height: 340,
                columns: [
                    {
                        title: "Header",
                        width: 180,
                        field: "Header",
                        template: "#= Header #",
                        attributes: {
                            "class": "divHeader"
                        }
                    },
                    {
                        title: "Multiple",
                        width: 80,
                        field: "Multiple",
                        template: "#= Multiple #",
                        attributes: {
                            "class": "divHeader"
                        }
                    },
                    {
                        title: "Opening",
                        width: 80,
                        field: "Opening",
                        template: "#= Opening #",
                        attributes: {
                            "class": "divHeader"
                        }
                    },
                    {
                        title: "Utilised",
                        width: 80,
                        field: "Utilised",
                        template: "#= Utilised #",
                        attributes: {
                            "class": "divHeader"
                        }
                    },
                    {
                        title: "Deducted",
                        width: 80,
                        field: "Deducted",
                        template: "#= Deducted #",
                        attributes: {
                            "class": "divHeader"
                        }
                    },
                    {
                        title: "Available",
                        width: 80,
                        field: "Available",
                        template: "#= Available #",
                        attributes: {
                            "class": "divHeader"
                        }
                    }
                ],
            });
        },
        error: function (data) {

        }
    });
}

function GetRunLedTransDetails(sUserID, nAction, nPageIndex, nAccountSegment)
{
    TrancationColumn = [];

    var htmlval2 = "";
    var FDMRVAR = "";
    var TypeName = "";
    var Amount;
    var Datetime;
    $.ajax({
        url: gblurl + "AccoutingV1/",
        method: "get",
        data: {
            nAction: nAction,
            sUserId: sUserID,
            nPageIndex: nPageIndex,
            AccountSegment: nAccountSegment
        },
        datatype: "json",
        success: function (data) {
            //console.log(data);
            $.each(data.Result.Result, function (key, value) {
                Amount = Intl.NumberFormat('en-IN').format(parseFloat(value.Amount).toFixed(2))
                Datetime = moment(value.TransTime).format('DD/MM/YYYY hh:mm:ss A');

                TrancationColumn.push({
                    TransId: value.TransID,
                    DrCr: value.DrCr,
                    Product: value.Product,
                    Amount: Amount,
                    RelativeTranId: value.RelativeTranId,
                    FDMR: parseFloat(value.FDMR).toFixed(2),
                    Datetime: Datetime,
                    Type: value.Type,
                    HeadName: value.HeadName,
                    nMFactor: value.nMFactor,
                    Narration: value.Narration
                });

                $("#runledtrans").kendoGrid({
                    dataSource: {
                        data: TrancationColumn
                    },
                    sortable: {
                        mode: "multiple",
                        allowUnsort: true,
                        showIndexes: true
                    },
                    scrollable: true,
                    height: 400,
                    toolbar: ["search"],
                    columns: [
                        {
                            title: "Tr.Code",
                            width: 60,
                            field: "TransId",
                            attributes: {
                                "class": "divHeader"
                            },
                        },
                        {
                            title: "Dr/Cr",
                            width: 40,
                            field: "DrCr",
                            attributes: {
                                "class": "divHeader"
                            }
                        },
                        {
                            title: "Product",
                            width: 80,
                            field: "Product",
                            attributes: {
                                "class": "divHeader"
                            }
                        },
                        {
                            title: "Amount",
                            width: 60,
                            field: "Amount",
                            attributes: {
                                "class": "divHeader"
                            }
                        },
                        {
                            title: "Relative Tr. Id",
                            width: 70,
                            field: "RelativeTranId",
                            attributes: {
                                "class": "divHeader"
                            }
                        },
                        {
                            title: "FDMR/<br/>VAR(%)",
                            width: 60,
                            field: "FDMR",
                            attributes: {
                                "class": "divHeader"
                            }
                        },
                        {
                            title: "Transaction Date Time",
                            width: 110,
                            field: "Datetime",
                            attributes: {
                                "class": "divHeader"
                            }
                        },
                        {
                            title: "Type",
                            width: 70,
                            field: "Type",
                            attributes: {
                                "class": "divHeader"
                            }
                        },
                        {
                            title: "Head Name",
                            width: 120,
                            field: "HeadName",
                            attributes: {
                                "class": "divHeader"
                            }
                        },
                        {
                            title: "Multiple Factor",
                            width: 80,
                            field: "nMFactor",
                            attributes: {
                                "class": "divHeader"
                            }
                        },
                        {
                            title: "Narration",
                            width: 150,
                            field: "Narration",
                            attributes: {
                                "class": "divHeader"
                            }
                        }
                    ],
                });

                var data = $("#runledtrans").data('kendoGrid');
                var arrows = [37, 38, 39, 40];
                data.table.on("keydown", function (e) {

                    if (arrows.indexOf(e.keyCode) >= 0) {
                        setTimeout(function () {
                            data.select($("#runledtrans_active_cell").closest("tr"));
                        }, 1);
                    }
                });
            });
        },

        error: function (data) {

        }
    });
}

$("#btnExcelExport").kendoButton({
    click: function () {
        $("#runledtrans").data("kendoGrid").saveAsExcel()
    }
})

$("#btnPDFExport").kendoButton({
    click: function () {
        $("#runledtrans").data("kendoGrid").saveAsPDF()
    }
})

$(document).on("click", "#totalBalance", function (event)
{
    KendoAPIDialog("AccountBalance", "AccountBalance", 400, 0)
});

$(document).on("click", "#utilised, #available", function (event)
{
    KendoAPIDialog("Summary Of Margin", "fundSummary", 800, 410)
});

$(document).on("click", "#curHolding", function (event) {
    KendoAPIDialog("Current Holding", "holdingSummary", 950, 410)
});

var myWindow = $("#TransactionSummary"),
    undo = $("#viewLedger");

undo.click(function () {
    myWindow.data("kendoWindow").open();
    undo.fadeOut();
});

function onClose() {
    undo.fadeIn();
}

myWindow.kendoWindow({
    width: "1300px",
    title: "Running Ledger Transaction",
    visible: false,
    actions: [
        "Minimize",
        "Maximize",
        "Close"
    ],
    close: onClose
}).data("kendoWindow").center();

myWindow.closest(".k-window").css({
    top: 170,
    left: 50
});
