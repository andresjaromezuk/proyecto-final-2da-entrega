En el webrouter:
----------------

webRouter.get('/chat', async (req, res) =>{
     try {
       const ioServer = req.io
       
       ioServer.on('connection', async (socket)=>{
          let messages = await dbChat.find().lean()
          console.log("Cliente conectado")
          socket.emit('mensajes', messages)

          socket.broadcast.emit('nuevoUsuario',
               socket.handshake.auth.username
          )

          socket.on('mensaje', async message =>{
               console.log("llega esto", message)
               message._id = randomUUID()
               const msg = await dbChat.create(message)
               messages = await dbChat.find().lean()
               ioServer.sockets.emit('mensajes',messages)
          })

          socket.on('disconnecting', reason => {
               socket.broadcast.emit('usuarioDesconectado',
                 socket.handshake.auth.username)
          })
       })
       return res.render('chat', {title:"Chat"})
     } catch (error) {
          res.status(500).json({status: "Error", error: error.message})
     }
  })

En el JS del cliente

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
