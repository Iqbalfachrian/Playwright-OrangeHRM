/**
 * Menghasilkan string unik dengan suffix timestamp.
 * Contoh: generateUniqueString('QA_Job') -> 'QA_Job_1714567890123'
 */
export function generateUniqueString(prefix: string): string {
    const randomNumber = generateRandomNumber(1, 99);
    return `${prefix} ${randomNumber}`;
}

/**
 * Menghasilkan email unik untuk testing user.
 * Contoh: generateUniqueEmail('test') -> 'test_1714567890123@test.com'
 */
export function generateUniqueEmail(prefix: string = 'user'): string {
    const randomEmailNumber = generateRandomNumber(1, 99);
    return `${prefix}_${randomEmailNumber}@mailsac.com`;
}

/**
 * Menghasilkan angka acak dalam range tertentu.
 * Berguna untuk Phone Number atau ID numerik.
 */
export function generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}