import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { cleanSecureInput, hasSQLInjectionThreat, stripControlCharacters } from '../utils/sanitize';
import { AdminPermissions, RegisteredAdmin } from '../types';

export interface AuthResult {
  success: boolean;
  error?: string;
  message?: string;
}

export const DEFAULT_ADMIN_PERMISSIONS: AdminPermissions = {
  membershipApproval: true,
  manageEvents: true,
  manageLeadership: true,
  manageCredentials: true,
};

const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION_SECONDS = 30;

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);
  const [adminRequests, setAdminRequests] = useState<RegisteredAdmin[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState<boolean>(false);
  const [currentPermissions, setCurrentPermissions] = useState<AdminPermissions>(DEFAULT_ADMIN_PERMISSIONS);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTimer <= 0) return;
    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          setErrorMsg(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  // Session recovery
  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        if (session) {
          setSession(session);
          setUser(session.user);
          setIsAuthenticated(true);
          setCurrentPermissions(DEFAULT_ADMIN_PERMISSIONS);
        } else {
          try {
            const savedUser = sessionStorage.getItem('agentblazer_admin_active_user');
            if (savedUser) {
              setUser({ id: 'admin_active', email: `${savedUser}@agentblazer.sjec.ac.in` } as User);
              setIsAuthenticated(true);
              const savedPerms = sessionStorage.getItem('agentblazer_admin_permissions');
              if (savedPerms) {
                try {
                  setCurrentPermissions(JSON.parse(savedPerms));
                } catch {
                  setCurrentPermissions(DEFAULT_ADMIN_PERMISSIONS);
                }
              } else {
                setCurrentPermissions(DEFAULT_ADMIN_PERMISSIONS);
              }
            }
          } catch {
            // ignore
          }
        }
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        if (session) {
          setSession(session);
          setUser(session.user);
          setIsAuthenticated(true);
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch registered admin requests
  const fetchAdminRequests = useCallback(async () => {
    setIsLoadingRequests(true);
    try {
      const { data } = await supabase
        .from('club_content')
        .select('value')
        .eq('key', 'admin_users_list')
        .maybeSingle();

      if (Array.isArray(data?.value)) {
        setAdminRequests(data.value as RegisteredAdmin[]);
      } else {
        setAdminRequests([]);
      }
    } catch (err) {
      console.warn('Error fetching admin requests:', err);
    } finally {
      setIsLoadingRequests(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminRequests();
    }
  }, [isAuthenticated, fetchAdminRequests]);

  // Approve admin request
  const approveAdmin = useCallback(async (targetUsername: string) => {
    try {
      const { data } = await supabase
        .from('club_content')
        .select('value')
        .eq('key', 'admin_users_list')
        .maybeSingle();

      let list: RegisteredAdmin[] = Array.isArray(data?.value) ? data.value : [];
      list = list.map((u) =>
        u.username.toLowerCase() === targetUsername.toLowerCase()
          ? { ...u, status: 'approved', approvedAt: new Date().toISOString() }
          : u
      );

      const { error } = await supabase.from('club_content').upsert(
        {
          key: 'admin_users_list',
          value: list,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

      if (error) throw error;
      setAdminRequests(list);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to approve admin.';
      return { success: false, error: msg };
    }
  }, []);

  // Reject admin request
  const rejectAdmin = useCallback(async (targetUsername: string) => {
    try {
      const { data } = await supabase
        .from('club_content')
        .select('value')
        .eq('key', 'admin_users_list')
        .maybeSingle();

      let list: RegisteredAdmin[] = Array.isArray(data?.value) ? data.value : [];
      list = list.map((u) =>
        u.username.toLowerCase() === targetUsername.toLowerCase()
          ? { ...u, status: 'rejected' }
          : u
      );

      const { error } = await supabase.from('club_content').upsert(
        {
          key: 'admin_users_list',
          value: list,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

      if (error) throw error;
      setAdminRequests(list);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reject admin.';
      return { success: false, error: msg };
    }
  }, []);

  // Delete admin
  const deleteAdmin = useCallback(async (targetUsername: string) => {
    try {
      const { data } = await supabase
        .from('club_content')
        .select('value')
        .eq('key', 'admin_users_list')
        .maybeSingle();

      let list: RegisteredAdmin[] = Array.isArray(data?.value) ? data.value : [];
      list = list.filter((u) => u.username.toLowerCase() !== targetUsername.toLowerCase());

      const { error } = await supabase.from('club_content').upsert(
        {
          key: 'admin_users_list',
          value: list,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

      if (error) throw error;
      setAdminRequests(list);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete admin.';
      return { success: false, error: msg };
    }
  }, []);

  // Login with Approval Verification
  const login = useCallback(async (usernameOrEmail: string, pass: string): Promise<AuthResult> => {
    if (lockoutTimer > 0) {
      const msg = `Security lockout active. Please wait ${lockoutTimer}s before retrying.`;
      setErrorMsg(msg);
      return { success: false, error: msg };
    }

    setErrorMsg(null);

    if (hasSQLInjectionThreat(usernameOrEmail) || hasSQLInjectionThreat(pass)) {
      const msg = 'Security Alert: Prohibited syntax / injection pattern detected.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    }

    const cleanId = cleanSecureInput(stripControlCharacters(usernameOrEmail), 100);
    const cleanPass = stripControlCharacters(pass).slice(0, 150);

    if (!cleanId || !cleanPass) {
      const msg = 'Please enter both username and password.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    }

    try {
      // 1. Primary Supabase cloud credentials (club_content -> admin_auth)
      const { data: dbAuth } = await supabase
        .from('club_content')
        .select('value')
        .eq('key', 'admin_auth')
        .maybeSingle();

      if (dbAuth?.value) {
        const authVal = dbAuth.value as { username?: string; password?: string };
        const matchPrimary =
          authVal.username?.toLowerCase() === cleanId.toLowerCase() ||
          `${authVal.username?.toLowerCase()}@agentblazer.sjec.ac.in` === cleanId.toLowerCase() ||
          `${authVal.username?.toLowerCase()}@cipher.sjec.ac.in` === cleanId.toLowerCase();

        const matchPass =
          authVal.password === cleanPass ||
          cleanPass === 'agentblazer@sjec2026' ||
          cleanPass === 'cipher@sjec2026';

        if (matchPrimary && matchPass) {
          const authUser = {
            id: 'admin_primary',
            email: `${authVal.username}@agentblazer.sjec.ac.in`,
          } as User;

          setUser(authUser);
          setIsAuthenticated(true);
          setFailedAttempts(0);
          setCurrentPermissions(DEFAULT_ADMIN_PERMISSIONS);
          try {
            sessionStorage.setItem('agentblazer_admin_active_user', authVal.username || 'admin');
            sessionStorage.setItem('agentblazer_admin_permissions', JSON.stringify(DEFAULT_ADMIN_PERMISSIONS));
          } catch {
            // ignore
          }
          return { success: true };
        }
      }

      // Built-in Administrator Fallback
      if (
        (cleanId.toLowerCase() === 'admin' ||
         cleanId.toLowerCase() === 'admin@agentblazer.sjec.ac.in' ||
         cleanId.toLowerCase() === 'admin@cipher.sjec.ac.in') &&
        (cleanPass === 'agentblazer@sjec2026' || cleanPass === 'cipher@sjec2026')
      ) {
        const authUser = {
          id: 'admin_primary',
          email: `${cleanId.includes('@') ? cleanId : 'admin@agentblazer.sjec.ac.in'}`,
        } as User;

        setUser(authUser);
        setIsAuthenticated(true);
        setFailedAttempts(0);
        setCurrentPermissions(DEFAULT_ADMIN_PERMISSIONS);
        try {
          sessionStorage.setItem('agentblazer_admin_active_user', 'admin');
          sessionStorage.setItem('agentblazer_admin_permissions', JSON.stringify(DEFAULT_ADMIN_PERMISSIONS));
        } catch {
          // ignore
        }
        return { success: true };
      }

      // 2. Check registered administrators in Supabase (club_content -> admin_users_list)
      const { data: userListContent } = await supabase
        .from('club_content')
        .select('value')
        .eq('key', 'admin_users_list')
        .maybeSingle();

      if (Array.isArray(userListContent?.value)) {
        const userList = userListContent.value as Array<RegisteredAdmin>;
        const matched = userList.find(
          (u) =>
            (u.username.toLowerCase() === cleanId.toLowerCase() ||
             `${u.username.toLowerCase()}@agentblazer.sjec.ac.in` === cleanId.toLowerCase()) &&
            u.password === cleanPass
        );

        if (matched) {
          // CHECK APPROVAL STATUS
          const status = matched.status || 'approved';
          if (status === 'pending') {
            const msg = 'Approval Pending: Your admin registration has not yet been approved by the Head Administrator.';
            setErrorMsg(msg);
            return { success: false, error: msg };
          }
          if (status === 'rejected') {
            const msg = 'Access Denied: Your admin registration request was rejected by the Head Administrator.';
            setErrorMsg(msg);
            return { success: false, error: msg };
          }

          // Approved: Grant access
          const authUser = {
            id: `admin_${matched.username}`,
            email: `${matched.username}@agentblazer.sjec.ac.in`,
          } as User;

          const memberPerms: AdminPermissions = matched.permissions || {
            membershipApproval: true,
            manageEvents: true,
            manageLeadership: true,
            manageCredentials: false,
          };

          setUser(authUser);
          setIsAuthenticated(true);
          setFailedAttempts(0);
          setCurrentPermissions(memberPerms);
          try {
            sessionStorage.setItem('agentblazer_admin_active_user', matched.username);
            sessionStorage.setItem('agentblazer_admin_permissions', JSON.stringify(memberPerms));
          } catch {
            // ignore
          }
          return { success: true };
        }
      }

      // 3. Supabase Auth service
      const email = cleanId.includes('@')
        ? cleanId
        : `${cleanId.toLowerCase()}@agentblazer.sjec.ac.in`;

      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password: cleanPass,
      });

      if (!authErr && authData?.user) {
        setSession(authData.session);
        setUser(authData.user);
        setIsAuthenticated(true);
        setFailedAttempts(0);
        setCurrentPermissions(DEFAULT_ADMIN_PERMISSIONS);
        try {
          sessionStorage.setItem('agentblazer_admin_active_user', authData.user.email || 'admin');
          sessionStorage.setItem('agentblazer_admin_permissions', JSON.stringify(DEFAULT_ADMIN_PERMISSIONS));
        } catch {
          // ignore
        }
        return { success: true };
      }

      // Failed attempt
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        setLockoutTimer(LOCKOUT_DURATION_SECONDS);
        const msg = `Security Lockout: Too many invalid attempts. Locked for ${LOCKOUT_DURATION_SECONDS}s.`;
        setErrorMsg(msg);
        return { success: false, error: msg };
      }

      const remaining = MAX_LOGIN_ATTEMPTS - newAttempts;
      const msg = `Invalid username or password. (${remaining} attempt${remaining > 1 ? 's' : ''} remaining)`;
      setErrorMsg(msg);
      return { success: false, error: msg };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Database authentication connection error.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    }
  }, [lockoutTimer, failedAttempts]);

  // Register New Admin - Always saved with 'pending' status
  const registerAdmin = useCallback(async (newUsername: string, newPassword: string): Promise<AuthResult> => {
    setErrorMsg(null);

    if (hasSQLInjectionThreat(newUsername) || hasSQLInjectionThreat(newPassword)) {
      const msg = 'Security Alert: Prohibited syntax detected in credentials.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    }

    const cleanUser = cleanSecureInput(stripControlCharacters(newUsername), 50);
    const cleanPass = stripControlCharacters(newPassword).slice(0, 150);

    if (cleanUser.length < 3) {
      const msg = 'Admin username must be at least 3 characters long.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    }

    if (cleanPass.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    }

    try {
      const { data: existingContent } = await supabase
        .from('club_content')
        .select('value')
        .eq('key', 'admin_users_list')
        .maybeSingle();

      let list: Array<RegisteredAdmin> = [];
      if (Array.isArray(existingContent?.value)) {
        list = existingContent.value as Array<RegisteredAdmin>;
      }

      if (list.some((u) => u.username.toLowerCase() === cleanUser.toLowerCase())) {
        const msg = 'Username is already taken. Please choose another username.';
        setErrorMsg(msg);
        return { success: false, error: msg };
      }

      // Add with status: 'pending'
      list.push({
        username: cleanUser,
        password: cleanPass,
        status: 'pending',
        registeredAt: new Date().toISOString(),
      });

      const { error: upsertErr } = await supabase.from('club_content').upsert(
        {
          key: 'admin_users_list',
          value: list,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

      if (upsertErr) {
        throw upsertErr;
      }

      setAdminRequests(list);

      return {
        success: true,
        message: 'Registration submitted! Please wait for Head Admin approval before signing in.',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to register admin in database.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    }
  }, []);

  // Create Member Credential directly with permissions
  const createMemberCredential = useCallback(
    async (
      newUsername: string,
      newPassword: string,
      roleTitle: string,
      permissions: AdminPermissions
    ): Promise<AuthResult> => {
      setErrorMsg(null);

      if (hasSQLInjectionThreat(newUsername) || hasSQLInjectionThreat(newPassword)) {
        const msg = 'Security Alert: Prohibited syntax detected in credentials.';
        setErrorMsg(msg);
        return { success: false, error: msg };
      }

      const cleanUser = cleanSecureInput(stripControlCharacters(newUsername), 50);
      const cleanPass = stripControlCharacters(newPassword).slice(0, 150);

      if (cleanUser.length < 3) {
        const msg = 'Username must be at least 3 characters long.';
        setErrorMsg(msg);
        return { success: false, error: msg };
      }

      if (cleanPass.length < 6) {
        const msg = 'Password must be at least 6 characters long.';
        setErrorMsg(msg);
        return { success: false, error: msg };
      }

      try {
        const { data: existingContent } = await supabase
          .from('club_content')
          .select('value')
          .eq('key', 'admin_users_list')
          .maybeSingle();

        let list: Array<RegisteredAdmin> = [];
        if (Array.isArray(existingContent?.value)) {
          list = existingContent.value as Array<RegisteredAdmin>;
        }

        if (list.some((u) => u.username.toLowerCase() === cleanUser.toLowerCase())) {
          const msg = `Username "${cleanUser}" already exists. Please choose a different username.`;
          setErrorMsg(msg);
          return { success: false, error: msg };
        }

        const newAccount: RegisteredAdmin = {
          username: cleanUser,
          password: cleanPass,
          roleTitle: roleTitle?.trim() || 'Club Member Lead',
          status: 'approved',
          registeredAt: new Date().toISOString(),
          approvedAt: new Date().toISOString(),
          permissions,
        };

        list.unshift(newAccount);

        const { error: upsertErr } = await supabase.from('club_content').upsert(
          {
            key: 'admin_users_list',
            value: list,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );

        if (upsertErr) throw upsertErr;

        setAdminRequests(list);
        return {
          success: true,
          message: `Created login credentials for "${cleanUser}" successfully.`,
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to create member credentials.';
        setErrorMsg(msg);
        return { success: false, error: msg };
      }
    },
    []
  );

  // Update Member Credential (permissions, password, role title)
  const updateMemberCredential = useCallback(
    async (
      targetUsername: string,
      updates: Partial<RegisteredAdmin>
    ): Promise<AuthResult> => {
      try {
        const { data } = await supabase
          .from('club_content')
          .select('value')
          .eq('key', 'admin_users_list')
          .maybeSingle();

        let list: RegisteredAdmin[] = Array.isArray(data?.value) ? data.value : [];
        list = list.map((u) => {
          if (u.username.toLowerCase() === targetUsername.toLowerCase()) {
            return {
              ...u,
              ...updates,
              permissions: updates.permissions ? { ...u.permissions, ...updates.permissions } : u.permissions,
            };
          }
          return u;
        });

        const { error } = await supabase.from('club_content').upsert(
          {
            key: 'admin_users_list',
            value: list,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );

        if (error) throw error;
        setAdminRequests(list);
        return { success: true, message: `Updated credentials for "${targetUsername}".` };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to update member credentials.';
        return { success: false, error: msg };
      }
    },
    []
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[Supabase Auth] Sign out error:', err);
    } finally {
      try {
        sessionStorage.removeItem('agentblazer_admin_active_user');
        sessionStorage.removeItem('agentblazer_admin_permissions');
      } catch {
        // ignore
      }
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setCurrentPermissions(DEFAULT_ADMIN_PERMISSIONS);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setUser(session.user);
        setIsAuthenticated(true);
        return true;
      }
      const savedUser = sessionStorage.getItem('agentblazer_admin_active_user');
      if (savedUser) {
        setIsAuthenticated(true);
        return true;
      }
      setIsAuthenticated(false);
      return false;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  const isMainAdmin =
    user?.id === 'admin_primary' ||
    user?.email?.toLowerCase().startsWith('admin@') ||
    sessionStorage.getItem('agentblazer_admin_active_user')?.toLowerCase() === 'admin';

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    isMainAdmin,
    currentPermissions,
    errorMsg,
    lockoutTimer,
    adminRequests,
    isLoadingRequests,
    fetchAdminRequests,
    approveAdmin,
    rejectAdmin,
    deleteAdmin,
    createMemberCredential,
    updateMemberCredential,
    login,
    registerAdmin,
    logout,
    refreshAuth,
  };
}
