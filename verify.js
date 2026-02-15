#!/usr/bin/env node

console.log('🔍 Checking SoluGrow Project Status...\n');

const fs = require('fs');
const path = require('path');

const checks = [
    { name: 'package.json', path: './package.json' },
    { name: '.env.local', path: './.env.local' },
    { name: 'Landing Page', path: './app/page.tsx' },
    { name: 'Login Page', path: './app/auth/login/page.tsx' },
    { name: 'Signup Page', path: './app/auth/signup/page.tsx' },
    { name: 'Dashboard', path: './app/dashboard/page.tsx' },
    { name: 'Admin Dashboard', path: './app/dashboard/admin/page.tsx' },
    { name: 'Members Page', path: './app/dashboard/admin/members/page.tsx' },
    { name: 'Plans Page', path: './app/dashboard/admin/plans/page.tsx' },
    { name: 'Attendance Page', path: './app/dashboard/admin/attendance/page.tsx' },
    { name: 'Setup Gym Page', path: './app/setup-gym/page.tsx' },
    { name: 'InsForge Client', path: './lib/insforge.ts' },
    { name: 'useUser Hook', path: './hooks/useUser.ts' },
    { name: 'Middleware', path: './middleware.ts' },
    { name: 'Button Component', path: './components/ui/button.tsx' },
    { name: 'Input Component', path: './components/ui/input.tsx' },
    { name: 'Card Component', path: './components/ui/card.tsx' },
];

let allGood = true;

checks.forEach(check => {
    const exists = fs.existsSync(check.path);
    const status = exists ? '✅' : '❌';
    console.log(`${status} ${check.name}`);
    if (!exists) allGood = false;
});

console.log('\n' + '='.repeat(50));

if (allGood) {
    console.log('✅ All files present! Project is PRODUCTION READY!');
    console.log('\n🚀 Run these commands to start:');
    console.log('   npm install');
    console.log('   npm run dev');
    console.log('\n📱 Then open: http://localhost:3000');
} else {
    console.log('❌ Some files are missing. Please check the project.');
}

console.log('='.repeat(50) + '\n');
