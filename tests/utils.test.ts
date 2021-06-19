import { camalize } from "../src/utils";

describe("camalize function", () => {
  it("should remove hypen and should capitalize a character after hyphen", () => {
    expect(camalize("my-name")).toBe("myName");
  });

  it("should remove space and should capitalize a character after space", () => {
    expect(camalize("my name")).toBe("myName");
  });

  it("should lowercase all characters", () => {
    expect(camalize("MYNAME")).toBe("myname");
  });

  it("should remove underscore and should capitalize a character after underscore", () => {
    expect(camalize("my_name")).toBe("myName");
  });

  it("should work for multiple special characters", () => {
    expect(camalize("my|name_is-roshan acharya")).toEqual(
      "myNameIsRoshanAcharya"
    );
  });
});
