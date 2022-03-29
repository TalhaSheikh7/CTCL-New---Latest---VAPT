using CTCLProj.com.investmentz.ekyctest;
using CTCLProj.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.UI;
using System.Data.Entity;
using CTCLProj.Class;
using static CTCLProj.Class.WebUser;
using investmentz.Models;
using System.Text;

namespace CTCLProj.Controllers
{
    public class LoginController : Controller
    {
        AuthenticateService client;
        // GET: Login
        public ActionResult Login()
        {
            string strRU = "";
            
            LoginDTO DTO = new LoginDTO();
            DTO.RU = strRU;

            if (Session[WebUser.SessionName] != null && ((WebUser)Session[WebUser.SessionName]).nSessionId > 0)
            {
                Dictionary<string, string> dictCheckLogin = new Dictionary<string, string>();
                dictCheckLogin.Add("LoginId", ((WebUser)Session[WebUser.SessionName]).sLoginId);
                dictCheckLogin.Add("SessionId", ((WebUser)Session[WebUser.SessionName]).sSessionID);
                dictCheckLogin.Add("ProductID", AcmiilConstants.PRODUCT_WEB);
                dictCheckLogin.Add("BrowserInfo", ((WebUser)Session[WebUser.SessionName]).sBrowser);
                dictCheckLogin.Add("DeviceInfo", AcmiilConstants.DEVICES_WEB);
                dictCheckLogin.Add("IPAdd", ((WebUser)Session[WebUser.SessionName]).sIpAddress);
                dictCheckLogin.Add("SType", AcmiilConstants.SESSION_VALIDATE);

                AcmiilApiResponse AcmResp = UtilityClass.ExternalApi<AcmiilApiResponse>(GlobalVariables.ACMIILBaseURL, "AcmiilService/Authenticate/SessionManage", dictCheckLogin).Result;

                if (Convert.ToInt32(AcmResp.RespCode) != 1)
                {
                    Session[WebUser.SessionName] = null;
                    Session["KycStatus"] = null;
                    return View(DTO);
                }
                else
                {
                    return Redirect("http://localhost:49180/Home/Index");
                }
            }
            else
            {
                var LoginValue = Request.QueryString["Value"];

                if (LoginValue == "true")
                {
                    Session["LoginTypes_"] = LoginValue;
                }
                else
                {
                   // Session["LoginTypes_"] = "";
                }



                if (Request.Url.AbsoluteUri.Contains("RU"))
                {
                    strRU = Request.Url.AbsoluteUri;
                    string[] array = strRU.Split('?');
                    strRU = array[1];
                    array = new string[] { };
                    array = strRU.Split('=');
                    strRU = array[1];

                }
                // return View();

                return View();
            }

            //    if (client == null)
            //    client = new AuthenticateService();
            //return View();
        }


