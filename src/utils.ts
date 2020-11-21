export const flattenObject = (obj: any) => {
    const toReturn: any = {};

    for (let i in obj) {
        if (!obj.hasOwnProperty(i)) continue;

        if ((typeof obj[i] === 'object')) {
            const flatObject = flattenObject(obj[i]);
            for (let x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[`${i}.${x}`] = flatObject[x];
            }
        } else {
            toReturn[i] = obj[i];
        }
    }

    return toReturn;
};