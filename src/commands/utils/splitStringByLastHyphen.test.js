const { splitStringByLastHyphen } = require('./splitStringByLastHyphen');

describe('Split String By Last Hyphen', () => {
  test('should split the string based on the last hyphen', () => {
    const str1 = "example-string-123";
    const result1 = splitStringByLastHyphen(str1);
    expect(result1).toEqual(["example-string", "123"]);

    const str2 = "nohyphen";
    const result2 = splitStringByLastHyphen(str2);
    expect(result2).toEqual(["nohyphen"]);

    const str3 = "one-two-three-four";
    const result3 = splitStringByLastHyphen(str3);
    expect(result3).toEqual(["one-two-three", "four"]);
  });

  test('should return an empty string as the first part if the string starts with a hyphen', () => {
    const str = "-start-here";
    const result = splitStringByLastHyphen(str);
    expect(result).toEqual(["", "start-here"]);
  });

  test('should return an empty string as the second part if the string ends with a hyphen', () => {
    const str = "end-here-";
    const result = splitStringByLastHyphen(str);
    expect(result).toEqual(["end-here", ""]);
  });

  test('should return an array with an empty string if the input string is empty', () => {
    const str = "";
    const result = splitStringByLastHyphen(str);
    expect(result).toEqual([""]);
  });
});
