class Expression{
    constructor(tokens){
        // this.expression = tokens.join('');
    }
}

class Statement{
    constructor(){

    }
}

class IfStatement{
    constructor(condition, statements){
        this.condition = condition;
        this.statements = statements;
    }
}

class WhileStatement{
    constructor(condition, statements){
        this.condition = condition;
        this.statements = statements;
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
    constructor(name, args){
        this.name = name;
        this.args = args;
    }
}

class Interpreter{
    constructor(){
        this.memory = {};
        this.callStack = [];
        this.reservedKeywords = [
            'def', 'for', 'while', 'if', 'elif', 'else', 'range'
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
        // console.log(this.components);
        this.memory['main'] = new FunctionStatement('main', [], []);
        while(this.components.length){
            const nextStatement = this.getNextStatement();
            if(nextStatement){
                this.memory['main'].bodyStatements.push(nextStatement);
            }
        }
    }

    getNextStatement(){
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
                let bodyStatements = this.getBlockStatements();

                statement = new FunctionStatement(name, args, bodyStatements);
            }
        }
        else if(first === 'if'){
            // console.log(this.components);
            let condition = this.getConditionTokens();
            let statements = this.getBlockStatements();
            statement = new IfStatement(condition, statements);
        }
        else if(first === 'while'){
            let condition = this.getConditionTokens();
            let statements = this.getBlockStatements();
            statement = new WhileStatement(condition, statements);
        }
        else if(first === 'for'){
            
        }
        else if (this.isValidIdentifier(first)){
            let name = first;
            
            // if(!this.isValidIdentifier(name)){
            //     throw new Error(`Invalid identifier name: ${name}`);
            // }

            let nextToken = this.components[0];
            if(nextToken === '='){
                this.components.shift();
                let assignment = this.getAssignmentTokens();
                statement =  new AssignmentStatement(name, assignment);
            }
            // else{
            //     let expressionTokens = this.getExpressionTokens().unshift(name);
            //     statement = new Expression(expressionTokens);
            // }
            else if(nextToken === '('){
                this.components.shift();
                let args = this.getArguments();
                statement = new FunctionCall(name, args);
            }
        }
        else if(!this.isValidIdentifier(first)){
            // if()
            throw new Error('Invalid syntax: ' + first);
        }
        // console.log(statement);
        return statement;
    }

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

    getArguments(tokens){
        let bracketStack = [-1];
        let args = [];
        if(this.components[0] === ','){
            throw new Error(`Invalid syntax. Argument must be passed before ','`);
        }
        if(this.components[0] === ')'){
            this.components.shift();
            return args;
        }
        let currentArgumentTokens = [];
        let prev = null;
        let current = null;
        while(this.components.length){
            prev = current;
            current = this.components[0];
            if(current === ')'){
                bracketStack.pop();
                this.components.shift();
                if(bracketStack.length){
                    currentArgumentTokens.push(current);
                }
            }
            else if(current === '('){
                // if(this.isValidIdentifier(prev)){
                //     this.components.shift();
                //     current = new FunctionCall(prev, this.getArguments());
                //     currentArgumentTokens.pop();
                //     currentArgumentTokens.push(current);
                // }
                // else{
                    bracketStack.push(-1);
                    currentArgumentTokens.push(current);
                    this.components.shift();
                // }
            }
            else if(current === ','){
                if(currentArgumentTokens.length === 0){
                    throw new Error(`Invalid syntax. Argument must be passed before ','`);
                }
                else{
                    if(bracketStack.length === 1){
                        args.push(currentArgumentTokens);
                        currentArgumentTokens = [];
                    }
                    this.components.shift();
                }
            }
            else{
                currentArgumentTokens.push(current);
                this.components.shift();
            }
            
            if(bracketStack.length === 0){
                if(currentArgumentTokens.length){
                    args.push(currentArgumentTokens);
                }
                return args;
            }
        }
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

    getBlockStatements(){
        if(this.components.shift() !== '{'){
            throw new Error('Syntax error. Opening curly bracket expected for function decleration');
        }
        let bracketStack = [-1];
        let statements = [];
        while(this.components.length){
            
            let current = this.components[0];
            if(current === '}'){
                bracketStack.pop();
                this.components.shift();
            }
            else if(current === '{'){
                bracketStack.push(-1);
            }
            
            if(bracketStack.length === 0){
                return statements;
            }
            const nextStatement = this.getNextStatement();
            if(nextStatement){
                statements.push(nextStatement);
            }
        }
    }

    getConditionTokens(){
        if(this.components.shift() !== '('){
            throw new Error('Syntax error. Opening bracket expected for condional expression');
        }
        let bracketStack = [];
        let expressionTokens = [];
        while(this.components.length){
            let currentToken = this.components.shift();
            if(currentToken === ')'){
                if(bracketStack.length === 0){
                    if(expressionTokens.length === 0){
                        throw new Error('Invalid syntax: conditional statement must be passed')
                    }
                    return expressionTokens;
                }
                else{
                    bracketStack.pop();
                }
            }
            else if(currentToken === '('){
                bracketStack.push(-1);
            }
            expressionTokens.push(currentToken);
        }

        throw new Error('Invalid syntax: conditional statement must be wrapped in parantheses')
    }

    getExpression(tokens){
        
    }
}

let Urartu = new Interpreter();
// Urartu.run(`
//     x = 5 + 8 * (c - l);
// `);
Urartu.run(`
    x = 5;
    y = 8;
    foo(1, a, a + b(0, 'f(', f(), t), c);
    if(k + l){
        k = 10;
        l = 66;
    }
    def f1() {
        t = 'asda';
        ;
        p = " ' fasf ";
    }
`)


console.dir(Urartu.memory['main']);
