using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SM_Services.Models
{
    public class PT_PrintHistory
    {
        public string Bill_no { get; set; }
        public Guid Id { get; set; }
        public string PrintedBy { get; set; }   
        public DateTime PrintedDate { get; set; }   
        public string PrintContent { get; set;}
    }
}
