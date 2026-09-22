import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, ApplicationRecord, ContactRecord } from '../lib/supabase';
import { WorkshopEvent, LeadershipMember } from '../types';
import {
  WORKSHOP_EVENTS as defaultEvents,
  STUDENT_OFFICERS,
  FACULTY_COUNCIL,
  CORE_WORKING_COMMITTEE,
  HONORED_GUESTS,
} from '../data';

const initialLeadership: LeadershipMember[] = [
  ...STUDENT_OFFICERS,
  ...FACULTY_COUNCIL,
  ...CORE_WORKING_COMMITTEE,
  ...HONORED_GUESTS,
];

interface DataContextType {
  events: WorkshopEvent[];
  leadership: LeadershipMember[];
  applications: ApplicationRecord[];
  inquiries: ContactRecord[];
  isSupabaseConnected: boolean;
  isLoadingApplications: boolean;

  // Applications
  addApplication: (app: Omit<ApplicationRecord, 'id' | 'created_at'>) => Promise<{ success: boolean; id?: string }>;
  deleteApplication: (id: string) => Promise<void>;
  updateApplicationStatus: (id: string, status: string) => Promise<void>;
  refreshApplications: () => Promise<void>;

  // Events management
  updateEvent: (id: string, updated: Partial<WorkshopEvent>) => void;
  addEvent: (event: WorkshopEvent) => void;
  deleteEvent: (id: string) => void;
  reorderEvents: (startIndex: number, endIndex: number) => void;

  // Leadership management
  updateLeader: (id: string, updated: Partial<LeadershipMember>) => void;
  addLeader: (leader: LeadershipMember) => void;
  deleteLeader: (id: string) => void;
  reorderLeadership: (startIndex: number, endIndex: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<WorkshopEvent[]>(defaultEvents);
  const [leadership, setLeadership] = useState<LeadershipMember[]>(initialLeadership);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [inquiries, setInquiries] = useState<ContactRecord[]>([]);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState<boolean>(false);

  // Sync CMS collections to Supabase club_content
  const syncContentToSupabase = useCallback(async (key: string, value: unknown) => {
    try {
      await supabase.from('club_content').upsert(
        {
          key,
          value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );
    } catch (err) {
      console.warn(`[Supabase CMS Sync] Error syncing ${key}:`, err);
    }
  }, []);

  // Fetch applications
  const refreshApplications = useCallback(async () => {
    setIsLoadingApplications(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] Applications fetch notice:', error.message);
        setIsSupabaseConnected(false);
        return;
      }

      setIsSupabaseConnected(true);
      if (data) {
        setApplications(
          data.map((row) => ({
            id: row.id,
            name: row.name || 'Anonymous Applicant',
            email: row.email || '',
            usn: row.usn || '',
            year: row.year || '',
            department: row.department || '',
            track: row.track || 'General',
            interest: row.interest || '',
            statement: row.statement || '',
            phone: row.phone || '',
            status: row.status || 'approved',
            created_at: row.created_at
              ? new Date(row.created_at).toLocaleString()
              : new Date().toLocaleString(),
          }))
        );
      }
    } catch (err) {
      console.warn('[Supabase] Could not query applications:', err);
      setIsSupabaseConnected(false);
    } finally {
      setIsLoadingApplications(false);
    }
  }, []);

