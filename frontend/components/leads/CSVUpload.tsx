'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2, X, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { dataAPI } from '@/lib/api/endpoints';
import { ColumnMapper } from './ColumnMapper';

interface CSVUploadProps {
  type: 'LEAD' | 'BRAND' | 'INFLUENCER';
  onUploadSuccess?: () => void;
}

export const CSVUpload = ({ type, onUploadSuccess }: CSVUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[] | null>(null);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [showMapper, setShowMapper] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim() !== '');
      const csvHeaders = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      
      const rows = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const obj: any = {};
        csvHeaders.forEach((h, i) => obj[h] = values[i]);
        return obj;
      });

      setHeaders(csvHeaders);
      setPreviewRows(rows);
      setShowPreview(true);
    };
    reader.readAsText(file.slice(0, 50000));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setStatus('error');
      setMessage('Please select a valid CSV file');
      return;
    }
    setFile(selectedFile);
    setStatus('idle');
    setMessage('');
    parseCSV(selectedFile);
  };

  const handleFinalUpload = async (mapping: Record<string, string>) => {
    if (!file) return;

    setUploading(true);
    setShowMapper(false);
    setStatus('idle');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('mapping', JSON.stringify(mapping));

    try {
      const response = await dataAPI.uploadData(formData);
      setStatus('success');
      setMessage(response.data.message);
      setFile(null);
      setHeaders(null);
      setPreviewRows([]);
      setShowPreview(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onUploadSuccess) onUploadSuccess();
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to upload data');
    } finally {
      setUploading(false);
    }
  };

  if (showMapper && headers) {
    return (
      <ColumnMapper 
        headers={headers} 
        type={type} 
        onConfirm={handleFinalUpload}
        onCancel={() => {
          setShowMapper(false);
          setFile(null);
          setHeaders(null);
        }}
      />
    );
  }

  if (showPreview && previewRows.length > 0) {
    return (
      <Card className="animate-in zoom-in duration-300 border-4 border-black">
        <div className="p-4 bg-black text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TableIcon className="w-5 h-5" />
            <span className="font-bold uppercase tracking-tighter">CSV Preview: {file?.name}</span>
          </div>
          <button onClick={() => setShowPreview(false)}><X className="w-5 h-5" /></button>
        </div>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-grey-50 font-bold border-b-2 border-black">
              <tr>
                {headers?.slice(0, 6).map(h => <th key={h} className="px-4 py-2 text-left">{h}</th>)}
                {headers && headers.length > 6 && <th className="px-4 py-2">...</th>}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, i) => (
                <tr key={i} className="border-b border-grey-100">
                  {headers?.slice(0, 6).map(h => <td key={h} className="px-4 py-2 truncate max-w-[150px]">{row[h]}</td>)}
                  {headers && headers.length > 6 && <td className="px-4 py-2">...</td>}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-6 bg-grey-50 flex justify-between items-center border-t-2 border-black">
            <div className="text-xs font-medium text-grey-500 italic">Showing first 5 rows for validation</div>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setShowPreview(false)}>Cancel</Button>
              <Button onClick={() => setShowMapper(true)}>Looks Good, Map Columns</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card 
      className={`border-4 border-dashed transition-all group ${
        isDragging ? 'border-black bg-grey-50 scale-[1.01]' : 'border-grey-300 hover:border-black'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
      <CardBody>
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            ref={fileInputRef}
            className="hidden"
          />
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer flex flex-col items-center max-w-xs"
          >
            {status === 'success' ? (
              <CheckCircle2 className="w-16 h-16 text-black mb-2" />
            ) : status === 'error' ? (
              <AlertCircle className="w-16 h-16 text-black mb-2" />
            ) : (
              <div className="bg-grey-100 p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-black group-hover:text-white transition-all">
                <Upload className="w-12 h-12" />
              </div>
            )}
            
            <h3 className="text-2xl font-black mt-6 uppercase tracking-tighter text-black">
              {isDragging ? 'Drop it here!' : 'Intelligence Import'}
            </h3>
            <p className="text-grey-500 text-sm font-medium mt-2">
              Drag and drop your Brand/Influencer CSV for automated intelligence processing.
            </p>
          </div>

          {uploading && (
            <div className="flex items-center space-x-2 text-black font-black uppercase tracking-tighter">
              <Loader2 className="animate-spin" />
              <span>Processing Intelligence...</span>
            </div>
          )}

          {message && (
            <div className={`p-4 border-4 border-black ${status === 'success' ? 'bg-black text-white' : 'bg-white text-black'} font-black uppercase text-xs animate-in slide-in-from-bottom-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
              {message}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
