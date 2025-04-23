using PTS_DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PTS_Services.Services.Roles
{
    public interface IRoleService
    {
        List<Role> GetRoles();
        Role GetRoleById(int id);
    }
}
