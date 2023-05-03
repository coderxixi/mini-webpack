import fs from "fs"
import parser from "@babel/parser";
import traverse from "@babel/traverse";
import {transformFromAst} from "babel-core"
import path from "path";
import ejs from "ejs";
import { SyncHook } from "tapable";
import {jsonLoader} from "./jsonLoader.js";
import { ChangeOutPutPath } from  "./changeOutPutPath.js"
const webpackConfig={
  module:{
    rules:[
      {
        test:/\.json$/,
        use:jsonLoader
      }
    ]
  },
  plugins:[
    new ChangeOutPutPath()
  ]
}
//plugin

const hooks={
  emitFile:new SyncHook(['context'])
}
function initPlugin(){
  const plugins=webpackConfig.plugins;

  plugins.forEach((plugins)=>{
    plugins.apply(hooks)
  })
}
initPlugin()
//唯一ID
let id=0;
function createAsset(filePath) {
  // 1 获取文件的内容
  let source = fs.readFileSync(filePath, {
    encoding: 'utf-8'
  });
  //loader
  const loaders=webpackConfig.module.rules;
  const loaderContext={
    addDeps(dep){
      console.log('addDeps', dep);
    }
  }
  loaders.forEach(({test,use})=>{
    if (test.test(filePath)){
      source = use.call(loaderContext,source)
    }
  })
  // console.log('source', source);
  // 2 获取依赖关系
  const ast = parser.parse(source, {
    sourceType: 'module'
  });
  const deps = []
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value)
    }
  })
 const {code}= transformFromAst(ast,null,{
  presets:['env']
 })
//  console.log('code====',code);
  return {
    filePath: filePath,
    code,
    deps,
    id:id++,
    mapping:{}
  }

}
// const asset = createAsset();
//创建图数据结构


function createGraph() {
  // 入口文件
  const mainAsset = createAsset("./example/main.js");
  const queue = [mainAsset];
  for (const asset of queue) {
    asset.deps.forEach((assetPath) => {
    const child= createAsset(path.resolve('./example', assetPath))  ;
      asset.mapping[assetPath]=child.id
      queue.push(child);
      
    })
  }
  return queue

}
const graph =  createGraph()
// console.log('dep', graph);

function build(graph){
 const template=fs.readFileSync("./bundle.ejs",{encoding:"utf-8"})
  const data = graph.map((asset)=>{
    return {
      id:asset.id,
      code:asset.code,
      mapping:asset.mapping
    }
  })
  const code = ejs.render(template, {data});
    let outputPath= './dist/bundle.js';
  const context={
    changeOutputPath(path){
      outputPath=path
    }
  }
  hooks.emitFile.call(context)
  // console.log('data', data);
  fs.writeFileSync(outputPath,code)
//  console.log('code',code);
}
build(graph)


