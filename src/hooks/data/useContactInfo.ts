import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface ContactData {
  phone: string;
  email: string;
  address: string;
}

interface ContactInfoData extends ContactData {
  notes: string;
  userId: string;
}

interface UseContactInfoProps {
  userId?: string;
  initialData?: Partial<ContactInfoData>;
}

export const useContactInfo = ({ userId, initialData }: UseContactInfoProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Contact data state
  const [contactData, setContactData] = useState<ContactInfoData>({
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    notes: initialData?.notes || '',
    userId: userId || '',
  });

  // Save contact information
  const saveContact = useCallback(async (data: ContactData) => {
    if (!userId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin người dùng",
        variant: "destructive",
      });
      return false;
    }

    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/contacts/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save contact');
      }

      // Update local state
      setContactData(prev => ({ ...prev, ...data }));
      
      toast({
        title: "Thành công",
        description: "Đã lưu thông tin liên hệ",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving contact:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin liên hệ",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [userId]);

  // Save notes
  const saveNotes = useCallback(async (notes: string) => {
    if (!userId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin người dùng",
        variant: "destructive",
      });
      return false;
    }

    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/contacts/${userId}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }

      // Update local state
      setContactData(prev => ({ ...prev, notes }));
      
      toast({
        title: "Thành công",
        description: "Đã lưu ghi chú",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu ghi chú",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [userId]);

  // Send email
  const sendEmail = useCallback(async () => {
    if (!contactData.email) {
      toast({
        title: "Lỗi",
        description: "Không có địa chỉ email",
        variant: "destructive",
      });
      return false;
    }

    try {
      // TODO: Replace with actual email service integration
      console.log('Opening email client for:', contactData.email);
      
      // For now, just open the default email client
      window.location.href = `mailto:${contactData.email}`;
      
      toast({
        title: "Thành công",
        description: "Đã mở ứng dụng email",
      });
      
      return true;
    } catch (error) {
      console.error('Error opening email:', error);
      toast({
        title: "Lỗi",
        description: "Không thể mở ứng dụng email",
        variant: "destructive",
      });
      return false;
    }
  }, [contactData.email]);

  // Add staff member
  const addStaff = useCallback(async () => {
    if (!userId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin người dùng",
        variant: "destructive",
      });
      return false;
    }

    try {
      // TODO: Replace with actual API call
      console.log('Adding staff member for user:', userId);
      
      toast({
        title: "Thành công",
        description: "Đã thêm nhân viên vào cuộc trò chuyện",
      });
      
      return true;
    } catch (error) {
      console.error('Error adding staff:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm nhân viên",
        variant: "destructive",
      });
      return false;
    }
  }, [userId]);

  // Load contact data
  const loadContactData = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/contacts/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load contact data');
      }

      const data = await response.json();
      setContactData(prev => ({ ...prev, ...data }));
      
      return data;
    } catch (error) {
      console.error('Error loading contact data:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin liên hệ",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    contactData,
    isLoading,
    isSaving,
    
    // Actions
    saveContact,
    saveNotes,
    sendEmail,
    addStaff,
    loadContactData,
    
    // Utilities
    setContactData,
  };
};
