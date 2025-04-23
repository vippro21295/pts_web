using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PTS_DAL.Models
{
    public class Schedules
    {
        public string ScheduleName { get; set; }

        public string ScheduleType { get; set; }
        public string Description { get; set; }
        public DateTime? StartDate { get; set; }

        public DateTime? StartDate2nd { get; set; }

        public string IntervalInDays { get; set; }

        public bool? Frequency { get; set; }

        public int? FrequencyCounter { get; set; }

        public bool? IsDeleted { get; set; }

        public byte[] CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public byte[] UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

    }
}
