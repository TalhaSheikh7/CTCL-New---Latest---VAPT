$(document).ready(function () {
    getSettings();
});

function getSettings() {
    $.ajax({
        url: "https://ctcl.investmentz.com/iCtclServiceT/api/Settings/getUserSettings",
        type: "GET",
        data: {
            nCCC: gblnUserId
        },
        dataType: "json",
        success: function (data) {

            //console.log(data);

            if (data.Count > 0) {
                $("#WatchlistSet").closest(".k-window").css({
                    width: data.sUser.MarketWatchWidth,
                    height: data.sUser.MarketWatchHeight
                });

                try {
                    //$("#WatchlistSet").closest(".k-window").css({
                    //    width: data.sUser.MarketWatchWidth,
                    //    height: data.sUser.MarketWatchHeight
                    //});

                    $("#DepthWindow").closest(".k-window").css({
                        width: data.sUser.DepthWindowwidth,
                        height: data.sUser.DepthWindowheight
                    });

                    $("#tabWindow").closest(".k-window").css({
                        width: data.sUser.TabWindowwidth,
                        height: data.sUser.TabWindowHeight
                    });
                    //$("#WatchlistSet").data("kendoWindow").width(data.sUser.MarketWatchWidth + '%');
                }
                catch { }
                try {
                    themeChange(data.sUser.Theme)
                    //$("#colorDrop").data("kendoDropDownList").select(data.sUser.Theme);
                    $("#colorDrop").data("kendoDropDownList").text(data.sUser.ThemeName);
                }
                catch { }
                try {
                    //console.log(data.sUser.WatchListGridOpt);
                    var grid = $("#WatchList").data("kendoGrid");
                    grid.setOptions(JSON.parse(data.sUser.WatchListGridOpt));

                }
                catch { }
            }

            
        },
        error: function (data) {
            console.log(data);
        }
    })
}