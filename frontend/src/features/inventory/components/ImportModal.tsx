import { useState } from 'react';
import { X, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { excelService } from '@/services/excel.service';
import { useCreateMaterial } from '@/hooks/useMaterials';
import { toast } from 'sonner';

interface ImportModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportModal({ onClose, onSuccess }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const createMaterial = useCreateMaterial();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    try {
      const data = await excelService.importMaterials(selectedFile);
      setPreview(data.slice(0, 10));
      toast.success(`Đọc thành công ${data.length} dòng dữ liệu`);
    } catch (error) {
      toast.error('Đọc file thất bại');
      setPreview([]);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    setIsImporting(true);
    try {
      const data = await excelService.importMaterials(file);
      let successCount = 0;
      
      for (const item of data) {
        if (item.code && item.name) {
          await createMaterial.mutateAsync(item);
          successCount++;
        }
      }
      
      toast.success(`Import thành công ${successCount}/${data.length} vật tư`);
      onSuccess();
    } catch (error) {
      toast.error('Import thất bại');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Import Excel</h2>
          <button onClick={onClose} className="p-1 hover:bg-bg-tertiary rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary mb-2">Chọn file Excel để import</p>
            <p className="text-xs text-text-muted mb-4">Hỗ trợ định dạng .xlsx, .xls</p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="excel-file"
            />
            <label
              htmlFor="excel-file"
              className="px-4 py-2 bg-accent text-white rounded-lg cursor-pointer hover:bg-accent-hover"
            >
              Chọn file
            </label>
          </div>
          
          {file && (
            <div className="bg-bg-tertiary rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-text-primary">{file.name}</span>
              </div>
            </div>
          )}
          
          {preview.length > 0 && (
            <div>
              <h3 className="font-medium text-text-primary mb-2">Xem trước dữ liệu</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-bg-tertiary">
                    <tr>
                      <th className="px-3 py-2 text-left">Mã</th>
                      <th className="px-3 py-2 text-left">Tên</th>
                      <th className="px-3 py-2 text-left">Danh mục</th>
                      <th className="px-3 py-2 text-right">SL</th>
                      <th className="px-3 py-2 text-right">Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((item, idx) => (
                      <tr key={idx} className="border-b border-border">
                        <td className="px-3 py-2">{item.code}</td>
                        <td className="px-3 py-2">{item.name}</td>
                        <td className="px-3 py-2">{item.category}</td>
                        <td className="px-3 py-2 text-right">{item.quantity}</td>
                        <td className="px-3 py-2 text-right">{item.cost?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {preview.length === 10 && (
                <p className="text-xs text-text-muted mt-2">Hiển thị 10 dòng đầu tiên</p>
              )}
            </div>
          )}
        </div>
        
        <div className="flex gap-3 p-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-bg-tertiary text-text-secondary rounded-lg hover:bg-bg-tertiary/80"
          >
            Hủy
          </button>
          <button
            onClick={handleImport}
            disabled={!file || isImporting}
            className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50"
          >
            {isImporting ? 'Đang import...' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  );
}
