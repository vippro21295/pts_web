using Castle.Core.Logging;
using Microsoft.AspNetCore.Http;
using PTS_Services.Services.Common;
using SM_Services.Models;
using SServices.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Common.Logging.Configuration.ArgUtils;


namespace SM_Services.Services.ServiceBill
{
    public class ServiceBillService : IServiceBillService
    {

        private ICommonService _commonService;
        private static readonly log4net.ILog _log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        public ServiceBillService(ICommonService commonService)
        {
            this._commonService = commonService;
        }
        public DataTable Search(int isFinished, string tenKH, string bienSo, string dienThoai, string tuPhieu,
            string denPhieu, DateTime tuNgay, DateTime denNgay, int nvSuaChua, int nvTiepNhan, int nvKiemTra,
            int nvThuNgan, string lstDichVu, string lstGiamGiaDichVu, string lstPhuTung, bool isOil,
            string lstGiamGiaPhuTung, string lstPhanLoaiXe, decimal tongTienTu, decimal tongTienDen, int phutThucHienTu,
            int phutThucHienDen, string tenhangmuc, string mahangmuc, string tenPhuTung, string maPhuTung, string userCode)
        {

            try
            {
                string store = "sp_PT_SearchBill";
                return _commonService.GetDataFromStore(store,
                                                         new SqlParameter("@isFinished", isFinished),
                                                         new SqlParameter("@custName", tenKH),
                                                         new SqlParameter("@bienSo", bienSo),
                                                         new SqlParameter("@dienThoai", dienThoai),
                                                         new SqlParameter("@tuPhieu", tuPhieu),
                                                         new SqlParameter("@denPhieu", denPhieu),
                                                         new SqlParameter("@fromdate", tuNgay),
                                                         new SqlParameter("@todate", denNgay),
                                                         new SqlParameter("@suachua", nvSuaChua),
                                                         new SqlParameter("@tiepnhan", nvTiepNhan),
                                                         new SqlParameter("@kiemtra", nvKiemTra),
                                                         new SqlParameter("@thungan", nvThuNgan),
                                                         new SqlParameter("@lstDichVu", lstDichVu),
                                                         new SqlParameter("@lstGiamGiaDichVu", lstGiamGiaDichVu),
                                                         new SqlParameter("@lstPhuTung", lstPhuTung),
                                                         new SqlParameter("@isShowOil", isOil),
                                                         new SqlParameter("@lstGiamGiaPhuTung", lstGiamGiaPhuTung),
                                                         new SqlParameter("@lstPhanLoaiXe", lstPhanLoaiXe),
                                                         new SqlParameter("@tongTienTu", tongTienTu),
                                                         new SqlParameter("@tongTienDen", tongTienDen),
                                                         new SqlParameter("@soPhutThucHienTu", phutThucHienTu),
                                                         new SqlParameter("@soPhutThucHienDen", phutThucHienDen),
                                                         new SqlParameter("@tenhangmuc", tenhangmuc),
                                                         new SqlParameter("@mahangmuc", mahangmuc),
                                                         new SqlParameter("@maphutung", maPhuTung),
                                                         new SqlParameter("@tenphutung", tenPhuTung),
                                                         new SqlParameter("@userCode", userCode));
            }
            catch (Exception ex)
            {
                return null;
                throw ex;
            }
        }


        public DataTable GetDataBillNo(string billNo)
        {
            try
            {
                string sql = $"SELECT * FROM dbo.PT_ServiceBill WHERE IsDeleted = 0 AND Bill_NO = '{billNo}'";
                return _commonService.GetDataFromSQL(sql);
            }
            catch (Exception ex)
            {
                return null;
                throw ex;

            }
        }

        public DataTable GetToolList(string billNo, string isForNew)
        {
            try
            {
                string store = "sp_PT_GetToolInBill";
                return _commonService.GetDataFromStore(store,
                new SqlParameter("@BillNo", billNo),
                new SqlParameter("@forInsert", isForNew == "L" ? true : false));
            }
            catch (Exception ex)
            {
                return null;
                throw ex;
            }

        }

        public DataTable GetWage(string billNo)
        {
            try
            {
                string sql = $@"select D.ID,D.Bill_No 
                                ,S.ServiceCode
                                ,S.ServiceName
                                ,CASE WHEN D.Comment IS NOT NULL THEN D.Comment ELSE S.ServiceName END as Comment
                                ,D.Price AS Price
                                ,D.AgentPrice 
                                ,D.SaleOffMoney AS SaleOff
                                ,D.SaleOffReason AS SaleOffReason              
                                ,D.Amount
                                ,D.OutPaid
                                ,D.IsDeleted
                                ,S.ServiceType
                                ,D.CreatedBy
                                ,D.UpdatedBy
                                , D.DepreciationCost           
                                , isnull(SaleBy,0) SaleBy
                                , isnull(DisplayName,'') SaleByName
                            from PT_ServiceBillDetail  D INNER JOIN PT_ServiceList S ON D.ServiceCode = S.ServiceCode
                                left join PT_Account ACC on D.SaleBy = ACC.UserId
                            where Bill_NO = '{billNo}' and D.IsDeleted = 0
                            order by D.IntCode, D.CreatedDate";

                return _commonService.GetDataFromSQL(sql);
            }
            catch (Exception ex)
            {
                return null;
                throw ex;
            }
        }

