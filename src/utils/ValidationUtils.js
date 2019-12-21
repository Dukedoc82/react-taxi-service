export function validateIsNotEmpty(value, successCallback, failCallback) {
    let result = value && value.trim() !== '';
    if (!result) {
        if (failCallback)
            failCallback(result);
    } else {
        if (successCallback)
            successCallback();
    }
    return result;
}

export function validatePassword(value, callback) {
    let isPasswordNotEmpty = validateIsNotEmpty(value);
    if (isPasswordNotEmpty) {
        if (callback) {
            callback('Password can not be empty!');
        }
    }


}