import request from '../../../request.js';

export const getAllPrescriptionCallback = async () => request.get('send-medication/approved')