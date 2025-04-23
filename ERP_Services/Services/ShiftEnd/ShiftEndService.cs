using Microsoft.AspNetCore.Http;
using PTS_Services.Services.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SM_Services.Services.ShiftEnd
{
    public class ShiftEndService : IShiftEndService
    {
        private ICommonService _commonService;

        public ShiftEndService(ICommonService commonService)
        {
            this._commonService = commonService;
            //_httpContextAccessor = httpContextAccessor;
            //connectionString = _httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(c => c.Type == "connec")?.Value;
        }

        public DateTime getCurrentDateTime()
        {
            string sql = "SELECT GETDATE() AS CurrentDate";
            var dt = _commonService.GetDataFromSQL(sql);
            if (dt.Rows.Count > 0)
                return Convert.ToDateTime(dt.Rows[0][0]);
            else
                return DateTime.Now;
        }

        public DataTable getShiftEndTime()
        {
            return _commonService.GetDataFromStore("GetKetCaTime");
        }
    }
}
