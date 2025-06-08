(() => {
    class Neko extends EventTarget {
        constructor(parentElement, options = {}) {
            super();

            this.parentElement = parentElement;

            this.spritePath = options.spritePath || document.currentScript?.getAttribute("data-sprite-path") || this.spritePath;
            this.speed = options.speed || parseFloat(document.currentScript?.getAttribute("data-speed")) || this.speed;
            this.framesPerSecond = options.framesPerSecond || parseInt(document.currentScript?.getAttribute("data-fps")) || this.framesPerSecond;
            this.minimumCursorDistance = options.minimumCursorDistance ?? this.minimumCursorDistance;
            this.cursorWait = options.cursorWait ?? this.cursorWait;
            this.spriteWidth = options.spriteWidth ?? this.spriteWidth;
            this.spriteHeight = options.spriteHeight ?? this.spriteHeight;
            this.xOffset = options.xOffset ?? this.xOffset;
            this.yOffset = options.yOffset ?? this.yOffset;
            this.xMax = options.xMax ?? this.xMax;
            this.yMax = options.yMax ?? this.yMax;
            this.xStart = options.xStart ?? this.xStart;
            this.yStart = options.yStart ?? this.yStart;
            this.idleTime = options.idleTime ?? this.idleTime;
            this.idleAnimations = options.idleAnimations ?? this.idleAnimations;
            this.sprites = options.sprites ?? this.sprites;

            this.start();
        }

        parentElement = null;

        spritePath = "./neko.gif"; // Path of neko.gif, can be base64 instead
        speed = 20; // Speed of neko
        framesPerSecond = 5; // Animation FPS
        minimumCursorDistance = 32; // Minimum distance from cursor before moving
        cursorWait = 1000; // Time to wait before moving to cursor
        spriteWidth = 32; // Default width of each sprite
        spriteHeight = 32; // Default height of each sprite
        xOffset = -this.spriteWidth; // X position offset
        yOffset = -this.spriteHeight; // Y position offset
        xMax = window.innerWidth; // Highest X value, should be window width
        yMax = window.innerHeight; // Highest Y value, should be window height
        xStart = 16 - this.xOffset; // X start position
        yStart = 16 - this.yOffset; // Y start position
        idleTime = 10000; // Time to wait before entering "idle" mode (allowing for the below animations to play)
        // Animations for "idle" mode with a x% chance of triggering per second
        idleAnimations = [
            { spriteName: "scratchSelf", duration: 3000, chance: 5 },
            { spriteName: "tired", duration: 2000, chance: 5 },
            { spriteName: "sleeping", duration: 30000, chance: 5 },
            { spriteName: "scratchWallU", duration: 7000, chance: 2.5, scratchWall: "U" },
            { spriteName: "scratchWallR", duration: 7000, chance: 2.5, scratchWall: "R" },
            { spriteName: "scratchWallD", duration: 7000, chance: 2.5, scratchWall: "D" },
            { spriteName: "scratchWallL", duration: 7000, chance: 2.5, scratchWall: "L" },
        ]
        // All sprites, sprites should be able to have unique a unique width and height however untested
        sprites = {
            sit: [
                {
                    x: this.spriteWidth * 3,
                    y: this.spriteHeight * 3
                }
            ],
            alert: [
                {
                    x: this.spriteWidth * 7,
                    y: this.spriteHeight * 3
                }
            ],
            scratchSelf: [
                {
                    x: this.spriteWidth * 5,
                    y: this.spriteHeight * 0
                },
                {
                    x: this.spriteWidth * 6,
                    y: this.spriteHeight * 0
                },
                {
                    x: this.spriteWidth * 7,
                    y: this.spriteHeight * 0
                },
            ],
            tired: [
                {
                    x: this.spriteWidth * 3,
                    y: this.spriteHeight * 2
                }
            ],
            sleeping: [
                {
                    x: this.spriteWidth * 2,
                    y: this.spriteHeight * 0
                },
                {
                    x: this.spriteWidth * 2,
                    y: this.spriteHeight * 1
                },
            ],
            scratchWallU: [
                {
                    x: this.spriteWidth * 0,
                    y: this.spriteHeight * 0
                },
                {
                    x: this.spriteWidth * 0,
                    y: this.spriteHeight * 1
                }
            ],
            scratchWallR: [
                {
                    x: this.spriteWidth * 2,
                    y: this.spriteHeight * 2
                },
                {
                    x: this.spriteWidth * 2,
                    y: this.spriteHeight * 3
                }
            ],
            scratchWallD: [
                {
                    x: this.spriteWidth * 7,
                    y: this.spriteHeight * 1
                },
                {
                    x: this.spriteWidth * 6,
                    y: this.spriteHeight * 2
                }
            ],
            scratchWallL: [
                {
                    x: this.spriteWidth * 4,
                    y: this.spriteHeight * 0
                },
                {
                    x: this.spriteWidth * 4,
                    y: this.spriteHeight * 1
                }
            ],
            runningUL: [
                {
                    x: this.spriteWidth * 1,
                    y: this.spriteHeight * 0,
                },
                {
                    x: this.spriteWidth * 1,
                    y: this.spriteHeight * 1,
                }
            ],
            runningU: [
                {
                    x: this.spriteWidth * 1,
                    y: this.spriteHeight * 2,
                },
                {
                    x: this.spriteWidth * 1,
                    y: this.spriteHeight * 3,
                }
            ],
            runningUR: [
                {
                    x: this.spriteWidth * 0,
                    y: this.spriteHeight * 2,
                },
                {
                    x: this.spriteWidth * 0,
                    y: this.spriteHeight * 3,
                }
            ],
            runningR: [
                {
                    x: this.spriteWidth * 3,
                    y: this.spriteHeight * 0,
                },
                {
                    x: this.spriteWidth * 3,
                    y: this.spriteHeight * 1,
                }
            ],
            runningDR: [
                {
                    x: this.spriteWidth * 5,
                    y: this.spriteHeight * 1,
                },
                {
                    x: this.spriteWidth * 5,
                    y: this.spriteHeight * 2,
                }
            ],
            runningD: [
                {
                    x: this.spriteWidth * 7,
                    y: this.spriteHeight * 2,
                },
                {
                    x: this.spriteWidth * 6,
                    y: this.spriteHeight * 3,
                }
            ],
            runningDL: [
                {
                    x: this.spriteWidth * 5,
                    y: this.spriteHeight * 3,
                },
                {
                    x: this.spriteWidth * 6,
                    y: this.spriteHeight * 1,
                }
            ],
            runningL: [
                {
                    x: this.spriteWidth * 4,
                    y: this.spriteHeight * 2,
                },
                {
                    x: this.spriteWidth * 4,
                    y: this.spriteHeight * 3,
                }
            ],
        }

        nekoElement = null;
        animationFrameId = null;
        lastAnimationFrame = null;
        lastCursorMove = null;
        currentSprite = null;
        x = null;
        y = null;
        xTarget = null;
        yTarget = null;

        start() {
            this.stop();

            this.nekoElement = document.createElement("div");

            this.nekoElement.style.position = "fixed";
            this.nekoElement.style.backgroundImage = `url(${this.spritePath})`;
            this.nekoElement.style.imageRendering = "pixelated";

            this.parentElement.appendChild(this.nekoElement);

            this.setSprite("sit");
            this.setPosition(this.xStart, this.yStart);

            // Cursor event
            addEventListener("mousemove", ev => {
                const cursorX = ev.clientX;
                const cursorY = ev.clientY;

                if (this.lastCursorMove && this.lastCursorMove.x === cursorX && this.lastCursorMove.y === cursorY) return;

                this.lastCursorMove = {
                    x: cursorX,
                    y: cursorY,
                    date: Date.now()
                };

                const distance = Math.sqrt((this.lastCursorMove.x - this.x) ** 2 + (this.lastCursorMove.y - this.y) ** 2);
                if (distance >= this.minimumCursorDistance) {
                    // Set alert if outside minimum distance
                    this.setSprite("alert");
                }
            });

            // Loop
            this.loop()
            this.animationFrameId = requestAnimationFrame(this.loop);
        }

        stop() {
            this.nekoElement?.remove();

            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }

            this.lastAnimationFrame = null;
            this.lastCursorMove = null;
            this.currentSprite = null;
            this.x = null;
            this.y = null;
            this.xTarget = null;
            this.yTarget = null;
        }

        loop = () => {
            const date = Date.now();
            const frameTime = this.lastAnimationFrame ? date - this.lastAnimationFrame : 0;
            this.lastAnimationFrame = date;

            // Reset sprite after duration
            if (this.currentSprite.duration && date > this.currentSprite.spriteDate + this.currentSprite.duration) {
                this.setSprite("sit");
            }

            // Update sprite frame
            if (date >= this.currentSprite.frameDate + (1000 / this.framesPerSecond)) {
                const frameIndex = this.currentSprite.frameIndex + 1;
                this.setSprite(this.currentSprite.spriteName, frameIndex >= this.currentSprite.sprite.length ? 0 : frameIndex);
            }

            // Idle animation
            if (date - this.currentSprite.spriteDate > this.idleTime) {
                if (this.currentSprite.spriteName === "sit") {
                    const randomAnimation = this.idleAnimations[Math.floor(Math.random() * this.idleAnimations.length)];
                    // x% chance every second
                    if (Math.random() * 100 < (randomAnimation.chance / 1000) * frameTime) {
                        if (randomAnimation.scratchWall) {
                            const xTarget = randomAnimation.scratchWall === "U" || randomAnimation.scratchWall === "D" ? Math.floor(Math.random() * (this.xMax - 1)) : randomAnimation.scratchWall === "L" ? 0 : randomAnimation.scratchWall === "R" ? this.xMax - (this.currentSprite.sprite.width || this.spriteWidth) : null;
                            const yTarget = randomAnimation.scratchWall === "L" || randomAnimation.scratchWall === "R" ? Math.floor(Math.random() * (this.yMax - 1)) : randomAnimation.scratchWall === "U" ? 0 : randomAnimation.scratchWall === "D" ? this.yMax - (this.currentSprite.sprite.height || this.spriteHeight) : null;
                            this.moveTo(xTarget - this.xOffset, yTarget - this.yOffset);
                            const sitListener = () => {
                                this.removeEventListener("sit", sitListener);
                                this.setSprite(randomAnimation.spriteName, 0, randomAnimation.duration);
                            }
                            this.addEventListener("sit", sitListener);
                        } else {
                            this.setSprite(randomAnimation.spriteName, 0, randomAnimation.duration);
                        }
                    }
                }
            }

            // Start running to cursor
            if (this.lastCursorMove && date - this.lastCursorMove.date >= this.cursorWait) {
                const distance = Math.sqrt((this.lastCursorMove.x - this.x) ** 2 + (this.lastCursorMove.y - this.y) ** 2);
                if (distance >= this.minimumCursorDistance) {
                    // Cursor is outside minimum distance
                    this.moveTo(this.lastCursorMove.x, this.lastCursorMove.y);
                } else {
                    // Cursor is inside minimum distance
                    if (this.currentSprite.spriteName === "alert") this.setSprite("sit");
                }
                this.lastCursorMove = null;
            }

            // Take steps to target
            if (this.xTarget !== null && this.yTarget !== null) {
                const xDistance = this.xTarget - this.x;
                const yDistance = this.yTarget - this.y;
                const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2);

                const xDirection = xDistance / distance;
                const yDirection = yDistance / distance;

                const xMove = xDirection * (this.speed / 100) * frameTime;
                const yMove = yDirection * (this.speed / 100) * frameTime;

                // Set running animation
                this.setSprite(`running${yDirection > 0.5 ? "D" : yDirection < -0.5 ? "U" : ""}${xDirection > 0.5 ? "R" : xDirection < -0.5 ? "L" : ""}`);

                // Move neko
                this.setPosition(
                    Math.abs(xDistance) > xMove ? this.x + xMove : this.xTarget,
                    Math.abs(yDistance) > yMove ? this.y + yMove : this.yTarget
                );

                // Stop running if at target
                if (this.x === this.xTarget && this.y === this.yTarget) {
                    this.xTarget = null;
                    this.yTarget = null;

                    this.setSprite("sit");
                }
            }

            this.animationFrameId = requestAnimationFrame(this.loop);
        }

        setSprite(spriteName = this.sprites[0], frameIndex, duration) {
            const sprite = this.sprites[spriteName];
            const frame = sprite[frameIndex ?? 0];
            const sameSprite = this.currentSprite?.sprite === sprite;
            const sameFrame = this.currentSprite?.frame === frame;

            if (sameSprite && (frameIndex === undefined || sameFrame)) return;

            this.nekoElement.style.backgroundPositionX = `-${frame.x}px`;
            this.nekoElement.style.backgroundPositionY = `-${frame.y}px`;
            this.nekoElement.style.width = `${frame.width || this.spriteWidth}px`;
            this.nekoElement.style.height = `${frame.height || this.spriteHeight}px`;

            this.currentSprite = {
                spriteName,
                frameIndex: frameIndex ?? 0,
                sprite,
                frame,
                spriteDate: sameSprite ? this.currentSprite.spriteDate : Date.now(),
                frameDate: sameFrame ? this.currentSprite.frameDate : Date.now(),
                duration: duration || (sameSprite ? this.currentSprite?.duration : undefined)
            };

            if (!sameSprite) this.dispatchEvent(new CustomEvent(spriteName, this.currentSprite));
        }

        setPosition(x, y) {
            this.x = x;
            this.y = y;
            this.nekoElement.style.left = `${Math.round(this.x + this.xOffset)}px`;
            this.nekoElement.style.top = `${Math.round(this.y + this.yOffset)}px`;
        }

        moveTo(x = this.x, y = this.y) {
            this.xTarget = x;
            this.yTarget = y;
        }
    }

    const neko = new Neko(document.body);
})();