  // Fetch CMS content
  const refreshCMSContent = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('club_content').select('*');
      if (!error && data && data.length > 0) {
        data.forEach((row: { key: string; value: unknown }) => {
          if (row.key === 'events' && Array.isArray(row.value)) setEvents(row.value as WorkshopEvent[]);
          if (row.key === 'leadership' && Array.isArray(row.value)) setLeadership(row.value as LeadershipMember[]);
        });
      }
    } catch (err) {
      console.warn('[Supabase] Club content sync notice:', err);
    }
  }, []);

  // Real-time listener
  useEffect(() => {
    refreshApplications();
    refreshCMSContent();

    const channel = supabase
      .channel('agentblazer-applications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        () => {
          refreshApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshApplications, refreshCMSContent]);

  // Add application
  const addApplication = async (
    app: Omit<ApplicationRecord, 'id' | 'created_at'>
  ): Promise<{ success: boolean; id?: string }> => {
    const tempId = `AB-${Date.now()}`;
    const optimistic: ApplicationRecord = {
      ...app,
      id: tempId,
      created_at: new Date().toLocaleString(),
    };
    setApplications((prev) => [optimistic, ...prev]);

    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            name: app.name,
            email: app.email,
            usn: app.usn || '',
            year: app.year || '',
            department: app.department || '',
            track: app.track || '',
            interest: app.interest || '',
            statement: app.statement || '',
            phone: app.phone || '',
            status: app.status || 'approved',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setApplications((prev) =>
          prev.map((a) => (a.id === tempId ? { ...a, id: data.id } : a))
        );
        return { success: true, id: data.id };
      }
      return { success: true, id: tempId };
    } catch (err) {
      console.warn('[Supabase] Error inserting application:', err);
      return { success: true, id: tempId };
    }
  };

  // Delete application
  const deleteApplication = async (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    try {
      await supabase.from('applications').delete().eq('id', id);
    } catch (err) {
      console.warn('[Supabase] Error deleting application:', err);
    }
  };

  // Update status
  const updateApplicationStatus = async (id: string, status: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    try {
      await supabase.from('applications').update({ status }).eq('id', id);
    } catch (err) {
      console.warn('[Supabase] Error updating application status:', err);
    }
  };

  // Events methods
  const updateEvent = (id: string, updated: Partial<WorkshopEvent>) => {
    setEvents((prev) => {
      const next = prev.map((ev) => (ev.id === id ? { ...ev, ...updated } : ev));
      syncContentToSupabase('events', next);
      return next;
    });
  };

  const addEvent = (event: WorkshopEvent) => {
    setEvents((prev) => {
      const next = [event, ...prev];
      syncContentToSupabase('events', next);
      return next;
    });
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => {
      const next = prev.filter((ev) => ev.id !== id);
      syncContentToSupabase('events', next);
      return next;
    });
  };

  const reorderEvents = (startIndex: number, endIndex: number) => {
    setEvents((prev) => {
      const list = [...prev];
      const [removed] = list.splice(startIndex, 1);
      list.splice(endIndex, 0, removed);
      syncContentToSupabase('events', list);
      return list;
    });
  };

  // Leadership methods
  const updateLeader = (id: string, updated: Partial<LeadershipMember>) => {
    setLeadership((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, ...updated } : l));
      syncContentToSupabase('leadership', next);
      return next;
    });
  };

  const addLeader = (leader: LeadershipMember) => {
    setLeadership((prev) => {
      const next = [leader, ...prev];
      syncContentToSupabase('leadership', next);
      return next;
    });
  };

  const deleteLeader = (id: string) => {
    setLeadership((prev) => {
      const next = prev.filter((l) => l.id !== id);
      syncContentToSupabase('leadership', next);
      return next;
    });
  };

  const reorderLeadership = (startIndex: number, endIndex: number) => {
    setLeadership((prev) => {
      const list = [...prev];
      const [removed] = list.splice(startIndex, 1);
      list.splice(endIndex, 0, removed);
      syncContentToSupabase('leadership', list);
      return list;
    });
  };

  return (
    <DataContext.Provider
      value={{
        events,
        leadership,
        applications,
        inquiries,
        isSupabaseConnected,
        isLoadingApplications,
        addApplication,
        deleteApplication,
        updateApplicationStatus,
        refreshApplications,
        updateEvent,
        addEvent,
        deleteEvent,
        reorderEvents,
        updateLeader,
        addLeader,
        deleteLeader,
        reorderLeadership,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
