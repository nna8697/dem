using Api.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Business
{
    public class StudentBusiness
    {
        public static void InitialDatabase()
        {
            using (var db = new StudentDbContext())
            {
                db.InitialDatabase();
            }
        }
    }
}