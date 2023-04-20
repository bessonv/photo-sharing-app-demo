import { createHash } from 'crypto';

export function getHash(str: string) {
  if (str.length === 0) throw new Error(`Cannot get hash of empty string`);
  const salt = str[0] + str.length;
  const hash = createHash('sha256')
    .update(str)
    .update(createHash('sha256').update(salt, 'utf8').digest('hex'))
    .digest('hex');
  return hash;
}
