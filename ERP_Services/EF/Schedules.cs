namespace PTS_Services.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Schedules
    {
        [Key]
        [StringLength(150)]
        public string ScheduleName { get; set; }

        [StringLength(50)]
        public string ScheduleType { get; set; }

        [StringLength(1500)]
        public string Description { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? StartDate2nd { get; set; }

        [StringLength(100)]
        public string IntervalInDays { get; set; }

        public bool? Frequency { get; set; }

        public int? FrequencyCounter { get; set; }

        public bool? IsDeleted { get; set; }

        [MaxLength(50)]
        public byte[] CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        [MaxLength(50)]
        public byte[] UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
