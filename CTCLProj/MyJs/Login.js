
$(document).ready(function () {
    localStorage.setItem("CTCLId", "");
    localStorage.setItem("EmpCTCLtype", "");
    
    
});

///Afiya 28-10-2021
function CallTimer() {
    var timer = setInterval(function () {

        var count = parseInt($('#theTarget').html());
        if (count !== 0) {
            $('#theTarget').html(count - 1 + " Seconds");
        } else {
            clearInterval(timer);
        }
    }, 1000);
}; 

///*End*

$(".toggle-password").click(function () {

    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
        input.attr("type", "text");
    } else {
        input.attr("type", "password");
    }
});

$('.password-viewer').click(function () {
    if ($(this).hasClass('fa-eye')) {
        $(this).removeClass('fa-eye').addClass('fa-eye-slash');
        $('#txtLoginMPin').attr('type', 'text');
    } else {
        $(this).removeClass('fa-eye-slash').addClass('fa-eye'); $('#txtLoginMPin').attr('type', 'password');
    }
});

$("#forgotLoginId").keydown(function (e) {
    var k = e.which;
    var ok = k >= 65 && k <= 90 || // A-Z
        k >= 96 && k <= 105 || // a-z
        k >= 35 && k <= 40 || // arrows
        k == 8 || // Backspaces
        (!e.shiftKey && k >= 48 && k <= 57); // 0-9


    if (!ok) {
        e.preventDefault();
    }
});

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

$("#btnForgotLoginid").click(function () {
    var UCC = $("#forgotLoginId").val();
    if (UCC == "" || UCC == undefined) {
        swal("Please Enter Your ClientCode!");
        return false;
    }
    Encrypt(UCC, "HfldCCC");
    
    $.ajax({
        //url: "http://accountopening.investmentz.co.in/eKYC/api/eKYCMaster/ForgotLogin?Option=FL3&CCC="+ UCC +"&MobOTP=0",
        url: common_url + "Login/btnForgotLoginId",
        type: "GET",
        data: {
            CCC: $("#HfldCCC").val()
        },
        dataType: "json",
        success: function (data) {
            swal(data);
            $("#modFgtLogin").hide();
            //console.log(data.ForgotLogin[0].RespMessage);
            //if (data.ForgotLogin[0].Response == 1)
            //{
            //    swal("Your login ID has been send on your registered Mobile No and Email id.");
            //} else if(data.ForgotLogin[0].Response == 0) {
            //    swal(data.ForgotLogin[0].RespMessage);
            //}
            
            //KendoWindow("remaeks", 650, 120, "", 0);
            //$("#remaeks").closest(".k-window").css({
            //    top: 350,
            //    left: 200
            //});
            //$("#remarkdetails").html("Your login ID has been sent on your registered Mobile No and Email id.")
        },
        error: function (data) {
            console.log(data);
        }
    });
})

function Encrypt(data, id)
{
    var key = CryptoJS.enc.Utf8.parse(EncKey);
    var iv = CryptoJS.enc.Utf8.parse(EncKey);

    var encrypteddata = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

    $('#' + id).val(encrypteddata);
}

