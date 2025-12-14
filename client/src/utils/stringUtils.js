/**
 * Generates initials from a name string.
 * - Single name (e.g., "Sagar") -> "S"
 * - Full name jaise ki (e.g., "Harshit Singh") -> "HS"
 * - Ignores extra spaces
 * - Returns uppercase
 * - Jyada long name nhi likhna
 * @param {string} name 
 * @returns {string}
 */
export const getInitials = (name) => {
    if (!name) return "";

    const parts = name.trim().split(/\s+/);

    if (parts.length === 0) return "";

    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
