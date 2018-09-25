/**
 * Checks if there is a previous timing and this new timing exceeds that
 * @param {?number | ?Date} previousTiming
 * @param {number | Date} newTiming
 * @returns {boolean}
 */
function isLastWrite(previousTiming, newTiming) {
  return !previousTiming || previousTiming < newTiming;
}

/**
 * Implements lww element set as described in
 * https://github.com/pfrazee/crdt_notes#lww-element-set
 *
 * It attaches a timestamp to each element (rather than to the whole set).
 *
 * Consider add-set A and remove-set R,
 * each containing (element, timestamp) pairs.
 * To add (resp. remove) an element e, add the pair (e, now()),
 * where now was specified earlier, to A (resp. to R).
 *
 * Merging two replicas takes the union of their add-sets and remove-sets.
 *
 * An element e is in the set if it is in A,
 * and it is not in R with a higher timestamp:
 *   lookup(e) = ∃ t, ∀ t 0 > t: (e,t) ∈ A ∧ (e,t0) / ∈ R).
 * Since it is based on LWW, this data type is convergent.
 */
class LwwElementSet {
  constructor() {
    // Use map because data may not be stringifiable
    this._addSet = new Map();
    this._removeSet = new Map();
  }

  /**
   * Adds data to lww element set
   * @param {*} data
   * @param {number | Date} time
   */
  add(data, time) {
    const previousAdd = this._addSet.get(data);
    if (isLastWrite(previousAdd, time)) {
      this._addSet.set(data, time);
    }
  }

  /**
   * Removes data from lww element set
   * @param {*} data
   * @param {number | Date} time
   */
  remove(data, time) {
    const previousRemove = this._removeSet.get(data);
    if (isLastWrite(previousRemove, time)) {
      this._removeSet.set(data, time);
    }
  }

  /**
   * Merges and returns valid data
   * @returns {*[]} Array of existing data
   */
  get() {
    const merged = [];
    this._addSet.forEach((addTiming, key) => {
      const removalTiming = this._removeSet.get(key);
      if (isLastWrite(removalTiming, addTiming)) {
        merged.push(key);
      }
    });

    return merged;
  }
}

export default LwwElementSet;
