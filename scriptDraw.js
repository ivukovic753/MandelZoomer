
var canvas=document.getElementById('canvas1');
var ctx = canvas.getContext('2d');

var canvas2=document.getElementById('canvas2');
var ctx2=canvas2.getContext('2d');


let w=canvas.width;  
let h=canvas.height;

let x0=-1.976;
let y0=-1.272;
let area=2.56;

let iterations = 50;
let rectangleWidth = 100;

let rectPositionX=0;
let rectPositionY=0;

arealFactor=area/canvas.width;

class color {
    constructor(r, g, b, a) {
      this.r=r;
      this.g=g;
      this.b=b;
      this.a=a;
    }
  }


setIterations();

redrawFract(x0,y0,area,0);



function redrawFract(x0,y0,area,i)
{         
    image = ctx.createImageData(w,h);
    var imageData = image.data;

    arealFactor=area/canvas.width;

    if (canvas.getContext) 
    {              
        let x=0;
        let y=0;

        for (;i <imageData.length; i+= 4) 
        {
            x=convertPixelToNumber(x0,(i/4)%w,arealFactor);
            y=convertPixelToNumber(y0,i/(4*w),arealFactor);

            let iteration = Mandelbrot(x,y,iterations)
                                          
            // imageData[i] = iteration;
            // imageData[i+1] = iteration;
            // imageData[i+2] = iteration;
            // imageData[i+3] = iteration;     
            imageData[i] = colors[iteration].r;
            imageData[i+1] = colors[iteration].g;
            imageData[i+2] = colors[iteration].b;
            imageData[i+3] = colors[iteration].a;                             
        }
        
        ctx.putImageData( image, 1, 1 );          
    } 
    else 
    {
        alert('no canvas..');
    }
}

function convertPixelToNumber(n0,pixel,factor)
{
    return n0+pixel*factor;
}


canvas2.addEventListener("mousewheel", MouseWheelHandler, false);
function MouseWheelHandler(e)
{   
    e.preventDefault();
    
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))); //+/-1
    
    rectangleWidth -=20*delta;
 
    mouseMoved(e);

    return false;
}

canvas2.addEventListener("click",canvas2Clicked,false);
function canvas2Clicked()
{   
    arealFactor=area/canvas.width;
    x0=convertPixelToNumber(x0,rectPositionX,arealFactor)
    y0=convertPixelToNumber(y0,rectPositionY,arealFactor)
    area = rectangleWidth/canvas2.width * area;  
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();

    redrawFract(x0,y0,area,0); 
    //console.log("redrawing x0:"+ +x0+' y0:'+ y0 + 'area:'+area );
}

canvas2.onmousemove = mouseMoved; 
function mouseMoved(e) 
{      
    var mousecoords = getMousePos(e);
      
    ctx2.clearRect(0, 0, w, h);
    ctx2.beginPath(); 
    
    x=mousecoords.x;
    y=mousecoords.y;    
     
    rectPositionX = x-rectangleWidth/2 + window.pageXOffset;
    rectPositionY = y-rectangleWidth/2 + window.pageYOffset;
          
    ctx2.lineWidth = 2;
    ctx2.strokeStyle = 'black';   
    ctx2.strokeRect(rectPositionX, rectPositionY , rectangleWidth , rectangleWidth); 
    ctx2.stroke();
    ctx2.strokeStyle = 'white';   
    ctx2.strokeRect(rectPositionX-1, rectPositionY-1 , rectangleWidth+2 , rectangleWidth+2); 
    ctx2.stroke();
};

function getMousePos(e) 
{
    return {x:e.clientX,y:e.clientY};
}


function Mandelbrot(x,  y, iterations)
{            
    a = 0;
    b = 0;

    for (let it = 0; it < iterations; it++)
    {               
        a1 = a;
        b1 = b;

        a = a1 * a1 - b1 * b1 + x;
        b = b1 * a1 + b1 * a1 + y;

        if (a * a + b * b > 4)
        {                  
            return it;                  
        }
    }
    return iterations
}


var b1=document.getElementById('set');

b1.addEventListener("click", setIterations, false);

function setIterations()
{      
    iterations=document.getElementById('iterations').value;   
    
     console.log('Iterations set to: '+iterations); 
     colors = new Array(iterations+1);
        
     for (let i=0;i< iterations;i++)
     {  
         colors[i]=new color((i % 64) * 4, (i % 128) * 2, 255-i % 256, 255);
     }
     colors[iterations]=new color(0,0,0,255);
}

var b2=document.getElementById('redraw');

b2.addEventListener("click", redraw, false);

function redraw() 
{   
    redrawFract(x0,y0,area,0);
}




 