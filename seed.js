const { post } = require('axios');

// Set environment to development
process.env.NODE_ENV = 'development';

async function seedDatabase() {
  try {
    const response = await post('http://localhost:5001/api/courses/seed');
    console.log('Database seeded successfully:', response.data);
  } catch (error) {
    console.error('Error seeding database:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

seedDatabase(); 