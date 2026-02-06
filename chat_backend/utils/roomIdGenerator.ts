/* eslint-disable prettier/prettier */
import * as crypto from 'crypto';

export function generatePrivateRoomId(
    userAId: string,
    userBId: string,
): string {
    const [a, b] = [userAId, userBId].sort();
    const raw = `${a}:${b}`;

    return crypto
        .createHash('sha256')
        .update(raw)
        .digest('hex');
}