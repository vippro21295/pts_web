using PTS_DAL.Models;
using PTS_DAL;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;

namespace PTS_DAL
{
    public partial class ERP : DbContext
    {
        public ERP()
            : base("name=ERP")
        {
        }

        public virtual DbSet<Account> Accounts { get; set; }
        public virtual DbSet<Branch> Branches { get; set; }
        public virtual DbSet<File> Files { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>()
                .Property(e => e.Email)
                .IsUnicode(false);

            modelBuilder.Entity<Account>()
                .Property(e => e.Password)
                .IsUnicode(false);

            modelBuilder.Entity<Account>()
                .Property(e => e.Phone)
                .IsUnicode(false);

            modelBuilder.Entity<Branch>()
                .Property(e => e.address)
                .IsUnicode(false);

            modelBuilder.Entity<File>()
                .Property(e => e.path)
                .IsUnicode(false);

            modelBuilder.Entity<File>()
                .Property(e => e.scope)
                .IsUnicode(false);

            modelBuilder.Entity<File>()
                .Property(e => e.mimetype)
                .IsUnicode(false);

            modelBuilder.Entity<Role>()
                .Property(e => e.Name)
                .IsUnicode(false);
        }
    }
}
