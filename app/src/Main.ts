import { Trigger } from './JassOverrides/Trigger';
import { Log, LogLevel } from './lib/Serilog/Serilog';
import { StringSink } from './lib/Serilog/Sinks/StringSink';
import { Game } from './Game/Game';
import { GameGlobals } from './Game/GameGlobals';
import { Hero } from './Game/Hero';
import { RandomNumberGenerator } from './Utility/RandomNumberGenerator';
import { RecipeSystem } from './Items/RecipeSystem';
import { GameOptionSystem } from './Game/GameOptionSystem';

ceres.addHook('main::after', () => {
    // tslint:disable-next-line:typedef
    const oldFourCC = FourCC;
    globalThis['FourCC'] = (id: string) => {
        const a: number = oldFourCC(id);
        return a;
    };
    Log.Init([new StringSink(LogLevel.Error, SendMessage)]);

    xpcall(
        () => {
            const gameGlobals: GameGlobals = new GameGlobals();
            const randomNumberGenerator: RandomNumberGenerator = new RandomNumberGenerator();

            BlzLoadTOCFile('war3mapImported\\Templates.toc');
            seedRandomNumberGenerator(randomNumberGenerator);
            spawnAllCreeps(gameGlobals);
            initializeHeroSelection(gameGlobals);
            createQuests();
            setPlayerCameras(gameGlobals);
            // tslint:disable-next-line: no-unused-expression
            new GameOptionSystem(gameGlobals, randomNumberGenerator);
            // tslint:disable-next-line: no-unused-expression
            new RecipeSystem(gameGlobals);
        },
        (err) => {
            Log.Fatal(err);
        },
    );
});

function seedRandomNumberGenerator(randomNumberGenerator: RandomNumberGenerator): void {
    const trig: Trigger = new Trigger();
    trig.addAction(() => randomNumberGenerator.setSeed(Number(BlzGetTriggerSyncData())));
    for (let i: number = 0; i < bj_MAX_PLAYERS; i++) {
        trig.registerPlayerSyncEvent(Player(i), 'randomseed', false);
    }

    if (GetLocalPlayer() === Player(0)) {
        BlzSendSyncData('randomseed', os.time().toString());
    }
}

function setPlayerCameras(gameGlobals: GameGlobals): void {
    SetCameraPosition(-14400.0, -10700.0);
    const heroSelectionArea: rect = Rect(-15616, -11904, -13184, -9472);
    BlzChangeMinimapTerrainTex('war3mapImported\\minimapLogo.blp');
    SetCameraBoundsToRect(heroSelectionArea);
    for (let i: number = 0; i < bj_MAX_PLAYERS; i++) {
        gameGlobals.SummonHawkInt[i] = 0;
        gameGlobals.ScrollOfTownPortal[i] = false;
        gameGlobals.Regenerate[i] = false;
        gameGlobals.SnowyOwl[i] = false;
        gameGlobals.ClockworkPenguin[i] = false;
        gameGlobals.AssassinsBlade[i] = false;
        gameGlobals.RazorBladesOn[i] = false;
        gameGlobals.DivineShieldLife[i] = 0;
        gameGlobals.PlayerLifesteal[i] = 0;
        gameGlobals.PlayerPhysicalBlock[i] = 0;
        gameGlobals.PlayerSpellBlock[i] = 0;
        FogModifierStart(CreateFogModifierRect(Player(i), FOG_OF_WAR_VISIBLE, heroSelectionArea, false, false));
        if (gameGlobals.PlayerSpawnRegion[i] !== undefined) {
            FogModifierStart(CreateFogModifierRect(Player(i), FOG_OF_WAR_VISIBLE, gameGlobals.PlayerSpawnRegion[i], true, false));
        }
        SetPlayerState(Player(i), PLAYER_STATE_RESOURCE_GOLD, 500);
    }
}

function spawnAllCreeps(gameGlobals: GameGlobals): void {
    for (let i: number = 0; i < gameGlobals.CreepUnitArraySize; i++) {
        SetUnitUserData(
            CreateUnit(
                Player(PLAYER_NEUTRAL_AGGRESSIVE),
                FourCC(gameGlobals.CreepUnitTypeID[i]),
                gameGlobals.CreepSpawnPoint[i].x,
                gameGlobals.CreepSpawnPoint[i].y,
                gameGlobals.CreepSpawnAngle[i],
            ),
            i,
        );
    }
}

function initializeHeroSelection(gameGlobals: GameGlobals): void {
    for (let i: number = 0; i < gameGlobals.HeroArraySize; i++) {
        gameGlobals.HeroList.push(
            new Hero(
                gameGlobals,
                Rect(
                    gameGlobals.HeroSelectRegions[i].minX,
                    gameGlobals.HeroSelectRegions[i].minY,
                    gameGlobals.HeroSelectRegions[i].maxX,
                    gameGlobals.HeroSelectRegions[i].maxY,
                ),
                FourCC(gameGlobals.HeroUnitTypeID[i]),
                gameGlobals.HeroSelectPoints[i].x,
                gameGlobals.HeroSelectPoints[i].y,
                gameGlobals.HeroSelectAngles[i],
            ),
        );
    }
}

function createQuests(): void {
    CreateQuestBJ(
        bj_QUESTTYPE_REQ_DISCOVERED,
        'Introduction',
        // tslint:disable-next-line: max-line-length
        `A new Warcraft III hero arena map |cFFCCCC00(by runi95)|r|n|n|cFF888800Win conditions|r|n|nDefeat the opposing team by killing their heroes until they run out of lives and can no longer respawn.|n|n|cFF888800Resources|r|n|nGain gold by slaying creeps found scattered all across the map. Higher level creeps tend to give more gold when defeated.|nGold can be spent at the various shops found in spawn and out on the battlefield.|nGold is also necessary when upgrading items through the recipe system.|n|n|cFF888800Recipe system|r|n|nThe recipe system is used when upgrading items to a stronger version of themselves.|nTo upgrade an item your hero HAS TO BE standing in spawn so you can click the recipe button icon which can be found right above your minimap.|nLeft clicking an item will show the recipe for that item like in the image above.|nRight clicking an item will filter the item list to only show item recipes where the clicked item is used.|nOnce your hero is holding all the required recipe items and you have enough gold to purchase the recipe you'll be able to click the upgrade button.`,
        'ReplaceableTextures\\CommandButtons\\BTNBlueQuestion.blp',
    );
    CreateQuestBJ(
        bj_QUESTTYPE_REQ_DISCOVERED,
        'Commands',
        // tslint:disable-next-line: max-line-length
        `There are currently no commands available`,
        'ReplaceableTextures\\CommandButtons\\BTNExclamation.blp',
    );
    CreateQuestBJ(
        bj_QUESTTYPE_REQ_DISCOVERED,
        'Bosses',
        // tslint:disable-next-line: max-line-length
        `Bosses are spawned when a hero steps inside a Circle of Power. The size of the circle indicates the strength of the boss.|nThe rewards for slaying a boss is always greater when defeating a harder boss spawned from a larger circle.`,
        'ReplaceableTextures\\CommandButtons\\BTNBossQuest.blp',
    );
    CreateQuestBJ(
        bj_QUESTTYPE_REQ_DISCOVERED,
        'Changelog',
        // tslint:disable-next-line: max-line-length
        `Changelogs will be released once the beta has started.`,
        'ReplaceableTextures\\CommandButtons\\BTNChangelog.blp',
    );
}

function SendMessage(this: void, msg: any): void {
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 10, `${msg}`);
}
