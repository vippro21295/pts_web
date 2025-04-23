using PTS_DAL;
using PTS_DAL.DapperContext;
using PTS_DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PTS_Services.Services.Roles
{
    public class RoleService : IRoleService
    {
        IGenericRepository<Role> repositoryRole;
       
        public RoleService( IGenericRepository<Role> repositoryRole)
        {
            this.repositoryRole = repositoryRole;
        }

        public Role GetRoleById(int id)
        {
            return repositoryRole.GetAll().Where(s => s.Id == id).FirstOrDefault();
        }

        public List<Role> GetRoles()
        {
            return repositoryRole.GetAll().ToList();
        }
    }
}
