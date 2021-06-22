﻿var nMarketSegment = 1;
var intselectedId = 0;
/*var gblnUserId =  $("#txtSelectedClient").val().split('-')[0].trim();*/
var gblnUserId = 3010098;
var pnSourceID = 0;
var psName = '';
var nInstrument = 0;
var intPageIndex = 1;
var nMarketWatchID = -1;
var delmwid = '';
var delmwscriptid = '';
var arr = new Array();
var popup1 = "";
var popup2 = "";
var popup3 = "";
var popup4 = "";
var GridColumns = [];
var OptionStrikeData = [];
var DepthColumns = [];
var watchlistName = [];
var DefaultWatch = [];
var Exchange = [];
var ScripType = [];
var instrumentindex = 0;
var Bsetickprice = 0.01;
var tickprice = 0.05;
var tickpriceCurrency = 0.0025;
var topicName;
var isCtrl = false;
var isAlt = false;
var isShift = false;
var nHoldingWatchID = -1;
var idleState = false;
var idleTimer = null;

var ScriptDetails = function (sScript, sPriceStatus, pnScriptID, psInstrument, pnStrike, psCP, pdExpiryDate, pnToken,
                               pnExchangeConstants, pnWatchIndex, pnMktWatchID, pnDetailId, pdCreatedDate, pdModifiedDate) {
    this.sScript = sScript;
    this.sPriceStatus = sPriceStatus;
    this.nScriptID = pnScriptID;
    this.sInstrument = psInstrument;
    this.nStrike = pnStrike;
    this.sCP = psCP;
    this.dExpiryDate = pdExpiryDate;
    this.nToken = pnToken;
    this.nExchangeConstants = pnExchangeConstants;
    this.nWatchIndex = pnWatchIndex;
    this.nMktWatchID = pnMktWatchID;
    this.nDetailId = pnDetailId;
    this.dCreatedDate = pdCreatedDate;
    this.dModifiedDate = pdModifiedDate;
};

var ActionID =
    {
        AddWatchList: 1,
        AddWatches: 2,
        GetScripts: 1,
        DeleteWatchList: 6,
        DeleteWatches: 7,
        GetApiLoginStatus: 9,
        GetExpiredScrip: 1,
        DeleteExpiredScrip: 2,
    };

$(document).ready(function () {
    var nExchangeId = 1
    //tokens2 = [];
    getWatch();

    //MainKendoWindow("WatchlistSet", 824, 435, 66, 30, "WatchList");

    var win = $("#WatchlistSet").kendoWindow({
        width: 300,
        draggable: false,
        resizable: false,
        visible: false,
        actions: ["Custom", "maximize", "minimize"],
        title: "Market Watch"
    }).data("kendoWindow").center().open();

    $("#WatchlistSet").closest(".k-window").css({
        width: "58.5%",
        top: "10%",
        left: "1%",
        height: "52%",

    });

    $("#DepthWindow").kendoWindow({
        width: 300,
        draggable: false,
        resizable: false,
        visible: false,
        actions: ["Custom", "maximize", "minimize"],
        title: "Market Watch"
    }).data("kendoWindow").center().open();

    $("#DepthWindow").closest(".k-window").css({
        width: "39.5%",
        top: "10%",
        left: "60%",
        height: "52%",

    });

    $("#tabWindow").kendoWindow({
        width: 300,
        draggable: false,
        resizable: false,
        visible: false,
        actions: ["Custom", "maximize", "minimize"],
        title: ""
    }).data("kendoWindow").center().open();

    $("#tabWindow").closest(".k-window").css({
        width: "98.5%",
        top: "62.2%",
        left: "1%",
        height: "37%",

    });


    //MainKendoWindow("DepthWindow", 550, 402, 66, 858, "Market Depth");
    //MainKendoWindow("tabWindow", 1385, 275, 471, 29, "");


    var setofOption = [
        { value: 0, Id: 1, name: "Your Watchlists" },
        { value: 1, Id: 2, name: "Default Watchlists" }
    ];

    KendoDropDownList("watchlistOption", setofOption, "Id", "name", WatchOptionChange, false, "", 0);

    getExpiredScripDetails();
    //getgrid2();
});


function WatchOptionChange()
{
    if ($("#watchlistOption").val() == 2)
    {
        nHoldingWatchID = -1;
        DefaultWatchlist(nHoldingWatchID, 1);

    } else if ($("#watchlistOption").val() == 1)
    {
        getWatch();
    }
}

function DefaultWatchlist(nHoldingWatchID, seq)
{
    var URL = "http://localhost:1610/api/HoldingWatch";
    var htmlval = "";
    var rowdata = {
        'HoldingWatchID': nHoldingWatchID
    }
    $.ajax({
        url: URL,
        type: "get",
        data: rowdata,
        dataType: "json",
        success: function (data) {
            //console.log(data);

            if (seq == 1) {
                DefaultWatch = [];

                DefaultWatch.push({
                    wId: "0",
                    wName: "HOLDING"
                });
                $.each(data.Result, function (i, row) {
                    DefaultWatch.push({
                        wId: row.nID,
                        wName: row.gName.toUpperCase()
                    })
                });

                WatchlistSet(DefaultWatch);
            }
            
            //$("#watchDrop").kendoDropDownList({
            //    template: '<span class="order-id">#= wName #</span>',
            //    dataTextField: "wName",
            //    dataValueField: "wId",
            //    //filter: "contains",
            //    change: ChangeHoldWatchList,
            //    height: 520,
            //    dataSource: DefaultWatch,
            //    pageSize: 80,
            //    serverPaging: true,
            //    serverFiltering: true
            //});
            var OptionID = $("#watchDrop").val();
            GetHoldinWatchData(OptionID);
        },
        error: function (data) {

        }
    });
}

function ChangeHoldWatchList()
{
    if ($("#watchDrop").val() == "0") {
        GetHoldinWatchData(0)
    } else {
        var OptionID = $("#watchDrop").val();
        var URL = gblurl + "HoldingWatch";
        var rowdata = {
            'HoldingWatchID': $("#watchDrop").val()
        }

        $.ajax({
            url: URL,
            type: "get",
            data: rowdata,
            dataType: "json",
            success: function (data) {
                //console.log(data);
            },
            error: function (data) {

            }
        });
    }
}

function GetHoldinWatchData(OptionID)
{
    var URL = '';
    var rowdata = '';
    var option = OptionID;
    if (option == 0) {
        URL = gblurl + "AccoutingV1/";
        rowdata = {
            nAction: 3,
            sUserid: gblnUserId,
            nPageIndex: 1,
            AccountSegment: 0
        };
    } else {
        
        URL = "http://localhost:1610/api/HoldingWatch";
        rowdata = {
            'HoldingWatchID': option
        }
    }

    $.ajax({
        url: URL,
        type: "get",
        data: rowdata,
        dataType: "json",
        success: function (data) {
            
            if (option == 0) {
                FillWatchGrid(data.Result.Result, "Default");
            } else {
                FillWatchGrid(data.Result[0].lsthldWatches, "Main");
            }
            
            
        },
        error: function (data) {
            
        }
    });
}

function getExpiredScripDetails()
{
    var Param = {
        nActionID: ActionID.GetExpiredScrip,
        UCC: gblnUserId
    };

    $.ajax({
        url: gblurl + "WatchListExpiryV1/",
        method: "get",
        data: Param,
        dataType: "json",
        success: function (data) {
           // console.log(data);
            if (data.Result.IsResultSuccess == true)
            {
                if (data.ResultStatus == 3)
                {
                    if (data.Result.Result.Msg != '')
                    {
                        $("#ScripMsg").html(data.Result.Result.Msg);
                        KendoWindow("ExpiryModal", 360, 150, "Scrip Expiry", 0, true);
                    }
                }
            }
        },
        error: function (data) {

        }
    })
}

$(document).on("click", "#btnDelExpScrip", function (event) {

    $.ajax({
        url: gblurl + "WatchListExpiryV1/?nAction=" + ActionID.DeleteExpiredScrip + "&UCC=" + 10000 + "",
        method: "DELETE",
        contentType: "application/json",
        success: function (data) {
            if(data.Result.IsResultSuccess == true)
            {
                if(data.ResultStatus == 3)
                {
                    $("#convDelMsg").html("Scrip Deleted Successfully!");
                    $("#ExpiryModal").data('kendoWindow').close();
                    KendoWindow("ExpiryScripSuccess", 450, 110, "", 0, true);
                }
            }
        },
        error: function (data) {

        }
    })

});

$(document).on("click", "#btnConvExpScrip", function (event) {

    var UpdateOrderParams = JSON.stringify({
        nAction: 3,
        UCC: gblnUserId
    });

    $.ajax({
        url: gblurl + "WatchListExpiryV1/",
        type: 'PUT',
        contentType: 'application/json',
        data: UpdateOrderParams,
        dataType: "json",
        success: function(data)
        {
            //console.log(data);
            if (data.Result.IsResultSuccess == true) {
                if (data.ResultStatus == 3) {
                    $("#convDelMsg").html("Scrip Converted Successfully!")
                    $("#ExpiryModal").data('kendoWindow').close();
                    KendoWindow("ExpiryScripSuccess", 450, 110, "", 0, true);
                }
            }
        },
        error: function(data)
        {

        }
    })
});

//$(document).on('mousemove click mouseup mousedown keydown keypress keyup submit change mouseenter scroll resize dblclick', '*', function (event)
//{
//    if (idleTimer != null)
//        clearTimeout(idleTimer);

//    if (idleState == true) {

//    }
//    idleState = false;
//    idleTimer = setTimeout(function () {

//        idleState = true;
//        location.reload();
//    }, 60000);
//});


$("body").trigger("mousemove");


$(function () {
    $('#txtsearch').keyup(function (eventArgs) {
        if (eventArgs.keyCode === 40) {
            //Down arrow
            eventArgs.preventDefault();
            if ($(this).next(".suggestion-wrapper").find(".search_database li.selected-list-item").index() == $(this).next(".suggestion-wrapper").find(".search_database li").length - 1)
                return;

            if ($(this).next(".suggestion-wrapper").find(".search_database li.selected-list-item").length == 0)
                $(this).next(".suggestion-wrapper").find(".search_database li").first().addClass("selected-list-item"); // none selected hence set selection to first
            else
                $(this).next(".suggestion-wrapper").find(".search_database li.selected-list-item").eq(0).removeClass("selected-list-item").next().addClass("selected-list-item");

        } else if (eventArgs.keyCode === 38) {
            //Up arrow
            eventArgs.preventDefault();
            if ($(this).next(".suggestion-wrapper").find(".search_database li.selected-list-item").index() == 0) {
                $(this).next(".suggestion-wrapper").find(".search_database li.selected-list-item").removeClass("selected-list-item");
                return;
            }
            if ($(this).next(".suggestion-wrapper").find(".search_database li.selected-list-item").length == 0)
                $(this).next(".suggestion-wrapper").find(".search_database li").first().addClass("selected-list-item"); // none selected hence set selection to first
            else
                $(this).next(".suggestion-wrapper").find(".search_database li.selected-list-item").eq(0).removeClass("selected-list-item").prev("li").addClass("selected-list-item");

        }
        else if (eventArgs.keyCode === 13) {
            if ($(this).next(".suggestion-wrapper").find(".search_database li.selected-list-item").length > 0)
                $(this).next(".suggestion-wrapper").find(".search_database li.selected-list-item").eq(0).click();
            return;
        }

        if ($(this).next(".suggestion-wrapper").find(".selected-list-item:first").length > 0) {
            $(this).next(".suggestion-wrapper").find(".search_database").scrollTop(0);//set to top

            //current element offset - height - wrapper div top if it's set using relative
            $(this).next(".suggestion-wrapper").find(".search_database").scrollTop(
                    $(this).next(".suggestion-wrapper").find(".selected-list-item:first").offset().top
                    - $(this).next(".suggestion-wrapper").find(".search_database").height()
                    - $(this).next(".suggestion-wrapper").find(".search_database").offset().top
            );//set to top
        }

    });
});