        public JsonResult btnLogin_Click(string LoginID, string LoginPassword)
        {

            bool isSessionCreated = false;
            string strIpAddress = "";
            string strTemp = "";
            string hFldPopupOperation = "";
            string hFldOpenPopupId = "";
            string hfldUserId = "";
            string hfldLogoutPwd = "";
            string hfldIPAddress = "";
            string lblClientName = "";
            if (client == null)
                client = new AuthenticateService();
            strIpAddress = ClientIP;
            try
            {
                LoginID = AESEncrytDecry.DecryptStringAES(LoginID);
                LoginPassword = AESEncrytDecry.DecryptStringAES(LoginPassword);

                strIpAddress = ClientIP;//ClientIP; "120.63.142.234";//TODO: Use clientip when deploying


                strTemp = CryptoEngine.Encrypt(LoginPassword, EncryptionKey);

                AuthResponse resp = client.LoginAuthenticate(LoginID, strTemp, strIpAddress, AcmiilConstants.PRODUCT_WEB, RequestingBrowser);

                AcmiilApiServices service = new AcmiilApiServices();

                switch (Convert.ToInt32(resp.RespCode))
                {
                    case -1:
                        //Account locked , redirect to forget password page
                        //  ResetForgotPassword(resp.RespMessage, LoginID);
                        hFldPopupOperation = GlobalVariables.hFldPopupOperation1;
                        hFldOpenPopupId = GlobalVariables.hFldOpenPopupId1;
                        break;

                    case 1:


                        string strTemp1 = AcmiilApiServices.IsUserLoggedin(LoginID, AcmiilConstants.PRODUCT_WEB, client);

                        if (strTemp1 != "")
                        {
                            if (strTemp1.IndexOf("You are already logged") != -1)
                            {
                                hFldOpenPopupId = GlobalVariables.POPUP_FORCELOGOUT1;
                                hfldUserId = LoginID;
                                hfldLogoutPwd = LoginPassword;
                                hfldIPAddress = strTemp1 + ". Do you want to forcefully logout from the previous session?";
                                return Json(hfldIPAddress, JsonRequestBehavior.AllowGet);
                                //  GlobalFunctions.LogOut(Session, Response, Context, Page);
                            }
                        }
                        {
                            hFldOpenPopupId = GlobalVariables.POPUP_MPINVALIDATE1;
                            return Json(hFldOpenPopupId, JsonRequestBehavior.AllowGet);
                        }

                        //region commented by tsheikh 15/02/2022 as session creation will be done after M-Pin Verification
                        #region
                        //WebUser mObjloggedInUser = new WebUser();
                        //mObjloggedInUser.sLoginId = LoginID;
                        //mObjloggedInUser.bExpiryMessageShown = false;
                        //mObjloggedInUser.sExpiryDaysMessage = resp.RespMessage;
                        //Session["password"] = LoginPassword;

                        ////1. Create session
                        //resp = client.SessionManage(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, AcmiilConstants.SESSION_CREATE);
                        //switch (Convert.ToInt32(resp.RespCode))
                        //{

                            //case 1:

                            //// region commented by tsheikh 15/02/2022 as session will be created after M-Pin Validate
                            

                            //case 2:

                                //isSessionCreated = true;
                                //AcmiilEmpInfoResponse empInfo;

                                //mObjloggedInUser.sSessionID = Session.SessionID;
                                //mObjloggedInUser.sProduct = AcmiilConstants.PRODUCT_WEB;
                                //mObjloggedInUser.sBrowser = RequestingBrowser;
                                //mObjloggedInUser.sDevice = AcmiilConstants.DEVICES_WEB;
                                //mObjloggedInUser.sIpAddress = strIpAddress;

                                ////2. Fetch client
                                //List<ClientInfo> mLstclientInfos = service.GetClientInfo(LoginID);

                                ////Read info and set client session object
                                //if (mLstclientInfos.Count == 1)
                                //{

                                    //if (mLstclientInfos[0].Status == 0)
                                    //{
                                        ////Error ??
                                        //ViewBag.Message = String.Format("Get Info Error : {0}", mLstclientInfos[0].ResponseMessage);
                                        //AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                                        ////client.SessionManage(txtUid.Text, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, AcmiilConstants.SESSION_LOGOUT);
                                    //}
                                    //else
                                    //{
                                        //mObjloggedInUser.sName = mLstclientInfos[0].ClientName;
                                        //mObjloggedInUser.sUserType = mLstclientInfos[0].UserType;

                                        //if (mLstclientInfos[0].UserType.ToUpper() == "BA")//added by tsheikh for BA login in CTCL
                                        //{
                                            //mObjloggedInUser.AddSegment(MarketSegments.FO, mLstclientInfos[0].CommonClientcode, mLstclientInfos[0].ClientCode, "Y", "Y");

                                            //Session[WebUser.SessionName] = mObjloggedInUser;

                                            //string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo(); setEmpDetails('" + "" + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                            ////ScriptManager.RegisterStartupScript(this, typeof(Page), "CCIDfn", script, false);
                                        //}
                                        //else if (mLstclientInfos[0].UserType == "Emp")
                                        //{

                                            //if (GlobalVariables.IsCTCLEnabled.ToUpper() == "FALSE")
                                            //{
                                                ////    Page.ClientScript.RegisterStartupScript(GetType(), "msgbox", "alert('CTCL Login is not allowed, please check URL'); ", true);
                                                ////    return;
                                            //}

                                            //mObjloggedInUser.AddSegment(MarketSegments.FO, mLstclientInfos[0].CommonClientcode, mLstclientInfos[0].ClientCode, "Y", "Y");

                                            //Session[WebUser.SessionName] = mObjloggedInUser;

                                            //empInfo = service.GetEmployeeInfo(mLstclientInfos[0].CommonClientcode);

                                            //if (empInfo.EmpCTCL.Count > 0)
                                            //{
                                                //if (empInfo.EmpCTCL[0].MsgCode == 0)
                                                //{
                                                    //ViewBag.Message = String.Format("Get EmpInfo Error : {0}", empInfo.EmpCTCL[0].Msg);
                                                    //AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                                                    //Session[WebUser.SessionName] = null; //if no ctcl id found 
                                                //}
                                                //else
                                                //{
                                                    //foreach (EmpCTCL empCtclInfo in empInfo.EmpCTCL)
                                                        //mObjloggedInUser.AddEmpInfo(empCtclInfo);

                                                    //Session[WebUser.SessionName] = mObjloggedInUser;


                                                    ////here it is coming employee details so set it along with common client code

                                                    ////string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); clearClntDetails(); clearClntInfo(); setEmpDetails('" + mObjloggedInUser.GetEmployeeDetail(MarketSegments.CM).CTCLID + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                                    //string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo(); setEmpDetails('" + mObjloggedInUser.GetEmployeeDetail(MarketSegments.CM).CTCLID + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                                    ////ScriptManager.RegisterStartupScript(this, typeof(Page), "CCIDfn", script, false);

                                                    ////string script1 = " <script type=\"text/javascript\"> setTimeout(function(){ clearClntDetails(); },150);   </script> ";
                                                    ////ScriptManager.RegisterStartupScript(this, typeof(Page), "CTCLIDfn", script1, false);
                                                //}


                                            //}
                                            //else
                                            //{
                                                //ViewBag.Message = String.Format("Get EmpInfo Error : {0}", "something went wrong with employee info api");
                                                //AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                                            //}
                                        //}
                                        //else
                                        //{
                                            ////cliental login

                                            //// in a session store client data

                                            //MarketSegments enSegmentType = MarketSegments.NotRecognised;

                                            //switch (mLstclientInfos[0].Segment)
                                            //{
                                                //case AcmiilConstants.SEGMENT_FO:
                                                    //enSegmentType = MarketSegments.FO;
                                                    //break;
                                                //case AcmiilConstants.SEGMENT_EQ:
                                                    //enSegmentType = MarketSegments.CM;
                                                    //break;
                                                //case AcmiilConstants.SEGMENT_CD:
                                                    //enSegmentType = MarketSegments.CD;
                                                    //break;
                                            //}
                                            ////mObjloggedInUser.AddSegment(enSegmentType, mLstclientInfos[0].CommonClientcode.ToString(), mLstclientInfos[0].ClientCode, mLstclientInfos[0].ActiveFlag, mLstclientInfos[0].TrdAllowed);

                                            //mObjloggedInUser.AddSegment(enSegmentType, mLstclientInfos[0].CommonClientcode.ToString(), mLstclientInfos[0].ClientCode, mLstclientInfos[0].ActiveFlag, mLstclientInfos[0].TrdAllowed, mLstclientInfos[0].ETFlag, mLstclientInfos[0].BOIFlag, mLstclientInfos[0].SynFlag, mLstclientInfos[0].UserType, mLstclientInfos[0].POAFlag);
                                            //Session[WebUser.SessionName] = mObjloggedInUser;
                                            ////System.Diagnostics.Debug.WriteLine(mObjloggedInUser.ToString());




                                            ////string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); clearClntDetails(); clearClntInfo();},150);   </script> ";
                                            //string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo();},150);   </script> ";

                                            ////ScriptManager.RegisterStartupScript(this, typeof(Page), "CCIDfn", script, false);
                                        //}///
                                    //}
                                //}
                                //else
                                //{
                                    //// this is never error
                                    //mObjloggedInUser.sName = mLstclientInfos[0].ClientName;
                                    //mObjloggedInUser.sUserType = mLstclientInfos[0].UserType;

                                    //if (mLstclientInfos[0].UserType == "Emp")
                                    //{


                                        //if (GlobalVariables.IsCTCLEnabled.ToUpper() == "FALSE")
                                        //{
                                            ////Page.ClientScript.RegisterStartupScript(GetType(), "msgbox", "alert('CTCL Login is not allowed, please check URL'); ", true);
                                            ////  return;
                                        //}
                                        //mObjloggedInUser.AddSegment(MarketSegments.FO, mLstclientInfos[0].CommonClientcode, mLstclientInfos[0].ClientCode, "Y", "Y");
                                        //Session[WebUser.SessionName] = mObjloggedInUser;
                                        //empInfo = service.GetEmployeeInfo(mLstclientInfos[0].CommonClientcode);

                                        //if (empInfo.EmpCTCL.Count > 0)
                                        //{
                                            //if (empInfo.EmpCTCL[0].MsgCode == 0)
                                            //{
                                                ////  lblError.Text = String.Format("Get EmpInfo Error : {0}", empInfo.EmpCTCL[0].Msg);
                                                //ViewBag.Message = String.Format("Get EmpInfo Error : {0}", empInfo.EmpCTCL[0].Msg);

                                                //AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                                                //Session[WebUser.SessionName] = null;
                                            //}
                                            //else
                                            //{
                                                //foreach (EmpCTCL empCtclInfo in empInfo.EmpCTCL)
                                                    //mObjloggedInUser.AddEmpInfo(empCtclInfo);

                                                //Session[WebUser.SessionName] = mObjloggedInUser;
                                            //}


                                            ////string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); clearClntDetails(); clearClntInfo(); setEmpDetails('" + mObjloggedInUser.GetEmployeeDetail(MarketSegments.CM).CTCLID + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";

                                            //string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo(); setEmpDetails('" + mObjloggedInUser.GetEmployeeDetail(MarketSegments.CM).CTCLID + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                            ////ScriptManager.RegisterStartupScript(this, typeof(Page), "CCIDfn", script, false);
                                        //}
                                        //else
                                        //{
                                            //ViewBag.Message = String.Format("Get EmpInfo Error : {0}", "something went wrong with employee info api");
                                            //AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                                        //}
                                    //}
                                    //else
                                    //{
                                        ////cliental login
                                        //foreach (ClientInfo mObjClientDetail in mLstclientInfos)
                                        //{
                                            //MarketSegments enSegmentType = MarketSegments.NotRecognised;

                                            //switch (mObjClientDetail.Segment)
                                            //{
                                                //case AcmiilConstants.SEGMENT_FO:
                                                    //enSegmentType = MarketSegments.FO;
                                                    //break;
                                                //case AcmiilConstants.SEGMENT_EQ:
                                                    //enSegmentType = MarketSegments.CM;
                                                    //break;
                                                //case AcmiilConstants.SEGMENT_CD:
                                                    //enSegmentType = MarketSegments.CD;
                                                    //break;
                                            //}


                                            ////mObjloggedInUser.AddSegment(enSegmentType, mObjClientDetail.CommonClientcode.ToString(), mObjClientDetail.ClientCode, mObjClientDetail.ActiveFlag, mObjClientDetail.TrdAllowed);
                                            //mObjloggedInUser.AddSegment(enSegmentType, mObjClientDetail.CommonClientcode.ToString(), mObjClientDetail.ClientCode, mObjClientDetail.ActiveFlag, mObjClientDetail.TrdAllowed, mObjClientDetail.ETFlag, mObjClientDetail.BOIFlag, mObjClientDetail.SynFlag, mObjClientDetail.UserType, mObjClientDetail.POAFlag);
                                        //}
                                        //Session[WebUser.SessionName] = mObjloggedInUser;
                                        ////System.Diagnostics.Debug.WriteLine(mObjloggedInUser.ToString()); 
                                        //System.Diagnostics.Debug.WriteLine(mObjloggedInUser.ToString());


                                        ////string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); clearClntDetails(); clearClntInfo();},150);   </script> ";

                                        //string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo();},150);   </script> ";
                                        ////ScriptManager.RegisterStartupScript(this, typeof(Page), "CCIDfn", script, false);

                                    //}
                                //}

                                //if (Session[WebUser.SessionName] != null)
                                //{

                                    //lblClientName = mObjloggedInUser.sName;
                                    //hFldOpenPopupId = GlobalVariables.POPUP_MPINVALIDATE1;
                                    //return Json(hFldOpenPopupId, JsonRequestBehavior.AllowGet);
                                //}
                                //break;
                                

                        //}
                        //break;
                        #endregion
                    case 2:

                        OpenChangePasswordPopup(LoginID, LoginPassword, resp.RespMessage);
                        break;

                    default:

                        ViewBag.Message = resp.RespMessage;

                        hFldOpenPopupId = resp.RespMessage;
                        return Json(hFldOpenPopupId, JsonRequestBehavior.AllowGet);
                        break;
                }


            }
            catch (Exception exError)
            {
                /*if(isSessionCreated)
                    client.SessionManage(txtUid.Text, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, AcmiilConstants.SESSION_LOGOUT);*/
                if (isSessionCreated)
                    AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);

                long pLngErr = -1;
                if (exError.GetBaseException() is System.Data.SqlClient.SqlException)
                    pLngErr = ((System.Data.SqlClient.SqlException)exError.GetBaseException()).Number;
                pLngErr = ReportError("btnLogin_Click", "Login", pLngErr, exError.GetBaseException().GetType().ToString(), exError.Message, exError.StackTrace);
                //  lblError.Text = "Report an error no : " + Convert.ToString(pLngErr) + " to System Owner";

                ViewBag.Message = String.Format("Report an error no : " + Convert.ToString(pLngErr) + " to System Owne");
            }
            return Json(hfldIPAddress, JsonRequestBehavior.AllowGet); ;
        }
        public string ClientIP
        {
            get
            {
                string ipaddress;
                ipaddress = Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                if (ipaddress == "" || ipaddress == null)
                    ipaddress = Request.ServerVariables["REMOTE_ADDR"];
                return ipaddress;
            }
        }
        public string EncryptionKey
        {
            get
            {
                return "@cm1Il31122049wt";
            }
        }
        public string RequestingBrowser
        {
            get { return String.Format("{0} v {1}", Request.Browser.Browser, Request.Browser.Version); }
        }

