using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using PTS_DAL.DapperContext;
using PTS_DAL.Models;
using PTS_DAL.Repository;
using SM_Services.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace PTS_Services.Services.Common
{
    public class CommonService : ICommonService
    {    
        private readonly IHttpContextAccessor _httpContextAccessor;
        public CommonService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;      
        }

        private string getConnectionString()
        {
           
          return _httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(c => c.Type == "connec")?.Value;
           
        }

        public List<T> ConvertDataTableToList<T>(DataTable dt)
        {
            string json = JsonConvert.SerializeObject(dt);
            return JsonConvert.DeserializeObject<List<T>>(json);
        }

        public DataTable GetDataFromSQL(string sql)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(getConnectionString()))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(sql, conn))
                    {
                        using (SqlDataAdapter dp = new SqlDataAdapter(cmd))
                        {
                            dp.Fill(dt);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                dt = null;
                throw ex;
            }
            return dt;
        }

        public DataTable GetDataFromStore(string store, params object[] parameters)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(getConnectionString()))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(store, conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        if (parameters != null && parameters.Length > 0)
                        {
                            for (int i = 0; i <= parameters.Length - 1; i++)
                            {
                                var p = parameters[i] as SqlParameter;
                                cmd.Parameters.Add(p);
                            }
                        }
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                dt = null;
                throw ex;
            }
            return dt;
        }

        public DataTable GetDataFromStorePTCare2(string store, params object[] parameters)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["PT_Care2"].ToString()))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(store, conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        if (parameters != null && parameters.Length > 0)
                        {
                            for (int i = 0; i <= parameters.Length - 1; i++)
                            {
                                var p = parameters[i] as SqlParameter;
                                cmd.Parameters.Add(p);
                            }
                        }
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                dt = null;
                throw ex;
            }
            return dt;
        }

        public int ExcuteSQL(string sql)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(getConnectionString()))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(sql, conn))
                    {
                        return cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        public int ExcuteFromStore(string store, params object[] parameters)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(getConnectionString()))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(store, conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        if (parameters != null && parameters.Length > 0)
                        {
                            for (int i = 0; i <= parameters.Length - 1; i++)
                            {
                                var p = parameters[i] as SqlParameter;
                                cmd.Parameters.Add(p);
                            }
                        }
                        return cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                dt = null;
                throw ex;
            }

        }

        public DataTable GetProvince()
        {
            try
            {
                string sql = "SELECT * FROM dbo.DMS064";
                return GetDataFromSQL(sql);
            }
            catch (Exception ex)
            {
                return null;
                throw ex;
            }
        }

        public DataTable GetDistrict()
        {
            string sql = "SELECT * FROM dbo.DMS063";
            return GetDataFromSQL(sql);
        }

        public DataTable GetHondaModel()
        {
            string sql = "SELECT * FROM dbo.PT_HondaModel WHERE IsActive = 1 AND IsDeleted = 0";
            return GetDataFromSQL(sql);
        }

        public DataTable GetHondaModelYear()
        {
            string sql = "SELECT VinCode,Year  AS Year FROM dbo.PT_HondaModel_Year WHERE IsDeleted = 0 ORDER BY Year";
            return GetDataFromSQL(sql);
        }

        public DataTable GetListAccount()
        {
            string sql = "SELECT * FROM dbo.PT_Account WHERE IsDeleted = 0 AND IsActive = 1 AND IsSystem = 0";
            return GetDataFromSQL(sql);
        }

        public DataTable GetCategoryItem(int catid)
        {
            string sql = $"SELECT * FROM dbo.PT_CategoryItem WHERE CatID = {catid} AND IsActive = 1 ORDER BY DispOrder";
            return GetDataFromSQL(sql);
        }

        public DataTable GetServiceList(bool isEdit = false)
        {
            string store = "sp_PT_GetServiceList";
            return GetDataFromStore(store, new SqlParameter("@isForEdit", isEdit));
        }

        public DataTable SaleOfReason_SelectAll()
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("value");
            dt.Columns.Add("text");
            DataRow dr = dt.NewRow();
            dr["value"] = "TT";
            dr["text"] = "----";
            dt.Rows.Add(dr);
            dr = dt.NewRow();
            dr["value"] = "TC";
            dr["text"] = "THIỆN CHÍ";
            dt.Rows.Add(dr);

            dr = dt.NewRow();
            dr["value"] = "BH";
            dr["text"] = "BẢO HÀNH";
            dt.Rows.Add(dr);

            dr = dt.NewRow();
            dr["value"] = "KM";
            dr["text"] = "KHUYẾN MÃI";
            dt.Rows.Add(dr);

            dr = dt.NewRow();
            dr["value"] = "GG";
            dr["text"] = "GIẢM GIÁ";
            dt.Rows.Add(dr);
            return dt;
        }

        public DataTable GetReportHead(string UserId)
        {
            try
            {
                return GetDataFromStore("GetReportHead", new SqlParameter("UserId", UserId));
            }
            catch (Exception ex)
            {
                return null;
                throw ex;
            }
        }
    }
}
