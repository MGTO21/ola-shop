export const generateSignupCode = (phone: string) => {
    // Remove non-digit characters to get raw number
    const cleanPhone = phone.replace(/\D/g, '');

    // Encode to Base64 (simple obfuscation)
    // In Node environment we might need Buffer, but in browser btoa works
    const base64Phone = (typeof window !== 'undefined')
        ? window.btoa(cleanPhone)
        : Buffer.from(cleanPhone).toString('base64');

    // get last 7 digits of timestamp for brevity
    const timestamp = Date.now().toString().slice(-7);

    return `SIGNUP-${base64Phone}-${timestamp}`;
};

export const decodeSignupCode = (code: string) => {
    try {
        const parts = code.split('-');
        if (parts.length !== 3 || parts[0] !== 'SIGNUP') return null;

        const base64Phone = parts[1];
        const phone = (typeof window !== 'undefined')
            ? window.atob(base64Phone)
            : Buffer.from(base64Phone, 'base64').toString('utf-8');

        return {
            phone,
            timestamp: parts[2]
        };
    } catch (e) {
        return null;
    }
};
