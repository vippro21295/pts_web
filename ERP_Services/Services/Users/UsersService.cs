using PTS_DAL;
using PTS_DAL.DapperContext;
using PTS_DAL.Repository;
using PTS_Services.Common;
using PTS_Services.Models;
using PTS_Services.Services.Common;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace PTS_Services.Services.Users
{
    public class UsersService : IUsersService
    {
        private ICommonService _commonService;
        public UsersService(ICommonService commonService)
        {
            this._commonService = commonService;
        }
        public Account GetUser(string branchid, string user, string pass)
        {
            string connectionString = "";
            switch (branchid)
            {
                case "PT1":
                    connectionString = ConfigurationManager.ConnectionStrings["PTS_PT1"].ToString();
                    break;
                case "PT3":
                    connectionString = ConfigurationManager.ConnectionStrings["PTS_PT3"].ToString();
                    break;

                case "PT6":
                    connectionString = ConfigurationManager.ConnectionStrings["PTS_PT6"].ToString();
                    break;

                case "Wing1":
                    connectionString = ConfigurationManager.ConnectionStrings["PTS_Wing1"].ToString();
                    break;

                default:
                    connectionString = ConfigurationManager.ConnectionStrings["PTS_Test"].ToString();
                    break;
            }

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                DataTable dt = new DataTable();
                string sql = "SELECT * FROM dbo.PT_Account WHERE UserCode = @user AND Password = @pass AND IsActive = 1 AND IsDeleted = 0";
                using (SqlCommand cm = new SqlCommand(sql, connection))
                {
                    cm.Parameters.AddWithValue("@user", user);
                    cm.Parameters.AddWithValue("@pass", pass);
                    using (SqlDataAdapter da = new SqlDataAdapter(cm))
                    {
                        da.Fill(dt);
                    }
                }

                if (dt.Rows.Count > 0)
                {
                    var account_temp = _commonService.ConvertDataTableToList<Account>(dt)[0];
                    account_temp.ConnectionString = connectionString;
                    account_temp.BranchId = branchid;
                    return account_temp;
                }                  
                else
                    return null;
            }
        }
    }
}