        private void OpenChangePasswordPopup(string sUserID, string sOldPassword, string sChagePwdMessage)
        {
            //hFldOpenPopupId.Value = POPUP_CHANGEPWD;
            //hFldOldwPwdCp.Value = sOldPassword;
            //lblCPError.Text = sChagePwdMessage; //resp.RespMessage;
            //lblCPError.CssClass = "information-popup-label";
            //lblCPError.ForeColor = System.Drawing.Color.Orange;

            //lblLoginIdCp.Text = hFldLoginIdCp.Value = sUserID;
            //txtChangePwd1.Text = "";
            //txtChangePwd2.Text = "";
        }

        public JsonResult btnForgotLoginId(string CCC)
        {
            //ForgotLoginResponse resp = new AcmiilApiServices().ForgotLogin(CCC);
            CCC = AESEncrytDecry.DecryptStringAES(CCC);
            List<ForgotLogin> mLstclientInfos = new AcmiilApiServices().ForgotLogin(CCC);
            string message = "";
            if (mLstclientInfos.Count >= 1)
            {
                if (mLstclientInfos[0].Status == "1")
                {
                    message = mLstclientInfos[0].ResponseMessage;
                }

                else
                {
                    message = mLstclientInfos[0].ResponseMessage;
                }

            }
            return Json(message, JsonRequestBehavior.AllowGet);
        }

