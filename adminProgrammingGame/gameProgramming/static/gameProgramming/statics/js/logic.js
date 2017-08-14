/**
* Prototipo con librería blocky
* Anglus SAS
* @Author: danielrico.posada@gmail.com (Daniel Rico)
**/

$(function(){
//----------------------------------------------Definición del paquete--------------------------------------------//
  function B_() {};

  B_.prototype.stage = new createjs.Stage("c"); //Stage del juego
  B_.prototype.movements = [] //Arreglo que almacena los movimientos a seguir por el jugador
  B_.prototype.playerPosition = []
  B_.prototype.map = []
  B_.prototype.isExecutingMovements = false
  B_.prototype.player = ""
  B_.prototype.completed = false
  B_.prototype.timeBetweenAnimations = 1000
  B_.prototype.createMap = function(map){
  
    /**
     * Creación del mapa gráfico
     * @param {Array[n][m]} map: Representación lógica del mapa
    */
    B_.prototype.map = map;

      if(this.stage != null){
        var xPos = 0; // posición actual en x para generar las matrices.
        var yPos = 0; // posición actual en y para generar las matrices.
        var heightStage = this.stage.canvas.height; // alto del contenedor
        var widthStage = this.stage.canvas.width; // ancho del contenedor
        var rows = map.length; // Cantidad de filas que tendra la matriz.
        var col = map[0].length; // cantidad de columnas que tendrá la matriz.

        var width = Math.ceil(widthStage/col); // ancho que tendrá cada celda de la matriz
        var height = Math.ceil(heightStage/rows); // alto que tendrá cada celda de la matriz

        for ( var i = 0; i < rows; i++ ) {
          for ( var j = 0; j < col; j++ ) {

              if( map[i][j] == 0 ){ this.createCell(xPos, yPos, width, height, this.cells.CELL); }

              else if(map[i][j] == 1){ this.createCell(xPos, yPos, width, height, this.cells.PATH); }

              else{ //En caso de que sea el personaje o que sea el objeto que va a ser capturable
                
                this.createCell(xPos, yPos, width, height, this.cells.PATH);//Creación de la celda

                if( map[i][j] == 2 ){ B_.prototype.playerPosition = [i, j]}//Creación del personaje que se va a desplazar en el mapa
                   
                else if( map[i][j] == 3 ){ this.createTarget(xPos, yPos, width, height); } //Creación del objetivo
              }
              
              xPos += width;
          };

          yPos += height;
          xPos = 0;
        }

        this.createPlayer(this.playerPosition[1]* width, this.playerPosition[0] * height, width, height);

      }else{
        console.error("Stage error");
      }

      createjs.Ticker.addEventListener("tick", this.tick); 
      createjs.Ticker.setFPS(20);
    
    }
  B_.prototype.interpreter = null
  B_.prototype.highlightPause = false

  B_.prototype.cells = {
    CELL:0,
    PATH:1
  }

  B_.prototype.positions = {
    UP:'UP',
    DOWN:'BOTTOM',
    RIGHT:'RIGHT',
    LEFT:'LEFT'
  }

  B_.prototype.createCell = function( x, y, width, height,type ){
    /**
     * Crea una celda en la matriz visual
     * @param {Number} x: Posición en x
     * @param {Number} y: Posición en y
     * @param {Number} width: Ancho de la celda
     * @param {Number} height: Alto de la celda
     * @param {String} type: Enumeración: {B_.cells.CELL, B._cells.PATH }
    */

    var square = new createjs.Shape();
    if( type === 0){
      square.graphics.beginFill("#222").beginStroke("white").drawRect(x, y, width, height);
    
    }else if( type === 1 ){
      square.graphics.beginFill("#e9e9e9").drawRect(x, y, width, height);
    }

    this.stage.addChild(square);  
  }

  B_.prototype.createPlayer = function( x, y, width, height ){
    /**
     * Creación del jugador 
     * @param {Number} x: Posición en x
     * @param {Number} y: Posición en y
     * @param {Number} width: Ancho del jugador
     * @param {Number} height: Alto del jugador
    */
    var square = new createjs.Shape();
    square.graphics.beginFill("red").drawRect(x + Math.floor(width/2) - 5, y + Math.floor(height/2) - 5, width/3, height/3);
    this.stage.addChild(square); 
    B_.prototype.player = square;

    //console.log(B_.prototype.player.graphics._activeInstructions[0].x);

  }

  B_.prototype.createTarget = function( x, y, width, height ){
    /**
     * Creación del objetivo que el jugador debe capturar 
     * @param {Number} x: Posición en x
     * @param {Number} y: Posición en y
     * @param {Number} width: Ancho del objetivo
     * @param {Number} height: Alto del objetivo
    */
    var target = new createjs.Shape();
    target.graphics.beginFill("green").drawRect(x + Math.floor(width/2) - 5, y + Math.floor(height/2) - 5, width/3, height/3);
    this.stage.addChild(target); 

  }

  B_.prototype.levelNotComplete = function(){
    console.log("Nivel No Completado");

    setTimeout(function(){
      var dialog = $("#loseDialog")[0];
      dialog.showModal();
      dialog.querySelector('.close').addEventListener('click', function() {
        dialog.close();
      });
    }, 300);
  }

  B_.prototype.levelComplete = function(){
    /**
        * Registro de completitud del nivel.
    */
    console.log("Nivel Completado");
    B_.prototype.isExecutingMovements = false;

    setTimeout(function(){
      var dialog = $("#winDialog")[0];
      dialog.showModal();
      B_.prototype.completed = true;

      dialog.querySelector('.close').addEventListener('click', function() {
        dialog.close();
      });

    }, 300);
    
  }

  B_.prototype.printMatrix = function(){
    /**
        * Helper para ver gráficamente la matriz de movimiento.
    */
    var mat = "";
    for (var i = 0; i < this.map.length; i++) {
      var init = this.map[i][0]
      mat += init + " ";
      
      for (var j= 1; j< this.map[0].length; j++) {
        var sec = this.map[i][j]
        mat += sec + " ";
      };

      mat += "\n";
    };

    console.log(mat);
  }

  B_.prototype.getMap = function(){
    /**
        * Obtener el mapa que se renderiza en el nivel actual.
    */
    var stringMap = $("#gameMap").attr( "data-map" );

    if (stringMap != "") {
       mapArr = stringMap.split(".");
       curArr = [];
       for (var i = 0; i < mapArr.length; i++) {
         curArr.push(mapArr[i].split(","));
       };
    };
    this.map = curArr;
    return curArr;

  }

  B_.prototype.moveToRight = function(){
     /**
        * Movimiento a la derecha del personaje.
      */

      if (this.map != null) {

        var posX = this.playerPosition[0];
        var posY = this.playerPosition[1];
        var target = posY + 1;
        if (this.map[posX][target] == 0) {
          B_.prototype.isExecutingMovements = false;
          this.levelNotComplete();
        }else{
          console.log((target < this.map[0].length));
          if( (target < this.map[0].length) && (this.map[posX][target] == 1) ){
            this.map[posX][posY] = 1;
            this.map[posX][target] = 2;
            this.playerPosition = [posX, target];

            // createjs.Tween.get(B_.prototype.player).play(
            // createjs.Tween.get(B_.prototype.player, {overwrite:true})
            //   .to({x: 50},B_.prototype.timeBetweenAnimations)
            //   .wait(500)
            // ); 

            B_.prototype.timeBetweenAnimations += 1000;       

            B_.prototype.player.graphics._activeInstructions[0].x += 50;

            return true;
          }else if(this.map[posX][target] == 3){
            this.levelComplete();
            console.log();
            B_.prototype.player.graphics._activeInstructions[0].x += 50;
          }else{
            return false;
          }
        }
        
      }
  }

  B_.prototype.moveToLeft = function(){
     /**
        * Movimiento a la izquierda del personaje.
      */

      if (this.map != null) {
        var posX = this.playerPosition[0];
        var posY = this.playerPosition[1];
        var target = posY - 1;
        if (this.map[posX][target] == 0) {
          B_.prototype.isExecutingMovements = false;
          this.levelNotComplete();
        }else{
          if( (target >= 0) && (this.map[posX][target] == 1) ){
            this.map[posX][posY] = 1;
            this.map[posX][target] = 2;
            this.playerPosition = [posX, target];
            B_.prototype.player.graphics._activeInstructions[0].x -= 50;
            console.log(this.printMatrix());
            return true;
          }else if(this.map[posX][target] == 3){
            this.levelComplete();
            B_.prototype.player.graphics._activeInstructions[0].x -= 50;
          }else{
            return false;
          }
        }
        
      }
  }

  B_.prototype.moveToUp = function(){
    /**
        * Movimiento hacia arriba del personaje.
    */

    if (this.map != null) {
      var posX = this.playerPosition[0];
      var posY = this.playerPosition[1];
      var target = posX - 1;

      console.log(target);
      console.log(posY);
      
      if (this.map[target][posY] == 0) {
        B_.prototype.isExecutingMovements = false;
        this.levelNotComplete();
      }else{
        if( (target >= 0) && (this.map[target][posY] == 1) ){
          this.map[target][posY] = 1;
          this.map[target][posY] = 2;
          this.playerPosition = [target, posY];
          B_.prototype.player.graphics._activeInstructions[0].y -= 25;
          return true;
        }else if(this.map[target][posY] == 3){
          this.levelComplete();
          B_.prototype.player.graphics._activeInstructions[0].y -= 25;
        }else{
          return false;
        }
      }
      
    }
  }

  B_.prototype.moveToDown = function(){
    /**
        * Movimiento hacia abajo del personaje.
    */

    if (this.map != null) {
      var posX = this.playerPosition[0];
      var posY = this.playerPosition[1];
      var target = posX + 1;
    

      console.log("PosX "+ posX);
      console.log("PosY "+ posY);
      console.log("Target "+ target);

      if (this.map[target][posY] == 0) {
        B_.prototype.isExecutingMovements = false;
        this.levelNotComplete();
      }else{
        if( (target < this.map.length) && (this.map[target][posY] == 1) ){
          this.map[target][posY] = 1;
          this.map[target][posY] = 2;
          this.playerPosition = [target, posY];
          B_.prototype.player.graphics._activeInstructions[0].y += 25;
          console.log(this.printMatrix());
          return true;
        }else if(this.map[target][posY] == 3){
          this.levelComplete();
          B_.prototype.player.graphics._activeInstructions[0].y += 25;
        }else{

          return false;
        }
      }
      
    }
  }

  B_.prototype.tick = function(event){
    /**
     * Creación del tick de actualización del juego
     * @param {Event} event: tick a actualizar
    */
      //B_.prototype.player.graphics._activeInstructions[0].x += 5
      B_.prototype.stage.update();
      if(B_.prototype.isExecutingMovements == true && B_.prototype.movements.length > 0){

        if (B_.prototype.movements[0] == B_.prototype.positions.UP) {
            B_.prototype.moveToUp();
        }else if(B_.prototype.movements[0] == B_.prototype.positions.DOWN){
            B_.prototype.moveToDown();
        }else if(B_.prototype.movements[0] == B_.prototype.positions.RIGHT){
            B_.prototype.moveToRight();
        }else if(B_.prototype.movements[0] == B_.prototype.positions.LEFT){
            B_.prototype.moveToLeft();
        }

        B_.prototype.movements.shift();

        console.log(B_.prototype.movements);
      }else{

        console.log("completed:"+B_.prototype.completed);
        
        /*
          if (!B_.prototype.completed) {
            B_.prototype.levelNotComplete();
          };
        */
      }
  }

  B_.prototype.loadControls = function(){
    //$("#toolbox")
  }

  B_.prototype.customBlocks = {
    /**
     * Definición de los bloques personalizados creados con Block Factory
    */
    
    MOVEMENT: {//https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#6hf75a
        "id": "blk_movement",
        "message0": "Mover %1",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "direction",
            "options": [
              [
                "Arriba",
                "UP"
              ],
              [
                "Abajo",
                "BOTTOM"
              ],
              [
                "Derecha",
                "RIGHT"
              ],
              [
                "Izquierda",
                "LEFT"
              ]
            ]
          }
        ],
        "inputsInline": false,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 90,
        "tooltip": "",
        "helpUrl": "http://www.example.com/"
      }
  
  }

  B_.prototype.instanciateBlocks = function(){
    /**
     * Instanciación de los bloques personalizadas.
    */
    Blockly.Blocks['blk_movement'] = {
      init:function(){
        this.jsonInit(B_.prototype.customBlocks.MOVEMENT)
      } 
    }

  }()

  B_.prototype.blockyWorkspace = function(){
    /**
     * Creación del workspace de trabajo para arrastrar las instrucciones.
    */
    return Blockly.inject('blocklyDiv',
          {toolbox: document.getElementById('toolbox'), 
          grid:
           {spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true},
          trashcan: true
    });

  }()

  console.log(B_.prototype.blockyWorkspace);

  B_.prototype.executionOfCustomBlocks = function(){
      /**
        * Definición de las funcionalidades de ejecución de cada uno de los bloques personalizados.
      */
      Blockly.JavaScript['blk_movement'] = function(block) {

      var directionVar = Blockly.JavaScript.variableDB_.getDistinctName(
      'direction_', Blockly.Variables.NAME_TYPE);
      
      var addMovement = Blockly.JavaScript.provideFunction_(
        'list_addElement',
        [ 'function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(position) {',
            '// Agrega una nueva posicion al arreglo de movimientos pendientes',
            'B_.prototype.movements.push(position);',
            'console.log(B_.prototype.movements);',
        '}']);

      // var code = directionVar + ' = ' + '"'+block.getFieldValue('direction')+'"' +';\n';
      var code = addMovement + '("'+block.getFieldValue('direction') +'");\n';
      return code;
      };

  }()


  function highlightBlock(id) {
      this.blockyWorkspace.highlightBlock(id);
      this.highlightPause = true;
  }

  
  B_.prototype.initApi = function(interpreter, scope) {
      // Add an API function for the alert() block.
      var wrapper = function(text) {
        text = text ? text.toString() : '';
        return interpreter.createPrimitive(alert(text));
      };
      interpreter.setProperty(scope, 'alert',
          interpreter.createNativeFunction(wrapper));

      // Add an API function for the prompt() block.
      var wrapper = function(text) {
        text = text ? text.toString() : '';
        return interpreter.createPrimitive(prompt(text));
      };
      interpreter.setProperty(scope, 'prompt',
          interpreter.createNativeFunction(wrapper));

      // Add an API function for highlighting blocks.
      var wrapper = function(id) {
        id = id ? id.toString() : '';
        return interpreter.createPrimitive(highlightBlock(id));
      };
      interpreter.setProperty(scope, 'highlightBlock',
          interpreter.createNativeFunction(wrapper));
  
  }

  

  B_.prototype.parseCode = function() {
      // Generate JavaScript code and parse it.

      Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
      Blockly.JavaScript.addReservedWords('highlightBlock');
      var code = Blockly.JavaScript.workspaceToCode(B_.prototype.blockyWorkspace);
      B_.prototype.interpreter = new Interpreter(code, B_.prototype.initApi);

      
      alert('Ready to execute this code:\n\n' + code);
      B_.prototype.highlightPause = false;
      B_.prototype.blockyWorkspace.traceOn(true);
      B_.prototype.blockyWorkspace.highlightBlock(null);
  }

  B_.prototype.stepCode = function() {
      try {
        console.log(B_.prototype.interpreter);
        var ok = B_.prototype.interpreter.step();
      }catch(e){
        console.log(e);
      }

      if (B_.prototype.highlightPause) {
        // A block has been highlighted.  Pause execution here.
        B_.prototype.highlightPause = false;
      } else {
        // Keep executing until a highlight statement is reached.
        B_.prototype.stepCode();
      }
  
  }
  
