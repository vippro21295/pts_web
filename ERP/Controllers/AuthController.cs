using AutoMapper;
using ERP_MOTOBIKE.Providers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PTS_DAL;
using PTS_Services.Models;
using PTS_Services.Services.Roles;
using PTS_Services.Services.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;

namespace ERP_MOTOBIKE.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : BaseController
    {
        private IUsersService usersService;
        private readonly JWTAuthService _JwtAuthService;
        private readonly IMemoryCache _memoryCache;
        //private IRoleService roleService;
        public AuthController(IUsersService usersService, JWTAuthService _JwtAuthService, IMemoryCache _memoryCache)
        {
            this.usersService = usersService;
            this._JwtAuthService = _JwtAuthService;
            this._memoryCache = _memoryCache;

        }
        [AllowAnonymous]
        [HttpPost("[action]")]
        public ActionResult Login([FromBody] AccountModel account)
        {
            SignInResult result = new SignInResult();

            var user = CheckUserLogin(account.BranchId, account.Code, account.PasswordHash);
            if (user != null)
            {
                var claims = BuildClaims(user);
                result.Account = user;
                result.AccessToken = _JwtAuthService.BuildToken(claims);
                result.RefreshToken = _JwtAuthService.BuildRefreshToken();
                result.Success = true;
            }
            return Json(new { result });
        }
        private Claim[] BuildClaims(AccountModelLogged user)
        {
            //User is Valid
            var claims = new[]
            {
                new Claim("id",user.Id.ToString()),
                new Claim("code",user.Code),
                new Claim("branch",user.BranchId),
                new Claim("connec",user.ConnectionString.ToString()),
                new Claim(ClaimTypes.Email,user.Code)
            };

            return claims;
        }

        [HttpGet("[action]")]
        public ActionResult ByToken()
        {
            //List<MenuModel> menuModels = new List<MenuModel>();
            //var user = GetUser();
            //if (user.Id != 0)
            //{
            //    string keyCache = "roleID_" + user.RoleId;
            //    _memoryCache.Remove(keyCache);
            //    var checkCache = _memoryCache.Get(keyCache);
            //    if (checkCache == null)
            //    {
            //        menuModels = usersService.GetMenusByRole(user.RoleId, true);
            //        var menuModelsChild = usersService.GetMenusByRole(user.RoleId, false);
            //        var menuParent = menuModels.Where(s => s.Level > 0).ToList();
            //        foreach (var item in menuParent)
            //        {
            //            var childs = menuModelsChild.Where(s => s.ParentID == item.Id).ToList();
            //            if (childs.Count > 0)
            //            {
            //                string jsonChild = JsonConvert.SerializeObject(childs);
            //                item.Children = JsonConvert.DeserializeObject<List<Children>>(jsonChild.ToString());
            //            }
            //            else
            //                item.Children = null;
            //        }
            //        _memoryCache.Set(keyCache, JsonConvert.SerializeObject(menuModels), DateTimeOffset.UtcNow.AddHours(1));
            //    }
            //    else
            //    {
            //        menuModels = JsonConvert.DeserializeObject<List<MenuModel>>(checkCache.ToString());
            //    }
            //    return Json(new { data = menuModels });
            //}
            return Json(new { data = "" });
        }
        public AccountModelLogged CheckUserLogin(string brandid, string code, string pass)
        {
            try
            {

                Account user = usersService.GetUser(brandid, code, pass);
                if (user != null)
                {
                    AccountModelLogged account = new AccountModelLogged()
                    {
                        Id = user.UserId,
                        Code = user.UserCode,
                        Name = user.UserName,
                        BranchId = user.BranchId,
                        ConnectionString = user.ConnectionString,
                    };
                    return account;
                }
                else
                    return null;
            }
            catch (Exception)
            {
                return null;
                throw;
            }
        }
    }
}
public class SignInResult
{
    public bool Success { get; set; }
    public AccountModelLogged Account { get; set; }
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public SignInResult()
    {
        Success = false;
    }
}

public class AccountModelLogged
{
    public int Id { get; set; }
    public string BranchId { get; set; }
    public int? RoleId { get; set; }
    public string RoleName { get; set; }
    public int? ManagerId { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string ConnectionString { get; set; }
}