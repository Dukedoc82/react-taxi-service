
export default function validateIsNotEmpty(value, callback) {
    let result = value && value.trim() !== '';
    callback(result);
    return result;
}