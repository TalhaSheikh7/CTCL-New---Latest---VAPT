using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CTCLProj.Controllers
{
    public class SettingsController : Controller
    {
        // GET: Settings
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult getUserSettings(string nCCC)
        {
            string mStrConnection = GlobalVariables.SQLConn;
            List<sUserSettings> lstSetting = new List<sUserSettings>();
            sUserSettings sUser = new sUserSettings();
            string CommonClientCode = "";
            int Count = 0;
            try
            {
                DataTable dto = SqlHelper.ReadTable("spCTCLSettingsCRUD", mStrConnection, true,
                                                            SqlHelper.AddInParam("@Option", SqlDbType.Int, 2),
                                                            SqlHelper.AddInParam("@CommonClientCode", SqlDbType.VarChar, nCCC));

                Count = dto.Rows.Count;

                if (dto.Rows.Count > 0)
                {
                    DataRow row = dto.Rows[0];
                    
                    JObject joResponse2 = JObject.Parse(row["SettingDetails"].ToString());
                    CommonClientCode = row["CommonClientCode"].ToString();
                    sUser = JsonConvert.DeserializeObject<sUserSettings>(joResponse2.ToString());
                    // LegerBal = Convert.ToDecimal(LegerBal1);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return Json(new { sUser, CommonClientCode, Count }, JsonRequestBehavior.AllowGet);
        }

        [ValidateInput(false)]
        public ActionResult SaveUserSettings(string CommonClientCode, string ModuleId, string SettingDetails, string LoginType)
        {
            string mStrConnection = GlobalVariables.SQLConn;
            List<sUserSettings> lstSetting = new List<sUserSettings>();

            try
            {
                DataTable dto = SqlHelper.ReadTable("spCTCLSettingsCRUD", mStrConnection, true,
                                                            SqlHelper.AddInParam("@Option", SqlDbType.Int, 1),
                                                            SqlHelper.AddInParam("@CommonClientCode", SqlDbType.VarChar, CommonClientCode),
                                                            SqlHelper.AddInParam("@SettingDetails", SqlDbType.VarChar, SettingDetails),
                                                            SqlHelper.AddInParam("@LoginType", SqlDbType.VarChar, LoginType));

                if (dto.Rows.Count > 0)
                {
                    lstSetting.Add(new sUserSettings()
                    {
                        Result = dto.Rows[0]["Response"].ToString(),
                        ResponseCode = (int)dto.Rows[0]["RespCode"],
                    });
                        
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return Json(lstSetting, JsonRequestBehavior.AllowGet);
        }

        public NameValueCollection ToNameValueCollection<TKey, TValue>(IDictionary<TKey, TValue> dict)
        {
            var nameValueCollection = new NameValueCollection();

            foreach (var kvp in dict)
            {
                string value = null;
                if (kvp.Value != null)
                    value = kvp.Value.ToString();

                nameValueCollection.Add(kvp.Key.ToString(), value);
            }

            return nameValueCollection;
        }
        public class sUserSettings
        {
            public string nSettingId { get; set; }
            public string nSettingDetails { get; set; }
            public string Theme { get; set; }
            public string ThemeName { get; set; }
            public string MarketWatchWidth { get; set; }
            public string MarketWatchHeight { get; set; }
            public string DepthWindowwidth { get; set; }
            public string DepthWindowheight { get; set; }
            public string TabWindowwidth { get; set; }
            public string TabWindowHeight { get; set; }
            public string nCommonClientCode { get; set; }
            public string WatchListGridOpt { get; set; }
            public string nLoginId { get; set; }
            public string Result { get; set; }
            public int ResponseCode { get; set; }
        }
    }
}