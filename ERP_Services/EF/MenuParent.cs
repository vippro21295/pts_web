namespace PTS_Services.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("MenuParent")]
    public partial class MenuParent
    {
        public int Id { get; set; }

        public bool? Title { get; set; }

        [StringLength(10)]
        public string Name { get; set; }

        public int? SortOrder { get; set; }
    }
}
