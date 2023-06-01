"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Persona = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("aws-cdk-lib/aws-iam");
const constructs_1 = require("constructs");
class Persona extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        if (props.activities.length === 0) {
            throw TypeError('The array activities must be of type Activity[] with at least one element.');
        }
        this.activities = props.activities;
        const activityNames = this.activities.map((activity) => { return activity.activityName; });
        if (activityNames.length !== new Set(activityNames).size) {
            throw TypeError('The array activities must be of type Activity[] and must not contain duplicate activities.');
        }
        this.customizeVPC(props.subnets, props.securityGroups);
        this.customizeKMS(props.dataKeys, props.volumeKeys);
    }
    /**
       * Creates role with permissions of persona
       * @param scope the Construct scope.
       * @param id the resource id.
       * @param roleNameSuffix the name suffix of the role that will be created, if empty the role will have the name of the activity.
       * @param roleDescription the description of the role that will be created.
       * @returns - The role that is created with the permissions of the persona
       */
    createRole(scope, id, roleNameSuffix, roleDescription = '') {
        if (!roleNameSuffix || !roleNameSuffix.length) {
            throw TypeError('The role name should be a non empty string');
        }
        const policies = [];
        for (const activity of this.activities) {
            policies.push(activity.createPolicy(scope));
        }
        const role = new iam.Role(scope, id, {
            roleName: `SageMaker-${roleNameSuffix}`,
            description: roleDescription,
            assumedBy: this.activities[0].createPrincipal(),
        });
        for (const policy of policies) {
            role.attachInlinePolicy(policy);
        }
        return role;
    }
    customizeVPC(subnets, securityGroups) {
        if (!subnets && !securityGroups) {
            return;
        }
        if (!subnets || !subnets.length) {
            throw TypeError('The array subnets must be of type ec2.ISubnet[] with at least one element.');
        }
        if (!securityGroups || !securityGroups.length) {
            throw TypeError('The array securityGroups must be of type ec2.ISecurityGroup[] with at least one element.');
        }
        for (const activity of this.activities) {
            activity.customizeVPC(subnets, securityGroups);
        }
    }
    customizeKMS(dataKeys, volumeKeys) {
        if (!dataKeys && !volumeKeys) {
            return;
        }
        if (!dataKeys || !dataKeys.length) {
            throw TypeError('The array dataKeys must be of type kms.IKey[] with at least one element.');
        }
        if (!volumeKeys || !volumeKeys.length) {
            throw TypeError('The array volumeKeys must be of type kms.IKey[] with at least one element.');
        }
        for (const activity of this.activities) {
            activity.customizeKMS(dataKeys, volumeKeys);
        }
    }
    /**
       * Grant permissions of activity to identity
       * @param identity identity to be granted permissions
       * @returns - The grant with the permissions granted to the identity
       */
    grantPermissionsTo(identity) {
        let grant = this.activities[0].grantPermissionsTo(identity);
        for (let i = 1; i < this.activities.length; i++) {
            grant = grant.combine(this.activities[i].grantPermissionsTo(identity));
        }
        return grant;
    }
}
exports.Persona = Persona;
_a = JSII_RTTI_SYMBOL_1;
Persona[_a] = { fqn: "cdk-aws-sagemaker-role-manager.Persona", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc29uYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wZXJzb25hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsMkNBQTJDO0FBRTNDLDJDQUF1QztBQVl2QyxNQUFhLE9BQVEsU0FBUSxzQkFBUztJQUlwQyxZQUFtQixLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFtQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2pDLE1BQU0sU0FBUyxDQUFDLDRFQUE0RSxDQUFDLENBQUM7U0FDL0Y7UUFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFFbkMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFFLE9BQU8sUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDO1FBQ3pGLElBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDeEQsTUFBTSxTQUFTLENBQUMsNEZBQTRGLENBQUMsQ0FBQztTQUMvRztRQUVELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQ7Ozs7Ozs7U0FPSztJQUNFLFVBQVUsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxjQUFzQixFQUFFLGtCQUEwQixFQUFFO1FBQ2xHLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO1lBQzdDLE1BQU0sU0FBUyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7U0FDL0Q7UUFFRCxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFFcEIsS0FBSyxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3RDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQzdDO1FBRUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDbkMsUUFBUSxFQUFFLGFBQWEsY0FBYyxFQUFFO1lBQ3ZDLFdBQVcsRUFBRSxlQUFlO1lBQzVCLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRTtTQUNoRCxDQUFDLENBQUM7UUFFSCxLQUFLLE1BQU0sTUFBTSxJQUFJLFFBQVEsRUFBRTtZQUM3QixJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDakM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxZQUFZLENBQUMsT0FBdUIsRUFBRSxjQUFxQztRQUNoRixJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQy9CLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO1lBQy9CLE1BQU0sU0FBUyxDQUFDLDRFQUE0RSxDQUFDLENBQUM7U0FDL0Y7UUFDRCxJQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRTtZQUM3QyxNQUFNLFNBQVMsQ0FBQywwRkFBMEYsQ0FBQyxDQUFDO1NBQzdHO1FBRUQsS0FBSyxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3RDLFFBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQ2hEO0lBQ0gsQ0FBQztJQUVNLFlBQVksQ0FBQyxRQUFxQixFQUFFLFVBQXVCO1FBQ2hFLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDNUIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDakMsTUFBTSxTQUFTLENBQUMsMEVBQTBFLENBQUMsQ0FBQztTQUM3RjtRQUNELElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO1lBQ3JDLE1BQU0sU0FBUyxDQUFDLDRFQUE0RSxDQUFDLENBQUM7U0FDL0Y7UUFFRCxLQUFLLE1BQU0sUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDdEMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDN0M7SUFDSCxDQUFDO0lBRUQ7Ozs7U0FJSztJQUNFLGtCQUFrQixDQUFDLFFBQXdCO1FBQ2hELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9DLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUN4RTtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7QUFwR0gsMEJBc0dDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1rbXMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmltcG9ydCB7XG4gIEFjdGl2aXR5LFxuICBWUENPcHRpb25zLFxuICBLTVNPcHRpb25zLFxufSBmcm9tICcuL2FjdGl2aXR5JztcblxuZXhwb3J0IGludGVyZmFjZSBQZXJzb25hUHJvcHMgZXh0ZW5kcyBWUENPcHRpb25zLCBLTVNPcHRpb25zIHtcbiAgcmVhZG9ubHkgYWN0aXZpdGllczogQWN0aXZpdHlbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFBlcnNvbmEgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gIHB1YmxpYyByZWFkb25seSBhY3Rpdml0aWVzOiBBY3Rpdml0eVtdO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUGVyc29uYVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGlmIChwcm9wcy5hY3Rpdml0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdUaGUgYXJyYXkgYWN0aXZpdGllcyBtdXN0IGJlIG9mIHR5cGUgQWN0aXZpdHlbXSB3aXRoIGF0IGxlYXN0IG9uZSBlbGVtZW50LicpO1xuICAgIH1cblxuICAgIHRoaXMuYWN0aXZpdGllcyA9IHByb3BzLmFjdGl2aXRpZXM7XG5cbiAgICBjb25zdCBhY3Rpdml0eU5hbWVzID0gdGhpcy5hY3Rpdml0aWVzLm1hcCgoYWN0aXZpdHkpID0+IHtyZXR1cm4gYWN0aXZpdHkuYWN0aXZpdHlOYW1lO30pO1xuICAgIGlmIChhY3Rpdml0eU5hbWVzLmxlbmd0aCAhPT0gbmV3IFNldChhY3Rpdml0eU5hbWVzKS5zaXplKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1RoZSBhcnJheSBhY3Rpdml0aWVzIG11c3QgYmUgb2YgdHlwZSBBY3Rpdml0eVtdIGFuZCBtdXN0IG5vdCBjb250YWluIGR1cGxpY2F0ZSBhY3Rpdml0aWVzLicpO1xuICAgIH1cblxuICAgIHRoaXMuY3VzdG9taXplVlBDKHByb3BzLnN1Ym5ldHMsIHByb3BzLnNlY3VyaXR5R3JvdXBzKTtcbiAgICB0aGlzLmN1c3RvbWl6ZUtNUyhwcm9wcy5kYXRhS2V5cywgcHJvcHMudm9sdW1lS2V5cyk7XG4gIH1cblxuICAvKipcbiAgICAgKiBDcmVhdGVzIHJvbGUgd2l0aCBwZXJtaXNzaW9ucyBvZiBwZXJzb25hXG4gICAgICogQHBhcmFtIHNjb3BlIHRoZSBDb25zdHJ1Y3Qgc2NvcGUuXG4gICAgICogQHBhcmFtIGlkIHRoZSByZXNvdXJjZSBpZC5cbiAgICAgKiBAcGFyYW0gcm9sZU5hbWVTdWZmaXggdGhlIG5hbWUgc3VmZml4IG9mIHRoZSByb2xlIHRoYXQgd2lsbCBiZSBjcmVhdGVkLCBpZiBlbXB0eSB0aGUgcm9sZSB3aWxsIGhhdmUgdGhlIG5hbWUgb2YgdGhlIGFjdGl2aXR5LlxuICAgICAqIEBwYXJhbSByb2xlRGVzY3JpcHRpb24gdGhlIGRlc2NyaXB0aW9uIG9mIHRoZSByb2xlIHRoYXQgd2lsbCBiZSBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIC0gVGhlIHJvbGUgdGhhdCBpcyBjcmVhdGVkIHdpdGggdGhlIHBlcm1pc3Npb25zIG9mIHRoZSBwZXJzb25hXG4gICAgICovXG4gIHB1YmxpYyBjcmVhdGVSb2xlKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJvbGVOYW1lU3VmZml4OiBzdHJpbmcsIHJvbGVEZXNjcmlwdGlvbjogc3RyaW5nID0gJycpOiBpYW0uSVJvbGUge1xuICAgIGlmICghcm9sZU5hbWVTdWZmaXggfHwgIXJvbGVOYW1lU3VmZml4Lmxlbmd0aCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdUaGUgcm9sZSBuYW1lIHNob3VsZCBiZSBhIG5vbiBlbXB0eSBzdHJpbmcnKTtcbiAgICB9XG5cbiAgICBjb25zdCBwb2xpY2llcyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBhY3Rpdml0eSBvZiB0aGlzLmFjdGl2aXRpZXMpIHtcbiAgICAgIHBvbGljaWVzLnB1c2goYWN0aXZpdHkuY3JlYXRlUG9saWN5KHNjb3BlKSk7XG4gICAgfVxuXG4gICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzY29wZSwgaWQsIHtcbiAgICAgIHJvbGVOYW1lOiBgU2FnZU1ha2VyLSR7cm9sZU5hbWVTdWZmaXh9YCxcbiAgICAgIGRlc2NyaXB0aW9uOiByb2xlRGVzY3JpcHRpb24sXG4gICAgICBhc3N1bWVkQnk6IHRoaXMuYWN0aXZpdGllc1swXS5jcmVhdGVQcmluY2lwYWwoKSxcbiAgICB9KTtcblxuICAgIGZvciAoY29uc3QgcG9saWN5IG9mIHBvbGljaWVzKSB7XG4gICAgICByb2xlLmF0dGFjaElubGluZVBvbGljeShwb2xpY3kpO1xuICAgIH1cblxuICAgIHJldHVybiByb2xlO1xuICB9XG5cbiAgcHVibGljIGN1c3RvbWl6ZVZQQyhzdWJuZXRzPzogZWMyLklTdWJuZXRbXSwgc2VjdXJpdHlHcm91cHM/OiBlYzIuSVNlY3VyaXR5R3JvdXBbXSkge1xuICAgIGlmICghc3VibmV0cyAmJiAhc2VjdXJpdHlHcm91cHMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXN1Ym5ldHMgfHwgIXN1Ym5ldHMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1RoZSBhcnJheSBzdWJuZXRzIG11c3QgYmUgb2YgdHlwZSBlYzIuSVN1Ym5ldFtdIHdpdGggYXQgbGVhc3Qgb25lIGVsZW1lbnQuJyk7XG4gICAgfVxuICAgIGlmICghc2VjdXJpdHlHcm91cHMgfHwgIXNlY3VyaXR5R3JvdXBzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdUaGUgYXJyYXkgc2VjdXJpdHlHcm91cHMgbXVzdCBiZSBvZiB0eXBlIGVjMi5JU2VjdXJpdHlHcm91cFtdIHdpdGggYXQgbGVhc3Qgb25lIGVsZW1lbnQuJyk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBhY3Rpdml0eSBvZiB0aGlzLmFjdGl2aXRpZXMpIHtcbiAgICAgIGFjdGl2aXR5LmN1c3RvbWl6ZVZQQyhzdWJuZXRzLCBzZWN1cml0eUdyb3Vwcyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGN1c3RvbWl6ZUtNUyhkYXRhS2V5cz86IGttcy5JS2V5W10sIHZvbHVtZUtleXM/OiBrbXMuSUtleVtdKSB7XG4gICAgaWYgKCFkYXRhS2V5cyAmJiAhdm9sdW1lS2V5cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghZGF0YUtleXMgfHwgIWRhdGFLZXlzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdUaGUgYXJyYXkgZGF0YUtleXMgbXVzdCBiZSBvZiB0eXBlIGttcy5JS2V5W10gd2l0aCBhdCBsZWFzdCBvbmUgZWxlbWVudC4nKTtcbiAgICB9XG4gICAgaWYgKCF2b2x1bWVLZXlzIHx8ICF2b2x1bWVLZXlzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdUaGUgYXJyYXkgdm9sdW1lS2V5cyBtdXN0IGJlIG9mIHR5cGUga21zLklLZXlbXSB3aXRoIGF0IGxlYXN0IG9uZSBlbGVtZW50LicpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgYWN0aXZpdHkgb2YgdGhpcy5hY3Rpdml0aWVzKSB7XG4gICAgICBhY3Rpdml0eS5jdXN0b21pemVLTVMoZGF0YUtleXMsIHZvbHVtZUtleXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgICAqIEdyYW50IHBlcm1pc3Npb25zIG9mIGFjdGl2aXR5IHRvIGlkZW50aXR5XG4gICAgICogQHBhcmFtIGlkZW50aXR5IGlkZW50aXR5IHRvIGJlIGdyYW50ZWQgcGVybWlzc2lvbnNcbiAgICAgKiBAcmV0dXJucyAtIFRoZSBncmFudCB3aXRoIHRoZSBwZXJtaXNzaW9ucyBncmFudGVkIHRvIHRoZSBpZGVudGl0eVxuICAgICAqL1xuICBwdWJsaWMgZ3JhbnRQZXJtaXNzaW9uc1RvKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgbGV0IGdyYW50ID0gdGhpcy5hY3Rpdml0aWVzWzBdLmdyYW50UGVybWlzc2lvbnNUbyhpZGVudGl0eSk7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmFjdGl2aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGdyYW50ID0gZ3JhbnQuY29tYmluZSh0aGlzLmFjdGl2aXRpZXNbaV0uZ3JhbnRQZXJtaXNzaW9uc1RvKGlkZW50aXR5KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdyYW50O1xuICB9XG5cbn1cbiJdfQ==