using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.IO;
using Newtonsoft.Json;
using System.Text;
using CTCLProj.com.investmentz.ekyctest;

namespace CTCLProj.Class
{
    //For keeping session log in vitco api.
    public struct VitcoWebApiResponse
    {
        public int ResultStatus { get; set; }
        public object Result { get; set; }
    }

    public class AcmiilApiServices
    {


        public AcmiilApiServices()
        {

        }

        public List<ClientInfo> GetClientInfo(string sLoginId)
        {
            string mStrUrl = String.Format("{1}ClientInfo?ClientInfo={0}", sLoginId, GlobalVariables.AcmiilEKycBaseURL);

            WebRequest req = WebRequest.Create(mStrUrl);
            req.Method = "GET";
            //req.Headers.Add("key");
            req.ContentType = "application/json; charset=utf-8";
            WebResponse resp = req.GetResponse();
            Stream stream = resp.GetResponseStream();
            StreamReader re = new StreamReader(stream);
            string json = re.ReadToEnd();
            return JsonConvert.DeserializeObject<ClientInforResponse>(json).ClientInfo;
        }

        public AcmiilApiResponse ValidateMPIN(string sLoginId, string sMpin)
        {
            string mStrUrl = String.Format("{2}Authenticate/ValidateMPIN?LoginId={0}&MPIN={1}&Type=V", sLoginId, sMpin, GlobalVariables.AcmiilApiBaseURL);

            WebRequest req = WebRequest.Create(mStrUrl);
            req.Method = "GET";
            //req.Headers.Add("key");
            req.ContentType = "application/json; charset=utf-8";
            WebResponse resp = req.GetResponse();
            Stream stream = resp.GetResponseStream();
            StreamReader re = new StreamReader(stream);
            string json = re.ReadToEnd();
            return JsonConvert.DeserializeObject<AcmiilApiResponse>(json);
        }

        public AcmiilEmpInfoResponse GetEmployeeInfo(string sEmpCode)
        {
            string mStrUrl = String.Format("{1}EmpCTCLid?EmpCd={0}", sEmpCode , GlobalVariables.AcmiilEKycBaseURL);

            WebRequest req = WebRequest.Create(mStrUrl);
            req.Method = "GET";
            //req.Headers.Add("key");
            req.ContentType = "application/json; charset=utf-8";
            WebResponse resp = req.GetResponse();
            Stream stream = resp.GetResponseStream();
            StreamReader re = new StreamReader(stream);
            string json = re.ReadToEnd();
            return JsonConvert.DeserializeObject<AcmiilEmpInfoResponse>(json);
        }

        public static bool LogoutSessionFromAcmiil(WebUser objLoggedInUser, AuthenticateService svcClnt = null)
        {
            //Added by hvb on 13/11/2017 for keeping session log in vitco api.
            //SaveSessionToVitco(ref objLoggedInUser, false);
            //return LogoutSessionFromAcmiil(objLoggedInUser.sLoginId, objLoggedInUser.sSessionID, objLoggedInUser.sProduct, objLoggedInUser.sBrowser, objLoggedInUser.sDevice, objLoggedInUser.sIpAddress);
            
            //Modified by hvb on 06/12/2017 as above flow is causing logout not to happen
            if (LogoutSessionFromAcmiil(objLoggedInUser.sLoginId, objLoggedInUser.sSessionID, objLoggedInUser.sProduct, objLoggedInUser.sBrowser, objLoggedInUser.sDevice, objLoggedInUser.sIpAddress))
                return SaveSessionToVitco(ref objLoggedInUser, false);
             else
                return false;
        }

        public static bool LogoutSessionFromAcmiil(string sLoginId, string sSessionId, string sProduct, string sBrowser, string sDevice, string sIpAdd, AuthenticateService svcClnt = null)
        {
            if (svcClnt == null)
                svcClnt = new AuthenticateService();

            AuthResponse resp = svcClnt.SessionManage(sLoginId, sSessionId, sProduct, sBrowser, sDevice, sIpAdd, AcmiilConstants.SESSION_LOGOUT);
            if (resp.RespCode == "1")
                return true;
            else
                return false;
        }

