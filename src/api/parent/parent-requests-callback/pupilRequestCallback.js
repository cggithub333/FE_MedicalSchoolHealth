
import Request from '../../request';

export const getAllPupils = async () => {
  return Request.get('pupils');
}