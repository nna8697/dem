using Api.DB;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
    public class StudentController : ApiController
    {
        [HttpGet]
        [Route("api/student/list")]
        public IHttpActionResult getAllStudent()
        {
            using (StudentDbContext ctx = new StudentDbContext())
            {
                var studentinfos = from data in ctx.studentInfos.ToList() select data;
                return Ok(studentinfos);
            }
        }


        [HttpGet]
        [Route("api/student/listbyid/{Id}")]
        public IHttpActionResult getStudentById(int Id)
        {
            using (StudentDbContext entities = new StudentDbContext())
            {
                var studentinfos = entities.studentInfos.Where(i => i.ID == Id).FirstOrDefault();
                return Ok(studentinfos);
            }
        }

        [HttpPost]
        [Route("api/student/add")]
        public IHttpActionResult addNewStudent([FromBody]Models.StudentInfo data)
        {
            var now = DateTime.Now;
            var zeroDate = DateTime.MinValue.AddHours(now.Hour).AddMinutes(now.Minute).AddSeconds(now.Second).AddMilliseconds(now.Millisecond);
            int studentId = (int)(zeroDate.Ticks / 10000);


            
            using (StudentDbContext entities = new StudentDbContext())
            {
                Models.StudentInfo studentinfo = new Models.StudentInfo()
                {
                    ID = studentId,
                    Name = data.Name,
                    DateOfBirth = data.DateOfBirth,
                    Address = data.Address,
                    Class = data.Class,
                    ImagePath = data.ImagePath
                };
                entities.studentInfos.Add(studentinfo);
                entities.SaveChanges();
            };
            return Ok("Them thanh cong");
        }

        [HttpPost]
        [Route("api/student/update")]
        public IHttpActionResult updatestudent(Models.StudentInfo data)
        {
            using (StudentDbContext entities = new StudentDbContext())
            {
                Models.StudentInfo studentID = entities.studentInfos.Where(i => i.ID == data.ID).FirstOrDefault();
                if (studentID != null)
                {
                    studentID.Name = data.Name;
                    studentID.DateOfBirth = data.DateOfBirth;
                    studentID.Address = data.Address;
                    studentID.Class = data.Class;
                }
                entities.SaveChanges();
            }
            return Ok("Cap nhat thanh cong");
        }

        [HttpPost]
        [Route("api/student/delete")]
        public IHttpActionResult DeleteStudent(List<int> ids)
        {
            foreach (var id in ids)
            {
                using (StudentDbContext entities = new StudentDbContext())
                {
                    var studentId = entities.studentInfos.Where(i => i.ID == id).FirstOrDefault();
                    entities.studentInfos.Attach(studentId);
                    entities.studentInfos.Remove(studentId);
                    entities.SaveChanges();
                }
            }
            return Ok("Xoa thanh cong");
        }
        [HttpPost]
        [Route("api/upload")]
        public string UploadFile()
        {
            var file = HttpContext.Current.Request.Files.Count > 0 ? HttpContext.Current.Request.Files[0] : null;

            if (file != null && file.ContentLength > 0)
            {
                var fileName = Path.GetFileName(file.FileName);
                var rootPath = HttpContext.Current.Server.MapPath("~/Uploads");
                string fileNamesss = HttpContext.Current.Request.Headers.GetValues("filepathupload")[0];
                string path = Path.Combine(rootPath, fileNamesss);
                file.SaveAs(path);
            }

            return file != null ? "/Uploads/" + file.FileName : null;
        }

    }
}