        public static bool IsSessionValidAtAcmiil(WebUser objLoggedInUser, AuthenticateService svcClnt = null)
        {
            return IsSessionValidAtAcmiil(objLoggedInUser.sLoginId, objLoggedInUser.sSessionID, objLoggedInUser.sProduct, objLoggedInUser.sBrowser, objLoggedInUser.sDevice, objLoggedInUser.sIpAddress);
        }

        public static bool IsSessionValidAtAcmiil(string sLoginId, string sSessionId, string sProduct, string sBrowser, string sDevice, string sIpAdd, AuthenticateService svcClnt = null)
        {
            if (svcClnt == null)
                svcClnt = new AuthenticateService();

            AuthResponse resp = svcClnt.SessionManage(sLoginId, sSessionId, sProduct, sBrowser, sDevice, sIpAdd, AcmiilConstants.SESSION_VALIDATE);
            if (resp.RespCode == "1")
                return true;
            else
                return false;
        }

        //Added by hvb on 06/12/2017 for duplicate login check
        public static string IsUserLoggedin(string sLoginId, string sProduct, AuthenticateService svcClnt = null)
        {
            if (svcClnt == null)
                svcClnt = new AuthenticateService();

            AuthResponse resp = svcClnt.SessionManage(sLoginId, "", sProduct, "", "", "", AcmiilConstants.SESSION_VALIDATE);
            if (resp.RespCode == "1")
                return "";
            else
                return resp.RespMessage;
        }

        //Added by hvb on 13/11/2017 for keeping session log in vitco api.
        public static bool SaveSessionToVitco(ref WebUser objLoggedInUser, bool bForLogin)
        {
            string mStrUrl = String.Format("{0}SessionV1/",GlobalVariables.VitcoApiBaseURL);

            if (bForLogin)
            {
                using (WebClient client = new WebClient())
                {
                    System.Collections.Specialized.NameValueCollection sesseionValues = new System.Collections.Specialized.NameValueCollection();
                    sesseionValues["sLoginId"] = objLoggedInUser.sLoginId;
                    sesseionValues["sName"] = objLoggedInUser.sName;
                    sesseionValues["sExpiryDaysMessage"] = objLoggedInUser.sExpiryDaysMessage;
                    sesseionValues["nSessionID"] = objLoggedInUser.nSessionId.ToString();
                    sesseionValues["sSessionID"] = objLoggedInUser.sSessionID;
                    sesseionValues["sIpAddress"] = objLoggedInUser.sIpAddress;
                    sesseionValues["sProduct"] = objLoggedInUser.sProduct;
                    if (objLoggedInUser.sUserType.ToLower() == "reg")
                    {
                        sesseionValues["sDevice"] = objLoggedInUser.sDevice;
                    }
                    else
                    {
                        sesseionValues["sDevice"] = "CTCL";
                    }
                    sesseionValues["sBrowser"] = objLoggedInUser.sBrowser;
                    sesseionValues["sCommonClientCode"] = objLoggedInUser.sTradingCode;
                    sesseionValues["bCanTradeInFO"] = objLoggedInUser.CanTradeInSegment(MarketSegments.FO).ToString();
                    sesseionValues["bCanTradeInEQ"] = objLoggedInUser.CanTradeInSegment(MarketSegments.CM).ToString();
                    sesseionValues["bCanTradeInCD"] = objLoggedInUser.CanTradeInSegment(MarketSegments.CD).ToString();
                    sesseionValues["sFOClientCode"] = objLoggedInUser.SegmentClientCode(MarketSegments.FO);
                    sesseionValues["sEQClientCode"] = objLoggedInUser.SegmentClientCode(MarketSegments.CM);
                    sesseionValues["sCDClientCode"] = objLoggedInUser.SegmentClientCode(MarketSegments.CD);

                    //SegmentDetails objBOIDetails = objLoggedInUser.GetSegmentDetail(MarketSegments.CM);
                    //sesseionValues["bIsBOIClient"] = objBOIDetails.IsBOIClient.ToString();
                    //sesseionValues["bIsPOA"] = objBOIDetails.IsPOA.ToString();
                    //sesseionValues["bIsEt"] = objBOIDetails.IsEt.ToString();
                    //sesseionValues["bIsSyn"] = objBOIDetails.IsSyn.ToString();

                    //sesseionValues["sUserType"] = objBOIDetails.UserType.ToString();

                   //objBOIDetails.IsSyn;


                    byte[] response = client.UploadValues(mStrUrl, sesseionValues);

                    string responseString = Encoding.Default.GetString(response);
                    
                    //Modified by hvb on 22/01/2018 save only vitco session id.
                    //objLoggedInUser = JsonConvert.DeserializeObject<WebUser>(((JsonConvert.DeserializeObject<VitcoWebApiResponse>(responseString)).Result).ToString());
                    objLoggedInUser.nSessionId = JsonConvert.DeserializeObject<WebUser>(((JsonConvert.DeserializeObject<VitcoWebApiResponse>(responseString)).Result).ToString()).nSessionId;

                    return true;
                }
            }
            else
            {
                if (objLoggedInUser.nSessionId <= 0)
                    return false;
                else
                {
                    mStrUrl += String.Format("?nSessionKey={0}", objLoggedInUser.nSessionId);
                    WebRequest req = WebRequest.Create(mStrUrl);
                    req.Method = "DELETE";

                    WebResponse resp = req.GetResponse();
                    Stream stream = resp.GetResponseStream();
                    StreamReader re = new StreamReader(stream);
                    string json = re.ReadToEnd();

                    objLoggedInUser = JsonConvert.DeserializeObject<WebUser>(json);
                    return true;
                }
            }
        }

