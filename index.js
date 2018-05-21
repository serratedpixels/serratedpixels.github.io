var indexData = [
    {
        type: "label",
        name: "Character Requests",
        color: 0xFFFFFF
    },
    {
        type: "button",
        name: "Cloth Lioness (by Cloth King)",
        data: "cking-lion",
        color: 0xFFDE7D
    },
    {
        type: "button",
        name: "Felicia (by Felixeon)",
        data: "felix-felicia",
        color: 0xB6B6FF
    },
    {
        type: "button",
        name: "Leafeon (by Mari)",
        data: "mari-leafeon",
        color: 0xFFFFB6
    },
    {
        type: "button",
        name: "Minotte (by Fergzilla)",
        data: "ferg-skunk",
        color: 0x6CC3D9
    },
    {
        type: "button",
        name: "Reshiram (by Mari)",
        data: "mari-reshi",
        color: 0xC2C2C2
    },
    {
        type: "button",
        name: "Yveltal (by Lucian)",
        data: "lucian-yvel",
        color: 0xFF0000
    },
    {
        type: "label",
        name: "Celebrity Cast",
        color: 0xFFFFFF
    },
    {
        type: "button",
        name: "Funtime Foxy",
        data: "funtime-foxy",
        color: 0xFF00FF
    },
    {
        type: "button",
        name: "Catty",
        data: "catty",
        color: 0xDAB6FF
    },
    {
        type: "button",
        name: "Griotte (cw: gore)",
        data: "griotte",
        color: 0x80002A
    },
    {
        type: "button",
        name: "Hariet (cw: gore)",
        data: "hariet",
        color: 0x7D00FF
    }
];

function index(){
    stage.removeChildren();
    ticker.destroy();
    ticker = new PIXI.ticker.Ticker();
    ticker.start();

    function setButton(item){
        var data = item.data;
        return function(){
            router.setRoute(data);
        }
    }

    var buttontop = 16;
    for (var item of indexData){
        if(item.type == "label"){
            newLabel(item.name, item.color, 16,buttontop); 
        }else if(item.type == "button"){
            newButton(item.name, item.color, setButton(item), 32,buttontop); 
        }
        buttontop += 32;
    }
}

function load_puppet(puppet){
    stage.removeChildren();

    newButton("Back", 0xC0C0C0, function(){   
        router.setRoute("/");
    }, 16,16);

    var loader = new PIXI.loaders.Loader();

    loader
    .add('spineCharacter', 'spine-assets/' + puppet.name + '-sprite.json')
    .load(function (loader, resources) {
        var animation = new PIXI.spine.Spine(resources.spineCharacter.spineData);
        var skeleton = animation.skeleton;
        stage.addChild(animation);

        animation.position.set(appwidth/2,appheight*0.95);
        animation.scale.set(1,1);
        skeleton.setSkinByName(puppet.skins[0].name);

        function playSequence(sequence){
            for(var i=0;i<4;i++){
                animation.state.setEmptyAnimation(i,0);
            }
            for (var i of sequence.sequence){
                var anim = puppet.animations[i];
                var track = anim.track || 0;
                animation.state.addAnimation(track, anim.name, anim.loop, 0);
            }
        }

        playSequence(puppet.sequences[0]);

        var buttontop = 48;

        function setSequence(sequence){
            var thissequence = sequence;
            return function() {
                playSequence(sequence);
            }
        }

        for (var sequence of puppet.sequences){
            newButton(sequence.label, 0xC0C0C0, setSequence(sequence), 16, buttontop);
            buttontop += 32;
        }

        buttontop = 16;

        function setAnim(anim){
            var thisanim = anim;
            return function() {
                var track = anim.track || 0;
                if(track == 0){
                    for(var i=0;i<4;i++){
                        animation.state.setEmptyAnimation(i,0);
                    }
                }
                animation.state.addAnimation(track, thisanim.name, thisanim.loop, 0);
            }
        }

        for (var anim of puppet.animations){
            newButton(anim.label, 0xC0C0C0, setAnim(anim), appwidth-16, buttontop, "right");
            buttontop += 32;
        }

        buttontop = (appheight-16) - (32*puppet.skins.length);

        function setSkin(skin){
            var skinname = skin.name;
            return function() {
                skeleton.setSkinByName(skinname);
                skeleton.setSlotsToSetupPose();
            }
        }

        for (var skin of puppet.skins){
            newButton(skin.label, 0xC0C0C0, setSkin(skin), 16, buttontop);
            buttontop += 32;
        }
    });
}

function newLabel(text,color, x, y){
    var label = new PIXI.Text(text, {fill: color});

    label.x = x;
    label.y = y;
    
    stage.addChild(label);
}

function newButton(text,color,func, x, y, align){
    var button = new PIXI.Text(text, {fill: color, align: align});
    button.interactive = true;
    button.on("mouseover",function(){
        button.savedcolor = button.style.fill;
        button.style.fill = 0xFFFFFF;
    });
    button.on("mouseout",function(){
        button.style.fill = button.savedcolor;
    });
    button.on("pointerdown", func);

    if(align == "right"){
        button.x = x - button.width;
    }else{
        button.x = x
    }
    button.y = y;
    
    stage.addChild(button);
}