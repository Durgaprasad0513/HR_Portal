import prisma from '../../config/database';
import { DocumentType } from '@prisma/client';
import crypto from 'crypto';

export class DocumentService {
  async upload(currentUser: any, file: Express.Multer.File, data: any, reqContext: { ipAddress?: string }) {
    // Quarantine/Scanning simulation: in a real app, send to virus scanner.
    // For Gate 1, we just save the path and log it.
    
    // Retention state: We store it locally in an uploads folder
    const doc = await prisma.employeeDocument.create({
      data: {
        documentType: data.documentType,
        documentName: data.documentName,
        employeeId: data.employeeId,
        uploadedById: currentUser.userId,
        filePath: file.path,
      }
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'UPLOAD_DOCUMENT',
        moduleAffected: 'employees',
        recordIdAffected: doc.id,
        userId: currentUser.userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return doc;
  }

  async getEmployeeDocuments(employeeId: string, currentUser: any, reqContext: { ipAddress?: string }) {
    // If SELF scope, user can only see their own. If HR/Admin, can see all.
    if (currentUser.role === 'EMPLOYEE' && currentUser.employeeId !== employeeId) {
      throw new Error('Not authorized to view these documents');
    }

    const docs = await prisma.employeeDocument.findMany({
      where: { employeeId },
      orderBy: { uploadDate: 'desc' }
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'VIEW_DOCUMENTS_LIST',
        moduleAffected: 'employees',
        recordIdAffected: employeeId,
        userId: currentUser.userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return docs;
  }

  async generateDownloadLink(documentId: string, currentUser: any, reqContext: { ipAddress?: string }) {
    const doc = await prisma.employeeDocument.findUnique({ where: { id: documentId } });
    if (!doc) throw new Error('Document not found');

    if (currentUser.role === 'EMPLOYEE' && currentUser.employeeId !== doc.employeeId) {
      throw new Error('Not authorized to download this document');
    }

    // Short-lived download simulation: generate a unique hash for the download URL
    const token = crypto.randomBytes(16).toString('hex');
    
    await prisma.auditLog.create({
      data: {
        actionPerformed: 'DOWNLOAD_DOCUMENT',
        moduleAffected: 'employees',
        recordIdAffected: documentId,
        userId: currentUser.userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return { downloadUrl: `/api/employees/documents/download/${documentId}?token=${token}` };
  }
}

export const documentService = new DocumentService();
