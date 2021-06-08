$(document).ready(function () {
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

        $.ajax({
            url: "/Login/btnLogin_Click",
            type: "GET",
            data: {
                LoginID: LoginID,
                LoginPassword: Loginpassword
            },
            dataType: "json",
            success: function (data) {
              //  alert(data);
                if (data == "modMpinValidate") {
                    $("#modMpinValidate").show();
                }
                if (data == "") {

                } else {
                    $("#modForceLogout").show();
                    $("#flogoutmsg").html(data);
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
                alert("Your login ID has been send on your registered Mobile No and Email id.");
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
            url: "/Login/btnFPwdProceed_Click",
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
            url: "/Login/btnFPwdProceed_Click",
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
            url: "/Login/btnFPwdProceed_Click",
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
                alert(data)
                alert(MobileNumber);
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
            url: "/Login/btnCPSave_Click",
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
                alert(data)
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
            url: "/Login/btnForceLogout_Click",
            type: "GET",
            data: {
                LoginID: LoginID,
                LoginPassword: Loginpassword
            },
            dataType: "json",
            success: function (data) {
                alert(data.Data);

                if (data.Data == "modMpinValidate") {
                    $("#modMpinValidate").show();
                }

                if (data != "") {
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
            url: "/Login/btnCancelMPinVerification_Click",
            type: "GET",
            data: {
                txtLoginMPin: txtLoginMPin,
                LoginID: LoginID
            },
            dataType: "json",
            success: function (data) {
                var str = data;
                var res = str.split("()");
                var status = res;
                var BAName = res[0];
                var BACode = res[1];
                $("#BANameCode").val(data);
                localStorage.setItem("NameCode", data)
                if (data = ! "") {
                    location.href = "http://localhost:49180/Home/Index"
                }
               

            },
            error: function (data) {
                console.log(data);
            }
        });
    })
});