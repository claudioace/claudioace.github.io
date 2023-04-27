const sectionBBGI = document.getElementById('sectionBBGI');
const imageInput = document.getElementById('image-input');
const sectionB = document.getElementById('sectionB');
const slider = document.getElementById('slider');
const slider2 = document.getElementById('slider2');
let sectionBHeight = sectionB.offsetHeight;
let sectionBWidth = sectionB.offsetWidth;
let minSectionBSize = Math.min(sectionB.offsetHeight, sectionB.offsetWidth);
let todoFocos = document.querySelectorAll('.focus');
let focosActivos = document.querySelectorAll('.active');
let todoMiniFocos = document.querySelectorAll('.minifocus');

let mousePosition = {};
let focoActivo;
let focoSize = slider.value;
let focusCount = 1;
let ArrayFocusID = [
    {id: 'foco0',
     posX:0,
     posY:0,
     size:'20px',
     status:true},
];
window.addEventListener('resize', () => {
  sectionBWidth = sectionB.offsetWidth;
  sectionBHeight = sectionB.offsetHeight;
});

//actualizar automaticamente la variable minSectionBsize
function actualizarMinSectionBSize() {
  minSectionBSize = Math.min(sectionB.offsetHeight, sectionB.offsetWidth);
}
// Observador de mutación para monitorear cambios en sectionB
const observer = new MutationObserver(actualizarMinSectionBSize);
observer.observe(sectionB, { attributes: true });

// Detectar posicion del mouse dentro de sectionB
sectionB.addEventListener('mousemove', (e) => {
  mousePosition = {
    x: e.offsetX,
    y: e.offsetY
  };
});

//Cambiar tamaño de focus Activo segun el tamaño del slider. % de tamaño B
slider.addEventListener('input', () => {
  const sliderValue = (minSectionBSize * slider.value / 100) + 'px';
  ArrayFocusID.forEach(focus => {
    if (focus.status) {
      let focusElement = document.getElementById(focus.id);
      focusElement.style.width = sliderValue;
      focusElement.style.height = sliderValue;
      focus.size = sliderValue;
    }
  });
});

/*--Se ignora hasta corregir desplazamineto de minifocos
Slider2 será usado para definir opacidad FOCO
//Cambiar tamaño del  MINIfocus MINIActivo segun el tamaño del slider. % de tamaño B
slider2.addEventListener('input', () => {
    todoMiniFocos.forEach(function(minifocus) {
      // Verificar si el elemento tiene la clase .active
      if (minifocus.classList.contains('active')) {
        // Modificar el tamaño según el valor de slider2 SUAVIZADO exponencial
        let nuevoSize = (100 + (Math.pow(1.1, slider2.value/10) - 1) * 100) + '%';
        minifocus.style.width = nuevoSize;
        minifocus.style.height = nuevoSize;
        let correccion = parseFloat(minifocus.style.width);
      }
    });
});
*/


slider2.addEventListener('input', () => {
  const sliderValue = slider2.value + '%';
  ArrayFocusID.forEach(focus => {
    if (focus.status) {
      let focusElement = document.getElementById(focus.id);
      focusElement.style.opacity = sliderValue;
    }
  });
});

// Almacenar la imagen cargada por el boton image-input

imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      sectionB.style.width = `${img.width}px`;// sectionB tiene el width de la imagen.
      sectionB.style.height = `${img.height}px`;// sectionB tiene el height de la imagen.
      sectionBWidth = sectionB.offsetWidth;
      sectionBHeight = sectionB.offsetHeight;
    };
    todoFocos.forEach((element) => {
      element.style.backgroundImage = `url(${event.target.result})`;//se carga la imagen como fondo para todos los focos.
      bgImage=event.target.result;
    });
  };
  reader.readAsDataURL(file);

});



//mantener fijo el backgroundimage cada vez que se desplaza SectionB (scroll)

let scrollY = window.scrollY;
// Función para actualizar la posición del clip-path en función del scroll
function updateClipPath() {
  let newScrollY = window.scrollY;
  let pixelsMoved = newScrollY - scrollY;
  
  todoFocos.forEach((element) => {
    let clipPathValues = element.style.clipPath.split(' ');
    let clipPathTop = parseInt(clipPathValues[1]);
    
    if (pixelsMoved > 0) {
      clipPathTop -= pixelsMoved;
    } else {
      clipPathTop = Math.min(0, clipPathTop - pixelsMoved);
    }
    
    element.style.clipPath = `inset(${clipPathTop}px 0 0 0)`;
  });

  scrollY = newScrollY;
}

