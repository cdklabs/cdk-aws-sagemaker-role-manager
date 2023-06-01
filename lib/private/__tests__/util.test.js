"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const util_1 = require("../util");
const manageJobsJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../${util_1.TEMPLATES_DIR}/manageJobs.json`), 'utf8'));
const manageJobsVpcJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../${util_1.TEMPLATES_DIR}/manageJobsVpc.json`), 'utf8'));
const manageJobsKmsJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../${util_1.TEMPLATES_DIR}/manageJobsKms.json`), 'utf8'));
const manageJobsVpcKmsJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../${util_1.TEMPLATES_DIR}/manageJobsVpcKms.json`), 'utf8'));
const testTemplateNoReplacements = {
    Version: '2012-10-17',
    Statement: [
        {
            Effect: 'Allow',
            Action: [
                'sagemaker:AddAssociation',
                'sagemaker:CreateAction',
                'sagemaker:CreateArtifact',
                'sagemaker:CreateContext',
                'sagemaker:CreateExperiment',
                'sagemaker:CreateTrial',
                'sagemaker:CreateTrialComponent',
                'sagemaker:UpdateAction',
                'sagemaker:UpdateArtifact',
                'sagemaker:UpdateContext',
                'sagemaker:UpdateExperiment',
                'sagemaker:UpdateTrial',
                'sagemaker:UpdateTrialComponent',
                'sagemaker:AssociateTrialComponent',
                'sagemaker:DisassociateTrialComponent',
                'sagemaker:DeleteAssociation',
                'sagemaker:DeleteAction',
                'sagemaker:DeleteArtifact',
                'sagemaker:DeleteContext',
                'sagemaker:DeleteExperiment',
                'sagemaker:DeleteTrial',
                'sagemaker:DeleteTrialComponent',
            ],
            Resource: 'arn:aws:sagemaker:*:*:*/*',
        },
    ],
};
const testTemplateSingleValueReplacements = {
    Version: '2012-10-17',
    Statement: [
        {
            Effect: 'Allow',
            Action: [
                'glue:SearchTables',
            ],
            Resource: [
                'arn:aws:glue:{{Region}}:{{AccountId}}:table/*/*',
                'arn:aws:glue:{{Region}}:{{AccountId}}:database/testDb',
                'arn:aws:glue:{{Region}}:{{AccountId}}:catalog',
            ],
        },
    ],
};
const testTemplateSingleValueReplacementsExpected = {
    Version: '2012-10-17',
    Statement: [
        {
            Effect: 'Allow',
            Action: [
                'glue:SearchTables',
            ],
            Resource: [
                'arn:aws:glue:testRegion:testAccount:table/*/*',
                'arn:aws:glue:testRegion:testAccount:database/testDb',
                'arn:aws:glue:testRegion:testAccount:catalog',
            ],
        },
    ],
};
const testTemplateMultiValueReplacements = {
    Effect: 'Allow',
    Action: [
        's3:GetObject',
        's3:PutObject',
        's3:GetBucketAcl',
    ],
    Resource: [
        'arn:aws:s3:::[[S3Buckets]]/*',
    ],
};
const testTemplateMultiValueReplacementsExpected = {
    Effect: 'Allow',
    Action: [
        's3:GetObject',
        's3:PutObject',
        's3:GetBucketAcl',
    ],
    Resource: [
        'arn:aws:s3:::testBucket1/*',
        'arn:aws:s3:::testBucket2/*',
        'arn:aws:s3:::testBucket3/*',
    ],
};
const testTemplateMultiValueReplacementsWithReplacementsInSameLine = {
    Effect: 'Allow',
    Action: [
        's3:GetObject',
        's3:PutObject',
    ],
    Resource: [
        'arn:aws:s3:::[[S3Buckets]]/[[Objects]]',
    ],
};
const testTemplateMultiValueReplacementsWithReplacementsInSameLineExpected = {
    Effect: 'Allow',
    Action: [
        's3:GetObject',
        's3:PutObject',
    ],
    Resource: [
        'arn:aws:s3:::testBucket1/testObject1',
        'arn:aws:s3:::testBucket1/testObject2',
        'arn:aws:s3:::testBucket2/testObject1',
        'arn:aws:s3:::testBucket2/testObject2',
    ],
};
const testTemplateMultiValueAndSingleValueReplacements = {
    Version: '2012-10-17',
    Statement: [
        {
            Effect: 'Allow',
            Action: [
                'glue:SearchTables',
            ],
            Resource: [
                'arn:aws:glue:{{Region}}:{{AccountId}}:table/*/*',
                'arn:aws:glue:{{Region}}:{{AccountId}}:database/[[GlueDbNames]]',
                'arn:aws:glue:{{Region}}:{{AccountId}}:catalog',
            ],
        },
        {
            Effect: 'Allow',
            Action: [
                's3:GetObject',
                's3:PutObject',
                's3:GetBucketAcl',
            ],
            Resource: [
                'arn:aws:s3:::[[S3Buckets]]/*',
            ],
        },
    ],
};
const testTemplateMultiValueAndSingleValueReplacementsExpected = {
    Version: '2012-10-17',
    Statement: [
        {
            Effect: 'Allow',
            Action: [
                'glue:SearchTables',
            ],
            Resource: [
                'arn:aws:glue:testRegion:testAccount:table/*/*',
                'arn:aws:glue:testRegion:testAccount:database/testDb',
                'arn:aws:glue:testRegion:testAccount:catalog',
            ],
        },
        {
            Effect: 'Allow',
            Action: [
                's3:GetObject',
                's3:PutObject',
                's3:GetBucketAcl',
            ],
            Resource: [
                'arn:aws:s3:::testBucket1/*',
                'arn:aws:s3:::testBucket2/*',
                'arn:aws:s3:::testBucket3/*',
            ],
        },
    ],
};
test('test replace patterns for happy case with no replacements', () => {
    const svReplacements = new Map();
    const mvReplacements = new Map();
    expect(util_1.replacePatterns(JSON.stringify(testTemplateNoReplacements), svReplacements, mvReplacements)).toBe(JSON.stringify(testTemplateNoReplacements));
    svReplacements.set('test', 'testValue');
    expect(util_1.replacePatterns(JSON.stringify(testTemplateNoReplacements), svReplacements, mvReplacements)).toBe(JSON.stringify(testTemplateNoReplacements));
    mvReplacements.set('test', ['testMultiValue1', 'testMultiValue2']);
    expect(util_1.replacePatterns(JSON.stringify(testTemplateNoReplacements), svReplacements, mvReplacements)).toBe(JSON.stringify(testTemplateNoReplacements));
});
test('test replace patterns for happy case with single value replacements', () => {
    const svReplacements = new Map();
    const mvReplacements = new Map();
    svReplacements.set('Region', 'testRegion');
    svReplacements.set('AccountId', 'testAccount');
    expect(util_1.replacePatterns(JSON.stringify(testTemplateSingleValueReplacements), svReplacements, mvReplacements)).toBe(JSON.stringify(testTemplateSingleValueReplacementsExpected));
    mvReplacements.set('test', ['testMultiValue1', 'testMultiValue2']);
    expect(util_1.replacePatterns(JSON.stringify(testTemplateSingleValueReplacements), svReplacements, mvReplacements)).toBe(JSON.stringify(testTemplateSingleValueReplacementsExpected));
});
test('test replace patterns for happy case with multi value replacements', () => {
    const svReplacements = new Map();
    const mvReplacements = new Map();
    mvReplacements.set('S3Buckets', ['testBucket1', 'testBucket2', 'testBucket3']);
    expect(util_1.replacePatterns(JSON.stringify(testTemplateMultiValueReplacements), svReplacements, mvReplacements)).toBe(JSON.stringify(testTemplateMultiValueReplacementsExpected));
    svReplacements.set('AccountId', 'testAccount');
    expect(util_1.replacePatterns(JSON.stringify(testTemplateMultiValueReplacements), svReplacements, mvReplacements)).toBe(JSON.stringify(testTemplateMultiValueReplacementsExpected));
});
test('test replace patterns for happy case with multi value replacements in same line', () => {
    const svReplacements = new Map();
    const mvReplacements = new Map();
    mvReplacements.set('S3Buckets', ['testBucket1', 'testBucket2']);
    mvReplacements.set('Objects', ['testObject1', 'testObject2']);
    expect(util_1.replacePatterns(JSON.stringify(testTemplateMultiValueReplacementsWithReplacementsInSameLine), svReplacements, mvReplacements)).toBe(JSON.stringify(testTemplateMultiValueReplacementsWithReplacementsInSameLineExpected));
    svReplacements.set('AccountId', 'testAccount');
});
test('test replace patterns for happy case with both multi value and single value replacements', () => {
    const svReplacements = new Map();
    const mvReplacements = new Map();
    svReplacements.set('Region', 'testRegion');
    svReplacements.set('AccountId', 'testAccount');
    mvReplacements.set('S3Buckets', ['testBucket1', 'testBucket2', 'testBucket3']);
    mvReplacements.set('GlueDbNames', ['testDb']);
    expect(util_1.replacePatterns(JSON.stringify(testTemplateMultiValueAndSingleValueReplacements), svReplacements, mvReplacements)).toBe(JSON.stringify(testTemplateMultiValueAndSingleValueReplacementsExpected));
});
test('test replace patterns with missing single value replacement', () => {
    const svReplacements = new Map();
    const mvReplacements = new Map();
    expect(() => { util_1.replacePatterns(JSON.stringify(testTemplateSingleValueReplacements), svReplacements, mvReplacements); }).toThrow(TypeError);
});
test('test replace patterns with missing multi value replacement', () => {
    const svReplacements = new Map();
    const mvReplacements = new Map();
    expect(() => { util_1.replacePatterns(JSON.stringify(testTemplateMultiValueReplacements), svReplacements, mvReplacements); }).toThrow(TypeError);
});
test('getTemplateFile with valid activity name', () => {
    expect(util_1.getTemplateFile(manageJobsJson.name, 1)).toEqual(manageJobsJson);
});
test('getTemplateFile with valid activity name and vpc customization enabled', () => {
    expect(util_1.getTemplateFile(manageJobsJson.name, 1, true, false)).toEqual(manageJobsVpcJson);
});
test('getTemplateFile with valid activity name and kms customization enabled', () => {
    expect(util_1.getTemplateFile(manageJobsJson.name, 1, false, true)).toEqual(manageJobsKmsJson);
});
test('getTemplateFile with valid activity name and both vpc and kms customization enabled', () => {
    expect(util_1.getTemplateFile(manageJobsJson.name, 1, true, true)).toEqual(manageJobsVpcKmsJson);
});
test('getTemplateFile with invalid activity name throws RangeError', () => {
    expect(() => { util_1.getTemplateFile('', 1); }).toThrow(RangeError);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3ByaXZhdGUvX190ZXN0c19fL3V0aWwudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFFN0Isa0NBQTBFO0FBRTFFLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFNLG9CQUFhLGtCQUFrQixDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUMzSCxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFNLG9CQUFhLHFCQUFxQixDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNqSSxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFNLG9CQUFhLHFCQUFxQixDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNqSSxNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFNLG9CQUFhLHdCQUF3QixDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUV2SSxNQUFNLDBCQUEwQixHQUFHO0lBQ2pDLE9BQU8sRUFBRSxZQUFZO0lBQ3JCLFNBQVMsRUFBRTtRQUNUO1lBQ0UsTUFBTSxFQUFFLE9BQU87WUFDZixNQUFNLEVBQUU7Z0JBQ04sMEJBQTBCO2dCQUMxQix3QkFBd0I7Z0JBQ3hCLDBCQUEwQjtnQkFDMUIseUJBQXlCO2dCQUN6Qiw0QkFBNEI7Z0JBQzVCLHVCQUF1QjtnQkFDdkIsZ0NBQWdDO2dCQUNoQyx3QkFBd0I7Z0JBQ3hCLDBCQUEwQjtnQkFDMUIseUJBQXlCO2dCQUN6Qiw0QkFBNEI7Z0JBQzVCLHVCQUF1QjtnQkFDdkIsZ0NBQWdDO2dCQUNoQyxtQ0FBbUM7Z0JBQ25DLHNDQUFzQztnQkFDdEMsNkJBQTZCO2dCQUM3Qix3QkFBd0I7Z0JBQ3hCLDBCQUEwQjtnQkFDMUIseUJBQXlCO2dCQUN6Qiw0QkFBNEI7Z0JBQzVCLHVCQUF1QjtnQkFDdkIsZ0NBQWdDO2FBQ2pDO1lBQ0QsUUFBUSxFQUFFLDJCQUEyQjtTQUN0QztLQUNGO0NBQ0YsQ0FBQztBQUVGLE1BQU0sbUNBQW1DLEdBQUc7SUFDMUMsT0FBTyxFQUFFLFlBQVk7SUFDckIsU0FBUyxFQUFFO1FBQ1Q7WUFDRSxNQUFNLEVBQUUsT0FBTztZQUNmLE1BQU0sRUFBRTtnQkFDTixtQkFBbUI7YUFDcEI7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsaURBQWlEO2dCQUNqRCx1REFBdUQ7Z0JBQ3ZELCtDQUErQzthQUNoRDtTQUNGO0tBQ0Y7Q0FDRixDQUFDO0FBRUYsTUFBTSwyQ0FBMkMsR0FBRztJQUNsRCxPQUFPLEVBQUUsWUFBWTtJQUNyQixTQUFTLEVBQUU7UUFDVDtZQUNFLE1BQU0sRUFBRSxPQUFPO1lBQ2YsTUFBTSxFQUFFO2dCQUNOLG1CQUFtQjthQUNwQjtZQUNELFFBQVEsRUFBRTtnQkFDUiwrQ0FBK0M7Z0JBQy9DLHFEQUFxRDtnQkFDckQsNkNBQTZDO2FBQzlDO1NBQ0Y7S0FDRjtDQUNGLENBQUM7QUFFRixNQUFNLGtDQUFrQyxHQUFHO0lBQ3pDLE1BQU0sRUFBRSxPQUFPO0lBQ2YsTUFBTSxFQUFFO1FBQ04sY0FBYztRQUNkLGNBQWM7UUFDZCxpQkFBaUI7S0FDbEI7SUFDRCxRQUFRLEVBQUU7UUFDUiw4QkFBOEI7S0FDL0I7Q0FDRixDQUFDO0FBRUYsTUFBTSwwQ0FBMEMsR0FBRztJQUNqRCxNQUFNLEVBQUUsT0FBTztJQUNmLE1BQU0sRUFBRTtRQUNOLGNBQWM7UUFDZCxjQUFjO1FBQ2QsaUJBQWlCO0tBQ2xCO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsNEJBQTRCO1FBQzVCLDRCQUE0QjtRQUM1Qiw0QkFBNEI7S0FDN0I7Q0FDRixDQUFDO0FBRUYsTUFBTSw0REFBNEQsR0FBRztJQUNuRSxNQUFNLEVBQUUsT0FBTztJQUNmLE1BQU0sRUFBRTtRQUNOLGNBQWM7UUFDZCxjQUFjO0tBQ2Y7SUFDRCxRQUFRLEVBQUU7UUFDUix3Q0FBd0M7S0FDekM7Q0FDRixDQUFDO0FBRUYsTUFBTSxvRUFBb0UsR0FBRztJQUMzRSxNQUFNLEVBQUUsT0FBTztJQUNmLE1BQU0sRUFBRTtRQUNOLGNBQWM7UUFDZCxjQUFjO0tBQ2Y7SUFDRCxRQUFRLEVBQUU7UUFDUixzQ0FBc0M7UUFDdEMsc0NBQXNDO1FBQ3RDLHNDQUFzQztRQUN0QyxzQ0FBc0M7S0FDdkM7Q0FDRixDQUFDO0FBRUYsTUFBTSxnREFBZ0QsR0FBRztJQUN2RCxPQUFPLEVBQUUsWUFBWTtJQUNyQixTQUFTLEVBQUU7UUFDVDtZQUNFLE1BQU0sRUFBRSxPQUFPO1lBQ2YsTUFBTSxFQUFFO2dCQUNOLG1CQUFtQjthQUNwQjtZQUNELFFBQVEsRUFBRTtnQkFDUixpREFBaUQ7Z0JBQ2pELGdFQUFnRTtnQkFDaEUsK0NBQStDO2FBQ2hEO1NBQ0Y7UUFDRDtZQUNFLE1BQU0sRUFBRSxPQUFPO1lBQ2YsTUFBTSxFQUFFO2dCQUNOLGNBQWM7Z0JBQ2QsY0FBYztnQkFDZCxpQkFBaUI7YUFDbEI7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsOEJBQThCO2FBQy9CO1NBQ0Y7S0FDRjtDQUNGLENBQUM7QUFFRixNQUFNLHdEQUF3RCxHQUFHO0lBQy9ELE9BQU8sRUFBRSxZQUFZO0lBQ3JCLFNBQVMsRUFBRTtRQUNUO1lBQ0UsTUFBTSxFQUFFLE9BQU87WUFDZixNQUFNLEVBQUU7Z0JBQ04sbUJBQW1CO2FBQ3BCO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLCtDQUErQztnQkFDL0MscURBQXFEO2dCQUNyRCw2Q0FBNkM7YUFDOUM7U0FDRjtRQUNEO1lBQ0UsTUFBTSxFQUFFLE9BQU87WUFDZixNQUFNLEVBQUU7Z0JBQ04sY0FBYztnQkFDZCxjQUFjO2dCQUNkLGlCQUFpQjthQUNsQjtZQUNELFFBQVEsRUFBRTtnQkFDUiw0QkFBNEI7Z0JBQzVCLDRCQUE0QjtnQkFDNUIsNEJBQTRCO2FBQzdCO1NBQ0Y7S0FDRjtDQUNGLENBQUM7QUFFRixJQUFJLENBQUMsMkRBQTJELEVBQUUsR0FBRyxFQUFFO0lBQ3JFLE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO0lBQ2pELE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxFQUFvQixDQUFDO0lBQ25ELE1BQU0sQ0FBQyxzQkFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsRUFBRSxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ3RHLElBQUksQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO0lBQzlDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3hDLE1BQU0sQ0FBQyxzQkFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsRUFBRSxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ3RHLElBQUksQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO0lBQzlDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0lBQ25FLE1BQU0sQ0FBQyxzQkFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsRUFBRSxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ3RHLElBQUksQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO0FBQ2hELENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHFFQUFxRSxFQUFFLEdBQUcsRUFBRTtJQUMvRSxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztJQUNqRCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztJQUNuRCxjQUFjLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUMzQyxjQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMvQyxNQUFNLENBQUMsc0JBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUFDLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUMvRyxJQUFJLENBQUMsU0FBUyxDQUFDLDJDQUEyQyxDQUFDLENBQUMsQ0FBQztJQUMvRCxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztJQUNuRSxNQUFNLENBQUMsc0JBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUFDLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUMvRyxJQUFJLENBQUMsU0FBUyxDQUFDLDJDQUEyQyxDQUFDLENBQUMsQ0FBQztBQUNqRSxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxvRUFBb0UsRUFBRSxHQUFHLEVBQUU7SUFDOUUsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7SUFDakQsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQW9CLENBQUM7SUFDbkQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxhQUFhLEVBQUUsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDL0UsTUFBTSxDQUFDLHNCQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQ0FBa0MsQ0FBQyxFQUFFLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDOUcsSUFBSSxDQUFDLFNBQVMsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDLENBQUM7SUFDOUQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDL0MsTUFBTSxDQUFDLHNCQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQ0FBa0MsQ0FBQyxFQUFFLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDOUcsSUFBSSxDQUFDLFNBQVMsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDLENBQUM7QUFDaEUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsaUZBQWlGLEVBQUUsR0FBRyxFQUFFO0lBQzNGLE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO0lBQ2pELE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxFQUFvQixDQUFDO0lBQ25ELGNBQWMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDaEUsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUM5RCxNQUFNLENBQUMsc0JBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDREQUE0RCxDQUFDLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUN4SSxJQUFJLENBQUMsU0FBUyxDQUFDLG9FQUFvRSxDQUFDLENBQUMsQ0FBQztJQUN4RixjQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNqRCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQywwRkFBMEYsRUFBRSxHQUFHLEVBQUU7SUFDcEcsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7SUFDakQsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQW9CLENBQUM7SUFDbkQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDM0MsY0FBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDL0MsY0FBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxhQUFhLEVBQUUsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDL0UsY0FBYyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sQ0FBQyxzQkFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZ0RBQWdELENBQUMsRUFBRSxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzVILElBQUksQ0FBQyxTQUFTLENBQUMsd0RBQXdELENBQUMsQ0FBQyxDQUFDO0FBQzlFLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtJQUN2RSxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztJQUNqRCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztJQUNuRCxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsc0JBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUFDLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdJLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDREQUE0RCxFQUFFLEdBQUcsRUFBRTtJQUN0RSxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztJQUNqRCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztJQUNuRCxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsc0JBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtDQUFrQyxDQUFDLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzVJLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtJQUNwRCxNQUFNLENBQUMsc0JBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzFFLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHdFQUF3RSxFQUFFLEdBQUcsRUFBRTtJQUNsRixNQUFNLENBQUMsc0JBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMxRixDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyx3RUFBd0UsRUFBRSxHQUFHLEVBQUU7SUFDbEYsTUFBTSxDQUFDLHNCQUFlLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDMUYsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMscUZBQXFGLEVBQUUsR0FBRyxFQUFFO0lBQy9GLE1BQU0sQ0FBQyxzQkFBZSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzVGLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDhEQUE4RCxFQUFFLEdBQUcsRUFBRTtJQUN4RSxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsc0JBQWUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDaEUsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgeyBnZXRUZW1wbGF0ZUZpbGUsIHJlcGxhY2VQYXR0ZXJucywgVEVNUExBVEVTX0RJUiB9IGZyb20gJy4uL3V0aWwnO1xuXG5jb25zdCBtYW5hZ2VKb2JzSnNvbiA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIGAuLi8ke1RFTVBMQVRFU19ESVJ9L21hbmFnZUpvYnMuanNvbmApLCAndXRmOCcpKTtcbmNvbnN0IG1hbmFnZUpvYnNWcGNKc29uID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgYC4uLyR7VEVNUExBVEVTX0RJUn0vbWFuYWdlSm9ic1ZwYy5qc29uYCksICd1dGY4JykpO1xuY29uc3QgbWFuYWdlSm9ic0ttc0pzb24gPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBgLi4vJHtURU1QTEFURVNfRElSfS9tYW5hZ2VKb2JzS21zLmpzb25gKSwgJ3V0ZjgnKSk7XG5jb25zdCBtYW5hZ2VKb2JzVnBjS21zSnNvbiA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIGAuLi8ke1RFTVBMQVRFU19ESVJ9L21hbmFnZUpvYnNWcGNLbXMuanNvbmApLCAndXRmOCcpKTtcblxuY29uc3QgdGVzdFRlbXBsYXRlTm9SZXBsYWNlbWVudHMgPSB7XG4gIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgU3RhdGVtZW50OiBbXG4gICAge1xuICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgQWN0aW9uOiBbXG4gICAgICAgICdzYWdlbWFrZXI6QWRkQXNzb2NpYXRpb24nLFxuICAgICAgICAnc2FnZW1ha2VyOkNyZWF0ZUFjdGlvbicsXG4gICAgICAgICdzYWdlbWFrZXI6Q3JlYXRlQXJ0aWZhY3QnLFxuICAgICAgICAnc2FnZW1ha2VyOkNyZWF0ZUNvbnRleHQnLFxuICAgICAgICAnc2FnZW1ha2VyOkNyZWF0ZUV4cGVyaW1lbnQnLFxuICAgICAgICAnc2FnZW1ha2VyOkNyZWF0ZVRyaWFsJyxcbiAgICAgICAgJ3NhZ2VtYWtlcjpDcmVhdGVUcmlhbENvbXBvbmVudCcsXG4gICAgICAgICdzYWdlbWFrZXI6VXBkYXRlQWN0aW9uJyxcbiAgICAgICAgJ3NhZ2VtYWtlcjpVcGRhdGVBcnRpZmFjdCcsXG4gICAgICAgICdzYWdlbWFrZXI6VXBkYXRlQ29udGV4dCcsXG4gICAgICAgICdzYWdlbWFrZXI6VXBkYXRlRXhwZXJpbWVudCcsXG4gICAgICAgICdzYWdlbWFrZXI6VXBkYXRlVHJpYWwnLFxuICAgICAgICAnc2FnZW1ha2VyOlVwZGF0ZVRyaWFsQ29tcG9uZW50JyxcbiAgICAgICAgJ3NhZ2VtYWtlcjpBc3NvY2lhdGVUcmlhbENvbXBvbmVudCcsXG4gICAgICAgICdzYWdlbWFrZXI6RGlzYXNzb2NpYXRlVHJpYWxDb21wb25lbnQnLFxuICAgICAgICAnc2FnZW1ha2VyOkRlbGV0ZUFzc29jaWF0aW9uJyxcbiAgICAgICAgJ3NhZ2VtYWtlcjpEZWxldGVBY3Rpb24nLFxuICAgICAgICAnc2FnZW1ha2VyOkRlbGV0ZUFydGlmYWN0JyxcbiAgICAgICAgJ3NhZ2VtYWtlcjpEZWxldGVDb250ZXh0JyxcbiAgICAgICAgJ3NhZ2VtYWtlcjpEZWxldGVFeHBlcmltZW50JyxcbiAgICAgICAgJ3NhZ2VtYWtlcjpEZWxldGVUcmlhbCcsXG4gICAgICAgICdzYWdlbWFrZXI6RGVsZXRlVHJpYWxDb21wb25lbnQnLFxuICAgICAgXSxcbiAgICAgIFJlc291cmNlOiAnYXJuOmF3czpzYWdlbWFrZXI6KjoqOiovKicsXG4gICAgfSxcbiAgXSxcbn07XG5cbmNvbnN0IHRlc3RUZW1wbGF0ZVNpbmdsZVZhbHVlUmVwbGFjZW1lbnRzID0ge1xuICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gIFN0YXRlbWVudDogW1xuICAgIHtcbiAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgIEFjdGlvbjogW1xuICAgICAgICAnZ2x1ZTpTZWFyY2hUYWJsZXMnLFxuICAgICAgXSxcbiAgICAgIFJlc291cmNlOiBbXG4gICAgICAgICdhcm46YXdzOmdsdWU6e3tSZWdpb259fTp7e0FjY291bnRJZH19OnRhYmxlLyovKicsXG4gICAgICAgICdhcm46YXdzOmdsdWU6e3tSZWdpb259fTp7e0FjY291bnRJZH19OmRhdGFiYXNlL3Rlc3REYicsXG4gICAgICAgICdhcm46YXdzOmdsdWU6e3tSZWdpb259fTp7e0FjY291bnRJZH19OmNhdGFsb2cnLFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxufTtcblxuY29uc3QgdGVzdFRlbXBsYXRlU2luZ2xlVmFsdWVSZXBsYWNlbWVudHNFeHBlY3RlZCA9IHtcbiAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICBTdGF0ZW1lbnQ6IFtcbiAgICB7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBBY3Rpb246IFtcbiAgICAgICAgJ2dsdWU6U2VhcmNoVGFibGVzJyxcbiAgICAgIF0sXG4gICAgICBSZXNvdXJjZTogW1xuICAgICAgICAnYXJuOmF3czpnbHVlOnRlc3RSZWdpb246dGVzdEFjY291bnQ6dGFibGUvKi8qJyxcbiAgICAgICAgJ2Fybjphd3M6Z2x1ZTp0ZXN0UmVnaW9uOnRlc3RBY2NvdW50OmRhdGFiYXNlL3Rlc3REYicsXG4gICAgICAgICdhcm46YXdzOmdsdWU6dGVzdFJlZ2lvbjp0ZXN0QWNjb3VudDpjYXRhbG9nJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbn07XG5cbmNvbnN0IHRlc3RUZW1wbGF0ZU11bHRpVmFsdWVSZXBsYWNlbWVudHMgPSB7XG4gIEVmZmVjdDogJ0FsbG93JyxcbiAgQWN0aW9uOiBbXG4gICAgJ3MzOkdldE9iamVjdCcsXG4gICAgJ3MzOlB1dE9iamVjdCcsXG4gICAgJ3MzOkdldEJ1Y2tldEFjbCcsXG4gIF0sXG4gIFJlc291cmNlOiBbXG4gICAgJ2Fybjphd3M6czM6OjpbW1MzQnVja2V0c11dLyonLFxuICBdLFxufTtcblxuY29uc3QgdGVzdFRlbXBsYXRlTXVsdGlWYWx1ZVJlcGxhY2VtZW50c0V4cGVjdGVkID0ge1xuICBFZmZlY3Q6ICdBbGxvdycsXG4gIEFjdGlvbjogW1xuICAgICdzMzpHZXRPYmplY3QnLFxuICAgICdzMzpQdXRPYmplY3QnLFxuICAgICdzMzpHZXRCdWNrZXRBY2wnLFxuICBdLFxuICBSZXNvdXJjZTogW1xuICAgICdhcm46YXdzOnMzOjo6dGVzdEJ1Y2tldDEvKicsXG4gICAgJ2Fybjphd3M6czM6Ojp0ZXN0QnVja2V0Mi8qJyxcbiAgICAnYXJuOmF3czpzMzo6OnRlc3RCdWNrZXQzLyonLFxuICBdLFxufTtcblxuY29uc3QgdGVzdFRlbXBsYXRlTXVsdGlWYWx1ZVJlcGxhY2VtZW50c1dpdGhSZXBsYWNlbWVudHNJblNhbWVMaW5lID0ge1xuICBFZmZlY3Q6ICdBbGxvdycsXG4gIEFjdGlvbjogW1xuICAgICdzMzpHZXRPYmplY3QnLFxuICAgICdzMzpQdXRPYmplY3QnLFxuICBdLFxuICBSZXNvdXJjZTogW1xuICAgICdhcm46YXdzOnMzOjo6W1tTM0J1Y2tldHNdXS9bW09iamVjdHNdXScsXG4gIF0sXG59O1xuXG5jb25zdCB0ZXN0VGVtcGxhdGVNdWx0aVZhbHVlUmVwbGFjZW1lbnRzV2l0aFJlcGxhY2VtZW50c0luU2FtZUxpbmVFeHBlY3RlZCA9IHtcbiAgRWZmZWN0OiAnQWxsb3cnLFxuICBBY3Rpb246IFtcbiAgICAnczM6R2V0T2JqZWN0JyxcbiAgICAnczM6UHV0T2JqZWN0JyxcbiAgXSxcbiAgUmVzb3VyY2U6IFtcbiAgICAnYXJuOmF3czpzMzo6OnRlc3RCdWNrZXQxL3Rlc3RPYmplY3QxJyxcbiAgICAnYXJuOmF3czpzMzo6OnRlc3RCdWNrZXQxL3Rlc3RPYmplY3QyJyxcbiAgICAnYXJuOmF3czpzMzo6OnRlc3RCdWNrZXQyL3Rlc3RPYmplY3QxJyxcbiAgICAnYXJuOmF3czpzMzo6OnRlc3RCdWNrZXQyL3Rlc3RPYmplY3QyJyxcbiAgXSxcbn07XG5cbmNvbnN0IHRlc3RUZW1wbGF0ZU11bHRpVmFsdWVBbmRTaW5nbGVWYWx1ZVJlcGxhY2VtZW50cyA9IHtcbiAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICBTdGF0ZW1lbnQ6IFtcbiAgICB7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBBY3Rpb246IFtcbiAgICAgICAgJ2dsdWU6U2VhcmNoVGFibGVzJyxcbiAgICAgIF0sXG4gICAgICBSZXNvdXJjZTogW1xuICAgICAgICAnYXJuOmF3czpnbHVlOnt7UmVnaW9ufX06e3tBY2NvdW50SWR9fTp0YWJsZS8qLyonLFxuICAgICAgICAnYXJuOmF3czpnbHVlOnt7UmVnaW9ufX06e3tBY2NvdW50SWR9fTpkYXRhYmFzZS9bW0dsdWVEYk5hbWVzXV0nLFxuICAgICAgICAnYXJuOmF3czpnbHVlOnt7UmVnaW9ufX06e3tBY2NvdW50SWR9fTpjYXRhbG9nJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBBY3Rpb246IFtcbiAgICAgICAgJ3MzOkdldE9iamVjdCcsXG4gICAgICAgICdzMzpQdXRPYmplY3QnLFxuICAgICAgICAnczM6R2V0QnVja2V0QWNsJyxcbiAgICAgIF0sXG4gICAgICBSZXNvdXJjZTogW1xuICAgICAgICAnYXJuOmF3czpzMzo6OltbUzNCdWNrZXRzXV0vKicsXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG59O1xuXG5jb25zdCB0ZXN0VGVtcGxhdGVNdWx0aVZhbHVlQW5kU2luZ2xlVmFsdWVSZXBsYWNlbWVudHNFeHBlY3RlZCA9IHtcbiAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICBTdGF0ZW1lbnQ6IFtcbiAgICB7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBBY3Rpb246IFtcbiAgICAgICAgJ2dsdWU6U2VhcmNoVGFibGVzJyxcbiAgICAgIF0sXG4gICAgICBSZXNvdXJjZTogW1xuICAgICAgICAnYXJuOmF3czpnbHVlOnRlc3RSZWdpb246dGVzdEFjY291bnQ6dGFibGUvKi8qJyxcbiAgICAgICAgJ2Fybjphd3M6Z2x1ZTp0ZXN0UmVnaW9uOnRlc3RBY2NvdW50OmRhdGFiYXNlL3Rlc3REYicsXG4gICAgICAgICdhcm46YXdzOmdsdWU6dGVzdFJlZ2lvbjp0ZXN0QWNjb3VudDpjYXRhbG9nJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBBY3Rpb246IFtcbiAgICAgICAgJ3MzOkdldE9iamVjdCcsXG4gICAgICAgICdzMzpQdXRPYmplY3QnLFxuICAgICAgICAnczM6R2V0QnVja2V0QWNsJyxcbiAgICAgIF0sXG4gICAgICBSZXNvdXJjZTogW1xuICAgICAgICAnYXJuOmF3czpzMzo6OnRlc3RCdWNrZXQxLyonLFxuICAgICAgICAnYXJuOmF3czpzMzo6OnRlc3RCdWNrZXQyLyonLFxuICAgICAgICAnYXJuOmF3czpzMzo6OnRlc3RCdWNrZXQzLyonLFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxufTtcblxudGVzdCgndGVzdCByZXBsYWNlIHBhdHRlcm5zIGZvciBoYXBweSBjYXNlIHdpdGggbm8gcmVwbGFjZW1lbnRzJywgKCkgPT4ge1xuICBjb25zdCBzdlJlcGxhY2VtZW50cyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IG12UmVwbGFjZW1lbnRzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xuICBleHBlY3QocmVwbGFjZVBhdHRlcm5zKEpTT04uc3RyaW5naWZ5KHRlc3RUZW1wbGF0ZU5vUmVwbGFjZW1lbnRzKSwgc3ZSZXBsYWNlbWVudHMsIG12UmVwbGFjZW1lbnRzKSkudG9CZShcbiAgICBKU09OLnN0cmluZ2lmeSh0ZXN0VGVtcGxhdGVOb1JlcGxhY2VtZW50cykpO1xuICBzdlJlcGxhY2VtZW50cy5zZXQoJ3Rlc3QnLCAndGVzdFZhbHVlJyk7XG4gIGV4cGVjdChyZXBsYWNlUGF0dGVybnMoSlNPTi5zdHJpbmdpZnkodGVzdFRlbXBsYXRlTm9SZXBsYWNlbWVudHMpLCBzdlJlcGxhY2VtZW50cywgbXZSZXBsYWNlbWVudHMpKS50b0JlKFxuICAgIEpTT04uc3RyaW5naWZ5KHRlc3RUZW1wbGF0ZU5vUmVwbGFjZW1lbnRzKSk7XG4gIG12UmVwbGFjZW1lbnRzLnNldCgndGVzdCcsIFsndGVzdE11bHRpVmFsdWUxJywgJ3Rlc3RNdWx0aVZhbHVlMiddKTtcbiAgZXhwZWN0KHJlcGxhY2VQYXR0ZXJucyhKU09OLnN0cmluZ2lmeSh0ZXN0VGVtcGxhdGVOb1JlcGxhY2VtZW50cyksIHN2UmVwbGFjZW1lbnRzLCBtdlJlcGxhY2VtZW50cykpLnRvQmUoXG4gICAgSlNPTi5zdHJpbmdpZnkodGVzdFRlbXBsYXRlTm9SZXBsYWNlbWVudHMpKTtcbn0pO1xuXG50ZXN0KCd0ZXN0IHJlcGxhY2UgcGF0dGVybnMgZm9yIGhhcHB5IGNhc2Ugd2l0aCBzaW5nbGUgdmFsdWUgcmVwbGFjZW1lbnRzJywgKCkgPT4ge1xuICBjb25zdCBzdlJlcGxhY2VtZW50cyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IG12UmVwbGFjZW1lbnRzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xuICBzdlJlcGxhY2VtZW50cy5zZXQoJ1JlZ2lvbicsICd0ZXN0UmVnaW9uJyk7XG4gIHN2UmVwbGFjZW1lbnRzLnNldCgnQWNjb3VudElkJywgJ3Rlc3RBY2NvdW50Jyk7XG4gIGV4cGVjdChyZXBsYWNlUGF0dGVybnMoSlNPTi5zdHJpbmdpZnkodGVzdFRlbXBsYXRlU2luZ2xlVmFsdWVSZXBsYWNlbWVudHMpLCBzdlJlcGxhY2VtZW50cywgbXZSZXBsYWNlbWVudHMpKS50b0JlKFxuICAgIEpTT04uc3RyaW5naWZ5KHRlc3RUZW1wbGF0ZVNpbmdsZVZhbHVlUmVwbGFjZW1lbnRzRXhwZWN0ZWQpKTtcbiAgbXZSZXBsYWNlbWVudHMuc2V0KCd0ZXN0JywgWyd0ZXN0TXVsdGlWYWx1ZTEnLCAndGVzdE11bHRpVmFsdWUyJ10pO1xuICBleHBlY3QocmVwbGFjZVBhdHRlcm5zKEpTT04uc3RyaW5naWZ5KHRlc3RUZW1wbGF0ZVNpbmdsZVZhbHVlUmVwbGFjZW1lbnRzKSwgc3ZSZXBsYWNlbWVudHMsIG12UmVwbGFjZW1lbnRzKSkudG9CZShcbiAgICBKU09OLnN0cmluZ2lmeSh0ZXN0VGVtcGxhdGVTaW5nbGVWYWx1ZVJlcGxhY2VtZW50c0V4cGVjdGVkKSk7XG59KTtcblxudGVzdCgndGVzdCByZXBsYWNlIHBhdHRlcm5zIGZvciBoYXBweSBjYXNlIHdpdGggbXVsdGkgdmFsdWUgcmVwbGFjZW1lbnRzJywgKCkgPT4ge1xuICBjb25zdCBzdlJlcGxhY2VtZW50cyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IG12UmVwbGFjZW1lbnRzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xuICBtdlJlcGxhY2VtZW50cy5zZXQoJ1MzQnVja2V0cycsIFsndGVzdEJ1Y2tldDEnLCAndGVzdEJ1Y2tldDInLCAndGVzdEJ1Y2tldDMnXSk7XG4gIGV4cGVjdChyZXBsYWNlUGF0dGVybnMoSlNPTi5zdHJpbmdpZnkodGVzdFRlbXBsYXRlTXVsdGlWYWx1ZVJlcGxhY2VtZW50cyksIHN2UmVwbGFjZW1lbnRzLCBtdlJlcGxhY2VtZW50cykpLnRvQmUoXG4gICAgSlNPTi5zdHJpbmdpZnkodGVzdFRlbXBsYXRlTXVsdGlWYWx1ZVJlcGxhY2VtZW50c0V4cGVjdGVkKSk7XG4gIHN2UmVwbGFjZW1lbnRzLnNldCgnQWNjb3VudElkJywgJ3Rlc3RBY2NvdW50Jyk7XG4gIGV4cGVjdChyZXBsYWNlUGF0dGVybnMoSlNPTi5zdHJpbmdpZnkodGVzdFRlbXBsYXRlTXVsdGlWYWx1ZVJlcGxhY2VtZW50cyksIHN2UmVwbGFjZW1lbnRzLCBtdlJlcGxhY2VtZW50cykpLnRvQmUoXG4gICAgSlNPTi5zdHJpbmdpZnkodGVzdFRlbXBsYXRlTXVsdGlWYWx1ZVJlcGxhY2VtZW50c0V4cGVjdGVkKSk7XG59KTtcblxudGVzdCgndGVzdCByZXBsYWNlIHBhdHRlcm5zIGZvciBoYXBweSBjYXNlIHdpdGggbXVsdGkgdmFsdWUgcmVwbGFjZW1lbnRzIGluIHNhbWUgbGluZScsICgpID0+IHtcbiAgY29uc3Qgc3ZSZXBsYWNlbWVudHMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCBtdlJlcGxhY2VtZW50cyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgbXZSZXBsYWNlbWVudHMuc2V0KCdTM0J1Y2tldHMnLCBbJ3Rlc3RCdWNrZXQxJywgJ3Rlc3RCdWNrZXQyJ10pO1xuICBtdlJlcGxhY2VtZW50cy5zZXQoJ09iamVjdHMnLCBbJ3Rlc3RPYmplY3QxJywgJ3Rlc3RPYmplY3QyJ10pO1xuICBleHBlY3QocmVwbGFjZVBhdHRlcm5zKEpTT04uc3RyaW5naWZ5KHRlc3RUZW1wbGF0ZU11bHRpVmFsdWVSZXBsYWNlbWVudHNXaXRoUmVwbGFjZW1lbnRzSW5TYW1lTGluZSksIHN2UmVwbGFjZW1lbnRzLCBtdlJlcGxhY2VtZW50cykpLnRvQmUoXG4gICAgSlNPTi5zdHJpbmdpZnkodGVzdFRlbXBsYXRlTXVsdGlWYWx1ZVJlcGxhY2VtZW50c1dpdGhSZXBsYWNlbWVudHNJblNhbWVMaW5lRXhwZWN0ZWQpKTtcbiAgc3ZSZXBsYWNlbWVudHMuc2V0KCdBY2NvdW50SWQnLCAndGVzdEFjY291bnQnKTtcbn0pO1xuXG50ZXN0KCd0ZXN0IHJlcGxhY2UgcGF0dGVybnMgZm9yIGhhcHB5IGNhc2Ugd2l0aCBib3RoIG11bHRpIHZhbHVlIGFuZCBzaW5nbGUgdmFsdWUgcmVwbGFjZW1lbnRzJywgKCkgPT4ge1xuICBjb25zdCBzdlJlcGxhY2VtZW50cyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IG12UmVwbGFjZW1lbnRzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xuICBzdlJlcGxhY2VtZW50cy5zZXQoJ1JlZ2lvbicsICd0ZXN0UmVnaW9uJyk7XG4gIHN2UmVwbGFjZW1lbnRzLnNldCgnQWNjb3VudElkJywgJ3Rlc3RBY2NvdW50Jyk7XG4gIG12UmVwbGFjZW1lbnRzLnNldCgnUzNCdWNrZXRzJywgWyd0ZXN0QnVja2V0MScsICd0ZXN0QnVja2V0MicsICd0ZXN0QnVja2V0MyddKTtcbiAgbXZSZXBsYWNlbWVudHMuc2V0KCdHbHVlRGJOYW1lcycsIFsndGVzdERiJ10pO1xuICBleHBlY3QocmVwbGFjZVBhdHRlcm5zKEpTT04uc3RyaW5naWZ5KHRlc3RUZW1wbGF0ZU11bHRpVmFsdWVBbmRTaW5nbGVWYWx1ZVJlcGxhY2VtZW50cyksIHN2UmVwbGFjZW1lbnRzLCBtdlJlcGxhY2VtZW50cykpLnRvQmUoXG4gICAgSlNPTi5zdHJpbmdpZnkodGVzdFRlbXBsYXRlTXVsdGlWYWx1ZUFuZFNpbmdsZVZhbHVlUmVwbGFjZW1lbnRzRXhwZWN0ZWQpKTtcbn0pO1xuXG50ZXN0KCd0ZXN0IHJlcGxhY2UgcGF0dGVybnMgd2l0aCBtaXNzaW5nIHNpbmdsZSB2YWx1ZSByZXBsYWNlbWVudCcsICgpID0+IHtcbiAgY29uc3Qgc3ZSZXBsYWNlbWVudHMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCBtdlJlcGxhY2VtZW50cyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgZXhwZWN0KCgpID0+IHsgcmVwbGFjZVBhdHRlcm5zKEpTT04uc3RyaW5naWZ5KHRlc3RUZW1wbGF0ZVNpbmdsZVZhbHVlUmVwbGFjZW1lbnRzKSwgc3ZSZXBsYWNlbWVudHMsIG12UmVwbGFjZW1lbnRzKTsgfSkudG9UaHJvdyhUeXBlRXJyb3IpO1xufSk7XG5cbnRlc3QoJ3Rlc3QgcmVwbGFjZSBwYXR0ZXJucyB3aXRoIG1pc3NpbmcgbXVsdGkgdmFsdWUgcmVwbGFjZW1lbnQnLCAoKSA9PiB7XG4gIGNvbnN0IHN2UmVwbGFjZW1lbnRzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgY29uc3QgbXZSZXBsYWNlbWVudHMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nW10+KCk7XG4gIGV4cGVjdCgoKSA9PiB7IHJlcGxhY2VQYXR0ZXJucyhKU09OLnN0cmluZ2lmeSh0ZXN0VGVtcGxhdGVNdWx0aVZhbHVlUmVwbGFjZW1lbnRzKSwgc3ZSZXBsYWNlbWVudHMsIG12UmVwbGFjZW1lbnRzKTsgfSkudG9UaHJvdyhUeXBlRXJyb3IpO1xufSk7XG5cbnRlc3QoJ2dldFRlbXBsYXRlRmlsZSB3aXRoIHZhbGlkIGFjdGl2aXR5IG5hbWUnLCAoKSA9PiB7XG4gIGV4cGVjdChnZXRUZW1wbGF0ZUZpbGUobWFuYWdlSm9ic0pzb24ubmFtZSwgMSkpLnRvRXF1YWwobWFuYWdlSm9ic0pzb24pO1xufSk7XG5cbnRlc3QoJ2dldFRlbXBsYXRlRmlsZSB3aXRoIHZhbGlkIGFjdGl2aXR5IG5hbWUgYW5kIHZwYyBjdXN0b21pemF0aW9uIGVuYWJsZWQnLCAoKSA9PiB7XG4gIGV4cGVjdChnZXRUZW1wbGF0ZUZpbGUobWFuYWdlSm9ic0pzb24ubmFtZSwgMSwgdHJ1ZSwgZmFsc2UpKS50b0VxdWFsKG1hbmFnZUpvYnNWcGNKc29uKTtcbn0pO1xuXG50ZXN0KCdnZXRUZW1wbGF0ZUZpbGUgd2l0aCB2YWxpZCBhY3Rpdml0eSBuYW1lIGFuZCBrbXMgY3VzdG9taXphdGlvbiBlbmFibGVkJywgKCkgPT4ge1xuICBleHBlY3QoZ2V0VGVtcGxhdGVGaWxlKG1hbmFnZUpvYnNKc29uLm5hbWUsIDEsIGZhbHNlLCB0cnVlKSkudG9FcXVhbChtYW5hZ2VKb2JzS21zSnNvbik7XG59KTtcblxudGVzdCgnZ2V0VGVtcGxhdGVGaWxlIHdpdGggdmFsaWQgYWN0aXZpdHkgbmFtZSBhbmQgYm90aCB2cGMgYW5kIGttcyBjdXN0b21pemF0aW9uIGVuYWJsZWQnLCAoKSA9PiB7XG4gIGV4cGVjdChnZXRUZW1wbGF0ZUZpbGUobWFuYWdlSm9ic0pzb24ubmFtZSwgMSwgdHJ1ZSwgdHJ1ZSkpLnRvRXF1YWwobWFuYWdlSm9ic1ZwY0ttc0pzb24pO1xufSk7XG5cbnRlc3QoJ2dldFRlbXBsYXRlRmlsZSB3aXRoIGludmFsaWQgYWN0aXZpdHkgbmFtZSB0aHJvd3MgUmFuZ2VFcnJvcicsICgpID0+IHtcbiAgZXhwZWN0KCgpID0+IHsgZ2V0VGVtcGxhdGVGaWxlKCcnLCAxKTsgfSkudG9UaHJvdyhSYW5nZUVycm9yKTtcbn0pO1xuIl19