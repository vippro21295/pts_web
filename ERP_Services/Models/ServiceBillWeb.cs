using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SServices.Models;

namespace SM_Services.Models
{
    public class ServiceBillWeb
    {
        public PT_ServiceBill ServiceBill { get; set; }
        public List<PT_ServiceBillDetail> ServiceBillDetail { get; set; }
        public List<PT_SpecialTool> SpecialTool { get; set; }
        public List<PT_ToolInBill> ToolInBill { get; set; }
        public List<PT_ToolInBill> ToolInBillBuy { get; set; }
        public PT_CheckForServiceBill CheckForServiceBill { get; set; }
    }
}