        //added by tsheikh 160819
        public static bool PutNotification(ref WebUser objLoggedInUser, bool bForLogin, string token)
        {
            string mStrUrl = String.Format("{0}SessionV1/", GlobalVariables.VitcoApiBaseURL);

            if (bForLogin)
            {
                using (WebClient client = new WebClient())
                {
                    //System.Collections.Specialized.NameValueCollection sesseionValues = new System.Collections.Specialized.NameValueCollection();
                    //sesseionValues["sCCC"] = objLoggedInUser.sTradingCode;
                    //sesseionValues["sDeviceToken"] = token;
                    //sesseionValues["sLoginId"] = objLoggedInUser.sLoginId;
                    //sesseionValues["sSessionID"] = objLoggedInUser.sSessionID;

                    string Params = $"'sCCC':'{objLoggedInUser.sTradingCode}','sDeviceToken':'{token}','sLoginId':'{objLoggedInUser.sLoginId}','sSessionID':'{objLoggedInUser.sSessionID}'";
                    Params = "{" + Params + "}";

                    //for put webclient
                    client.Headers.Add("Content-Type", "application/json");
                    //string data = "sCCC = " + objLoggedInUser.sTradingCode + " sDeviceToken = " + token + " sLoginId = " + objLoggedInUser.sLoginId + " sSessionID = " + objLoggedInUser.sSessionID;
                    //client.UploadString(mStrUrl, "PUT", JsonConvert.SerializeObject(sesseionValues));
                    //string responseString = client.UploadString(mStrUrl + "?" + "sCCC=" + objLoggedInUser.sTradingCode + "&sDeviceToken="+ token+ "&sLoginId="+ objLoggedInUser.sLoginId+ "&sSessionID=" + objLoggedInUser.sSessionID, "PUT", string.Empty);
                    string responseString = client.UploadString(mStrUrl, "PUT", Params);

                    //string responseString = Encoding.Default.GetString(response);


                    //Modified by hvb on 22/01/2018 save only vitco session id.
                    //objLoggedInUser = JsonConvert.DeserializeObject<WebUser>(((JsonConvert.DeserializeObject<VitcoWebApiResponse>(responseString)).Result).ToString());
                    //objLoggedInUser.nSessionId = JsonConvert.DeserializeObject<WebUser>(((JsonConvert.DeserializeObject<VitcoWebApiResponse>(responseString)).Result).ToString()).nSessionId;

                    return true;
                }
            }
            else
            {
                if (objLoggedInUser.nSessionId <= 0)
                    return false;
                else
                {
                    mStrUrl += String.Format("?nSessionKey={0}", objLoggedInUser.nSessionId);
                    WebRequest req = WebRequest.Create(mStrUrl);
                    req.Method = "DELETE";

                    WebResponse resp = req.GetResponse();
                    Stream stream = resp.GetResponseStream();
                    StreamReader re = new StreamReader(stream);
                    string json = re.ReadToEnd();

                    objLoggedInUser = JsonConvert.DeserializeObject<WebUser>(json);
                    return true;
                }
            }
        }

    }

