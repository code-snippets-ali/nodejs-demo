export class Common {
    static hasCommonValue(array1: any[], array2: any[]): boolean {
        return array1.some((item1) => array2.includes(item1));
    }
}
