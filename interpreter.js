class Expression{
    constructor(){

    }
}

class Statement{
    constructor(type, ){

    }
}

class FunctionCall{
    constructor(){

    }
}

class Interpreter{
    constructor(){
        this.memory = {};
        this.callStack = [];
        this.reservedKeywords = [
            'var', 'def', 'for', 'while', 'if', 'elif', 'else', 'range'
        ]
    }

    checkStringSyntax(code){

    }

    isValidIdentifier(name){
        return /^[a-zA-Z_$]+[a-zA-Z_$0-9]*/g.test(name);
    }

    run(code){
        const regex = /('[^']*'{0,1})|("[^"]*"{0,1})|([+\-*\/\(\)\[\]:,;])|([^\s'"+\-*\/\(\)\[\],:;]+)/g;
        this.components = code.match(regex);
        console.log(this.components);
        this.process(this.memory);
    }

    process(memory, end = ';', scope = 'global'){
        let first = this.components.shift();
        if(first === end){
            return;
        }
        if(first === 'def'){
            let name = this.components.shift();
            
            if(!this.isValidIdentifier(name)){
                throw new Error(`Invalid identifier name: ${name}`);
            }
            else{
                console.log('Type: function, Name: ' + name);
                let possibleBracket = this.components.shift();
                if(possibleBracket !== '('){
                    throw new Error(`Invalid identifier name: ${name}`);
                }
                this.memory[name] = {
                    name: name,
                    type: 'function',
                    initialized: false,
                    memory: [],
                    parameters: [],
                    body: [],
                }
                let bracketStack = [possibleBracket];
                this.memory[name].parameters = this.getParameters(bracketStack);
                console.log(this.memory[name]);
                console.log(this.components);
                let possibleCurlyBracket = this.components.shift();
                // console.log({possibleCurlyBracket});
                if(possibleCurlyBracket !== '{'){
                    throw new Error('Syntax error. Opening curly bracket expected for function decleration');
                }
                this.process(this.memory[name].memory, '}', 'function');
            }
        }
        else if (first === 'var'){
            let name = this.components.shift();
            
            if(!this.isValidIdentifier(name)){
                throw new Error(`Invalid identifier name: ${name}`);
            }

            let possibleAssignmentOperator = this.components.shift();
            if(possibleAssignmentOperator === '='){
                
            }
        }
        else if(!this.isValidIdentifier(first)){
            // if()
            throw new Error('Invalid syntax: ' + first);
        }
    }
    getFunctionBodyStatements(){

    }



    getParameters(){
        let parameters = [];
        if(this.components[0] === ','){
            throw new Error(`Invalid syntax. Parameter identifier expected before ','`);
        }
        if(this.components[0] === ')'){
            this.components.shift();
            return parameters;
        }
        while(this.components.length){
            let current = this.components.shift();
            let next = this.components[0];
            if(this.isValidIdentifier(current)){
                if(next === ','){
                    parameters.push(current);
                    continue;
                }
                if(next === ')'){
                    parameters.push(current);
                    this.components.shift();
                    return parameters;
                }
                throw new Error(`Invalid syntax. ',' expected, got '${next}' instead.`)
            }
            else if(current === ',' && this.isValidIdentifier(next)){
                continue;
            }
            else{
                throw new Error('Invalid identifier was used as function parameter');
            }
        }
        throw new Error('Invalid syntax. Function parameters must be wrapped into parantheses!');
    }

    processBrackets(stack, owner, components){
        let params = [];
        let ownersStack = [owner];
        let currentExpression = new Expression();
        while(stack.length){
            let current = components.shift();
            console.log({current});
            console.log({next: components[0]});
            if(current === '('){
                stack.push(current);
            }
            else if(current === ')'){
                stack.pop()
                ownersStack.pop();
            }
            else if(this.isValidIdentifier(current) && (components[0] === ',' || (components[0] === ')' && ownersStack.length === 1))){
                params.push(current);
            }
        }
        return params;
    }

    processFunctionBody(){

    }

    processExpression(exp){
        
    }
}

let PyJS = new Interpreter();
PyJS.run(`
def f (a, b, c){
    var x = 5;
    var y = 8;
    return a + b;
}
`)