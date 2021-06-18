//var Glbvar = "https://ctcluat.investmentz.com/"
    var Glbvar ="http://localhost:49180/"
$(document).ready(function () {
    localStorage.setItem("CTCLId", "");
    $("#btnLogin").click(function () {
        var LoginID = $("#txtUid").val();
        var Loginpassword = $("#txtPassWd").val();

        if (LoginID == "") {
            alert("User id should not be left blank!!")
            return false;
        }

        if (Loginpassword == "") {
            alert("Password should not be left blank!!")
            return false;
        }
      var strmsg = "";
        $.ajax({
            url:  Glbvar + "Login/btnLogin_Click",
            type: "GET",
            data: {
                LoginID: LoginID,
                LoginPassword: Loginpassword
            },
            dataType: "json",
            success: function (data) {
                var str = data.split(" ");
                 strmsg = str[0]
              //  alert(strmsg);

                if (strmsg == "Incorrect") {
                   // alert(data);

                    KendoWindow("remaeks", 650, 120, "", 0);
                    $("#remaeks").closest(".k-window").css({
                        top: 350,
                        left: 200
                    });
                    $("#remarkdetails").html(data)
                    return false;
                }
                
                if (data == "modMpinValidate")
                {
                    $("#modMpinValidate").show();
                }
                if (strmsg == "Login") {
                    $("#modForceLogout").show();
                    $("#flogoutmsg").html(data);
                    strmsg = "";
                }
              
            },
            error: function (data) {
                console.log(data);
            }
        });
    })
    
    $("#btnForgotLoginid").click(function () {
        var UCC = $("#forgotLoginId").val();

        $.ajax({
            url: "http://accountopening.investmentz.co.in/eKYC/api/eKYCMaster/ForgotLogin?Option=FL3&CCC='" + UCC + "'&MobOTP=0",
            type: "GET",
            data: {
            },
            dataType: "json",
            success: function (data) {
              //  alert("Your login ID has been send on your registered Mobile No and Email id.");
                KendoWindow("remaeks", 650, 120, "", 0);
                $("#remaeks").closest(".k-window").css({
                    top: 350,
                    left: 200
                });
                $("#remarkdetails").html("Your login ID has been send on your registered Mobile No and Email id.")
            },
            error: function (data) {
                console.log(data);
            }
        });
    })

    $("#btnFPwdProceed").click(function () {
        var Loginid = $("#txtFPwdLoginId").val();
        var MobileNumber = $("#txtFPwdMobileNo").val();
        var hFldOtpVisible = "F";//$('#hFldOtpVisible').val('F');
        var hFldPopupOperation = "FPWD";//$('#hFldPopupOperation').val('FPWD');
        var hFldOpenPopupId = "modForgotPwd";
        $.ajax({
            url: "https://ctcluat.investmentz.com/Login/btnFPwdProceed_Click",
            type: "GET",
            data: {
                Loginid: Loginid,
                MobileNumber: MobileNumber,
                hFldOtpVisible: hFldOtpVisible,
                hFldPopupOperation: hFldPopupOperation,
                hFldOpenPopupId: hFldOpenPopupId

            },
            dataType: "json",
            success: function (data) {
               // alert(data);
                $("#forgetpsdotp").show();
                $("#clientname").html(data);

            },
            error: function (data) {
                console.log(data);
            }
        });

    })

    $("#btnCreateId").click(function () {
        var Loginid = $("#txtFPwdLoginId").val();
        var MobileNumber = $("#txtFPwdMobileNo").val();
        var hFldOtpVisible = "F";//$("#hFldOtpVisible").val("F");
        var hFldPopupOperation = "FLOGIN"//$("#hFldPopupOperation").val("FLOGIN");
        $.ajax({
            url: Glbvar + "Login/btnFPwdProceed_Click",
            type: "GET",
            data: {
                Loginid: Loginid,
                MobileNumber: MobileNumber,
                hFldOtpVisible: hFldOtpVisible,
                hFldPopupOperation: hFldPopupOperation

            },
            dataType: "json",
            success: function (data) {

            },
            error: function (data) {
                console.log(data);
            }
        });

    })


    $("#FPWDOTP").click(function () {
        $("#modForgotPwd").hide();
        $("#forgetpsdotp").show();
        var Loginid = $("#txtFPwdLoginId").val();
        var MobileNumber = $("#txtFPwdMobileNo").val();
        var hFldOtpVisible = "T";//$("#hFldOtpVisible").val("F");
        var hFldPopupOperation = "FPWD"//$("#hFldPopupOperation").val("FLOGIN");
        var txtFPwdOTP = $("#txtFPwdOTP1").val();
        $.ajax({
            url: Glbvar + "Login/btnFPwdProceed_Click",
            type: "GET",
            data: {
                Loginid: Loginid,
                MobileNumber: MobileNumber,
                hFldOtpVisible: hFldOtpVisible,
                hFldPopupOperation: hFldPopupOperation,
                txtFPwdOTP: txtFPwdOTP

            },
            dataType: "json",
            success: function (data) {

                $("#forgetpsdotp").hide();
                $("#changePWD").show();
              //  alert(data)

                KendoWindow("remaeks", 650, 120, "", 0);
                $("#remaeks").closest(".k-window").css({
                    top: 350,
                    left: 200
                });
                $("#remarkdetails").html(data)
              //  alert(MobileNumber);
            },
            error: function (data) {
                console.log(data);
            }
        });
    })


    $("#btnCPSave1").click(function () {
        var Loginid = $("#txtFPwdLoginId").val();
        var txtChangePwd1 = $("#txtChangePwd11").val();
        var txtChangePwd2 = $("#txtChangePwd21").val();
        var hFldOpenPopupId = "modChangePwd";
        $.ajax({
            url: Glbvar + "Login/btnCPSave_Click",
            type: "GET",
            data: {
                txtChangePwd1: txtChangePwd1,
                txtChangePwd2: txtChangePwd2,
                hFldOpenPopupId: hFldOpenPopupId,
                Loginid: Loginid

            },
            dataType: "json",
            success: function (data) {

                $("#forgetpsdotp").hide();
                $("#changePWD").hide();
               // alert(data)
                KendoWindow("remaeks", 650, 120, "", 0);
                $("#remaeks").closest(".k-window").css({
                    top: 350,
                    left: 200
                });
                $("#remarkdetails").html(data)
               // alert(MobileNumber);
            },
            error: function (data) {
                console.log(data);
            }
        });
    })


    $("#btnForceLogout1").click(function () {

        var LoginID = $("#txtUid").val();
        var Loginpassword = $("#txtPassWd").val();

        $.ajax({
            url: Glbvar + "Login/btnForceLogout_Click",
            type: "GET",
            data: {
                LoginID: LoginID,
                LoginPassword: Loginpassword
            },
            dataType: "json",
            success: function (data) {
             //   alert(data.Data);

                if (data.Data == "modMpinValidate") {
                    $("#modForceLogout").hide();
                    $("#modMpinValidate").show();
                }

                if (data == "") {
                    $("#modForceLogout").show();
                    $("#flogoutmsg").html(data);
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    })

    $("#btnVerifyMPin").click(function () {

        var txtLoginMPin = $("#txtLoginMPin").val();
        var LoginID = $("#txtUid").val();
        $.ajax({
            url: Glbvar + "Login/btnCancelMPinVerification_Click",
            type: "GET",
            data: {
                txtLoginMPin: txtLoginMPin,
                LoginID: LoginID
            },
            dataType: "json",
            success: function (data) {
                var str = data;
                if (data.sName == null) {
                    KendoWindow("remaeks", 650, 120, "", 0);
                    $("#remaeks").closest(".k-window").css({
                        top: 350,
                        left: 200
                    });
                   // alert("Incorrect mPIN")
                    KendoWindow("remaeks", 650, 120, "", 0);
                    $("#remaeks").closest(".k-window").css({
                        top: 350,
                        left: 200
                    });
                    $("#remarkdetails").html("Incorrect mPIN")
                    return false;
                }
      
                var BAName = data.sName;
                var BACode = data.sTradingCode;
                
                var UserType = data.UserType;
                var Sessionid = data.Sessionid;
                var passwordsExpiry = data.passwordsExpiry;
                var BANameBACode = BAName + " (" + BACode + ")"
                $("#BANameCode").val(data);
                localStorage.setItem("NameCode", BANameBACode);
                localStorage.setItem("CCID", data.sTradingCode);
                localStorage.setItem("BACode", BACode);
                localStorage.setItem("EmpCTCLtype", UserType);
                if (UserType == "Emp") {
                    GetEmpCTCLId(BACode)
                    gblCTCLtype = getEmpDetails("EmpCTCLtype", "");
                }
                else {
                    GetBACTCLId(BACode)
                }

               
               

            },
            error: function (data) {
                console.log(data);
            }
        });
    })
});

function GetEmpCTCLId(EmpCode) {
    $.ajax({
        url: "https://ctcl.investmentz.com/iCtclServiceT/api/URLSecure/?UCC=" + EmpCode +"&UAction=2",
        type: "GET",
        data: {
        },
        dataType: "json",
        success: function (data) {
            //console.log(data);

            var CTCLID = data.EmpCTCL[0].CTCLID;

            localStorage.setItem("CTCLId", CTCLID);

           // alert(CTCLID);

            if (data = ! "") {
                location.href = Glbvar + "Home/Index"
            }
           
        },
        error: function (data) {
            console.log(data);
        }
    });
}


function GetBACTCLId(BACode) {
    $.ajax({
        url: "https://ctcl.investmentz.com/iCtclServiceT/api/BACtclData?CCode=" + BACode + "",
        type: "GET",
        data: {
        },
        dataType: "json",
        success: function (data) {
            console.log(data);
            var CTCLID = "";
            localStorage.setItem("CTCLId", CTCLID);
            if (data = ! "") {
                location.href = Glbvar + "Home/Index"
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}