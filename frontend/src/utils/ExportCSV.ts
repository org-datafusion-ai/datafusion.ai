import axios from 'axios';
import config from '../config';

export const downloadCSV = async () => {
  try {
    const response = await axios.get(`${config.apiHost}/csv/generate`, {
      withCredentials: true,
      responseType: 'blob',
    });

    const blob = new Blob([response.data as BlobPart], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; 
    const filename = `generated-${dateString}.csv`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); 
  } catch (error) {
    console.error('Error downloading CSV:', error);
  }
};
