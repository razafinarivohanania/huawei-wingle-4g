import { Logger } from 'log4js';

export default function getFieldValue(element: Element | Document, selector: string, fieldName: string, logger: Logger) {
    const fieldValue = element.querySelector(selector)?.textContent;
    if (!fieldValue) {
        throw new Error(`Unable to find field : ${fieldName}`)
    }

    logger.debug(`${fieldName} : ${fieldValue}`);
    return fieldValue;
}