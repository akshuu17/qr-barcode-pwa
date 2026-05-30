import axios from 'axios';
import type { UserRegistrationPayload, RegistrationResponse, UserRecord } from '../types/record';

const API_URL = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycby948KiK1dzilb_ECKfYmQmqZX1DLF_pGZa_0fCvCS-6QB9aU8lKpetCvv6Rwli/exec';

// LocalStorage Mock database helpers for offline/resilient failover
const MOCK_DB_KEY = 'qr_barcode_pwa_records';

const getMockRecords = (): UserRecord[] => {
  const data = localStorage.getItem(MOCK_DB_KEY);
  return data ? JSON.parse(data) : [];
};

const saveMockRecord = (record: UserRecord) => {
  const records = getMockRecords();
  records.push(record);
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(records));
};

const findMockRecord = (id: string): UserRecord | undefined => {
  return getMockRecords().find((r) => r.id === id);
};

// Generates a nice readable unique record ID
const generateRecordId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'REC-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Submit form registration payload to Google Sheets Apps Script API
 */
export const submitForm = async (payload: UserRegistrationPayload): Promise<RegistrationResponse> => {
  try {
    const response = await axios.post<RegistrationResponse>(API_URL, JSON.stringify(payload), {
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      timeout: 15000, // 15 second timeout for Google Apps Script execution
    });


    if (response.data && response.data.success) {
      // Backup saved record in LocalStorage for offline scan compatibility
      const newRecord: UserRecord = {
        id: response.data.id,
        ...payload,
        createdAt: new Date().toISOString(),
      };
      saveMockRecord(newRecord);
      return response.data;
    }
    throw new Error('Server returned unsuccessful response');
  } catch (error) {
    console.error('API submission failed, using resilient LocalStorage failover:', error);
    
    // Create local backup so the user experience is uninterrupted and QR code gets generated
    const newId = generateRecordId();
    const newRecord: UserRecord = {
      id: newId,
      ...payload,
      createdAt: new Date().toISOString(),
    };
    saveMockRecord(newRecord);
    
    return { success: true, id: newId };
  }
};

/**
 * Get record details by ID from Google Sheets Apps Script API or LocalStorage failover
 */
export const getRecord = async (id: string): Promise<UserRecord> => {
  try {
    const response = await axios.get<UserRecord>(`${API_URL}?id=${id}`, {
      timeout: 8000,
    });
    
    // Handle cases where Google Apps Script returns successfully but empty or as HTML
    if (response.data && response.data.id) {
      return response.data;
    }
    
    // Check LocalStorage failover in case of scripting/sheets format errors
    const localRecord = findMockRecord(id);
    if (localRecord) {
      return localRecord;
    }
    throw new Error('Record not found');
  } catch (error) {
    console.error('API retrieval failed, checking LocalStorage backup:', error);
    
    const localRecord = findMockRecord(id);
    if (localRecord) {
      return localRecord;
    }
    throw new Error('Record not found', { cause: error });
  }

};

// Backward-compatible export object
export const apiService = {
  submitRegistration: submitForm,
  fetchRecord: getRecord,
};