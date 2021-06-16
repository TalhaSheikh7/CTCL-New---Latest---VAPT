using CTCLProj.Class;
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
        }
    }