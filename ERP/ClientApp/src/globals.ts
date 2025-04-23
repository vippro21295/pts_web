//export const urlAnsuz: string="https://ptc.ansuzdev.com"; 
  export const urlAnsuz: string="https://apiptc.phattien.net:8009"; 
//export const urlAnsuz: string="https://apitest.phattien.net:888"; 
//export const urlAnsuz: string="https://9daf-222-253-45-21.ap.ngrok.io"; 
export const codeAnsuz: string="head-admin"; 
export const passwordAnsuz: string="MZA4ciUp"; 

export const users_admin_app = {
    "1": { "code": "head-admin", pass: "MZA4ciUp" },
    "35":  { "code": "admin-tayninh", pass:"MZA4ciUp" }
 };

let modelsTypeCus: { code: string, name: string }[] = [
    { "code": 'lead', "name": "Khách hàng tiềm năng" },
    { "code": 'frozen', "name": " khách hàng đóng băng" },
    { "code": 'lost', "name": "khách hàng đã mất" },
    { "code": 'fromcompany', "name": "khách hàng từ công ty" }
];

let stateCustomer: { code: string, name: string }[] = [
    { "code": 'hot', "name": "HOT" },
    { "code": 'warm', "name": "WARM" },
    { "code": 'cold', "name": "COLD" }
];

let gener : { code: string, name: string }[] = [
    { "code": 'MALE', "name": "Name" },
    { "code": 'FEMALE', "name": "Nữ" },
    { "code": 'OTHER', "name": "Khác" }
];


let maritalStatus : { code: string, name: string }[] = [
    { "code": 'single', "name": "Độc thân" },
    { "code": 'married', "name": "Đã kết hôn" },
    { "code": 'widowed', "name": "Góa vợ" },
    { "code": 'divorced', "name": "Ly hôn" },
    { "code": 'separated', "name": "Ly thân" },
];

let civility : { code: string, name: string }[] = [
    { "code": 'mr', "name": "Ông" },
    { "code": 'mrs', "name": "Bà" }
];