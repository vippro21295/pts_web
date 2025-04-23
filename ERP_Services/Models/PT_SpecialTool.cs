using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SM_Services.Models
{
    public class PT_SpecialTool
    {
        public double Amount{get;set;}
        public string BillNo{get;set;}
        public string CreatedBy{get;set;}
        public DateTime CreatedDate{get;set;}
        public long Id{get;set;}
        public bool IsDeleted{get;set;}
        public string Part_Name{get;set;}
        public double Price_After_Discount{get;set;}
        public long QTY{get;set;}
        public string ServiceType{get;set;}
        public long ToolType{get;set;}
        public Guid? UniqId{get;set;}
        public string UpdatedBy{get;set;}
        public DateTime UpdatedDate{get;set;}
        public long SaleBy{get;set;}
        public int IntCode { get; set; }
    }
}
