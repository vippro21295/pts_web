using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace PTS_DAL.DapperContext
{
    public class DapperContext : IDapperContext
    {
        private string connection;
        private SqlConnection conn;

        public DapperContext(string connection)
        {
            this.connection = connection;
        }


        public List<T> GetStore<T>(string proc) where T : class
        {
            using (var transactionScope = new TransactionScope())
            {
                conn = new SqlConnection(connection);
                conn.Open();
                var result = conn.Query<T>(proc, commandType: System.Data.CommandType.StoredProcedure).ToList();
                conn.Close();
                conn.Dispose();
                transactionScope.Complete();
                return result;
            }

        }
        public List<T> GetStore<T>(string proc, object obj) where T : class
        {
            try
            {
                using (var transactionScope = new TransactionScope(TransactionScopeOption.Required, TimeSpan.FromSeconds(300)))
                {
                    using (var conn = new SqlConnection(connection))
                    {
                        conn.Open();
                        var result = conn.Query<T>(proc, obj, commandTimeout: 300, commandType: System.Data.CommandType.StoredProcedure).ToList();
                        conn.Close();
                        conn.Dispose();
                        transactionScope.Complete();
                        return result;
                    }

                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public List<T> GetSQL<T>(string sql) where T : class
        {
            using (var transactionScope = new TransactionScope())
            {
                using (var conn = new SqlConnection(connection))
                {
                    var result = conn.Query<T>(sql).ToList();
                    transactionScope.Complete();
                    return result;
                }
            }
        }

        public void CopyData(string tablename, DataTable data)
        {
            using (SqlBulkCopy bulkCopy = new SqlBulkCopy(connection))
            {
                bulkCopy.DestinationTableName = tablename;
                foreach (DataColumn col in data.Columns)
                {
                    bulkCopy.ColumnMappings.Add(col.ColumnName, col.ColumnName);
                    string a = bulkCopy.BulkCopyTimeout.ToString();
                }
                bulkCopy.WriteToServer(data);
            }
        }
        public void ExcuteSQL(string sql)
        {
            conn = new SqlConnection(connection);
            conn.Open();
            var result = conn.Execute(sql);
            conn.Close();
            conn.Dispose();
        }


        public DataTable ExcuteStoreToDataTable(string proc, object param)
        {
            using (var transactionScope = new TransactionScope())
            {
                conn = new SqlConnection(connection);
                conn.Open();

                var reader = conn.ExecuteReader(proc, param: param, commandType: System.Data.CommandType.StoredProcedure);
                DataTable tbl = new DataTable("Table");
                tbl.Load(reader);
                conn.Close();
                conn.Dispose();
                transactionScope.Complete();
                return tbl;
            }

        }

        public void ExcuteStore(string proc)
        {
            using (var transactionScope = new TransactionScope())
            {
                conn = new SqlConnection(connection);
                conn.Open();
                conn.Execute(proc, commandType: System.Data.CommandType.StoredProcedure);
                conn.Close();
                conn.Dispose();
                transactionScope.Complete();
            }
        }

        public void ExcuteStore(string proc, object obj = null)
        {
            using (var transactionScope = new TransactionScope())
            {
                conn = new SqlConnection(connection);
                conn.Open();
                var result = conn.Execute(proc, obj, commandType: System.Data.CommandType.StoredProcedure);
                conn.Close();
                conn.Dispose();
                transactionScope.Complete();
            }
        }
        public string GetStoreString<T>(string proc, object obj) where T : class
        {
            try
            {
                using (var transactionScope = new TransactionScope())
                {
                    conn = new SqlConnection(connection);
                    conn.Open();
                    var result = conn.Query<string>(proc, obj, commandType: System.Data.CommandType.StoredProcedure).ToString();
                    conn.Close();
                    conn.Dispose();
                    transactionScope.Complete();
                    return result;
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        public void ExcuteSqlString(string sqlStr, object obj = null)
        {
            try
            {
                using (var transactionScope = new TransactionScope())
                {
                    conn = new SqlConnection(connection);
                    conn.Open();
                    conn.Execute(sqlStr, obj, commandType: System.Data.CommandType.Text);
                    conn.Close();
                    conn.Dispose();
                    transactionScope.Complete();
                }
            }
            catch (Exception)
            {

            }
        }

        public void ExcuteStoreNotTransaction(string proc, object obj = null)
        {
            conn = new SqlConnection(connection);
            conn.Open();
            var result = conn.Execute(proc, obj, commandType: System.Data.CommandType.StoredProcedure);
            conn.Close();
            conn.Dispose();
        }
    }
}
