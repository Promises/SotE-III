import { Spell } from './Spell';
import { TimerUtils } from '../Utility/TimerUtils';
import { Timer } from '../JassOverrides/Timer';

export class Doom extends Spell {
    protected abilityId: number = FourCC('A012');
    private timerUtils: TimerUtils;

    constructor(timerUtils: TimerUtils) {
        super();

        this.timerUtils = timerUtils;
    }

    protected action(): void {
        const x: number = GetUnitX(GetTriggerUnit());
        const y: number = GetUnitY(GetTriggerUnit());
        const damage: number = 200 + 5 * GetHeroStr(GetTriggerUnit(), true);

        UnitDamageTargetBJ(GetTriggerUnit(), GetTriggerUnit(), 200, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL);

        let ticks: number = 10;
        const t: Timer = this.timerUtils.NewTimer();
        t.start(0.75, true, () => {
            ticks--;

            const rngX: number = x + GetRandomReal(0, 1000) - 500.0;
            const rngY: number = y + GetRandomReal(0, 1000) - 500.0;
            const eff: effect = AddSpecialEffect('Units\\Demon\\Infernal\\InfernalBirth.mdl', rngX, rngY);

            const r: rect = Rect(rngX - 175.0, rngY - 175.0, rngX + 175.0, rngY + 175.0);
            const grp: group = GetUnitsInRectAll(r);

            ForGroup(grp, () => {
                if (IsPlayerEnemy(GetOwningPlayer(GetTriggerUnit()), GetOwningPlayer(GetEnumUnit()))) {
                    UnitDamageTargetBJ(GetTriggerUnit(), GetEnumUnit(),
                                       damage, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL);
                }
            });

            RemoveRect(r);
            DestroyGroup(grp);
            DestroyEffect(eff);

            if (ticks <= 0) {
                this.timerUtils.ReleaseTimer(t);
            }
        });
    }
}