        public DataTable GetToolListOfBillPTPS(string billNo, int toolType)
        {
            try
            {
                string sql = $@"SELECT T.*
                                ,ACC.DisplayName as SaleByName
                           FROM PT_SpecialTool T LEFT JOIN PT_Account ACC on T.SaleBy = ACC.UserId
                           WHERE BillNo = '{billNo}' AND ToolType = {toolType} and T.IsDeleted = 0
                            order by T.Id";

                return _commonService.GetDataFromSQL(sql);

            }
            catch (Exception ex)
            {
                return null;
                throw ex;
            }
        }

        public DataTable GetToolListOfBill(string billNo, string action)
        {
            try
            {
                string store = "sp_PT_GetToolInBill";
                return _commonService.GetDataFromStore(store, new SqlParameter("@BillNo", billNo),
                    new SqlParameter("@forInsert", action == "L" ? true : false));
            }
            catch (Exception ex)
            {
                return null;
                throw ex;
            }
        }

        public DataTable GetToolListOfBuy(string billNo, int toolType)
        {
            try
            {
                string sql = $@"SELECT *
                           FROM PT_ToolInBill
                           WHERE BillNo = '{billNo}' AND ToolType = {toolType} AND IsDeleted = 0";

                return _commonService.GetDataFromSQL(sql);

            }
            catch (Exception ex)
            {
                return null;
                throw ex;
            }
        }

        public DataTable GetToolHaoMon(string billNo)
        {
            try
            {
                string sql = $@"SELECT *
                           FROM PT_CheckForServiceBill
                           WHERE Bill_No = '{billNo}'";
                return _commonService.GetDataFromSQL(sql);
            }
            catch (Exception ex)
            {
                return null;
                throw ex;
            }
        }

        public DataTable GetServiceCode(string serviceCode)
        {
            try
            {
                string sql = $"SELECT * FROM PT_ServiceList WHERE ServiceCode = '{serviceCode}'";
                return _commonService.GetDataFromSQL(sql);
            }
            catch (Exception ex)
            {
                return null;
                throw ex;
            }
        }

        public DataTable GetServiceCodeModel(string serviceCode, string modelCode)
        {
            try
            {
                string sql = $@"SELECT s.*,sm.ModelCode, sm.AgentPrice,sm.Price,sm.DepreciationCost
                           FROM PT_ServiceList s INNER JOIN PT_Service_Model sm ON s.ServiceCode= sm.ServiceCode AND s.IsDeleted=0 
                           WHERE sm.ServiceCode='{serviceCode}' AND sm.ModelCode='{modelCode}'
                                and sm.IsDeleted = 0
                                and s.IsDeleted = 0
                           ORDER BY s.ServiceCode";
                return _commonService.GetDataFromSQL(sql);
            }
            catch (Exception ex)
            {
                return null;
                throw ex;
            }
        }

        public bool GetByCodeLST(string code)
        {
            try
            {
                string sql = "SELECT * FROM PT_OIL WHERE Code = '{code}' AND IsActive = 1 AND IsDeleted = 0";
                var dt = _commonService.GetDataFromSQL(sql);
                if (dt.Rows.Count > 0)
                    return true;
                else
                    return false;
            }
            catch (Exception ex)
            {
                return false;
                throw ex;
            }
        }

        public string SaveServiceBill(ServiceBillWeb obj)
        {
            try
            {
                // lưu thông tin khách hàng
                SaveCustomer(obj.ServiceBill);
                // lưu hạng mục sửa chữa
                SaveServiceBillDetail(obj.ServiceBillDetail, obj.ServiceBill);
                // lưu phụ tùng thay thế phụ tùng phát sinh
                SaveSpecialTool(obj.SpecialTool, obj.ServiceBill);
                // lưu nhớt + phụ tùng trong + phụ tùng ngoài
                SaveToolInBill(obj.ToolInBill, obj.ServiceBill, false);
                // lưu phụ tùng tự mua
                SaveToolInBill(obj.ToolInBillBuy, obj.ServiceBill, true);
                // lưu phụ tùng hao mòn
                SaveCheckForServiceBill(obj.CheckForServiceBill, obj.ServiceBill);
            }
            catch (Exception ex)
            {

            }
            return "";
        }

