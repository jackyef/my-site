// needed to map token to tailwind classes
const tokenClassNames = {
  tag: 'text-code-red',
  'attr-name': 'text-code-yellow',
  'attr-value': 'text-code-green',
  deleted: 'text-code-red',
  inserted: 'text-code-green',
  punctuation: 'text-code-white',
  'template-punctuation': 'text-code-green',
  keyword: 'text-code-purple',
  string: 'text-code-green',
  'template-string': 'text-code-green',
  function: 'text-code-blue',
  boolean: 'text-code-red',
  comment: 'text-gray-400 italic',
  property: 'text-code-teal',
  'property-access': 'text-code-teal',
  dom: 'text-code-blue',
  method: 'text-code-teal',
  class: 'text-code-yellow',
  color: 'text-code-purple',
  'function-variable': 'text-code-blue',
  variable: 'text-code-blue',
  'interpolation-punctuation': 'text-code-teal',
  interpolation: 'text-code-red',
};

module.exports = tokenClassNames;
