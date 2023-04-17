const dataBox = document.getElementById("data-box");
const imageInput = document.getElementById('image-input');
let bgImage;
const slider = document.getElementById('slider');
const dragBar = document.getElementById('drag-bar');
const sectionA = document.getElementById('section-a');
const sectionB = document.getElementById('section-b');
let sectionAHeight = sectionA.offsetHeight;
let sectionAwidth = sectionA.offsetWidth;
const sectionBHeight = sectionB.offsetHeight;
const sectionBWidth = sectionB.offsetWidth;
let todoFocos = document.querySelectorAll('.focus-image-clip');
let imageWidth, imageHeight, sectionBCenter, mousePosition;
let minSectionBSize = Math.min(sectionBHeight, sectionBWidth);

let focoSize = slider.value;
let focusCount = 1;
let ArrayFocusID = [
    {id: 'foco0',
     size:'20px',
     posX:0,
     posY:0,
     status:true},
];

//tamaño de imagen
imageWidth = imageInput.width;
imageHeight = imageInput.height;

//estilo dinamico para el slider
slider.style.height = `${sectionAHeight / 2}px`;

// Almacenar la imagen cargada por el boton image-input
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  
  reader.onload = (event) => {
    todoFocos.forEach((foco) => {
      foco.style.backgroundImage = `url(${event.target.result})`;
      sectionAwidth = sectionA.offsetWidth;
      foco.style.backgroundPositionX = (sectionAwidth + 5) + 'px';

      bgImage=event.target.result;

    });
  };
  reader.readAsDataURL(file);

    // Almacenar el tamaño de la imagen en pixeles
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
        imageWidth = img.width;
        imageHeight = img.height;

    };

});

// Almacenar en tiempo real la posición del mouse en la sección B
sectionB.addEventListener('mousemove', (e) => {
  mousePosition = {
    x: e.offsetX,
    y: e.offsetY
  };
});

//----drag n drop focos---

//@Revisar
for (let i = 0; i < todoFocos.length; i++) {
  let foco = todoFocos[i];
  foco.addEventListener('mousedown', function(e) {
    // Agregar clase active y actualizar estado en el array
    for (let j = 0; j < ArrayFocusID.length; j++) {
      ArrayFocusID[j].status = false;
      const otherFoco = document.getElementById(ArrayFocusID[j].id);
      otherFoco.classList.remove('active');
    }
    let focoID = e.target.id;
    let focoIndex = ArrayFocusID.findIndex(f => f.id === focoID);
    ArrayFocusID[focoIndex].status = true;
    foco.classList.add('active');
    
    // Almacenar la posición del mouse
    let rect = foco.getBoundingClientRect();
    let offsetX = e.clientX - rect.left;
    let offsetY = e.clientY - rect.top;
    mousePosition = { x: offsetX, y: offsetY };
  });
}
// función para actualizar el estado del foco
function updateFocusStatus(focoId) {
  // recorremos el array de focos
  for (let i = 0; i < ArrayFocusID.length; i++) {
    const foco = ArrayFocusID[i];
    // si encontramos el foco correspondiente al id, actualizamos su estado a true y su posición en el array
    if (foco.id === focoId) {
      foco.status = true;
      ArrayFocusID.splice(i, 1);
      ArrayFocusID.unshift(foco);
    } else {
      // si no es el foco correspondiente, lo actualizamos a false
      foco.status = false;
    }
  }
}

// función para mover el foco
function moveFocus(e) {
  // si hay un foco seleccionado, lo movemos
  if (selectedFocus) {
    // calculamos la nueva posición del foco
    let newPosX = e.clientX - mousePosition.x;
    let newPosY = e.clientY - mousePosition.y;
    
    // comprobamos que el foco no salga del sectionB
    if (newPosX < 0) {
      newPosX = 0;
    } else if (newPosX > sectionBWidth - selectedFocus.offsetWidth) {
      newPosX = sectionBWidth - selectedFocus.offsetWidth;
    }
    if (newPosY < 0) {
      newPosY = 0;
    } else if (newPosY > sectionBHeight - selectedFocus.offsetHeight) {
      newPosY = sectionBHeight - selectedFocus.offsetHeight;
    }

    // actualizamos la posición del foco y su estilo
    selectedFocus.style.left = newPosX + 'px';
    selectedFocus.style.top = newPosY + 'px';

    // actualizamos el estado del foco seleccionado y su clase
    updateFocusStatus(selectedFocus.id);
    selectedFocus.classList.add('active');
    todoFocos.forEach(foco => {
      if (foco !== selectedFocus) {
        foco.classList.remove('active');
      }
    });
  }
}