$(function () {
    $('#txtsearch').keydown(function (e) {
        if (e.which == 13) {
            AddScripts();
        }
    });
});


$(document).on('mouseenter', '.search_database li', function (event) {
    if ($(".search_database li.selected-list-item").length > 0) {
        $(".search_database li.selected-list-item").removeClass("selected-list-item");
    }
    $(this).addClass("selected-list-item");
}).on('mouseleave', '.search_database li', function () {
    if ($(".search_database li.selected-list-item").length > 0)
        $(".search_database li.selected-list-item").removeClass("selected-list-item");
});

$(document).on("click", "#lstSearch li", function (event) {

    $(this).attr("data-token")
    $(this).attr("data-exchange-id")
    $('#txtsearch').data("id", $(this).attr("data-id"));
    $('#txtsearch').data("name", $(this).attr("data-name"));

    $('#txtsearch').data("isactive", $(this).attr("data-isactive"));
    $('#txtsearch').data("stockname", $(this).attr("data-stockname"));

    $('#txtsearch').data("expiry", $(this).attr("data-expiry"));
    $('#txtsearch').data("strikeprice", $(this).attr("data-strikeprice"));

    $('#txtsearch').data("callput", $(this).attr("data-callput"));
    $('#txtsearch').data("type", $(this).attr("data-type"));

    $('#txtsearch').data("key", $(this).attr("data-key"));
    $('#txtsearch').data("broadcastconstant", $(this).attr("data-broadcastconstant"));

    $('#txtsearch').val($(this).attr("data-fullName"));

    $('#divSearch').css("display", "none");

    scriptclick = 1; 
});

$(document).on("click", function () {
    $('#divSearch').removeClass("suggestion-wrapper");
    $('#divSearch').addClass("suggestion-wrapper hidden-suggestion-wrapper");
});

$(function () {
    $('#txtsearch').keyup(function (eventArgs) {

        if (eventArgs.keyCode === 40 || eventArgs.keyCode === 38 || eventArgs.keyCode === 13)
            return;

        scriptclick = 0;

        var pStrike = '';
        var pCP = '';
        var arrOptionData = [];
        var pExpiry = null;
        var pScript = '';
        var pCashType = 'EQ';

        var strmsg;
        var txtser = $('#txtsearch').val();

        if (txtser.length > 0) {
            strmsg = validateSearch(nInstrument, $('#txtsearch').val());

            if (strmsg != '') {

                $('#txtsearch').val('');
            } else {
                if (nInstrument == 2 || nInstrument == 5 || nInstrument == 7) {
                    arrOptionData = $('#txtsearch').val().split(" ");
                    if (arrOptionData.length > 1) {
                        pScript = arrOptionData[0];
                        pStrike = arrOptionData[1];
                        pCP = arrOptionData[2];

                    }
                    else {
                        pScript = $('#txtsearch').val();
                        pCP = null;
                        pStrike = 0
                    }
                }
                else {
                    pScript = $('#txtsearch').val();
                    pCP = null;
                    pStrike = 0
                }
                

                if ($("#lstCashType").val() == "8") {
                    pCashType = "BE";
                    nInstrument = "3";
                }
                else if ($("#lstCashType").val() == "9") {
                    pCashType = "SM";
                    nInstrument = "3";
                }
                else {
                    pCashType = "EQ";
                }

                var Param = {
                    'userID': gblnUserId,
                    'stockAction': ActionID.GetScripts,
                    'pageIndex': intPageIndex,
                    'ScriptName': pScript,
                    'ExchangeId': nExchangeId,
                    'ScriptType': nInstrument,
                    'Expiry': pExpiry,
                    'CP': pCP,
                    'Strike': pStrike,
                    'CashType': pCashType
                };

                if (arrOptionData.length > 2) {
                    $.ajax({
                        url: gblurl + "ScriptV1/",
                        method: "get",
                        data: Param,
                        beforeSend: function () {
                            $("#txtsearch");
                        },
                        dataType: "json",
                        success: function (data) {
                            //console.log(data);
                            if (data.IsResultSuccess == true) {
                                FillScript(data);
                              //  $("#divSearch").show();
                            }
                        },
                        error: function (data){

                        }
                    });
                } else {

                    $.ajax({
                        url: gblurl + "ScriptV1/",
                        method: "get",
                        data: Param,
                        beforeSend: function () {
                            $("#txtsearch");
                        },
                        dataType: "json",
                        success: function(data)
                        {
                            //console.log(data);
                            if (intPageIndex == 1)
                                $('#lstSearch').html('');

                            FillScript(data);
                            $("#divSearch").show();
                        },
                        error: function(data)
                        {

                        }
                    });
                }
            }
        }
    });
});


function FillScript(msg) {
    var htmlval = '';
    var strDisplay = '';
    var strExp = '';

    $.each(msg.Result, function (i, row) {
        strDisplay = $.trim(row.StockName + ' ' + (row.StrikePrice == "" ? '' : row.StrikePrice) + ' ' + (row.CallPut == "" ? '' : row.CallPut) + ' ' + (row.Expiry == null ? '' : GetExpiry(row.Type, row.Expiry)));
        strExp = row.Type == "3" ? '' : row.Expiry;
        if (i == 0) { htmlval += '<li class="hovered" '; }
        else { htmlval += '<li '; }

        htmlval = htmlval +
                 ' data-id= "' + row.ParentExchange.ID + '"' +
                 ' data-name  = "' + row.ParentExchange.Name + '"' +
                 ' data-isactive  = "' + row.ParentExchange.IsActive + '"' +
                 ' data-type = "' + GetStringInstrument(row.Type, row.CashSeries) + '"' +
                 ' data-stockname = "' + row.StockName + '"' +
                 ' data-expiry = "' + GetExpiry(row.Type, row.Expiry) + '"' +
                 ' data-expiry = "' + strExp + '"' +
                 ' data-callput = "' + row.CallPut + '"' +
                 ' data-strikeprice = "' + row.StrikePrice + '"' +
                 ' data-key = "' + row.Key + '"' +
                 ' data-fullName = "' + strDisplay + '"' +
                 ' data-broadcastconstant = "' + row.BroadcastConstant + '" >' +
                 '<span class="scrip-name1">' + strDisplay.replace($("#txtsearch").val().toUpperCase(), '<b style="color:#ff0000">' + $("#txtsearch").val().toUpperCase() + '</b>') + '</span>';

        if (row.Type == "3") {
            htmlval = htmlval + '<span class="company-name" style="float:right">' + row.CompanyName.replace($("#txtsearch").val().toUpperCase(), '<b style="color:#ff0000">' + $("#txtsearch").val().toUpperCase() + '</b>') + '</span>'
        }

        ' </li>';
    });
    $('#lstSearch').html(htmlval);
    $('#divSearch').removeClass("suggestion-wrapper hidden-suggestion-wrapper");
    $('#divSearch').addClass("suggestion-wrapper");
}


function AddScripts() {
        if (scriptclick == 0)
        {
            return;
        }


        var lstWatch = [];
        if ($('#lstSearch').html() != '') {

            var strmsg = validateSearch(nInstrument, $('#txtsearch').val());
            if (strmsg == '') {
                var objScript = new ScriptDetails();
                objScript.sScript = $('#txtsearch').data('stockname');
                objScript.sPriceStatus = 'U';
                objScript.nScriptID = $('#txtsearch').data('id');
                objScript.sInstrument = $('#txtsearch').data('type');

                objScript.nStrike = $('#txtsearch').data('strikeprice');
                objScript.sCP = $('#txtsearch').data('callput');
                objScript.dExpiryDate = $('#txtsearch').data('expiry');
                objScript.nToken = $('#txtsearch').data('key');
                objScript.nExchangeConstants = $('#txtsearch').data('broadcastconstant');
                objScript.nWatchIndex = 0;
                objScript.nMktWatchID = intselectedId;
                objScript.nDetailId = 0;
                objScript.dCreatedDate = '';
                objScript.dModifiedDate = '';
                objScript.nExchangeID = nExchangeId;
                var sScripts = $('#lblScripts').val();
               
                lstWatch.push(objScript);
                AddWatches(ActionID.AddWatches, intselectedId, psName, gblnUserId, 0, nMarketSegment, pnSourceID, 0, lstWatch);
            }
            else {
                if (strmsg == "Select Script to Continue") {

                }
                else {
                    
                }
            }
        }
        scriptclick = 0;
}

function AddWatches(pintActionID, pnID, psName, pnCreaterID, pnDefaultFlag, pnExchangeID, pnSourceID, pnScriptCount, lstWatches)
{

    var WatchesData = JSON.stringify({
        nActionID: pintActionID,
        WatchInsertParam:
        {
            'nID': pnID,
            'sName': psName,
            'nCreaterID': pnCreaterID,
            'nDefaultFlag': pnDefaultFlag,
            'nExchangeID': pnExchangeID,
            'nSourceID': pnSourceID,
            'nScriptCount': pnScriptCount,
            'lstWatches': lstWatches
        }
    });

    $.ajax({
        url: gblurl + "WatchListV2/",
        type: 'POST',
        contentType: 'application/json',
        data: WatchesData,
        dataType: "json",
        success: function (data) {
            //console.log(data);
            if (data.ResultStatus == 3) {
                if (pintActionID == 2) {

                  //  KendoWindow("windowforscripaddsuccess", 450, 160, "Delete Scrip", 0);
                    GetWatches(gblnUserId, intselectedId, nMarketSegment, intPageIndex);

                    $('#txtsearch').val('');
                }
                else {
                    $("#windowForAdd").data('kendoWindow').close();
                    KendoWindow("windowforwatchaddsuccess", 450, 160, "Watchlist Added", 1, true);
                    blnFirstFlag = false
                    intselectedId = data.Result.Id;
                    $('#lblMarketWath').text(psName);

                    
                    GetWatches(gblnUserId, -1, nMarketSegment, intPageIndex);

                    $('#txtAddScript').val('');
                }
                
            } else {
                if (data.Result == "No scripts were added as scripts are already present in watchlist.") {
                    alert("This scrip is present in watchlist.");
                } else {
                    alert(JSON.stringify(data.Result));
                }
            }
        },
        error: function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus + ' PostWatches');
        }
    });
};

var notification = $("#notification").kendoNotification({
    position: {
        pinned: true,
        top: 250,
        right: 550
    },
    autoHideAfter: 5000,
    stacking: "down",
    templates: [{
        type: "error",
        template: $("#errorTemplate").html()
    }]

}).data("kendoNotification");

