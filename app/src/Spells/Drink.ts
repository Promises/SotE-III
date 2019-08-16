import { Spell } from './Spell';

export class Drink extends Spell {
    protected readonly abilityId: number = FourCC('A037');

    protected action(): void {
        SetUnitLifeBJ(GetTriggerUnit(), GetUnitStateSwap(UNIT_STATE_LIFE,
                                                         GetTriggerUnit()) + 2 * GetHeroInt(GetTriggerUnit(), true));
    }
}