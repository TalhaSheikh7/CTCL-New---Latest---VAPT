using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CTCLProj.Class
{
    public class WebUser
    {

        public static string SessionName = "LoggedInUser";

        public WebUser()
        {
            Segments = new List<SegmentDetails>();
            Employees = new List<EmpInfo>();
        }

        public string sLoginId { get; set; }
        public string sName { get; set; }
        public string sExpiryDaysMessage { get; set; }
        public bool bExpiryMessageShown { get; set; }

        public string sSessionID { get; set; }
        public string sIpAddress { get; set; }
        public string sProduct { get; set; }
        public string sDevice { get; set; }
        public string sBrowser { get; set; }
        public string sTradingCode {
            get { return this.Segments.Count > 0 ? this.Segments[0].CommonClientCode: "0"; }
        }
        public long nSessionId { get; set; }

        //Added hvb 09/03/2018 for user type
        public string sUserType { get; set; }

        private List<SegmentDetails> Segments { get; set; }
        private List<EmpInfo> Employees { get; set; }

        /// <summary>
        /// Adds segment detail if it does not exist.
        /// </summary>
        /// <param name="enSegment">Segment to be added.</param>
        /// <param name="sCommonClientCode">Common client code recieved from api.</param>
        /// <param name="sClientCode">Client Code recieved from api</param>
        public void AddSegment(MarketSegments enSegment, string sCommonClientCode, string sClientCode,string sIsActive,string sCanTrade)
        {
            SegmentDetails Segment = Segments.Find(segElement => segElement.Segment == enSegment);
            if (Segment == null)
                Segments.Add(new SegmentDetails() { Segment = enSegment, ClientCode = sClientCode, CommonClientCode = sCommonClientCode, CanTrade = (sCanTrade == "Y"), IsActive = (sIsActive == "Y") });
        }

        // Added by hvb on 22/01/2018 for boi flag
        /// <summary>
        /// Adds segment detail if it does not exist.
        /// </summary>
        /// <param name="enSegment">Segment to be added.</param>
        /// <param name="sCommonClientCode">Common client code recieved from api.</param>
        /// <param name="sClientCode">Client Code recieved from api</param>
        /// <param name="sIsActive">Is user active.</param>
        /// <param name="sCanTrade">Can user trade</param>
        /// <param name="sETFlag">IS Et flag</param>
        /// <param name="sBOIFlag">IS BOI Client</param>
        /// <param name="sSYNFlag">IS Syn </param>
        /// <param name="sUserType">Type of user</param>
        /// <param name="sPOAFlag">Poa flag functionality unknown</param>
        public void AddSegment(MarketSegments enSegment, string sCommonClientCode, string sClientCode, string sIsActive, string sCanTrade,string sETFlag,string sBOIFlag,string sSYNFlag,string sUserType,string sPOAFlag)
        {
            SegmentDetails Segment = Segments.Find(segElement => segElement.Segment == enSegment);
            if (Segment == null)
                Segments.Add(new SegmentDetails()
                    {
                        Segment = enSegment,
                        ClientCode = sClientCode,
                        CommonClientCode = sCommonClientCode,
                        CanTrade = (sCanTrade == "Y"),
                        IsActive = (sIsActive == "Y"),
                        IsEt = (sETFlag == "Y"),
                        IsBOIClient = (sBOIFlag == "Y"),
                        IsPOA = (sPOAFlag == "Y"),
                        IsSyn = (sPOAFlag == "Y"),
                        UserType = sUserType
                    });
            else
            {
                Segment.Segment = enSegment;
                Segment.ClientCode = sClientCode;
                Segment.CommonClientCode = sCommonClientCode;
                Segment.CanTrade = (sCanTrade == "Y");
                Segment.IsActive = (sIsActive == "Y");
                Segment.IsEt = (sETFlag == "Y");
                Segment.IsBOIClient = (sBOIFlag == "Y");
                Segment.IsPOA = (sPOAFlag == "Y");
                Segment.IsSyn = (sPOAFlag == "Y");
                Segment.UserType = sUserType;
            }
        }

        public void AddEmpInfo(EmpCTCL empInfo)
        {
            MarketSegments enSegment = MarketSegments.NotRecognised;
            if (empInfo.Segment == AcmiilConstants.SEGMENT_FO || empInfo.Segment == AcmiilConstants.SEGMENT_FNO)
                enSegment = MarketSegments.FO;
            else if (empInfo.Segment == AcmiilConstants.SEGMENT_EQ)
                enSegment = MarketSegments.CM;
            else if (empInfo.Segment == AcmiilConstants.SEGMENT_CD)
                enSegment = MarketSegments.CD;

            EmpInfo foundEmp = Employees.Find(segElement => segElement.Segment == enSegment);
            if (foundEmp == null)
                Employees.Add(new EmpInfo(empInfo.EmpCode, empInfo.CTCLLoginID, empInfo.Exchange, enSegment, empInfo.NEATUserID, empInfo.CTCLID, empInfo.BACode));
        }

        public bool CanTradeInSegment(MarketSegments enSegment)
        {
            SegmentDetails seg = GetSegmentDetail(enSegment);
            if (seg == null)
                return false;
            else if (seg.IsActive && seg.CanTrade)
                return true;
            else
                return false;
        }

        /// <summary>
        /// Gets segment detail for a web user.
        /// </summary>
        /// <param name="enSegment">Segment you want to search for user.</param>
        /// <returns>Returns detail if exist else returns null.</returns>
        public SegmentDetails GetSegmentDetail(MarketSegments enSegment)
        {
            return Segments.Find(segElement => segElement.Segment == enSegment);
        }

        public EmpInfo GetEmployeeDetail(MarketSegments enSegment)
            {
            return Employees.Find(segElement => segElement.Segment == enSegment);
            }

        //Added by hvb on 13/11/2017 for ip tracking session    
        public string SegmentClientCode(MarketSegments enSegment)
        {
            SegmentDetails seg = GetSegmentDetail(enSegment);
            if (seg == null)
                return "";
            else
                return seg.ClientCode;
        }
    }
    /// <summary>
    /// Segment detail class for user.
    /// </summary>
    public class SegmentDetails
    {
        public MarketSegments Segment { get; set; }
        public string CommonClientCode { get; set; }
        public string ClientCode { get; set; }
        public bool CanTrade { get; set; }
        public bool IsActive { get; set; }

        //Added by hvb on 22/01/2018 for boi flag settings
        public bool IsEt { get; set; }
        public bool IsBOIClient { get; set; }
        public bool IsSyn { get; set; }
        public string UserType { get; set; }
        public bool IsPOA { get; set; }
    }

    /// <summary>
    /// Market segments that api server allows to work.<para></para>
    /// </summary>
    public enum MarketSegments
    {
        FO,
        CM,
        CD,
        NotRecognised
    }

  
   
}