function validateSearch(nInstrument, Script) {

    var strMsg = '';
    if (nInstrument == 0) {

        strMsg = "Select Instrument to Continue.";
        notification.show({
            title: "Select Instrument!",
            message: strMsg
        }, "error");

       // $("#ModSelectInstrument").modal('show');

        return strMsg;
    }
    if (Script == "") {
        strMsg = "Select Scrip to Continue";

        notification.show({
            title: "Select Scrip!",
            message: strMsg
        }, "error");

      //  $("#ModSelectInstrument").modal('show');
        return strMsg;
    }
    return strMsg;
}

function AddWatchPopUp()
{
    KendoWindow("windowForAdd", 450, 230, "Add WatchList", 0, true);
}

$(document).on("click", "#btnAddNew", function (event) {

    var strWatchListName = '';
    var DefaultWatch = 0;
    var WatchList = [];


    if ($('#txtAddScript').val() == '') {
        alert('Market Watch Name Cannot Be Blank');
        return;
    }

    if ($("#Yes").is(":checked")) {
        DefaultWatch = 1
    }
    else {
        DefaultWatch = 0
    }

    strWatchListName = $('#txtAddScript').val();

    AddWatches(1, 0, strWatchListName, gblnUserId, DefaultWatch, nMarketSegment, 1, 0, WatchList);

});

function DeleteScrip(data) {

    delmwid = data.dataset.marketwatchid;
    delmwscriptid = data.dataset.scripid;

    KendoWindow("windowForDeleteScrip", 450, 160, "Delete Scrip", 0, true);
}

$(document).on("click", "#btnDeleteScrip", function (event) {

    DeleteScripts(delmwid, delmwscriptid, ActionID.DeleteWatches);

});

function DeleteWatch()
{

    KendoWindow("windowForDelete", 450, 160, "Delete WatchList", 0, true);

}

function DeleteSuccess() {

    KendoWindow("DeleteScripSuccess", 450, 110, "Deleted", 1, true);

}

function WDeleteSuccess()
{

    KendoWindow("DeleteWatchSuccess", 450, 110, "Deleted", 1, true);

}

$('#btnDeleteWatch').click(function () {
    
    var Watchid = $("#watchDrop").val();
    if (Watchid != 0)
    {
        DeleteScripts(Watchid, 0, ActionID.DeleteWatchList);

    } else
    {
        alert("No MarketWatch Selected");
    }
});

function DeleteScripts(pintMarketWatchId, pintScriptId, pintActionId) {

    $.ajax({
        url: gblurl + "WatchListV2/?pnMarketWatchID=" + pintMarketWatchId + "&pintDetailID=" + pintScriptId + "&pnAction=" + pintActionId,
        method: "DELETE",
        contentType: "application/json",
        success: function(data)
        {
            if (pintActionId == 7) {
                $("#windowForDeleteScrip").data('kendoWindow').close();
                DeleteSuccess();
                GetWatches(gblnUserId, intselectedId, nMarketSegment, intPageIndex);
            }
            else {
                $("#windowForDelete").data('kendoWindow').close();
                WDeleteSuccess();
                GetWatches(gblnUserId, nMarketWatchID, nMarketSegment, intPageIndex);

                intselectedId = 0;
            }
        },
        error: function(data)
        {
            alert("Error");
        }
    });
}


var gridDs = new kendo.data.DataSource({
    data: [
        { channel: "Organic Search", conversion: 8232, users: 70500 },
        { channel: "Direct", conversion: 6574, users: 24900 },
        { channel: "Referral", conversion: 4932, users: 20000 },
        { channel: "Social Media", conversion: 2928, users: 19500 },
        { channel: "Email", conversion: 2456, users: 18100 },
        { channel: "Other", conversion: 1172, users: 16540 },
    ],
    schema: {
        model: {
            fields: {
                conversion: { type: "number" },
                users: { type: "number" }
            }
        }
    }
});


//  $.ajax()


function getWatch() {

    // array of all brands
    var Exchange = [
        { value: 0, Id: 1, name: "NSE" },
        { value: 1, Id: 2, name: "BSE" }
    ];

    // array of all models
    var ScripType = [
        { value: 3, name: "CASH", Id: 1 },
        { value: 0, name: "Market Segment", Id: 1 },
        
        { value: 3, name: "CASH", Id: 2 },
        { value: 0, name: "Market Segment", Id: 2 },
        { value: 8, name: "CASH (BE)", Id: 1 },
        { value: 9, name: "CASH (SM)", Id: 1 },
        { value: 4, name: "CASH/FUTURE", Id: 1 },
        { value: 5, name: "CASH/OPTION", Id: 1 },
        { value: 1, name: "INDEX/FUTURE", Id: 1 },
        { value: 2, name: "INDEX/OPTION", Id: 1 },
        { value: 6, name: "CURRENCY/FUTURE", Id: 1 },
        { value: 7, name: "CURRENCY/OPTION", Id: 1 }
    ];

    KendoDropDownList("lstSegment", Exchange, "Id", "name", ExchangeChange, false, "", 0);
    KendoDropDownList("lstCashType", ScripType, "value", "name", CashTypeChange, false, "lstSegment", 0);

    nInstrument = $("#lstCashType").val();
    nExchangeId = $("#lstSegment").val();

    GetWatches(gblnUserId, nMarketWatchID, nMarketSegment, intPageIndex);
}


function CashTypeChange() {
    nInstrument = $("#lstCashType").val();

    $('#divSearch').removeClass("suggestion-wrapper");
    $('#divSearch').addClass("suggestion-wrapper hidden-suggestion-wrapper");
    $('#txtsearch').val('');
    // $('#divSearch').addClass("suggestion-wrapper");
    // alert(nInstrument);
    $('#txtsearch').focus();

    var scriptype = $('#lstCashType').data("kendoDropDownList").text();
    
    if (scriptype == 'CASH') {
        $("#txtsearch").attr("placeholder", "Eg. RELIANCE").val("").focus().blur();
        $("#txtsearch").css("font-size", "14px");
    }
    else if (scriptype == 'CASH (BE)') {
        $("#txtsearch").attr("placeholder", "Eg. HAVISHA").val("").focus().blur();
        $("#txtsearch").css("font-size", "14px");
    }
    else if (scriptype == 'CASH (SM)') {
        $("#txtsearch").attr("placeholder", "Eg. SARVESHWAR").val("").focus().blur();
        $("#txtsearch").css("font-size", "14px");
    }
    else if (scriptype == 'CASH/FUTURE') {
        $("#txtsearch").attr("placeholder", "Eg. RELIANCE 25/06/2020").val("").focus().blur();
        $("#txtsearch").css("font-size", "13px")
    }
    else if (scriptype == 'INDEX/FUTURE') {
        $("#txtsearch").attr("placeholder", "Eg. NIFTY 25/06/2020").val("").focus().blur();
        $("#txtsearch").css("font-size", "13px")
    }
    else if (scriptype == 'CASH/OPTION') {
        $("#txtsearch").attr("placeholder", "Eg. RELIANCE 1440 CE 25/06/2020").val("").focus().blur();
        $("#txtsearch").css("font-size", "10px")
    }
    else if (scriptype == 'INDEX/OPTION') {
        $("#txtsearch").attr("placeholder", "Eg. NIFTY 10000 CE 25/06/2020").val("").focus().blur();
        $("#txtsearch").css("font-size", "11px")
    }
}


function GetWatches(nUserId, nMarketWatchID, nMarketSegment, intPageIndex)
{

   var ClientCode= $("#txtSelectedClient").val().split('-')[0].trim();
    $.ajax({
        url: "https://ctcl.investmentz.com/iCtclServiceT/api/WatchListV2/",
        method: "get",
        data: {
            pnUserId: 3010098,
            pnMarketWatchID: nMarketWatchID,
            pnMarketSegment: nMarketSegment,
            pintPageIndex: intPageIndex
        },
        dataType: "json",
        success: function (data) {
            //console.log(data);
            if (data.Result != "No MarketWatch Found") {
                if (nMarketWatchID == -1) {
                    if (intselectedId == 0) {
                        intselectedId = data.Result[0].nID;
                        $('#lblMarketWath').text(data.Result[0].sName);
                        GetWatches(gblnUserId, data.Result[0].nID, nMarketSegment, intPageIndex, 0);
                    }
                }
            }
            GridColumns = [];
            DepthColumns = [];
            
            if (nMarketWatchID == -1)
            {
                watchlistName = [];
                $.each(data.Result, function (i, row) {
                    watchlistName.push({
                        wId: row.nID,
                        wName: row.sName.toUpperCase()
                    })
                });
            }
            

            if (data.Result[0].nScriptCount != 0)
            {
                FillWatchGrid(data.Result[0].lstWatches, "Main")
            } else {
                GridColumns = [];
            }

            WatchlistSet(watchlistName)
        },
        error: function (data) {

        }
    });
}

function WatchlistSet(watchlistName)
{
    $("#watchDrop").kendoDropDownList({
        template: '<span class="order-id">#= wName #</span>',
        dataTextField: "wName",
        dataValueField: "wId",
        //filter: "contains",
        change: ChangeWatchList,
        height: 520,
        dataSource: watchlistName,
        pageSize: 80,
        serverPaging: true,
        serverFiltering: true
    });
}

function ChangeWatchList() {
    arr = [];
    intselectedId = $("#watchDrop").val();

    if ($("#watchlistOption").val() == 2) {
        console.log("Yes");
        if ($("#watchDrop").val() != 0 && $("#watchDrop").val() != -1) {
            DefaultWatchlist($("#watchDrop").val(), 2)
        }
    }
    else {
        console.log("No");
        if ($("#watchDrop").val() != 0) {
            $('#lblMarketWath').text($(this).text());

            GetWatches(gblnUserId, intselectedId, nMarketSegment, intPageIndex, 0);
        }
    }
}

