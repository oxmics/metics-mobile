import axios from 'axios';
import { BASE_URL } from '@env';


// Function to fetch dashboard data
export const fetchDashboardData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}dashboard/`);
    return response.data;
    
  } catch (error) {
    throw new Error('Error fetching dashboard data');
  }
};