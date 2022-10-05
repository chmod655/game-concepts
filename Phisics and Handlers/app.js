let ctx, controller, rectangle

ctx = document.querySelector('canvas').getContext('2d')

// Dimensões do canvas
ctx.canvas.width = 320
ctx.canvas.height = 180

// Entidade do player
rectangle = {
    width: 32,
    height: 32,
    posX: 144,
    posY: 0,
    x_velocity: 0,
    y_velocity: 0,
    jumping: true
}

// Manipula a entrada - Controla o jogador
controller = {
    left: false,
    right: false,
    up: false,

    keyListener(e) {
        let keyState = (e.type == 'keydown') ? true : false

        switch (e.key) {
            case 'a':
                controller.left = keyState
                break

            case 'w':
                controller.up = keyState
                break

            case 'd':
                controller.right = keyState
                break
        }
    }
}

// Renderiza o background
function renderBackground() {
    ctx.fillStyle = '#202020'
    ctx.fillRect(0, 0, 320, 180)

}

// Renderiza o chão
function renderFloor() {
    ctx.beginPath()
    ctx.lineWidth = 4
    ctx.strokeStyle = '#202830'
    ctx.moveTo(0, 164)
    ctx.lineTo(320, 164)
    ctx.stroke()
}

// Renderiza o jogador
function renderPlayer() {
    ctx.beginPath()
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(
        rectangle.posX,
        rectangle.posY,
        rectangle.width,
        rectangle.height
    )
    
    /**
     * 
     * Aqui eu faço o linker do controlador
     * se não tivesse isso aqui nada iria acontecer
     * movimentos não funcionariam
     * ===================
     * aqui estamos movimentando o jogador
     * 1 - condição 
     *  verifica se o controlador up e o player com prop pular é falsa
     *  no caso por padrão ela é falsa
     *  essa condição vai retornar true
     * 
     * então dentro dela
     * faremos o player pular 
     * removendo -20 de y_velocity que é a velocidade do pulo
     *  que mas tarde remove da posição y do canvas
     * 
     * ex: 
     *  canvas y :180
     *  pos player cai em 180 - 18 - 32 resultando a queda em cima do chao
     *  então ele tira vinte desses 130 -> 180-18-32 = 130
     *  ou seja 130 - 20 = 110 resultando no pulo
     *  e claro ele passa para o player a condição bool de false para true
     *  enquando a tecla for pressionada
     * ele é true logo apos de solta passa a false
     * 
     */

    // Controller Player
    if(controller.up && rectangle.jumping == false) {
        rectangle.y_velocity -= 20
        rectangle.jumping = true
    }

    // Se a condição for true
    /*
        Olhe o objeto controller
        como verdadeira ele remove 0.5 de vel x
        movendo o jogador enquanto a tecla pressionada 
        para a esquerda
    */
    if(controller.left) {
        rectangle.x_velocity -= 0.5
    }
    // o mesmo so que do lado oposto com o atribuidor += para adicionar 0.5
    if(controller.right) {
        rectangle.x_velocity += 0.5
    }

    /**
     *
     * A parte mais interessante 
     * e complicada para pessoas que 
     * começaram da pior maneira mais estupida
     * 
     * aqui é dada a gravidade que adiciona
     * a velocidade vertical 1.5
     * isso resulta a força da gravidade
     * que acelera a queda
     * 130 + ...
     * pode diminuir esse valor vc vera alguma diferença na
     * gravidade
     * poderia ser usada como uma asa como no terraria
     * em que quando a asa para é possivel planar
     * isso é incrivel
     * ou claro em muitas possibilidades 0.5 desse valor teste ai 
     * 
     */
    rectangle.y_velocity += 1.5 // Gravity

    /*
        depois adicionamos esses valores junto da posição
        x, y do canvas resultando em algo mais como
        velocidade e aldo mais fluido e suave
    */
    rectangle.posX += rectangle.x_velocity
    rectangle.posY += rectangle.y_velocity

    // Atrito 
    /**
     *  Para entender melhor sobre o assunto
     *  https://pt.wikipedia.org/wiki/Atrito
     *  
     */
    rectangle.x_velocity *= 0.9
    rectangle.y_velocity *= 0.9

    // delemita que quando a fisica e força de atrito iniciar ele n passe o limite do chao
    /*
        Para fixar isso acontece de delimitar fazendo uma pequena expressão de 
        posição y sendo ela maior que 180 que é o esquadro de
        canvas na posição vertical
        menos 18 - 32
        porem acredito que posso simplificar oss numeros
        ao em vez de 2 operadores de subtração
        expressão () 0 - 0 - 0
        para 
        expressão () 0 - 0
    */
    if(rectangle.posY > 180 - 18 - 32) {
        rectangle.jumping = false
        rectangle.posY = 180 - 18 - 32
        rectangle.y_velocity = 0
    }
    /*
        se p jogador passar de -32
        que no caso ira sumir da tela ele entra em uma condição que o faz
        aparecer no lado direito da tela
    */
    if(rectangle.posX < -32) {
        rectangle.posX = 320 // coloca o jogador no lado direito do canvas
    } 
    /*
     se a posição dele estiver maior que 320
     vamos ver 32 + 320 = 352 isso ja é um motivo de
     entrar nessa condição que faz o player ir para a posição 
     -32 que é do lado esquerdo
     posição x do canvas ,posição y do canvas
     352 -> -32
     -32, ...
        0------------
        ou --------------0 se for excedido o limite dado a esquerda
     */
    else if (rectangle.posX > 320) {
        rectangle.posX = -32
    }
}

// Loop do jogo
function loop() {

    // renderiza as camadas
    /*
        Background layer 1
        Floor layer 2 
        e player layer 3 ou o top level layer
    */
    renderBackground()
    renderFloor()
    renderPlayer()

    // Eu chamaria essa função de recursiva mais n sei
    requestAnimationFrame(loop)
}

// Recebe o input do teclado se
// Pressionado
window.addEventListener('keydown', controller.keyListener)
// Ou solto 
window.addEventListener('keyup', controller.keyListener)

// Chama a aplicação a ser iniciada
loop()