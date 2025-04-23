using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using PTS_DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace ERP_MOTOBIKE.Controllers
{
    [Route("api/[controller]")]
    public class BaseController : Controller
    {
        public Account GetUser()
        {
            try
            {
                Account account = new Account();
              
                account.UserCode = HttpContext.User.Claims.Where(s => s.Type == "code").Select(s => s.Value).FirstOrDefault();
                account.ConnectionString = HttpContext.User.Claims.Where(s => s.Type == "connec").Select(s => s.Value).FirstOrDefault();
                //if (userId != null)
                //{
                //    var roleID = HttpContext.User.Claims.Where(s => s.Type == "roleID").Select(s => s.Value).FirstOrDefault();                 
                //}
                return account;
            }
            catch (Exception)
            {
                return null;
                throw;
            }
        }
        public string GetUserName()
        {
            try
            {
                var userName = HttpContext.User.Identity.Name;
                return userName;
            }
            catch (Exception)
            {
                return string.Empty;
                throw;
            }
        }
    }
}
