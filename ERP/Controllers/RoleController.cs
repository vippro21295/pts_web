using Microsoft.AspNetCore.Mvc;
using PTS_Services.Services.Roles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP_MOTOBIKE.Controllers
{
    [Route("api/[controller]")]
    public class RoleController : Controller
    {
        private IRoleService roleService;
        public RoleController(IRoleService roleService)
        {
            this.roleService = roleService;
        }
        [HttpGet("[action]")]
        public ActionResult GetRoles()
        {
            var results = roleService.GetRoles();
            return Json(new { data = results });
        }
    }
}
