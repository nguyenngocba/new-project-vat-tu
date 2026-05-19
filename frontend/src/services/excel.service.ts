import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Material } from '@/types/material.types';
import { Project } from '@/types/project.types';
import { Structure } from '@/types/structure.types';
import { Supplier } from '@/types/supplier.types';

export const excelService = {
  // Export materials to Excel
  exportMaterials: (materials: Material[]) => {
    const data = materials.map(m => ({
      'Mã': m.code,
      'Tên vật tư': m.name,
      'Danh mục': m.category,
      'Đơn vị': m.unit,
      'Số lượng': m.quantity,
      'Đơn giá': m.cost,
      'Thành tiền': m.quantity * m.cost,
      'Ngưỡng cảnh báo': m.minStock,
      'Ghi chú': m.note || '',
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vật tư');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `danh_sach_vat_tu_${new Date().toISOString().split('T')[0]}.xlsx`);
  },
  
  // Export projects to Excel
  exportProjects: (projects: Project[]) => {
    const data = projects.map(p => ({
      'Mã': p.code,
      'Tên dự án': p.name,
      'Khách hàng': p.customerName || '',
      'Ngân sách': p.budget,
      'Đã sử dụng': p.spent,
      'Còn lại': p.budget - p.spent,
      'Tiến độ': ((p.spent / p.budget) * 100).toFixed(1) + '%',
      'Trạng thái': p.status === 'active' ? 'Đang thi công' : p.status === 'completed' ? 'Hoàn thành' : 'Lên kế hoạch',
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dự án');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `danh_sach_du_an_${new Date().toISOString().split('T')[0]}.xlsx`);
  },
  
  // Export structures to Excel
  exportStructures: (structures: Structure[]) => {
    const data = structures.map(s => ({
      'Mã': s.code,
      'Tên cấu kiện': s.name,
      'Loại': s.type,
      'Số lượng': s.quantity,
      'Đơn vị': s.unit,
      'Đơn giá': s.cost,
      'Thành tiền': s.quantity * s.cost,
      'Vị trí': `${s.zone}${s.positionY}`,
      'Trọng lượng (kg)': s.weight,
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cấu kiện');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `danh_sach_cau_kien_${new Date().toISOString().split('T')[0]}.xlsx`);
  },
  
  // Export suppliers to Excel
  exportSuppliers: (suppliers: Supplier[]) => {
    const data = suppliers.map(s => ({
      'Mã': s.code,
      'Tên nhà cung cấp': s.name,
      'SĐT': s.phone || '',
      'Email': s.email || '',
      'Địa chỉ': s.address || '',
      'MST': s.taxCode || '',
      'Đánh giá': s.rating || 0,
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Nhà cung cấp');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `danh_sach_nha_cung_cap_${new Date().toISOString().split('T')[0]}.xlsx`);
  },
  
  // Import Excel and parse to materials
  importMaterials: (file: File): Promise<Partial<Material>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          const materials = jsonData.map((row: any) => ({
            code: row['Mã'] || row['code'] || '',
            name: row['Tên vật tư'] || row['name'] || '',
            category: row['Danh mục'] || row['category'] || 'Khác',
            unit: row['Đơn vị'] || row['unit'] || 'cái',
            quantity: parseFloat(row['Số lượng'] || row['quantity'] || 0),
            cost: parseFloat(row['Đơn giá'] || row['cost'] || 0),
            minStock: parseFloat(row['Ngưỡng cảnh báo'] || row['minStock'] || 5),
            note: row['Ghi chú'] || row['note'] || '',
          }));
          
          resolve(materials);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  },
};