$("#btnFPwdProceed").click(function () {

    var Loginid = $("#txtFPwdLoginId").val();
    var MobileNumber = $("#txtFPwdMobileNo").val();

    if (Loginid == "") {
        swal("Please Enter LoginId");
        return false;
    }

    if (MobileNumber == "") {
        swal("Please Enter Mobile number");
        return false;
    }

    Encrypt(Loginid, "hFldLoginId");
    Encrypt(MobileNumber, "hFldMobileNo");

    //var encryptedpassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(MobileNumber), key,
    //    {
    //        keySize: 128 / 8,
    //        iv: iv,
    //        mode: CryptoJS.mode.CBC,
    //        padding: CryptoJS.pad.Pkcs7
    //    });

    //$('#hFldMobileNo').val(encryptedpassword);


    var hFldOtpVisible = "F";//$('#hFldOtpVisible').val('F');
    var hFldPopupOperation = "FPWD";//$('#hFldPopupOperation').val('FPWD');
    var hFldOpenPopupId = "modForgotPwd";

    if (MobileNumber.length < 10 || MobileNumber.length > 10) {
        swal("Mobile Number Should be off 10 digit");
        return false;
    }

    $.ajax({
        url: common_url + "Login/btnFPwdProceed_Click",
        type: "GET",
        data: {
            Loginid: $('#hFldLoginId').val(),
            MobileNumber: $('#hFldMobileNo').val(),
            hFldOtpVisible: hFldOtpVisible,
            hFldPopupOperation: hFldPopupOperation,
            hFldOpenPopupId: hFldOpenPopupId

        },
        dataType: "json",
        success: function (data) {
            if (data.ClientName == "Incorrect User") {
                $("#txtFPwdLoginId").val('');
                $("#txtFPwdMobileNo").val('');
                $("#modForgotPwd").hide();
                $("#anyonepopup").show();
                $("#commenpopup").html("Incorrect Login ID.")
                return false;
            } else if (data.ResponseCode == "7") {
                $("#txtFPwdLoginId").val('');
                $("#txtFPwdMobileNo").val('');
                $("#modForgotPwd").hide();
                $("#anyonepopup").show();
                $("#commenpopup").html("Number does not match with registered mobile number.");
                return false;
            }
            else {
                $("#forgetpsdotp").show();
                CallTimer();//Added by Afiya 28-10-2021.
                $("#clientname").html(data);
            }
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
        url: common_url + "Login/btnFPwdProceed_Click",
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

function FPWDOTP()
{
    $("#modForgotPwd").hide();
    $("#forgetpsdotp").show();
    CallTimer();//Added by Afiya 28-10-2021
    var Loginid = $("#txtFPwdLoginId").val();
    var MobileNumber = $("#txtFPwdMobileNo").val();
    var hFldOtpVisible = "T";//$("#hFldOtpVisible").val("F");

    if ($("#changeType").val() == "pwd") {
        var hFldPopupOperation = "FPWD";
    } else if ($("#changeType").val() == "mPin") {
        var hFldPopupOperation = "FMPIN";
    } else {

    }

    var txtFPwdOTP = $("#txtFPwdOTP1").val();
    $.ajax({
        url: common_url + "Login/btnFPwdProceed_Click",
        type: "GET",
        data: {
            Loginid: $('#hFldLoginId').val(),
            MobileNumber: $('#hFldMobileNo').val(),
            hFldOtpVisible: hFldOtpVisible,
            hFldPopupOperation: hFldPopupOperation,
            txtFPwdOTP: txtFPwdOTP

        },
        dataType: "json",
        success: function (data) {

            if (data.ResponseMsg == "OTP verified successfully.") {
                $("#txtFPwdOTP1").val('');
                $("#forgetpsdotp").hide();
                if ($("#changeType").val() == "pwd") {
                    $("#changePWD").show();
                } else if ($("#changeType").val() == "mPin") {
                    $("#modChangeMpin").show()
                } else {

                }
            } else {
                $("#txtFPwdOTP1").val('');
                $("#commenpopup").html(data.ResponseMsg);
                $("#anyonepopup").show();
                return false;
            }
            

            //KendoWindow("remaeks", 650, 120, "", 0);
            //$("#remaeks").closest(".k-window").css({
            //    top: 350,
            //    left: 200
            //});
            //$("#remarkdetails").html(data)
            // alert(MobileNumber);
        },
        error: function (data) {
            console.log(data);
        }
    });
}

//$("#FPWDOTP").click(function () {
    
//});

$("#txtChangemPin1, #txtChangemPin2").keypress(function (event) {
    return /\d/.test(String.fromCharCode(event.keyCode));
});

$("#btnCMPinSave").click(function () {
    var Loginid = $("#txtFPwdLoginId").val();
    var txtmPin1 = $("#txtChangemPin1").val();
    var txtmPin2 = $("#txtChangemPin2").val();
    
    var hFldOpenPopupId = "modChangeMpin";

    if (txtmPin1 == "") {
        swal("m-Pin Should Not Be Blank!");
        return false;
    } else if (txtmPin2 == "") {
        swal("Re-enter m-Pin Should Not Be Blank!");
        return false;
    } else if ($("#txtChangemPin1").val().length != 4) {
        swal("m-Pin should be of 4 digits only!");
        return false;
    } else if (txtmPin1.includes(" ")) {
        swal("m-Pin should not contain blank space!");
        return false;
    } else if (txtmPin1 != txtmPin2) {
        swal("Entered m-Pin should match with re-typed m-Pin!");
        return false;
    } else {
        $.ajax({
            url: common_url + "Login/btnCMPinSave_Click",
            type: "GET",
            data: {
                txtmPin1: txtmPin1,
                txtmPin2: txtmPin2,
                hFldOpenPopupId: hFldOpenPopupId,
                Loginid: Loginid
            },
            dataType: "json",
            success: function (data) {
                if (data.data == true) {
                    swal({
                        title: "Done!",
                        text: "You have successfully changed your M-Pin. Please login to continue.!",
                        type: "success"
                    }).then(function () {
                        location.reload();
                    });
                } else {
                    swal(data.data2);
                }
            },
            error: function (data) {

            }
        });
    }
});

$("#btnCPSave1").click(function () {
    var Loginid = $("#txtFPwdLoginId").val();
    var txtChangePwd1 = $("#txtChangePwd11").val();
    var txtChangePwd2 = $("#txtChangePwd21").val();
    var hFldOpenPopupId = "modChangePwd";
    $.ajax({
        url: common_url + "Login/btnCPSave_Click",
        type: "GET",
        data: {
            txtChangePwd1: txtChangePwd1,
            txtChangePwd2: txtChangePwd2,
            hFldOpenPopupId: hFldOpenPopupId,
            Loginid: Loginid

        },
        dataType: "json",
        success: function (data) {

            if (data == "You have successfully changed your password. Please Login with your New Password") {
                $("#forgetpsdotp").hide();
                $("#changePWD").hide();
                swal({
                    title: "Done!",
                    text: data,
                    type: "success"
                }).then(function () {
                    location.reload();
                });
            } else {
                swal(data);
                $("#txtChangePwd11").val('');
                $("#txtChangePwd21").val('');
            }
            
            // alert(data)
            
            

        },
        error: function (data) {
            console.log(data);
        }
    });
})

$("#btnForceLogout1").click(function () {
    var LoginID = $("#txtUid").val();
    var Loginpassword = $("#txtPassWd").val();

    Encrypt(LoginID, "hFldLoginId");
    Encrypt(Loginpassword, "hFldpassword");

    $.ajax({
        url: common_url + "Login/btnForceLogout_Click",
        type: "GET",
        data: {
            LoginID: $("#hFldLoginId").val(),
            LoginPassword: $("#hFldpassword").val()
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

    if (txtLoginMPin == "" || txtLoginMPin == undefined) {
        swal("Please Enter Your M-pin");
        return false;
    }

    Encrypt(LoginID, "hFlduserLoginId");
    Encrypt(txtLoginMPin, "hFldmpin");

    document.getElementById("Loginloading").style.display = "block";
    $.ajax({
        url: common_url + "Login/btnCancelMPinVerification_Click",
        type: "GET",
        data: {
            txtLoginMPin: $("#hFldmpin").val(),
            LoginID: $("#hFlduserLoginId").val()
        },
        dataType: "json",
        success: function (data) {
            var str = data;
            if (data.sName == null) {
                document.getElementById("Loginloading").style.display = "none";
                //KendoWindow("remaeks", 650, 120, "", 0);
                //$("#remaeks").closest(".k-window").css({
                //    top: 350,
                //    left: 200
                //});
                alert("Incorrect mPIN")
                //KendoWindow("remaeks", 650, 120, "", 0);
                //$("#remaeks").closest(".k-window").css({
                //    top: 350,
                //    left: 200
                //});
                // $("#remarkdetails").html("Incorrect mPIN")
                return false;
            }

            //getSettings(data.sTradingCode, data.UserType);

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
});

$('#btnForgotMpin').click(function () {
    $('#hFldPopupOperation').val('FMPIN');
    $('#modForgotPwdLabel').html('Forgot M-Pin');
    $('#lblForgotpwdUid').html('Login Id');
    $('#hFldOpenPopupId').val('modForgotPwd');
    $("#changeType").val('mPin');
    $('#txtFPwdLoginId').val('');
    $('#txtFPwdMobileNo').val('');

    $('#divOtpBlock').css('display', 'none');
    $('#txtFPwdOTP').val('');
    $('#lblFPwdError').html('');
    $('#hFldOtpVisible').val('F');
    $("#modForgotPwd").toggle();
    $(this).closest(".modal").hide();
});

const textbox = document.getElementById("txtPassWd");
textbox.addEventListener("keypress", function onEvent(event) {
    if (event.key === "Enter") {
        $("#btnLogin").click();
    }
});


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
    Encrypt(LoginID, "hFlduserLoginId");
    Encrypt(Loginpassword, "hFldpassword");

    $.ajax({
        url: common_url + "Login/btnLogin_Click",
        type: "GET",
        data: {
            LoginID: $("#hFlduserLoginId").val(),
            LoginPassword: $("#hFldpassword").val()
        },
        dataType: "json",
        success: function (data) {
            var str = data.split(" ");
            strmsg = str[0]
            //  alert(strmsg);

            if (strmsg == "Incorrect") {

                if (str[1] != "password") {
                    $("#anyonepopup").show();
                    $("#commenpopup").html("Wrong Credentials!!!");
                } else {
                    $("#anyonepopup").show();
                    $("#commenpopup").html("Wrong Credentials!!!   <br/>" + data);
                }
                

                //KendoWindow("remaeks", 650, 120, "", 0);
                //$("#remaeks").closest(".k-window").css({
                //    top: 350,
                //    left: 200
                //});
                //$("#remarkdetails").html(data)
                //return false;
            }

            if (data == "modMpinValidate") {
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

function GetEmpCTCLId(EmpCode) {
    $.ajax({
        url: gblurl + "URLSecure/?UCC=" + EmpCode +"&UAction=2",
        type: "GET",
        data: {
        },
        dataType: "json",
        success: function (data) {
            //console.log(data);

            var CTCLID = data.EmpCTCL[0].CTCLID;

            localStorage.setItem("CTCLId", CTCLID);
            document.getElementById("Loginloading").style.display = "none";
           // alert(CTCLID);
            if (data = ! "") {
                location.href = common_url + "Home/Index"
            }
           
        },
        error: function (data) {
            console.log(data);
        }
    });
}


function GetBACTCLId(BACode) {
    $.ajax({
        url: gblurl + "BACtclData?CCode=" + BACode + "",
        type: "GET",
        data: {
        },
        dataType: "json",
        success: function (data) {
            //console.log(data);
            var CTCLID = data.Result.CTCLID;
            localStorage.setItem("CTCLId", CTCLID);
            document.getElementById("Loginloading").style.display = "none";
            if (data = ! "") {
                location.href = common_url + "Home/Index"
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}