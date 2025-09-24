// Simple script to initialize temporary signup links tables
// Run this once to set up the database tables for the temporary links feature

import axios from 'axios';

const BACKEND_URL = 'https://medquiz.vercel.app';

async function initializeTempLinksTables() {
    try {
        console.log('🔧 Initializing temporary signup links tables...');
        
        const response = await axios.post(`${BACKEND_URL}/api/admin/init-temp-links-tables`);
        
        if (response.data.message) {
            console.log('✅ Success:', response.data.message);
            console.log('🎉 Temporary signup links feature is now ready to use!');
        } else {
            console.log('❌ Unexpected response:', response.data);
        }
    } catch (error) {
        console.error('❌ Error initializing tables:', error.response?.data?.message || error.message);
        console.log('💡 Make sure your backend server is running on', BACKEND_URL);
    }
}

// Run the initialization
initializeTempLinksTables();
