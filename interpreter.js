class Expression{
    constructor(tokens){
        // this.expression = tokens.join('');
    }
}

class Statement{
    constructor(){

    }
}

class AssignmentStatement{
    constructor(name, expression){
        this.name = name;
        this.expression = expression;
    }
}

class FunctionStatement{
    constructor(name, args, bodyStatements){
        this.name = name;
        this.arguments = args;
        this.bodyStatements = bodyStatements;
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
        // console.log(new Expression(this.components).expression);
        console.log(this.components);
        this.memory['main'] = new FunctionStatement('main', [], []);
        while(this.components.length){
            const nextStatement = this.getNextStatemt();
            if(nextStatement){
                this.memory['main'].bodyStatements.push(nextStatement);
            }
        }
    }

    getNextStatemt(){
        let statement = null;
        let first = this.components.shift();
        if(first === ';') return statement;

        if(first === 'def'){
            let name = this.components.shift();
            
            if(!this.isValidIdentifier(name)){
                throw new Error(`Invalid identifier name: ${name}`);
            }
            else{
                let args = this.getParameters();
                let bodyStatements = this.getFunctionBody();

                statement = new FunctionStatement(name, args, bodyStatements);
            }
        }
        else if (first === 'var'){
            let name = this.components.shift();
            
            if(!this.isValidIdentifier(name)){
                throw new Error(`Invalid identifier name: ${name}`);
            }

            let possibleAssignmentOperator = this.components.shift();
            if(possibleAssignmentOperator === '='){
                let assignment = this.getAssignmentTokens();

                statement =  new AssignmentStatement(name, assignment);
            }
        }
        else if(!this.isValidIdentifier(first)){
            // if()
            throw new Error('Invalid syntax: ' + first);
        }
        // console.log(statement);
        return statement;
    }
    // getFunctionBodyStatements(){
        
    // }

    getAssignmentTokens(){
        let tokens = [];
        while(this.components.length){
            let current = this.components.shift();
            console.log(current);
            if(current === ';'){
                break;
            }

            tokens.push(current);
        }
        console.log(this.components);
        return tokens;
    }

    getParameters(){
        if(this.components.shift() !== '('){
            throw new Error('Invalid syntax: The parameters of the function must be wrapped into parantheses!');
        }
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

    getFunctionBody(){
        if(this.components.shift() !== '{'){
            throw new Error('Syntax error. Opening curly bracket expected for function decleration');
        }
        let bracketStack = [-1];
        let statements = [];
        while(this.components.length){
            
            let current = this.components[0];
            if(current === '}'){
                bracketStack.pop();
                this.components.pop();
            }
            else if(current === '{'){
                bracketStack.push(-1);
            }
            
            if(bracketStack.length === 0){
                return statements;
            }
            statements.push(this.getNextStatemt());
        }
    }

    processExpression(exp){
        
    }
}

let PyJS = new Interpreter();
PyJS.run(`
def f (a, b, c){
    var x = 5;
    var y = 8;
    def f1() {
        var t = 'asda';
        ;
        var p = " ' fasf ";
    }
}
`)

console.dir(PyJS.memory['main']);