function FillWatchGrid(data, type)
{
    //console.log(data);
    //return false;
    //var scrip = "";
    //var button = "";
    var ExpiryDate = "";
    var sScripts = "";
    //var scrip2 = "";
    var ExchangeId = "";
    var Exchangeconstant = "";
    var DetailId = "";
    var strExp = '';
    var tempinst;
    var currrate;
    var nExchange;
    var RateChange;
    var ChangePerc;
    var Open;
    var High;
    var Low;
    var Close;
    var vstrprice;
    var CP;
    var BuyQty;
    var BuyPrice;
    var SellQty;
    var SellPrice;
    var LTQ;
    var LTD;
    var LTT;
    GridColumns = [];

    $.each(data, function (i, row) {

        //Close = '<span id="' + row.nExchangeConstants + '_' + row.nToken + '_PC"></span>';

        if (row.sInstrument.split("_")[1] == "OPTION" || row.sInstrument.split("_")[1] == "FUTURE") {
            tempinst = row.sInstrument;
        } else {
            tempinst = row.sInstrument.split("_")[0];
        }

        if (type == "Main") {
            ExchangeId = row.nExchangeID;
            DetailId = row.nDetailId;
            Exchangeconstant = row.nExchangeConstants;
            ExpiryDate = row.dExpiryDate;
            strExp = tempinst == "CASH" ? '' : row.dExpiryDate;
            strExp = tempinst == "CASH" ? '' : formatDate(row.dExpiryDate, '', "DD/MM/YYYY");
        } else {
            ExchangeId = row.nExchangeId;
            DetailId = "";
            Exchangeconstant = row.nBroadCastContants;
            ExpiryDate = "";
            strExp = tempinst == "CASH" ? '' : "";
            strExp = tempinst == "CASH" ? '' : formatDate("", '', "DD/MM/YYYY");
        }
        


        if (parseFloat(row.nStrike) > 0) {
            if (tempinst == "CURRENCY_OPTION") {
                vstrprice = parseFloat(row.nStrike).toFixed(4);
                CP = row.sCP;
            }
            else {
                vstrprice = parseFloat(row.nStrike).toFixed(2);
                CP = row.sCP;
            }
        }
        else {
            vstrprice = '';
        }

        var ScripName = "";

        if (tempinst == "CASH") {
            ScripName = row.sInstrument.split("_")[1] + '- ' + GetExchangeType(ExchangeId) + '\xa0\xa0' + row.sScript;
        } else if (tempinst == "CASH_FUTURE" || tempinst == "INDEX_OPTION") {
            ScripName = row.sInstrument.split("_")[1] + '- ' + GetExchangeType(ExchangeId) + '\xa0\xa0' + row.sScript + '\xa0\xa0' + row.dExpiryDate;
        } else if (tempinst == "CASH_OPTION" || tempinst == "INDEX_FUTURE") {
            ScripName = row.sInstrument.split("_")[1] + '- ' + GetExchangeType(ExchangeId) + '\xa0\xa0' + row.sScript + '\xa0\xa0' + row.nStrike + '\xa0\xa0' + row.dExpiryDate;
        }

        //PC = '<span><strong id= "' + row.nExchangeConstants + '_' + row.nToken + '_PC">0.0000</strong></span>';
        if (Exchangeconstant == 12 || Exchangeconstant == 13) {
            currrate = '<span><strong class= "' + Exchangeconstant + '_' + row.nToken + '_LR">0.0000</strong></span>';
        }
        else {
            currrate = '<span><strong class= "' + Exchangeconstant + '_' + row.nToken + '_LR">0.00</strong></span>';
        }

        sScripts = sScripts.concat(Exchangeconstant + '.' + row.nToken + ',');
        nExchange = '<span><strong>' + GetExchangeType(ExchangeId) + '</strong></span>';
        //scrip = '<span>' + row.sScript + ' ' + row.sInstrument + ' -NSE</span>';
        RateChange = '<span style="backgound-color:red;"><strong class="' + Exchangeconstant + '_' + row.nToken + '_RateChange"></strong</span>';
        ChangePerc = '<span><strong class="' + Exchangeconstant + '_' + row.nToken + '_RateChangePc"></strong</span>';
        High = '<span><strong class="' + Exchangeconstant + '_' + row.nToken + '_H"></strong</span>';
        Low = '<span><strong class="' + Exchangeconstant + '_' + row.nToken + '_L"></strong</span>';

        Open = '<span><strong class="' + Exchangeconstant + '_' + row.nToken + '_O"></strong</span>';
        Close = '<span><strong class="' + Exchangeconstant + '_' + row.nToken + '_PC"></strong</span>';

        BuyQty = '<span><strong class="' + Exchangeconstant + '_' + row.nToken + '_BQ"></strong</span>';
        BuyPrice = '<span class="num-qty1"><strong class="' + Exchangeconstant + '_' + row.nToken + '_SR"></strong</span>';
        SellQty = '<span><strong class="' + Exchangeconstant + '_' + row.nToken + '_SQ"></strong</span>';
        SellPrice = '<span class="num-qty2"><strong class="' + Exchangeconstant + '_' + row.nToken + '_BR"></strong</span>';
        LTQ = '<span><strong class="' + Exchangeconstant + '_' + row.nToken + '_LQ"></strong</span>';
        LTD = '<span><strong class="' + Exchangeconstant + '_' + row.nToken + '_LUD"></strong</span>';
        LTT = '<span><strong class="' + Exchangeconstant + '_' + row.nToken + '_LUDT"></strong</span>';
        TotalQty = '<span><strong class="' + Exchangeconstant + '_' + row.nToken + '_TQ"></strong</span>';
        ATP = '<span><strong class="' + Exchangeconstant + '_' + row.nToken + '_ATP"></strong</span>';
        OpenInt = '<span><strong class="' + Exchangeconstant + '_' + row.nToken + '_OI"></strong</span>';

        GridColumns.push({
            nExchangeConstants: Exchangeconstant,
            nToken: row.nToken,
            nExchangeID: ExchangeId,
            nScriptID: row.nScriptID,
            sPriceStatus: row.sPriceStatus,
            nMarketWatchID: row.nMktWatchID,
            nMktWatchID: row.nMktWatchID,
            sInstrument: row.sInstrument,
            nStrike: row.nStrike,
            sCP: row.sCP,
            dExpiryDate: ExpiryDate,
            nWatchIndex: row.nWatchIndex,
            sScript: row.sScript,
            sScripId: DetailId,
            Scrip: ScripName,
            LTP: currrate,
            Change: RateChange,
            changeperc: ChangePerc,
            Open: Open,
            High: High,
            Low: Low,
            PrevClose: Close,
            Instrument: row.sInstrument,
            Expiry: strExp,
            Strike: vstrprice,
            CallPut: CP,
            BuyQty: BuyQty,
            BuyPrice: BuyPrice,
            SellQty: SellQty,
            SellPrice: SellPrice,
            LTQ: LTQ,
            LTD: LTD,
            LTT: LTT,
            TotalQty: TotalQty,
            ATP: ATP,
            OpenInt: OpenInt,
            Exchange: nExchange,
        });
        if (blnBroadCastFlag == true) {
            CloseSocket();//Close and open
        }

        var lblScript = "lblScripts";
        var token = "tokens"
       
        $('#lblScripts').html(sScripts.substring(0, sScripts.length - 1));
        $('#lblScripts').html($('#lblScripts').html() + "," + "17.999908,17.999988,5.1")
        tokens.push(row.nToken);

        reconnectSocketAndSendTokens(lblScript);

    });

    //debugger;
    //reconnectSocketAndSendTokens("lblScripts");

    $("#WatchList").kendoGrid({
        //   dataSource: leitmotifs,
        dataSource: {
            data: GridColumns
            //pageSize: 10 // specifying the pagesize inside the datasource fixed my problem (Nan-Nan of 1 items)
        },
        filterable: {
            multi: true,
            search: true
        },
        height: 275,
        navigatable: true,
        selectable: 'row',
        scrollable: true,
        sortable: true,
        resizable: true,
        change: getDepth,
        // pageable: true,
        reorderable: true,
        columnMenu: true,
        click: onselect,
        columnShow: function (e) {
            // console.log(e.column.field); // displays the field of the hidden column
        },
        toolbar: ["search"],
        columns: [
            {
                field: "",
                width: 220,
                title: "",
                template: '<button class="k-button" style="min-width: 30px; background-color:green;" ' +
                    ' id="#= nExchangeConstants #_#= nToken #_buy" title="Buy" ' +
                    ' data-buysell="1" data-exchangeid = "#= nExchangeID #"' +
                    ' data-script-id = "#= nScriptID #"' +
                    ' data-priceStatus  = "#= sPriceStatus #"' +
                    ' data-marketwatch-id  = "#= nMktWatchID #"' +
                    ' data-instrument = "#= sInstrument #"' +
                    ' data-strike = "#= nStrike #"' +
                    ' data-cp = "#= sCP #"' +
                    ' data-expirydate = "#= dExpiryDate #"' +
                    ' data-token = "#= nToken #"' +
                    ' data-exchangeconstants = "#= nExchangeConstants #"' +
                    ' data-watch-index = "#= nWatchIndex #"' +
                    ' data-script = "#= sScript #" onclick="buysellwindow(this)">' +
                    '<i class="fa fa-plus"></i>' +
                    '</button>' +
                    '<button class="k-button" style="min-width: 30px; background-color:red;" ' +
                    ' id="#= nExchangeConstants #_#= nToken #_sell" title="Sell" ' +
                    ' data-buysell="2" data-exchangeid = "#= nExchangeID #"' +
                    ' data-script-id = "#= nScriptID #"' +
                    ' data-priceStatus  = "#= sPriceStatus #"' +
                    ' data-marketwatch-id  = "#= nMktWatchID #"' +
                    ' data-instrument = "#= sInstrument #"' +
                    ' data-strike = "#= nStrike #"' +
                    ' data-cp = "#= sCP #"' +
                    ' data-expirydate = "#= dExpiryDate #"' +
                    ' data-token = "#= nToken #"' +
                    ' data-exchangeconstants = "#= nExchangeConstants #"' +
                    ' data-watch-index = "#= nWatchIndex #"' +
                    ' data-script = "#= sScript #" onclick="buysellwindow(this)">' +
                    '<i class="fa fa-minus"></i>' +
                    '</button>' +

                    '<button class="k-button" style="min-width: 30px; background-color:white;" title="Chart"> ' +
                    '<i class="fa fa-area-chart facolor"></i>' +
                    '</button>' +

                    '<button class="k-button" style="min-width: 30px; background-color:white;" title="Opt.Chain" ' +
                    'data-script = "#= sScript #" data-expirydate = "#= dExpiryDate #" ' +
                    'data-token = "#= nToken #" data-instrument = "#= sInstrument #" ' +
                    'data-exchangeconstants = "#= nExchangeConstants #" ' +
                    'data-exchangeid = "#= nExchangeID #" onclick="getOptionChain(this)"> ' +
                    '<i class="fa fa-link facolor"></i>' +
                    '</button>' +

                    //'<button class="k-button" style="min-width: 30px; background-color:white;" title="Opt.Chain" ' +
                    //  'data-script = "#= sScript #" data-expirydate = "#= dExpiryDate #" ' +
                    //  'data-token = "#= nToken #" data-instrument = "#= sInstrument #" ' +
                    //  'data-exchangeconstants = "#= nExchangeConstants #" ' +
                    //  'onclick="getOptionChain(this)> ' +
                    // '<i class="fa fa-link facolor"></i>' +
                    //'</button>' +

                    '<button class="k-button" style="min-width: 30px; background-color:white;" title="Details" ' +
                    ' data-token = "#= nToken #" ' +
                    ' data-exchangeconstants  = "#= nExchangeConstants #" ' +
                    ' onclick="openScripDetail(this)">' +
                    '<i class="fa fa-info-circle facolor"></i>' +
                    '</button>' +

                    '<button class="k-button" data-marketwatchid="#= nMarketWatchID #" ' +
                    'data-scripid="#= sScripId #" onclick="DeleteScrip(this);" title="Delete" ' +
                    'style="min-width: 30px; background-color:white;">' +
                    '<i class="fa fa-trash facolor"></i>' +
                    '</button>'
            },
            {
                title: "Scrip",
                width: 240,
                field: "Scrip",
                template: "#= Scrip #",
                attributes: {
                    style: "font-weight: bold;"
                }
            },
            {
                title: "LTP",
                field: "LTP",
                width: 70,
                template: "#= LTP #",
                attributes: {
                    style: "font-weight: bold;"
                }
            },
            {
                title: "Change",
                width: 90,
                field: "Change",
                template: "#= Change #",
                attributes: {
                    "class": "",
                    style: "font-weight: 500;"
                }
            },
            {
                title: "%Change",
                width: 100,
                field: "changeperc",
                template: "#= changeperc #",
                attributes: {
                    "class": "",
                    style: "font-weight: 500;"
                }
            },
            {
                title: "Open",
                field: "Open",
                width: 80,
                template: "#= Open #"
            },
            {
                title: "High",
                field: "High",
                width: 80,
                template: "#= High #"
            },
            {
                title: "Low",
                field: "Low",
                width: 80,
                template: "#= Low #"
            },

            {
                title: "Prev. Close",
                field: "PrevClose",
                width: 110,
                template: "#= PrevClose #"
            },
            {
                title: "Instrument",
                field: "Instrument",
                width: 110,
                hidden: true,
                template: "#= Instrument #"
                // template: "#= change + ' <br/> ' + changeperc #"
            },
            {
                title: "Expiry",
                width: 85,
                field: "Expiry",
                hidden: true,
                template: "#= Expiry #"
                // template: "#= change + ' <br/> ' + changeperc #"
            },
            {
                title: "Strike",
                width: 85,
                field: "Strike",
                hidden: true,
                template: "#= Strike #"
            },
            {
                title: "Call/Put",
                width: 95,
                field: "CallPut",
                hidden: true,
                template: "#= CallPut #"
            },
            {
                title: "Buy Qty",
                width: 100,
                field: "BuyQty",
                hidden: true,
                template: "#= BuyQty #"
            },
            {
                title: "Buy Price",
                field: "BuyPrice",
                width: 100,
                hidden: true
            },
            {
                title: "Sell Qty",
                field: "SellQty",
                width: 95,
                hidden: true
            },
            {
                title: "Sell Price",
                field: "SellPrice",
                width: 100,
                hidden: true
            },
            {
                title: "LTQ",
                field: "LTQ",
                width: 80,
                hidden: true
            },
            {
                title: "LTD",
                field: "LTD",
                width: 80,
                hidden: true
            },
            {
                title: "LTT",
                field: "LTT",
                width: 80,
                hidden: true
            },
            {
                title: "Total Qty",
                field: "TotalQty",
                width: 100,
                hidden: true
            },
            {
                title: "ATP",
                field: "ATP",
                width: 80,
                hidden: true
            },
            {
                title: "Open Int.",
                field: "OpenInt",
                width: 100,
                hidden: true
            },
        ],
    });




    var data = $("#WatchList").data('kendoGrid');
    var arrows = [37, 38, 39, 40];
    data.table.on("keydown", function (e) {

        if (arrows.indexOf(e.keyCode) >= 0) {
            setTimeout(function () {
                data.select($("#WatchList_active_cell").closest("tr"));
            }, 1);
        }
    });

            getDepth();
}

