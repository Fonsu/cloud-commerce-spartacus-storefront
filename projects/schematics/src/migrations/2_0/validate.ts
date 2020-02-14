import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import {
  getAngularVersion,
  getMajorVersionNumber,
} from '../../shared/utils/package-utils';

// TODO:#6520 - validation seems to be ran before all other migrations.
// TODO:#6520 - Also, the changes do not seem to be rolled back after the validation fails

export function validate(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const angularVersion = getAngularVersion(tree);
    validateAngularVersion(angularVersion);

    return tree;
  };
}

export function validateAngularVersion(angularVersion: string): void {
  const majorVersion = getMajorVersionNumber(angularVersion);
  if (majorVersion < 9) {
    throw new SchematicsException(
      `Spartacus requires angular version 9.
Please reset your git repo, re-install node_modules and run 'ng update @angular/cli @angular/core' before upgrading Spartacus.`
    );
  }
}