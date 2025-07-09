"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextEditor } from '@/components/dashboard/text-editor';
import { TreeNode } from '@/components/dashboard/tables/tree-helpers';
import { Resource } from '@/hooks/data/useResource';
import useTranslations from '@/hooks/useTranslations';

interface DocumentViewerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  document: TreeNode | null;
  resourceDetail?: Resource | null;
  isLoading?: boolean;
  onSave?: (document: TreeNode, content: string) => void;
}

export const DocumentViewerDialog: React.FC<DocumentViewerDialogProps> = ({
  isOpen,
  onOpenChange,
  document,
  resourceDetail,
  isLoading = false,
  onSave,
}) => {
  const { t } = useTranslations();
  
  // Get content from resourceDetail or use default content based on document type
  const getDocumentContent = () => {
    // If we have resourceDetail with content, use it
    if (resourceDetail?.content) {
      return resourceDetail.content;
    }
    
    // If we have resourceDetail but no content, use resourceDetail info
    if (resourceDetail) {
      return `<h1>${resourceDetail.name}</h1><p><strong>Description:</strong> ${resourceDetail.description || 'No description available'}</p><p><strong>Type:</strong> ${resourceDetail.type}</p><p><strong>Status:</strong> ${resourceDetail.status}</p><p>This document's content will be loaded from the server. You can edit this content using the editor above.</p>`;
    }
    
    // Fallback content if no resourceDetail is available
    if (!document) return '';
    
    switch (document.type?.toLowerCase()) {
      case 'pdf':
        return `<h1>${document.name}</h1><p>This is a PDF document content. The actual content would be loaded from the server.</p><p><strong>Document ID:</strong> ${document.id}</p>`;
      case 'txt':
      case 'doc':
      case 'docx':
        return `<h1>${document.name}</h1><p>This is the text content of the document. The actual content would be fetched from your backend API.</p><p><strong>Description:</strong> ${document.description || 'No description available'}</p>`;
      default:
        return `<h1>${document.name}</h1><p>Document content for file type (${document.type}) would be loaded here.</p>`;
    }
  };
  
  const documentContent = getDocumentContent();
  const [editedContent, setEditedContent] = useState(documentContent);
  const [isEditing, setIsEditing] = useState(false);

  // Update edited content when documentContent changes
  useEffect(() => {
    setEditedContent(documentContent);
  }, [documentContent]);

  const handleSave = () => {
    if (document && onSave) {
      onSave(document, editedContent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(documentContent);
    setIsEditing(false);
  };

  const handleClose = () => {
    if (isEditing) {
      setEditedContent(documentContent);
      setIsEditing(false);
    }
    onOpenChange(false);
  };

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center justify-between">
            <span>
              {isEditing ? 'Edit' : t("dashboard.departments.detail.viewResource")} - {resourceDetail?.name || document?.name}
            </span>
            {!isEditing && !isLoading && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading document details...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Document metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("dashboard.departments.detail.fileName")}
                  </label>
                  <p className="text-sm">{resourceDetail?.name || document?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("dashboard.departments.detail.documentType")}
                  </label>
                  <p className="text-sm">{resourceDetail?.type || document?.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("dashboard.departments.detail.status")}
                  </label>
                  <p className="text-sm">{resourceDetail?.status || document?.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("dashboard.departments.detail.uploadTime")}
                  </label>
                  <p className="text-sm">
                    {(resourceDetail?.createdAt || document?.createdAt)
                      ? new Date(resourceDetail?.createdAt || document?.createdAt || '').toLocaleDateString()
                      : '-'
                    }
                  </p>
                </div>
              </div>

              {/* Document description */}
              {(resourceDetail?.description || document?.description) && (
                <div className="p-4 bg-blue-50 rounded-md">
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    {t("dashboard.departments.detail.description")}
                  </label>
                  <p className="text-sm">{resourceDetail?.description || document?.description}</p>
                </div>
              )}

              {/* Document content */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Document Content
                </label>
                {isEditing ? (
                  <TextEditor
                    initialContent={editedContent}
                    onChange={setEditedContent}
                    placeholder="Enter document content..."
                    className="min-h-[300px]"
                  />
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b text-sm text-gray-600">
                      <strong>Read-only mode</strong> - Click &quot;Edit&quot; above to modify this content
                    </div>
                    <div 
                      className="min-h-[300px] p-4 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: editedContent }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {isEditing && (
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewerDialog;
