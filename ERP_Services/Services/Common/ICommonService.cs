using PTS_DAL.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PTS_Services.Services.Common
{
    public interface ICommonService
    {
        List<T> ConvertDataTableToList<T>(DataTable dt);
        DataTable GetDataFromSQL(string sql);
        DataTable GetDataFromStore(string store, params object[] parameters);
        DataTable GetDataFromStorePTCare2(string store, params object[] parameters);
        int ExcuteSQL(string sql);
        int ExcuteFromStore(string store, params object[] parameters);
        DataTable GetProvince();
        DataTable GetDistrict();
        DataTable GetHondaModel();
        DataTable GetHondaModelYear();
        DataTable GetListAccount();
        DataTable GetCategoryItem(int catID);
        DataTable GetServiceList(bool isEdit);
        DataTable SaleOfReason_SelectAll();
        DataTable GetReportHead(string UserId);
    }
}
