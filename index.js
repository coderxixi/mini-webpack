import fs from "fs"
import parser from "@babel/parser";
import traverse from "@babel/traverse"
function createAsset() {
  // 1 获取文件的内容
  const source = fs.readFileSync('./example/foo.js', {
    encoding: 'utf-8'
  });
  console.log('source', source);
  // 2 获取依赖关系
  const ast= parser.parse(source,{
    sourceType:'module'
  });
  const deps=[]
  traverse.default(ast,{
    ImportDeclaration({node}){
    //   console.log('import===========');
    //  console.log('data',node.source.value);
      deps.push(node.source.value)
    }
  })
 
  return {
    source,
    deps
  }

}
const asset= createAsset();
//创建图数据结构


function createGraph(){
  const mainAsset = createAsset()
}
console.log('asset',asset);



