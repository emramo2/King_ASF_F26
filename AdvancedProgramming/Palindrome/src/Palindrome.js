function isPalindrome(value) {

    if (typeof value !== "string") {
        return false;
    }

    const cleanedWord = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    const reversedWord = cleanedWord
        .split("")
        .reverse()
        .join("");

    return cleanedWord === reversedWord;
}

module.exports = isPalindrome;