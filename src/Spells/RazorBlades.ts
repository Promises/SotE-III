import { TimerUtils } from '../Utility/TimerUtils';
import { Trigger } from '../JassOverrides/Trigger';
import { GameGlobals } from '../Game/GameGlobals';
import { Timer } from '../JassOverrides/Timer';
import { GroupInRange } from '../JassOverrides/GroupInRange';

export class RazorBlades {
    private readonly dummyUnitId: number = FourCC('n016');
    private readonly defenseSystemAbilityId: number = FourCC('A02A');
    private readonly gameGlobals: GameGlobals;
    private readonly timerUtils: TimerUtils;
    private readonly trig: Trigger = new Trigger();

    constructor(gameGlobals: GameGlobals, timerUtils: TimerUtils) {
        this.gameGlobals = gameGlobals;
        this.timerUtils = timerUtils;

        this.trig.addCondition(() => this.condition());
        this.trig.addAction(() => this.action());
        this.trig.registerAnyUnitEventBJ(EVENT_PLAYER_UNIT_ISSUED_ORDER);
    }

    private condition(): boolean {
        return GetIssuedOrderIdBJ() === String2OrderIdBJ('defend');
    }

    private action(): void {
        const mana: number = GetUnitState(GetTriggerUnit(), UNIT_STATE_MANA);
        let intelligence: number = GetHeroInt(GetTriggerUnit(), true);

        if (mana > intelligence / 2) {
            const trig: unit = GetTriggerUnit();
            SetUnitManaBJ(trig, GetUnitState(trig, UNIT_STATE_MANA) - intelligence / 2);
            const playerId: number = GetPlayerId(GetOwningPlayer(trig));
            const x: number = GetUnitX(trig);
            const y: number = GetUnitY(trig);
            let aoe: number = 50.0;
            const bladeOne: unit = CreateUnit(GetOwningPlayer(trig), this.dummyUnitId, x + 150.0 * CosBJ(0.0), y + 150.0 * SinBJ(0.0), 0);
            const bladeTwo: unit = CreateUnit(
                GetOwningPlayer(trig),
                this.dummyUnitId,
                x + 150.0 * CosBJ(180.0),
                y + 150.0 * SinBJ(180.0),
                0,
            );

            if (GetUnitAbilityLevel(trig, this.defenseSystemAbilityId) > 0) {
                aoe = 100.0;
                SetUnitScalePercent(bladeOne, 150, 150, 150);
                SetUnitScalePercent(bladeTwo, 150, 150, 150);
            }

            this.gameGlobals.RazorBladesOn[playerId] = true;

            let ticker: number = 0;
            let tickerOne: number = 0;
            let tickerTwo: number = 180;
            const t: Timer = this.timerUtils.newTimer();
            t.start(0.05, true, () => {
                SetUnitPosition(bladeOne, GetUnitX(trig) + 150.0 * CosBJ(tickerOne), GetUnitY(trig) + 150.0 * SinBJ(tickerOne));
                SetUnitPosition(bladeTwo, GetUnitX(trig) + 150.0 * CosBJ(tickerTwo), GetUnitY(trig) + 150.0 * SinBJ(tickerTwo));

                ticker++;
                tickerOne += 10;
                tickerTwo += 10;
                intelligence = GetHeroInt(trig, true);

                if (ticker % 3 === 0) {
                    this.dealBladeDamage(trig, bladeOne, aoe, intelligence / 2);
                    this.dealBladeDamage(trig, bladeTwo, aoe, intelligence / 2);
                }

                if (ticker > 9) {
                    ticker = 0;
                    SetUnitManaBJ(trig, GetUnitState(trig, UNIT_STATE_MANA) - intelligence / 2);
                    if (GetUnitState(trig, UNIT_STATE_MANA) === 0) {
                        this.gameGlobals.RazorBladesOn[playerId] = false;
                    }
                }

                if (tickerOne > 359) {
                    tickerOne = 0;
                }

                if (tickerTwo > 359) {
                    tickerTwo = 0;
                }

                if (!this.gameGlobals.RazorBladesOn[playerId]) {
                    IssueImmediateOrderBJ(trig, 'undefend');
                    RemoveUnit(bladeOne);
                    RemoveUnit(bladeTwo);
                    this.timerUtils.releaseTimer(t);
                }
            });
        } else {
            const txt: texttag = CreateTextTag();
            SetTextTagPos(txt, GetUnitX(GetTriggerUnit()), GetUnitY(GetTriggerUnit()), 1);
            SetTextTagColor(txt, 255, 0, 0, 255);
            SetTextTagPermanentBJ(txt, false);
            SetTextTagLifespanBJ(txt, 2.0);
            SetTextTagVelocityBJ(txt, 128, 90);
            SetTextTagTextBJ(txt, 'Insufficient mana', 10);
        }
    }

    private dealBladeDamage(trig: unit, blade: unit, aoe: number, damage: number): void {
        const loc: location = GetUnitLoc(blade);
        const grp: GroupInRange = new GroupInRange(aoe, loc);

        grp.for((u: unit) => {
            if (IsUnitEnemy(u, GetOwningPlayer(trig)) && UnitAlive(u)) {
                DestroyEffect(AddSpecialEffect('Abilities\\Spells\\Other\\Stampede\\StampedeMissileDeath.mdl', GetUnitX(u), GetUnitY(u)));
                UnitDamageTargetBJ(trig, u, damage, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL);
            }
        });

        RemoveLocation(loc);
        grp.destroy();
    }
}
