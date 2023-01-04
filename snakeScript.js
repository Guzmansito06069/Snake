//Snake
//Hecho por https://github.com/Gonzacap
//Inspirado en https://www.youtube.com/watch?v=GbPAYZ7tXUY&ab_channel=Appdelante
//Y basado en https://www.educative.io/blog/javascript-snake-game-tutorial

//----------------PASOS--------------
//(1)Muestrar el tablero y la serpiente
//(2)Hacer que la serpiente se mueva automáticamente
//(3)Usar las teclas de flecha para cambiar la dirección de la serpiente
//(4)Incorporar coliciones
//(5)Incorporar comida 
//(6)Crecer y Puntuación
//(7)Cambiar dificultad
//(8)Reiniciar

//-------------------- Constantes y Variables --------------------

const tableroBorde = 'black';
const tableroBackground = 'rgb(140, 232, 112, 1.0)';
const snakeColor = 'grey';
const snakeBorde = 'darkblue';
const headColor = '#6C5858';

let juegoActivo = false;
let puntaje = 0;
let moviendo = false;
let vi = 10;   //velocidad inicial
let va = 10;   //velocidad actual
let dx = va;  //velocidad horizontal (originalmente 10)
let dy = 0;   //velocidad vertical
let food_x;
let food_y;
let ifHead;
let tiempoDeRetraso = 200;

const tablero = document.getElementById("tablero");	//obtengo el canbas
const snakeboard_ctx = tablero.getContext("2d");		//y devuelvo un dibujo 2d

let snake_0 = [ 
	{x: 200, y: 200}, //cabeza de la serpiente
	{x: 190, y: 200}, 
	{x: 180, y: 200}, 
	{x: 170, y: 200}, 
	{x: 160, y: 200},
];

let snake = [...snake_0];

//controles
const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;

document.addEventListener("keydown", movementWithKey); //al precionar una tecla llamo a moverSnake
document.addEventListener("keypress", movementWithKey); //al precionar una tecla llamo a moverSnake

//-------------------- Start game --------------------

limpiarLienzo();
generarComida();  

//----------------------------------------------------

//funcion principal
function main() {

     moviendo = false;
     juegoActivo = true;

     limpiarLienzo();
     dibujarComida();
     desplasarSnake();
     dibujarSerpiente();
  
     setTimeout( function onTick(){

          if (coliciones()){
               
               limpiarLienzo();
               snake = [];
               alert("Oops! Has perdido");
               dibujarSerpiente();
               
               juegoActivo = false;  

               return;
          }
          
          main();
     }
     , tiempoDeRetraso);

}

/**
 * Esta funcion vuelve el tablero y la serpiente a su estado inicial
 */
function limpiarLienzo() {

    snakeboard_ctx.fillStyle = tableroBackground;
    snakeboard_ctx.strokestyle = tableroBorde;
    snakeboard_ctx.fillRect(0, 0, tablero.width, tablero.height);
    snakeboard_ctx.strokeRect(0, 0, tablero.width, tablero.height);
}

/**
 * Esta funcion se encarga de manejar el dibujo de la serpiente en el tablero
 */
function dibujarSerpiente() {  
     ifHead = true;
     snake.forEach(dibujarPartes);
}

/**
 * Esta funcion de dibujar una parte de la serpiente en el tablero
 * @param {*} snakePart una parte de la serpiernte
 */
function dibujarPartes(snakePart) {

     if(ifHead){
          snakeboard_ctx.fillStyle = headColor;
          ifHead = false;
     }
     else      snakeboard_ctx.fillStyle = snakeColor;
     snakeboard_ctx.strokestyle = snakeBorde; 
     snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);  
     snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

/**
 * Funcion para manejar el los eventos de keypress y keydown
 * @param {*} event 
 */
function movementWithKey(event){
     const keyPressed = event.keyCode;
     moverSnake(keyPressed);
}

function moverSnake(val) {
    
     if (moviendo) return;
      
     moviendo = true;
     
     const haciaArriba = (dy === (-1*va));
     const haciaAbajo = (dy === va);
     const haciaDerecha = (dx === va);
     const haciaIzquierda = (dx === (-1*va));

     if (val === LEFT_KEY && !haciaDerecha) {
          dx = -1*va;
          dy = 0;
     }
     if (val === UP_KEY && !haciaAbajo) {
          dx = 0;
          dy = -1*va;
     }
     if (val === RIGHT_KEY && !haciaIzquierda) {
          dx = va;
          dy = 0;
     }
     if (val === DOWN_KEY && !haciaArriba) {
          dx = 0;
          dy = va;
     }
}

