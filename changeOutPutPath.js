export class ChangeOutPutPath{
  apply(hooks){
    hooks.emitFile.tap('changeOutputPath', (context)=>{
      context.changeOutputPath("./dist/ap.js")
      console.log('asdfsafsa==========');
    })
    // console.log('hooks', hooks);
  }
}