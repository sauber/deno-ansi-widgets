type Size = number;
type Strechable = boolean;
type Element = [Size, Strechable];
export type Elements = Array<Element>;

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
  // return the original elements.
  if (nonStretchableSum > targetSize) {
    return elements;
  }

  // Calculate the total size of stretchable elements
  const stretchableSum = elements.reduce((sum, [size, stretchable]) => {
    return sum + (stretchable ? size : 0);
  }, 0);

  // If there are no stretchable elements, return the original elements.
  if (stretchableSum === 0) {
    return elements;
  }

  // Calculate the remaining size to be distributed among stretchable elements
  const remainingSize = targetSize - nonStretchableSum;

  // Calculate the ratio by which stretchable elements need to be adjusted
  const ratio = remainingSize / stretchableSum;

  // Create the new list of elements with adjusted stretchable sizes
  const newElements: Elements = elements.map(([size, stretchable]) => {
    if (stretchable) {
      return [Math.round(size * ratio), true];
    } else {
      return [size, false];
    }
  });

  return newElements;

}