//(4) Incorporar coliciones

function coliciones() {

     for(let i=4; i<snake.length; i++){ //verifico que la cabeza no choque con ninguna parte del cuerpo

          if (snake[i].x===snake[0].x && snake[i].y===snake[0].y){
               return true;//retorna verdadero porque sucedio una colicion
          } 
     }

     const limiteIzq = snake[0].x <= 0;
     const limiteDer = snake[0].x >= tablero.width - 10;
     const limiteSup = snake[0].y <= 0;
     const limiteInf = snake[0].y >= tablero.height - 10;

     if(limiteIzq || limiteDer || limiteSup || limiteInf){
          return true;
     }
     else return false;
}

//(5) Incorporar comida

function coordenadaRandom(min, max) {
  return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

function generarComida() {

     food_x = coordenadaRandom(10, tablero.width - 20);
     food_y = coordenadaRandom(10, tablero.height - 20);
     //si la nueva ubicación de comida es donde se encuentra actualmente la serpiente
     //genere una nueva ubicación de comida
     snake.forEach(function coordenadaValida(part) {
          const valida = part.x == food_x && part.y == food_y;
          if (valida) generarComida();
     });
}

function dibujarComida() {
  snakeboard_ctx.fillStyle = 'grey';
  snakeboard_ctx.strokestyle = 'darkblue';
  snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
  snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
}

//(6) Crecer y Puntuación

function desplasarSnake() {

     const head = {x: snake[0].x + dx, y: snake[0].y + dy};
     snake.unshift(head);

     const crecer = (snake[0].x === food_x) && (snake[0].y === food_y);

     if(crecer){
          puntaje += 1;
          document.getElementById('score').innerHTML = "Puntaje: "+puntaje;
          //aumentarDificultad();
          generarComida();
     }
     else{
          snake.pop();
     }
}

//(7) Cambiar dificultad

//SE GENERAN INCONSISTENCIAS CON LAS COORDENADAS DE LA COMIDA

/*function aumentarDificultad(){

     if(puntaje === marcadorPuntaje){
          
          va+=1.5;
          marcadorPuntaje+=2;
     }
}*/

//(8) Reiniciar

/**
 * Esta funcion se encarga de iniciar nuevamente la partida
 */
function start(){

     if (!juegoActivo) {
          snake = [...snake_0];
          puntaje = 0;
          document.getElementById('score').innerHTML = "Puntaje: "+puntaje;
          va = vi;
          dx = va;
          dy = 0;
          main();
     }
}


//----------------Touch Displacement----------------//

var display = document.getElementById ("tablero");
var touchesList = new Array;

function startTouch(event) {
    event.preventDefault();
}

function getTouchPos (event) {

    var rect = display.getBoundingClientRect ();

    return {
        x: event.touches [0] .clientX-rect.left,
        y: event.touches [0] .clientY-rect.top
    };
}

function momevent(event){

    var displacement = getTouchPos(event);

    touchesList.push(displacement);
}

function calculateMovement(event) {
 
    if(touchesList[0] === undefined) return;

    p = 30; //precision

    var x1 = touchesList[0].x;
    var x2 = touchesList[touchesList.length-1].x;
    var y1 = touchesList[0].y;
    var y2 = touchesList[touchesList.length-1].y;

    var h = Math.abs(x2-x1);
    var v = Math.abs(y2-y1);

    var a = Math.round(Math.trunc(h)/p);
    var b = Math.round(Math.trunc(v)/p);

    if(a > b){

        if(x1<x2) moverSnake(RIGHT_KEY);
        else moverSnake(LEFT_KEY);
    }
    else{

        if(y1<y2) moverSnake(DOWN_KEY);
        else moverSnake(UP_KEY);
    }
    
    touchesList = [];
}

function touchStartup() {
  var el = document.getElementsByTagName("canvas")[0];

  el.addEventListener("touchstart", startTouch, false);
  el.addEventListener("touchend", calculateMovement, false);
  el.addEventListener("touchmove", momevent, false);
}

touchStartup();
