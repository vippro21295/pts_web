namespace PTS_Services.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("MenuChild")]
    public partial class MenuChild
    {
        public int Id { get; set; }

        [StringLength(500)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Icon { get; set; }

        [StringLength(500)]
        public string Url { get; set; }

        public int? ParentId { get; set; }

        public int? ChildParent { get; set; }

        public int? Level { get; set; }

        public int? SortIDLocation { get; set; }

        public bool? IsDeleted { get; set; }
    }
}
