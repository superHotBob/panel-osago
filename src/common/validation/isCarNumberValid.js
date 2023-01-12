import size from 'lodash/size';

export function isCarNumberValid(number, region) {
  return size(number) === 6 && size(region) >= 2;
}