using SM_Services.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SM_Services.Services.ServiceBill
{
    public interface IServiceBillService
    {
        DataTable Search(int isFinished, string tenKH, string bienSo, string dienThoai, string tuPhieu,
            string denPhieu, DateTime tuNgay, DateTime denNgay, int nvSuaChua, int nvTiepNhan, int nvKiemTra,
            int nvThuNgan, string lstDichVu, string lstGiamGiaDichVu, string lstPhuTung, bool isOil,
            string lstGiamGiaPhuTung, string lstPhanLoaiXe, decimal tongTienTu, decimal tongTienDen, int phutThucHienTu,
            int phutThucHienDen, string tenhangmuc, string mahangmuc, string tenPhuTung, string maPhuTung, string userCode);

        DataTable GetDataBillNo(string billNo);

        DataTable GetToolList(string billNo, string isForNew);

        DataTable GetWage(string billNo);

        DataTable GetToolListOfBillPTPS(string billNo, int toolType);

        DataTable GetToolListOfBill(string billNo, string action);

        DataTable GetToolListOfBuy(string billNo, int toolType);

        DataTable GetToolHaoMon(string billNo);

        DataTable GetServiceCode(string serviceCode);

        DataTable GetServiceCodeModel(string serviceCode, string modelCode);

        string SaveServiceBill(ServiceBillWeb obj);

        int SavePrintTool(PT_PrintHistory printHistory, ref string printDate);

        DataTable GetCustomerHistoryByNumberPlate(string numberPlateOrPhone, string phone);

        DataTable GetLastCustomerInfoFromAllStore(string numberPlate);

        DataTable SelectByNumberPlateFromCustomer(string numberPlate);

        DataTable SelectByNumberPlateFromServiceBill(string numberPlate);
    }
}