        public JsonResult btnFPwdProceed_Click(FormCollection fc,string LoginID, string MobileNumber, string hFldOtpVisible, string hFldPopupOperation, string hFldOpenPopupId, string txtFPwdOTP = "")
        {
            string ClientName = "";
            string ResponseMsg = "";
            string ResponseCode = "";
            string HDName = fc["HDName"];
            if (client == null)
                client = new AuthenticateService();
            try
            {
                hFldOpenPopupId = "modForgotPwd";
                string hFldFPwdLoginId = "";
                //string txtFPwdOTP = "";
                hFldOpenPopupId = hFldOpenPopupId;
                AuthResponse resp = null;
                //string strLoginId = LoginID;

                string strLoginId = AESEncrytDecry.DecryptStringAES(LoginID);
                string MobNumber = AESEncrytDecry.DecryptStringAES(MobileNumber);

                ClientName = GetClientName(strLoginId);

                if (ClientName == "Incorrect User")
                {

                }
                else
                {
                    string strTemp = "";

                    if (strLoginId == "")
                        strLoginId = hFldFPwdLoginId;

                    if (hFldPopupOperation == "FLOGIN")
                    {
                        strTemp = ValidateLogin(strLoginId, null, 1);
                    }
                    else
                    {
                        strTemp = ValidateLogin(strLoginId, null);
                    }

                    if (strTemp == "")
                    {
                        if (MobNumber == "")
                        {
                            strTemp = "Mobile no. should not be left blank!!";
                        }
                        else if (MobNumber.All(char.IsDigit) && MobNumber.Length <= 15 && MobNumber.Length >= 10)
                        {
                            strTemp = "";
                            if (hFldOtpVisible == "T")
                            {
                                if (txtFPwdOTP.Trim() == "")
                                {
                                    strTemp = "Otp should not be left blank!!";
                                }
                                else if (txtFPwdOTP.All(char.IsDigit))
                                {
                                    resp = client.ChangePassword("FP2", strLoginId, "", txtFPwdOTP);
                                    ResponseMsg = resp.RespMessage;
                                    ResponseCode = resp.RespCode;
                                    switch (Convert.ToInt32(resp.RespCode))
                                    {
                                        case 1:
                                            if (hFldPopupOperation == "FPWD")
                                            {
                                                ResetForgotPassword("", "", strLoginId, MobNumber);
                                                OpenChangePasswordPopup(strLoginId, null, "");

                                            }
                                            //else
                                            else if (hFldPopupOperation == "FLOGIN")
                                            {

                                            }
                                            else if (hFldPopupOperation == "FMPIN")
                                            {

                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                else
                                {
                                    strTemp = String.Format("{0} is not in valid format!!", MobNumber);
                                }

                            }
                            else//goes here
                            {

                                if (hFldPopupOperation == "FLOGIN")
                                    resp = client.CreateLoginId(strLoginId, "", "", "", "");
                                else
                                    resp = new AuthResponse() { RespCode = "1", RespMessage = "For forgot password above check is not required!!" };

                                if (resp.RespCode == "1")//here
                                {
                                    if (txtFPwdOTP == string.Empty)
                                    {

                                    }
                                    resp = client.ChangePassword("FP1", strLoginId, "", MobNumber);
                                    ResponseMsg = resp.RespMessage;
                                    ResponseCode = resp.RespCode;
                                    if (resp.RespCode == "0")
                                    {
                                        ClientName = "Wrong Number";
                                        ResponseCode = "7";
                                    }
                                    else
                                    {
                                        switch (Convert.ToInt32(resp.RespCode))
                                        {
                                            case 1:
                                                //Success sent otp
                                                hFldOtpVisible = "T";//here

                                                break;

                                            default:
                                                //Error in otp
                                                hFldOtpVisible = "F";
                                                break;
                                        }
                                    }
                                }
                                else
                                {
                                    //Error in otp
                                    hFldOtpVisible = "F";

                                }
                            }
                        }
                        else
                            strTemp = String.Format("{0} is not valid mobile number!!", MobNumber);
                    }
                    if (strTemp != "")
                    {

                    }
                }

            }
            catch (Exception exError)
            {
                long pLngErr = -1;
                if (exError.GetBaseException() is System.Data.SqlClient.SqlException)
                    pLngErr = ((System.Data.SqlClient.SqlException)exError.GetBaseException()).Number;
                pLngErr = ReportError("btnFPwdProceed_Click", "Login", pLngErr, exError.GetBaseException().GetType().ToString(), exError.Message, exError.StackTrace);

            }
            return Json(new { ClientName, ResponseMsg, ResponseCode }, JsonRequestBehavior.AllowGet);
            //return Json(ClientName, JsonRequestBehavior.AllowGet);
        }
        private string GetClientName(string UID)
        {
            List<ClientInfo> mLstclientInfos = new AcmiilApiServices().GetClientInfo(UID);
            if (mLstclientInfos.Count >= 1)
            {
                if (mLstclientInfos[0].ResponseMessage == "Incorrect User")
                {
                    return mLstclientInfos[0].ResponseMessage;
                }
                else if (mLstclientInfos[0].Status == 0)
                    return "";
                else
                    return mLstclientInfos[0].ClientName;
            }
            else
            {
                return "";
            }

        }
        private string ValidateLogin(string sUserID, string sPassword, int nMinUidLen = 5)
        {
            string mError = "";
            if (sUserID == "")
                mError = "User id should not be left blank!!";
            else if (sUserID.IndexOf(" ") >= 0)
                mError = "User id can not contain blank space!!";

            #region "User id validations added by HVB on 24/10/2017 as it was required for new credentials"

            else if (sUserID.Length > 10 || sUserID.Length < nMinUidLen)
                mError = "User id should be between " + nMinUidLen.ToString() + " to 10 characters only!!";
            else if (Regex.IsMatch(sUserID, @"[^0-9a-z/_.]+", RegexOptions.IgnoreCase))
                mError = String.Format("Invalid character {0} specified in userid", new Regex(@"[^0-9a-z/_.]+", RegexOptions.IgnoreCase).Matches(sUserID)[0].ToString());

            #endregion "User id validations added on 24/10/2017 as it was required for new credentials"

            else if (sPassword != null)
            {
                if (sPassword.IndexOf(" ") >= 0)
                    mError = "Password can not contain blank space!!";
                else if (sUserID == sPassword)
                    mError = "User id and password can not be same!!";
                else if (sPassword.Length > MAX_PASSOWRD_LENGTH || sPassword.Length < MIN_PASSOWRD_LENGTH)
                    mError = String.Format("Password length should be between {0} & {1}!!", MIN_PASSOWRD_LENGTH, MAX_PASSOWRD_LENGTH);
                else if (!Regex.IsMatch(sPassword.ToLower(), "^[a-z].*"))
                    mError = "Password should start with alphabet only!!";

                else if (!sPassword.Any(char.IsDigit))
                    mError = "Password should contain at least a number!!";
                else if (Regex.IsMatch(sPassword, @"[^0-9a-z!#$%&()*+,-./:;<=>?@[\]_`{|}~]+", RegexOptions.IgnoreCase))
                    mError = String.Format("Invalid character {0} specified in password", new Regex(@"[^0-9a-z!#$%&()*+,-./:;<=>?@[\]_`{|}~]+", RegexOptions.IgnoreCase).Matches(sPassword)[0].ToString());
            }
            return mError;
        }
        private void ResetForgotPassword(string strErrorMsg, string sUserId, string strLoginId, string MobileNumber)
        {
            string hFldFPwdLoginId = "";
            string txtFPwdOTP = "";
            string hFldOtpVisible = "";

            strLoginId = hFldFPwdLoginId = sUserId;
            MobileNumber = txtFPwdOTP = "";
            hFldOtpVisible = "F";
        }

        public JsonResult btnCMPinSave_Click(string txtmPin1, string txtmPin2, string hFldOpenPopupId, string Loginid, string hFldOldwPwdCp = "")
        {
            string successmsg = "";
            bool successtype = false;
            if (client == null)
                client = new AuthenticateService();
            try
            {
                string sError = "";
                AuthResponse Response = client.ValidateMPIN(Loginid, txtmPin1, "C");

                if (Convert.ToInt32(Response.RespCode) != 1)
                    sError = Response.RespMessage;

                if (sError == "")
                {
                    hFldOpenPopupId = GlobalVariables.POPUP_SUCCESS1;

                    successmsg = "You have successfully changed your <br/>  M-Pin. Please enter new M-Pin <br/>  to continue with login.";
                    successtype = true;
                }
                else
                {
                    successmsg = sError;
                    successtype = false;
                }
            }
            catch (Exception exError)
            {

                long pLngErr = -1;
                if (exError.GetBaseException() is System.Data.SqlClient.SqlException)
                    pLngErr = ((System.Data.SqlClient.SqlException)exError.GetBaseException()).Number;
                pLngErr = ReportError("btnCMPinSave_Click", "Login", pLngErr, exError.GetBaseException().GetType().ToString(), exError.Message, exError.StackTrace);
            }

            var result = new { data = successtype, data2 = successmsg };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult btnCPSave_Click(string txtChangePwd1, string txtChangePwd2, string hFldOpenPopupId, string Loginid, string hFldOldwPwdCp = "")
        {
            string successmsg = "";
            if (client == null)
                client = new AuthenticateService();
            try
            {
                hFldOpenPopupId = GlobalVariables.POPUP_CHANGEPWD1;
                string sError = "";
                if (txtChangePwd1 != txtChangePwd2)
                    sError = "Entered password should match with re-typed password";
                else if ((sError = ValidateLogin(Loginid, txtChangePwd1)) == "")
                {

                    AuthResponse Response;
                    if (hFldOldwPwdCp == null)
                        Response = client.ChangePassword("CP", Loginid, CryptoEngine.Encrypt(Loginid, EncryptionKey), CryptoEngine.Encrypt(txtChangePwd1, EncryptionKey));
                    else
                        Response = client.ChangePassword("FP3", Loginid, "", CryptoEngine.Encrypt(txtChangePwd1, EncryptionKey));

                    if (Convert.ToInt32(Response.RespCode) != 1)
                        sError = Response.RespMessage;
                }

                if (sError == "")
                {

                    hFldOpenPopupId = GlobalVariables.POPUP_SUCCESS1;
                    successmsg = "You have successfully changed your password. Please Login with your New Password";
                }
                else
                {
                    successmsg = sError;
                }
            }
            catch (Exception exError)
            {
                long pLngErr = -1;
                if (exError.GetBaseException() is System.Data.SqlClient.SqlException)
                    pLngErr = ((System.Data.SqlClient.SqlException)exError.GetBaseException()).Number;
                pLngErr = ReportError("btnCPSave_Click", "Login", pLngErr, exError.GetBaseException().GetType().ToString(), exError.Message, exError.StackTrace);


            }
            return Json(successmsg, JsonRequestBehavior.AllowGet);
        }
        public JsonResult btnForceLogout_Click(string LoginID, string LoginPassword)
        {
            LoginID = AESEncrytDecry.DecryptStringAES(LoginID);
            LoginPassword = AESEncrytDecry.DecryptStringAES(LoginPassword);

            // var respons = "";
            if (client == null)
                client = new AuthenticateService();
            AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, "",
                                                      AcmiilConstants.PRODUCT_WEB,
                                                      RequestingBrowser, AcmiilConstants.DEVICES_WEB, "", client);

            string id = AESEncrytDecry.EncryptStringAES(LoginID);
            string pwd = AESEncrytDecry.EncryptStringAES(LoginPassword);
            //StringBuilder encLogin = new StringBuilder();
            //foreach (byte item in id)
            //{
            //    encLogin.Append(item.ToString("X2") + " ");
            //}

            
            //StringBuilder encPwd = new StringBuilder();
            //foreach (byte item in id)
            //{
            //    encPwd.Append(item.ToString("X2") + " ");
            //}

            var respons = btnLogin_Click(id, pwd);

            return Json(respons, JsonRequestBehavior.AllowGet);
        }
        public JsonResult btnCancelMPinVerification_Click(string txtLoginMPin, string LoginID)
        {
            string RU = "";
            string returnurl = "";
            string mergevalue = "";


            string strIpAddress = "";
            bool isSessionCreated = false;
            string hFldOpenPopupId = "";
            string hfldUserId = "";
            string hfldLogoutPwd = "";
            string hfldIPAddress = "";
            string lblClientName = "";

            var clientdetails = new clientssdata();
            if (client == null)
                client = new AuthenticateService();
            try
            {
                LoginID = AESEncrytDecry.DecryptStringAES(LoginID);
                txtLoginMPin = AESEncrytDecry.DecryptStringAES(txtLoginMPin);

                string sErr = "";
                if (txtLoginMPin.Trim() == "")
                    sErr = "m-Pin should not be blank.";


                if (sErr == "")
                {
                    // AcmiilApiResponse resp = new AcmiilApiServices().ValidateMPIN(LoginID, txtLoginMPin);
                    AcmiilApiServices service = new AcmiilApiServices();
                    List<ClientInfo> resp = service.ValidateMPIN(LoginID, txtLoginMPin);

                    WebUser mObjloggedInUser = new WebUser();
                    mObjloggedInUser.sLoginId = LoginID;
                    mObjloggedInUser.bExpiryMessageShown = false;
                    mObjloggedInUser.sExpiryDaysMessage = resp[0].ResponseMessage;

                    if (resp[0].Status == 1)
                    {
                        
                        strIpAddress = ClientIP;
                        AuthResponse Resp1 = client.SessionManage(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, AcmiilConstants.SESSION_CREATE);
                        switch (Convert.ToInt32(Resp1.RespCode))
                        {
                            case 1:
                                isSessionCreated = true;
                                

                                mObjloggedInUser.sSessionID = Session.SessionID;
                                mObjloggedInUser.sProduct = AcmiilConstants.PRODUCT_WEB;
                                mObjloggedInUser.sBrowser = RequestingBrowser;
                                mObjloggedInUser.sDevice = AcmiilConstants.DEVICES_WEB;
                                mObjloggedInUser.sIpAddress = strIpAddress;

                                List<ClientInfo> mLstclientInfos = service.GetClientInfo(LoginID);

                                List<EmpCTCL> empInfo;
                                //AcmiilEmpInfoResponse empInfo;
                                //Read info and set client session object
                                if (mLstclientInfos.Count == 1)
                                {
                                    if (mLstclientInfos[0].Status == 0)
                                    {
                                        ViewBag.Message = String.Format("Get Info Error : {0}", mLstclientInfos[0].ResponseMessage);
                                        AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                                    }
                                    else
                                    {
                                        mObjloggedInUser.sName = mLstclientInfos[0].ClientName;
                                        mObjloggedInUser.sUserType = mLstclientInfos[0].UserType;

                                        if (mLstclientInfos[0].UserType.ToUpper() == "BA")
                                        {
                                            mObjloggedInUser.AddSegment(MarketSegments.FO, mLstclientInfos[0].CommonClientcode, mLstclientInfos[0].ClientCode, "Y", "Y");

                                            Session[WebUser.SessionName] = mObjloggedInUser;

                                            string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo(); setEmpDetails('" + "" + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                        }
                                        else if (mLstclientInfos[0].UserType == "Emp")
                                        {
                                            if (GlobalVariables.IsCTCLEnabled.ToUpper() == "FALSE")
                                            {
                                                //    Page.ClientScript.RegisterStartupScript(GetType(), "msgbox", "alert('CTCL Login is not allowed, please check URL'); ", true);
                                                //    return;
                                            }

                                            mObjloggedInUser.AddSegment(MarketSegments.FO, mLstclientInfos[0].CommonClientcode, mLstclientInfos[0].ClientCode, "Y", "Y");

                                            Session[WebUser.SessionName] = mObjloggedInUser;

                                            empInfo = service.GetEmployeeInfo(mLstclientInfos[0].CommonClientcode);

                                            if (empInfo.Count > 0)
                                            {
                                                if (empInfo[0].MsgCode == 0)
                                                {
                                                    ViewBag.Message = String.Format("Get EmpInfo Error : {0}", empInfo[0].Msg);
                                                    AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                                                    Session[WebUser.SessionName] = null; //if no ctcl id found 
                                                }
                                                else
                                                {
                                                    foreach (EmpCTCL empCtclInfo in empInfo)
                                                        mObjloggedInUser.AddEmpInfo(empCtclInfo);

                                                    Session[WebUser.SessionName] = mObjloggedInUser;

                                                    string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo(); setEmpDetails('" + mObjloggedInUser.GetEmployeeDetail(MarketSegments.CM).CTCLID + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                                }
                                            }
                                            else
                                            {
                                                ViewBag.Message = String.Format("Get EmpInfo Error : {0}", "something went wrong with employee info api");
                                                AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                                            }
                                        }
                                        else
                                        {
                                            //client login

                                            MarketSegments enSegmentType = MarketSegments.NotRecognised;

                                            switch (mLstclientInfos[0].Segment)
                                            {
                                                case AcmiilConstants.SEGMENT_FO:
                                                    enSegmentType = MarketSegments.FO;
                                                    break;
                                                case AcmiilConstants.SEGMENT_EQ:
                                                    enSegmentType = MarketSegments.CM;
                                                    break;
                                                case AcmiilConstants.SEGMENT_CD:
                                                    enSegmentType = MarketSegments.CD;
                                                    break;
                                            }
                                            //mObjloggedInUser.AddSegment(enSegmentType, mLstclientInfos[0].CommonClientcode.ToString(), mLstclientInfos[0].ClientCode, mLstclientInfos[0].ActiveFlag, mLstclientInfos[0].TrdAllowed);

                                            mObjloggedInUser.AddSegment(enSegmentType, mLstclientInfos[0].CommonClientcode.ToString(), mLstclientInfos[0].ClientCode, mLstclientInfos[0].ActiveFlag, mLstclientInfos[0].TrdAllowed, mLstclientInfos[0].ETFlag, mLstclientInfos[0].BOIFlag, mLstclientInfos[0].SynFlag, mLstclientInfos[0].UserType, mLstclientInfos[0].POAFlag);
                                            Session[WebUser.SessionName] = mObjloggedInUser;
                                            //System.Diagnostics.Debug.WriteLine(mObjloggedInUser.ToString());
                                            //string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); clearClntDetails(); clearClntInfo();},150);   </script> ";

                                            string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo();},150);   </script> ";

                                            //ScriptManager.RegisterStartupScript(this, typeof(Page), "CCIDfn", script, false);
                                        }
                                    }
                                }
                                else
                                {
                                    // this is never error
                                    mObjloggedInUser.sName = mLstclientInfos[0].ClientName;
                                    mObjloggedInUser.sUserType = mLstclientInfos[0].UserType;

                                    if (mLstclientInfos[0].UserType == "Emp")
                                    {


                                        if (GlobalVariables.IsCTCLEnabled.ToUpper() == "FALSE")
                                        {
                                            //Page.ClientScript.RegisterStartupScript(GetType(), "msgbox", "alert('CTCL Login is not allowed, please check URL'); ", true);
                                            //  return;
                                        }
                                        mObjloggedInUser.AddSegment(MarketSegments.FO, mLstclientInfos[0].CommonClientcode, mLstclientInfos[0].ClientCode, "Y", "Y");
                                        Session[WebUser.SessionName] = mObjloggedInUser;
                                        empInfo = service.GetEmployeeInfo(mLstclientInfos[0].CommonClientcode);

                                        if (empInfo.Count > 0)
                                        {
                                            if (empInfo[0].MsgCode == 0)
                                            {
                                                //  lblError.Text = String.Format("Get EmpInfo Error : {0}", empInfo.EmpCTCL[0].Msg);
                                                ViewBag.Message = String.Format("Get EmpInfo Error : {0}", empInfo[0].Msg);

                                                AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                                                Session[WebUser.SessionName] = null;
                                            }
                                            else
                                            {
                                                foreach (EmpCTCL empCtclInfo in empInfo)
                                                    mObjloggedInUser.AddEmpInfo(empCtclInfo);

                                                Session[WebUser.SessionName] = mObjloggedInUser;
                                            }


                                            //string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); clearClntDetails(); clearClntInfo(); setEmpDetails('" + mObjloggedInUser.GetEmployeeDetail(MarketSegments.CM).CTCLID + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";

                                            string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo(); setEmpDetails('" + mObjloggedInUser.GetEmployeeDetail(MarketSegments.CM).CTCLID + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                            //ScriptManager.RegisterStartupScript(this, typeof(Page), "CCIDfn", script, false);
                                        }
                                        else
                                        {
                                            ViewBag.Message = String.Format("Get EmpInfo Error : {0}", "something went wrong with employee info api");
                                            AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                                        }
                                    }
                                    else
                                    {
                                        //cliental login
                                        foreach (ClientInfo mObjClientDetail in mLstclientInfos)
                                        {
                                            MarketSegments enSegmentType = MarketSegments.NotRecognised;

                                            switch (mObjClientDetail.Segment)
                                            {
                                                case AcmiilConstants.SEGMENT_FO:
                                                    enSegmentType = MarketSegments.FO;
                                                    break;
                                                case AcmiilConstants.SEGMENT_EQ:
                                                    enSegmentType = MarketSegments.CM;
                                                    break;
                                                case AcmiilConstants.SEGMENT_CD:
                                                    enSegmentType = MarketSegments.CD;
                                                    break;
                                            }


                                            //mObjloggedInUser.AddSegment(enSegmentType, mObjClientDetail.CommonClientcode.ToString(), mObjClientDetail.ClientCode, mObjClientDetail.ActiveFlag, mObjClientDetail.TrdAllowed);
                                            mObjloggedInUser.AddSegment(enSegmentType, mObjClientDetail.CommonClientcode.ToString(), mObjClientDetail.ClientCode, mObjClientDetail.ActiveFlag, mObjClientDetail.TrdAllowed, mObjClientDetail.ETFlag, mObjClientDetail.BOIFlag, mObjClientDetail.SynFlag, mObjClientDetail.UserType, mObjClientDetail.POAFlag);
                                        }
                                        Session[WebUser.SessionName] = mObjloggedInUser;
                                        //System.Diagnostics.Debug.WriteLine(mObjloggedInUser.ToString()); 
                                        System.Diagnostics.Debug.WriteLine(mObjloggedInUser.ToString());


                                        //string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); clearClntDetails(); clearClntInfo();},150);   </script> ";

                                        string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo();},150);   </script> ";
                                        //ScriptManager.RegisterStartupScript(this, typeof(Page), "CCIDfn", script, false);

                                    }
                                }
                                if (Session[WebUser.SessionName] != null)
                                {

                                    lblClientName = mObjloggedInUser.sName;
                                    //hFldOpenPopupId = GlobalVariables.POPUP_MPINVALIDATE1;
                                    //return Json(hFldOpenPopupId, JsonRequestBehavior.AllowGet);
                                }
                                break;
                        }
                        WebUser mObjUser = (WebUser)Session[WebUser.SessionName];
                        if (Request.Cookies["username"] != null)
                        {

                            Response.Cookies["username"].Expires = DateTime.Now.AddDays(-1);
                            Response.Cookies["password"].Expires = DateTime.Now.AddDays(-1);

                        }
                        Session["password"] = null;


                        AcmiilApiServices.SaveSessionToVitco(ref mObjUser, true);
                        Session[WebUser.SessionName] = mObjUser;
                        HttpCookie cookie = new HttpCookie(mObjUser.sLoginId, mObjUser.sSessionID);

                        #region "cookies"
                        Response.Cookies["LoginId"].Value = mObjUser.sLoginId;
                        Response.Cookies["LoginId"].Expires = DateTime.Now.AddMinutes(45);

                        // Response.Cookies["LoginId"].Domain = ".investmentz.com";

                        Response.Cookies["SessionId"].Value = mObjUser.sSessionID;
                        Response.Cookies["SessionId"].Expires = DateTime.Now.AddMinutes(45);

                        Response.Cookies["SessionId"].Domain = "ctclvapt.investmentz.com";

                        #endregion

                        string usrtyp;
                        if (mObjUser.sUserType.ToLower() == "reg")
                        {
                            usrtyp = "C";
                        }
                        else
                        {
                            usrtyp = "E";
                        }

                        if (RU != "")
                            clientdetails.sTradingCode = "N";
                        else
                        {
                            AcmiilApiServices.PutNotification(ref mObjUser, true, "");
                            Session[WebUser.SessionName] = mObjUser;


                            clientdetails.sTradingCode = mObjUser.sTradingCode;
                            clientdetails.sName = mObjUser.sName;
                            clientdetails.UserType = mObjUser.sUserType;
                            clientdetails.passwordsExpiry = mObjUser.sExpiryDaysMessage;
                            clientdetails.Sessionid = mObjUser.sSessionID;
                        }
                    }
                    else
                    {

                    }
                }
                else
                {

                }
            }
            catch (Exception exError)
            {
                long pLngErr = -1;
                if (exError.GetBaseException() is System.Data.SqlClient.SqlException)
                    pLngErr = ((System.Data.SqlClient.SqlException)exError.GetBaseException()).Number;
                pLngErr = ReportError("btnVerifyMPin_Click", "Login", pLngErr, exError.GetBaseException().GetType().ToString(), exError.Message, exError.StackTrace);
                // lblMPinVerError.Text = "Report an error no : " + Convert.ToString(pLngErr) + " to System Owner";
            }
            return Json(clientdetails, JsonRequestBehavior.AllowGet);
        }

        public static long ReportError(string pStrMethodName, string pStrClassName, long pLngErrorNumber, string pStrErrorType, string pStrDescription, string pStrStackTrace)
        {
            try
            {
                string mStrConnection = GlobalVariables.SqlConnectionFO;
                DataTable dtErrorLog = SqlHelper.ReadTable("SP_GetErrorReportNumber", mStrConnection, true,
                                                              SqlHelper.AddInParam("@vCharMethodName", SqlDbType.VarChar, pStrMethodName),
                                                              SqlHelper.AddInParam("@vCharClassName", SqlDbType.VarChar, pStrClassName), // This is name of your class where method is....Change this accordingly.
                                                              SqlHelper.AddInParam("@bIntErrorNumber", SqlDbType.BigInt, pLngErrorNumber),
                                                              SqlHelper.AddInParam("@vCharErrorType", SqlDbType.VarChar, pStrErrorType),
                                                              SqlHelper.AddInParam("@vCharDescription", SqlDbType.VarChar, pStrDescription),
                                                              SqlHelper.AddInParam("@vCharStackTrace", SqlDbType.VarChar, pStrStackTrace));
                return Convert.ToInt64(dtErrorLog.Rows[0][0]);
            }
            catch (Exception exErr)
            {
                System.Console.WriteLine(exErr.Message);
                return -1000;
            }
        }

        const int MIN_PASSOWRD_LENGTH = 8;
        const int MAX_PASSOWRD_LENGTH = 15;
        public static System.Web.HttpContext Current { get; set; }
        public HttpResponse Response1 { get; }


        public class clientssdata
        {
            public string sName { get; set; }
            public string sTradingCode { get; set; }
            public string UserType { get; set; }
            public string Sessionid { get; set; }
            public string passwordsExpiry { get; set; }
        }

    }
}