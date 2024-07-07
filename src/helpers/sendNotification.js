export const sendNotification = async (email, title, body) => {
    try {
      const response = await fetch('http://127.0.0.1:3000/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          title,
          body,
        }),
      });
  console.log("response:",response)
      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
  
      const result = await response.text();
      console.log('Notification sent successfully:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };