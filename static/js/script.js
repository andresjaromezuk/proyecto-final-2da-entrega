const form = document.querySelector('form')
const input = document.querySelector('input')
const ulMensajes = document.querySelector('ul')
let username
Swal.fire({
    title: 'Chat',
    input: 'text',
    text: 'Ingrese su nombre:',
    inputValidator: value => {
      return !value && 'debe ingresar un nombre!'
    },
    allowOutsideClick: false,
  }).then(result => {
    username = result.value
    document.querySelector('input')?.focus()
    chatear()
  })

  function chatear(){
    const socket = io({
        auth: {
          username
        }
      })

      form.addEventListener('submit', e => {
        e.preventDefault()
        enviarMensaje(username, input.value)
        input.value = ''
    })
    
    function enviarMensaje(user, message){
        socket.emit('mensaje', {
            user,
            message
        })
    }

    socket.on('mensajes', messages =>{
        ulMensajes.innerHTML = ''
        messages.forEach(({user, message}) => {
            const send =`${user}: ${message}`
            const li = document.createElement('li')
            li.innerHTML = send
            ulMensajes.appendChild(li)
        });
    })

    socket.on('nuevoUsuario', nombreUsuario => {
        Swal.fire({
          text: `${nombreUsuario} está en linea`,
          toast: 'true',
          position: 'top-right'
        })
    })

    socket.on('usuarioDesconectado', nombreUsuario => {
        Swal.fire({
          text: `${nombreUsuario} se ha desconectado`,
          toast: 'true',
          position: 'top-right'
        })
    })

    
  }
