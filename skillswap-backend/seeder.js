const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Request = require('./models/Request');
const Session = require('./models/Session');

dotenv.config();

const users = [
  {
    name: 'Priya Sharma',
    email: 'priya@college.edu',
    password: 'password123',
    bio: 'Computer Science sophomore. Love coding and building things.',
    skillsOffered: ['Python', 'Web Development', 'Git'],
    skillsWanted: ['Graphic Design', 'Public Speaking', 'Photoshop'],
    availability: {
      days: ['Monday', 'Wednesday', 'Friday'],
      timeSlots: ['4:00-6:00 PM', '6:00-8:00 PM']
    }
  },
  {
    name: 'Arjun Desai',
    email: 'arjun@college.edu',
    password: 'password123',
    bio: 'Design major in my 3rd year. Looking to pick up some coding skills.',
    skillsOffered: ['Graphic Design', 'Photoshop', 'UI/UX'],
    skillsWanted: ['Python', 'Data Science', 'JavaScript'],
    availability: {
      days: ['Tuesday', 'Thursday', 'Friday'],
      timeSlots: ['2:00-4:00 PM', '4:00-6:00 PM']
    }
  },
  {
    name: 'Rahul Kumar',
    email: 'rahul@college.edu',
    password: 'password123',
    bio: 'Business student who plays guitar in my free time.',
    skillsOffered: ['Guitar', 'Excel', 'Public Speaking'],
    skillsWanted: ['Web Development', 'Video Editing'],
    availability: {
      days: ['Saturday', 'Sunday'],
      timeSlots: ['10:00-12:00 PM', '12:00-2:00 PM']
    }
  },
  {
    name: 'Aisha Patel',
    email: 'aisha@college.edu',
    password: 'password123',
    bio: 'Media studies freshman. I can help with videos and content!',
    skillsOffered: ['Video Editing', 'Content Writing', 'Photography'],
    skillsWanted: ['Guitar', 'Excel'],
    availability: {
      days: ['Monday', 'Thursday', 'Saturday'],
      timeSlots: ['6:00-8:00 PM']
    }
  },
  {
    name: 'Vikram Singh',
    email: 'vikram@college.edu',
    password: 'password123',
    bio: 'Math geek and aspiring data scientist.',
    skillsOffered: ['Mathematics', 'Python', 'Data Science'],
    skillsWanted: ['Photoshop', 'Content Writing'],
    availability: {
      days: ['Wednesday', 'Friday', 'Sunday'],
      timeSlots: ['8:00-10:00 AM', '12:00-2:00 PM']
    }
  }
];

const seedData = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Clear existing data
    await User.deleteMany();
    await Request.deleteMany();
    await Session.deleteMany();
    console.log('🗑️ Cleared existing data');

    // Hash passwords manually before insertMany because Mongoose pre-save hooks don't run on insertMany
    const usersToInsert = await Promise.all(users.map(async (u) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      return { ...u, password: hashedPassword };
    }));

    // Seed users
    const createdUsers = await User.insertMany(usersToInsert);
    console.log('👥 Seeded Users!');

    // Create a dummy request between Arjun and Priya
    // Arjun wants Python, Priya offers Python. Priya wants Graphic Design, Arjun offers Graphic Design.
    const priya = createdUsers.find(u => u.name === 'Priya Sharma');
    const arjun = createdUsers.find(u => u.name === 'Arjun Desai');
    const rahul = createdUsers.find(u => u.name === 'Rahul Kumar');
    const aisha = createdUsers.find(u => u.name === 'Aisha Patel');

    const req1 = await Request.create({
      senderId: arjun._id,
      receiverId: priya._id,
      skillOffered: 'Graphic Design',
      skillRequested: 'Python',
      message: 'Hey Priya! I see you need graphic design help and you teach Python. Let\'s swap!',
      status: 'accepted'
    });

    const req2 = await Request.create({
      senderId: rahul._id,
      receiverId: aisha._id,
      skillOffered: 'Guitar',
      skillRequested: 'Video Editing',
      message: 'Hi Aisha! Id love to learn video editing for my vlogs. I can teach you guitar!',
      status: 'pending'
    });
    
    console.log('🤝 Seeded Requests!');

    // Create a scheduled session for the accepted request
    await Session.create({
      requestId: req1._id,
      users: [priya._id, arjun._id],
      skillTopic: 'Intro to Python (Variables & Loops)',
      date: '2024-04-15',
      timeSlot: '4:00-6:00 PM',
      meetLink: 'https://meet.google.com/abc-xyz-def',
      status: 'scheduled',
      notes: 'First session!'
    });

    console.log('📅 Seeded Sessions!');

    console.log('🚀 Seed successful! You can log in with:');
    console.log('📧 Email: priya@college.edu | 🔑 Password: password123');
    console.log('📧 Email: arjun@college.edu | 🔑 Password: password123');
    
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
