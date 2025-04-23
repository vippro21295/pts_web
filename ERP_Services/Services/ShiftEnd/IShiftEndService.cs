using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SM_Services.Services.ShiftEnd
{
    public interface IShiftEndService
    {
        DateTime getCurrentDateTime();
        DataTable getShiftEndTime();
    }
}
