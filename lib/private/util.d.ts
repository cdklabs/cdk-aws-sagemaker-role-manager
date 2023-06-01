export declare const TEMPLATES_DIR = "../../conf/templates";
export declare const parameterValidationRegex: RegExp;
/**
 * Return the template by replacing its placeholders with the corresponding single value replacements and multi value replacements
 * @param template - The template in which to replace the placeholders
 * @param singleValueReplacements - The map of single value replacements
 * @param multiValueReplacements - The map of multi value replacements
 * @returns - The template file with all placeholders replaced with their corresponding single value and multi value replacements
 */
export declare function replacePatterns(template: string, singleValueReplacements: Map<string, string>, multiValueReplacements: Map<string, string[]>): string;
/**
 * Return the template file of the activity with activityName
 * @param activityName - The name of the activity to return the template
 * @param version - The version of the activity to return the template
 * @param isVPCCustomized - Whether VPC is customized
 * @param isKMSCustomized - Whether KMS is customized
 * @returns - The template file
 */
export declare function getTemplateFile(activityName: string, version: number, isVPCCustomized?: boolean, isKMSCustomized?: boolean): any;
