using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ERP_MOTOBIKE.Providers;
using PTS_DAL;
using PTS_Services.Models;
using PTS_Services.Services.Roles;
using PTS_Services.Services.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP_MOTOBIKE.Controllers
{
    [Route("api/[controller]")]
    public class UserController : BaseController
    {
        private IUsersService usersService;
        public UserController(IUsersService usersService)
        {
            this.usersService = usersService;
        }
        //[HttpGet("[action]")]
        //public ActionResult GetUsers()
        //{
        //    var results = usersService.GetUsers();
        //    return Json(new { data = results });
        //}
        //[HttpPost("[action]")]
        //public ActionResult CreateUser([FromBody] AccountModel account)
        //{
        //    string saltKey = Encryption.CreateSaltKey(5);
        //    account.PasswordSalt = saltKey;
        //    account.PasswordHash = Encryption.CreatePasswordHash(account.PasswordHash, saltKey, "SHA1");
        //    var config = new MapperConfiguration(cfg =>
        //    {
        //        cfg.CreateMap<AccountModel, Account>();
        //    });
        //    var mapper = config.CreateMapper();
        //    var acc = mapper.Map<AccountModel, Account>(account);
        //    var result = usersService.CreateUser(acc);
        //    return Json(new { data = "" });
        //}
        
    }
}