        public bool SaveCustomer(PT_ServiceBill obj)
        {
            try
            {
                string store = "sp_SaveServiceBill";
                // xử lý BillNo
                if (obj.Bill_NO == null || obj.Bill_NO == "")
                {
                    string billNo = GetUniqueID();
                    obj.Bill_NO = billNo;
                    obj.QOT_NO = billNo;
                }

                _commonService.ExcuteFromStore(store,
                    new SqlParameter("Bill_NO", obj.Bill_NO),
                    new SqlParameter("QOT_NO", obj.QOT_NO ?? (object)DBNull.Value),
                    new SqlParameter("ServiceType", obj.ServiceType ?? (object)DBNull.Value),
                    new SqlParameter("InputDate", obj.InputDate ?? (object)DBNull.Value),
                    new SqlParameter("OutputDate", obj.OutputDate ?? (object)DBNull.Value),
                    new SqlParameter("RepairDate", obj.RepairDate ?? (object)DBNull.Value),
                    new SqlParameter("FinishDate", obj.FinishDate ?? (object)DBNull.Value),
                    new SqlParameter("RepairedBy", obj.RepairedBy ?? (object)DBNull.Value),
                    new SqlParameter("RepairedBy2", obj.RepairedBy2 ?? (object)DBNull.Value),
                    new SqlParameter("ReceivedBy", obj.ReceivedBy ?? (object)DBNull.Value),
                    new SqlParameter("Cashier", obj.Cashier ?? (object)DBNull.Value),
                    new SqlParameter("CheckBy", obj.CheckBy ?? (object)DBNull.Value),
                    new SqlParameter("CustName", obj.CustName ?? (object)DBNull.Value),
                    new SqlParameter("CustName_noUnicode", obj.CustName_noUnicode ?? (object)DBNull.Value),
                    new SqlParameter("CellPhone", obj.CellPhone ?? (object)DBNull.Value),
                    new SqlParameter("Phone", obj.Phone ?? (object)DBNull.Value),
                    new SqlParameter("AddressNumber", obj.AddressNumber ?? (object)DBNull.Value),
                    new SqlParameter("Address", obj.Address ?? (object)DBNull.Value),
                    new SqlParameter("ProvinceCode", obj.ProvinceCode ?? (object)DBNull.Value),
                    new SqlParameter("DistCode", obj.DistCode ?? (object)DBNull.Value),
                    new SqlParameter("Ward", obj.Ward ?? (object)DBNull.Value),
                    new SqlParameter("Model", obj.Model ?? (object)DBNull.Value),
                    new SqlParameter("TotalKms", obj.TotalKms ?? (object)DBNull.Value),
                    new SqlParameter("NumberPlate", obj.NumberPlate ?? (object)DBNull.Value),
                    new SqlParameter("MachineCode", obj.MachineCode ?? (object)DBNull.Value),
                    new SqlParameter("Comment", obj.Comment ?? (object)DBNull.Value),
                    new SqlParameter("ServicePaid", obj.ServicePaid ?? (object)DBNull.Value),
                    new SqlParameter("RepairPaid", obj.RepairPaid ?? (object)DBNull.Value),
                    new SqlParameter("ToolPaid", obj.ToolPaid ?? (object)DBNull.Value),
                    new SqlParameter("OutPaid", obj.OutPaid ?? (object)DBNull.Value),
                    new SqlParameter("OilPaid", obj.OilPaid ?? (object)DBNull.Value),
                    new SqlParameter("TotalMoney", obj.TotalMoney ?? (object)DBNull.Value),
                    new SqlParameter("TotalLaiGCN", obj.TotalLaiGCN ?? (object)DBNull.Value),
                    new SqlParameter("TotalLaiPTTM", obj.TotalLaiPTTM ?? (object)DBNull.Value),
                    new SqlParameter("ReportDate", obj.ReportDate ?? (object)DBNull.Value),
                    new SqlParameter("Description", obj.Description ?? (object)DBNull.Value),
                    new SqlParameter("IsUseOil", obj.IsUseOil ?? (object)DBNull.Value),
                    new SqlParameter("IsFinished", obj.IsFinished ?? (object)DBNull.Value),
                    new SqlParameter("CreatedBy", obj.CreatedBy ?? (object)DBNull.Value),
                    new SqlParameter("CreatedDate", obj.CreatedDate ?? (object)DBNull.Value),
                    new SqlParameter("UpdatedBy", obj.UpdatedBy ?? (object)DBNull.Value),
                    new SqlParameter("UpdatedDate", obj.UpdatedDate ?? (object)DBNull.Value),
                    new SqlParameter("CustomerRequest", obj.CustomerRequest ?? (object)DBNull.Value),
                    new SqlParameter("MotorStatus", obj.MotorStatus ?? (object)DBNull.Value),
                    new SqlParameter("MotorStatusBefore", obj.MotorStatusBefore ?? (object)DBNull.Value),
                    new SqlParameter("Fuellevel", obj.Fuellevel ?? (object)DBNull.Value),
                    new SqlParameter("SBH", obj.SBH ?? (object)DBNull.Value),
                    new SqlParameter("UniqId", obj.UniqId ?? (object)DBNull.Value),
                    new SqlParameter("UniqueId", obj.UniqueId ?? (object)DBNull.Value),
                    new SqlParameter("BillType", obj.BillType ?? (object)DBNull.Value),
                    new SqlParameter("IsKetCa", obj.IsKetCa ?? (object)DBNull.Value),
                    new SqlParameter("IsOpening", obj.IsOpening ?? (object)DBNull.Value),
                    new SqlParameter("OpeningByUser", obj.OpeningByUser ?? (object)DBNull.Value),
                    new SqlParameter("IsLayLaiPhuTungCu", obj.IsLayLaiPhuTungCu ?? (object)DBNull.Value),
                    new SqlParameter("SoThuTuCho", obj.SoThuTuCho ?? (object)DBNull.Value),
                    new SqlParameter("LayLaiPhuTungCu", obj.LayLaiPhuTungCu ?? (object)DBNull.Value),
                    new SqlParameter("PrintCounter", obj.PrintCounter ?? (object)DBNull.Value),
                    new SqlParameter("FinishedBy", obj.FinishedBy ?? (object)DBNull.Value),
                    new SqlParameter("ScanBarCodeBy", obj.ScanBarCodeBy ?? (object)DBNull.Value),
                    new SqlParameter("BuyDate", obj.BuyDate ?? (object)DBNull.Value),
                    new SqlParameter("ExpectedOutDate", obj.ExpectedOutDate ?? (object)DBNull.Value),
                    new SqlParameter("TotalPrevKm", obj.TotalPrevKm ?? (object)DBNull.Value),
                    new SqlParameter("Ward_NoUnicode", obj.Ward_NoUnicode ?? (object)DBNull.Value),
                    new SqlParameter("TotalAfterRound", obj.TotalAfterRound ?? (object)DBNull.Value),
                    new SqlParameter("CustomerRequest_Copy", obj.CustomerRequest_Copy ?? (object)DBNull.Value),
                    new SqlParameter("MotorStatus_Copy", obj.MotorStatus_Copy ?? (object)DBNull.Value),
                    new SqlParameter("XacNhanSuaChua", obj.XacNhanSuaChua ?? (object)DBNull.Value),
                    new SqlParameter("MaLyDoKhongCoSoKhung", obj.MaLyDoKhongCoSoKhung ?? (object)DBNull.Value),
                    new SqlParameter("TenLyDoKhongCoSoKhung", obj.TenLyDoKhongCoSoKhung ?? (object)DBNull.Value),
                    new SqlParameter("LoaiKiemTraCuoi", obj.LoaiKiemTraCuoi ?? (object)DBNull.Value),
                    new SqlParameter("CheckPrintBill", obj.CheckPrintBill ?? (object)DBNull.Value),
                    new SqlParameter("ModelYear", obj.ModelYear ?? (object)DBNull.Value),
                    new SqlParameter("LyDoSaiSoKM", obj.LyDoSaiSoKM ?? (object)DBNull.Value));

                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw ex;
            }
        }

