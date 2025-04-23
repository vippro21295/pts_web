using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SServices.Models
{
    public class PT_ServiceBillDetail
    {
        public double AgentPrice{get;set;}
        public double Amount{get;set;}
        public string Bill_NO{get;set;}
        public string Comment{get;set;}
        public string CreatedBy{get;set;}
        public DateTime CreatedDate{get;set;}
        public Guid Id{get;set;}
        public long IntCode{get;set;}
        public bool IsDeleted{get;set;}
        public double OutPaid{get;set;}
        public double Price{get;set;}
        public double SaleOffMoney{get;set;}
        public string SaleOffReason{get;set;}
        public double SaleOffVIP{get;set;}
        public string ServiceCode{get;set;}
        public long ServiceId{get;set;}
        public Guid UniqId{get;set;}
        public string UpdatedBy{get;set;}
        public DateTime UpdatedDate{get;set;}
        public double DepreciationCost{get;set;}
        public long SaleBy{get;set;}

    }
}
