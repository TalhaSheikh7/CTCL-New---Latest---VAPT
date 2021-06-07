using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
/// <summary>
/// This class contains GlobalVariables that are used on web site.
/// </summary>
public static class GlobalVariables
{

    // A session variable is meant to be per user. 
    // A static variable is a variable that will be shared between all users.
    // So while using static variable be careful

    #region "SqlConnectionString"

    static string _SqlConnInstance;
    static string _SqlConnId;
    static string _SqlConnPass;
    static string _SqlConnectionString;



    public static string SqlConnectionString
    {
        get
        {
            return ConfigurationManager.ConnectionStrings["SQLConn_FOCM"].ConnectionString;
            // return ConfigurationManager.ConnectionStrings["SQLConn_CD"].ConnectionString;

        }

    }

    //added 18052018 hvb - jignesh bhai requirement
    public static string MFConnectionString
    {
        get
        {
            return ConfigurationManager.ConnectionStrings["connfp"].ConnectionString;
        }
    }



    public static string SqlConnectionUserName
    {
        get
        {
            return _SqlConnId;
        }
        set
        {
            _SqlConnId = value;
        }
    }

    public static string SqlConnectionUserPass
    {
        get
        {
            return _SqlConnPass;
        }
        set
        {
            _SqlConnPass = value;
        }
    }

    public static string SqlConnectionInstance
    {
        get
        {
            return _SqlConnInstance;
        }
        set
        {
            _SqlConnInstance = value;
        }
    }

    #endregion "SqlConnectionString"

    static public string GCMServerUrl { get { return @"https://android.googleapis.com/gcm/send"; } }
    static public string GCMApiKey { get { return "AIzaSyBm_GnNovNxAQESzVQsCUVR1hb-nR5ivUw"; } }

    static public string SqlConnectionStringMstoreInformativeDb { get { return ConfigurationManager.ConnectionStrings["Mstore_2705ConnectionString"].ConnectionString; } }
    //static public string SqlConnectionStringMstoreInformativeDb { get { return ConfigurationManager.ConnectionStrings["MStoreInformative"].ConnectionString; } }
    static public string NotificationImagePath { get { return ConfigurationManager.AppSettings["NotificationImagePath"]; } }
    static public string SAdvertisementsImagePath { get { return ConfigurationManager.AppSettings["AdvertiseImagePath"]; } }

    static public string InformationDetailsImagePath { get { return ConfigurationManager.AppSettings["InformationImagePath"]; } }
    static public string CategoryDetailImagePath { get { return ConfigurationManager.AppSettings["CategoryImagePath"]; } }
    static public string SubCategoryDetailImagePath { get { return ConfigurationManager.AppSettings["SubCategoryImagePath"]; } }

    static public string VitcoApiBaseURL { get { return ConfigurationManager.AppSettings["VitcoApiUrl"]; } }
    static public string AcmiilEKycBaseURL { get { return ConfigurationManager.AppSettings["AcmiilEkycUrl"]; } }
    static public string AcmiilApiBaseURL { get { return ConfigurationManager.AppSettings["AcmiilMPinServiceUrl"]; } }
    static public string BOIClientURL { get { return ConfigurationManager.AppSettings["BioUrl"]; } } //vpg 08032019 for BOI url

    static public string hFldPopupOperation1 { get { return ConfigurationManager.AppSettings["hFldPopupOperation"]; } }
    static public string hFldOpenPopupId1 { get { return ConfigurationManager.AppSettings["hFldOpenPopupId"]; } }
    static public string POPUP_FORCELOGOUT1 { get { return ConfigurationManager.AppSettings["POPUP_FORCELOGOUT"]; } }

    static public string POPUP_MPINVALIDATE1 { get { return ConfigurationManager.AppSettings["POPUP_MPINVALIDATE"]; } }
    static public string POPUP_FORGOTPWD1 { get { return ConfigurationManager.AppSettings["POPUP_FORGOTPWD"]; } }
    static public string hFldOtpVisible1 { get { return ConfigurationManager.AppSettings["hFldOtpVisible"]; } }
    static public string POPUP_CHANGEPWD1 { get { return ConfigurationManager.AppSettings["POPUP_CHANGEPWD"]; } }


    static public string POPUP_SUCCESS1 { get { return ConfigurationManager.AppSettings["POPUP_SUCCESS"]; } }






    //Added by ARV on 18-11-2020 for Sesssion check 
    public static string SqlAcmCompare
    {
        get
        {
            return ConfigurationManager.ConnectionStrings["DBWHDB1ACMCompare"].ConnectionString;
        }
    }

