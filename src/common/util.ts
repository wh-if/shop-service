import { createHash } from 'crypto';

export function Md5Hash(data: string) {
  return createHash('md5').update(data).digest('hex');
}