        public bool SaveServiceBillDetail(List<PT_ServiceBillDetail> lstobj, PT_ServiceBill bill)
        {
            try
            {
                // cập nhật các hạng mục của Bill_No - IsDelete = 1
                string sql = $"UPDATE dbo.PT_ServiceBillDetail SET IsDeleted = 1, UpdatedBy = '{bill.UpdatedBy}', UpdatedDate = GETDATE() WHERE Bill_NO = '{bill.Bill_NO}'";
                _commonService.ExcuteSQL(sql);
                // cập nhật insert hoặc update 
                if (lstobj.Count > 0)
                {
                    foreach (var obj in lstobj)
                    {
                        string store = "sp_SaveServiceBillDetail";
                        _commonService.ExcuteFromStore(store,
                            new SqlParameter("Id", obj.Id),
                            new SqlParameter("Bill_NO", obj.Bill_NO),
                            new SqlParameter("ServiceId", obj.ServiceId),
                            new SqlParameter("Amount", obj.Amount),
                            new SqlParameter("OutPaid", obj.OutPaid),
                            new SqlParameter("Comment", obj.Comment),
                            new SqlParameter("SaleOffMoney", obj.SaleOffMoney),
                            new SqlParameter("SaleOffReason", obj.SaleOffReason),
                            new SqlParameter("Price", obj.Price),
                            new SqlParameter("AgentPrice", obj.AgentPrice),
                            new SqlParameter("IsDeleted", obj.IsDeleted),
                            new SqlParameter("CreatedBy", obj.CreatedBy),
                            new SqlParameter("CreatedDate", DateTime.Now),
                            new SqlParameter("UpdatedBy", obj.UpdatedBy),
                            new SqlParameter("UpdatedDate", DateTime.Now),
                            new SqlParameter("ServiceCode", obj.ServiceCode),
                            new SqlParameter("IntCode", obj.IntCode),
                            new SqlParameter("UniqId", obj.UniqId),
                            new SqlParameter("DepreciationCost", obj.DepreciationCost),
                            new SqlParameter("SaleBy", obj.SaleBy));
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw ex;
            }
        }

        public bool SaveSpecialTool(List<PT_SpecialTool> lstobj, PT_ServiceBill bill)
        {
            try
            {
                // cập nhật các phụ tùng phát sinh phụ tùng thay thế của Bill_No - IsDelete = 1
                string sql = $"UPDATE dbo.PT_SpecialTool SET IsDeleted = 1, UpdatedBy = '{bill.UpdatedBy}', UpdatedDate = GETDATE() WHERE BillNo = '{bill.Bill_NO}'";
                _commonService.ExcuteSQL(sql);
                if (lstobj.Count > 0)
                {
                    foreach (var obj in lstobj)
                    {
                        string store = "sp_SaveSpecialTool";
                        _commonService.ExcuteFromStore(store,
                            new SqlParameter("@BillNo", obj.BillNo),
                            new SqlParameter("@Part_Name", obj.Part_Name),
                            new SqlParameter("@QTY", obj.QTY),
                            new SqlParameter("@Price_After_Discount", obj.Price_After_Discount),
                            new SqlParameter("@Amount", obj.Amount),
                            new SqlParameter("@ServiceType", obj.ServiceType),
                            new SqlParameter("@ToolType", obj.ToolType),
                            new SqlParameter("@IsDeleted", obj.IsDeleted),
                            new SqlParameter("@CreatedDate", obj.CreatedDate),
                            new SqlParameter("@CreatedBy", obj.CreatedBy),
                            new SqlParameter("@UpdatedDate", obj.UpdatedDate),
                            new SqlParameter("@UpdatedBy", obj.UpdatedBy),
                            new SqlParameter("@UniqId", obj.UniqId ?? (object)DBNull.Value),
                            new SqlParameter("@SaleBy", obj.SaleBy),
                            new SqlParameter("@IntCode", obj.IntCode));
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw ex;
            }
        }

        public bool SaveToolInBill(List<PT_ToolInBill> lstobj, PT_ServiceBill bill, bool isBuy)
        {
            try
            {

                // cập nhật các phụ tùng phát sinh phụ tùng thay thế của Bill_No - IsDelete = 1
                string sql = $"UPDATE dbo.PT_ToolInBill SET IsDeleted = 1, UpdatedBy = '{bill.UpdatedBy}', UpdatedDate = GETDATE() WHERE BillNo = '{bill.Bill_NO}'";
                if (isBuy)
                    sql += " AND ToolType = 2";
                else
                    sql += " AND ToolType <> 2";
                _commonService.ExcuteSQL(sql);

                if (lstobj.Count > 0)
                {
                    foreach (var obj in lstobj)
                    {
                        // phụ tùng tự mua ToolType == 2
                        if (obj.ToolType == 2)
                            obj.IsOil = GetByCodeLST(obj.Part_No);

                        string store = "sp_SaveToolInBill";
                        _commonService.ExcuteFromStore(store,
                        new SqlParameter("@BillNo", obj.BillNo),
                        new SqlParameter("@Part_No", obj.Part_No),
                        new SqlParameter("@Part_Name", obj.Part_Name),
                        new SqlParameter("@QTY", obj.QTY),
                        new SqlParameter("@Cost", obj.Cost),
                        new SqlParameter("@OriginalPrice", obj.OriginalPrice),
                        new SqlParameter("@Price_After_Discount", obj.Price_After_Discount),
                        new SqlParameter("@Amount", obj.Amount),
                        new SqlParameter("@ServiceType", obj.ServiceType ?? (object)DBNull.Value),
                        new SqlParameter("@ToolType", obj.ToolType),
                        new SqlParameter("@IsOil", obj.IsOil),
                        new SqlParameter("@DiscountReason", obj.DiscountReason ?? (object)DBNull.Value),
                        new SqlParameter("@IsDeleted", obj.IsDeleted),
                        new SqlParameter("@CreatedDate", obj.CreatedDate),
                        new SqlParameter("@CreatedBy", obj.CreatedBy),
                        new SqlParameter("@UpdatedDate", obj.UpdatedDate),
                        new SqlParameter("@UpdatedBy", obj.UpdatedBy),
                        new SqlParameter("@UniqId", obj.UniqId ?? (object)DBNull.Value),
                        new SqlParameter("@VAT", obj.VAT ?? (object)DBNull.Value));
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw ex;
            }
        }

        public bool SaveCheckForServiceBill(PT_CheckForServiceBill obj, PT_ServiceBill bill)
        {
            try
            {
                // cập nhật các phụ tùng phát sinh phụ tùng thay thế của Bill_No - IsDelete = 1
                string sql = $"UPDATE dbo.PT_CheckForServiceBill SET IsDeleted = 1, UpdatedBy = '{bill.UpdatedBy}', UpdatedDate = GETDATE() WHERE BillNo = '{bill.Bill_NO}'";
                _commonService.ExcuteSQL(sql);

                string store = "sp_SaveCheckForServiceBill";
                _commonService.ExcuteFromStore(store,
                   new SqlParameter("@Bill_No", obj.Bill_No),
                    new SqlParameter("@DauPhanh", string.IsNullOrEmpty(obj.DauPhanh) ? (object)DBNull.Value : obj.DauPhanh),
                    new SqlParameter("@PhanhTruoc", string.IsNullOrEmpty(obj.PhanhTruoc) ? (object)DBNull.Value : obj.PhanhTruoc),
                    new SqlParameter("@PhanhSau", string.IsNullOrEmpty(obj.PhanhSau) ? (object)DBNull.Value : obj.PhanhSau),
                    new SqlParameter("@BongDen", string.IsNullOrEmpty(obj.BongDen) ? (object)DBNull.Value : obj.BongDen),
                    new SqlParameter("@CongTac", string.IsNullOrEmpty(obj.CongTac) ? (object)DBNull.Value : obj.CongTac),
                    new SqlParameter("@Coi", string.IsNullOrEmpty(obj.Coi) ? (object)DBNull.Value : obj.Coi),
                    new SqlParameter("@LopTruoc", string.IsNullOrEmpty(obj.LopTruoc) ? (object)DBNull.Value : obj.LopTruoc),
                    new SqlParameter("@LopSau", string.IsNullOrEmpty(obj.LopSau) ? (object)DBNull.Value : obj.LopSau),
                    new SqlParameter("@DauMay", string.IsNullOrEmpty(obj.DauMay) ? (object)DBNull.Value : obj.DauMay),
                    new SqlParameter("@LamMat", string.IsNullOrEmpty(obj.LamMat) ? (object)DBNull.Value : obj.LamMat),
                    new SqlParameter("@Xich", string.IsNullOrEmpty(obj.Xich) ? (object)DBNull.Value : obj.Xich),
                    new SqlParameter("@CongToMet", string.IsNullOrEmpty(obj.CongToMet) ? (object)DBNull.Value : obj.CongToMet),
                    new SqlParameter("@DayPhanh", string.IsNullOrEmpty(obj.DayPhanh) ? (object)DBNull.Value : obj.DayPhanh),
                    new SqlParameter("@DauSo", string.IsNullOrEmpty(obj.DauSo) ? (object)DBNull.Value : obj.DauSo),
                    new SqlParameter("@DayDai", string.IsNullOrEmpty(obj.DayDai) ? (object)DBNull.Value : obj.DayDai),
                    new SqlParameter("@AcQuy", string.IsNullOrEmpty(obj.AcQuy) ? (object)DBNull.Value : obj.AcQuy),
                    new SqlParameter("@LocGio", string.IsNullOrEmpty(obj.LocGio) ? (object)DBNull.Value : obj.LocGio),
                    new SqlParameter("@NhongXich", string.IsNullOrEmpty(obj.NhongXich) ? (object)DBNull.Value : obj.NhongXich),
                    new SqlParameter("@Con", string.IsNullOrEmpty(obj.Con) ? (object)DBNull.Value : obj.Con),
                    new SqlParameter("@ChoiThan", string.IsNullOrEmpty(obj.ChoiThan) ? (object)DBNull.Value : obj.ChoiThan),
                    new SqlParameter("@HongGa", string.IsNullOrEmpty(obj.HongGa) ? (object)DBNull.Value : obj.HongGa),
                    new SqlParameter("@Bugi", string.IsNullOrEmpty(obj.Bugi) ? (object)DBNull.Value : obj.Bugi),
                    new SqlParameter("@RuaXe", string.IsNullOrEmpty(obj.RuaXe) ? (object)DBNull.Value : obj.RuaXe),
                    new SqlParameter("@HangMucKiemTraLanToi", string.IsNullOrEmpty(obj.HangMucKiemTraLanToi) ? (object)DBNull.Value : obj.HangMucKiemTraLanToi),
                    new SqlParameter("@LayLaiPhuTungCu", string.IsNullOrEmpty(obj.LayLaiPhuTungCu) ? (object)DBNull.Value : obj.LayLaiPhuTungCu),
                    new SqlParameter("@PhanhTruoc_user", string.IsNullOrEmpty(obj.PhanhTruoc_user) ? (object)DBNull.Value : obj.PhanhTruoc_user),
                    new SqlParameter("@PhanhSau_user", string.IsNullOrEmpty(obj.PhanhSau_user) ? (object)DBNull.Value : obj.PhanhSau_user),
                    new SqlParameter("@BongDen_user", string.IsNullOrEmpty(obj.BongDen_user) ? (object)DBNull.Value : obj.BongDen_user),
                    new SqlParameter("@CongTac_user", string.IsNullOrEmpty(obj.CongTac_user) ? (object)DBNull.Value : obj.CongTac_user),
                    new SqlParameter("@Coi_user", string.IsNullOrEmpty(obj.Coi_user) ? (object)DBNull.Value : obj.Coi_user),
                    new SqlParameter("@LopTruoc_user", string.IsNullOrEmpty(obj.LopTruoc_user) ? (object)DBNull.Value : obj.LopTruoc_user),
                    new SqlParameter("@LopSau_user", string.IsNullOrEmpty(obj.LopSau_user) ? (object)DBNull.Value : obj.LopSau_user),
                    new SqlParameter("@DauMay_user", string.IsNullOrEmpty(obj.DauMay_user) ? (object)DBNull.Value : obj.DauMay_user),
                    new SqlParameter("@LamMat_user", string.IsNullOrEmpty(obj.LamMat_user) ? (object)DBNull.Value : obj.LamMat_user),
                    new SqlParameter("@Xich_user", string.IsNullOrEmpty(obj.Xich_user) ? (object)DBNull.Value : obj.Xich_user),
                    new SqlParameter("@CongToMet_user", string.IsNullOrEmpty(obj.CongToMet_user) ? (object)DBNull.Value : obj.CongToMet_user),
                    new SqlParameter("@DayPhanh_user", string.IsNullOrEmpty(obj.DayPhanh_user) ? (object)DBNull.Value : obj.DayPhanh_user),
                    new SqlParameter("@DauSo_user", string.IsNullOrEmpty(obj.DauSo_user) ? (object)DBNull.Value : obj.DauSo_user),
                    new SqlParameter("@DayDai_user", string.IsNullOrEmpty(obj.DayDai_user) ? (object)DBNull.Value : obj.DayDai_user),
                    new SqlParameter("@AcQuy_user", string.IsNullOrEmpty(obj.AcQuy_user) ? (object)DBNull.Value : obj.AcQuy_user),
                    new SqlParameter("@LocGio_user", string.IsNullOrEmpty(obj.LocGio_user) ? (object)DBNull.Value : obj.LocGio_user),
                    new SqlParameter("@NhongXich_user", string.IsNullOrEmpty(obj.NhongXich_user) ? (object)DBNull.Value : obj.NhongXich_user),
                    new SqlParameter("@Con_user", string.IsNullOrEmpty(obj.Con_user) ? (object)DBNull.Value : obj.Con_user),
                    new SqlParameter("@ChoiThan_user", string.IsNullOrEmpty(obj.ChoiThan_user) ? (object)DBNull.Value : obj.ChoiThan_user),
                    new SqlParameter("@HongGa_user", string.IsNullOrEmpty(obj.HongGa_user) ? (object)DBNull.Value : obj.HongGa_user),
                    new SqlParameter("@Bugi_user", string.IsNullOrEmpty(obj.Bugi_user) ? (object)DBNull.Value : obj.Bugi_user),
                    new SqlParameter("@RuaXe_user", string.IsNullOrEmpty(obj.RuaXe_user) ? (object)DBNull.Value : obj.RuaXe_user),
                    new SqlParameter("@HangMucKiemTraLanToi_user", string.IsNullOrEmpty(obj.HangMucKiemTraLanToi_user) ? (object)DBNull.Value : obj.HangMucKiemTraLanToi_user),
                    new SqlParameter("@HangMucKiemTraLanToi2", string.IsNullOrEmpty(obj.HangMucKiemTraLanToi2) ? (object)DBNull.Value : obj.HangMucKiemTraLanToi2),
                    new SqlParameter("@HangMucKiemTraLanToi3", string.IsNullOrEmpty(obj.HangMucKiemTraLanToi3) ? (object)DBNull.Value : obj.HangMucKiemTraLanToi3),
                    new SqlParameter("@HangMucKiemTraLanToi2_user", string.IsNullOrEmpty(obj.HangMucKiemTraLanToi2_user) ? (object)DBNull.Value : obj.HangMucKiemTraLanToi2_user),
                    new SqlParameter("@HangMucKiemTraLanToi3_user", string.IsNullOrEmpty(obj.HangMucKiemTraLanToi3_user) ? (object)DBNull.Value : obj.HangMucKiemTraLanToi3_user),
                    new SqlParameter("@LayLaiPhuTungCu_user", string.IsNullOrEmpty(obj.LayLaiPhuTungCu_user) ? (object)DBNull.Value : obj.LayLaiPhuTungCu_user),
                    new SqlParameter("@DauPhanh_user", string.IsNullOrEmpty(obj.DauPhanh_user) ? (object)DBNull.Value : obj.DauPhanh_user),
                    new SqlParameter("@HangMucKiemTraLanToi4", string.IsNullOrEmpty(obj.HangMucKiemTraLanToi4) ? (object)DBNull.Value : obj.HangMucKiemTraLanToi4),
                    new SqlParameter("@HangMucKiemTraLanToi5", string.IsNullOrEmpty(obj.HangMucKiemTraLanToi5) ? (object)DBNull.Value : obj.HangMucKiemTraLanToi5),
                    new SqlParameter("@HangMucKiemTraLanToi4_user", string.IsNullOrEmpty(obj.HangMucKiemTraLanToi4_user) ? (object)DBNull.Value : obj.HangMucKiemTraLanToi4_user),
                    new SqlParameter("@HangMucKiemTraLanToi5_user", string.IsNullOrEmpty(obj.HangMucKiemTraLanToi5_user) ? (object)DBNull.Value : obj.HangMucKiemTraLanToi5_user));



                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw ex;
            }
        }

        public int SavePrintTool(PT_PrintHistory print, ref string printDate)
        {
            try
            {
                // save PrintTool
                string insertSql = $"INSERT INTO dbo.PT_PrintHistory(Bill_no, PrintedBy, PrintedDate, PrintContent) VALUES ('{print.Bill_no}','{print.PrintedBy}',GETDATE(),'{print.PrintContent}')";
                _commonService.ExcuteSQL(insertSql);

                // get Row
                string getRowSql = $"SELECT * FROM PT_PrintHistory where Bill_No = '{print.Bill_no}' order by PrintedDate desc";
                var dt = _commonService.GetDataFromSQL(getRowSql);

                if (dt.Rows.Count > 0)
                {
                    printDate = DateTime.Parse(dt.Rows[0]["PrintedDate"].ToString()).ToString("dd/MM/yyyy HH:mm:ss");
                    return dt.Rows.Count;
                }
                else
                    return 0;
            }
            catch (Exception ex)
            {
                return 0;
                throw ex;
            }
        }

        public DataTable GetCustomerHistoryByNumberPlate(string numberPlateOrPhone,string phone)
        {
            try
            {
                string store = "sp_PT_GetCustomerHistoryByNumberPlateOrPhone";
                return _commonService.GetDataFromStore(store,
                   new SqlParameter("@numberPlate", numberPlateOrPhone == null ? "" : numberPlateOrPhone),
                   new SqlParameter("@phone", phone == null ? "" : phone));
            }
            catch(Exception ex)
            {
                return null;
                throw ex;
            }
        }

        public DataTable GetLastCustomerInfoFromAllStore(string numberPlate)
        {
            try
            {
                string store = "sp_SearchByNumberPlateAllStore";
                return _commonService.GetDataFromStorePTCare2(store,
                   new SqlParameter("@numberPlate", numberPlate));
            }
            catch (Exception ex)
            {
                return null;
                throw ex;
            }
        }

        public DataTable SelectByNumberPlateFromCustomer(string numberPlate)
        {
            try
            {
                string sql = $"SELECT TOP 1 * FROM dbo.PT_Customer WHERE NumberPlate = '{numberPlate}' ORDER BY CreatedDate DESC";
                return _commonService.GetDataFromStore(sql);
            }
            catch (Exception ex)
            {
                return null;
                throw ex;
            }
        }

        public DataTable SelectByNumberPlateFromServiceBill(string numberPlate)
        {
            try
            {
                string sql = $"SELECT TOP 1 * FROM dbo.PT_ServiceBill WHERE NumberPlate = '{numberPlate}' ORDER BY CreatedDate DESC";
                return _commonService.GetDataFromStore(sql);
            }
            catch (Exception ex)
            {
                return null;
                throw ex;
            }
        }


        public string GetUniqueID()
        {
            try
            {
                string id = "";
                int uniqueId = 1;
                string ngay = DateTime.Now.ToString("yyyy-MM-dd");
                string sql = $"SELECT TOP 1 * FROM dbo.UniqueId WHERE DATEDIFF(DAY,Ngay,'{ngay}') = 0 ORDER BY UniqueId DESC";
                var dt = _commonService.GetDataFromSQL(sql);
                if (dt == null || dt.Rows.Count == 0)
                {
                    // gen mã mới
                    id = "D" + DateTime.Now.ToString("yyyyMMdd") + "0001";
                    uniqueId = 1;
                }
                else
                {
                    uniqueId = int.Parse(dt.Rows[0]["UniqueId"].ToString());
                    id = GenBillNo(uniqueId);
                    uniqueId += 1;
                }

                // insert unique
                string sqlInsert = $"INSERT INTO dbo.UniqueId(UniqueId, Ngay) VALUES('{uniqueId}','{ngay}')";
                _commonService.ExcuteSQL(sqlInsert);

                return id;
            }
            catch (Exception ex)
            {
                return "";
                throw ex;
            }
        }

        public string GenBillNo(int lastId)
        {
            if (lastId < 9999)
                lastId += 1;
            else
                lastId = 0;
            string code = lastId.ToString();
            switch (code.Length)
            {
                case 1:
                    code = "000" + code;
                    break;
                case 2:
                    code = "00" + code;
                    break;
                case 3:
                    code = "0" + code;
                    break;
            }
            return "D" + DateTime.Now.ToString("yyyyMMdd") + code;
        }
    }
}
