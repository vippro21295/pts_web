using PTS_DAL;
using PTS_Services.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PTS_Services.Services.Users
{
    public interface IUsersService
    {
        Account GetUser(string branchid, string user, string pass);
    }
}
