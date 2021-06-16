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

namespace CTCLProj.Controllers
{
    public class LoginController : Controller
    {
        AuthenticateService client;
        // GET: Login
        public ActionResult Login()
        {
            if (client == null)
                client = new AuthenticateService();
            return View();
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
               
                strIpAddress = ClientIP;//ClientIP; "120.63.142.234";//TODO: Use clientip when deploying
             

                    strTemp = CryptoEngine.Encrypt(LoginPassword, EncryptionKey);

                    AuthResponse resp = client.LoginAuthenticate(LoginID, strTemp, strIpAddress, AcmiilConstants.PRODUCT_WEB, RequestingBrowser);

                    AcmiilApiServices service = new AcmiilApiServices();

                    switch (Convert.ToInt32(resp.RespCode))
                    {
                        case -1:
                        //Account locked , redirect to forget password page
                        // ResetForgotPassword(resp.RespMessage, LoginID);
                        hFldPopupOperation = GlobalVariables.hFldPopupOperation1;
                        hFldOpenPopupId = GlobalVariables.hFldOpenPopupId1;
                        break;

                        case 1:

                            
                            string strTemp1 = AcmiilApiServices.IsUserLoggedin(LoginID, AcmiilConstants.PRODUCT_WEB, client);

                            if (strTemp1 != "")
                                if (strTemp1.IndexOf("You are already logged") != -1)
                                {
                                    hFldOpenPopupId = GlobalVariables.POPUP_FORCELOGOUT1;
                                    hfldUserId =LoginID;
                                    hfldLogoutPwd =LoginPassword;
                                    hfldIPAddress = strTemp1 + ". Do you want to forcefully logout from the previous session?";
                                     return Json(hfldIPAddress,JsonRequestBehavior.AllowGet);
                                    //  GlobalFunctions.LogOut(Session, Response, Context, Page);
                                }


                            WebUser mObjloggedInUser = new WebUser();
                            mObjloggedInUser.sLoginId =LoginID;
                            mObjloggedInUser.bExpiryMessageShown = false;
                            mObjloggedInUser.sExpiryDaysMessage = resp.RespMessage;
                            Session["password"] =LoginPassword;

                            //1. Create session
                            resp = client.SessionManage(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, AcmiilConstants.SESSION_CREATE);
                            switch (Convert.ToInt32(resp.RespCode))
                            {
                                case 1:

                                    isSessionCreated = true;
                                    AcmiilEmpInfoResponse empInfo;

                                    mObjloggedInUser.sSessionID = Session.SessionID;
                                    mObjloggedInUser.sProduct = AcmiilConstants.PRODUCT_WEB;
                                    mObjloggedInUser.sBrowser = RequestingBrowser;
                                    mObjloggedInUser.sDevice = AcmiilConstants.DEVICES_WEB;
                                    mObjloggedInUser.sIpAddress = strIpAddress;

                                    //2. Fetch client
                                    List<ClientInfo> mLstclientInfos = service.GetClientInfo(LoginID);

                                    //Read info and set client session object
                                    if (mLstclientInfos.Count == 1)
                                    {

                                        if (mLstclientInfos[0].Status == 0)
                                        {
                                        //Error ??
                                            ViewBag.Message = String.Format("Get Info Error : {0}", mLstclientInfos[0].ResponseMessage);
                                            AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                                            //client.SessionManage(txtUid.Text, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, AcmiilConstants.SESSION_LOGOUT);
                                        }
                                        else
                                        {
                                            mObjloggedInUser.sName = mLstclientInfos[0].ClientName;
                                            mObjloggedInUser.sUserType = mLstclientInfos[0].UserType;

                                            if (mLstclientInfos[0].UserType.ToUpper() == "BA")//added by tsheikh for BA login in CTCL
                                            {
                                                mObjloggedInUser.AddSegment(MarketSegments.FO, mLstclientInfos[0].CommonClientcode, mLstclientInfos[0].ClientCode, "Y", "Y");

                                                Session[WebUser.SessionName] = mObjloggedInUser;

                                                string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo(); setEmpDetails('" + "" + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                                //ScriptManager.RegisterStartupScript(this, typeof(Page), "CCIDfn", script, false);
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

                                                if (empInfo.EmpCTCL.Count > 0)
                                                {
                                                    if (empInfo.EmpCTCL[0].MsgCode == 0)
                                                    {
                                                    ViewBag.Message = String.Format("Get EmpInfo Error : {0}", empInfo.EmpCTCL[0].Msg);
                                                        AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                                                        Session[WebUser.SessionName] = null; //if no ctcl id found 
                                                    }
                                                    else
                                                    {
                                                        foreach (EmpCTCL empCtclInfo in empInfo.EmpCTCL)
                                                            mObjloggedInUser.AddEmpInfo(empCtclInfo);

                                                        Session[WebUser.SessionName] = mObjloggedInUser;

                                                      
                                                        //here it is coming employee details so set it along with common client code
                                                        
                                                        //string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); clearClntDetails(); clearClntInfo(); setEmpDetails('" + mObjloggedInUser.GetEmployeeDetail(MarketSegments.CM).CTCLID + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                                        string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo(); setEmpDetails('" + mObjloggedInUser.GetEmployeeDetail(MarketSegments.CM).CTCLID + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                                        //ScriptManager.RegisterStartupScript(this, typeof(Page), "CCIDfn", script, false);

                                                        //string script1 = " <script type=\"text/javascript\"> setTimeout(function(){ clearClntDetails(); },150);   </script> ";
                                                        //ScriptManager.RegisterStartupScript(this, typeof(Page), "CTCLIDfn", script1, false);
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
                                                //cliental login

                                                // in a session store client data

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
                                            }///
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

                                            if (empInfo.EmpCTCL.Count > 0)
                                            {
                                                if (empInfo.EmpCTCL[0].MsgCode == 0)
                                                {
                                                //  lblError.Text = String.Format("Get EmpInfo Error : {0}", empInfo.EmpCTCL[0].Msg);
                                                ViewBag.Message = String.Format("Get EmpInfo Error : {0}", empInfo.EmpCTCL[0].Msg);

                                                AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                                                    Session[WebUser.SessionName] = null;
                                                }
                                                else
                                                {
                                                    foreach (EmpCTCL empCtclInfo in empInfo.EmpCTCL)
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
                                        hFldOpenPopupId = GlobalVariables.POPUP_MPINVALIDATE1;
                                    return Json(hFldOpenPopupId, JsonRequestBehavior.AllowGet);
                                    }
                                    break;


                            }
                            break;

                        case 2:
                       
                            OpenChangePasswordPopup(LoginID,LoginPassword, resp.RespMessage);
                            break;

                        default:
  
                        ViewBag.Message = resp.RespMessage;

                        ViewBag.Message = resp.RespMessage;
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
        public JsonResult btnFPwdProceed_Click(string LoginID, string MobileNumber, string hFldOtpVisible, string hFldPopupOperation, string hFldOpenPopupId, string txtFPwdOTP = "")
        {
            string ClientName = "";
            if (client == null)
                client = new AuthenticateService();
            try
            {
                hFldOpenPopupId = "modForgotPwd";
                string hFldFPwdLoginId = "";
                //string txtFPwdOTP = "";
                hFldOpenPopupId = hFldOpenPopupId;
                AuthResponse resp = null;
                string strLoginId = LoginID;

                ClientName = GetClientName(strLoginId);


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
                    if (MobileNumber == "")
                    {
                        strTemp = "Mobile no. should not be left blank!!";
                    }
                    else if (MobileNumber.All(char.IsDigit) && MobileNumber.Length <= 15 && MobileNumber.Length >= 10)
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
                                switch (Convert.ToInt32(resp.RespCode))
                                {
                                    case 1:
                                        if (hFldPopupOperation == "FPWD")
                                        {
                                            ResetForgotPassword("", "", strLoginId, MobileNumber);
                                            OpenChangePasswordPopup(strLoginId, null, "");

                                        }
                                        //else
                                        else if (hFldPopupOperation == "FLOGIN") //Added by hvb on 07/11/2017 for forgot mpin
                                        {
                                        }
                                        else
                                        {
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                            else
                            {
                                strTemp = String.Format("{0} is not in valid format!!", MobileNumber);
                            }

                        }
                        else
                        {

                            if (hFldPopupOperation == "FLOGIN")
                                resp = client.CreateLoginId(strLoginId, "", "", "", "");
                            else
                                resp = new AuthResponse() { RespCode = "1", RespMessage = "For forgot password above check is not required!!" };

                            if (resp.RespCode == "1")
                            {
                                resp = client.ChangePassword("FP1", strLoginId, "", MobileNumber);
                                switch (Convert.ToInt32(resp.RespCode))
                                {
                                    case 1:
                                        //Success sent otp
                                        hFldOtpVisible = "T";

                                        break;

                                    default:
                                        //Error in otp
                                        hFldOtpVisible = "F";
                                        break;
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
                        strTemp = String.Format("{0} is not valid mobile number!!", MobileNumber);
                }
                if (strTemp != "")
                {

                }
            }
            catch (Exception exError)
            {
                long pLngErr = -1;
                if (exError.GetBaseException() is System.Data.SqlClient.SqlException)
                    pLngErr = ((System.Data.SqlClient.SqlException)exError.GetBaseException()).Number;
                pLngErr = ReportError("btnFPwdProceed_Click", "Login", pLngErr, exError.GetBaseException().GetType().ToString(), exError.Message, exError.StackTrace);

            }

            return Json(ClientName, JsonRequestBehavior.AllowGet);
        }
        private string GetClientName(string UID)
        {
            List<ClientInfo> mLstclientInfos = new AcmiilApiServices().GetClientInfo(UID);
            if (mLstclientInfos.Count >= 1)
            {
                if (mLstclientInfos[0].Status == 0)
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
            // var respons = "";
            if (client == null)
                client = new AuthenticateService();
            AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, "",
                                                      AcmiilConstants.PRODUCT_WEB,
                                                      RequestingBrowser, AcmiilConstants.DEVICES_WEB, "", client);

            var respons = btnLogin_Click(LoginID, LoginPassword);
            return Json(respons, JsonRequestBehavior.AllowGet);
        }
        public JsonResult btnCancelMPinVerification_Click(string txtLoginMPin, string LoginID)
        {
            string RU = "";
            string returnurl = "";
            string mergevalue = "";

            if (client == null)
                client = new AuthenticateService();
            try
            {
                string sErr = "";
                if (txtLoginMPin.Trim() == "")
                    sErr = "m-Pin should not be blank.";


                if (sErr == "")
                {
                    WebUser mObjUser = (WebUser)Session[WebUser.SessionName];
                    AcmiilApiResponse resp = new AcmiilApiServices().ValidateMPIN(mObjUser.sLoginId, txtLoginMPin);
                    if (resp.RespCode == "1")
                    {


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

                        Response.Cookies["LoginId"].Domain = ".investmentz.com";

                        Response.Cookies["SessionId"].Value = mObjUser.sSessionID;
                        Response.Cookies["SessionId"].Expires = DateTime.Now.AddMinutes(45);

                        Response.Cookies["SessionId"].Domain = ".investmentz.com";

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
                            returnurl = "N";
                        //  return Redirect(RU);
                        else
                        {
                            //token 
                            //ARV
                            AcmiilApiServices.PutNotification(ref mObjUser, true, "");
                            Session[WebUser.SessionName] = mObjUser;
                            returnurl = "Y";
                            mergevalue = mObjUser.sName + " (" + mObjUser.sTradingCode + ")";
                            //  returnurl = String.Format("https://www.Google.com");
                            //return RedirectToActionPermanent(returnurl);
                        }
                        //GlobalFunctions.SafelyTrasnsferPage("~/WebForms/MktWatch.aspx", Response, Context);
                    }
                    else
                    {
                        // lblMPinVerError.ForeColor = System.Drawing.Color.Red;
                        // lblMPinVerError.Text = resp.RespMessage;
                    }
                }
                else
                {
                    // lblMPinVerError.ForeColor = System.Drawing.Color.Red;
                    // lblMPinVerError.Text = sErr;
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
            return Json(mergevalue, JsonRequestBehavior.AllowGet);
        }

        const int MIN_PASSOWRD_LENGTH = 8;
        const int MAX_PASSOWRD_LENGTH = 15;
        public static System.Web.HttpContext Current { get; set; }
        public HttpResponse Response1 { get; }

    }
}