//$(document).on("click", "#btnbuy", function (event)
//{
//    alert("yes");
//})

function getOptionChain(data)
{
   // return false;
    var ExpiryDate = moment(data.dataset.expirydate).format("DD/MM/YYYY");
    var StockType = GetInstrumentNumber(data.dataset.instrument);
    var ltpid = data.dataset.exchangeconstants + '_' + data.dataset.token;
    var LTP = parseFloat($('.' + ltpid + '_LR').text());

    var ClientCode = $("#txtSelectedClient").val().split('-')[0].trim();

    if (StockType != 4 && StockType != 1 && StockType != 6)
    {
        kendo.alert("This feature is available only for Future scrips!");
    } else {
        var optParam = {
            nAction: 4,
            npageIndex: 1,
            nStockType: StockType + 1,
            nExchageId: parseInt(data.dataset.exchangeid),
            sUserId: ClientCode,
            sExpiryDt: ExpiryDate,
            sScript: data.dataset.script,
            Ltp: LTP
        };

        $.ajax({
            url: "https://trade.investmentz.com/EasyTradeApi/api/DashboardV1/",
            type: 'GET',
            contentType: 'application/json',
            data: optParam,
            dataType: "json",
            success: function (data) {
                //console.log(data);
                FillOptionChainGrid(data)
            },
            error: function (data) {

            }
        });
    }

    
}

