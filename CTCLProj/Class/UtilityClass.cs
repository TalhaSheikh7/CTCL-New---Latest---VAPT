using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;

namespace investmentz.Models
{

    #region Result class 
    public enum enResultStatus
    {
        NotSet,
        Error,
        Exception,
        Success

    }

    public class MVCResult
    {
        public MVCResult()
        {
            this.ResultStatus = (int)enResultStatus.NotSet;
            this.Result = null;

        }

        public int ResultStatus { get; set; }
        public object Result { get; set; }
        public string amomsg { get; set; } //vpg added 13052019 

        public void SetStatus(enResultStatus status, object result, string amomsg = "")
        {
            this.ResultStatus = (int)status;
            this.Result = result;
            this.amomsg = amomsg;
        }
    }

    public class Error
    {
        public string ErrorDescription { get; set; }
        public int? ErrorID { get; set; }
        public object OtherErrorDetails { get; set; }
    } 
    #endregion



    public class UtilityClass
    {

        #region Api Manager
        public async static Task<T> ExternalApi<T>(string BaseURL,string ControllerName, Dictionary<string, string> parameters)
        {

            string QueryPath = "";
            int iParams = 0;
            if (parameters.Count > 0)
            {            
                foreach (KeyValuePair<string, string> parameter in parameters)
                {
                    //parameter = parameters[iParams];
                    if (iParams == parameters.Count - 1)
                        QueryPath += String.Format("{0}={1}", parameter.Key, HttpUtility.UrlEncode(parameter.Value));
                    else
                        QueryPath += String.Format("{0}={1}&", parameter.Key, HttpUtility.UrlEncode(parameter.Value));
                    iParams++;
                }               
                QueryPath = "?" + QueryPath;
            }
            QueryPath =(BaseURL.EndsWith("/") ? "" : "/") + ControllerName + QueryPath;

            T GetResponse = default(T);
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(BaseURL);

                client.DefaultRequestHeaders.Clear();

                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage httpResp =  client.GetAsync(QueryPath).Result;

                if (httpResp.IsSuccessStatusCode)
                {                    
                    string responseData = await httpResp.Content.ReadAsStringAsync();
                    GetResponse = JsonConvert.DeserializeObject<T>(responseData);                   
                }
            }

            return GetResponse;
        } 
        #endregion
    }
}