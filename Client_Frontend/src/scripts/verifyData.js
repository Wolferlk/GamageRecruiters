const verifyFacebookURL = (url) => {
    const facebookRegex = /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/;
    return facebookRegex.test(url);
}

const verifyLinkedInURL = (url) => {
    const linkedInRegex = /^(https?:\/\/)?(www\.)?linkedin.com\/[a-zA-Z0-9(\.\?)?]/;
    return linkedInRegex.test(url);
} 

const verifyPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,20}$/;
    return passwordRegex.test(password);
}

const verifyEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
} 

const verifyPhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^\+?\d{1,3}[-.\s]?\d{7,12}$/;
    return phoneNumberRegex.test(phoneNumber);
}

const verifyURL = (url) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

export { verifyFacebookURL, verifyLinkedInURL, verifyPassword, verifyEmail, verifyPhoneNumber, verifyURL }