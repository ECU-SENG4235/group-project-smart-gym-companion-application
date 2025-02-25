import axios from 'axios';

const sendNotification = async (message) => {
    try {
        const response = await axios.post('http://localhost:4000/api/notifications/send', { message });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending notification', error);
        return { success: false, message: error.message };
    }
}

export default sendNotification;
