class Play extends Phaser.Scene {
    constructor() {
        super('playScene')

        this.isDestroyed = false // track ball's destruction status
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
        this.initialPos = {x: width / 2, y: height - height / 10}

    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {

        this.score = 0
        this.shots = 0
        this.percentage = 0

        let scoreConfig = {
            fontFamilt: 'Courier',
            fontSize: '18px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 150
        }

        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        //make bounding body a square to match cup circle
        this.cup.body.setCircle(this.cup.width / 2)
        this.cup.body.setOffset(this.cup.width / 50)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(this.initialPos.x, this.initialPos.y, 'ball')
        //adjust bounds
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2))
        wallA.body.setImmovable(true)


        wallA.setVelocityX(150)
        wallA.body.setBounce(1)
        wallA.body.setCollideWorldBounds(true)
        
        //this.physics.world.enable(wallA)
        
        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(width / 2, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width /2, width - this.oneWay.width /2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirectiony = pointer.y <= this.ball.y ? 1 : -1
            let shotDirectionx = pointer.x <= this.ball.x ? 1 : -1
            this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X) * shotDirectionx)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectiony)
            this.shots++
            this.shotsText.text = "swings: " + this.shots
             
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, this.scoreCounter, (ball, cup) => {
            // ball.destroy()
            // this.isDestroyed = true
            ball.setPosition(this.initialPos.x, this.initialPos.y)
            ball.body.setVelocity(0, 0)
            this.score++
            this.scoreText.text = "score: " + this.score
            
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)

        this.scoreText = this.add.text(5, 10, "score: " + this.score, scoreConfig)
        this.shotsText = this.add.text(5, 50, "swings: " + this.shots, scoreConfig)
        this.percentageText = this.add.text(5, 90, "success: " + this.percentage, scoreConfig)

    }

    update() {
        // if (this.ball.isDestroyed) {
        //     this.create()
        // }

        // if (this.wallA.x <= 0 || this.wallA.y >= this.game.config.width) {
        //     this.wallA.setVelocityX(-this.wallA.body.velocity.x)
        // }
        
        if (this.score != 0 && this.shots != 0) {
            this.percentage = this.score/this.shots
            this.percentageText.text = "success: " + this.percentage
        }
        
    }
    
    
    
}

/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[1] Add ball reset logic on successful shot
[ ] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[1] Make one obstacle move left/right and bounce against screen edges
[1] Create and display shot counter, score, and successful shot percentage
*/