const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DATA_PATH = path.join(__dirname, 'data', 'users.json');

async function seedUsers() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const users = [
    {
      id: uuidv4(),
      name: 'Dr. Priya Nair',
      email: 'priya.nair@manipal.edu',
      password: hashedPassword,
      role: 'user',
      status: 'approved',
      skills: ['Python', 'PyTorch', 'Computer Vision'],
      domain: ['Medical Imaging'],
      availability: 'Available now',
      bio: 'Ophthalmology researcher focusing on diabetic retinopathy.',
      createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Dr. Arun Shetty',
      email: 'arun.shetty@manipal.edu',
      password: hashedPassword,
      role: 'user',
      status: 'approved',
      skills: ['Python', 'HuggingFace', 'BERT'],
      domain: ['NLP in Healthcare'],
      availability: 'Available in 1 month',
      bio: 'Internal Medicine, working on automated clinical summarisation.',
      createdAt: new Date().toISOString()
    }
  ];

  // Try to keep existing users (like the test@admin.com one)
  let existing = [];
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    existing = JSON.parse(raw);
  } catch (err) { }

  // Avoid duplicates
  const existingEmails = existing.map(u => u.email);
  const toAdd = users.filter(u => !existingEmails.includes(u.email));

  const finalUsers = [...existing, ...toAdd];

  fs.writeFileSync(DATA_PATH, JSON.stringify(finalUsers, null, 2));
  console.log('Seeded users:', toAdd.map(u => u.email).join(', '));
}

seedUsers();
