const isPalindrome = require('../Palindrome');



describe('isPalindrome', () => {
    test("should be a function", () => {
        expect(isPalindrome).toBeInstanceOf(Function);
    });
});

///describe what cannot be inputted

describe("invalid inputs", () => {
    test("should return false if a number is inputted", () => {
        expect(isPalindrome(12321)).toBe(false);
    });

    test("should return false if an array is inputted", () => {
        expect(isPalindrome([])).toBe(false);
    });

    test("should return false if a boolean is inputted", () => {
        expect(isPalindrome(false)).toBe(false);
    });
    test("should return false if a object is inputted", () => {
        expect(isPalindrome({})).toBe(false);
    });
    test("should return false if null is inputted", () => {
        expect(isPalindrome(null)).toBe(false);
    });
    test("should return false if undefined is inputted", () => {
        expect(isPalindrome(undefined)).toBe(false);
    });

});


//shape what is a palindrome

describe("basic palindrome words", () => {
    test("bob should return true", () => {
        expect(isPalindrome("bob")).toBe(true);
    });
    test("racecar should return true", () => {
        expect(isPalindrome("racecar")).toBe(true);
    });
    test("apple should return false", () => {
        expect(isPalindrome("apple")).toBe(false);
    });

});


////spaces and punctuation

describe("spaces and punctuation words", () => {
    test("Madam I'm Adam. returns true", () => {
        expect(isPalindrome("Madam I'm Adam.")).toBe(true);
    });
    test("A man, a plan, a canal – Panama! should return true", () => {
        expect(isPalindrome("A man, a plan, a canal – Panama!")).toBe(true);
    });
    test("a 90 word palindrome should return true", () => {
        expect(isPalindrome("Wow! Mom, dad, kayak, radar, level, rotor, stats, noon, racecar, madam, eye, eve, ewe, gig, gag, pop, pup, tot, toot, civic, refer, solos, tenet, deed, minim, reviver, rotator, deified, kayak, radar, level, rotor, stats, noon, racecar, madam, eye, eve, ewe, gig, gag, pop, pup, tot, toot, toot, tot, pup, pop, gag, gig, ewe, eve, eye, madam, racecar, noon, stats, rotor, level, radar, kayak, deified, rotator, reviver, minim, deed, tenet, solos, refer, civic, toot, tot, pup, pop, gag, gig, ewe, eve, eye, madam, racecar, noon, stats, rotor, level, radar, kayak, dad, mom, wow.")).toBe(true);
    });
    test("case sensitivity should return true", () => {
        expect(isPalindrome("Racecar")).toBe(true);

    })

});