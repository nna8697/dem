using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Api.DB
{
    public class StudentDbContext : DbContext
    {
        public DbSet<Models.StudentInfo> studentInfos { get; set; }
        public StudentDbContext() : base("StudentDbConnectionString")
        {

        }

        public void InitialDatabase()
        {
            this.Database.CreateIfNotExists();
        }
    }
}