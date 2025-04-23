using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PTS_Services.Models
{
    public class MenuModel
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public bool Title { get; set; }
        public string Url { get; set; }
        public string Icon { get; set; }
        public int Level { get; set; }
        public string SortOrder { get; set; }
        public int ParentID { get; set; }
        public List<Children> _Childrens = new List<Children>();
        public List<Children> Children
        {
            get { return _Childrens; }
            set { _Childrens = value; }
        }
    }
    public class Menu
    {

    }
    public class Children
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public string Icon { get; set; }
    }
}
