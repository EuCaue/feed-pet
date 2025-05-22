'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../client';

type User = {
  email: string;
  name: string;
  id: string;
  is_12h: boolean;
  timezone: string;
};

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = await createClient()
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('name, email, id, is_12h, timezone')
        .eq('id', user.id)
        .single();

      if (!error && profile) {
        setUser(profile as User);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  return { user, loading };
}
