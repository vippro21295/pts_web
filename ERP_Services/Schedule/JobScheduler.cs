using log4net;
using log4net.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Ninject;
using Quartz;
using Quartz.Impl;
using SimpleInjector;
using SimpleInjector.Lifestyles;
using PTS_DAL;
using PTS_DAL.DapperContext;
using PTS_DAL.Models;
using PTS_DAL.Repository;
using PTS_Services.Services.Common;
using PTS_Services.Services.Common.Constants;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using PTS_Services.Common;

namespace PTS_Services.Services.Schedule
{
    public class JobScheduler
    {
        static string connectionString = ConfigurationManager.ConnectionStrings["ASMEntity"].ConnectionString;
        public static async Task StartAsync()
        {
            try
            {
                var jobsDic = new Dictionary<string, string>();
                jobsDic.Add(Constants.Job.TMVGRADEJOB, "PTS_Services.Schedule.Jobs.TMV.TMVGradelJob");
                jobsDic.Add(Constants.Job.TMVAPPMODELJOB, "PTS_Services.Schedule.Jobs.TMV.TMVAppModelJob");
                jobsDic.Add(Constants.Job.CYBERBRANCHJOB, "PTS_Services.Schedule.Jobs.Cyber.CyberBranchJob");
                jobsDic.Add(Constants.Job.CYBERCOLORSJOB, "PTS_Services.Schedule.Jobs.Cyber.CyberColorJob");
                jobsDic.Add(Constants.Job.TMVVEHICLEPRICESLJOB, "PTS_Services.Schedule.Jobs.TMV.TMVVehicleJob");
                jobsDic.Add(Constants.Job.CYBERPRODUCTSJOB, "PTS_Services.Schedule.Jobs.Cyber.CyberProductsJob");
                jobsDic.Add(Constants.Job.CYBERBANKJOB, "PTS_Services.Schedule.Jobs.Cyber.CyberBankJob");
                jobsDic.Add(Constants.Job.CYBERINSURANCECOMPANYOB, "PTS_Services.Schedule.Jobs.Cyber.CyberInsuranceCompanyJob");
                jobsDic.Add(Constants.Job.CYBERACCESSORYBRANDJOB, "PTS_Services.Schedule.Jobs.Cyber.CyberAccessoryBrandJob");
                jobsDic.Add(Constants.Job.CYBERACCESSORYBRANCHJOB, "PTS_Services.Schedule.Jobs.Cyber.CyberAccessoryBranchJob");
                jobsDic.Add(Constants.Job.CYBER_MAINTENANCE_JOB, "PTS_Services.Schedule.Jobs.Cyber.CyberMaintenanceJob");
                jobsDic.Add(Constants.Job.CYBER_PROMOTONOTHER_JOB, "PTS_Services.Schedule.Jobs.Cyber.CyberPromotionOtherJob");
                jobsDic.Add(Constants.Job.CYBER_CRQLKHTN_JOB, "PTS_Services.Schedule.Jobs.Cyber.CyberCRQLKHTNJob");
                jobsDic.Add(Constants.Job.CYBER_CONTRACT_JOB, "PTS_Services.Schedule.Jobs.Cyber.CyberContractASMJob");
                jobsDic.Add(Constants.Job.CYBER_PRODUCT_PRICE_JOB, "PTS_Services.Schedule.Jobs.Cyber.CyberProductPricesJob");
                jobsDic.Add(Constants.Job.CYBER_INVENTORY_JOB, "PTS_Services.Schedule.Jobs.Cyber.CyberInventorysJob");
                jobsDic.Add(Constants.Job.SCA_MODEL_JOB, "PTS_Services.Schedule.Jobs.SCA.SCAModelJob");
                var jobs = new List<Tuple<JobKey, string>>();

                foreach (var ndjob in jobsDic)
                {
                    jobs.Add(Tuple.Create(new JobKey(ndjob.Key, "NonDependentJob"), ndjob.Value));
                }
               
                var container = Initialize();
     
                var factory = new StdSchedulerFactory();

                IScheduler scheduler = await factory.GetScheduler();

                scheduler.JobFactory = new SimpleInjectorJobFactory(
                    container,
                    Assembly.GetExecutingAssembly()); // assemblies that contain jobs

                var schedules = GetSchedules();
                foreach (var i in jobs)
                {
                    var jobInf = schedules.Where(s => s.ScheduleName == i.Item1.Name).FirstOrDefault();
                    if (jobInf != null)
                    {
                        IJobDetail job = JobBuilder.Create(Type.GetType(i.Item2))
                                    .WithIdentity(jobInf.ScheduleName)
                                    .Build();

                        ITrigger trigger = TriggerBuilder.Create()
                            .WithIdentity(string.Format("trigger_{0}", jobInf.ScheduleName), jobInf.ScheduleName)
                            .WithCronSchedule(jobInf.IntervalInDays)
                            .ForJob(jobInf.ScheduleName)
                            .Build();
                     await scheduler.ScheduleJob(job, trigger);
                    }
                }
                await scheduler.Start();
            }
            catch (System.Exception ex)
            {
                throw;
            }
        }


        public static List<Schedules> GetSchedules()
        {
            DataTable dt = new DataTable();
            var queryString = "SELECT * FROM Schedules WHERE IsDeleted=0";
            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand(queryString, connection);
                connection.Open();
                SqlDataAdapter da = new SqlDataAdapter(command);
                da.Fill(dt);
            }
            var result = ConvertTbl.DataTableToList<Schedules>(dt);
            return result.ToList();
        }
        static Container Initialize()
        {
            var container = new Container();
            container.Options.DefaultScopedLifestyle = new AsyncScopedLifestyle();
            container.Options.EnableAutoVerification = false;

            container.Register<ICommonService, CommonService>();
            container.Register<IDapperContext>(() => new DapperContext(connectionString));
            container.Register<IGenericRepository<Schedules>, GenericRepository<Schedules>>();
            container.Register<IGenericRepository<Model>, GenericRepository<Model>>();
            container.Register<IHttpContextAccessor, HttpContextAccessor>();
            //container.RegisterSingleton(typeof(IMemoryCache), typeof(MemoryCache));


            return container;
        }
    }

    public class MyMemoryCache
    {
        public MemoryCache Cache { get; private set; }
        public MyMemoryCache()
        {
            Cache = new MemoryCache(new MemoryCacheOptions
            {
                SizeLimit = 1024
            });
        }
    }

}
