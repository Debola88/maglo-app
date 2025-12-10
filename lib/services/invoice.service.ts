/* eslint-disable @typescript-eslint/no-explicit-any */
import { databases, ID, Query, DATABASE_ID, INVOICES_COLLECTION_ID } from '@/lib/appwrite.config';

export interface Invoice {
  $id?: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  vat: number;
  vatAmount: number;
  total: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid';
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export class InvoiceService {
  async createInvoice(invoiceData: Omit<Invoice, '$id' | 'createdAt' | 'updatedAt'>) {
    try {
      const document = await databases.createDocument(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        ID.unique(),
        invoiceData
      );
      
      return { data: document, error: null };
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      return { data: null, error: error.message || 'Failed to create invoice' };
    }
  }

  // Get all invoices for a user
  async getUserInvoices(userId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );
      
      return { data: response.documents, error: null };
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      return { data: null, error: error.message || 'Failed to fetch invoices' };
    }
  }

  // Get single invoice
  async getInvoice(invoiceId: string) {
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        invoiceId
      );
      
      return { data: document, error: null };
    } catch (error: any) {
      console.error('Error fetching invoice:', error);
      return { data: null, error: error.message || 'Failed to fetch invoice' };
    }
  }

async updateInvoice(invoiceId: string, data: Partial<Invoice>) {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      INVOICES_COLLECTION_ID,
      invoiceId,
      data
    );
    return { data: response, error: null };
  } catch (error: any) {
    console.error("Error updating invoice:", error);
    return { data: null, error: error.message || "Failed to update invoice" };
  }
}

async deleteInvoice(invoiceId: string) {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      INVOICES_COLLECTION_ID,
      invoiceId
    );
    return { error: null };
  } catch (error: any) {
    console.error("Error deleting invoice:", error);
    return { error: error.message || "Failed to delete invoice" };
  }
}

  // Get invoices by status
  async getInvoicesByStatus(userId: string, status: 'Paid' | 'Unpaid') {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.equal('status', status),
          Query.orderDesc('$createdAt')
        ]
      );
      
      return { data: response.documents, error: null };
    } catch (error: any) {
      console.error('Error fetching invoices by status:', error);
      return { data: null, error: error.message };
    }
  }

  async calculateTotals(userId: string) {
    try {
      const { data: allInvoices } = await this.getUserInvoices(userId);
      
      if (!allInvoices) return null;

      const totalInvoice = allInvoices.reduce((sum, inv: any) => sum + inv.total, 0);
      const amountPaid = allInvoices
        .filter((inv: any) => inv.status === 'Paid')
        .reduce((sum, inv: any) => sum + inv.total, 0);
      const pendingPayment = allInvoices
        .filter((inv: any) => inv.status === 'Unpaid')
        .reduce((sum, inv: any) => sum + inv.total, 0);
      const totalVAT = allInvoices.reduce((sum, inv: any) => sum + inv.vatAmount, 0);

      return {
        totalInvoice,
        amountPaid,
        pendingPayment,
        totalVAT,
        invoiceCount: allInvoices.length,
      };
    } catch (error: any) {
      console.error('Error calculating totals:', error);
      return null;
    }
  }
}

export const invoiceService = new InvoiceService();