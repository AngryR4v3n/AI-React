
/*
expects an array containing numbers that are formatted as string.
returns transformed numbers ['0', '0'] -> [1, 1]
else ['1', '2'] -> [2, 4]
*/
export function transformLocations(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = parseInt(arr[i])
        if (arr[i] === 0) {
            arr[i] = 1
        } else {
            arr[i] = (arr[i] * 2) + 1
        }
    }
    return arr
}

export function indexTrans(i, j, cols){
    return i + j * (cols);
  }