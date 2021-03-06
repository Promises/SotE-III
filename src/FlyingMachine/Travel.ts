import { Trigger } from '../JassOverrides/Trigger';

export abstract class Travel {
    protected abstract readonly x: number;
    protected abstract readonly y: number;
    protected abstract readonly itemTypeId: number;
    protected readonly trig: Trigger = new Trigger();

    constructor() {
        this.trig.addCondition(() => this.condition());
        this.trig.addAction(() => this.action());
        this.trig.registerAnyUnitEventBJ(EVENT_PLAYER_UNIT_SELL_ITEM);
    }

    protected condition(): boolean {
        return GetItemTypeId(GetSoldItem()) === this.itemTypeId;
    }

    protected action(): void {
        SetUnitPosition(GetBuyingUnit(), this.x, this.y);
        SetCameraPositionForPlayer(GetOwningPlayer(GetBuyingUnit()), this.x, this.y);
    }
}
