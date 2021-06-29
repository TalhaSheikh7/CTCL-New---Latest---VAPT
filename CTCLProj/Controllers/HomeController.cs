﻿using CTCLProj.Class;
using investmentz.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
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

        public void FundTransfer()
        {
            string OpenUrl = "";

            //WebUser CurrentUser = (WebUser)Session[WebUser.SessionName];
            string userType = "ba";
            //if(CurrentUser.sUserType.ToLower() == "ba")
            if (userType == "ba")
            {
                List<ClientInfo> info = new AcmiilApiServices().GetClientInfo("tsheikh7");
                foreach (ClientInfo cinfo in info)
                {
                    if (cinfo.Segment == AcmiilConstants.SEGMENT_EQ)
                    {
                        if (cinfo.BOIFlag == "Y")
                        {
                            string mStrUrl = String.Format(GlobalVariables.BOIClientURL);

                            var dto = new Enr
                            {
                                clientcode = "200010",
                                UserId = "boitest"
                            };

                            var sdffd = JsonConvert.SerializeObject(dto);
                            string encrypturl = EncryptDecrypt.EncryptString(sdffd, true);

                            OpenUrl = String.Format(mStrUrl + "?u={0}", encrypturl);

                            Response.Redirect(OpenUrl);
                        }
                        else
                        {
                            Response.Write("<script>alert('Fund Transfer for Non BOI clients Not possible');window.close();</script>");
                        }

                        
                    }
                }
            }
            else
            {
                //SegmentDetails EQDetails = CurrentUser.GetSegmentDetail(MarketSegments.CM);
                //if (EQDetails.IsBOIClient)
                var Boi = "N";
                if (Boi == "Y")
                {
                    // BOI 
                    string mStrUrl = String.Format(GlobalVariables.BOIClientURL);
                    var dto = new Enr
                    {
                        clientcode = "200010",
                        UserId = "boitest"
                    };
                    var sdffd = JsonConvert.SerializeObject(dto);
                    string encrypturl = EncryptDecrypt.EncryptString(sdffd, true);

                    OpenUrl = String.Format(mStrUrl + "?u={0}", encrypturl);
                }
                else 
                {
                    //non BOI Client
                   
                    string CurrentPageUrl = System.Web.HttpContext.Current.Request.Url.AbsoluteUri;
                    OpenUrl = String.Format("https://www.investmentz.com/Payment/Index");
                }

                Response.Redirect(OpenUrl);
            }
        }

        public JsonResult clientnameanducc()
        {
            if (Request.Cookies["LoginId"]?.Value == null && Request.Cookies["SessionId"]?.Value == null)
            {
                HttpCookie aCookie;
                string cookieName;
                int limit = Request.Cookies.Count;
                for (int i = 0; i < limit; i++)
                {
                    cookieName = Request.Cookies[i].Name;
                    aCookie = new HttpCookie(cookieName);
                    aCookie.Expires = DateTime.Now.AddDays(-2); // make it expire yesterday 
                    Response.Cookies.Add(aCookie); // overwrite it
                }
                // Code disables caching by browser.
                Response.Cache.SetCacheability(HttpCacheability.NoCache);
                Response.Cache.SetExpires(DateTime.UtcNow.AddHours(-24));
                Response.Cache.SetNoStore();
                return Json(false, JsonRequestBehavior.AllowGet); ;
            }

            return Json(true, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Old_GoToBackReport()
        {
            var LoginId = Request.Cookies["LoginId"]?.Value;
            var sessioncompaire = Request.Cookies["SessionId"]?.Value;

            //var LoginId = "ACM5046";
            // var sessioncompaire = "24a7d762-1700-4191-b94f-46c22f6f7d09";
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
    }
}