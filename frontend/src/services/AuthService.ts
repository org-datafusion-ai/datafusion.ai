import axios from 'axios';
import config from '../config';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface LogoutData {
  token: string;
}

const API_URL = config.apiHost;

const register = async (data: RegisterData) => {
  return axios.post(`${API_URL}/auth/register`, data);
};

const login = async (data: LoginData) => {
  return axios.post(`${API_URL}/auth/login`, data);
};

const logout = async (token: string) => (data: LogoutData) => {
  return axios.post(`${API_URL}/auth/logout`, data);
};

export { register, login, logout };
