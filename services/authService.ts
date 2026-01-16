import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  credits: number;
  is_subscribed: boolean;
  is_admin: boolean;
  subscription_plan?: string;
  subscription_end_date?: string;
  trial_used_presentation: boolean;
  trial_used_sheet: boolean;
}

export const authService = {
  // Sign in with Google
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user profile
  async getCurrentProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  // Deduct credits
  async deductCredits(userId: string, amount: number = 1) {
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
      
    if (fetchError || !profile) throw new Error('Could not fetch user credits');
    
    if (profile.credits < amount) return false;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - amount })
      .eq('id', userId);

    if (updateError) throw updateError;
    return true;
  },

  // Log Activity
  async logActivity(userId: string, actionType: string, details: any) {
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action_type: actionType,
      details: details
    });
  },

  // Check and Mark Trial (for Presentation/Sheet)
  async checkAndMarkTrial(userId: string, feature: 'presentation' | 'sheet'): Promise<boolean> {
    const profile = await this.getCurrentProfile();
    if (!profile) return false;
    
    // If subscribed, always allow
    if (profile.is_subscribed) return true;

    // If not subscribed, check trial
    const trialKey = feature === 'presentation' ? 'trial_used_presentation' : 'trial_used_sheet';
    
    if (profile[trialKey]) {
      return false; // Trial already used
    }

    // Mark trial as used
    await supabase.from('profiles').update({ [trialKey]: true }).eq('id', userId);
    return true; // Use trial
  }
};

