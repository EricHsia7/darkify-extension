export function generateID(prefix: string): string {
  var result: string = '';
  const len = 10;
  const bulk = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const bulkLen = bulk.length;
  for (var i = 0; i < len; i++) {
    var randomNumber = Math.round(Math.random() * bulkLen);
    result += bulk.substring(randomNumber, randomNumber + 1);
  }
  result = prefix + result;
  return result;
}
