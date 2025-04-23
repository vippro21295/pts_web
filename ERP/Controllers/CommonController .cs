using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;
using PTS_Services.Services.Common;
using SM_Services.Models;

namespace ERP_MOTOBIKE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonController : Controller
    {
        private ICommonService _common;

        public CommonController(ICommonService common)
        {
            _common = common;
        }

        [HttpGet("[action]")]
        public ActionResult GetReportHead(string UserId)
        {
            try
            {
                var dt = _common.GetReportHead(UserId);
                return Json(JsonConvert.SerializeObject(dt));
            }
            catch (Exception ex)
            {
                return null;
                throw ex;
            }
        }
    }
}