function FillOptionChainGrid(data)
{
    var sScripts = "";
    var lblScript = "lblScripts3";
    var token = "tokens"
    var LTP;
    OptionStrikeData = [];
    $.each(data.Result, function (i, row) {

        sScripts = sScripts.concat(row.BroadcastConstant + '.' + row.PutToken + ',');
 
        $('#lblScripts3').html(sScripts.substring(0, sScripts.length - 1));
        $('#lblScripts3').html($('#lblScripts3').html() + "," + "17.999908,17.999988,5.1")
        tokens.push(row.nToken);

        reconnectSocketAndSendTokens(lblScript);

        if (row.BroadcastConstant == 12 || row.BroadcastConstant == 13) {
            LTP = '<span><strong class= "' + row.BroadcastConstant + '_' + row.PutToken + '_LR">0.0000</strong></span>';
        }
        else {
            LTP = '<span><strong class= "' + row.BroadcastConstant + '_' + row.PutToken + '_LR">0.00</strong></span>';
        }

        OptionStrikeData.push(
            { cLTP: LTP }
        );

    })

    KendoAPIDialog("Option Chain", "optChain", 950, 410);

    $("#optionChainData").kendoGrid({
        dataSource: {
            data: OptionStrikeData
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
        columns: [
            {
                title: "CALL",
                headerAttributes: {
                    style: "text-align: center"
                },
                columns: [
                    {
                        title: "LTP",
                        headerAttributes: {
                            style: "text-align: center"
                        },
                        field: "cLTP",
                        template: "#= cLTP #"
                    },
                    {
                        title: "Change(%)",
                        headerAttributes: {
                            style: "text-align: center"
                        },
                        field: "cChng",
                        template: "#= cChng #"
                    }
                ]
            },
            {
                field: "STRIKE PRICE",
                headerAttributes: {
                    style: "text-align: center"
                },
            },
            {
                title: "PUT",
                headerAttributes: {
                    style: "text-align: center"
                },
                columns: [
                    {
                        title: "Change(%)",
                        headerAttributes: {
                            style: "text-align: center"
                        },
                        field: "pChng"
                    },
                    {
                        title: "LTP",
                        headerAttributes: {
                            style: "text-align: center"
                        },
                        field: "pLTP"
                    }
                ]
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
}

function buysellwindow(data)
{

    if (data.dataset.buysell == 1) {
        $("#radio-one").prop("checked", true);
        document.querySelector('#btntrade').innerHTML = 'BUY';
        $("#btntrade").css("background-color", "#4987ee")
        localStorage.setItem("BuySell", "Buy");

    } else if (data.dataset.buysell == 2) {
        $("#radio-two").prop("checked", true);
        document.querySelector('#btntrade').innerHTML = 'SELL';
        $("#btntrade").css("background-color", "#ca2222")
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
    topicName = data.dataset.exchangeconstants + '.' + data.dataset.token;

    //getDepth();
    

    DayClick();
    $("#txtqty").val('');
    $("#txtorderprice").val('');
    $("#txttrigprice").val('');
    $("#txtdisclosedqty").val('');

    var buySell = "";
    
    if (data.dataset.buysell == 1)
    {
        buySell = "Buy";
    } else if (data.dataset.buysell == 2)
    {
        buySell = "Sell";
    }

    $("#sellbuy").text(buySell);
    $("#scriptname").text(data.dataset.script);
    $('#scriptname').data('token', data.dataset.token);
    $('#scriptname').attr('data-buysell', data.dataset.buysell);
    //$('#scriptname1').attr('data-buysell', data.dataset.buysell);
    $('#scriptname').data('ExchangeID', data.dataset.exchangeid);
    //$('#scriptname1').html(data.dataset.script);
    //$('#scriptname1').data('token', data.dataset.token);

    nExchangeId = data.dataset.exchangeid;

    if (nExchangeId == 2) {
        $('#Select2').val('BSE');

    }
    else {
        $('#Select2').val('NSE');

    }

    var ExchangeName = GetExchangeType(nExchangeId);
    instrumentindex = GetInstrumentNumber(data.dataset.instrument);
    $('#markettype').data('stocktype', instrumentindex);


    $("#optStrike").html('<option selected="selected" class="service-small">' + data.dataset.strike + '</option>');

    if (data.dataset.cp == "C") {
        
        $("#optCallPut").html('<option selected="selected" class="service-small">CE</option>');
    }
    else if (data.dataset.cp == "P") {
        
        $("#optCallPut").html('<option selected="selected" class="service-small">PE</option>');
    }

    var segmentindex = GetStringInstrumentForDisplay(instrumentindex);
    

    if ($(this).attr("data-cp") == "C") {
        $('#segmenttype').html((ExchangeName) + ',' + segmentindex + ', CALL');
        //$('#segmenttype1').html((ExchangeName) + ',' + segmentindex + ', CALL');
    }
    else if ($(this).attr("data-cp") == "P") {
        $('#segmenttype').html((ExchangeName) + ',' + segmentindex + ', PUT');
        //$('#segmenttype1').html((ExchangeName) + ',' + segmentindex + ', PUT');
    }
    else {
        $('#segmenttype').html((ExchangeName) + ',' + segmentindex);
        //$('#segmenttype1').html((ExchangeName) + ',' + segmentindex);
    }

    $('#segmenttype').attr("data-segement", segmentindex);
    //$('#segmenttype1').attr("data-segement", segmentindex);

    $("#txtdisclosedqty").val('0');

    if (segmentindex == 'CURR') {
        $("#txtorderprice").attr("step", tickpriceCurrency);
        $("#txtorderprice").attr("min", tickpriceCurrency);
        $("#txtorderprice").val(parseFloat($('.' + ltpid + '_LR').text()).toFixed(4));

        $("#ltp").text(parseFloat($('.' + ltpid + '_LR').text()).toFixed(4));
        $("#txttrigprice").attr("step", tickpriceCurrency);
        $("#txttrigprice").attr("min", tickpriceCurrency);

    }
    else {
        $("#txtorderprice").attr("step", tickprice);
        $("#txtorderprice").attr("min", tickprice);
        $("#txtorderprice").val(parseFloat($('.' + ltpid + '_LR').text()).toFixed(2));

        $("#ltp").text(parseFloat($('.' + ltpid + '_LR').text()).toFixed(2));
        $("#txtorderprice").val(parseFloat($('.' + ltpid + '_LR').text()).toFixed(2));
    }


    if (data.dataset.expirydate != "") {
        $("#expirydate").html('<option selected="selected" class="service-small">' + formatDate(data.dataset.expirydate, '', "DD MMM YYYY") + '</option>');
    }

    $("#txtorderprice").attr("data-price", parseFloat($('.' + ltpid + '_LR').text()).toFixed(4));

    $("#cmbSegment1").val(GetInstrumentNumber(data.dataset.instrument));

    VarMargin1(nExchangeId, data.dataset.token, GetInstrumentNumber(data.dataset.instrument));

    if (GetInstrumentNumber(data.dataset.instrument) == 3) {

        var sScript = $("#scriptname").html();
        GetClientHolding(sScript);

    }

    if (GetInstrumentNumber(data.dataset.instrument) == 1 || GetInstrumentNumber(data.dataset.instrument) == 2 || GetInstrumentNumber(data.dataset.instrument) == 4 || GetInstrumentNumber(data.dataset.instrument) == 5) {

        var nToken = $("#scriptname").data("token");
        var CNCMIS = 0;
        GetNetPositionforFO(nToken, CNCMIS);
    }

    ShowHide();
    
    KendoWindow("windowbuysell", 650, 540, buySell, 0, true);

    //$("#windowbuysell").closest(".k-window").css({
    //    top: 250,
    //    left: 200
    //});

    

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
        
        $("#lblesttot").text('');
        $("#lotsize").html('1');

        SetEstTotal($("#txtqty").val(), $("#txtorderprice").val());
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
    } else if ($('input[name="oType"]:checked').val() == 3 || $('input[name="oType"]:checked').val() == 12)
    {
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

    if (GetInstrumentNumber(data.dataset.instrument) == 3)
    {
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

        sinstrument = GetInstrumentNumber(data.dataset.instrument);

        var nqty = $("#txtqty").val();

        var segment = $("#cmbSegment1").val();
        var buyorsell = data.dataset.buysell;

        GetRequiredStockMargin(nCncMis, nToken, Exchange, nOrderAmt, buyorsell, nqty, segment);
        
    }

   // $(".typeRadio").click();

}


$(document).on("click", "#cnc", function (event) {
    $("#scriptname").data("token");
    $("#markettype").data("stocktype");

    var Exchange = $("#Select2").val();
    var nQty = $("#txtqty").val();

    var nBuySell;
    if (localStorage.getItem("BuySell") == "Buy") {
        nBuySell = 1;
    } else if (localStorage.getItem("BuySell") == "Sell") {
        nBuySell = 2;
    }

    
    var nOrderAmt = $("#txtorderprice").val();

    GetRequiredStockOrMargin(0, $("#scriptname").data("token"), Exchange, nOrderAmt, nBuySell, nQty, $("#cmbSegment1").val());

    GetNetPositionDetails($("#scriptname").data("token"), $("#markettype").data("stocktype"), 0);
    GetNetPositionforFO($("#scriptname").data("token"), 0);

});


function GetClientHolding(sScript)
{
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
        sUserid: 3010098,
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
            // console.log(data);
            if (data.Result != "No Data Found") {
                $.each(data.Result.Result, function (i, row) {
                    $("#Hqty").html(row.nQty);
                    $("#HVal").html(row.nClosingValuation);
                })

            } else {
                $("#HVal").html("0");
                $("#Hqty").html("0");
            }

        }
    });

}


$('#mis').click(function () {
    $("#scriptname").data("token");
    $("#markettype").data("stocktype");
    
    var Exchange = $("#Select2").val();
    var nQty = $("#txtqty").val();

    var nBuySell;
    if (localStorage.getItem("BuySell") == "Buy") {
        nBuySell = 1;
    } else if (localStorage.getItem("BuySell") == "Sell") {
        nBuySell = 2;
    }

    var nOrderAmt = $("#txtorderprice").val();
    
    GetRequiredStockOrMargin(1, $("#scriptname").data("token"), Exchange, nOrderAmt, nBuySell, nQty, $("#cmbSegment1").val());

    GetNetPositionDetails($("#scriptname").data("token"), $("#markettype").data("stocktype"), 1);
    GetNetPositionforFO($("#scriptname").data("token"), 1);

});


$("#txtqty").change(function () {
    
    if ($("#txtqty").val() == 0)
    {
        $("#txtqty").val($("#txtqty").attr("min"));
        return;
    }

    var QTTY = $("#txtqty").val();
    safe = floatSafeModulus(parseFloat(QTTY), parseFloat($("#txtqty").attr("data-lotsize")));
    if (safe != 0) {
        QTTY = $("#txtqty").val();
        $("#txtqty").val(floatSafeModulusQty(parseFloat(QTTY), parseFloat(safe), $('#segmenttype').attr("data-segement")));
    }

    var nToken = $("#scriptname").data("token");


    var sinstrument = GetInstrumentNumber($('#segmenttype').attr("data-segement"));
    var nQty = $("#txtqty").val();

    var nCncMis;
    if ($("#cnc").is(":checked")) {
        nCncMis = 0;
    } else if ($("#mis").is(":checked")) {
        nCncMis = 1;
    }

    var nBuySell;
    if ($("#btnbuy").hasClass("active")) {
        nBuySell = 1;
    } else if ($("#btnsell").hasClass("active")) {
        nBuySell = 2;
    }

    var nOrderNo = $('#scriptname').data('orderid');

    var Exchange = $("#Select2").val();

    var nOrderAmt = $("#txtorderprice").val();

    //GetRequiredStockOrMargin(nCncMis, $("#scriptname").data("token"), Exchange, nOrderAmt, nBuySell, nQty, $("#cmbSegment1").val());



    SetEstTotal($("#txtqty").val(), $("#txtorderprice").val());
});

function ShowHide() {
    
    var StockType = $("#markettype").data("stocktype")

    if (StockType == 2 || StockType == 5 || StockType == 7) { //option
    
        $("#expDate").show();
        $("#sPrice").show();
        $("#nOption").show();

        //$("#expirydate1").show();
        //$("#optStrike1").show();
        //$("#optCallPut1").show();

    }
    if (StockType == 1 || StockType === 4 || StockType == 6) { //future
        $("#expDate").show();
        $("#sPrice").hide();
        $("#nOption").hide();

        //$("#expirydate1").show();
        //$("#optStrike1").hide();
        //$("#optCallPut1").hide();

    }

    if (StockType == 3 || StockType == 8 || StockType == 9) { //cash
        $("#expDate").hide();
        $("#sPrice").hide();
        $("#nOption").hide();

        //$("#expirydate1").hide();
        //$("#optStrike1").hide();
        //$("#optCallPut1").hide();

    }
}

//$('.typeRadio').change(function () {

//    $('.typeRadio').click();
//    SetEstTotal($("#txtqty").val(), $("#txtorderprice").val());
//});

$('.typeRadio').click(function () {

    return false;
    var OrderType = $('input[name="oType"]:checked').val();
    if (OrderType == 1 || OrderType == 11) {
        document.getElementById('Ioc').disabled = false;
        document.getElementById('txttrigprice').disabled = true;

        $("#txtdisclosedqty").val('0');
        document.getElementById('txtdisclosedqty').disabled = false;
    }
    else if (OrderType == 3 || OrderType == 12) {

        document.getElementById('Ioc').disabled = true;
        document.getElementById('txttrigprice').disabled = false;

        DayClick();
        if (OrderType == 12) {
            $("#trtxtdisclosedqty").invisible = true;
            $("#txtdisclosedqty").val('');
            document.getElementById('txtdisclosedqty').disabled = true;
        }
        $("#txtdisclosedqty").val('');
        document.getElementById('txtdisclosedqty').disabled = true;
    }
});

function IocClick()
{
    $("#Ioc").prop("checked", true);

    document.getElementById('txtdisclosedqty').disabled = true;
    $('#txtdisclosedqty').val("");
}

function DayClick()
{
    $("#Day").prop("checked", true);
    document.getElementById('txtdisclosedqty').disabled = true;
    $('#txtdisclosedqty').val("");
    //if ($('#segmenttype').attr("data-segement") == "FUTURE" || $('#segmenttype').attr("data-segement") == "OPTION") {
    //    $("#trtxtdisclosedqty").invisible = true;
    //    document.getElementById('txtdisclosedqty').disabled = true;
    //    $('#txtdisclosedqty').val("");
    //}
    //else {
    //    $("#trtxtdisclosedqty").visible = true;
    //    if ($("#ordertype").val() == 1 || $("#ordertype").val() == 11) {
    //        document.getElementById('txtdisclosedqty').disabled = false;
    //    }
    //}
}



$("#Day").keydown(function (e) {
    tabKeyPressed = e.keyCode == 9;
    if (tabKeyPressed) {
        e.preventDefault();
        return;
    }
});

$("#Day").keyup(function (e) {

    if (tabKeyPressed) {
        $("#Ioc").focus();
        $("#Ioc").css("border", "1px solid #000000");

        e.preventDefault();
        return;
    }
});

$("#Ioc").keydown(function (e) {
    tabKeyPressed = e.keyCode == 9;
    if (tabKeyPressed) {
        e.preventDefault();
        return;
    }
});

$("#Ioc").keyup(function (e) {

    if (tabKeyPressed) {
        $("#ordertype").focus();
        $("#ordertype").css("border", "1px solid #000000");

        e.preventDefault();
        return;
    }
});

function ExchangeChange()
{
    nExchangeId = $("#lstSegment").val();   
};

$(document).on("click", "#btncancelbuysell", function (event) {

    $("#windowbuysell").data("kendoWindow").close();

});

function tradebutton()
{


    if ($("#txtqty").val() == "0" || $("#txtqty").val() == "") {
        alert('Quantity cannot be less than 1');
        return;
    }

    $('#btnConfirmOrder').prop("disabled", false);
    $('#btntrade').prop("disabled", true);

    /*getCTCLID();*/

    if ((gblCTCLtype.toString().toLocaleLowerCase() == "emp" || gblCTCLtype.toString().toLocaleLowerCase() == "ba") && $("#cmbClients").val() == "All") {
        alert("Please select Client Name");
        return;
    }

    var TotalQty, Price, OrderType, TriggerPrice
    TotalQty = $("#txtqty").val();
    Price = $("#txtorderprice").val();
    OrderType = parseInt($('input[name="oType"]:checked').val());
    TriggerPrice = $("#txttrigprice").val();


    if ($("#scriptname").data("ExchangeID") != "2") {
        var safe = 0;
        if ($("#markettype").data("stocktype") == 6 || $("#markettype").data("stocktype") == 7) {
            safe = floatSafeModulus(parseFloat(Price), parseFloat(tickpriceCurrency));
        } else {
            safe = floatSafeModulus(parseFloat(Price), parseFloat(tickprice));
        }
        if (safe != 0) {
            alert('Price should be multiple of Tick Price')
            return;
        }
    }

    if ($("#markettype").data("stocktype") == 6 || $("#markettype").data("stocktype") == 7) {
        if (Price.indexOf('.') !== -1) {
            if ((Price.substr(Price.indexOf('.') + 1)).length != 4) {
                alert('Enter Four Digits after Price for Currency');
                return;
            }
        }
        else {
            alert('Enter Four Digits after Price for Currency');
            return;
        }
    }

    if (TotalQty.length == '') {
        alert('Please enter Quantity');
        return;
    } else {
        if (jQuery.isNumeric(TotalQty)) {

        } else {
            alert('Please enter number');
        }
    }

    if (Price.length == '') {
        alert('Please enter Order Price');
        return;
    } else {
        if (jQuery.isNumeric(Price)) {

        } else {
            alert('Please enter  number');
        }
    }

    if (OrderType == 11 || OrderType == 12) {
        if (Price != 0) {
            alert('Price should not be greater than Zero');
            return;
        }
    }

    if (OrderType == 12 || OrderType == 3) {
        if (TriggerPrice <= 0) {
            alert('Trigger Price should be greater than Zero');
            return;
        }
    }

    SaveRecord();

}

//$(document).on("click", "#btntrade1", function (event) {
 
//});

function SaveRecord() {
    var empclientid = '';

    if (gblCTCLtype.toString().toLocaleLowerCase() == "emp" || gblCTCLtype.toString().toLocaleLowerCase() == "ba") {

        empclientid = $("#cmbClients").val();
        Source = "C";
    } else {
        empclientid = gblnUserId;
        Source = "W";
    }

    var sScript = $("#scriptname").text();
    var Token = $("#scriptname").data("token");
    var BuySell = $("#scriptname").attr("data-buysell");
    var TotalQty = parseInt($("#txtqty").val());
    var ExchangeID = $("#scriptname").data("ExchangeID");
    var Price = parseFloat($("#txtorderprice").val());
    var StockType = $("#markettype").data("stocktype");

    if ($("#markettype").data("stocktype") == "8" || $("#markettype").data("stocktype") == "9") {
        StockType = 3
    }

    var Expiry = '';
    var CP = '';
    var Strike = 0;
    
    var OrderType = parseInt($("#ordertype").val());
    var TriggerPrice = parseFloat($("#txttrigprice").val());
    var DQ = parseInt($("#txtdisclosedqty").val());
    var MarketPrice = $("#ltp").text();
    var successstring = '';
    var buysellstring = '';

    if (BuySell == 1) {
        buysellstring = 'BUY'
    }
    else {
        buysellstring = 'SELL'
    }

    if (ExchangeID == 1) {
        successstring = '<h1>YOUR ORDER TO ' + buysellstring + '<br>' + sScript + '(' + $("#segmenttype").html() + ')<br><b>' + $("#txtqty").val().toString() + 'SHARES @ ₹' + $("#txtorderprice").val().toString() + '</b><br> WAS PLACED</h1>';
    }
    else {
        successstring = '<h1>YOUR ORDER TO ' + buysellstring + '<br>' + sScript + '(' + $("#segmenttype").html() + ')<br><b>' + $("#txtqty").val().toString() + 'SHARES @ ₹' + $("#txtorderprice").val().toString() + '</b><br> WAS PLACED</h1>';
    }

    $('#successmsg').html(successstring);

    var CncMis;
    if ($('#cnc').is(':checked')) {
        CncMis = 0;
    }
    else if ($('#mis').is(':checked')) {
        CncMis = 1;
    }

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

    var NewBOIFlag = "0";

    if ($("#hfldBOIYN").val().toString() == "Y" || $("#txtSelectedClient").css('color') == "rgb(0, 0, 255)") {
        NewBOIFlag = 1;
    }
    else {
        NewBOIFlag = 0;
    }
    var ClientCode = $("#txtSelectedClient").val().split('-')[0].trim();
    var NewOrderParams = JSON.stringify({
        'userId': ClientCode,
        'sScript': sScript,
        'Token': Token,
        'BuySell': BuySell,
        'TotalQty': TotalQty,
        'Price': Price,
        'StockType': StockType,
        'Expiry': Expiry,
        'CP': CP,
        'Strike': Strike,
        'OrderType': 1,
        'TriggerPrice': TriggerPrice,
        'DayIoc': DayIoc,
        'DQ': DQ,
        'MarketPrice': MarketPrice,
        'Source': Source,
        'OrderHandling': CncMis,
        'ExchangeId': ExchangeID,
        'CTCLId': gblCTCLid,//"400072565016",
        'IsBoiOrder': 0
    });

    $.ajax({
        //url: gblurl + "OrderV5/",
        url: "https://ctcl.investmentz.com/iCtclServiceT/api/OrderV5/",
        type: 'POST',
        contentType: 'application/json',
        data: NewOrderParams,
        dataType: "json",
        complete: function (data, status, xhr)
        {
            $('#btntrade').prop("disabled", false);
            
            if (JSON.parse(data.responseText).ResultStatus == 1) {

                KendoWindow("modrmsvalidation", 450, 160, "Order", 0, true);
                $('#displayrms').html("" + JSON.parse(data.responseText).Result);

            } else if (JSON.parse(data.responseText).ResultStatus == 3) {

                //$('#OrderResult').html("Order Request Created with ID : " + JSON.parse(data.responseText).Result.Id);

                KendoWindow("myModalnt", 450, 225, "Order", 0, true);
                var window = $("#windowbuysell").data('kendoWindow');

                window.close();
                //var npRefresh;
                //if (npRefresh != undefined && npRefresh != null)
                //    npRefresh();
            }
            else {
                $('#modrmsvalidation').modal('show');
                $('#displayrms').html("" + JSON.parse(data.responseText).Result);

            }

        },
        error: function (data) {
            console.log('there is some error');
        },
    })
}

function openScripDetail(data)
{
    var scripToken = data.dataset.exchangeconstants + '.' + data.dataset.token;
    RefreshScriptsDetail(scripToken);
}

function fntblshow(data)
{
    var v = JSON.parse(JSON.parse(data).Body);
    var sqe = JSON.parse(JSON.parse(data).SeqNo)

    var IssDate = v.IssueStartDate
    var ReAdmDate = v.ReAdmDate
    var ExpulsionDate = v.ExpulsionDate
    var IntPayDate = v.IntPayDate
    var ExpiryDate = v.ExpiryDate
    var NoDeliveryStartDate = v.NoDeliveryStartDate
    var ListingDate = v.ListingDate
    var NoDeliveryEndDate = v.NoDeliveryEndDate
    var TenderPeriodStartDate = v.TenderPeriodStartDate
    var TenderPeriodEndDate = v.TenderPeriodEndDate
    var DeliveryStartDate = v.DeliveryStartDate
    var DeliveryEndDate = v.DeliveryEndDate

    if (v.IssueStartDate.toString().substring(0, 10) == "1979-12-31") { IssDate = "NA" } else { IssDate = v.IssueStartDate.toString().substring(0, 10) }
    if (v.ReAdmDate.toString().substring(0, 10) == "1979-12-31") { ReAdmDate = "NA" } else { ReAdmDate = v.ReAdmDate.toString().substring(0, 10) }
    if (v.ExpulsionDate.toString().substring(0, 10) == "1979-12-31") { ExpulsionDate = "NA" } else { ExpulsionDate = v.ExpulsionDate.toString().substring(0, 10) }
    if (v.IntPayDate.toString().substring(0, 10) == "1979-12-31") { IntPayDate = "NA" } else { IntPayDate = v.IntPayDate.toString().substring(0, 10); }
    if (v.ExpiryDate.toString().substring(0, 10) == "1979-12-31") { ExpiryDate = "NA" } else { ExpiryDate = v.ExpiryDate.toString().substring(0, 10); }
    if (v.NoDeliveryStartDate.toString().substring(0, 10) == "1979-12-31") { NoDeliveryStartDate = "NA" } else { NoDeliveryStartDate = v.NoDeliveryStartDate.toString().substring(0, 10); }
    if (v.ListingDate.toString().substring(0, 10) == "1979-12-31") { ListingDate = "NA" } else { ListingDate = v.ListingDate.toString().substring(0, 10); }
    if (v.NoDeliveryEndDate.toString().substring(0, 10) == "1979-12-31") { NoDeliveryEndDate = "NA" } else { NoDeliveryEndDate = v.NoDeliveryEndDate.toString().substring(0, 10); }
    if (v.TenderPeriodStartDate.toString().substring(0, 10) == "1979-12-31") { TenderPeriodStartDate = "NA" } else { TenderPeriodStartDate = v.TenderPeriodStartDate.toString().substring(0, 10); }
    if (v.TenderPeriodEndDate.toString().substring(0, 10) == "1979-12-31") { TenderPeriodEndDate = "NA" } else { TenderPeriodEndDate = v.TenderPeriodEndDate.toString().substring(0, 10); }
    if (v.DeliveryStartDate.toString().substring(0, 10) == "1979-12-31") { DeliveryStartDate = "NA" } else { DeliveryStartDate = v.DeliveryStartDate.toString().substring(0, 10); }
    if (v.DeliveryEndDate.toString().substring(0, 10) == "1979-12-31") { DeliveryEndDate = "NA" } else { DeliveryEndDate = v.DeliveryEndDate.toString().substring(0, 10); }

    var tbl = "<table>" +
                "<tr>" +
                    "<td align='right'>Local Update Time</td>" +
                    "<td align='right'>" + v.LocalUpdateTime + "</td>" +
                "</tr>"+
              "</table>"+
              "<table>" +
                "<tr>" +
                    "<td class='valign'>" +
                        "<table width='100%' cellpadding='0' cellspacing='0'>" +
                            "<tr>" +
                                "<td>Exchange</td>" +
                                "<td>" + v.Exchange + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Symbol</td>" +
                                "<td>" + v.Symbol + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Series</td>" +
                                "<td>" + v.Series + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Trading Symbol</td>" +
                                "<td>" + v.TradingSymbol + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Scrip Token</td>" +
                                "<td>" + v.ScripToken + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Scrip Name</td>" +
                                "<td>" + v.ScripName + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Board Lot Qty</td>" +
                                "<td>" + v.Symbol + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Tick Size</td>" +
                                "<td>" + v.TickSize + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Instrument Type</td>" +
                                "<td>" + v.InstrumentType + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Strike Price</td>" +
                                "<td>" + v.StrikePrice + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Issue Rate</td>" +
                                "<td>" + v.IssueRate + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Issued Capital</td>" +
                                "<td>" + v.IssuedCapital + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Permitted To Trade</td>" +
                                "<td>" + v.PermittedToTrade + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Cover Trigger</td>" +
                                "<td>" + v.CoverTrigger + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Warning</td>" +
                                "<td>" + v.Warning + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Priceunit</td>" +
                                "<td>" + v.Priceunit + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Quantity Unit</td>" +
                                "<td>" + v.Quantityunit + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Delivery Unit</td>" +
                                "<td>" + v.Deliveryunit + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Price Numerator</td>" +
                                "<td>" + v.PriceNumerator + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Price Denominator</td>" +
                                "<td>" + v.PriceDenominator + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Book Cls Start Time</td>" +
                                "<td></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Book Cls End Time</td>" +
                                "<td></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Credit Rating</td>" +
                                "<td></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Price Quotation(KGS)</td>" +
                                "<td></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Lower Circuit Limit</td>" +
                                "<td></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Higher Circuit Limit</td>" +
                                "<td></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Other Sell Margin</td>" +
                                "<td></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Exposure Margin Per</td>" +
                                "<td></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Buy Carrying Cost</td>" +
                                "<td></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>Sell Carrying Cost</td>" +
                                "<td></td>" +
                           "</tr>" +
                        "</table>" +
                    "</td>" +
                    "<td class='valign'>" +
                    "<table width='100%' cellpadding='0' cellspacing='0'>" +
                        "<tr>" +
                                "<td>General Numerator</td>" +
                                "<td>" + v.GeneralNumerator + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>General Denominator</td>" +
                                "<td>" + v.GeneralDenominator + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Listing Date</td>" +
                                "<td>" + ListingDate + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Issue Start Date</td>" +
                                "<td>" + IssDate + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Issue Maturity Date</td>" +
                                "<td>" + IssDate + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>ReAdm Date</td>" +
                                "<td>" + ReAdmDate + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Expulsion Date</td>" +
                                "<td>" + ExpulsionDate + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>IntPay Date</td>" +
                                "<td>" + IntPayDate + "</td>" +
                        "</tr>" +

                        "<tr>" +
                                "<td>Expiry Date</td>" +
                                "<td>" + ExpiryDate + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>No Delivery Start Date</td>" +
                                "<td>" + NoDeliveryStartDate + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>No Delivery End Date</td>" +
                                "<td>" + NoDeliveryEndDate + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Tender Period Start Date</td>" +
                                "<td>" + TenderPeriodStartDate + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Tender Period End Date</td>" +
                                "<td>" + TenderPeriodEndDate + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Delivery Start Date</td>" +
                                "<td>" + DeliveryStartDate + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Delivery End Date</td>" +
                                "<td>" + DeliveryEndDate + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Market Type</td>" +
                                "<td>" + v.MarketType + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Max Order Size(In lots)</td>" +
                                "<td>" + v.MaxOrderSizeInlots + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>IM Spread Benefit</td>" +
                                "<td>" + v.IMSpreadBenefit + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Remarks</td>" +
                                "<td>" + v.Remarks + "</td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Record Date</td>" +
                                "<td></td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Freeze</td>" +
                                "<td></td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Delivery Unit</td>" +
                                "<td></td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Open Interest</td>" +
                                "<td></td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Last Trading Date</td>" +
                                "<td></td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Sell Var Margin</td>" +
                                "<td></td>" +
                        "</tr>" +

                        "<tr>" +
                                "<td>Buy Var Margin</td>" +
                                "<td></td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Value Traded Today</td>" +
                                "<td></td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>DPR</td>" +
                                "<td></td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Other Buy Margin</td>" +
                                "<td></td>" +
                        "</tr>" +
                        "<tr>" +
                                "<td>Change In Open Interest</td>" +
                                "<td></td>" +
                        "</tr>" +
                    "</table>" +
                    "</td>" +
                    "</tr>" +
                    "</table>";
                
                    $("#sDetails").html(tbl);

                    KendoWindow("modScripDetails", 950, 460, "Scrip Details", 0, true);
}

function getDepth()
{
    var SymbolName = "";
    var ScripName = "";
    var Instrument = "";
    var Exchange = "";


    var grid2 = $("#WatchList").data("kendoGrid");

    var gridFirst = grid2.dataSource.options.data[0];


    DepthColumns = [];

    var grid = $("#WatchList").data("kendoGrid");
    var selectedItem = grid.dataItem(grid.select());

    if (selectedItem != null)
    {
        topicName = selectedItem.nExchangeConstants + '.' + selectedItem.nToken;
        SymbolName = selectedItem.sScript;
        Instrument = selectedItem.sInstrument;
        Exchange = selectedItem.nExchangeID;
    } else {
        topicName = gridFirst.nExchangeConstants + '.' + gridFirst.nToken;
        SymbolName = gridFirst.sScript;
        Instrument = gridFirst.sInstrument;
        Exchange = gridFirst.nExchangeID;
    }
    
    ScripName = Instrument + '- ' + GetExchangeType(Exchange) + '\xa0\xa0' + SymbolName;

    $("#sScripName").html(ScripName);

    var scrip = topicName.split('.');

    var instrumentindex = GetInstrumentNumber(gridFirst.sInstrument);

    getLotSize(scrip[1], instrumentindex);

    RefreshScriptsLevel2(topicName);
    //reconnectSocketAndSendTokens();
    var LTP = "<span id='lblLTP'></span>";
    var Change = "<span id='lblChng'></span>";
    var PerChange = "<span id='lblPercChange'></span>";

    $("#nLTP").html(LTP);
    $("#nChange").html(Change);
    $("#nChangePerc").html(PerChange);

    var BidQty1 = "<span id='lblTopBidQty1'></span>";
    var BidQty2 = "<span id='lblTopBidQty2'></span>";
    var BidQty3 = "<span id='lblTopBidQty3'></span>";
    var BidQty4 = "<span id='lblTopBidQty4'></span>";
    var BidQty5 = "<span id='lblTopBidQty5'></span>";

    var BidPrice1 = "<span id='lblTopBidRate1'></span>";
    var BidPrice2 = "<span id='lblTopBidRate2'></span>";
    var BidPrice3 = "<span id='lblTopBidRate3'></span>";
    var BidPrice4 = "<span id='lblTopBidRate4'></span>";
    var BidPrice5 = "<span id='lblTopBidRate5'></span>";

    var AskPrice1 = "<span id='lblTopAskRate1'></span>";
    var AskPrice2 = "<span id='lblTopAskRate2'></span>";
    var AskPrice3 = "<span id='lblTopAskRate3'></span>";
    var AskPrice4 = "<span id='lblTopAskRate4'></span>";
    var AskPrice5 = "<span id='lblTopAskRate5'></span>";

    var AskQty1 = "<span id='lblTopAskQty1'></span>";
    var AskQty2 = "<span id='lblTopAskQty2'></span>";
    var AskQty3 = "<span id='lblTopAskQty3'></span>";
    var AskQty4 = "<span id='lblTopAskQty4'></span>";
    var AskQty5 = "<span id='lblTopAskQty5'></span>";

    var tot = "<span id='' class='depth2'>Total Qty</span>";
    var BidPrice = "<span id='lblTopBidQtyTotal'></span>";;
    var AskPrice = "<span id='' class='depth2'>Total Qty</span>";
    var AskQty = "<span id='lblTopAskQtyTotal'></span>";

    var OILable = "<span id='' class='depth2'>OI</span>";
    var OI = "<span id='lblOI'></span>";
    var OIChangeLable = "<span id='' class='depth2'>OI Change</span>";
    var OIChange = "<span id='lblOI'>N/A</span>";

    var lableAvgPrice = "<span id='' class='depth2'>Avg Price</span>";
    var AvgPrice = "<span id='lblAP'></span>";
    var lableminAvgPrice = "<span id='' class='depth2'>30 Min Avg Price</span>";
    var TminAvg = "<span id='lblMAP'></span>";

    var lableTotalValue = "<span id='' class='depth2'>Total Value</span>";
    var TotalValue = "<span id='lbltotalvalue'></span>";
    var lableVolume = "<span id='' class='depth2'>Volume</span>";
    var Volume = "<span id='lblVolume'></span>";

    var lableOpen = "<span id='' class='depth2'>OPEN</span>";
    var Open = "<span id='lblOpen'></span>";
    var lableHigh = "<span id='' class='depth2'>HIGH</span>";
    
    var High = "<span id='lblHigh'></span>";
    var labelLow = "<span id='' class='depth2'>LOW</span>";
    var Low = "<span id='lblLow'></span>";
    var lableHigh52 = "<span id='' class='depth2'>52 WK HIGH</span>";
    var High52Week = "<span id='lblHigh52'></span>";
    var lableLowCkt = "<span id='' class='depth2'>LOW CKT LIM</span>";
    var LowCKTLIM = "<span id='lblLowLim'></span>";

    var lableClose = "<span id='' class='depth2'>CLOSE (LTP)</span>";
    var Close = "<span id='lblClose'></span>";
    var lablePrevClose = "<span id='' class='depth2'>PREV CLOSE</span>";
    var PrevClose = "<span id='lblPrevClose'></span>";
    var lableChange = "<span id='' class='depth2'>CHANGE</span>";
    var Change = "<span id='lblChange'></span>";
    var lableLow52 = "<span id='' class='depth2'>52 WK LOW</span>";
    var Low52Week = "<span id='lblLow52'></span>";
    var lableUppCKT = "<span id='' class='depth2'>UPP CKT LIM</span>";
    var UppCKTLIM = "<span id='lblUpLim'></span>";

    DepthColumns.push(
        { BidQty: BidQty1, BidPrice: BidPrice1, AskPrice: AskPrice1, AskQty: AskQty1 },
        { BidQty: BidQty2, BidPrice: BidPrice2, AskPrice: AskPrice2, AskQty: AskQty2 },
        { BidQty: BidQty3, BidPrice: BidPrice3, AskPrice: AskPrice3, AskQty: AskQty3 },
        { BidQty: BidQty4, BidPrice: BidPrice4, AskPrice: AskPrice4, AskQty: AskQty4 },
        { BidQty: BidQty5, BidPrice: BidPrice5, AskPrice: AskPrice5, AskQty: AskQty5 },
        { BidQty: "-", BidPrice: "-", AskPrice: "-", AskQty: "-" },

        { BidQty: tot, BidPrice: BidPrice, AskPrice: AskPrice, AskQty: AskQty },
        { BidQty: OILable, BidPrice: OI, AskPrice: OIChangeLable, AskQty: OIChange },
        { BidQty: lableAvgPrice, BidPrice: AvgPrice, AskPrice: lableminAvgPrice, AskQty: TminAvg },
        { BidQty: lableTotalValue, BidPrice: TotalValue, AskPrice: lableVolume, AskQty: Volume },
        { BidQty: "-", BidPrice: "-", AskPrice: "-", AskQty: "-" },

        { BidQty: lableOpen, BidPrice: Open, AskPrice: lableClose, AskQty: Close },
        { BidQty: lableHigh, BidPrice: High, AskPrice: lablePrevClose, AskQty: PrevClose },
        { BidQty: labelLow, BidPrice: Low, AskPrice: lableChange, AskQty: Change },
        { BidQty: lableHigh52, BidPrice: High52Week, AskPrice: lableLow52, AskQty: Low52Week },
        { BidQty: lableLowCkt, BidPrice: LowCKTLIM, AskPrice: lableUppCKT, AskQty: UppCKTLIM }
        
    );


    $("#users-grid").kendoGrid({
        
        dataSource: {
            data: DepthColumns
            //pageSize: 10 // specifying the pagesize inside the datasource fixed my problem (Nan-Nan of 1 items)
        },
        filterable: {
            multi: true,
            search: true
        },
        height: 275,
        navigatable: true,
        selectable: 'row',
        scrollable: true,
        sortable: true,
        resizable: true,
        // pageable: true,
        reorderable: true,
        columnMenu: true,
        columnShow: function (e) {
            // console.log(e.column.field); // displays the field of the hidden column
        },
        columns: [
          {
              title: "Bid Qty",
              width: 90,
              field: "BidQty",
              template: "#= BidQty #"
          },
          {
              title: "Bid Price",
              width: 90,
              field: "BidPrice",
              template: "#= BidPrice #"
          },
          {
              title: "Ask Price",
              width: 90,
              field: "AskPrice",
              template: "#= AskPrice #"
          },
          {
              title: "Ask Qty",
              width: 90,
              field: "AskQty",
              template: "#= AskQty #"
          }

        ],
        navigatable: true,
        selectable: 'row'
    });
    var data = $("#users-grid").data('kendoGrid');
    var arrows = [37, 38, 39, 40];
    data.table.on("keydown", function (e) {

        if (arrows.indexOf(e.keyCode) >= 0) {
            setTimeout(function () {
                data.select($("#users-grid_active_cell").closest("tr"));
            }, 1);
        }
    });

}

function getgrid2()
{
    $("#users-grid2").kendoGrid({
        dataSource: gridDs,
        columns: [
        {
            field: "channel", title: "Channel", width: 100
        },
        {
            field: "users", title: "Users", format: "{0:n0}", width: 80
        },
        {
            field: "channel", title: "Channel", width: 100
        }, {
            field: "users", title: "Users", format: "{0:n0}", width: 80
        },
        {
            field: "channel", title: "Channel", width: 100
        }, {
            field: "users", title: "Users", format: "{0:n0}", width: 80
        }]
    });
}

$(document).keydown(function (e) {

    if (e.which == 112 && isCtrl == false) {
        alert("Yes");
        e.preventDefault();
    }
    if (e.which == 113 && isCtrl == false) {
        alert("No");
        

        e.preventDefault();
        return;
    }

});