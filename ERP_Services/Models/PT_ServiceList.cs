using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SServices.Models
{
    public class PT_ServiceList
    {
        public bool CanEdit{get;set;}
        public bool CanEditGCN{get;set;}
        public bool CanEditGiaBan{get;set;}
        public bool CanEditGiamGia{get;set;}
        public bool CanEditNoiDung{get;set;}
        public string CreatedBy{get;set;}
        public DateTime? CreatedDate{get;set;}
        public long Id{get;set;}
        public bool IsDeleted{get;set;}
        public string ServiceCode{get;set;}
        public string ServiceName{get;set;}
        public string ServiceType{get;set;}
        public Guid UniqId{get;set;}
        public string UpdatedBy{get;set;}
        public DateTime? UpdatedDate{get;set;}
    }
}
