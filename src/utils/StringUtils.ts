export function substringBefore(text: string, search: string, isLast = false) {
    const position = isLast ?
        text.lastIndexOf(search) :
        text.indexOf(search);

    return position < 0 ?
        text :
        text.substr(0, position);
}

export function substringAfter(text: string, search: string, isLast = false) {
    const position = isLast ?
        text.lastIndexOf(search) :
        text.indexOf(search);

    return position < 0 ?
        '' :
        text.substring(position + search.length);
}

export function toTwo(number: number): string {
    return number < 9 ? `0${number}` : `${number}`;
}