    //Added by ARV on 19-11-2020 for New IBT URL of Landing Page
    static public string NewIBTURL { get { return ConfigurationManager.AppSettings["NewWebRedirectURL"]; } }
    static public string NewBaseUrl { get { return ConfigurationManager.AppSettings["NewIbtBaseURL"]; } }

    //Added by ARv on 20-11-2020 
    public static string SQLConn
    {
        get
        {
            return ConfigurationManager.ConnectionStrings["SqlCon"].ConnectionString;
        }

    }


    static public string FileProdCatHostPath
    {
        get
        {

            return System.Configuration.ConfigurationManager.AppSettings["FullProductcatHostPath"];
        }

    }

    static public string FileProdCatTempPath
    {
        get
        {
            return System.Configuration.ConfigurationManager.AppSettings["ProdCatTempPath"];
        }
    }


    static public string FileProdSubCatHostPath
    {
        get
        {

            return System.Configuration.ConfigurationManager.AppSettings["FullProductSubCatHostPath"];
        }
    }

    static public string FileProdSubCatTempPath
    {
        get
        {

            return System.Configuration.ConfigurationManager.AppSettings["SubCatTempPath"];
        }
    }


    static public string FileProducts
    {
        get
        {
            return System.Configuration.ConfigurationManager.AppSettings["Product"];
        }
    }


    static public string FileTempProducts
    {
        get
        {
            return System.Configuration.ConfigurationManager.AppSettings["TempProduct"];
        }
    }

    static public string FileHostPath
    {
        get
        {
            return System.Configuration.ConfigurationManager.AppSettings["FullFileHostPath"];
        }

    }


    static public string SubcatFileHostPath
    {
        get
        {
            return System.Configuration.ConfigurationManager.AppSettings["FullSubcatHostPath"];
        }

    }

    static public string ContentFileHostPath
    {
        get
        {
            return System.Configuration.ConfigurationManager.AppSettings["ContentFileHostPath"];
        }

    }

    static public string ServerLocalMachineDomain { get; set; }

    static public string ServerSharedUploadPath
    {
        get
        {
            return System.Configuration.ConfigurationManager.AppSettings["ServerSharedUploadPath"];
        }
    }

    static public string TemporaryPath
    {
        get
        {
            return System.Configuration.ConfigurationManager.AppSettings["TempPath"];
        }
    }

    static public string SubCategoryTemporaryPath
    {
        get
        {
            return System.Configuration.ConfigurationManager.AppSettings["SubCatTempPath"];
        }
    }

    static public string InformationTemporaryPath
    {
        get
        {
            return System.Configuration.ConfigurationManager.AppSettings["InformationTempPath"];
        }
    }

    static public string NoImagePath
    {
        get
        {
            return System.Configuration.ConfigurationManager.AppSettings["DefaultImage"];
        }
    }

    static public string ServerMachineUserId
    {
        get
        {
            return System.Configuration.ConfigurationManager.AppSettings["ServerUserId"];
        }
    }

    static public string ServerMachinePassword
    {
        get
        {
            return System.Configuration.ConfigurationManager.AppSettings["ServerPassword"];
        }
    }


    //database Connection string properties added by HVB On 24/10/2017
    public static string SqlConnectionFO
    {
        get
        {
            return ConfigurationManager.ConnectionStrings["SQLConn_FOCM"].ConnectionString;
        }

    }
    public static string SqlConnectionCD
    {
        get
        {
            return ConfigurationManager.ConnectionStrings["SQLConn_CD"].ConnectionString;
        }
    }

    public static string GetClientCode
    {
        get
        {
            //System.Configuration.ConfigurationSettings.AppSettings["Setting1"];
            return System.Configuration.ConfigurationManager.AppSettings["ClientCode"];
        }
    }

    public static string IsCTCLEnabled
    {
        get
        {
            //System.Configuration.ConfigurationSettings.AppSettings["Setting1"];
            return System.Configuration.ConfigurationManager.AppSettings["CtclEnabled"];
        }


    }


}

public enum UserIdListType
{
    OnlyId,
    ExcludeId,
    OnlyIdList,
    ExcludeIdList
}

public enum MessageType
{
    SingleChatMsg,
    MultiCastMsg,
    BroadCastMsg,
    SingleFileMsg,
    MultiCastFileMsg
}

public enum GcmHttpStatus
{
    GcmOk = 200,
    GcmInvalidJson = 400,
    GcmAuthenticationFailure = 401,
    GcmInternalErrorStartRange = 500,
    GcmInternalErrorEndRange = 599
}