// Agregar un listener de scroll para actualizar el clip-path
window.addEventListener('scroll', updateClipPath);

//-------------------------








//----drag n drop focos---


//V2: sin transform y permite salirse de sectionB hasta la mitad
//creando la funcion
const dragFocos = (foco) => {
  foco.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const initialPosition = {
      x: e.pageX - foco.offsetLeft,
      y: e.pageY - foco.offsetTop
    };
    
    foco.style.zIndex = 1;

    const halfWidth = foco.offsetWidth / 2;
    const halfHeight = foco.offsetHeight / 2;

    const mouseMoveHandler = (event) => {
      const newPosX = event.pageX - initialPosition.x;
      const newPosY = event.pageY - initialPosition.y;

      const maxX = sectionBWidth - halfWidth;
      const maxY = sectionBHeight - halfHeight;
      
      let focusID = -1;
      
      for(let i=0; i<ArrayFocusID.length; i++){
        if(ArrayFocusID[i].id === foco.id){
          focusID = i;
          break;
        }
      }
      
      if(newPosX < -halfWidth) {
        ArrayFocusID[focusID].posX = -halfWidth;
        foco.style.left = -halfWidth + 'px';
      } else if(newPosX > maxX) {
        ArrayFocusID[focusID].posX = maxX;
        foco.style.left = maxX + 'px';
      } else {
        ArrayFocusID[focusID].posX = newPosX;
        foco.style.left = newPosX + 'px';
      }
      
      if(newPosY < -halfHeight) {
        ArrayFocusID[focusID].posY = -halfHeight;
        foco.style.top = -halfHeight + 'px';
      } else if(newPosY > maxY) {
        ArrayFocusID[focusID].posY = maxY;
        foco.style.top = maxY + 'px';
      } else {
        ArrayFocusID[focusID].posY = newPosY;
        foco.style.top = newPosY + 'px';
      }
      //desplazar el bg image para que parezca estar fija respecto al fondo
      foco.style.backgroundPosition = `${-newPosX}px ${-newPosY}px`;//Desplaza la imagen del foco
      /*Falta: Corregir el desplazamiento del img minifoco
              Se ignora minifocus ahsta resolver.
      const child = foco.querySelector(':first-child');//desplaza la imagen de su hijo
      */
      ArrayFocusID.forEach(f => {
        if(f.id !== foco.id){
          f.status = false;
          const otherFoco = document.getElementById(f.id);
          otherFoco.classList.remove('active');
        } else {
          f.status = true;
          foco.classList.add('active');
        }
      });
    };
 
    const mouseUpHandler = () => {
      foco.style.zIndex = 0;
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
    
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
};
//llamando la funcion
ArrayFocusID.forEach(foco => {
  const element = document.getElementById(foco.id);
  dragFocos(element);
  element.addEventListener('click', () => {
    ArrayFocusID.forEach(f => {
      if(f.id !== foco.id){
        f.status = false;
        const otherFoco = document.getElementById(f.id);
        otherFoco.classList.remove('active');
      } else {
        f.status = true;
        foco.classList.add('active');
      }
    });
  });
});


//---boton crear foco---

function crearFoco() {
  // Crear un nuevo elemento "foco"
  let nuevoFoco = document.createElement("div");
  nuevoFoco.classList.add("focus");
  nuevoFoco.id = 'foco' + focusCount;

  // Agregar el nuevo elemento al contenedor

  sectionB.appendChild(nuevoFoco);
  ArrayFocusID.push(
      {id: 'foco' + focusCount,
      size:0,
      posX:0,
      posY:0,
      status:false
      }
  )
  focusCount++;

  // Hacer el nuevo foco arrastrable y activable al hacer clic
  dragFocos(nuevoFoco);
  nuevoFoco.addEventListener('click', () => {
    ArrayFocusID.forEach(f => {
      if(f.id !== nuevoFoco.id){
        f.status = false;
        const otherFoco = document.getElementById(f.id);
        otherFoco.classList.remove('active');
      } else {
        f.status = true;
        nuevoFoco.classList.add('active');
      }
    });
  });
  nuevoFoco.style.backgroundImage = `url(${bgImage})`;
  
  todoFocos = document.querySelectorAll('.focus');
};


//-------Eliminar ultimo Foco---
function eliminarUltimoFoco(){
  let ultimoFoco = ArrayFocusID.pop();
  // Obtener el elemento del último foco creado por su ID
  let elemento = document.getElementById(ultimoFoco.id);
  // Eliminar el elemento
  elemento.remove();
}