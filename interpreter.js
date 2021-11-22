class Interpreter{
    constructor(){
        this.memory = {};
        this.callStack = [];
    }

    checkStringSyntax(code){

    }

    run(code){
        const regex = /('[^']*'{0,1})|("[^"]*"{0,1})|([+\-*\/\(\)\[\]:])|([^\s'"+\-*\/\(\)\[\]:]+)/g;
        
        let components = code.match(regex);
        
    }
}