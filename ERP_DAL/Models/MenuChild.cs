using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PTS_DAL.Models
{
    public class MenuChild
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Icon { get; set; }

        public string Url { get; set; }

        public int? ParentId { get; set; }

        public int? ChildParent { get; set; }

        public int? Level { get; set; }

        public int? SortIDLocation { get; set; }

    }
}
