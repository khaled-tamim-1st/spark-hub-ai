import { db } from '@workspace/db';
import { organizations, users } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { scryptSync, randomBytes } from 'crypto';

function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString('hex');
  return scryptSync(pw, salt, 64).toString('hex') + '.' + salt;
}

async function seed() {
  const adminEmail = process.env.SUPERADMIN_EMAIL || 'admin@supporthub.ai';
  const adminPassword = process.env.SUPERADMIN_PASSWORD || 'Admin@123456';

  console.log(`Checking superadmin user: ${adminEmail}...`);

  // Ensure system organization exists
  let [systemOrg] = await db.select().from(organizations).where(eq(organizations.slug, 'system-admin')).limit(1);
  if (!systemOrg) {
    [systemOrg] = await db.insert(organizations).values({
      name: 'SupportHub Platform System',
      slug: 'system-admin',
      plan: 'enterprise',
      status: 'active',
      maxUsers: 9999,
      maxChannels: 999,
      aiEnabled: true,
      notes: 'System Administration Organization',
    }).returning();
    console.log('Created System Organization:', systemOrg.id);
  }

  // Ensure superadmin user exists
  const [existingUser] = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
  if (!existingUser) {
    const [newUser] = await db.insert(users).values({
      organizationId: systemOrg.id,
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
      firstName: 'Platform',
      lastName: 'Superadmin',
      role: 'superadmin',
      isActive: true,
    }).returning();
    console.log(`Superadmin created successfully!`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
  } else {
    // Elevate role to superadmin if not already
    await db.update(users).set({
      role: 'superadmin',
      organizationId: systemOrg.id,
    }).where(eq(users.id, existingUser.id));
    console.log(`User ${adminEmail} updated to superadmin.`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
