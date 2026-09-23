import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, ApplicationRecord, ContactRecord } from '../lib/supabase';
import { WorkshopEvent, LeadershipMember, MailSettings, ScheduledEmail, ContactDetail } from '../types';
import {
  WORKSHOP_EVENTS as defaultEvents,
  STUDENT_OFFICERS,
  FACULTY_COUNCIL,
  CORE_WORKING_COMMITTEE,
  HONORED_GUESTS,
} from '../data';

export const DEFAULT_MAIL_SETTINGS: MailSettings = {
  clubEmail: 'agentblazer@sjec.ac.in',
  senderName: 'AgentBlazer Club Executive Council',
  delayHours: 24,
  acceptSubject: '🎉 Congratulations! Your AgentBlazer Club Application is Accepted',
  acceptBody: `Dear {name},

We are thrilled to inform you that your application for the AgentBlazer Club ({track}) has been officially ACCEPTED!

Your credentials and orientation summary:
- Member Name: {name}
- USN: {usn}
- Track / Division: {track}
- Official Club Contact: {club_email}

Our executive team will reach out with the onboarding schedule and access to our technical repository. Welcome aboard!

Warm regards,
AgentBlazer Club Executive Council
Department of Computer Science & Engineering
St Joseph Engineering College, Mangaluru`,
  shortlistSubject: '📋 Update: You Have Been Shortlisted for AgentBlazer Club Interview',
  shortlistBody: `Dear {name},

Thank you for applying to the AgentBlazer Club at SJEC CSE.

We are pleased to inform you that your profile has been SHORTLISTED for the next round of technical interviews and cohort discussions.

Application Details:
- Candidate Name: {name}
- USN: {usn}
- Selected Track: {track}
- Inquiries: {club_email}

Please keep an eye on your inbox for interview slots and lab round details.

Best wishes,
AgentBlazer Technical Council
SJEC CSE Department`,
};

