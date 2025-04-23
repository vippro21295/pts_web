namespace PTS_Services.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Files
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id { get; set; }

        public int? branchId { get; set; }

        [StringLength(500)]
        public string name { get; set; }

        [StringLength(500)]
        public string path { get; set; }

        [StringLength(200)]
        public string scope { get; set; }

        [StringLength(200)]
        public string mimetype { get; set; }

        public int? size { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? createdAt { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? updatedAt { get; set; }
    }
}
