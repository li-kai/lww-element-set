import LwwElementSet from "./main.js";

describe("LwwElementSet", () => {
  it("adds latest data", () => {
    const crdtSet = new LwwElementSet();
    crdtSet.add("a", 1);
    crdtSet.add("b", 1);
    crdtSet.add("a", 5);
    const expectedSet = new Map([["a", 5], ["b", 1]]);
    expect(crdtSet._addSet).toEqual(expectedSet);
  });

  it("removes latest data", () => {
    const crdtSet = new LwwElementSet();
    crdtSet.remove("a", 1);
    crdtSet.remove("b", 1);
    crdtSet.remove("a", 5);
    const expectedSet = new Map([["a", 5], ["b", 1]]);
    expect(crdtSet._removeSet).toEqual(expectedSet);
  });

  it("gets merged data, with last write prevailing", () => {
    const crdtSet = new LwwElementSet();
    crdtSet.add("a", 1);
    crdtSet.add("b", 2);
    crdtSet.remove("b", 3);
    crdtSet.add("b", 5);
    expect(crdtSet.get()).toEqual(["a", "b"]);
  });
});
