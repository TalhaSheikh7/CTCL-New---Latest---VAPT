using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CTCLProj.Class
{
    public class EmpInfo
    {
        public EmpInfo(string Code,string LoginId,string Exchange,MarketSegments Seg,string NeatID,string CTCLId, string BACode)
        {
            this.EmpCode = Code;
            this.CTCLLoginID = LoginId;
            this.Exchange = Exchange;
            this.Segment = Seg;
            this.NEATUserID = NeatID;
            this.CTCLID = CTCLId;
            this.BACode = BACode;
            
        }

        public string EmpCode { get;private set; }
        public string CTCLLoginID { get; private set; }
        public string Exchange { get; private set; }
        public MarketSegments Segment { get; private set; }
        public string NEATUserID { get; private set; }
        public string CTCLID { get; private set; }
        public string BACode { get; private set; }
    }
}
