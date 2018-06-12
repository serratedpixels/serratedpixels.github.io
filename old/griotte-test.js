function load_griotte(){
    stage.removeChildren();

    newButton("Back", 0xC0C0C0, index, 16,16);

    var loader = new PIXI.loaders.Loader();

    loader
    .add('spineCharacter', 'spine-assets/griotte-sprite.json')
    .load(function (loader, resources) {
        var animation = new PIXI.spine.Spine(resources.spineCharacter.spineData);
        var skeleton = animation.skeleton;
        stage.addChild(animation);

        animation.position.set(640,700);
        skeleton.setSkinByName("full outfit");

        animation.state.addAnimation(0, 'default', false, 0);
        animation.state.addAnimation(0, 'scarlet peek', false, 0);
        animation.state.addAnimation(0, 'scarlet threaten', false, 0);
        animation.state.addAnimation(0, 'cleaver trick', false, 0);
        animation.state.addAnimation(0, 'headless dance', false, 0);

        newButton("Full Outfit", 0xC0C0C0, function(){
            skeleton.setSkinByName("full outfit");
            skeleton.setSlotsToSetupPose();
        }, 16,640);

        newButton("Underwear", 0xC0C0C0, function(){
            skeleton.setSkinByName("underwear");
            skeleton.setSlotsToSetupPose();
        }, 16,672);

        var targetbone = skeleton.findBone("neck spray");
        var drawlayer = new PIXI.Graphics();
        stage.addChild(drawlayer);

        var emitter = add_bloodspray();

        ticker.add(function(){
            center_bloodspray(animation,emitter,targetbone);
        });
    });
}

function draw_target(animation,drawlayer,target){
    drawlayer.clear();
    drawlayer.lineStyle(1,0xFFFF00,1,0.5);
    drawlayer.drawCircle(animation.x + target.worldX, animation.y + target.worldY, 8);
}

function center_bloodspray(animation,emitter,target){
    emitter.updateSpawnPos(animation.x + target.worldX, animation.y + target.worldY);
    console.log(animation.rotation, target.localToWorldRotation(target.rotation));
    emitter.rotate(90 + animation.rotation + target.localToWorldRotation(target.rotation));
}

function add_bloodspray(){
    var emitter = new PIXI.particles.Emitter(
        stage,
        [PIXI.Texture.fromImage('particle.png')],
        {
            "alpha": {
                "start": 1,
                "end": 1
            },
            "scale": {
                "start": 0.05,
                "end": 0.01,
                "minimumScaleMultiplier": 2
            },
            "color": {
                "start": "#df001f",
                "end": "#1f0000"
            },
            "speed": {
                "start": 200,
                "end": 50,
                "minimumSpeedMultiplier": 1.5
            },
            "acceleration": {
                "x": 0,
                "y": 300
            },
            "maxSpeed": 0,
            "startRotation": {
                "min": 250,
                "max": 290
            },
            "noRotation": false,
            "rotationSpeed": {
                "min": 0,
                "max": 0
            },
            "lifetime": {
                "min": 0.5,
                "max": 2
            },
            "blendMode": "normal",
            "frequency": 0.001,
            "emitterLifetime": -1,
            "maxParticles": 1000,
            "pos": {
                "x": 64,
                "y": 64
            },
            "addAtBack": false,
            "spawnType": "point"
        }
    );

    emitter.emit = true;
    emitter.autoUpdate = true;

    return emitter;
}