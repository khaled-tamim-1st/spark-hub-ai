import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Building2, User, Shield, Save } from 'lucide-react';

export default function Settings() {
  const { toast } = useToast();

  const [orgForm, setOrgForm] = useState({
    name: 'My Organization',
    website: '',
  });

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleSaveOrg = () => {
    toast({ title: 'Organization settings saved' });
  };

  const handleSaveProfile = () => {
    toast({ title: 'Profile updated' });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your organization and profile settings</p>
        </div>

        {/* Organization */}
        <div className="bg-card border border-card-border rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Organization</h2>
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

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div>
              <p className="text-sm font-medium">Current Plan</p>
              <Badge variant="secondary" className="mt-1">Free</Badge>
            </div>
            <Button variant="outline" size="sm">Upgrade Plan</Button>
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
            <h2 className="text-lg font-semibold">Profile</h2>
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
                onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
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
            <h2 className="text-lg font-semibold">Security</h2>
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