// V1, sin utilizar transofrm -50%
/*
const dragFocos = (foco) => {
  foco.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const initialPosition = {
      x: e.clientX - foco.offsetLeft,
      y: e.clientY - foco.offsetTop
    };
    
    foco.style.zIndex = 1;


    const mouseMoveHandler = (event) => {
      const newPosX = event.clientX - initialPosition.x;
      const newPosY = event.clientY - initialPosition.y;
      const maxX = sectionBWidth - foco.offsetWidth;
      const maxY = sectionBHeight - foco.offsetHeight;
      
      let focusID = -1;
      
      for(let i=0; i<ArrayFocusID.length; i++){
        if(ArrayFocusID[i].id === foco.id){
          focusID = i;
          break;
        }
      }
      
      if(newPosX < 0) {
        ArrayFocusID[focusID].posX = 0;
        foco.style.left = '0px';
      } else if(newPosX > maxX) {
        ArrayFocusID[focusID].posX = maxX;
        foco.style.left = maxX + 'px';
      } else {
        ArrayFocusID[focusID].posX = newPosX;
        foco.style.left = newPosX + 'px';
      }
      
      if(newPosY < 0) {
        ArrayFocusID[focusID].posY = 0;
        foco.style.top = '0px';
      } else if(newPosY > maxY) {
        ArrayFocusID[focusID].posY = maxY;
        foco.style.top = maxY + 'px';
      } else {
        ArrayFocusID[focusID].posY = newPosY;
        foco.style.top = newPosY + 'px';
      }
      
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
*/

//V2: sin transform y permite salirse de sectionB hasta la mitad
const dragFocos = (foco) => {
  foco.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const initialPosition = {
      x: e.clientX - foco.offsetLeft,
      y: e.clientY - foco.offsetTop
    };
    
    foco.style.zIndex = 1;

    const halfWidth = foco.offsetWidth / 2;
    const halfHeight = foco.offsetHeight / 2;

    const mouseMoveHandler = (event) => {
      const newPosX = event.clientX - initialPosition.x;
      const newPosY = event.clientY - initialPosition.y;
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










//funcionalidad para el drag-bar
let isDragging = false;
dragBar.addEventListener('mousedown', function(e) {
  isDragging = true;
});

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      const mouseX = e.clientX;
      const windowWidth = window.innerWidth;
      const minSectionALength = 0.05 * windowWidth; // 5% of window width
      const maxSectionALength = 0.4 * windowWidth; // 40% of window width
      let sectionALength = mouseX;
  
      // Limit sectionA width to the allowed range
      if (sectionALength < minSectionALength) {
        sectionALength = minSectionALength;
      } else if (sectionALength > maxSectionALength) {
        sectionALength = maxSectionALength;
      }
      const sectionBLength = windowWidth - sectionALength;
      sectionA.style.width = `${sectionALength}px`;
      sectionB.style.width = `${sectionBLength}px`;
      dragBar.style.left = `${sectionALength}px`;
      todoFocos = document.querySelectorAll('.focus-image-clip');
      sectionAwidth = sectionA.offsetWidth;
      todoFocos.forEach((foco) => {
      foco.style.backgroundPositionX = (sectionAwidth + 5) + 'px'
      });
  
    }
});

document.addEventListener('mouseup', function(e) {
  isDragging = false;
});




// Almacenar en tiempo real la posición en pixeles del centro-centro de la sección B
const updateSectionBCenter = () => {
  const sectionBRect = sectionB.getBoundingClientRect();
  sectionBCenter = {
    x: sectionBRect.left + sectionBRect.width / 2,
    y: sectionBRect.top + sectionBRect.height / 2
  };
};


window.addEventListener('resize', updateSectionBCenter);
updateSectionBCenter();

// Almacenar en tiempo real el valor del slider


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
    dataBox.value = sliderValue;
  });


//-------Crear nuevo foco--------
  function crearFoco() {
    // Crear un nuevo elemento "foco"
    let nuevoFoco = document.createElement("div");
    nuevoFoco.classList.add("focus-image-clip");
    nuevoFoco.id = 'foco' + focusCount;

    // Agregar el nuevo elemento al contenedor
    let contenedor = document.getElementById("section-b");
    contenedor.appendChild(nuevoFoco);
    ArrayFocusID.push(
        {id: 'foco' + focusCount,
        size:0,
        posX:"50%",
        posY:"50%",
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
    todoFocos = document.querySelectorAll('.focus-image-clip');
    sectionAwidth = sectionA.offsetWidth;

    todoFocos.forEach((foco) => {
      foco.style.backgroundPositionX = (sectionAwidth + 5) + 'px'

      });

  
};

  
//-------Eliminar ultimo Foco---
function eliminarUltimoFoco(){
  let ultimoFoco = ArrayFocusID.pop();
  // Obtener el elemento del último foco creado por su ID
  let elemento = document.getElementById(ultimoFoco.id);
  // Eliminar el elemento
  elemento.remove();
}