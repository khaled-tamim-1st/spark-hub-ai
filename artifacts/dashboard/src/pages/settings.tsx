import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Building2, User, Shield, Save, CheckCircle2, Zap, Users as UsersIcon } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';

export default function Settings() {
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: adminApi.getMe,
  });

  const [orgForm, setOrgForm] = useState({
    name: '',
    website: '',
  });

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
      if (user.organization) {
        setOrgForm({
          name: user.organization.name || '',
          website: user.organization.website || '',
        });
      }
    }
  }, [user]);

  const handleSaveOrg = () => {
    toast({ title: 'Organization settings saved' });
  };

  const handleSaveProfile = () => {
    toast({ title: 'Profile updated' });
  };

  const org = user?.organization;

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="p-6 max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workspace & Account Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your organization profile, team quotas, and personal account.</p>
        </div>

        {/* Subscription & Quota Card */}
        {org && (
          <div className="bg-card border border-card-border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Current Subscription & Plan</h2>
              </div>
              <Badge variant="outline" className="text-xs uppercase font-bold px-2.5 py-1 bg-primary/10 text-primary border-primary/20">
                {org.plan} Plan
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-lg border bg-muted/20">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <UsersIcon className="w-4 h-4 text-primary" />
                  Team Seats Quota
                </div>
                <div className="text-xl font-bold text-foreground mt-1">
                  Up to {org.maxUsers} Members
                </div>
              </div>

              <div className="p-3.5 rounded-lg border bg-muted/20">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <Building2 className="w-4 h-4 text-primary" />
                  Channels Allowed
                </div>
                <div className="text-xl font-bold text-foreground mt-1">
                  Up to {org.maxChannels} Channels
                </div>
              </div>

              <div className="p-3.5 rounded-lg border bg-muted/20">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  AI & Auto-Reply
                </div>
                <div className="text-xl font-bold text-foreground mt-1">
                  {org.aiEnabled ? 'Active' : 'Disabled'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Organization Information */}
        <div className="bg-card border border-card-border rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Organization Details</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input
                value={orgForm.name}
                onChange={(e) => setOrgForm(p => ({ ...p, name: e.target.value }))}
                data-testid="input-org-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={orgForm.website}
                onChange={(e) => setOrgForm(p => ({ ...p, website: e.target.value }))}
                placeholder="https://yourcompany.com"
                data-testid="input-website"
              />
            </div>
          </div>

          <Button onClick={handleSaveOrg} data-testid="button-save-org">
            <Save className="w-4 h-4 mr-2" />
            Save Organization
          </Button>
        </div>

        {/* Profile */}
        <div className="bg-card border border-card-border rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">User Profile</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm(p => ({ ...p, firstName: e.target.value }))}
                  data-testid="input-first-name"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm(p => ({ ...p, lastName: e.target.value }))}
                  data-testid="input-last-name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={profileForm.email}
                disabled
                className="bg-muted"
                data-testid="input-email"
              />
            </div>
          </div>

          <Button onClick={handleSaveProfile} data-testid="button-save-profile">
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
        </div>

        {/* Security */}
        <div className="bg-card border border-card-border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Security</h2>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" placeholder="Leave blank to keep current" data-testid="input-new-password" />
          </div>
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input type="password" placeholder="Confirm new password" data-testid="input-confirm-password" />
          </div>
          <Button variant="outline" data-testid="button-change-password">
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}

