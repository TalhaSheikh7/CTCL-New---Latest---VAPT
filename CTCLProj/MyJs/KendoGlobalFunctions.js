var popup = "";
$(document).ready(function () {

    $("#tilelayout").kendoTileLayout({
        containers: [
        {
            colSpan: 0,
            rowSpan: 0,
            header: {
                text: "WatchList",
                Height: 0
            },
            bodyTemplate: kendo.template($("#WatchList-template").html())
        }, {
            colSpan: 0,
            rowSpan: 0,
            header: {
                text: "Market Depth"
            },
            bodyTemplate: kendo.template($("#users-grid-template").html())
        //}, {
        //    colSpan: 5,
        //    rowSpan: 2,
        //    header: {
        //        text: "Users by Channel"
        //    },
        //    bodyTemplate: kendo.template($("#users-grid-template2").html())
        }],
        gap: {
            rows: 0
        },
        columns: 0,
        columnsWidth: 0,
        rowsHeight: 0,
        reorderable: true,
        resizable: true,
        navigatable: true,
        resize: function (e) {
            var rowSpan = e.container.css("grid-column-end");
            var chart = e.container.find(".k-chart").data("kendoChart");
            // hide chart labels when the space is limited
            if (rowSpan === "span 1" && chart) {
                chart.options.categoryAxis.labels.visible = false;
                chart.redraw();
            }
            // show chart labels when the space is enough
            if (rowSpan !== "span 1" && chart) {
                chart.options.categoryAxis.labels.visible = true;
                chart.redraw();
            }

            // for widgets that do not auto resize
            // https://docs.telerik.com/kendo-ui/styles-and-layout/using-kendo-in-responsive-web-pages
            kendo.resize(e.container, true);
        }
    });

});

