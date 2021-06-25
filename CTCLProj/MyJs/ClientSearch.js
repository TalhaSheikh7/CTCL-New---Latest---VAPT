//Should be called from quickinvest.aspx.cs only
var setLoginEmp;

var getGlobalVariable, setGlobalVariable, getClntDetails, clearEmpStorageSmart;
var setSearchStripReadOnly, setSearchTrip;

//Constants
var common_url = "http://localhost:49180/"; //comment In Live
//var common_url = "https://ctcluat.investmentz.com/"; //uncomment in Live
var url_employee_clients_Live = "https://trade.investmentz.com/";
var gblurl1 = "https://trade.investmentz.com/EasyTradeApi/api/";

//Global variable Names Holder 
var logindIdKey = "TNLoggedInId";
var selectedClntKey = "TNSelectedClnt";
var LoginRoleKey = "TNLoginRole";
var searchClientDataKey = "AvailEmpClnts";

//TODO - do from init ... add reference and proceed. 

$(document).ready(function () {
    clearEmpStorageSmart = function (sJsId) {

        if (getGlobalVariable("js-Session-id", "") != sJsId) {
            setGlobalVariable("js-Session-id", sJsId);
            setGlobalVariable(selectedClntKey, "");
            //var CompressedClient = LZString.compress("");
            setGlobalVariable(searchClientDataKey, ""); // hvb @ 05/03/2019 save only compressed clients
        }

    }

    setLoginEmp = function (loginId, loginRole) {

        if (getGlobalVariable(logindIdKey, "") != loginId) {

            //New login clear cache data of client search.
            setGlobalVariable(selectedClntKey, "");
            setGlobalVariable(searchClientDataKey, ""); //commented hvb @ 05/03/2019
            //var CompressedClient = LZString.compress("");
            //setGlobalVariable(searchClientDataKey, CompressedClient); // hvb @ 05/03/2019 save only compressed clients

        }

        setGlobalVariable(logindIdKey, loginId);
        setGlobalVariable(LoginRoleKey, loginRole);
    }

    getGlobalVariable = function (variableName, defaultValue) {
        if (window.localStorage.getItem(variableName) == undefined || window.localStorage.getItem(variableName) == null) {
            //   setGlobalVariable(variableName, defaultValue);
            setGlobalVariable("js-Session-id", "");
            return defaultValue;
        }
        else
            return window.localStorage.getItem(variableName);
    };

    setGlobalVariable = function (variableName, value) {
        window.localStorage.setItem(variableName, value);
    };

    $("#btnCleanText").click(function () {
        $("#txtSelectedClient").val("");
        clearStorage();
        $("#txtSelectedClient").focus();
    });

    $("#txtSelectedClient").on("change keyup paste", clearStorage);
    function clearStorage() {
        if ($("#txtSelectedClient").val() == "") {
            $("#hdnSelectedClient").val("").trigger("change");
            setGlobalVariable(selectedClntKey, "");

            //    $("#clientcodemf").val($(".autocomplete-selected strong").html());
            $("#clientcodemf").val($("#hdnSelectedClient").val().split('-')[0].trim());
        }
    }

    $("#clientcodemf").val($("#hdnSelectedClient").val().split('-')[0].trim());

    //Added hvb 15/02/2019 for getting cached employee details 
    getClntDetails = function (loginid, isEmplogin, cbClntDetailsFetched) {
        //var data = getGlobalVariable(searchClientDataKey, ""); //commented hvb @ 05/03/2019
        //var CompressedClient = LZString.compress(""); //added hvb  @ 05/03/2019
        var data = getGlobalVariable(searchClientDataKey, "");

        if (data != "" && cbClntDetailsFetched != null && data.length > 19) {
            //Commented and modified hvb for compression @ 05/03/2019
            //cbClntDetailsFetched(JSON.parse(data));
            var decompData = LZString.decompress(data);
            cbClntDetailsFetched(JSON.parse(decompData));
        }
        else {
            if (data.length > 21) { return false; }

            var empBaCode = loginid;
            var voption = 0;
            if (isEmplogin == 'B') {
                voption = 1
            }
            else {
                voption = 3;
            }
            var GetClients = $.ajax(
            {
                url: url_employee_clients_Live + "InvestmentzAPI/api/EmpBaClients/",
                //url:"https://trade.investmentz.com/InvestmentzAPI/api/EmpBaClients?EmpBACode=ACM4859&Option=3",
                method: "get",
                data: {

                    EmpBACode: empBaCode,
                    //Option: (isEmplogin ? 3 : 1)
                    Option: voption
                },
                dataType: "json"
            });

            GetClients.done(function (msg) {
                //Commented and modified hvb for compression @ 05/03/2019
                //setGlobalVariable(searchClientDataKey, JSON.stringify(msg));
                setGlobalVariable(searchClientDataKey, LZString.compress(JSON.stringify(msg)));
                if (cbClntDetailsFetched != null)
                    cbClntDetailsFetched(msg);
            });
            GetClients.fail(function (jqXHR, textStatus) {
                alert("Failed to collect to client details for employee/ba!!");
            });
        }
    }

    setSearchStripReadOnly = function () {
        loadingSetup(true);
        var currentLoginId = getGlobalVariable(logindIdKey);
        var loginRole = getGlobalVariable(LoginRoleKey, "");
        if (loginRole == "") {
            loadingSetup(false);
            console.error("login role not set!!!");
            return;
        }
        if (loginRole != "C") {
            clientSearchDisplay_ReadOnly();
            var isEmp = (loginRole == "E");
            // var isEmp = (loginRole == "E" || loginRole == "B");
            var selectedClnt = getGlobalVariable(selectedClntKey, "");
            $("#txtSelectedClient").val(selectedClnt); // set in hidden field on text box change.
            $("#hdnSelectedClient").val(selectedClnt).trigger("change");

            loadingSetup(false);
        }
        else {
            loadingSetup(false);
            clientSearchDisplay(false);
            $("#clntSelectPbox").css("display", "none");
        }
    }

    setSearchTrip = function () {
        loadingSetup(true);
        var currentLoginId = localStorage.getItem("BACode");
        //var currentLoginId = getGlobalVariable(logindIdKey);
        var loginRole = getGlobalVariable(LoginRoleKey, "");
        if (loginRole == "") {
            loadingSetup(false);
            console.error("login role not set!!!");
            return;
        }
        if (loginRole != "C") {
            clientSearchDisplay(true);
            //var isEmp = (loginRole == "E");
            var isEmp = (loginRole);
            getClntDetails(currentLoginId, isEmp, function (empClients) {
                if (isEmp)
                    initAutoComplete(empClients.EmpBAClientMaster);
                else
                    initAutoComplete(empClients.EmpBAClientMaster.filter(function (arrayElement, n) { return arrayElement.BACode.toString().toLowerCase() === currentLoginId.toLowerCase() }));
                var selectedClnt = getGlobalVariable(selectedClntKey, "");
                $("#txtSelectedClient").val(selectedClnt); // set in hidden field on text box change.
                $("#hdnSelectedClient").val(selectedClnt).trigger("change");


                loadingSetup(false);
            });
        }
        else {
            loadingSetup(false);
            clientSearchDisplay(false);
            $("#imgIcon").css("display", "none");
        }
    }

    function loadingSetup(showLoading) {
        if (showLoading) {
            $("#iLoader").css("display", "inline-block");
            $("#imgIcon").css("display", "none");
        }
        else {
            $("#iLoader").css("display", "none");
            $("#imgIcon").css("display", "inline-block");
        }
    }

    function clientSearchDisplay(showClientSearch) {
        if (showClientSearch) {
            //$("#lblusername").css("display", "none");

            //----show client selection
            $("#txtSelectedClient").css("display", "inline-block");
            $("#btnCleanText").css("display", "inline-block");
            $("#clntSearchType").css("display", "inline-block");
        }
        else {
            //$("#lblusername").css("display", "inline-block");

            //----Hide client selection
            $("#txtSelectedClient").css("display", "none");
            $("#btnCleanText").css("display", "none");
            $("#clntSearchType").css("display", "none");
        }
    }

    function clientSearchDisplay_ReadOnly() {

        //$("#lblusername").css("display", "none");

        //----show client selection
        $("#txtSelectedClient").css("display", "inline-block");
        $("#btnCleanText").css("display", "none");
        $("#clntSearchType").css("display", "none");



    }

    // setup autocomplete function pulling from currencies[] array
    function initAutoComplete(datasource) {
        $('#txtSelectedClient').autocomplete({
            lookup: datasource,
            minChars: 3,
            maxHeight: 150,
            formatResult: function (dataElement, b) {
                var c = "(" + b.replace(RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\)", "g"), "\\$1") + ")";
                return dataElement["CommonClientCode"].toString().replace(RegExp(c, "gi"), "<strong>$1</strong>") + " - " + dataElement["ClientName"].replace(RegExp(c, "gi"), "<strong>$1</strong>")
            },
            lookupFilter: function (dataElement, b, searchText) {
                //alert(JSON.stringify(dataElement));
                //return -1 !== dataElement["value"].toLowerCase().indexOf(searchText);
                if ($("#clntSearchType").val() == "C")
                    return dataElement["CommonClientCode"].toString().toLowerCase().substring(0, searchText.length) === searchText.toLowerCase()
                else
                    return dataElement["ClientName"].toLowerCase().substring(0, searchText.length) === searchText.toLowerCase()
                //return dataElement["ClientName"].toLowerCase().substring(0,searchText.length) === searchText.toLowerCase();
            },
            onSelect: function (suggestion) {
                //var thehtml = '<strong>Person Code:</strong> ' + suggestion["CommonClientCode"] + ' <br> <strong>Person Name:</strong> ' + suggestion["ClientName"];
                //$('#outputcontent').html(thehtml);
                var dispText = suggestion["CommonClientCode"].toString() + " - " + suggestion["ClientName"];
                $(this).val(dispText);
                localStorage.setItem("LoginCode", suggestion["CommonClientCode"].toString());

                //$("#hdnSelectedClient").val(suggestion["CommonClientCode"]).trigger("change");
                $("#hdnSelectedClient").val(dispText).trigger("change"); //commented and mod hvb @ 21/02/2019
                setGlobalVariable(selectedClntKey, dispText);

                //for UserSrNo
                if (dispText != "" && dispText != null && dispText != undefined) {
                    var clientcode1 = $("#txtSelectedClient").val().split('-')[0].trim();
                    localStorage.setItem("_ClientCode", clientcode1);
                    window.location.reload();
                    $.ajax({
                        type: "GET",
                        url: common_url + "/Home/clientcheck",
                        // url: "/MutualFundNew/ShoppingCart/get_Cartcount",
                        //   url: "/ShoppingCart/get_Cartcount",
                        data: { clientcode: clientcode1 },
                        success: function (data) {

                            if (data[0].flag == "S") {
                                alert("OOPS,We are facing some issue with your account,for more information please contact our team on 022-28584545");
                                // window.location.href = "../Recommendation/Index";
                                return false;
                            }
                            else {

                                $.ajax({
                                    type: "POST",
                                    url: common_url + "/Home/UserSrNo",
                                    data: { ucc: dispText.toString().split('-')[0].trim() },
                                    success: function (data) {


                                        if (data != false && data != null && data != undefined) {
                                            localStorage.setItem("UserSrNo", data.UserSrNo.toString());
                                            localStorage.setItem("PanNo", data.PANNumber.toString());

                                            // window.location.reload();
                                        }
                                     //   window.location.reload();
                                    },
                                    error: function (data) {
                                        // console.log(data);
                                    }
                                })
                            }
                            // window.location.reload();
                        },
                        error: function (data) {
                            // console.log(data);
                        }
                    })
                }

                //end usersrno

            }
        });
        //TODO-Change this.
        if (datasource.length > 0) {
            $('#txtSelectedClient').removeAttr("disabled");
            $("#clntSearchType").removeAttr("disabled");
        }
    }


});