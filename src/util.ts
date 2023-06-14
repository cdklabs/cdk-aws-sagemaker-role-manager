import * as fs from 'fs';
import * as path from 'path';

export const TEMPLATES_DIR = '../assets/templates';

export const parameterValidationRegex = /^[A-Za-z0-9\.\/:\-_]+$/;

/**
 * Return the template by replacing its placeholders with the corresponding single value replacements and multi value replacements
 * @param template - The template in which to replace the placeholders
 * @param singleValueReplacements - The map of single value replacements
 * @param multiValueReplacements - The map of multi value replacements
 * @returns - The template file with all placeholders replaced with their corresponding single value and multi value replacements
 */
export function replacePatterns(template: string, singleValueReplacements: Map<string, string>,
  multiValueReplacements: Map<string, string[]>): string {
  // Validate that all single value placeholders of template exist in singleValueReplacements
  const singleValuePlaceholders = template.match(new RegExp('\{\{.*?}}')) || [];
  for (const singleValuePlaceholder of singleValuePlaceholders) {
    if (!singleValueReplacements.has(singleValuePlaceholder.slice(2, singleValuePlaceholder.length - 2))) {
      throw TypeError(`A single value placeholder is missing. Please include a value for ${singleValuePlaceholder}`);
    }
  }

  // Validate that all multi value placeholders of template exist in multiValueReplacements
  const multiValuePlaceholders = template.match(new RegExp('\\[\\[.*?]]')) || [];
  for (const multiValuePlaceholder of multiValuePlaceholders) {
    if (!multiValueReplacements.has(multiValuePlaceholder.slice(2, multiValuePlaceholder.length - 2))) {
      throw TypeError(`A multi value placeholder is missing. Please include a value for ${multiValuePlaceholder}`);
    }
  }

  let ret = `${template}`;

  // Replace all single value placeholders in template
  singleValueReplacements.forEach((value: string, key: string) => {
    // Regex matching single value replacement brackets and placeholder
    const singleValueRegularExpression = new RegExp(`\{\{${key}}}`, 'g');
    ret = ret.replace(singleValueRegularExpression, value);
  });

  // Replace all multi value placeholders in template
  multiValueReplacements.forEach((values: string[], key: string) => {
    // Regex matching a string with multi value replacement brackets and placeholder key in them
    // Example: 'arn:aws:s3:::[[S3Buckets]]/*'
    const multiValueRegularExpression = new RegExp(`\"((?!\").)*\\[\\[${key}]].*?\"`, 'g');
    // All strings matching with multi value replacement brackets and placeholder key in them
    const matches = ret.match(multiValueRegularExpression) || [];
    for (const match of matches) {
      // Replacement string containing a comma separated string of the matched string templated with the multi value replacement values
      const replacementValueString = values.map((value: string) => match.replace(new RegExp(`\\[\\[${key}]]`, 'g'), value)).join(',');
      // Replace all matches with replacementValueString
      ret = ret.replace(match, replacementValueString);
    }
  });
  return ret;
}

/**
 * Return the template file of the activity with activityName
 * @param activityName - The name of the activity to return the template
 * @param version - The version of the activity to return the template
 * @param isVPCCustomized - Whether VPC is customized
 * @param isKMSCustomized - Whether KMS is customized
 * @returns - The template file
 */
export function getTemplateFile(activityName: string, version: number, isVPCCustomized: boolean = false, isKMSCustomized: boolean = false) {
  // Get template name for activity taking into consideration vpc and kms customization
  let templateName = `${activityName}`;
  templateName = isVPCCustomized ? `${templateName}_VPC` : templateName;
  templateName = isKMSCustomized ? `${templateName}_KMS` : templateName;

  const fileNames: string[] = fs.readdirSync(path.resolve(__dirname, TEMPLATES_DIR));

  for (const fileName of fileNames) {
    const jsonFileContents = JSON.parse(fs.readFileSync(path.resolve(__dirname, `${TEMPLATES_DIR}/${fileName}`), 'utf8'));
    if (jsonFileContents.name === templateName && jsonFileContents.version == version) {
      return jsonFileContents;
    }
  }

  throw new RangeError(`The activityName did not match any template name field: ${activityName}`);
}