function GetExchangeType(exhangeid) {
    
    if (exhangeid == 1) {
        return "NSE";
    }
    else if (exhangeid == 2) {
        return "BSE";
    }
}
function GetOrdetype(sotype) {
    var Otypval = '';

    if (sotype == 1) {
        Otypval = 'LIMIT'
    }
    else if (sotype == 2 || sotype == 11) {
        Otypval = 'MARKET'
    }
    else if (sotype == 3) {
        Otypval = 'STOP LOSS'
    }
    else if (sotype == 4 || sotype == 12) {
        Otypval = 'STOP LOSS MARKET'
    }
    else {
        Otypval = '-'
    }
    return Otypval;
}
function GetInstrumentNumber(sinstrument) {
    sinstrument = sinstrument.trim();
    var constval = '';

    if (sinstrument == "INDEX_FUTURE" || sinstrument == "FUTIDX") {
        constval = 1; // show FUTURE
    }
    else if (sinstrument == "INDEX_OPTION" || sinstrument == "OPTIDX") {
        constval = 2; //OPTION
    }
    else if (sinstrument == "CASH" || sinstrument == "EQ" || sinstrument == "CASH_EQ") {
        constval = 3; //CASH
    }
    else if (sinstrument == "CASH_BE") {
        constval = 8; //CASH_BE
    }
    else if (sinstrument == "CASH_SM") {
        constval = 9; //CASH_SM
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

function GetStringInstrumentForDisplay(ninstrument) {
    var constval = '';

    if (ninstrument == 1) {
        constval = "FUTURE";
    }
    else if (ninstrument == 2) {
        constval = "OPTION";
    }
    else if (ninstrument == 3) {
        constval = "CASH";
    }
    else if (ninstrument == 4) {
        constval = "FUTURE";
    }
    else if (ninstrument == 5) {
        constval = "OPTION";
    }
    else if (ninstrument == 6) {
        constval = "CURR";
    }
    else if (ninstrument == 7) {
        constval = "CURR";
    }
    return constval;
}

function floatSafeModulus(val, step) {
    var valDecCount = (val.toString().split('.')[1] || '').length;
    var stepDecCount = (step.toString().split('.')[1] || '').length;
    var decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    var valInt = parseInt(val.toFixed(decCount).replace('.', ''));
    var stepInt = parseInt(step.toFixed(decCount).replace('.', ''));
    return (valInt % stepInt) / Math.pow(10, decCount);
}

function floatSafeModulusQty(val, step, segment) {
    var x = parseFloat(val.toString()) - (step);
    return parseFloat(x);
}

function floatSafeModulus1(val, step, segment) {
    var x = parseFloat(val.toString()) - (step);
    if (segment == "CURR") {
        return parseFloat(x).toFixed(4);
    }
    else { return parseFloat(x).toFixed(2); }
}

function GetStringInstrument(ninstrument, cashtype) {

    var constval = '';
    if (ninstrument == 3) {
        constval = "CASH";

        if (cashtype != undefined || cashtype != null)
            constval += "_" + cashtype;
    }
    else if (ninstrument == 1) {
        constval = "INDEX_FUTURE";
    }
    else if (ninstrument == 2) {
        constval = "INDEX_OPTION";
    }
    else if (ninstrument == 4) {
        constval = "CASH_FUTURE";
    }
    else if (ninstrument == 5) {
        constval = "CASH_OPTION";
    }

    else if (ninstrument == 6) {
        constval = "CURRENCY_FUTURE";
    }
    else if (ninstrument == 7) {
        constval = "CURRENCY_OPTION";
    }
    return constval;
}

function GetExpiry(sInstrument, Expiry) {
    var retval = '';
    if (sInstrument == "CASH" || sInstrument == 3) {

        return retval;
    }
    else {
        retval = Expiry;
        var retval1 = new Date(Expiry);
        if (retval1.getDate() >= 10) {
            retval = retval1.getDate() + '/'
        }
        else {


            retval = '0' + retval1.getDate() + '/';
        }

        if (retval1.getMonth() + 1 >= 10) {
            retval = retval + (retval1.getMonth() + 1) + '/' + retval1.getFullYear();
        }
        else {


            retval = retval + '0' + (retval1.getMonth() + 1) + '/' + retval1.getFullYear();
        }

        return retval;
    }
}

function MainKendoWindow(windowId, Width, Height, Top, Left, Title)
{
    var myWatchList = $("#" + windowId);

    myWatchList.kendoWindow({
        
        title: Title,
        draggable: true,
        resizable: false,
        visible: false,
        actions: [
            "Minimize",
            "Maximize",
        ],
    }).data("kendoWindow").center().open();

    myWatchList.closest(".k-window").css({
        width: Width,
        top: Top,
        left: Left,
        height: Height,
        
    });
}

function KendoWindow(windowId, Width, Height, Title, Timer, Modal) 
{
    var kendoWindowAssign = $("#"+ windowId);
    var title = Title;
    kendoWindowAssign.kendoWindow({
        modal: Modal,
        width: Width + "px",
        height: Height + "px",
        iframe: true,
        resizable: false,
        title: title,
        content: "",
        visible: false
    });

    popup = $("#" + windowId).data('kendoWindow');
    popup.open();
    popup.center();

    if(Timer == 1)
    {
        setTimeout(function () {
            popup.close();
        }, 1000);
    }
}

function KendoDropDownList(DropId, DropDownData, ValueField, TextField, ChangeFunctionName, autobind, casccade, index)
{
    //console.log(DropDownData);
    $("#"+ DropId).kendoDropDownList({
        dataSource: DropDownData,
        dataValueField: ValueField,
        dataTextField: TextField,
        autobind: autobind,
        cascadeFrom: casccade,
        change: ChangeFunctionName,
        index: index,
        animation: {
            close: {
                effects: "zoom:out",
                duration: 200
            }
        }
    });

    var myDropDownList = $("#" + DropId);

    var remoteDropDown  = $("#" + DropId).data("kendoDropDownList");

    remoteDropDown.list.width("auto");

    myDropDownList.closest(".k-dropdownlist").css({
        'z-index': 2
    });
    
}

function KendoAPIDialog(Title, DialogId, Width, Height)
{
    var win = $("#" + DialogId).kendoAPDialog({
        title: Title,
        width: Width,
        height: Height,
        buttons: []
    }).data("kendoWindow").center().open();
}


(function (kendo, $) {
    var APDialog = kendo.ui.Window.extend({
        _buttonTemplate: kendo.template('<div class="k-ap-dialog-buttons"># $.each (buttons, function (idx, button) { # <button class="k-button #= button.class #">#= button.text #</button> # }) # </div>'),
        _contentTemplate: kendo.template('<div class="k-ap-dialog-body-wrapper"><div class="k-ap-dialog-body"></div></div>'),

        init: function (element, options) {
            var that = this;

            options.visible = options.visible || false;

            kendo.ui.Window.fn.init.call(that, element, options);
            $(element).data("kendoWindow", that);

            this.wrapper.addClass("k-ap-dialog");

            // Place the content in a scollable div.
            var html = $(element).html();
            $(element).html(that._contentTemplate(options));
            $(element).find("div.k-ap-dialog-body").append(html);

            // Create a div for the buttons.
            $(element).append(that._buttonTemplate(options));

            // Create the buttons.
            //$.each(options.buttons, function (idx, button) {
            //    if (button.click) {
            //        $($(element).parent().find(".k-ap-dialog-buttons .k-button")[idx]).on("click", { handler: button.click }, function (e) {
            //            e.data.handler({ button: this, dialog: that });
            //        });
            //    }
            //});


            that.bind("open", function (e) {
                that._onOpen();
            });
        },

        _onOpen: function () {
            // Don't let the dialog open larger than the viewport
            this.setOptions({ maxHeight: $(window).height() - 100 });
            this.center();
        },

        options: {
            name: "APDialog",
            minWidth: 300,
            resizable: true,
            visible: false,
            modal: true
        }
    });
    kendo.ui.plugin(APDialog);
})(window.kendo, window.kendo.jQuery);