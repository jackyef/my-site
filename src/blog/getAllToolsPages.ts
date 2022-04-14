function importAll(r: any) {
  return r.keys().map((fileName: string) => ({
    link: `/tools${fileName.substr(1).replace(/\.tsx$/, '')}`,
    module: r(fileName),
  }));
}

export function getAllToolsPages() {
  return importAll(require.context('../pages/tools', true, /\.tsx$/));
}
