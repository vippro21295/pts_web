using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SM_Services.Models
{
    public class PT_ToolInBill
    {
        public double Amount { get; set; }
        public string BillNo { get; set; }
        public double Cost { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string DiscountReason { get; set; }
        public double DiscountVIP { get; set; }
        public long Id { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsOil { get; set; }
        public double OriginalPrice { get; set; }
        public string Part_Name { get; set; }
        public string Part_No { get; set; }
        public double Price_After_Discount { get; set; }
        public long QTY { get; set; }
        public string ServiceType { get; set; }
        public long ToolType { get; set; }
        public Guid? UniqId { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string VAT { get; set; }
    }
}