//----------------------------------------------Eventos de interface--------------------------------------------//
  
  $("#buttonExecute").click(function(event) {
      /**
        * Ejecución del código creado en el workspace
      */
      var map = blockyGame.getMap();
      if (Array.isArray(map)) {
          blockyGame.createMap(map);
      }else{
          console.error("Exitió un error al cargar el mapa, por favor verifique el formato");
      }
      //blockyGame.parseCode();

      var code = Blockly.JavaScript.workspaceToCode(B_.prototype.blockyWorkspace)
      //console.log( B_.prototype.blockyWorkspace );

      B_.prototype.movements = [];
      
      try {
        eval(code);
        //blockyGame.parseCode();
        //blockyGame.stepCode();
        B_.prototype.isExecutingMovements = true;

        setTimeout(function(){
          if (!blockyGame.completed) {
            blockyGame.levelNotComplete();
          };
        }, 3000)
        
      } catch (e) {
        console.error(e);
      }


  });

//----------------------------------------------Flujo de ejecución--------------------------------------------//
  
    var dialog = document.querySelector('dialog');
    dialog.showModal();
    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
    });
   
    var blockyGame = new B_();

    var map = blockyGame.getMap();
    if (Array.isArray(map)) {
        blockyGame.createMap(map);
        blockyGame.loadControls();
    }else{
      console.error("Exitió un error al cargar el mapa, por favor verifique el formato");
    }


})
