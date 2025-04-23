using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PTS_DAL.Models
{
    public class Inventory
    {
        public int Id { get; set; }
        public string BranchId { get; set; }
        //public int BranchId { get; set; }

        public string ProductCode { get; set; }
        public string ChassisNumber { get; set; }

        public string EngineNumber { get; set; }

        public string eColorCode { get; set; }

        public string iColorCode { get; set; }

        public string TMSS { get; set; }

        public string Status { get; set; }

        public DateTime? ExpectedDate { get; set; }

        public DateTime? ArrivedDate { get; set; }
        public int ContractId { get; set; }
    }
}