    public class EmpCTCL
    {
        public int MsgCode { get; set; }
        public string Msg { get; set; }
        public string EmpCode { get; set; }
        public string CTCLLoginID { get; set; }
        public string Exchange { get; set; }
        public string Segment { get; set; }
        public string NEATUserID { get; set; }
        public string CTCLID { get; set; }
        public string BACode { get; set; }
    }

    public class AcmiilEmpInfoResponse
    {
        public List<EmpCTCL> EmpCTCL { get; set; }
    }

    public class AcmiilApiResponse
    {
        public string RespCode { get; set; }
        public string RespMessage { get; set; }
    }

    public class AcmiilWebWrapper
    {
        public bool IsSuccess { get; set; }
        public object Data { get; set; } // if error contains error message else actual object
    }

    public static class AcmiilConstants
    {
        public const string SEGMENT_EQ = "CASH";
        public const string SEGMENT_FO = "DER";
        public const string SEGMENT_FNO = "F&O"; //Added hvb 15/03/18 for f&o they also send this constant from their api
        public const string SEGMENT_CD = "CDER";

        public const string PRODUCT_WEB = "1";
        public const string PRODUCT_APP = "3";

        public const string DEVICES_WEB = "Web";
        public const string DEVICES_APP = "Mobile";

        public const string SESSION_CREATE = "I";
        public const string SESSION_LOGOUT = "U";
        public const string SESSION_VALIDATE = "V";
    }

    public class ClientInforResponse
    {
        public List<ClientInfo> ClientInfo { get; set; }
    }

    public struct ClientInfo
    {
        //{"ClientInfo":[{"CommonClientcode":901990,"ClientName":"KUNAL MACHHINDRA SUKHDEVE","Segment":"CASH","ClientCode":"901990","TrdAllowed":"Y","ActiveFlag":"Y"},{"CommonClientcode":901990,"ClientName":"KUNAL MACHHINDRA SUKHDEVE","Segment":"MF","ClientCode":"901991","TrdAllowed":"Y","ActiveFlag":"Y"}]}
        //{"ClientInfo":[{"Status":0,"ResponseMessage":"Incorrect Client Code"}]}

        /*public long? CommonClientcode { get; set; }
        public string ClientName { get; set; }
        public string Segment { get; set; }
        public string ClientCode { get; set; }
        public string TrdAllowed { get; set; }
        public string ActiveFlag { get; set; }
        public int? Status { get; set; }
        public string ResponseMessage { get; set; }*/

        public int Status { get; set; }
        public string ResponseMessage { get; set; }
        public string CommonClientcode { get; set; }
        public string ClientName { get; set; }
        public string Segment { get; set; }
        public string ClientCode { get; set; }
        public string TrdAllowed { get; set; }
        public string ActiveFlag { get; set; }

        //Added by hvb on 22/01/2018
        public string ETFlag { get; set; }
        public string BOIFlag { get; set; }
        public string SynFlag { get; set; }
        public string UserType { get; set; }
        public string POAFlag { get; set; }

        public string BACode { get; set; }
    }
}