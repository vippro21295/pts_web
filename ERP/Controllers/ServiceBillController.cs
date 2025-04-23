using ERP_MOTOBIKE.Controllers;
using log4net.Util;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using Newtonsoft.Json;
using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;
using PTS_Services.Services.Common;
using SM_Services.Models;
using SM_Services.Services.ServiceBill;
using SM_Services.Services.ShiftEnd;
using SServices.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace PTS_WEB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceBillController : BaseController
    {
        private IServiceBillService _serviceBill;
        private IShiftEndService _shiftEnd;
        private ICommonService _common;
        private static readonly log4net.ILog _log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public ServiceBillController(IServiceBillService serviceBill, IShiftEndService shiftEnd, ICommonService common)
        {
            this._serviceBill = serviceBill;
            this._shiftEnd = shiftEnd;
            this._common = common;
        }


        [HttpGet("[action]")]
        public ActionResult Search(string search, string type, DateTime from, DateTime to, string tuPhieu, string denPhieu)
        {
            string tenKH = "";
            string bienSo = "";
            string dienThoai = "";
            string tenhangmuc = "";
            string mahangmuc = "";
            string maPhuTung = "";
            string tenPhuTung = "";

            search = search == null ? string.Empty : search.ToUpper();
            tuPhieu = tuPhieu == null ? string.Empty : tuPhieu.ToUpper();
            denPhieu = denPhieu == null ? string.Empty : denPhieu.ToUpper();

            switch (type)
            {
                case "TENKH":
                    tenKH = search;
                    break;
                case "BIENSO":
                    bienSo = search;
                    break;
                case "DIENTHOAI":
                    dienThoai = search;
                    break;
                case "TENHANGMUC":
                    tenhangmuc = search;
                    break;
                case "MAHANGMUC":
                    mahangmuc = search;
                    break;
                case "TENPHUTUNG":
                    tenhangmuc = search;
                    break;
                case "MAPHUTUNG":
                    maPhuTung = search;
                    break;
            }

            var data = _serviceBill.Search(-1, tenKH, bienSo, dienThoai, tuPhieu, denPhieu, from, to, -1, -1, -1, -1, "", "", "", false, "", "", -1, -1, -1, -1, tenhangmuc, mahangmuc, tenPhuTung, maPhuTung, GetUser().UserCode);
            return Json(new { isError = false, obj = JsonConvert.SerializeObject(data) });
        }

        [HttpGet("[action]")]
        public ActionResult LoadDefaultData()
        {
            try
            {
                // get Current date
                DateTime currentDate = _shiftEnd.getCurrentDateTime();
                _log.Info("SERVICE_BILL: GET_CURRENT_TIME: " + currentDate.ToString());
                // get kết ca
                DataTable dtKetca = _shiftEnd.getShiftEndTime();
                _log.Info("SERVICE_BILL: GET_SHIFTEND_TIME: " + dtKetca.Rows.ToString() + " ROWS");

                if (dtKetca.Rows.Count > 0)
                {
                    currentDate = currentDate.AddDays(1);
                    // bool isKetCa = true;
                }

                DateTime ngayKetCa = currentDate;

                // get Provice
                DataTable dtProvince = _common.GetProvince();
                // get District
                DataTable dtDistrict = _common.GetDistrict();
                // load Model_Honda
                DataTable dtModelHonda = _common.GetHondaModel();
                // load Model_Year
                DataTable dtModelYear = _common.GetHondaModelYear();
                // load Accout
                DataTable dtAccount = _common.GetListAccount();
                // load categoryItem (CatID = 6)(loại kiểm tra cuối)
                DataTable dtCatID6 = _common.GetCategoryItem(6);
                // load categoryItem (CatID = 1)(lý do không có số khung)
                DataTable dtCatID1 = _common.GetCategoryItem(1);
                // load ServiceList
                DataTable dtServiceList = _common.GetServiceList(false);
                // load saleoffReason 
                DataTable dtSaleoffreason = _common.SaleOfReason_SelectAll();
                // load toolnextTimelist
                DataTable dtCatID4 = _common.GetCategoryItem(4);


                return Json(new
                {
                    isError = false,
                    lstProvince = JsonConvert.SerializeObject(dtProvince),
                    lstDistrict = JsonConvert.SerializeObject(dtDistrict),
                    lstModelHonda = JsonConvert.SerializeObject(dtModelHonda),
                    lstModelYear = JsonConvert.SerializeObject(dtModelYear),
                    lstAccount = JsonConvert.SerializeObject(dtAccount),
                    lstLoaiKTC = JsonConvert.SerializeObject(dtCatID6),
                    lstLyDoKCSK = JsonConvert.SerializeObject(dtCatID1),
                    lstNextTool = JsonConvert.SerializeObject(dtCatID4),
                    lstServiceList = JsonConvert.SerializeObject(dtServiceList),
                    lstSaleOffRs = JsonConvert.SerializeObject(dtSaleoffreason)
                });
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [HttpGet("[action]")]
        public ActionResult LoadDataBillNo(string billNo)      
        {
            try
            {
                if (!string.IsNullOrEmpty(billNo))
                {
                    var dt = _serviceBill.GetDataBillNo(billNo);
                    if (dt != null || dt.Rows.Count > 0)
                    {
                        string json = JsonConvert.SerializeObject(dt);
                        List<PT_ServiceBill> lst = JsonConvert.DeserializeObject<List<PT_ServiceBill>>(json);

                        var objServiceBill = lst[0];

                        string action = "";
                        if (objServiceBill.IsFinished.Value) // phiếu hoàn thành
                            action = "V";
                        else
                            action = "L";

                        // hạng mục sửa chữa
                        var dtWage = _serviceBill.GetWage(billNo);

                        // phụ tùng thay thế
                        var dtPTTT = _serviceBill.GetToolListOfBillPTPS(billNo, 1);

                        // phụ tùng phát sinh
                        var dtPTPS = _serviceBill.GetToolListOfBillPTPS(billNo, 2);

                        // nhớt + phụ tùng trong + phụ tùng ngoài
                        var dtPTTPTN = _serviceBill.GetToolListOfBill(billNo, action);

                        // phụ tùng tự mua
                        var dtPTTM = _serviceBill.GetToolListOfBuy(billNo, 2);

                        // phụ tùng hao mòn
                        var dtPTHM = _serviceBill.GetToolHaoMon(billNo);


                        return Json(new
                        {
                            isError = false,
                            obj = objServiceBill,
                            dtWage = JsonConvert.SerializeObject(dtWage),
                            dtPTTT = JsonConvert.SerializeObject(dtPTTT),
                            dtPTPS = JsonConvert.SerializeObject(dtPTPS),
                            dtPTTool = JsonConvert.SerializeObject(dtPTTPTN),
                            dtPTTM = JsonConvert.SerializeObject(dtPTTM),
                            dtPTHM = JsonConvert.SerializeObject(dtPTHM)
                        });
                    }
                }
            }
            catch (Exception ex)
            {

            }
            return null;
        }
        [HttpGet("[action]")]
        public ActionResult GetServiceCode(string serviceCode)
        {
            try
            {
                var dt = _serviceBill.GetServiceCode(serviceCode);
                var lst = _common.ConvertDataTableToList<PT_ServiceList>(dt);

                return Json(new { isError = false, obj = lst[0] });
            }
            catch (Exception ex)
            {
                return Json(new { isError = true, msg = ex.ToString() });
            }
        }

        [HttpGet("[action]")]
        public ActionResult GetServiceCodeModel(string serviceCode, string modelCode)
        {
            try
            {
                var data = _serviceBill.GetServiceCodeModel(serviceCode, modelCode);
                if (data == null || data.Rows.Count == 0)
                    data = _serviceBill.GetServiceCodeModel(serviceCode, "ALL");

                return Json(new { isError = false, obj = JsonConvert.SerializeObject(data) });
            }
            catch (Exception ex)
            {
                return Json(new { isError = true, msg = ex.ToString() });
            }
        }

        [HttpGet("[action]")]
        public ActionResult GetToolListHMS(string billNo, string action)
        {
            try
            {
               var res = _serviceBill.GetToolListOfBill(billNo, action);
               return Json(new { isError = false, obj = JsonConvert.SerializeObject(res)});
            }
            catch(Exception ex)
            {
                return Json(new { isError = true, msg = ex.ToString() });
            }
        }

        [HttpPost("[action]")]
        public ActionResult SaveServiceBill(ServiceBillWeb obj)
        {
            try
            {
                var res = _serviceBill.SaveServiceBill(obj);
                return Json(new { isError = false, msg = "Lưu thông tin khách hàng thành công" });
            }
            catch (Exception ex)
            {
                return Json(new { isError = true, msg = ex.ToString() });
            }
        }

        [HttpPost("[action]")]
        public ActionResult SavePrintTool(PT_PrintHistory printHistory)
        {
            try
            {
                string printDate = "";
                var solanin = _serviceBill.SavePrintTool(printHistory, ref printDate);
                return Json(new { isError = false, solanin, printDate });
            }
            catch(Exception ex)
            {
                return Json(new { isError = true, msg = ex });
            }
        }

        [HttpGet("[action]")]
        public ActionResult GetCustomerHistoryByNumberPlate(string numberPlateOrPhone, string phone)
        {
            try
            {
                var data = _serviceBill.GetCustomerHistoryByNumberPlate(numberPlateOrPhone, phone);
                if (data != null && data.Rows.Count > 0)
                    return Json(new { isError = false, lstobj = JsonConvert.SerializeObject(data)});
                else
                    return Json(new { isError = true, msg = "Không tìm thấy thông tin lịch sử sửa chữa của khách hàng" });
            }
            catch(Exception ex)
            {
                return Json(new { isError = true, msg = ex.ToString() });
            }
        }

        [HttpGet("[action]")]
        public ActionResult GetLastCustomerInfoFromAllStore(string numberPlate)
        {
            try
            {
                // lấy thông tin từ tất cả head
                var data = _serviceBill.GetLastCustomerInfoFromAllStore(numberPlate);
                if (data != null && data.Rows.Count > 0)
                    return Json(new { isError = false, obj = JsonConvert.SerializeObject(data) });
                else // nếu không lấy đc thông tin biển số từ tất cả thì lấy trong head đang sửa chữa
                {
                    var dataC = _serviceBill.SelectByNumberPlateFromCustomer(numberPlate);
                    if(dataC != null && dataC.Rows.Count > 0)
                        return Json(new { isError = false, obj = JsonConvert.SerializeObject(dataC) });
                    else // nếu dữ liệu vẫn trống thì kiểm tra trong PT_ServiceBill phòng trường hợp lưu vào PT_Customer bị lỗi
                    {
                        var dataPT = _serviceBill.SelectByNumberPlateFromServiceBill(numberPlate);
                        if (dataPT != null && dataPT.Rows.Count > 0)
                            return Json(new { isError = false, obj = JsonConvert.SerializeObject(dataPT) });
                        else
                            return Json(new { isError = true, msg = "Không tìm thấy thông tin khách hàng sữa chữa gần nhất" });
                    }    
                }                    
            }
            catch(Exception ex)
            {
                return Json(new { isError = true, msg = ex.ToString() });
            }
        }
    }


}
