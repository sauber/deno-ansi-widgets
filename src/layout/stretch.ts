type Size = number;
type Strechable = boolean;
type Element = [Size, Strechable];
export type Elements = Array<Element>;

/** Distribute an integer number accoding to ratios.
 * The distributed sum is exactly equal to amount.
 */
export function distribute(ratios: number[], amount: number): number[] {
  const ratioSum: number = ratios.reduce((a, b) => a + b, 0);
  if (ratioSum === 0) {
    return Array(ratios.length).fill(0);
  }
  let cumulative = 0;
  return ratios.map((ratio) => {
    const newCumulative = cumulative + (ratio / ratioSum) * amount;
    const allocation = Math.round(newCumulative) - Math.round(cumulative);
    cumulative = newCumulative;
    return allocation;
  });
}

/**
 * Given a list of sizes and flag for each number if is it stretchable
 * generate a new list where each stretchable number is changed,
 * so that the total of changed number equals targetSize.
 * All sizes need to be expanded or retracted by same ratio,
 * except for sizes which are not stretcable; these sizes
 * need to remain unchanged.
 * @param elements
 * @returns elements
 */
export function stretch(elements: Elements, targetSize: Size): Elements {
  // Calculate the total size of non-stretchable elements
  const nonStretchableSum = elements.reduce((sum, [size, stretchable]) => {
    return sum + (stretchable ? 0 : size);
  }, 0);

  // If the total size of non-stretchable elements is greater than targetSize,
  // then stretching is not possible, and return the original elements.
  if (nonStretchableSum > targetSize) return elements;

  // Generate the list of stretchable elements
  const stretchableElements = elements.filter(([_, stretchable]) =>
    stretchable
  );

  // If there are no stretchable elements, return the original elements.
  if (stretchableElements.length === 0) return elements;

  // Calculate the remaining size to be distributed among stretchable elements
  const remainingSize = targetSize - nonStretchableSum;

  // Calculate the ratio by which stretchable elements need to be adjusted
  // const ratio = remainingSize / stretchableSum;

  // Distribute remaining size according to current sizes of stretable elements
  const distribution = distribute(
    elements.map(([size, stretchable]) => stretchable ? size : 0),
    remainingSize,
  );

  // Create the new list of elements with adjusted stretchable sizes
  const newElements: Elements = elements.map(([size, stretchable], index) => {
    if (stretchable) {
      return [distribution[index], true];
    } else {
      return [size, stretchable];
    }
  });

  return newElements;
}
