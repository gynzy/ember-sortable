local util = import '.github/jsonnet/index.jsonnet';

util.workflowJavascriptPackage(
  repositories=['github'],
  packageManager='pnpm',
  branch='main',
  isPublicFork=true,
  testJob=null,
)
