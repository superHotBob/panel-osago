function defaultTemplate(
    { template },
    opts,
    { imports, interfaces, componentName, props, jsx, exports },
) {
    const plugins = ['jsx']
    if (opts.typescript) {
        plugins.push('typescript')
    }
    const typeScriptTpl = template.smart({ plugins })
    return typeScriptTpl.ast`${imports}
${interfaces}
const ${componentName} = React.forwardRef((${props}, ref) => {
  props = {...props, ref};
  return ${jsx};
})
${exports}
  `
}
module.exports = defaultTemplate
