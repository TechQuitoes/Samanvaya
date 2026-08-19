import * as dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole, UserStatus } from './modules/user/schemas/user.schema';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@samanvaya.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword@123';

  const existingAdmin = await userModel.findOne({ email: adminEmail.toLowerCase() });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  if (existingAdmin) {
    existingAdmin.name = 'Super Admin';
    existingAdmin.password = hashedPassword;
    existingAdmin.role = UserRole.SUPER_ADMIN;
    existingAdmin.status = UserStatus.APPROVED;
    existingAdmin.mobile = '9999999999';
    await existingAdmin.save();
    console.log('✅ Existing Super Admin account updated!');
  } else {
    const newAdmin = new userModel({
      name: 'Super Admin',
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      mobile: '9999999999',
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.APPROVED,
    });
    await newAdmin.save();
    console.log('✅ New Super Admin account created!');
  }

  console.log('-------------------------------------------');
  console.log('Super Admin Credentials:');
  console.log('Email:   ', adminEmail);
  console.log('Password:', adminPassword);
  console.log('Role:    ', UserRole.SUPER_ADMIN);
  console.log('Status:  ', UserStatus.APPROVED);
  console.log('-------------------------------------------');

  await app.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
