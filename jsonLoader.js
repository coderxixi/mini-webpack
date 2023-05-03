export function jsonLoader(source){
  console.log('this',this);
  this.addDeps('sadf')
  return `export default ${JSON.stringify(source)}`
} 