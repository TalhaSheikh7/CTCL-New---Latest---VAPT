using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.SessionState;
using System.Data;

namespace CTCLProj.Class
{
    public class GlobalFunctions
    {

        //Added by ARV on 19-11-2020 as for Creating Session Data at global level
        public static WebUser GetSessionDetails(string LoginID, string SessionID, Page pg)
        {
            WebUser objWebUser = null;
            try
            {
                bool isActive = hasSession(LoginID, SessionID);
                if (isActive)
                {
                    string BrowserInfo = "", IP = "", ExpiryMsg = "";
                    long nSessionId = 0;
                    DataTable dtSessLog = SqlHelper.ReadTable("spGetSessionDetailNew", GlobalVariables.SQLConn, true,
                        SqlHelper.AddInParam("@LoginId", SqlDbType.VarChar, LoginID),
                        SqlHelper.AddInParam("@SessionId", SqlDbType.VarChar, SessionID));

                    if (dtSessLog.Rows.Count > 0)
                    {
                        nSessionId = Convert.ToInt64(dtSessLog.Rows[0]["nSessionId"]);
                        ExpiryMsg = Convert.ToString(dtSessLog.Rows[0]["sExpiryMessage"]);
                        IP = Convert.ToString(dtSessLog.Rows[0]["sIpAddress"]);
                        BrowserInfo = Convert.ToString(dtSessLog.Rows[0]["sBrowser"]);
                    }
                    AcmiilApiServices service = new AcmiilApiServices();
                    List<ClientInfo> mLstclientInfos = service.GetClientInfo(LoginID);
                    AcmiilEmpInfoResponse empInfo;


                    WebUser mObjloggedInUser = new WebUser();
                    mObjloggedInUser.sLoginId = LoginID;
                    mObjloggedInUser.bExpiryMessageShown = true;
                    mObjloggedInUser.sExpiryDaysMessage = ExpiryMsg;
                    mObjloggedInUser.sSessionID = SessionID;
                    mObjloggedInUser.sProduct = AcmiilConstants.PRODUCT_WEB;
                    mObjloggedInUser.sBrowser = BrowserInfo;
                    mObjloggedInUser.sDevice = AcmiilConstants.DEVICES_WEB;
                    mObjloggedInUser.sIpAddress = IP;
                    mObjloggedInUser.nSessionId = nSessionId;
                    if (mLstclientInfos.Count == 1)
                    {
                        // if one it could be error
                        // check status of first item if it's error then its zero
                        // else its proper data
                        if (mLstclientInfos[0].Status == 0)
                        {

                            //Error ??
                            //lblError.Text = String.Format("Get Info Error : {0}", mLstclientInfos[0].ResponseMessage);
                            //AcmiilApiServices.LogoutSessionFromAcmiil(LoginId, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                            //client.SessionManage(LoginId, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, AcmiilConstants.SESSION_LOGOUT);
                        }
                        else
                        {
                            mObjloggedInUser.sName = mLstclientInfos[0].ClientName;
                            mObjloggedInUser.sUserType = mLstclientInfos[0].UserType;

                            if (mLstclientInfos[0].UserType.ToUpper() == "BA")
                            {
                                mObjloggedInUser.AddSegment(MarketSegments.FO, mLstclientInfos[0].CommonClientcode, mLstclientInfos[0].ClientCode, "Y", "Y");

                                objWebUser = mObjloggedInUser;

                                //vpg moved here 28062019
                                //string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo(); setEmpDetails('" + mObjloggedInUser.GetEmployeeDetail(MarketSegments.CM).CTCLID + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                //string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo(); setEmpDetails('" + "" + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                //ScriptManager.RegisterStartupScript(this, typeof(Page), "CCIDfn", script, false);
                                //ARV
                                string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo(); setEmpDetails('" + "" + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                ScriptManager.RegisterStartupScript(pg, typeof(Page), "CCIDfn", script, false);

                                //vpg moved here 28062019

                                //vpg commented below 28062019
                                //empInfo = service.GetEmployeeInfo(mLstclientInfos[0].CommonClientcode);

                                //if (empInfo.EmpCTCL.Count > 0)
                                //{
                                //    if (empInfo.EmpCTCL[0].MsgCode == 0)
                                //    {
                                //        lblError.Text = String.Format("Get EmpInfo Error : {0}", empInfo.EmpCTCL[0].Msg);
                                //        AcmiilApiServices.LogoutSessionFromAcmiil(LoginId, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                                //        Session[WebUser.SessionName] = null; //if no ctcl id found 
                                //    }
                                //    else
                                //    {
                                //        foreach (EmpCTCL empCtclInfo in empInfo.EmpCTCL)
                                //            mObjloggedInUser.AddEmpInfo(empCtclInfo);

                                //        objWebUser= mObjloggedInUser;

                                //        //vpg on 02022018 to save user client code in global variable 
                                //        //here it is coming employee details so set it along with common client code

                                //        //mod hvb 26/04/2018 added clear default watchlist
                                //        //string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); clearClntDetails(); clearClntInfo(); setEmpDetails('" + mObjloggedInUser.GetEmployeeDetail(MarketSegments.CM).CTCLID + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                //        string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo(); setEmpDetails('" + mObjloggedInUser.GetEmployeeDetail(MarketSegments.CM).CTCLID + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                //        ScriptManager.RegisterStartupScript(this, typeof(Page), "CCIDfn", script, false);

                                //        //string script1 = " <script type=\"text/javascript\"> setTimeout(function(){ clearClntDetails(); },150);   </script> ";
                                //        //ScriptManager.RegisterStartupScript(this, typeof(Page), "CTCLIDfn", script1, false);
                                //    }


                                //}
                                //else
                                //{
                                //    lblError.Text = String.Format("Get EmpInfo Error : {0}", "something went wrong with employee info api");
                                //    AcmiilApiServices.LogoutSessionFromAcmiil(LoginId, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                                //}
                            }
                            else if (mLstclientInfos[0].UserType == "Emp")
                            {

                                if (GlobalVariables.IsCTCLEnabled.ToUpper() == "FALSE")
                                {
                                    //ARV
                                    pg.ClientScript.RegisterStartupScript(pg.GetType(), "msgbox", "alert('CTCL Login is not allowed, please check URL'); ", true);
                                    return null;
                                }

                                mObjloggedInUser.AddSegment(MarketSegments.FO, mLstclientInfos[0].CommonClientcode, mLstclientInfos[0].ClientCode, "Y", "Y");

                                objWebUser = mObjloggedInUser;

                                empInfo = service.GetEmployeeInfo(mLstclientInfos[0].CommonClientcode);

                                if (empInfo.EmpCTCL.Count > 0)
                                {
                                    if (empInfo.EmpCTCL[0].MsgCode == 0)
                                    {
                                        //lblError.Text = String.Format("Get EmpInfo Error : {0}", empInfo.EmpCTCL[0].Msg);
                                        //AcmiilApiServices.LogoutSessionFromAcmiil(LoginId, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
                                        objWebUser = null; //if no ctcl id found 
                                    }
                                    else
                                    {
                                        foreach (EmpCTCL empCtclInfo in empInfo.EmpCTCL)
                                            mObjloggedInUser.AddEmpInfo(empCtclInfo);

                                        objWebUser = mObjloggedInUser;

                                        //vpg on 02022018 to save user client code in global variable 
                                        //here it is coming employee details so set it along with common client code

                                        //mod hvb 26/04/2018 added clear default watchlist
                                        //string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); clearClntDetails(); clearClntInfo(); setEmpDetails('" + mObjloggedInUser.GetEmployeeDetail(MarketSegments.CM).CTCLID + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                        string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo(); setEmpDetails('" + mObjloggedInUser.GetEmployeeDetail(MarketSegments.CM).CTCLID + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                        ScriptManager.RegisterStartupScript(pg, typeof(Page), "CCIDfn", script, false);

                                        //string script1 = " <script type=\"text/javascript\"> setTimeout(function(){ clearClntDetails(); },150);   </script> ";
                                        //ScriptManager.RegisterStartupScript(this, typeof(Page), "CTCLIDfn", script1, false);
                                    }


                                }
                                else
                                {
                                    //lblError.Text = String.Format("Get EmpInfo Error : {0}", "something went wrong with employee info api");
                                    //AcmiilApiServices.LogoutSessionFromAcmiil(LoginId, Session.SessionID, AcmiilConstants.PRODUCT_WEB, RequestingBrowser, AcmiilConstants.DEVICES_WEB, strIpAddress, client);
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

                                //Commented by hvb on 22/01/2018 for new boi changes
                                //mObjloggedInUser.AddSegment(enSegmentType, mLstclientInfos[0].CommonClientcode.ToString(), mLstclientInfos[0].ClientCode, mLstclientInfos[0].ActiveFlag, mLstclientInfos[0].TrdAllowed);

                                mObjloggedInUser.AddSegment(enSegmentType, mLstclientInfos[0].CommonClientcode.ToString(), mLstclientInfos[0].ClientCode, mLstclientInfos[0].ActiveFlag, mLstclientInfos[0].TrdAllowed, mLstclientInfos[0].ETFlag, mLstclientInfos[0].BOIFlag, mLstclientInfos[0].SynFlag, mLstclientInfos[0].UserType, mLstclientInfos[0].POAFlag);
                                objWebUser = mObjloggedInUser;
                                //System.Diagnostics.Debug.WriteLine(mObjloggedInUser.ToString());


                                //vpg on 02022018 to save user client code in global variable 
                                //regular registered user login like 52181 

                                //working cmnted by vpg 04042018
                                //mod hvb 26/04/2018 added clear default watchlist
                                //string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); clearClntDetails(); clearClntInfo();},150);   </script> ";
                                string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo();},150);   </script> ";

                                ScriptManager.RegisterStartupScript(pg, typeof(Page), "CCIDfn", script, false);
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
                            //if client type is emp then it's ctcl login else normal login

                            if (GlobalVariables.IsCTCLEnabled.ToUpper() == "FALSE")
                            {
                                pg.ClientScript.RegisterStartupScript(pg.GetType(), "msgbox", "alert('CTCL Login is not allowed, please check URL'); ", true);
                                return null;
                            }
                            mObjloggedInUser.AddSegment(MarketSegments.FO, mLstclientInfos[0].CommonClientcode, mLstclientInfos[0].ClientCode, "Y", "Y");
                            objWebUser = mObjloggedInUser;
                            empInfo = service.GetEmployeeInfo(mLstclientInfos[0].CommonClientcode);

                            if (empInfo.EmpCTCL.Count > 0)
                            {
                                if (empInfo.EmpCTCL[0].MsgCode == 0)
                                {
                                    //lblError.Text = String.Format("Get EmpInfo Error : {0}", empInfo.EmpCTCL[0].Msg);

                                    objWebUser = null;
                                }
                                else
                                {
                                    foreach (EmpCTCL empCtclInfo in empInfo.EmpCTCL)
                                        mObjloggedInUser.AddEmpInfo(empCtclInfo);

                                    objWebUser = mObjloggedInUser;
                                }
                                //here it is coming employee details so set it along with common client code
                                //string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); clearClntDetails(); clearClntInfo(); setEmpDetails('" + mObjloggedInUser.GetEmployeeDetail(MarketSegments.CM).CTCLID + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo(); setEmpDetails('" + mObjloggedInUser.GetEmployeeDetail(MarketSegments.CM).CTCLID + "', '" + mObjloggedInUser.sUserType + "');},150);   </script> ";
                                ScriptManager.RegisterStartupScript(pg, typeof(Page), "CCIDfn", script, false);
                            }
                            else
                            {
                                //lblError.Text = String.Format("Get EmpInfo Error : {0}", "something went wrong with employee info api");
                                //AcmiilApiServices.LogoutSessionFromAcmiil(LoginID, SessionID, AcmiilConstants.PRODUCT_WEB, BrowserInfo, AcmiilConstants.DEVICES_WEB, IP,);
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
                                
                                mObjloggedInUser.AddSegment(enSegmentType, mObjClientDetail.CommonClientcode.ToString(), mObjClientDetail.ClientCode, mObjClientDetail.ActiveFlag, mObjClientDetail.TrdAllowed, mObjClientDetail.ETFlag, mObjClientDetail.BOIFlag, mObjClientDetail.SynFlag, mObjClientDetail.UserType, mObjClientDetail.POAFlag);
                            }
                            objWebUser = mObjloggedInUser;
                            System.Diagnostics.Debug.WriteLine(mObjloggedInUser.ToString());

                            //to save user client code in global variable 
                            
                            string script = " <script type=\"text/javascript\"> setTimeout(function(){setGlobalVariable('CCID','" + mObjloggedInUser.sTradingCode + "'); cleardefualtwatchlist(); clearClntDetails(); clearClntInfo();},150);   </script> ";
                            
                            ScriptManager.RegisterStartupScript(pg, typeof(Page), "CCIDfn", script, false);
                            
                        }
                    }
                }


            }
            catch (Exception ex)
            {


            }

            return objWebUser;
        }

        public static bool hasSession(string LoginId, string SessionId)
        {
            bool isSessionActive = false;

            try
            {
                DataTable dt = SqlHelper.ReadTable("select CommonClientCode from acmcompare.dbo.SessionLog where LoginID='" + LoginId + "' and ActiveFlag = 'Y'  and SessionID='" + SessionId + "'", GlobalVariables.SqlAcmCompare, false);
                if (dt.Rows.Count > 0)
                {
                    isSessionActive = true;
                }
            }
            catch (Exception ex)
            {


            }

            return isSessionActive;

        }

        public static void SafelyTrasnsferPage(string Url, HttpResponse response,HttpContext context)
        {
            response.Redirect(Url, false);
            context.ApplicationInstance.CompleteRequest();
        }

        public static void LogOut(HttpSessionState Session, HttpResponse response, HttpContext context,System.Web.UI.Page page)
        {
            //Added NYN 14/11/2017 for makin logout global
            //if (Session[WebUser.SessionName] != null)
            //    AcmiilApiServices.LogoutSessionFromAcmiil(((WebUser)Session[WebUser.SessionName]));
            //Session[WebUser.SessionName] = null;
            //SafelyTrasnsferPage("~/WebForms/Login.aspx", response, context);
            
            //Modified by hvb on 08/12/2017 allow logout only if it actually was logout
              if (Session[WebUser.SessionName] != null)
                if (AcmiilApiServices.LogoutSessionFromAcmiil(((WebUser)Session[WebUser.SessionName])))
                {
                    Session["ManualLogout"] = true;
                    Session[WebUser.SessionName] = null;
                    SafelyTrasnsferPage("~/WebForms/Login.aspx", response, context);
                    //ScriptManager.RegisterStartupScript(page, page.GetType(), "mykey_logout", "window.close();", true);
                }
        }
        
        public static void LogOut(HttpSessionState Session)
        {
            //ADDED by hvb on 22/12/2017 
            if (Session[WebUser.SessionName] != null)
                if (AcmiilApiServices.LogoutSessionFromAcmiil(((WebUser)Session[WebUser.SessionName])))
                {
                    Session["ManualLogout"] = true;
                    Session[WebUser.SessionName] = null;
                    //SafelyTrasnsferPage("~/WebForms/Login.aspx", response, context);
                    
                }
        }

    }
}