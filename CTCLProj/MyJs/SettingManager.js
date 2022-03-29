$(document).ready(function () {

});


$(document).on("click", "#btnSave", function (event) {
    alert("Yes");
    // var CurrentMarketWatchWidth = document.getElementById("WatchlistSet").offsetWidth / $(window).width() * 100;

    //window.parent.$("#WatchlistSet").data("kendoWindow").options.height
    //var parentWidth = $('.k-webkit').css('width');
    //var marketWatchWidth = $('#colorDrop').css('width')

    //-----WatchListWidth-----
    var watchListWidth = window.parent.$("#WatchlistSet").data("kendoWindow").options.width;
    var MarketWatchwidth = '';    
    if (watchListWidth.includes('%')) {
        MarketWatchwidth = watchListWidth;
    } else if (watchListWidth.includes('px')) {
        MarketWatchwidth = (parseInt(window.parent.$("#WatchlistSet").data("kendoWindow").options.width) / $(window).width() * 100).toFixed(2) + '%'
    }

    //-----WatchListHeight-----
    var watchListHeight = window.parent.$("#WatchlistSet").data("kendoWindow").options.height;
    var MarketWatchHeight = '';
    if (watchListHeight.includes('%')) {
        MarketWatchHeight = watchListHeight;

    } else if (watchListHeight.includes('px')) {
        MarketWatchHeight = (parseInt(window.parent.$("#WatchlistSet").data("kendoWindow").options.height) / $(window).height() * 100).toFixed(2) + '%'
    }


    //-----MarketDepthWidth-----
    var MarketDepthWidth = window.parent.$("#DepthWindow").data("kendoWindow").options.width;
    var DepthWindowwidth = '';
    if (MarketDepthWidth.includes('%')) {
        DepthWindowwidth = MarketDepthWidth;
    } else if (MarketDepthWidth.includes('px')) {
        DepthWindowwidth = (parseInt(window.parent.$("#DepthWindow").data("kendoWindow").options.width) / $(window).width() * 100).toFixed(2) + '%'
    }

    //-----MarketDepthHeight-----
    var watchListHeight = window.parent.$("#DepthWindow").data("kendoWindow").options.height;
    var DepthWindowheight = '';
    if (watchListHeight.includes('%')) {
        DepthWindowheight = watchListHeight;

    } else if (watchListHeight.includes('px')) {
        DepthWindowheight = (parseInt(window.parent.$("#DepthWindow").data("kendoWindow").options.height) / $(window).height() * 100).toFixed(2) + '%'
    }

    //-----TabWindowWidth-----
    var TabsWidth = window.parent.$("#tabWindow").data("kendoWindow").options.width;
    var TabWindowwidth = '';
    if (TabsWidth.includes('%')) {
        TabWindowwidth = TabsWidth;
    } else if (TabsWidth.includes('px')) {
        TabWindowwidth = (parseInt(window.parent.$("#tabWindow").data("kendoWindow").options.width) / $(window).width() * 100).toFixed(2) + '%'
    }

    //-----TabWindowHeight-----
    var TabsHeight = window.parent.$("#tabWindow").data("kendoWindow").options.height;
    var TabWindowHeight = '';
    if (TabsHeight.includes('%')) {
        TabWindowHeight = TabsHeight;

    } else if (TabsHeight.includes('px')) {
        TabWindowHeight = (parseInt(window.parent.$("#tabWindow").data("kendoWindow").options.height) / $(window).height() * 100).toFixed(2) + '%'
    }

    dataset =
    {
        Theme: $("#colorDrop").data("kendoDropDownList").select(),
        ThemeName: $("#colorDrop").data("kendoDropDownList").text(),
        MarketWatchWidth: MarketWatchwidth,
        MarketWatchHeight: MarketWatchHeight,
        DepthWindowwidth: DepthWindowwidth,
        DepthWindowheight: DepthWindowheight,
        TabWindowwidth: TabWindowwidth,
        TabWindowHeight: TabWindowHeight,
        WatchListGridOpt: kendo.stringify($("#WatchList").data("kendoGrid").getOptions())
    };

    var griddata = kendo.stringify($("#WatchList").data("kendoGrid").getOptions());

    console.log(griddata);

    saveSettings("M001", JSON.stringify(dataset));    
});

function saveSettings(ModuleId, settings)
{
    var datarow = {
        "CommonClientCode": gblnUserId,
        "ModuleId": ModuleId,
        "SettingDetails": settings,
        "LoginType": gblCTCLtype
    }
    $.ajax({
        url: common_url + "Settings/SaveUserSettings",
        type: 'POST',
        data: datarow,
        dataType: "json",
        success: function (data) {
            console.log(data);
            var grid = $("#WatchList").data("kendoGrid");

            grid.setOptions(JSON.parse(griddata));
        },
        error: function (data) {

        }
    })
}