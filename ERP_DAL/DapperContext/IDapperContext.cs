using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PTS_DAL.DapperContext
{
    public interface IDapperContext
    {
        List<T> GetStore<T>(string proc) where T : class;
        List<T> GetStore<T>(string proc, object obj = null) where T : class;
        List<T> GetSQL<T>(string sql) where T : class;
        void ExcuteSQL(string sql);
        void ExcuteStore(string proc);
        void ExcuteStoreNotTransaction(string proc, object obj = null);
        void ExcuteStore(string proc, object obj = null);
        void CopyData(string tablename, DataTable data);
        DataTable ExcuteStoreToDataTable(string proc, object param);
    }
}
