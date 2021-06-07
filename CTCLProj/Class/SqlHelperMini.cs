using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace ASP_WEB_SOCK_TEST.Class
{
    public class SqlHelperMini
    {
        public static DataTable ReadTable(string Query,bool blnIsStoredProcedure)
        {
            //DataTable dtRead = new DataTable();
            DataSet ds = new DataSet();
          SqlCommand cmd = new SqlCommand(Query, new SqlConnection(String.Format("Server={0};Database={1};User Id={2};Password={3};", @"HP-PC\SQLEXPRESS", "Trading_Temp", "sa", "admin2017")));
//            SqlCommand cmd = new SqlCommand(Query, new SqlConnection(String.Format("Server={0};Database={1};User Id={2};Password={3};", @"VITCO32\SQLEXPRESS", "EasyTradez", "sa", "admin2017")));
            if (blnIsStoredProcedure)
                cmd.CommandType = CommandType.StoredProcedure;

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            if (cmd.Connection.State == ConnectionState.Closed)
                cmd.Connection.Open();
            da.Fill(ds);
            cmd.Connection.Close();
            return ds.Tables[0].Rows.Count > 0 ? ds.Tables[0] : null; 
        }
    }
}