export const DEFAULT_CONTACT_DETAILS: ContactDetail[] = [
  {
    id: 'contact-dept-email',
    title: 'Official Club Inquiries',
    type: 'email',
    value: 'agentblazer@sjec.ac.in',
    description: 'Direct email channel for membership and event communications.',
    isPrimary: true,
  },
  {
    id: 'contact-campus-location',
    title: 'Department Secretariat & Lab',
    type: 'location',
    value: 'Department of Computer Science & Engineering, SJEC Campus, Vamanjoor, Mangaluru - 575028',
    description: 'CSE Systems Lab 3 & Academic Block 2.',
    isPrimary: true,
  },
  {
    id: 'contact-faculty-coord',
    title: 'Faculty Advisory Desk',
    type: 'office',
    value: 'Ms. Nisha Roche & Mr. Keith Fernandes (Assistant Professors, CSE)',
    description: 'Office hours: Mon-Fri, 9:00 AM - 4:30 PM.',
    isPrimary: false,
  },
  {
    id: 'contact-student-council',
    title: 'Salesforce Trailblazer Community',
    type: 'social',
    value: 'https://trailhead.salesforce.com/agentblazer',
    description: 'Salesforce Trailblazer Community & Student Forum.',
    isPrimary: false,
  },
];

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

  // Mail settings & queue
  mailSettings: MailSettings;
  scheduledEmails: ScheduledEmail[];
  updateMailSettings: (settings: Partial<MailSettings>) => void;
  scheduleApplicationEmail: (
    applicationId: string,
    applicantName: string,
    recipientEmail: string,
    type: 'accept' | 'shortlist',
    customVars?: { usn?: string; track?: string }
  ) => void;
  cancelScheduledEmail: (applicationId: string) => void;
  dispatchScheduledEmailNow: (emailId: string) => void;

  // Contact details
  contactDetails: ContactDetail[];
  addContactDetail: (contact: ContactDetail) => void;
  updateContactDetail: (id: string, updated: Partial<ContactDetail>) => void;
  deleteContactDetail: (id: string) => void;

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
  const [mailSettings, setMailSettings] = useState<MailSettings>(DEFAULT_MAIL_SETTINGS);
  const [scheduledEmails, setScheduledEmails] = useState<ScheduledEmail[]>([]);
  const [contactDetails, setContactDetails] = useState<ContactDetail[]>(DEFAULT_CONTACT_DETAILS);

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
          if (row.key === 'mail_settings' && row.value && typeof row.value === 'object') {
            setMailSettings({ ...DEFAULT_MAIL_SETTINGS, ...(row.value as MailSettings) });
          }
          if (row.key === 'scheduled_emails' && Array.isArray(row.value)) {
            setScheduledEmails(row.value as ScheduledEmail[]);
          }
          if (row.key === 'contact_details' && Array.isArray(row.value)) {
            setContactDetails(row.value as ContactDetail[]);
          }
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

  // Mail settings methods
  const updateMailSettings = useCallback(
    (settings: Partial<MailSettings>) => {
      setMailSettings((prev) => {
        const next = { ...prev, ...settings, updatedAt: new Date().toISOString() };
        syncContentToSupabase('mail_settings', next);
        return next;
      });
    },
    [syncContentToSupabase]
  );

  const scheduleApplicationEmail = useCallback(
    (
      applicationId: string,
      applicantName: string,
      recipientEmail: string,
      type: 'accept' | 'shortlist',
      customVars?: { usn?: string; track?: string }
    ) => {
      setScheduledEmails((prev) => {
        const filtered = prev.filter((e) => e.applicationId !== applicationId);
        const delayMs = (mailSettings.delayHours || 24) * 3600 * 1000;
        const scheduledFor = new Date(Date.now() + delayMs).toISOString();

        const rawSubject =
          type === 'accept' ? mailSettings.acceptSubject : mailSettings.shortlistSubject;
        const rawBody =
          type === 'accept' ? mailSettings.acceptBody : mailSettings.shortlistBody;

        const usn = customVars?.usn || 'N/A';
        const track = customVars?.track || 'Agentic AI Systems';

        const subject = rawSubject
          .replace(/{name}/g, applicantName)
          .replace(/{usn}/g, usn)
          .replace(/{track}/g, track)
          .replace(/{club_email}/g, mailSettings.clubEmail);

        const body = rawBody
          .replace(/{name}/g, applicantName)
          .replace(/{usn}/g, usn)
          .replace(/{track}/g, track)
          .replace(/{club_email}/g, mailSettings.clubEmail);

        const newEmail: ScheduledEmail = {
          id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          applicationId,
          applicantName,
          recipientEmail,
          type,
          subject,
          body,
          senderEmail: mailSettings.clubEmail,
          scheduledFor,
          status: 'scheduled',
          createdAt: new Date().toISOString(),
        };

        const next = [newEmail, ...filtered];
        syncContentToSupabase('scheduled_emails', next);
        return next;
      });
    },
    [mailSettings, syncContentToSupabase]
  );

  const cancelScheduledEmail = useCallback(
    (applicationId: string) => {
      setScheduledEmails((prev) => {
        const next = prev.filter((e) => e.applicationId !== applicationId);
        syncContentToSupabase('scheduled_emails', next);
        return next;
      });
    },
    [syncContentToSupabase]
  );

  const dispatchScheduledEmailNow = useCallback(
    (emailId: string) => {
      setScheduledEmails((prev) => {
        const next = prev.map((e) =>
          e.id === emailId ? { ...e, status: 'sent' as const, scheduledFor: new Date().toISOString() } : e
        );
        syncContentToSupabase('scheduled_emails', next);
        return next;
      });
    },
    [syncContentToSupabase]
  );

  // Contact details methods
  const addContactDetail = useCallback(
    (contact: ContactDetail) => {
      setContactDetails((prev) => {
        const next = [...prev, contact];
        syncContentToSupabase('contact_details', next);
        return next;
      });
    },
    [syncContentToSupabase]
  );

  const updateContactDetail = useCallback(
    (id: string, updated: Partial<ContactDetail>) => {
      setContactDetails((prev) => {
        const next = prev.map((c) => (c.id === id ? { ...c, ...updated } : c));
        syncContentToSupabase('contact_details', next);
        return next;
      });
    },
    [syncContentToSupabase]
  );

  const deleteContactDetail = useCallback(
    (id: string) => {
      setContactDetails((prev) => {
        const next = prev.filter((c) => c.id !== id);
        syncContentToSupabase('contact_details', next);
        return next;
      });
    },
    [syncContentToSupabase]
  );

  return (
    <DataContext.Provider
      value={{
        events,
        leadership,
        applications,
        inquiries,
        isSupabaseConnected,
        isLoadingApplications,
        mailSettings,
        scheduledEmails,
        updateMailSettings,
        scheduleApplicationEmail,
        cancelScheduledEmail,
        dispatchScheduledEmailNow,
        contactDetails,
        addContactDetail,
        updateContactDetail,
        deleteContactDetail,
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
