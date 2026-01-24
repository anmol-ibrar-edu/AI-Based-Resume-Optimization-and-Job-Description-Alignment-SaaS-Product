// src/services/index.js
import * as mockAPI from './api.mock';

const services = mockAPI;

export const authAPI = services.authAPI;
export const userAPI = services.userAPI;
export const resumeAPI = services.resumeAPI;
export const jobAPI = services.jobAPI;
export const analysisAPI = services.analysisAPI;
export const dashboardAPI = services.dashboardAPI;

export default services;
