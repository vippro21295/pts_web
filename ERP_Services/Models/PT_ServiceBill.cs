using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SM_Services.Models
{
    public class PT_ServiceBill
    {
        public string Bill_NO { get; set; }
        public string QOT_NO { get; set; }
        public string ServiceType { get; set; }
        public DateTime? InputDate { get; set; }
        public DateTime? OutputDate { get; set; }
        public DateTime? RepairDate { get; set; }
        public DateTime? FinishDate { get; set; }
        public int? RepairedBy { get; set; }
        public int? RepairedBy2 { get; set; }
        public int? ReceivedBy { get; set; }
        public int? Cashier { get; set; }
        public int? CheckBy { get; set; }
        public string CustName { get; set; }
        public string CustName_noUnicode { get; set; }
        public string CellPhone { get; set; }
        public string Phone { get; set; }
        public string AddressNumber { get; set; }
        public string Address { get; set; }
        public int? ProvinceCode { get; set; }
        public int? DistCode { get; set; }
        public string Ward { get; set; }
        public string Model { get; set; }
        public float? TotalKms { get; set; }
        public string NumberPlate { get; set; }
        public string MachineCode { get; set; }
        public string Comment { get; set; }
        public float? ServicePaid { get; set; }
        public float? RepairPaid { get; set; }
        public float? ToolPaid { get; set; }
        public float? OutPaid { get; set; }
        public float? OilPaid { get; set; }
        public float? TotalMoney { get; set; }
        public float? TotalLaiGCN { get; set; }
        public float? TotalLaiPTTM { get; set; }
        public DateTime? ReportDate { get; set; }
        public string Description { get; set; }
        public bool? IsUseOil { get; set; }
        public bool? IsFinished { get; set; }
        public bool? IsDeleted { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string CustomerRequest { get; set; }
        public string MotorStatus { get; set; }
        public string MotorStatusBefore { get; set; }
        public int? Fuellevel { get; set; }
        public string SBH { get; set; }
        public Guid? UniqId { get; set; }
        public Guid? UniqueId { get; set; }
        public int? BillType { get; set; }
        public bool? IsKetCa { get; set; }
        public bool? IsOpening { get; set; }
        public string OpeningByUser { get; set; }
        public bool? IsLayLaiPhuTungCu { get; set; }
        public string SoThuTuCho { get; set; }
        public string LayLaiPhuTungCu { get; set; }
        public int? PrintCounter { get; set; }
        public string FinishedBy { get; set; }
        public string ScanBarCodeBy { get; set; }
        public DateTime? BuyDate { get; set; }
        public DateTime? ExpectedOutDate { get; set; }
        public float? TotalPrevKm { get; set; }
        public string Ward_NoUnicode { get; set; }
        public float? TotalAfterRound { get; set; }
        public string CustomerRequest_Copy { get; set; }
        public string MotorStatus_Copy { get; set; }
        public string XacNhanSuaChua { get; set; }
        public string MaLyDoKhongCoSoKhung { get; set; }
        public string TenLyDoKhongCoSoKhung { get; set; }
        public string LoaiKiemTraCuoi { get; set; }
        public string CheckPrintBill { get; set; }
        public string ModelYear { get; set; }
        public string LyDoSaiSoKM { get; set; }
    }
}
