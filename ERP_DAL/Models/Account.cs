namespace PTS_DAL
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Account
    {
        public int UserId { get; set; }  
        public string UserCode { get; set; }
        public string UserName { get; set; }    
        public string DisplayName {  get; set; }    
        public string Password {  get; set; }
        public string BranchId { get; set; }
        public string ConnectionString { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

    }
}
