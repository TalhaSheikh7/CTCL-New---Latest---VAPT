using CTCLProj.Class;
using investmentz.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;

namespace CTCLProj.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "Welcome to ASP.NET MVC!";
            //Response.AddHeader("Refresh", "60");
            //Response.AddHeader("Refresh", Convert.ToString((Session.Timeout * 10) + 5));
            return View();
        }

        public class Enr
        {
            public string clientcode { get; set; }
            public string UserId { get; set; }
        }
        public void GetHolding()
        {
            string OpenUrl = "";
            List<ClientInfo> info = new AcmiilApiServices().GetClientInfo("Vandana");
            foreach (ClientInfo cinfo in info)
            {
                if (cinfo.Segment == AcmiilConstants.SEGMENT_EQ)
                {
                    if (cinfo.BOIFlag == "Y")
                    {
                        string mStrUrl = String.Format(GlobalVariables.BOIClientURL);

                        var dto = new Enr
                        {
                            clientcode = "200012",
                            UserId = "Vandana"
                        };

                        var sdffd = JsonConvert.SerializeObject(dto);
                        string encrypturl = EncryptDecrypt.EncryptString(sdffd, true);

                        OpenUrl = String.Format(mStrUrl + "?u={0}", encrypturl);
                    }
                    else
                    {

                        return;
                    }

                   // Response.Redirect(OpenUrl);
                }
            }
            Response.Redirect(OpenUrl);
        }

        public JsonResult FundTransfer(string CCC)
        {
            List<string> clientData = new List<string>();
            string OpenUrl = "";
            string resp = "";
            WebUser CurrentUser = (WebUser)Session[WebUser.SessionName];
            if (CurrentUser.sUserType.ToLower() == "emp")
            {
                List<ClientInfo> info = new AcmiilApiServices().GetClientInfo(CCC);
                foreach (ClientInfo cinfo in info)
                {
                    if (cinfo.Segment == AcmiilConstants.SEGMENT_EQ)
                    {
                        if (cinfo.BOIFlag == "Y")
                        {
                            string mStrUrl = String.Format(GlobalVariables.BOIClientURL);
                            var dto = new Enr
                            {
                                clientcode = CCC,
                                UserId = CurrentUser.sLoginId,
                            };

                            var sdffd = JsonConvert.SerializeObject(dto);
                            string encrypturl = EncryptDecrypt.EncryptString(sdffd, true);

                            OpenUrl = String.Format(mStrUrl + "?u={0}", encrypturl);
                            resp = "0";
                            clientData.Add(OpenUrl);
                            clientData.Add(resp);
                        }
                        else
                        {
                            resp = "1";
                            OpenUrl = "";
                            clientData.Add(resp);
                            //Response.Write("<script>alert('Fund Transfer for Non BOI clients Not possible');window.close();</script>");
                        }
                    }
                }
            }
            else
            {
                SegmentDetails EQDetails = CurrentUser.GetSegmentDetail(MarketSegments.CM);
                if (EQDetails.IsBOIClient)
                {
                    string mStrUrl = String.Format(GlobalVariables.BOIClientURL);
                    var dto = new Enr
                    {
                        clientcode = CCC,
                        UserId = CurrentUser.sLoginId,
                    };

                    var sdffd = JsonConvert.SerializeObject(dto);
                    string encrypturl = EncryptDecrypt.EncryptString(sdffd, true);

                    OpenUrl = String.Format(mStrUrl + "?u={0}", encrypturl);
                    resp = "0";
                    clientData.Add(OpenUrl);
                    clientData.Add(resp);
                }
                else
                {
                    string CurrentPageUrl = System.Web.HttpContext.Current.Request.Url.AbsoluteUri;
                    OpenUrl = String.Format("https://www.investmentz.com/Payment/Index");
                    resp = "2";
                    clientData.Add(OpenUrl);
                    clientData.Add(resp);
                }
            }
            return Json(clientData, JsonRequestBehavior.AllowGet);
        }

        //public void FundTransfer(string CCC)
        //{
        //    string OpenUrl = "";

        //    WebUser CurrentUser = (WebUser)Session[WebUser.SessionName];
        //    //string userType = "ba";
        //    if(CurrentUser.sUserType.ToLower() == "emp")
        //    //if (userType == "ba")
        //    {
        //        List<ClientInfo> info = new AcmiilApiServices().GetClientInfo(CCC);
        //        foreach (ClientInfo cinfo in info)
        //        {
        //            if (cinfo.Segment == AcmiilConstants.SEGMENT_EQ)
        //            {
        //                if (cinfo.BOIFlag == "Y")
        //                {
        //                    string mStrUrl = String.Format(GlobalVariables.BOIClientURL);

        //                    var dto = new Enr
        //                    {
        //                        clientcode = CCC,
        //                        UserId = CurrentUser.sLoginId,
        //                    };

        //                    var sdffd = JsonConvert.SerializeObject(dto);
        //                    string encrypturl = EncryptDecrypt.EncryptString(sdffd, true);

        //                    OpenUrl = String.Format(mStrUrl + "?u={0}", encrypturl);

        //                    Response.Write("<script>window.location.('" + OpenUrl + "');</script>");
                            
        //                    //Response.Redirect(OpenUrl);
                           
        //                }
        //                else
        //                {
        //                    Response.Write("<script>alert('Fund Transfer for Non BOI clients Not possible');window.close();</script>");
        //                }

                        
        //            }
        //        }
        //    }
        //    else
        //    {
        //        SegmentDetails EQDetails = CurrentUser.GetSegmentDetail(MarketSegments.CM);
        //        if (EQDetails.IsBOIClient)
        //        //var Boi = "N";
        //        //if (Boi == "Y")
        //        {
        //            // BOI 
        //            string mStrUrl = String.Format(GlobalVariables.BOIClientURL);
        //            var dto = new Enr
        //            {
        //                clientcode = CCC,
        //                UserId = CurrentUser.sLoginId,
        //            };
        //            var sdffd = JsonConvert.SerializeObject(dto);
        //            string encrypturl = EncryptDecrypt.EncryptString(sdffd, true);

        //            OpenUrl = String.Format(mStrUrl + "?u={0}", encrypturl);
        //        }
        //        else 
        //        {
        //            //non BOI Client
                   
        //            string CurrentPageUrl = System.Web.HttpContext.Current.Request.Url.AbsoluteUri;
        //            OpenUrl = String.Format("https://www.investmentz.com/Payment/Index");
        //        }

        //        Response.Redirect(OpenUrl);
        //    }
        //}

        public JsonResult clientnameanducc()
        {
            var clientdetails = new clientssdata();
            try
            {
                if (Request.Cookies["SessionId"]?.Value == "" || Request.Cookies["SessionId"]?.Value == null || Request.Cookies["LoginId"]?.Value == null || Request.Cookies["LoginId"]?.Value == "")
                {
                    try
                    {
                        //var LoginId = Session["SessionLoginID"] == null ? "" : Session["SessionLoginID"].ToString();
                        var LoginId = Request.Cookies["LoginId"]?.Value;
                        var sessionId = HttpContext.Session.SessionID == null ? "" : HttpContext.Session.SessionID;
                        clientdetails.UserType = Convert.ToString(LoginId);
                        var sessioncompaire = sessionId;
                        string FinancialPlanning = ConfigurationManager.ConnectionStrings["DBWHDB1ACMCompare"].ConnectionString;
                        using (SqlConnection connection = new SqlConnection(FinancialPlanning))
                        {
                            //DataTable dto = MFModels.SqlHelper.ReadTable("select top 1 CommonClientCode, sessionid from acmcompare.dbo.SessionLog where LoginID='" + LoginId + "'", GlobalVariables.WHDB1acmcomper, false);
                            DataTable dto = SqlHelper.ReadTable("select top 1 CommonClientCode, sessionid from acmcompare.dbo.SessionLog where LoginID='" + LoginId + "' and ActiveFlag='Y' and SessionID='" + sessioncompaire + "' order by LoginTime desc", GlobalVariables.WHDB1acmcomper, false);
                            if (dto.Rows.Count > 0)
                            {
                                foreach (DataRow recomm in dto.Rows)
                                {
                                    clientdetails.clientcode = recomm["CommonClientCode"].ToString();
                                    clientdetails.Sessionid = recomm["sessionid"].ToString();
                                }
                            }
                            else
                            {
                                return Json(false, JsonRequestBehavior.AllowGet);
                            }
                            if (clientdetails.clientcode == "")
                            {
                                return Json(false, JsonRequestBehavior.AllowGet);
                            }
                        }
                    }
                    catch (Exception ex)
                    {

                        throw ex;
                    }
                }
                else
                {
                    Session["CheckLoginTime"] = Request.Cookies["SessionId"]?.Value;
                    Session["SessionLoginID"] = Request.Cookies["LoginId"]?.Value;
                    try
                    {
                        var LoginId = Session["SessionLoginID"] == null ? "" : Session["SessionLoginID"].ToString();
                        var sessionId = Session["CheckLoginTime"] == null ? "" : Session["CheckLoginTime"].ToString();
                        clientdetails.UserType = Convert.ToString(LoginId);
                        var sessioncompaire = sessionId;
                        string FinancialPlanning = ConfigurationManager.ConnectionStrings["DBWHDB1ACMCompare"].ConnectionString;
                        using (SqlConnection connection = new SqlConnection(FinancialPlanning))
                        {
                            DataTable dto = SqlHelper.ReadTable("select top 1 CommonClientCode, sessionid from acmcompare.dbo.SessionLog where LoginID='" + LoginId + "' and ActiveFlag='Y' and SessionID='" + sessioncompaire + "' order by LoginTime desc", GlobalVariables.WHDB1acmcomper, false);
                            if (dto.Rows.Count > 0)
                            {
                                foreach (DataRow recomm in dto.Rows)
                                {
                                    clientdetails.clientcode = recomm["CommonClientCode"].ToString();
                                    clientdetails.Sessionid = recomm["sessionid"].ToString();
                                }
                            }
                            else
                            {
                                return Json(false, JsonRequestBehavior.AllowGet);
                            }
                            if (clientdetails.clientcode == "")
                            {
                                return Json(false, JsonRequestBehavior.AllowGet);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        return Json(ex, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(ex, JsonRequestBehavior.AllowGet);
            }
            //if (Request.Cookies["LoginId"]?.Value == null && Request.Cookies["SessionId"]?.Value == null)
            //{
            //    return Json(false, JsonRequestBehavior.AllowGet); ;
            //}

            return Json(clientdetails, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Old_GoToBackReport()
        {
            var LoginId = Request.Cookies["LoginId"]?.Value;
            var sessioncompaire = Request.Cookies["SessionId"]?.Value;

            //var LoginId = "tsheikh7";
            //var sessioncompaire = "23583c99-9b42-42c3-9e32-5ce4e9b54d60";
            List<string> AuthorList = new List<string>();
            AuthorList.Add(LoginId);
            AuthorList.Add(sessioncompaire);
            return Json(AuthorList, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Logout()
        {
            var sName = Session[WebUser.SessionName];
            if (Session[WebUser.SessionName] != null)
            {
                WebUser webDetails = (WebUser)(Session[WebUser.SessionName]);
                Dictionary<string, string> dictLogout = new Dictionary<string, string>();
                dictLogout.Add("LoginId", webDetails.sLoginId);
                dictLogout.Add("SessionId", webDetails.sSessionID);
                dictLogout.Add("ProductID", AcmiilConstants.PRODUCT_WEB);
                dictLogout.Add("BrowserInfo", RequestingBrowser);
                dictLogout.Add("DeviceInfo", AcmiilConstants.DEVICES_WEB);
                dictLogout.Add("IPAdd", ClientIP);
                dictLogout.Add("SType", AcmiilConstants.SESSION_LOGOUT);
                AcmiilApiResponse resp = UtilityClass.ExternalApi<AcmiilApiResponse>(GlobalVariables.ACMIILBaseURL, "AcmiilService/Authenticate/SessionManage", dictLogout).Result;


            }
            Session[WebUser.SessionName] = null;
            Session["KycStatus"] = null;
            Session.Abandon();
            return RedirectToAction("../Login/Login");
        }

        public string RequestingBrowser
        {
            get { return String.Format("{0} v {1}", Request.Browser.Browser, Request.Browser.Version); }
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

        public class clientssdata
        {
            public string clientname { get; set; }
            public string clientcode { get; set; }
            public string UserType { get; set; }
            public double UserSrNo { get; set; }
            public string Sessionid { get; set; }
            public string Panno { get; set; }
            public string BACode { get; set; }



            public int User_Mst_Id { get; set; }
            public string User_Code { get; set; }
            public string User_Name { get; set; }
            public int Role_ID { get; set; }
        }
    }
}