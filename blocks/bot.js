const mineflayer = require("mineflayer");

const settings = {
    username: "TestMachine",
    host: "localhost",
    port: 60427,
};

const bot = mineflayer.createBot(settings);

async function digDown() {
    let blockPosition = bot.entity.position.offset(0, -1, 0);
    let block = bot.blockAt(blockPosition);

    await bot.dig(block, false);
    bot.chat("Dug.");
}

function isGoldBlock(block) {
    return block.name === "gold_block";
}

function digGold() {
    let block = bot.findBlock({
        matching: isGoldBlock,
        maxDistance: 5,
    });

    if (block) bot.dig(block, false);
    else bot.chat("i can't reach ;-;");
}

async function buildUp() {
    // Start Jump
    bot.setControlState("jump", true);

    // Wait until the bot is high enough
    while (true) {
        let positionBelow = bot.entity.position.offset(0, -0.5, 0);
        let blockBelow = bot.blockAt(positionBelow);

        if (blockBelow.name === "air") break;
        await bot.waitForTicks(1);
    }

    // Place a block
    let sourcePosition = bot.entity.position.offset(0, -1.5, 0);
    let sourceBlock = bot.blockAt(sourcePosition);
    
    let faceVector = {x:0, y:1, z:0};

    await bot.placeBlock(sourceBlock, faceVector);

    // Stop jump
    bot.setControlState("jump", false);
}

bot.on("chat", (username, text)=>{
    if (username === bot.username) return;

    if (text === "down") digDown();
    else if (text === "gold") digGold();
    else if (text === "up") buildUp();
    else bot.chat("I don't understand.");
});