namespace PTS_DAL
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Branch
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id { get; set; }

        [StringLength(500)]
        public string code { get; set; }
        public string name { get; set; }

        [Column(TypeName = "text")]
        public string address { get; set; }

        public string state { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? createdAt { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? updatedAt { get; set; }
    }
}
