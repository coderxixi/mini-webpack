
(function(module){
  function require(id) {
    const [fn,mapping] = module[id];
    const module = {
      exports: {}
    }
    function localRequire(filePath){
      const id= mapping[filePath]
     return require(id)
    }
    fn(localRequire, module, module.exports);

    return module.exports
  }
  require('./main.js')
})(

{
   1:[function(require, module, exports) {
      //foo.js
      function foo() {
        console.log('foo')
      }
      module.exports = {
        foo
      }
    },{}],
    2:[function (require, module, exports) {
      //main.js
      const { foo } = require('./foo.js')
      foo();

      console.log('main.js');
    },{"./foo.js":2}]
}




)







