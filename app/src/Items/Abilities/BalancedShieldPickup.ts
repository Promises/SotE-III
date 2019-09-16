import { ItemPickup } from '../ItemPickup';
import { GameGlobals } from '../../Game/GameGlobals';

export class BalancedShieldPickup extends ItemPickup {
    protected readonly itemTypeId: number = FourCC('I028');
    private readonly gameGlobals: GameGlobals;

    constructor(gameGlobals: GameGlobals) {
        super();

        this.gameGlobals = gameGlobals;
    }

    protected action(): void {
        const playerId: number = GetPlayerId(GetOwningPlayer(GetTriggerUnit()));
        this.gameGlobals.PlayerSpellBlock[playerId] += 5;
        this.gameGlobals.PlayerPhysicalBlock[playerId] += 5;
    }
}
