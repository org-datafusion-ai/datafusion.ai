import axios from 'axios';
import config from '../config';


export const API = () => {
    // Component logic here
};

export const downloadCSV = async () => {
    try {
      const response = await fetch(`${config.apiHost}/csv/generate`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error('Failed to download CSV');
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'generated.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };